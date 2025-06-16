import React, { useState } from "react";
import HTTP_STATUS from "http-status-codes";
import { Spin } from "antd";
import Filtros from "./components/Filtros";
import ListagemGuias from "./components/ListagemGuias";
import { useEffect } from "react";
import { gerarParametrosConsulta } from "src/helpers/utilities";
import {
  criarNotificacao,
  editarNotificacao,
  getGuiaDetalhe,
  getGuiasNaoNotificadas,
} from "src/services/logistica.service";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import ModalDesvincular from "./components/ModalDesvincular";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { GUIAS_NOTIFICACAO, LOGISTICA } from "src/configs/constants";
import { useNavigate } from "react-router-dom";
import "./styles.scss";
import ModalDetalharGuia from "./components/ModalDetalharGuia";
import { Paginacao } from "src/components/Shareable/Paginacao";

export default () => {
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState(false);
  const [guias, setGuias] = useState();
  const [filtros, setFiltros] = useState();
  const [page, setPage] = useState();
  const [total, setTotal] = useState();
  const [modal, setModal] = useState(false);
  const [guiasVinculadas, setGuiasVinculadas] = useState([]);
  const [showVinculadas, setShowVinculadas] = useState(false);
  const [empresa, setEmpresa] = useState(null);
  const [guiaModal, setGuiaModal] = useState();
  const [notificacao, setNotificacao] = useState();

  useEffect(() => {
    if (filtros) {
      buscarGuias(1);
      setPage(1);
      if (filtros.empresa) {
        setEmpresa(filtros.empresa);
      }
    }
  }, [filtros]);

  const buscarGuias = async (page) => {
    setCarregando(true);

    if (!showVinculadas) {
      const params = {
        page: page,
        ...filtros,
      };
      if (notificacao) {
        params["notificacao_uuid"] = notificacao.uuid;
      }
      const response = await getGuiasNaoNotificadas(
        gerarParametrosConsulta(params)
      );
      if (response.data.count) {
        setGuias(response.data.results);
        setTotal(response.data.count);
      } else {
        setTotal(response.data.count);
        setGuias([]);
      }
    } else {
      setGuias(guiasVinculadas.slice((page - 1) * 10, page * 10));
      setTotal(guiasVinculadas.length);
    }

    setCarregando(false);
  };

  const nextPage = (page) => {
    buscarGuias(page);
    setPage(page);
  };

  const vincularGuia = (guia) => {
    setGuiasVinculadas([...guiasVinculadas, guia]);
    toastSuccess("Guia Vinculada com sucesso!");
  };

  const desvincularGuia = (guia) => {
    setGuiasVinculadas(
      guiasVinculadas.filter((g) => g.numero_guia !== guia.numero_guia)
    );
    toastSuccess("Guia desvinculada com sucesso!");
    setModal(false);
    setGuiaModal(false);
  };

  const buscarDetalheGuia = async (guia) => {
    let response;
    try {
      setCarregando(true);
      response = await getGuiaDetalhe(guia.uuid);
      setGuiaModal(response.data);
      setCarregando(false);
    } catch (e) {
      toastError(e.response.data.detail);
      setCarregando(false);
    }
  };

  const salvarNotificacao = async () => {
    const payload = {
      empresa,
      guias: guiasVinculadas.map((guia) => guia.uuid),
    };
    if (notificacao) {
      const response = await editarNotificacao(notificacao.uuid, payload);
      if (response.status === HTTP_STATUS.OK) {
        toastSuccess("Notificação atualizada com sucesso");
      }
    } else {
      const response = await criarNotificacao(payload);
      if (response.status === HTTP_STATUS.CREATED) {
        toastSuccess("Notificação criada com sucesso");
        navigate(`/${LOGISTICA}/${GUIAS_NOTIFICACAO}`);
      }
    }
  };

  const botaoAcao = (guia) => {
    if (guia && guiasVinculadas.find((g) => g.uuid === guia.uuid)) {
      return (
        <Botao
          texto="Excluir Vínculo"
          type={BUTTON_TYPE.BUTTON}
          style={BUTTON_STYLE.GREEN}
          className="ms-3"
          onClick={() => setModal(guia)}
        />
      );
    } else {
      return (
        <Botao
          texto="Vincular Guia"
          type={BUTTON_TYPE.BUTTON}
          style={BUTTON_STYLE.GREEN}
          className="ms-3"
          onClick={() => {
            setGuiaModal(false);
            vincularGuia(guia);
          }}
        />
      );
    }
  };

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <ModalDetalharGuia
        guia={guiaModal}
        handleClose={() => setGuiaModal(false)}
        botaoAcao={botaoAcao}
      />
      <ModalDesvincular
        guia={modal}
        handleClose={() => setModal(false)}
        handleSim={desvincularGuia}
      />
      <div className="card mt-3 card-guias-notificacoes">
        <div className="card-body guias-notificacoes">
          {notificacao && (
            <div className="title-editar-notificacoes pb-3">
              Notificação - <span>{notificacao.numero}</span>
            </div>
          )}
          <Filtros
            setFiltros={setFiltros}
            buscarGuias={buscarGuias}
            guias={guias}
            setGuias={setGuias}
            setGuiasVinculadas={setGuiasVinculadas}
            travaEmpresa={guiasVinculadas.length > 0}
            showVinculadas={showVinculadas}
            setShowVinculadas={setShowVinculadas}
            setNotificacaoIndex={setNotificacao}
          />
          {guias && (
            <>
              <ListagemGuias
                guias={guias}
                guiasVinculadas={guiasVinculadas}
                vincularGuia={vincularGuia}
                desvincularGuia={(guia) => {
                  setModal(guia);
                }}
                showVinculadas={showVinculadas}
                buscarDetalheGuia={buscarDetalheGuia}
              />
              <div className="row">
                <div className="col-12 pb-3">
                  <span className="green-dot me-1" />
                  {guiasVinculadas.length} Guia(s) já vinculada(s) a
                  notificação.
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <Paginacao
                    className="mt-3 mb-3"
                    current={page}
                    total={total}
                    showSizeChanger={false}
                    onChange={nextPage}
                    pageSize={10}
                  />
                </div>
              </div>
              {total === 0 && (
                <div className="text-center mt-5">
                  Nenhum resultado encontrado
                </div>
              )}
              {(!notificacao ||
                notificacao.status.toUpperCase() === "RASCUNHO") && (
                <div className="mt-4 mb-4">
                  <Botao
                    texto="Salvar Rascunho"
                    type={BUTTON_TYPE.BUTTON}
                    style={BUTTON_STYLE.GREEN}
                    className="float-end ms-3"
                    onClick={salvarNotificacao}
                    disabled={guiasVinculadas.length === 0}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Spin>
  );
};
