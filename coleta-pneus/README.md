# Coleta de Pneus — Manual (Windows)

Sistema que **mapeia borracharias e auto centers** de 14 cidades vizinhas de Volta Redonda, **chama pelo WhatsApp** imitando uma pessoa, organiza tudo num **painel** e monta as **rotas de coleta** (R$1,50 por pneu). Depois faz a **campanha de pneu remold**.

Tudo grátis e rodando no seu computador. Volta Redonda é só o ponto de saída das rotas (Av. Adalberto Barros Nunes, Retiro); não é prospectada.

---

## 1. Instalar (uma vez só)

1. Instale o **Node.js 24 LTS** em https://nodejs.org (botão "LTS", avance até o fim).
2. Baixe esta pasta `coleta-pneus` para o computador (ex.: `C:\coleta-pneus`).
3. Abra o **Prompt de Comando** nessa pasta (na barra de endereço do Explorador, digite `cmd` e Enter) e rode:

```
npm install
npx playwright install chromium
```

## 2. Configurar (uma vez só)

Abra `config\config.js` no Bloco de Notas e preencha:

- `empresa.nome` — nome que aparece nas mensagens.
- `empresa.lat` e `empresa.lng` — coordenadas do ponto de saída. No Google Maps, clique com o botão direito no local da Av. Adalberto Barros Nunes e copie os dois números.
- `numerosTeste` — 2 ou 3 números seus, no formato `5524999998888`.
- `ofertaRemold` — texto da oferta de remold (medidas, preço, entrega).
- `envio.inicioCampanha` — a data do primeiro envio real (`AAAA-MM-DD`).

Os textos das mensagens ficam em `config\mensagens.js` e podem ser editados.

## 3. Mapear as borracharias

Comece por uma cidade pequena para conferir:

```
npm run mapear -- --cidade "Quatis"
npm run exportar
```

Abra `dados\estabelecimentos.csv` no Excel e confira uns 10 nomes no Google Maps. Se estiver certo, rode todas as cidades (demora algumas horas; o navegador abre sozinho e trabalha devagar de propósito — não feche):

```
npm run mapear
npm run exportar
```

## 4. Testar o WhatsApp com os seus números

Use um **chip separado**, só para a coleta. No celular desse chip, abra o WhatsApp > **Aparelhos conectados** > **Conectar aparelho**.

```
npm run whatsapp -- --teste
```

Escaneie o QR code que aparece. Cada número de teste recebe uma mensagem. Responda **"sair"** de um deles: ele deve receber "Certo, não enviaremos mais mensagens" e aparecer como "Pediu para sair" no painel. Feche com `Ctrl+C`.

## 5. Ligar a campanha de coleta

```
npm run whatsapp
```

Deixe a janela aberta. O robô:

- confere quais telefones têm WhatsApp;
- só envia de segunda a sexta das 8h30 às 17h30 e sábado das 8h30 às 12h;
- começa com **20 mensagens por dia** e sobe 10 por semana até 60;
- espera de 3 a 9 minutos entre mensagens e mostra "digitando…";
- manda no máximo **1 lembrete**, 3 dias úteis depois, para quem não respondeu;
- quem responder "sair", "não quero", "pode parar" etc. nunca mais recebe;
- **pausa sozinho** se der 3 erros seguidos (sinal de problema no número).

## 6. Painel

Em outra janela do Prompt de Comando:

```
npm run painel
```

Abra **http://localhost:3000** no navegador.

- **Contatos:** funil por cidade, filtros e a lista. Clique no nome para abrir a ficha.
- **Ficha:** conversa, responder (o robô envia em até 30 segundos), mudar status, marcar "trabalha com remold" e **agendar coleta** (data e quantidade de pneus).
- **Rotas:** escolha a data (e as cidades, se quiser) e clique em **Gerar rota**. Sai a lista na ordem do caminho mais curto, o link do Google Maps (até 10 paradas por link) e o total a receber. Depois da coleta, na ficha, informe a quantidade real e clique em **Recolhido**.
- **Pausar envios:** botão vermelho no topo.

Quem não tem WhatsApp aparece no filtro "Sem WhatsApp" para ligar.

## 7. Campanha de remold (fase 2)

Depois das primeiras coletas:

```
npm run whatsapp -- --campanha remold
```

Só recebe quem aceitou ou já fez coleta, e nunca quem pediu para sair. Mesmas regras de horário e limite.

## Cuidados

- O WhatsApp usado aqui **não é o oficial**: existe risco de bloqueio do número. Por isso o chip separado, os limites e a personalização. Não aumente os limites no começo.
- O mapeamento usa o Google Maps de forma automatizada, o que vai contra os termos do Google; o volume é pequeno, mas o risco existe.
- Os dados ficam só no seu computador, na pasta `dados\`. Faça cópia dela de vez em quando.

## Para quem for mexer no código

```
npm test
```

Roda os testes da lógica (telefone, repetidos, horários, opt-out, fila, rotas, painel).
