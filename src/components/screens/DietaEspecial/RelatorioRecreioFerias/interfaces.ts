interface IAluno {
  uuid: string;
  nome: string;
  codigo_eol: string;
}

interface IEscola {
  nome: string;
  uuid: string;
}

interface IEscolaDestino extends IEscola {}

interface IAlergiaIntolerancia {
  id: number;
  descricao: string;
}

interface IClassificacao {
  id: number;
  descricao: string;
  nome: string;
}

export interface IRelatorioDietaRecreioFerias {
  id: number;
  uuid: string;
  aluno: IAluno;
  escola: IEscola;
  escola_destino: IEscolaDestino;
  alergias_intolerancias: IAlergiaIntolerancia[];
  classificacao: IClassificacao;
  data_inicio: string;
  data_termino: string;
  collapsed?: boolean;
}
