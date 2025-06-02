import { MeusDadosContext } from "src/context/MeusDadosContext";
import React, { useContext, useState } from "react";
import { getSolicitacoesDetalhadas } from "src/services/relatorios.service";
import HTTP_STATUS from "http-status-codes";
import { Spin } from "antd";
import { deepCopy } from "src/helpers/utilities";
import { Filtros } from "./componentes/Filtros";
import { TabelaResultado } from "./componentes/TabelaResultado";
import { Paginacao } from "src/components/Shareable/Paginacao";
import "./style.scss";
import { STATUS_SOLICITACOES } from "./constants";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_ICON,
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import ModalSolicitacaoDownload from "src/components/Shareable/ModalSolicitacaoDownload";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import { Graficos } from "./componentes/Graficos";

export const RelatorioSolicitacoesAlimentacao = ({ ...props }) => {
  const { endpoint, endpointGerarExcel, endpointGerarPDF } = props;
  const { meusDados } = useContext(MeusDadosContext);

  const [erroAPI, setErroAPI] = useState("");
  const [solicitacoes, setSolicitacoes] = useState(undefined);
  const [resultadoPaginado, setResultadoPaginado] = useState(undefined);
  const [totalBusca, setTotalBusca] = useState(undefined);
  const [page, setPage] = useState(1);
  const [filtros, setFiltros] = useState(undefined);
  const [carregando, setCarregando] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [exibirModalCentralDownloads, setExibirModalCentralDownloads] =
    useState(false);
  const [totalizadores, setTotalizadores] = useState(undefined);
  const [renderGraficosOuTabela, setRenderGraficosOuTabela] =
    useState("Gráficos");

  const getSolicitacoesDetalhadasAsync = async (solicitacoes) => {
    const payloadSolicitacoesDetalhadas = solicitacoes.map((solicitacao) => {
      return JSON.stringify({
        tipo_doc: solicitacao.tipo_doc,
        uuid: solicitacao.uuid,
      });
    });
    const response = await getSolicitacoesDetalhadas({
      "solicitacoes[]": payloadSolicitacoesDetalhadas,
    });
    if (response.status === HTTP_STATUS.OK) {
      setSolicitacoes(response.data.data);
    } else {
      toastError(
        "Houve um erro ao filtrar solicitações, tente novamente mais tarde"
      );
    }
  };

  const onPageChanged = async (page, values) => {
    setCarregando(true);
    let _values = deepCopy(values);
    _values["limit"] = 10;
    _values["offset"] = (page - 1) * _values["limit"];
    setPage(page);

    const response = await endpoint(_values);
    if (response.status === HTTP_STATUS.OK) {
      setResultadoPaginado(response.data.results);
      setTotalBusca(response.data.count);
      await getSolicitacoesDetalhadasAsync(response.data.results);
    } else {
      toastError(
        "Houve um erro ao trocar de página, tente novamente mais tarde"
      );
    }
    setCarregando(false);
  };

  const exportarPDF = async () => {
    setSubmitting(true);
    const response = await endpointGerarPDF(filtros);
    if (response.status === HTTP_STATUS.OK) {
      setExibirModalCentralDownloads(true);
    } else {
      toastError("Erro ao exportar pdf. Tente novamente mais tarde.");
    }
    setSubmitting(false);
  };

  const exportarXLSX = async () => {
    setSubmitting(true);
    const response = await endpointGerarExcel(filtros);
    if (response.status === HTTP_STATUS.OK) {
      setExibirModalCentralDownloads(true);
    } else {
      toastError("Erro ao exportar xlsx. Tente novamente mais tarde.");
    }
    setSubmitting(false);
  };

  return (
    <div className="card relatorio-solicitacoes-alimentacao mt-3">
      <div className="card-body">
        {erroAPI && <div>{erroAPI}</div>}
        {meusDados && (
          <Filtros
            erroAPI={erroAPI}
            setErroAPI={setErroAPI}
            meusDados={meusDados}
            setSolicitacoes={setSolicitacoes}
            setTotalBusca={setTotalBusca}
            setPage={setPage}
            setFiltros={setFiltros}
            endpoint={(values) => endpoint(values)}
            getSolicitacoesDetalhadasAsync={getSolicitacoesDetalhadasAsync}
            setCarregando={setCarregando}
            setResultadoPaginado={setResultadoPaginado}
            setTotalizadores={setTotalizadores}
            setRenderGraficosOuTabela={setRenderGraficosOuTabela}
          />
        )}
        <Spin tip="Carregando..." spinning={carregando}>
          {totalBusca !== undefined &&
            filtros !== undefined &&
            totalizadores && (
              <>
                <div className="row mt-3">
                  <div className="col-8">
                    <p className="quantitativo">
                      TOTAL DE SOLICITAÇÕES{" "}
                      <b>
                        {STATUS_SOLICITACOES.find(
                          (obj) => obj.uuid === filtros.status
                        ).nome.toUpperCase()}
                      </b>{" "}
                      - ATÉ {new Date().toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  {filtros.status === "AUTORIZADOS" && (
                    <div className="col-4 text-end">
                      <Botao
                        texto={renderGraficosOuTabela}
                        type={BUTTON_TYPE.BUTTON}
                        style={BUTTON_STYLE.GREEN_OUTLINE}
                        icon={
                          renderGraficosOuTabela === "Gráficos"
                            ? BUTTON_ICON.CHART_BAR
                            : BUTTON_ICON.TABLE
                        }
                        onClick={() =>
                          setRenderGraficosOuTabela(
                            renderGraficosOuTabela === "Tabela"
                              ? "Gráficos"
                              : "Tabela"
                          )
                        }
                      />
                    </div>
                  )}
                </div>
                <div className="row">
                  {totalizadores.map((totalizador, key) => {
                    return (
                      <div key={key} className="col-4 mt-3">
                        <div className="totalizador ps-3 pe-3">
                          <div className="d-flex justify-content-between">
                            <div className="titulo">
                              {Object.keys(totalizador)[0]}
                            </div>
                            <div className="valor">
                              {Object.values(totalizador)[0]}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

          {solicitacoes &&
            filtros &&
            !carregando &&
            renderGraficosOuTabela === "Gráficos" && (
              <TabelaResultado
                solicitacoes={solicitacoes}
                filtros={filtros}
                resultadoPaginado={resultadoPaginado}
              />
            )}

          {solicitacoes &&
            solicitacoes.length > 0 &&
            filtros &&
            renderGraficosOuTabela === "Gráficos" && (
              <>
                <Paginacao
                  onChange={(page) => onPageChanged(page, filtros)}
                  total={totalBusca}
                  pageSize={10}
                  current={page}
                />
                <div className="row">
                  <div className="col-12 text-end">
                    <Botao
                      texto="Baixar PDF"
                      style={BUTTON_STYLE.GREEN_OUTLINE}
                      icon={BUTTON_ICON.FILE_PDF}
                      type={BUTTON_TYPE.BUTTON}
                      disabled={submitting}
                      onClick={() => exportarPDF()}
                    />
                    <Botao
                      texto="Baixar Excel"
                      style={BUTTON_STYLE.GREEN_OUTLINE}
                      icon={BUTTON_ICON.FILE_EXCEL}
                      type={BUTTON_TYPE.BUTTON}
                      disabled={submitting}
                      onClick={() => exportarXLSX()}
                      className="ms-3"
                    />
                    {exibirModalCentralDownloads && (
                      <ModalSolicitacaoDownload
                        show={exibirModalCentralDownloads}
                        setShow={setExibirModalCentralDownloads}
                      />
                    )}
                  </div>
                </div>
              </>
            )}
          {solicitacoes &&
            filtros &&
            !carregando &&
            renderGraficosOuTabela === "Tabela" && (
              <Graficos values={filtros} />
            )}
        </Spin>
      </div>
    </div>
  );
};
