import {
  DiretoriaRegionalInterface,
  EscolaSimplissimaInterface,
  QuantidadeAlunosEscolaInterface,
  VinculoTipoAlimentacaoPorEscolaInterface,
} from "src/interfaces/escola.interface";
import {
  EscolasComPermissoesLancamentosEspeciaisInterface,
  PermissaoLancamentosEspeciaisInterface,
} from "src/interfaces/medicao_inicial.interface";
import {
  DocumentosRecebimento,
  DocumentosRecebimentoDashboard,
  DocumentosRecebimentoDetalhado,
  DocumentosRecebimentoParaAnalise,
  FichaTecnicaDetalhada,
  FichaTecnica,
  EtapaCalendario,
  FichaTecnicaDashboard,
  FichaTecnicaSimples,
  DadosCronogramaFichaTecnica,
  FichaTecnicaDetalhadaComAnalise,
} from "./pre_recebimento.interface";
import { InformacaoNutricional } from "./produto.interface";
import { LoteRascunhosInterface } from "./rascunhos.interface";
import { TerceirizadaInterface } from "./terceirizada.interface";
import { EditalContratoInterface } from "src/components/screens/Cadastros/EditaisContratosRefatorado/interfaces";
import { FichaRecebimento } from "./recebimento.interface";
import {
  EquipamentoInterface,
  InsumoInterface,
  MobiliarioInterface,
  PeriodoDeVisitaInterface,
  RelatorioVisitaItemListagem,
  ReparoEAdaptacaoInterface,
  TipoOcorrenciaInterface,
  UtensilioCozinhaInterface,
  UtensilioMesaInterface,
} from "./imr.interface";
import { FichaRecebimentoDetalhada } from "src/components/screens/Recebimento/FichaRecebimento/interfaces";

export interface ResponseInterface {
  data: Object;
  status: number;
}

export interface ResponseSemDadosInterface {
  status: number;
}

export interface ListagemPaginada<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ListagemNaoPaginada<T> {
  results: T[];
}

export interface ResponseVinculosTipoAlimentacaoPorEscolaInterface
  extends ResponseInterface {
  data: {
    count: number;
    next: string | null;
    previous: string | null;
    results: Array<VinculoTipoAlimentacaoPorEscolaInterface>;
  };
}

export interface ResponseQuantidadeAlunosEscolaInterface
  extends ResponseInterface {
  data: {
    count: number;
    next: string | null;
    previous: string | null;
    results: Array<QuantidadeAlunosEscolaInterface>;
  };
}

export interface ResponsePermissoesLancamentosEspeciaisInterface
  extends ResponseInterface {
  data: {
    count: number;
    next: string | null;
    page_size: string | null;
    previous: string | null;
    results: PermissaoLancamentosEspeciaisInterface[];
  };
}

export interface ResponseEscolasComPermissoesLancamentosEspeciaisInterface
  extends ResponseInterface {
  data: {
    results: EscolasComPermissoesLancamentosEspeciaisInterface[];
  };
}

export interface ResponseDocumentosRecebimento extends ResponseInterface {
  data: ListagemPaginada<DocumentosRecebimento>;
}

export interface ResponseDocumentosRecebimentoDetalhado
  extends ResponseInterface {
  data: DocumentosRecebimentoDetalhado;
}

export interface ResponseDocumentosRecebimentoDashboard
  extends ResponseInterface {
  data: {
    results: Array<{
      status: string;
      dados: Array<DocumentosRecebimentoDashboard>;
    }>;
  };
}

export interface ResponseDocumentosPorStatusDashboard
  extends ResponseInterface {
  data: {
    results: {
      status: string;
      dados: Array<DocumentosRecebimentoDashboard>;
      total: number;
    };
  };
}

export interface ResponseFichasTecnicasDashboard extends ResponseInterface {
  data: {
    results: Array<{
      status: string;
      dados: Array<FichaTecnicaDashboard>;
    }>;
  };
}

export interface ResponseFichasTecnicasPorStatusDashboard
  extends ResponseInterface {
  data: {
    results: {
      status: string;
      dados: Array<FichaTecnicaDashboard>;
      total: number;
    };
  };
}

export interface ResponseFichasTecnicasSimples extends ResponseInterface {
  data: ListagemNaoPaginada<FichaTecnicaSimples>;
}

export interface ResponseDadosCronogramaFichaTecnica extends ResponseInterface {
  data: DadosCronogramaFichaTecnica;
}

export interface ResponseDocumentosRecebimentoParaAnalise
  extends ResponseInterface {
  data: DocumentosRecebimentoParaAnalise;
}

export interface ResponseDownloadArquivoLaudoAssinado
  extends ResponseInterface {
  data: Blob;
}

export interface ResponseFichasTecnicas extends ResponseInterface {
  data: ListagemPaginada<FichaTecnica>;
}

export interface ResponseFichaTecnicaDetalhada extends ResponseInterface {
  data: FichaTecnicaDetalhada;
}

export interface ResponseFichaTecnicaDetalhadaComAnalise
  extends ResponseInterface {
  data: FichaTecnicaDetalhadaComAnalise;
}

export interface ResponseInformacoesNutricionais extends ResponseInterface {
  data: ListagemNaoPaginada<InformacaoNutricional>;
}

export interface ResponseCalendarioCronograma extends ResponseInterface {
  data: ListagemPaginada<EtapaCalendario>;
}

export interface ResponseLotesSimplesInterface extends ResponseInterface {
  data: {
    count: number;
    next: string | null;
    previous: string | null;
    results: Array<LoteRascunhosInterface>;
  };
}

export interface ResponseDiretoriasRegionaisSimplissimaInterface
  extends ResponseInterface {
  data: ListagemPaginada<DiretoriaRegionalInterface>;
}

export interface ResponseTerceirizadaListaNomesInterface
  extends ResponseInterface {
  data: {
    results: Array<TerceirizadaInterface>;
  };
}

export interface ResponseEditalCotratoInterface extends ResponseInterface {
  data: {
    count: number;
    next: string | null;
    previous: string | null;
    results: Array<EditalContratoInterface>;
  };
}

export interface ResponseGetEditalCotratoInterface extends ResponseInterface {
  data: EditalContratoInterface;
}

export interface ResponseFichaRecebimento extends ResponseInterface {
  data: FichaRecebimento;
}

export interface ResponseFichaRecebimentoDetalhada extends ResponseInterface {
  data: FichaRecebimentoDetalhada;
}

export interface ResponseGetEscolasTercTotalInterface
  extends ResponseInterface {
  data: Array<EscolaSimplissimaInterface>;
}

export interface ResponsePeriodosDeVisitaInterface extends ResponseInterface {
  data: ListagemNaoPaginada<PeriodoDeVisitaInterface>;
}

export interface ResponseFormularioSupervisaoTiposOcorrenciasInterface
  extends ResponseInterface {
  data: Array<TipoOcorrenciaInterface>;
}

export interface ResponseGetQuantidadeAlunosMatriculadosPorDataInterface
  extends ResponseInterface {
  data: number;
}

export interface ResponseUtensilioCozinhaInterface extends ResponseInterface {
  data: ListagemNaoPaginada<UtensilioCozinhaInterface>;
}

export interface ResponseUtensilioMesaInterface extends ResponseInterface {
  data: ListagemNaoPaginada<UtensilioMesaInterface>;
}

export interface ResponseEquipamentoInterface extends ResponseInterface {
  data: ListagemNaoPaginada<EquipamentoInterface>;
}

export interface ResponseMobiliarioInterface extends ResponseInterface {
  data: ListagemNaoPaginada<MobiliarioInterface>;
}

export interface ResponseReparoEAdaptacaoInterface extends ResponseInterface {
  data: ListagemNaoPaginada<ReparoEAdaptacaoInterface>;
}

export interface ResponseInsumoInterface extends ResponseInterface {
  data: ListagemNaoPaginada<InsumoInterface>;
}

export interface ResponseRelatoriosVisitas extends ResponseInterface {
  data: ListagemPaginada<RelatorioVisitaItemListagem>;
}

export interface ResponseNomesNutricionistas extends ResponseInterface {
  data: ListagemNaoPaginada<string>;
}

export interface ResponseExportarPDFAssincronoInterface
  extends ResponseInterface {
  data: {
    detail: string;
  };
}
