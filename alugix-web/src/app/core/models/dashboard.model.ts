export interface DashboardResumo {
  totalImoveis: number;
  imoveisDisponiveis: number;
  imoveisAlugados: number;
  imoveisManutencao: number;
  totalInquilinos: number;
  totalContratosAtivos: number;
  totalPagamentosAtrasados: number;
}

export interface DashboardReceita {
  mes: number;
  ano: number;
  receitaPrevista: number;
  receitaRealizada: number;
  pagamentosPagos: number;
  pagamentosPendentes: number;
  pagamentosAtrasados: number;
}

export interface PagamentoAtrasado {
  pagamentoId: number;
  contratoId: number;
  nomeInquilino: string;
  nomeImovel: string;
  mesReferencia: string;
  dataVencimento: string;
  valorAluguel: number;
  diasAtraso: number;
}

export interface DashboardInadimplencia {
  total: number;
  valorTotalAtrasado: number;
  pagamentos: PagamentoAtrasado[];
}

export interface ContratoVencendo {
  contratoId: number;
  nomeInquilino: string;
  nomeImovel: string;
  dataTermino: string;
  diasRestantes: number;
  valorAluguel: number;
}

export interface DashboardContratosVencer {
  total: number;
  contratos: ContratoVencendo[];
}