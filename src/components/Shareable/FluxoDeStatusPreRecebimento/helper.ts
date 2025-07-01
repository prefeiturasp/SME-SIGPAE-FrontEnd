import { LogSolicitacoesUsuarioSimples } from "src/interfaces/dados_comuns.interface";

export const tipoDeStatusClasse = (status: LogSolicitacoesUsuarioSimples) => {
  /* caso especial para adicionar item ao final da linha do tempo de
  Solicitação Alteração de Cronograma (história 104395) */
  if (status.criado_em === "") return "pending";

  switch (status.status_evento_explicacao) {
    case "Cronograma Criado":
    case "Assinado e Enviado ao Fornecedor":
    case "Assinado Fornecedor":
    case "Assinado Abastecimento":
    case "Assinado CODAE":
    case "Em Análise":
    case "Cronograma Ciente":
    case "Aprovado Abastecimento":
    case "Aprovado DILOG":
    case "Aprovado CODAE":
    case "Alteração enviada ao fornecedor":
    case "Fornecedor Ciente":
    case "Enviado para Análise":
    case "Aprovado":
      return "active";

    case "Solicitada Alteração":
    case "Alteração CODAE":
    case "Enviado para Correção":
    case "Solicitado Correção":
      return "questioned";

    case "Reprovado DILOG":
    case "Reprovado Abastecimento":
    case "Reprovado CODAE":
      return "disapproved";

    default:
      return "pending";
  }
};
