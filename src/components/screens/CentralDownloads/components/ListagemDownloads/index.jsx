import React from "react";

import "./styles.scss";
import { Checkbox, Tooltip } from "antd";
import { STATUS_DOWNLOAD } from "src/constants/shared";
import { baixarArquivoCentral } from "src/services/downloads.service";
import moment from "moment";

const ListagemDownloads = ({
  downloads,
  deletaDownload,
  marcarVisto,
  atualizar,
}) => {
  const retornaIconeStatus = (status) => {
    switch (status) {
      case STATUS_DOWNLOAD.CONCLUIDO:
        return "fas fa-check-circle verde";
      case STATUS_DOWNLOAD.EM_PROCESSAMENTO:
        return "fas fa-spinner";
      case STATUS_DOWNLOAD.ERRO:
        return "fas fa-times-circle vermelho";
      default:
        return "fas fa-check-circle verde";
    }
  };

  const baixarArquivo = async (download) => {
    await baixarArquivoCentral(download);
  };

  const verificaDataDownload = (download) => {
    const dataDownload = moment(download.data_criacao, "DD/MM/YYYY [ás] HH:mm");
    return moment().diff(dataDownload, "hours") < 96;
  };

  const retornaTextoTooltipDownload = (download) => {
    if (
      !verificaDataDownload(download) &&
      download.status === STATUS_DOWNLOAD.CONCLUIDO
    )
      return "O prazo para download expirou. Solicite novamente.";
    else return "Download";
  };

  const retornaTextoTooltipIcone = (download) => {
    if (download.status === STATUS_DOWNLOAD.ERRO)
      return "Houve erro no download. Favor solicitar novamente.";
    else if (download.status === STATUS_DOWNLOAD.CONCLUIDO)
      return "O download ficará disponível por 96 horas desde sua geração.";
    else return "";
  };

  return (
    <section className="tabela-downloads">
      <article>
        <div className="grid-table header-table">
          <div>Identificador</div>
          <div>Status</div>
          <div>Data de Criação</div>
          <div>Visto</div>
          <div>Opções</div>
        </div>
        {downloads.map((download, index) => {
          return (
            <>
              <div className="grid-table body-table">
                <div>{download.identificador}</div>

                <Tooltip title={retornaTextoTooltipIcone(download)}>
                  <div className="flex-container center">
                    <i className={retornaIconeStatus(download.status)} />
                    <p className="fw-normal ms-2">
                      {download.status === "Em processamento"
                        ? "Aguarde, Processando..."
                        : download.status}
                    </p>
                  </div>
                </Tooltip>

                <div>
                  {download.status === STATUS_DOWNLOAD.EM_PROCESSAMENTO
                    ? "----"
                    : download.data_criacao}
                </div>
                <div className="flex-container">
                  {download.status === STATUS_DOWNLOAD.EM_PROCESSAMENTO ? (
                    "----"
                  ) : (
                    <Checkbox
                      checked={download.visto}
                      onChange={() => {
                        marcarVisto(download, index);
                      }}
                      data-testid={`checkbox-visto-${index}`}
                    />
                  )}
                </div>
                <div className="flex-container">
                  {download.status !== STATUS_DOWNLOAD.EM_PROCESSAMENTO && (
                    <>
                      <Tooltip title={retornaTextoTooltipDownload(download)}>
                        <button
                          disabled={
                            download.status !== STATUS_DOWNLOAD.CONCLUIDO ||
                            !verificaDataDownload(download)
                          }
                          onClick={() => baixarArquivo(download)}
                          className="verde"
                          data-testid={`botao-download-${index}`}
                        >
                          <i className="fas fa-download" />
                        </button>
                      </Tooltip>
                      <Tooltip title="Excluir">
                        <button
                          onClick={() => deletaDownload(download)}
                          className="vermelho"
                          data-testid={`botao-deleta-${index}`}
                        >
                          <i className="fas fa-trash-alt" />
                        </button>
                      </Tooltip>
                    </>
                  )}
                  {download.status === STATUS_DOWNLOAD.EM_PROCESSAMENTO && (
                    <button onClick={() => atualizar()}>
                      <i className="fas fa-sync-alt" /> Atualizar
                    </button>
                  )}
                </div>
              </div>
            </>
          );
        })}
      </article>
    </section>
  );
};

export default ListagemDownloads;
