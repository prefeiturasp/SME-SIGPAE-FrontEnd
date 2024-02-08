export interface ContratoInterface {
  uuid: string;
  numero: string;
  edital?: {
    uuid: string;
    numero: string;
  };
}

export interface ResponseContratosVigentesInterface {
  results: ContratoInterface[];
}

export interface EmpenhoInterface {
  numero: string;
  contrato: string;
  edital: string;
  tipo_empenho: string;
  tipo_reajuste?: string;
  status: string;
  valor_total: number;
}

export interface ResponseEmpenhosInterface {
  next: string | null;
  previous: string | null;
  count: number;
  page_size: number;
  results: EmpenhoInterface[];
}

export interface FiltrosInterface {
  numero?: string;
  contrato?: string;
  edital?: string;
}
