import React, { useState, useEffect } from "react";
import HTTP_STATUS from "http-status-codes";
import { Spin } from "antd";
import CorpoRelatorio from "./components/CorpoRelatorio";
import ModalCancelaSuspensao from "./components/ModalCancelaSuspensao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import Botao from "src/components/Shareable/Botao";
import ModalMarcarConferencia from "src/components/Shareable/ModalMarcarConferencia";
import RelatorioHistoricoJustificativaEscola from "src/components/Shareable/RelatorioHistoricoJustificativaEscola";
import { statusEnum } from "src/constants/shared";
import { TERCEIRIZADA } from "src/configs/constants";
import {
  usuarioEhEscolaTerceirizadaDiretor,
  usuarioEhEscolaTerceirizada,
} from "src/helpers/utilities";
import { getSuspensaoAlimentacaoCEI } from "src/services/suspensaoAlimentacaoCei.service";
import "./style.scss";

export default ({ ...props }) => {
  const [carregando, setCarregando] = useState(true);
  const [solicitacaoSuspensao, setSolicitacaoSuspensao] = useState(undefined);
  const [showModal, setShowModal] = useState(false);
  const [showModalMarcarConferencia, setShowModalMarcarConferencia] =
    useState(false);

  const { visao } = props;

  async function fetchData() {
    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");
    if (uuid) {
      await getSuspensaoAlimentacaoCEI(uuid).then((response) => {
        setSolicitacaoSuspensao(response.data);
      });
    }
    setCarregando(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  const loadSolicitacao = async (uuid) => {
    const response = await getSuspensaoAlimentacaoCEI(uuid);
    if (response.status === HTTP_STATUS.OK) {
      setSolicitacaoSuspensao(response.data);
    }
  };

  const EXIBIR_BOTAO_MARCAR_CONFERENCIA =
    visao === TERCEIRIZADA &&
    solicitacaoSuspensao &&
    [statusEnum.INFORMADO, statusEnum.ESCOLA_CANCELOU].includes(
      solicitacaoSuspensao.status
    );

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <span className="page-title">{`Suspensão de Alimentação - Solicitação # ${
        solicitacaoSuspensao ? solicitacaoSuspensao.id_externo : ""
      }`}</span>
      <div className="card mt-3 card-relatorio-suspensao ps-3 pe-3">
        <div className="card-body">
          {solicitacaoSuspensao && (
            <CorpoRelatorio solicitacaoSuspensao={solicitacaoSuspensao} />
          )}
          {solicitacaoSuspensao && (
            <RelatorioHistoricoJustificativaEscola
              solicitacao={solicitacaoSuspensao}
            />
          )}
          {solicitacaoSuspensao &&
            (usuarioEhEscolaTerceirizada() ||
              usuarioEhEscolaTerceirizadaDiretor()) &&
            solicitacaoSuspensao.status !== "ESCOLA_CANCELOU" && (
              <>
                {" "}
                <div className="row">
                  <div className="col-12 text-end">
                    <Botao
                      texto="Cancelar"
                      onClick={() => setShowModal(true)}
                      type={BUTTON_TYPE.BUTTON}
                      style={BUTTON_STYLE.GREEN_OUTLINE}
                    />
                  </div>
                </div>
                <ModalCancelaSuspensao
                  showModal={showModal}
                  closeModal={() => setShowModal(false)}
                  setSolicitacaoSuspensao={setSolicitacaoSuspensao}
                  uuid={solicitacaoSuspensao.uuid}
                />
              </>
            )}
          {EXIBIR_BOTAO_MARCAR_CONFERENCIA && (
            <div className="form-group float-end mt-4">
              {solicitacaoSuspensao.terceirizada_conferiu_gestao ? (
                <label className="ms-3 conferido">
                  <i className="fas fa-check me-2" />
                  Solicitação Conferida
                </label>
              ) : (
                <Botao
                  texto="Marcar Conferência"
                  type={BUTTON_TYPE.BUTTON}
                  style={BUTTON_STYLE.GREEN}
                  className="ms-3"
                  onClick={() => {
                    setShowModalMarcarConferencia(true);
                  }}
                />
              )}
              <ModalMarcarConferencia
                showModal={showModalMarcarConferencia}
                closeModal={() => setShowModalMarcarConferencia(false)}
                onMarcarConferencia={() => {
                  loadSolicitacao(solicitacaoSuspensao.uuid);
                }}
                uuid={solicitacaoSuspensao.uuid}
                endpoint={"suspensao-alimentacao-de-cei"}
              />
            </div>
          )}
        </div>
      </div>
    </Spin>
  );
};
