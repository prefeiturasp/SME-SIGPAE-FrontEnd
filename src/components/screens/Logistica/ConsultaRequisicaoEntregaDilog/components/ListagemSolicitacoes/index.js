import React, { useState, useEffect, useContext } from "react";
import { Button } from "react-bootstrap";
import "antd/dist/antd.css";
import "./styles.scss";
import { Checkbox } from "antd";
import {
  gerarExcelSolicitacoes,
  imprimirGuiasDaSolicitacao
} from "services/logistica.service.js";
import ListagemGuias from "../ListagemGuias";
import { Spin } from "antd";
import { toastError } from "components/Shareable/Toast/dialogs";
import { CentralDeDownloadContext } from "context/CentralDeDownloads";
import ModalSolicitacaoDownload from "components/Shareable/ModalSolicitacaoDownload";
import { gerarParametrosConsulta } from "helpers/utilities";

export default ({
  solicitacoes,
  ativos,
  setAtivos,
  selecionados,
  setSelecionados,
  arquivaDesarquivaGuias
}) => {
  const [allChecked, setAllChecked] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [show, setShow] = useState(false);
  const centralDownloadContext = useContext(CentralDeDownloadContext);

  const baixarPDFGuiasRemessa = solicitacao => {
    setCarregando(true);
    let uuid = solicitacao.uuid;
    imprimirGuiasDaSolicitacao(uuid)
      .then(() => {
        setCarregando(false);
        setShow(true);
        centralDownloadContext.getQtdeDownloadsNaoLidas();
      })
      .catch(error => {
        error.response.data.text().then(text => toastError(text));
        setCarregando(false);
      });
  };

  const baixarExcelGuiasRemessa = solicitacao => {
    setCarregando(true);
    const params = gerarParametrosConsulta({
      numero_requisicao: solicitacao.numero_solicitacao
    });
    gerarExcelSolicitacoes(params)
      .then(() => {
        setCarregando(false);
      })
      .catch(error => {
        error.response.data.text().then(text => toastError(text));
        setCarregando(false);
      });
  };

  const checkSolicitacao = solicitacao => {
    let newSelecionados = [...selecionados];
    if (solicitacao.checked) {
      solicitacao.checked = false;
      const index = newSelecionados.indexOf(solicitacao);
      if (index > -1) {
        newSelecionados.splice(index, 1);
      }
      setAllChecked(false);
    } else {
      solicitacao.checked = true;
      newSelecionados.push(solicitacao);
      if (newSelecionados.length === solicitacoes.length) setAllChecked(true);
    }
    setSelecionados(newSelecionados);
  };

  const checkAll = () => {
    let newSelecionados = [];
    solicitacoes.map(solicitacao => {
      solicitacao.checked = !allChecked;
      if (!allChecked) newSelecionados.push(solicitacao);
    });
    setAllChecked(!allChecked);
    setSelecionados(newSelecionados);
  };

  useEffect(() => {
    setAllChecked(false);
    setSelecionados([]);
  }, [solicitacoes]);

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <ModalSolicitacaoDownload show={show} setShow={setShow} />
      <section className="resultado-busca-requisicao-entrega-dilog">
        <header>Veja requisições disponibilizadas</header>
        <article>
          <div className="grid-table header-table">
            <div>
              <Checkbox checked={allChecked} onChange={() => checkAll()} />
            </div>
            <div>N° da Requisição de Entrega</div>
            <div>Qtde. de Guias Remessa</div>
            <div>Distribuidor</div>
            <div>Status</div>
            <div>Data de entrega</div>
            <div>Exportar relatório</div>
            <div>Exportar guia</div>
            <div />
          </div>
          {solicitacoes.map(solicitacao => {
            const bordas =
              ativos && ativos.includes(solicitacao.uuid)
                ? "desativar-borda"
                : "";
            const icone =
              ativos && ativos.includes(solicitacao.uuid)
                ? "angle-up"
                : "angle-down";
            return (
              <>
                <div className="grid-table body-table">
                  <div>
                    <Checkbox
                      checked={solicitacao.checked}
                      onChange={() => checkSolicitacao(solicitacao)}
                    />
                  </div>
                  <div className={`${bordas}`}>
                    {solicitacao.numero_solicitacao}
                  </div>
                  <div className={`${bordas}`}>
                    {solicitacao.guias.length}{" "}
                    {solicitacao.guias.length === 1 ? "guia" : "guias"}
                  </div>
                  <div className={`${bordas}`}>
                    {solicitacao.distribuidor_nome}
                  </div>
                  <div className={`${bordas}`}>{solicitacao.status}</div>
                  <div className={`${bordas}`}>
                    {solicitacao.guias[0].data_entrega}
                  </div>

                  <div>
                    <Button
                      className="acoes"
                      variant="link"
                      onClick={() => baixarExcelGuiasRemessa(solicitacao)}
                    >
                      <i className="fas fa-file-excel green" />
                      <span className="link-exportar">XLSX</span>
                    </Button>
                  </div>

                  <div>
                    <Button
                      className="acoes"
                      variant="link"
                      onClick={() => baixarPDFGuiasRemessa(solicitacao)}
                    >
                      <i className="fas fa-file-pdf red" />
                      <span className="link-exportar">PDF</span>
                    </Button>
                  </div>

                  <div>
                    <i
                      className={`fas fa-${icone} expand`}
                      onClick={() => {
                        ativos && ativos.includes(solicitacao.uuid)
                          ? setAtivos(
                              ativos.filter(el => el !== solicitacao.uuid)
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
                      arquivaDesarquivaGuias={arquivaDesarquivaGuias}
                      solicitacao={solicitacao}
                      situacao={"ATIVA"}
                    />
                    <ListagemGuias
                      arquivaDesarquivaGuias={arquivaDesarquivaGuias}
                      solicitacao={solicitacao}
                      situacao={"ARQUIVADA"}
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
