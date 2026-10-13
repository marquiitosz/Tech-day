import { Transacao } from '../../domain/financeiro/Transacao';

export class ExportarCsvFinanceiroUseCase {
  public executar(transacoes: Transacao[]): void {
    if (transacoes.length === 0) {
      throw new Error('Nenhuma transação disponível para exportar.');
    }

    const cabecalho = 'ID;Data;Categoria;Descricao;Tipo;Valor (R$);Status\r\n';
    const linhas = transacoes.map((t) => {
      const valorFormatado = t.valor.emReais().toFixed(2).replace('.', ',');
      return `"${t.id}";"${t.data}";"${t.categoria}";"${t.descricao}";"${t.tipo}";"${valorFormatado}";"${t.status}"`;
    });

    const conteudoCsv = '\uFEFF' + cabecalho + linhas.join('\r\n');
    const blob = new Blob([conteudoCsv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio-financeiro-empreendafacil-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
