// Uso: npm run exportar  ->  dados/estabelecimentos.csv (abre direto no Excel)
import { writeFileSync } from 'node:fs';
import { abrirBanco, listarEstabelecimentos } from './db.js';

const COLUNAS = ['id', 'cidade', 'nome', 'endereco', 'telefone', 'tipo_telefone', 'tem_whatsapp', 'status', 'trabalha_remold', 'nota', 'avaliacoes', 'fonte', 'link_maps'];

export function paraCsv(linhas) {
  const celula = (v) => {
    const s = v == null ? '' : String(v);
    return /[;"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return '\uFEFF' + [COLUNAS.join(';'), ...linhas.map((l) => COLUNAS.map((c) => celula(l[c])).join(';'))].join('\n');
}

if (process.argv[1]?.endsWith('exportar.js')) {
  const linhas = listarEstabelecimentos(abrirBanco());
  writeFileSync('dados/estabelecimentos.csv', paraCsv(linhas));
  console.log(`${linhas.length} estabelecimentos exportados para dados/estabelecimentos.csv`);
}
