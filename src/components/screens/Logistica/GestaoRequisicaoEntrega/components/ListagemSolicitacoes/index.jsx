import React, { useContext, useState } from "react";
import { Button } from "react-bootstrap";

import "./styles.scss";
import { Spin } from "antd";
import Confirmar from "../Confirmar";
import Alterar from "../Alterar";
import ListagemGuias from "../ListagemGuias";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import { gerarParametrosConsulta } from "src/helpers/utilities";
import { gerarExcelSolicitacoes } from "src/services/logistica.service";
import { CentralDeDownloadContext } from "src/context/CentralDeDownloads";

const ListagemSolicitacoes = ({
  solicitacoes,
  ativos,
  setAtivos,
  updatePage,
  confirmaCancelamentoGuias,
  imprimirRequisicao,
  setShowDownload,
}) => {
  const [carregando, setCarregando] = useState(false);
  const centralDownloadContext = useContext(CentralDeDownloadContext);

  const baixarPDF = async (solicitacao) => {
    setCarregando(true);
    await imprimirRequisicao(solicitacao.uuid);
    setCarregando(false);
  };

  const baixarExcel = (solicitacao) => {
    setCarregando(true);
    const params = gerarParametrosConsulta({
      numero_requisicao: solicitacao.numero_solicitacao,
    });
    gerarExcelSolicitacoes(params)
      .then(() => {
        setCarregando(false);
        setShowDownload(true);
        centralDownloadContext.getQtdeDownloadsNaoLidas();
      })
      .catch((error) => {
        error.response.data.text().then((text) => toastError(text));
        setCarregando(false);
      });
  };

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <section className="resultado-busca-requisicao-entrega">
        <header>Requisições Disponibilizadas</header>
        <article>
          <div className="grid-table header-table">
            <div>
              N° da Requisição <br />
              de Entrega
            </div>
            <div>
              Quantidade de <br />
              Guias de Remessa
            </div>
            <div>Status</div>
            <div>Data de Entrega</div>
            <div>Ações</div>
            <div>Exportar Relatório</div>
            <div>Exportar Requisição</div>
            <div />
          </div>
          {solicitacoes.map((solicitacao) => {
            const bordas =
              ativos && ativos.includes(solicitacao.uuid)
                ? "desativar-borda"
                : "";
            const icone =
              ativos && ativos.includes(solicitacao.uuid) ? "minus" : "plus";
            return (
              <>
                <div className="grid-table body-table">
                  <div className={`${bordas}`}>
                    {solicitacao.numero_solicitacao}
                  </div>
                  <div className={`${bordas}`}>
                    {solicitacao.guias.length}{" "}
                    {solicitacao.guias.length === 1 ? "guia" : "guias"}
                  </div>
                  <div className={`${bordas}`}>
                    {solicitacao.status === "Enviada"
                      ? "Recebida"
                      : solicitacao.status}
                  </div>
                  <div className={`${bordas}`}>
                    {solicitacao.guias[0].data_entrega}
                  </div>
                  <div>
                    <Confirmar
                      className="acoes confirmar"
                      solicitacao={solicitacao}
                      updatePage={updatePage}
                    />
                    <span className="pe-3 ps-3">|</span>
                    <Alterar
                      className="acoes alterar"
                      solicitacao={solicitacao}
                      updatePage={updatePage}
                    />
                  </div>
                  <div className={`${bordas}`}>
                    <Button
                      className="acoes"
                      variant="link"
                      onClick={() => baixarExcel(solicitacao)}
                    >
                      <i className="fas fa-file-excel green" />
                      <span className="link-exportar">Planilha</span>
                    </Button>
                  </div>
                  <div className={`${bordas}`}>
                    <Button
                      className="acoes"
                      variant="link"
                      onClick={() => baixarPDF(solicitacao)}
                    >
                      <i className="fas fa-file-pdf red" />
                      <span className="link-exportar">PDF</span>
                    </Button>
                  </div>
                  <div>
                    <i
                      className={`fas fa-${icone}`}
                      onClick={() => {
                        ativos && ativos.includes(solicitacao.uuid)
                          ? setAtivos(
                              ativos.filter((el) => el !== solicitacao.uuid)
                            )
                          : setAtivos(
                              ativos
                                ? [...ativos, solicitacao.uuid]
                                : [solicitacao.uuid]
                            );
                      }}
                    />
                  </div>
                </div>
                {ativos && ativos.includes(solicitacao.uuid) && (
                  <>
                    <ListagemGuias
                      solicitacao={solicitacao}
                      confirmaCancelamentoGuias={confirmaCancelamentoGuias}
                    />
                  </>
                )}
              </>
            );
          })}
        </article>
      </section>
    </Spin>
  );
};

export default ListagemSolicitacoes;
