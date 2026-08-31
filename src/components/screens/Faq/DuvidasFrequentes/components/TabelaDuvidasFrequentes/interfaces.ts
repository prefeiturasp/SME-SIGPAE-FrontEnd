export interface CategoriaDuvidaFrequente {
  nome: string;
}

export interface PerfilDuvidaFrequente {
  nome?: string;
}

export interface DuvidaFrequenteApi {
  categoria: CategoriaDuvidaFrequente | string;
  pergunta: string;
  perfis?: Array<PerfilDuvidaFrequente | string>;
  todos_os_perfis?: boolean;
  uuid: string;
}

export interface LinhaDuvidaFrequente {
  categoria: string;
  perfis: string;
  titulo: string;
  uuid: string;
}
