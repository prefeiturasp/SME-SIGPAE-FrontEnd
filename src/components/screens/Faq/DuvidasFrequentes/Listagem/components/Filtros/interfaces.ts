export interface OpcaoFiltro {
  nome: string;
  uuid: string;
}

export interface ValoresFiltrosDuvidasFrequentes {
  categoria?: string;
  perfil?: string[] | "todos";
  titulo?: string;
}

export interface FiltrosDuvidasFrequentesProps {
  aoFiltrar?: (_valores: ValoresFiltrosDuvidasFrequentes) => void;
  aoLimpar?: () => void;
}
