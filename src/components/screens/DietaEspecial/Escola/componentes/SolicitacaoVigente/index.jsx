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
      this.setState({ solicitacoesVigentes: this.props.solicitacoesVigentes });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.solicitacoesVigentes !== this.props.solicitacoesVigentes) {
      this.setState({ solicitacoesVigentes: this.props.solicitacoesVigentes });
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
                        <div className="container mx-0">
                          <div className="flex-row report-label-value mb-3">
                            <p className="mb-0">Relação por Diagnóstico:</p>
                            {solicitacaoVigente.alergias_intolerancias.map(
                              (alergia, key) => (
                                <div className="value mx-1" key={key}>
                                  {alergia.descricao}
                                </div>
                              )
                            )}
                          </div>
                          <div className="flex-row report-label-value mb-3">
                            <p className="mb-0">
                              Classificação da Dieta Especial:
                            </p>
                            <span className="value mx-1">
                              {solicitacaoVigente.ativo
                                ? solicitacaoVigente.classificacao.nome
                                : "--"}
                            </span>
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
