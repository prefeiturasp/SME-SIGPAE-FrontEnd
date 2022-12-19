import MeusDadosContext from "context/MeusDadosContext";
import React, { useContext, useState } from "react";
import { getSolicitacoesDetalhadas } from "services/relatorios.service";
import HTTP_STATUS from "http-status-codes";
import { Spin } from "antd";
import { deepCopy } from "helpers/utilities";
import { Filtros } from "./componentes/Filtros";
import { TabelaResultado } from "./componentes/TabelaResultado";
import { Paginacao } from "components/Shareable/Paginacao";
import "./style.scss";
import { STATUS_SOLICITACOES } from "./constants";
import Botao from "components/Shareable/Botao";
import {
  BUTTON_ICON,
  BUTTON_STYLE,
  BUTTON_TYPE
} from "components/Shareable/Botao/constants";
import ModalSolicitacaoDownload from "components/Shareable/ModalSolicitacaoDownload";
import { toastError } from "components/Shareable/Toast/dialogs";

export const RelatorioSolicitacoesAlimentacao = ({ ...props }) => {
  const { endpoint, endpointGerarExcel } = props;
  const { meusDados } = useContext(MeusDadosContext);

  const [erroAPI, setErroAPI] = useState("");
  const [solicitacoes, setSolicitacoes] = useState(undefined);
  const [resultadoPaginado, setResultadoPaginado] = useState(undefined);
  const [totalBusca, setTotalBusca] = useState(undefined);
  const [page, setPage] = useState(1);
  const [filtros, setFiltros] = useState(undefined);
  const [carregando, setCarregando] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [
    exibirModalCentralDownloads,
    setExibirModalCentralDownloads
  ] = useState(false);

  const getSolicitacoesDetalhadasAsync = async solicitacoes => {
    const payloadSolicitacoesDetalhadas = solicitacoes.map(solicitacao => {
      return {
        tipo_doc: solicitacao.tipo_doc,
        uuid: solicitacao.uuid
      };
    });
    const response = await getSolicitacoesDetalhadas({
      solicitacoes: payloadSolicitacoesDetalhadas
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
            endpoint={endpoint}
            getSolicitacoesDetalhadasAsync={getSolicitacoesDetalhadasAsync}
            setCarregando={setCarregando}
            setResultadoPaginado={setResultadoPaginado}
          />
        )}
        <Spin tip="Carregando..." spinning={carregando}>
          {totalBusca !== undefined && filtros !== undefined && (
            <div className="row">
              <div className="col-12 mt-3">
                <p className="quantitativo">
                  QUANTITATIVO GERAL DE SOLICITAÇÕES{" "}
                  {STATUS_SOLICITACOES.find(
                    obj => obj.uuid === filtros.status
                  ).nome.toUpperCase()}
                </p>
              </div>
              <div className="col-12 mt-1">
                <p className="totalHomologadosValor">
                  Total de solicitações: <b>{totalBusca}</b>
                </p>
              </div>
            </div>
          )}
          {solicitacoes && filtros && !carregando && (
            <TabelaResultado
              solicitacoes={solicitacoes}
              filtros={filtros}
              resultadoPaginado={resultadoPaginado}
            />
          )}
          {solicitacoes && solicitacoes.length && filtros ? (
            <>
              <Paginacao
                onChange={page => onPageChanged(page, filtros)}
                total={totalBusca}
                pageSize={10}
                current={page}
              />
              <div className="row">
                <div className="col-12 text-right">
                  <Botao
                    texto="Baixar Excel"
                    style={BUTTON_STYLE.GREEN_OUTLINE}
                    icon={BUTTON_ICON.FILE_EXCEL}
                    type={BUTTON_TYPE.BUTTON}
                    disabled={submitting}
                    onClick={() => exportarXLSX()}
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
          ) : (
            <></>
          )}
        </Spin>
      </div>
    </div>
  );
};
