import HTTP_STATUS from "http-status-codes";
import { useState } from "react";

import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_ICON,
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import ModalSolicitacaoDownload from "src/components/Shareable/ModalSolicitacaoDownload";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import {
  solicitarDownloadImagensHistoricoReclamacaoProduto,
  solicitarDownloadPdfHistoricoReclamacaoProduto,
} from "src/services/historicoReclamacaoProduto.service";

interface ArquivosDisponiveis {
  possui_pdf: boolean;
  quantidade_imagens: number;
}

interface LogHistorico {
  uuid: string;
  arquivos_disponiveis?: ArquivosDisponiveis;
}

interface AcoesDownloadHistoricoReclamacaoProps {
  uuidReclamacao: string;
  logSelecionado: LogHistorico;
}

type TipoDownload = "pdf" | "imagens" | null;

const AcoesDownloadHistoricoReclamacao = ({
  uuidReclamacao,
  logSelecionado,
}: AcoesDownloadHistoricoReclamacaoProps) => {
  const [tipoDownload, setTipoDownload] = useState<TipoDownload>(null);
  const [exibirModalCentralDownloads, setExibirModalCentralDownloads] =
    useState(false);

  const arquivosDisponiveis = logSelecionado.arquivos_disponiveis;

  if (!arquivosDisponiveis) {
    return null;
  }

  const possuiPdf = arquivosDisponiveis.possui_pdf;
  const possuiImagens = arquivosDisponiveis.quantidade_imagens > 0;

  if (!possuiPdf && !possuiImagens) {
    return null;
  }

  const respostaValida = (status: number) =>
    status === HTTP_STATUS.ACCEPTED || status === HTTP_STATUS.OK;

  const solicitarDownloadPdf = async () => {
    try {
      setTipoDownload("pdf");

      const resposta = await solicitarDownloadPdfHistoricoReclamacaoProduto(
        uuidReclamacao,
        logSelecionado.uuid,
      );

      if (!respostaValida(resposta.status)) {
        throw new Error();
      }

      setExibirModalCentralDownloads(true);
    } catch {
      toastError("Erro ao solicitar o download do PDF.");
    } finally {
      setTipoDownload(null);
    }
  };

  const solicitarDownloadImagens = async () => {
    try {
      setTipoDownload("imagens");

      const resposta = await solicitarDownloadImagensHistoricoReclamacaoProduto(
        uuidReclamacao,
        logSelecionado.uuid,
      );

      if (!respostaValida(resposta.status)) {
        throw new Error();
      }

      setExibirModalCentralDownloads(true);
    } catch {
      toastError("Erro ao solicitar o download das imagens.");
    } finally {
      setTipoDownload(null);
    }
  };

  return (
    <>
      <div
        className="d-flex flex-column flex-sm-row"
        style={{ columnGap: "5rem" }}
      >
        {possuiPdf && (
          <Botao
            type={BUTTON_TYPE.BUTTON}
            texto="Download PDF"
            style={BUTTON_STYLE.GREEN}
            disabled={tipoDownload !== null}
            onClick={solicitarDownloadPdf}
            dataTestId="download-pdf-historico-reclamacao"
            icon={BUTTON_ICON.FILE_PDF}
          />
        )}

        {possuiImagens && (
          <Botao
            type={BUTTON_TYPE.BUTTON}
            texto="Download das imagens"
            style={BUTTON_STYLE.GREEN}
            disabled={tipoDownload !== null}
            onClick={solicitarDownloadImagens}
            dataTestId="download-imagens-historico-reclamacao"
          />
        )}
      </div>

      {exibirModalCentralDownloads && (
        <ModalSolicitacaoDownload
          show={exibirModalCentralDownloads}
          setShow={setExibirModalCentralDownloads}
          callbackClose={undefined}
        />
      )}
    </>
  );
};

export default AcoesDownloadHistoricoReclamacao;
