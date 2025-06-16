import React, { Component } from "react";
import HTTP_STATUS from "http-status-codes";
import { Collapse } from "react-collapse";
import { reduxForm } from "redux-form";
import { ToggleExpandir } from "../../../../../Shareable/ToggleExpandir";
import { Botao } from "../../../../../Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
  BUTTON_ICON,
} from "../../../../../Shareable/Botao/constants";
import withNavigate from "src/components/Shareable/withNavigate";
import {
  toastSuccess,
  toastError,
} from "../../../../../Shareable/Toast/dialogs";
import { getError } from "../../../../../../helpers/utilities";
import { escolaInativaDietaEspecial } from "../../../../../../services/dietaEspecial.service";
import { statusEnum } from "src/constants/shared";

export class SolicitacaoVigente extends Component {
  constructor(props) {
    super(props);
    this.state = {
      submitted: false,
      files: null,
      solicitacoesVigentes: null,
      titulo: "Dietas Ativas/Inativas",
    };
    this.setFiles = this.setFiles.bind(this);
    this.removeFile = this.removeFile.bind(this);
  }

  removeFile(index) {
    let files = this.state.files;
    files.splice(index, 1);
    this.setState({ files });
  }

  setFiles(files) {
    this.setState({ files });
  }

  componentDidMount() {
    if (this.props.solicitacoesVigentes !== this.state.solicitacoesVigentes) {
      const solicitacoesFiltradas = this.filtrarSolicitacoesAtivasEInativas(
        this.props.solicitacoesVigentes
      );
      this.setState({ solicitacoesVigentes: solicitacoesFiltradas });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.solicitacoesVigentes !== this.props.solicitacoesVigentes) {
      const solicitacoesFiltradas = this.filtrarSolicitacoesAtivasEInativas(
        this.props.solicitacoesVigentes
      );
      this.setState({ solicitacoesVigentes: solicitacoesFiltradas });
    }
  }

  activateSolicitacao(key) {
    let solicitacoesVigentes = this.state.solicitacoesVigentes;
    solicitacoesVigentes[key].active = !solicitacoesVigentes[key].active;
    this.setState({ solicitacoesVigentes });
  }

  toggleSolicitacao(key) {
    let solicitacoesVigentes = this.state.solicitacoesVigentes;
    solicitacoesVigentes[key].toggled = !solicitacoesVigentes[key].toggled;
    this.setState({ solicitacoesVigentes });
  }

  onSubmit(values) {
    this.setState({ submitted: true });
    escolaInativaDietaEspecial(values.uuid, values).then((response) => {
      if (response.status === HTTP_STATUS.OK) {
        toastSuccess("Cancelamento de solicitação realizada com sucesso.");
        this.setState({
          submitted: false,
          solicitacoesVigentes: null,
        });
      } else if (response.status === HTTP_STATUS.BAD_REQUEST) {
        toastError(getError(response.data));
        this.setState({ submitted: false });
      } else {
        toastError(
          `Erro ao solicitar dieta especial: ${getError(response.data)}`
        );
        this.setState({ submitted: false });
      }
    });
  }

  naoEhDietaAlterada(solicitacoes, sol) {
    return sol.ativo || !solicitacoes.some((s) => s.dieta_alterada === sol.id);
  }

  filtrarSolicitacoesAtivasEInativas(solicitacoes) {
    return solicitacoes
      .filter((sol) => this.naoEhDietaAlterada(solicitacoes, sol))
      .filter((sol) =>
        [
          statusEnum.CODAE_AUTORIZOU_INATIVACAO,
          statusEnum.TERMINADA_AUTOMATICAMENTE_SISTEMA,
          statusEnum.CODAE_AUTORIZADO,
          statusEnum.TERCEIRIZADA_TOMOU_CIENCIA,
        ].includes(sol.status_solicitacao)
      );
  }

  render() {
    const { solicitacoesVigentes } = this.state;
    const { uuid, handleSubmit, titulo, semSolicitacoesTexto } = this.props;
    return (
      <div className="current-diets">
        {!solicitacoesVigentes || solicitacoesVigentes.length === 0 ? (
          !uuid && (
            <div className="pt-2 no-diets">
              {semSolicitacoesTexto ||
                "Não há dieta autorizada para este aluno"}
            </div>
          )
        ) : (
          <div>
            <p className="pt-3 title">{titulo ? titulo : this.state.titulo}</p>
            {solicitacoesVigentes.map((solicitacaoVigente, key) => {
              let texto = "";
              let iconClassName = "";
              let corIcone = "";
              solicitacaoVigente.ativo
                ? (texto = "Dieta ativa")
                : (texto = "Dieta inativa");
              solicitacaoVigente.ativo
                ? (iconClassName = "fas fa-check-circle")
                : (iconClassName = "fas fa-ban");
              solicitacaoVigente.ativo
                ? (corIcone = "green")
                : (corIcone = "red");
              return (
                <div className="pb-2" key={key}>
                  <div
                    className="school-container col-md-12 me-4"
                    style={
                      solicitacaoVigente.active ? { background: "#F2FBFE" } : {}
                    }
                  >
                    <div className="row pt-2 pb-2 title">
                      <div className="col-4">
                        {`Solicitação: # ${solicitacaoVigente.id_externo}`}
                      </div>
                      <div className="col-8 text-end">
                        <i
                          style={{ color: corIcone }}
                          className={iconClassName}
                        />
                        <label className="ms-1 pe-3 ">{texto}</label>
                        <ToggleExpandir
                          onClick={() => this.activateSolicitacao(key)}
                          ativo={solicitacaoVigente.active}
                          className="float-end"
                        />
                      </div>
                    </div>
                    <Collapse isOpened={solicitacaoVigente.active}>
                      <hr />
                      <form className="special-diet" onSubmit={handleSubmit}>
                        <div className="container">
                          <section className="row attachments">
                            <div className="report-label-value col-8">
                              <p>Laudo</p>
                              <p>
                                Para visualizar o(s) laudo(s) fornecido(s) pelo
                                prescritor, clique nos anexo(s)
                              </p>{" "}
                            </div>{" "}
                            <div className="col-4 report-label-value">
                              <p>Anexos</p>
                              {solicitacaoVigente.anexos
                                .filter((anexo) => !anexo.eh_laudo_alta)
                                .map((anexo, key) => {
                                  return (
                                    <div key={key}>
                                      <a
                                        rel="noopener noreferrer"
                                        target="_blank"
                                        href={anexo.arquivo_url}
                                        className="link"
                                        tabIndex="-1"
                                      >
                                        {`Anexo ${key + 1}`}
                                      </a>
                                    </div>
                                  );
                                })}
                            </div>
                          </section>
                          <div className="report-label-value">
                            <p>Observações</p>
                            <p
                              className="value"
                              dangerouslySetInnerHTML={{
                                __html: solicitacaoVigente.observacoes,
                              }}
                            />
                          </div>
                          <div className="report-label-value mb-3">
                            <p>Relação por Diagnóstico</p>
                            {solicitacaoVigente.alergias_intolerancias.map(
                              (alergia, key) => (
                                <div className="value" key={key}>
                                  {alergia.descricao}
                                </div>
                              )
                            )}
                          </div>
                          <div className="row pb-3">
                            <div className="col-6">
                              <Botao
                                tabindex="-1"
                                onClick={() =>
                                  this.props.navigate(
                                    `/dieta-especial/relatorio?uuid=${solicitacaoVigente.uuid}`
                                  )
                                }
                                texto="Visualizar Solicitação"
                                style={BUTTON_STYLE.BLUE_OUTLINE}
                                type={BUTTON_TYPE.BUTTON}
                                icon={BUTTON_ICON.FILE_ALT}
                                className="me-3"
                              />
                            </div>
                          </div>
                        </div>
                      </form>
                    </Collapse>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
}

const InativarDietaForm = reduxForm({
  form: "inativaDietaForm",
  enableReinitialize: true,
})(withNavigate(SolicitacaoVigente));

export default InativarDietaForm;
