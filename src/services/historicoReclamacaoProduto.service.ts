import axios from "./_base";

export const solicitarDownloadPdfHistoricoReclamacaoProduto = (
  uuidReclamacao: string,
  uuidLog: string,
) =>
  axios.post(
    `/reclamacoes-produtos/${uuidReclamacao}/historico/${uuidLog}/download-pdf/`,
  );

export const solicitarDownloadImagensHistoricoReclamacaoProduto = (
  uuidReclamacao: string,
  uuidLog: string,
) =>
  axios.post(
    `/reclamacoes-produtos/${uuidReclamacao}/historico/${uuidLog}/download-imagens/`,
  );
