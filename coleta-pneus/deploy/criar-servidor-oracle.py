#!/usr/bin/env python3
"""Cria o servidor da Coleta de Pneus na Oracle Cloud pela API, sem clicar em nada.

Lê a chave de acesso das variáveis geradas por deploy/chave-oracle.sh:
  OCI_USER, OCI_TENANCY, OCI_REGION, OCI_FINGERPRINT, OCI_KEY (base64), OCI_SSH_PUBKEY
e os dados da empresa (opcionais, vão para o .env do servidor):
  EMPRESA_NOME, DONO_WHATSAPP, MOTORISTA_WHATSAPP, OFERTA_REMOLD, INICIO_CAMPANHA

Cria (ou reaproveita) rede, sub-rede, portas 22/80/443 e a instância; na primeira
inicialização o servidor roda deploy/instalar.sh sozinho (cloud-init).

Uso:  pip install oci && python3 deploy/criar-servidor-oracle.py [--verificar]
"""
import base64
import os
import shlex
import sys
import time

import oci

NOME = 'coleta-pneus'
BRANCH = 'feat/coleta-pneus'
INSTALADOR = f'https://raw.githubusercontent.com/matheusmagah-cpu/us-marketplace-affiliate-lab/{BRANCH}/coleta-pneus/deploy/instalar.sh'
# Tenta do melhor para o mais simples; todos dentro do Always Free.
FORMATOS = [
    ('VM.Standard.A1.Flex', 2, 12),
    ('VM.Standard.A1.Flex', 1, 6),
    ('VM.Standard.E2.1.Micro', None, None),
]
CAMPOS_ENV = ['EMPRESA_NOME', 'DONO_WHATSAPP', 'MOTORISTA_WHATSAPP', 'OFERTA_REMOLD', 'INICIO_CAMPANHA']


def configuracao():
    faltando = [k for k in ['OCI_USER', 'OCI_TENANCY', 'OCI_REGION', 'OCI_FINGERPRINT', 'OCI_KEY', 'OCI_SSH_PUBKEY'] if not os.environ.get(k)]
    if faltando:
        sys.exit(f'Faltam variáveis: {", ".join(faltando)} (rode deploy/chave-oracle.sh no Cloud Shell)')
    chave = base64.b64decode(os.environ['OCI_KEY']).decode()
    cfg = {
        'user': os.environ['OCI_USER'], 'tenancy': os.environ['OCI_TENANCY'], 'region': os.environ['OCI_REGION'],
        'fingerprint': os.environ['OCI_FINGERPRINT'], 'key_content': chave,
    }
    oci.config.validate_config(cfg)
    return cfg


def esperar(cliente_get, ident, estado, minutos=10):
    fim = time.time() + minutos * 60
    while time.time() < fim:
        atual = cliente_get(ident).data
        if atual.lifecycle_state == estado:
            return atual
        time.sleep(5)
    raise TimeoutError(f'{ident} não chegou a {estado}')


def rede(cfg, compartimento):
    net = oci.core.VirtualNetworkClient(cfg)
    vcns = [v for v in net.list_vcns(compartimento).data if v.display_name == f'{NOME}-vcn' and v.lifecycle_state == 'AVAILABLE']
    if vcns:
        vcn = vcns[0]
    else:
        vcn = net.create_vcn(oci.core.models.CreateVcnDetails(
            compartment_id=compartimento, cidr_blocks=['10.0.0.0/16'], display_name=f'{NOME}-vcn', dns_label='coleta')).data
        vcn = esperar(net.get_vcn, vcn.id, 'AVAILABLE')
    print(f'Rede: {vcn.display_name}')

    igws = [g for g in net.list_internet_gateways(compartimento, vcn_id=vcn.id).data if g.lifecycle_state == 'AVAILABLE']
    igw = igws[0] if igws else esperar(net.get_internet_gateway, net.create_internet_gateway(oci.core.models.CreateInternetGatewayDetails(
        compartment_id=compartimento, vcn_id=vcn.id, is_enabled=True, display_name=f'{NOME}-igw')).data.id, 'AVAILABLE')

    rotas = net.get_route_table(vcn.default_route_table_id).data
    if not any(r.destination == '0.0.0.0/0' for r in rotas.route_rules):
        net.update_route_table(rotas.id, oci.core.models.UpdateRouteTableDetails(route_rules=rotas.route_rules + [
            oci.core.models.RouteRule(destination='0.0.0.0/0', destination_type='CIDR_BLOCK', network_entity_id=igw.id)]))

    seg = net.get_security_list(vcn.default_security_list_id).data
    abertas = {r.tcp_options.destination_port_range.min for r in seg.ingress_rules
               if r.protocol == '6' and r.source == '0.0.0.0/0' and r.tcp_options and r.tcp_options.destination_port_range}
    novas = [oci.core.models.IngressSecurityRule(
        protocol='6', source='0.0.0.0/0', description=f'coleta {p}',
        tcp_options=oci.core.models.TcpOptions(destination_port_range=oci.core.models.PortRange(min=p, max=p)))
        for p in (22, 80, 443) if p not in abertas]
    if novas:
        net.update_security_list(seg.id, oci.core.models.UpdateSecurityListDetails(ingress_rules=seg.ingress_rules + novas))
    print('Portas 22, 80 e 443 liberadas')

    subs = [s for s in net.list_subnets(compartimento, vcn_id=vcn.id).data if s.lifecycle_state == 'AVAILABLE']
    sub = subs[0] if subs else esperar(net.get_subnet, net.create_subnet(oci.core.models.CreateSubnetDetails(
        compartment_id=compartimento, vcn_id=vcn.id, cidr_block='10.0.0.0/24', display_name=f'{NOME}-subnet',
        dns_label='publica', prohibit_public_ip_on_vnic=False)).data.id, 'AVAILABLE')
    return sub


def imagem(computo, compartimento, formato):
    imgs = computo.list_images(compartimento, operating_system='Canonical Ubuntu', operating_system_version='24.04',
                               shape=formato, sort_by='TIMECREATED', sort_order='DESC').data
    imgs = [i for i in imgs if 'Minimal' not in i.display_name]
    if not imgs:
        raise RuntimeError(f'Sem imagem Ubuntu 24.04 para {formato}')
    return imgs[0]


def script_inicial():
    linhas = ''.join(
        f"sed -i '/^{k}=/d' .env; printf '%s=%s\\n' {k} {shlex.quote(os.environ[k])} >> .env\n"
        for k in CAMPOS_ENV if os.environ.get(k))
    return f"""#!/bin/bash
# Primeira inicialização: instala a Coleta de Pneus (log em /var/log/coleta-instalacao.log)
exec >> /var/log/coleta-instalacao.log 2>&1
sudo -u ubuntu -H bash -lc 'cd ~ && curl -fsSL {INSTALADOR} -o instalar.sh && bash instalar.sh'
cd /opt/coleta/coleta-pneus && sudo -u ubuntu bash -c {shlex.quote(linhas + 'chmod 600 .env')}
echo "INSTALACAO_CONCLUIDA $(date)"
"""


def criar_instancia(cfg, compartimento, sub):
    computo = oci.core.ComputeClient(cfg)
    existentes = [i for i in computo.list_instances(compartimento).data
                  if i.display_name == NOME and i.lifecycle_state not in ('TERMINATED', 'TERMINATING')]
    if existentes:
        print('Servidor já existia; reaproveitando.')
        return computo, existentes[0]
    ads = [a.name for a in oci.identity.IdentityClient(cfg).list_availability_domains(compartimento).data]
    dados = base64.b64encode(script_inicial().encode()).decode()
    ultimo = None
    for formato, ocpus, memoria in FORMATOS:
        img = imagem(computo, compartimento, formato)
        for ad in ads:
            try:
                detalhes = oci.core.models.LaunchInstanceDetails(
                    compartment_id=compartimento, availability_domain=ad, display_name=NOME, shape=formato,
                    shape_config=oci.core.models.LaunchInstanceShapeConfigDetails(ocpus=ocpus, memory_in_gbs=memoria) if ocpus else None,
                    source_details=oci.core.models.InstanceSourceViaImageDetails(image_id=img.id, boot_volume_size_in_gbs=50),
                    create_vnic_details=oci.core.models.CreateVnicDetails(subnet_id=sub.id, assign_public_ip=True),
                    metadata={'ssh_authorized_keys': os.environ['OCI_SSH_PUBKEY'], 'user_data': dados})
                inst = computo.launch_instance(detalhes).data
                print(f'Criando servidor {formato} ({ocpus or 1} OCPU) em {ad}...')
                return computo, inst
            except oci.exceptions.ServiceError as e:
                ultimo = e
                print(f'  {formato} em {ad}: {e.code} — {e.message[:120]}')
    raise RuntimeError(f'Nenhum formato grátis disponível agora (último erro: {ultimo.message if ultimo else "?"}). Tente mais tarde.')


def ip_publico(cfg, compartimento, inst):
    net = oci.core.VirtualNetworkClient(cfg)
    for anexo in oci.core.ComputeClient(cfg).list_vnic_attachments(compartimento, instance_id=inst.id).data:
        vnic = net.get_vnic(anexo.vnic_id).data
        if vnic.public_ip:
            return vnic.public_ip
    return None


def main():
    cfg = configuracao()
    compartimento = cfg['tenancy']
    regioes = oci.identity.IdentityClient(cfg).list_region_subscriptions(compartimento).data
    print('Acesso à Oracle OK. Regiões:', ', '.join(r.region_name for r in regioes))
    if '--verificar' in sys.argv:
        return
    sub = rede(cfg, compartimento)
    computo, inst = criar_instancia(cfg, compartimento, sub)
    inst = esperar(computo.get_instance, inst.id, 'RUNNING', minutos=15)
    ip = ip_publico(cfg, compartimento, inst)
    print(f'\nServidor ligado. IP: {ip}')
    print(f'Painel (em ~15 min, quando a instalação terminar): https://{ip.replace(".", "-")}.sslip.io' if ip else 'Sem IP público?')
    print('Acompanhar a instalação no Cloud Shell:  ssh ubuntu@IP "tail -f /var/log/coleta-instalacao.log"')


if __name__ == '__main__':
    main()
