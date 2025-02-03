import React, { Component } from "react";
import HTTP_STATUS from "http-status-codes";
import { Navigate } from "react-router-dom";
import { reduxForm } from "redux-form";
import { toastError, toastSuccess } from "components/Shareable/Toast/dialogs";
import { CorpoRelatorio } from "./componentes/CorpoRelatorio";
import ModalMarcarConferencia from "components/Shareable/ModalMarcarConferencia";
import RelatorioHistoricoJustificativaEscola from "components/Shareable/RelatorioHistoricoJustificativaEscola";
import { ModalCancelaSuspensao } from "../components/ModalCancelaSuspensao";
import { Botao } from "components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "components/Shareable/Botao/constants";
import { SUSPENSAO_ALIMENTACAO, TERCEIRIZADA } from "configs/constants";
import { statusEnum, TIPO_PERFIL } from "constants/shared";
import {
  getError,
  usuarioEhEscolaTerceirizadaDiretor,
  usuarioEhEscolaTerceirizada,
} from "helpers/utilities";
import {
  getSuspensaoDeAlimentacaoUUID,
  terceirizadaTomaCienciaSuspensaoDeAlimentacao,
} from "services/suspensaoDeAlimentacao.service";
import "./style.scss";

class RelatorioSuspensaoAlimentacao extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uuid: null,
      suspensaoAlimentacao: null,
      dadosEscola: null,
      redirect: false,
      showModalMarcarConferencia: false,
      showModalEscolaCancela: false,
    };
    this.loadSolicitacao = this.loadSolicitacao.bind(this);
    this.closeModalMarcarConferencia =
      this.closeModalMarcarConferencia.bind(this);
  }

  setRedirect() {
    this.setState({
      redirect: true,
    });
  }

  renderizarRedirecionamentoParaSuspensoesDeAlimentacao = () => {
    if (this.state.redirect) {
      return <Navigate to={`/${TERCEIRIZADA}/${SUSPENSAO_ALIMENTACAO}`} />;
    }
  };

  componentDidMount() {
    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");
    if (uuid) {
      getSuspensaoDeAlimentacaoUUID(uuid).then((response) => {
        if (response.status === HTTP_STATUS.OK) {
          let suspensaoAlimentacao = response.data;
          let dadosEscola = suspensaoAlimentacao.escola;
          this.setState({
            suspensaoAlimentacao,
            dadosEscola,
            uuid,
          });
        } else if (response.data.detail) {
          this.setState({ erro: true });
          toastError(
            `Erro ao carregar relatório de Suspensão de Alimentação ${getError(
              response.data
            )}`
          );
        } else {
          this.setState({ erro: true });
          toastError("Erro ao carregar relatório de Suspensão de Alimentação");
        }
      });
    }
  }

  showModalMarcarConferencia() {
    this.setState({ showModalMarcarConferencia: true });
  }

  closeModalMarcarConferencia() {
    this.setState({ showModalMarcarConferencia: false });
  }

  loadSolicitacao(uuid) {
    getSuspensaoDeAlimentacaoUUID(uuid).then((response) => {
      if (response.status === HTTP_STATUS.OK) {
        let suspensaoAlimentacao = response.data;
        let dadosEscola = suspensaoAlimentacao.escola;
        this.setState({
          suspensaoAlimentacao,
          dadosEscola,
          uuid,
        });
      } else if (response.data.detail) {
        this.setState({ erro: true });
        toastError(
          `Erro ao carregar relatório de Suspensão de Alimentação ${getError(
            response.data
          )}`
        );
      } else {
        this.setState({ erro: true });
        toastError("Erro ao carregar relatório de Suspensão de Alimentação");
      }
    });
  }

  handleSubmit() {
    const uuid = this.state.uuid;
    terceirizadaTomaCienciaSuspensaoDeAlimentacao(uuid).then(
      (response) => {
        if (response.status === HTTP_STATUS.OK) {
          toastSuccess(
            "Ciência de suspensão de alimentação avisada com sucesso!"
          );
          this.setRedirect();
        } else if (response.status === HTTP_STATUS.BAD_REQUEST) {
          toastError(
            `Erro ao tomar ciência de suspensão de alimentação ${getError(
              response.data
            )}`
          );
        }
      },
      function () {
        toastError("Erro ao tomar ciência de suspensão de alimentação");
      }
    );
  }

  render() {
    const {
      suspensaoAlimentacao,
      dadosEscola,
      erro,
      showModalMarcarConferencia,
      uuid,
      showModalEscolaCancela,
    } = this.state;

    const visao = localStorage.getItem("tipo_perfil");

    const EXIBIR_BOTAO_MARCAR_CONFERENCIA =
      visao === TIPO_PERFIL.TERCEIRIZADA &&
      suspensaoAlimentacao &&
      [statusEnum.INFORMADO, statusEnum.ESCOLA_CANCELOU].includes(
        suspensaoAlimentacao.status
      );

    const BotaoMarcarConferencia = () => {
      return (
        <Botao
          texto="Marcar Conferência"
          type={BUTTON_TYPE.BUTTON}
          style={BUTTON_STYLE.GREEN}
          className="ms-3"
          onClick={() => {
            this.showModalMarcarConferencia();
          }}
        />
      );
    };

    return (
      <div className="report">
        {suspensaoAlimentacao && (
          <ModalMarcarConferencia
            showModal={showModalMarcarConferencia}
            closeModal={() => this.closeModalMarcarConferencia()}
            onMarcarConferencia={() => {
              this.loadSolicitacao(uuid);
            }}
            uuid={suspensaoAlimentacao.uuid}
            endpoint="grupos-suspensoes-alimentacao"
          />
        )}
        {this.renderizarRedirecionamentoParaSuspensoesDeAlimentacao()}
        {erro && (
          <div>Opss... parece que ocorreu um erro ao carregar a página.</div>
        )}
        {!suspensaoAlimentacao && !erro && <div>Carregando...</div>}
        {suspensaoAlimentacao && (
          <form onSubmit={this.props.handleSubmit}>
            <span className="page-title">{`Suspensão de Alimentação - Solicitação # ${suspensaoAlimentacao.id_externo}`}</span>
            <div className="card mt-3">
              <div className="card-body">
                <CorpoRelatorio
                  suspensaoAlimentacao={suspensaoAlimentacao}
                  dadosEscola={dadosEscola}
                />
                {suspensaoAlimentacao.suspensoes_alimentacao.find(
                  (suspensao) => suspensao.cancelado_justificativa
                ) && (
                  <>
                    <hr />
                    <p>
                      <strong>Histórico de cancelamento</strong>
                      {suspensaoAlimentacao.suspensoes_alimentacao
                        .filter(
                          (suspensao) => suspensao.cancelado_justificativa
                        )
                        .map((suspensao, key, array) => {
                          return (
                            <div key={key}>
                              {suspensao.data}
                              {" - "}
                              justificativa: {suspensao.cancelado_justificativa}
                              <br />
                              {key < array.length - 1 && <br />}
                            </div>
                          );
                        })}
                    </p>
                  </>
                )}
                <RelatorioHistoricoJustificativaEscola
                  solicitacao={suspensaoAlimentacao}
                />
                {(usuarioEhEscolaTerceirizada() ||
                  usuarioEhEscolaTerceirizadaDiretor()) &&
                  suspensaoAlimentacao.status !== "ESCOLA_CANCELOU" && (
                    <>
                      {" "}
                      <div className="row">
                        <div className="col-12 text-end">
                          <Botao
                            texto="Cancelar"
                            onClick={() =>
                              this.setState({ showModalEscolaCancela: true })
                            }
                            type={BUTTON_TYPE.BUTTON}
                            style={BUTTON_STYLE.GREEN_OUTLINE}
                          />
                        </div>
                      </div>
                      <ModalCancelaSuspensao
                        showModal={showModalEscolaCancela}
                        closeModal={() =>
                          this.setState({ showModalEscolaCancela: false })
                        }
                        loadSolicitacao={() => this.loadSolicitacao(uuid)}
                        solicitacao={suspensaoAlimentacao}
                        uuid={suspensaoAlimentacao.uuid}
                      />
                    </>
                  )}
                {EXIBIR_BOTAO_MARCAR_CONFERENCIA && (
                  <div className="form-group float-end mt-4">
                    {suspensaoAlimentacao.terceirizada_conferiu_gestao ? (
                      <label className="ms-3 conferido">
                        <i className="fas fa-check me-2" />
                        Solicitação Conferida
                      </label>
                    ) : (
                      <BotaoMarcarConferencia
                        uuid={suspensaoAlimentacao.uuid}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </form>
        )}
      </div>
    );
  }
}

const RelatorioForm = reduxForm({
  form: "suspensaoALimentacaoForm",
  enableReinitialize: true,
})(RelatorioSuspensaoAlimentacao);
export default RelatorioForm;
