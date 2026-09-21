export interface Lancamento {
  id?: number;
  nomeLancamento: string;
  valorLancamento: number;
  tipoLancamento: number; // 0 = Receita, 1 = Despesa
  dataLancamento?: string;
}

export interface LancamentoPorPeriodoReturn {
  lancamentos: Lancamento[];
  saldoPeriodo: number;
}
