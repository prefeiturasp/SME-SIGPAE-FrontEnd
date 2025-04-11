import { FichaTecnicaSimples } from "./pre_recebimento.interface";
import {
  ListagemNaoPaginada,
  ListagemPaginada,
  ResponseInterface,
} from "./responses.interface";

export interface QuestaoConferencia {
  uuid: string;
  questao: string;
  tipo_questao: string[];
  pergunta_obrigatoria: boolean;
  posicao?: number;
}

export interface QuestaoConferenciaSimples {
  uuid: string;
  questao: string;
}

export interface QuestoesPorProduto {
  uuid: string;
  numero_ficha: string;
  nome_produto: string;
  questoes_primarias: string[];
  questoes_secundarias: string[];
}

export interface QuestoesPorProdutoSimples {
  uuid: string;
  ficha_tecnica: FichaTecnicaSimples;
  questoes_primarias: string[];
  questoes_secundarias: string[];
}

export interface QuestoesPorProdutoDetalhe {
  uuid: string;
  questoes_primarias: QuestaoConferenciaSimples[];
  questoes_secundarias: QuestaoConferenciaSimples[];
}

export interface ResponseListarQuestoesConferencia extends ResponseInterface {
  data: {
    results: {
      primarias: QuestaoConferencia[];
      secundarias: QuestaoConferencia[];
    };
  };
}

export interface ResponseListarQuestoesConferenciaSimples
  extends ResponseInterface {
  data: ListagemNaoPaginada<QuestaoConferencia>;
}

export interface ResponseListarQuestoesPorProduto extends ResponseInterface {
  data: ListagemPaginada<QuestoesPorProduto>;
}

export interface ResponseDetalharQuestoesPorProduto extends ResponseInterface {
  data: QuestoesPorProdutoSimples;
}

export interface ResponseDetalharQuestoesPorCronograma
  extends ResponseInterface {
  data: QuestoesPorProdutoDetalhe;
}

export interface PayloadAtribuirQuestoesPorProduto {
  ficha_tecnica: string;
  questoes_primarias: string[];
  questoes_secundarias: string[];
}

export interface PayloadEditarAtribuicaoQuestoesPorProduto {
  questoes_primarias: string[];
  questoes_secundarias: string[];
}

export interface ResponseAtribuirQuestoesPorProduto extends ResponseInterface {
  data: {
    results: {
      ficha_tecnica: string;
      questoes_primarias: string[];
      questoes_secundarias: string[];
    };
  };
}

export interface FiltrosQuestoesPorProduto {
  ficha_tecnica: string;
  questao: string;
}

export interface FichaRecebimento {
  alterado_em: string;
  criado_em: string;
  data_entrega: string;
  etapa: string;
  uuid: string;
}
