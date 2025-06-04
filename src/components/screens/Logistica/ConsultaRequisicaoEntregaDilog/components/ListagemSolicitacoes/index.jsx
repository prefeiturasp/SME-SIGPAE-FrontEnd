import React, { useState, useEffect, useContext } from "react";
import { Button } from "react-bootstrap";

import "./styles.scss";
import { Checkbox } from "antd";
import {
  gerarExcelSolicitacoes,
  imprimirGuiasDaSolicitacao,
} from "src/services/logistica.service";
import ListagemGuias from "../ListagemGuias";
import { Spin } from "antd";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import { CentralDeDownloadContext } from "src/context/CentralDeDownloads";
import { gerarParametrosConsulta } from "src/helpers/utilities";

export default ({
  solicitacoes,
  ativos,
  setAtivos,
  selecionados,
  setSelecionados,
  arquivaDesarquivaGuias,
  setShowDownload,
  somenteLeitura,
}) => {
  const [allChecked, setAllChecked] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const centralDownloadContext = useContext(CentralDeDownloadContext);

  const baixarPDFGuiasRemessa = (solicitacao) => {
    setCarregando(true);
    let uuid = solicitacao.uuid;
    imprimirGuiasDaSolicitacao(uuid)
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

  const baixarExcelGuiasRemessa = (solicitacao) => {
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

  const checkSolicitacao = (solicitacao) => {
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
    solicitacoes.forEach((solicitacao) => {
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
      <section className="resultado-busca-requisicao-entrega-dilog">
        <header>Requisições Disponibilizadas</header>
        <article>
          <div className="grid-table header-table">
            <div>
              <Checkbox checked={allChecked} onChange={() => checkAll()} />
            </div>
            <div>
              N° da Requisição <br />
              de Entrega
            </div>
            <div>
              Quantidade de <br />
              Guias de Remessa
            </div>
            <div>Distribuidor</div>
            <div>Status</div>
            <div>Data de Entrega</div>
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
                      <span className="link-exportar">Planilha</span>
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
                      arquivaDesarquivaGuias={arquivaDesarquivaGuias}
                      solicitacao={solicitacao}
                      situacao={"ATIVA"}
                      somenteLeitura={somenteLeitura}
                    />
                    <ListagemGuias
                      arquivaDesarquivaGuias={arquivaDesarquivaGuias}
                      solicitacao={solicitacao}
                      situacao={"ARQUIVADA"}
                      somenteLeitura={somenteLeitura}
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
