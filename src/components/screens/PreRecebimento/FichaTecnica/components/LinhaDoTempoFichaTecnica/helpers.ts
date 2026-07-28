import { LogFichaTecnica } from "src/interfaces/pre_recebimento.interface";

const STATUS_FICHA_TECNICA = {
  CADASTRADA: "Ficha Técnica cadastrada",
  ENVIADA_PARA_ANALISE: "Ficha Técnica enviada para análise",
  ENVIADA_PARA_CORRECAO: "Ficha Técnica enviada para correção",
  APROVADA: "Ficha Técnica aprovada",
} as const;

export type TipoEtapaFichaTecnica = "concluida" | "alerta";

export interface EtapaLinhaDoTempoFichaTecnica {
  titulo: string;
  criadoEm: string;
  nomeUsuario: string;
  tipo: TipoEtapaFichaTecnica;
}

export const montarLinhaDoTempoFichaTecnica = (
  logs: LogFichaTecnica[] = [],
): EtapaLinhaDoTempoFichaTecnica[] => {
  let aguardandoCorrecaoRealizada = false;

  return logs.map((log) => {
    const dadosDaEtapa = {
      criadoEm: log.criado_em,
      nomeUsuario: log.usuario?.nome || "-",
    };

    switch (log.status_evento_explicacao) {
      case STATUS_FICHA_TECNICA.CADASTRADA:
        return {
          ...dadosDaEtapa,
          titulo: "Ficha Técnica Cadastrada",
          tipo: "concluida",
        };

      case STATUS_FICHA_TECNICA.ENVIADA_PARA_CORRECAO:
        aguardandoCorrecaoRealizada = true;

        return {
          ...dadosDaEtapa,
          titulo: "Correção Solicitada",
          tipo: "alerta",
        };

      case STATUS_FICHA_TECNICA.ENVIADA_PARA_ANALISE:
        if (aguardandoCorrecaoRealizada) {
          aguardandoCorrecaoRealizada = false;

          return {
            ...dadosDaEtapa,
            titulo: "Correção Realizada",
            tipo: "concluida",
          };
        }

        return {
          ...dadosDaEtapa,
          titulo: "Envio da Ficha Técnica",
          tipo: "concluida",
        };

      case STATUS_FICHA_TECNICA.APROVADA:
        aguardandoCorrecaoRealizada = false;

        return {
          ...dadosDaEtapa,
          titulo: "Ficha Técnica Aprovada",
          tipo: "concluida",
        };

      default:
        return {
          ...dadosDaEtapa,
          titulo: log.status_evento_explicacao,
          tipo: "concluida",
        };
    }
  });
};
