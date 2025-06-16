import HTTP_STATUS from "http-status-codes";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Field, formValueSelector, reduxForm } from "redux-form";
import { required } from "../../../helpers/fieldValidators";
import {
  atualizarTemplateMensagem,
  getTemplateMensagemDetalhe,
  getTemplatesMensagem,
} from "../../../services/configuracoesMensagens";
import { toastError, toastSuccess } from "../../Shareable/Toast/dialogs";
import { getOptions } from "./helper";
import "./style.scss";
import Select from "../../Shareable/Select";
import InputText from "../../Shareable/Input/InputText";
import CKEditorField from "src/components/Shareable/CKEditorField";
import Botao from "../../Shareable/Botao";
import { BUTTON_STYLE, BUTTON_TYPE } from "../../Shareable/Botao/constants";

class Mensagem extends Component {
  constructor(props) {
    super(props);
    this.state = { templates: [] };
  }

  onTipoEmailComboChanged(uuid) {
    if (uuid !== "Selecione") {
      getTemplateMensagemDetalhe(uuid).then((resp) => {
        this.props.change("assunto", resp.assunto);
        this.props.change("template_html", resp.template_html);
      });
    } else {
      this.props.reset();
    }
  }

  onSubmit(values) {
    const uuid = values.tipo_email;
    atualizarTemplateMensagem(uuid, values).then((resp) => {
      if (resp.status === HTTP_STATUS.OK) {
        toastSuccess("Configurações de E-mail salvas com sucesso!");
      } else {
        toastError("Falhou em atualizar o template");
      }
    });
  }

  componentDidMount() {
    getTemplatesMensagem().then((resp) => {
      const templates = resp.results;
      this.setState({ templates });
    });
  }

  render() {
    const { handleSubmit, tipo_email } = this.props;
    return (
      <div>
        <form onSubmit={handleSubmit}>
          <div className="card configuracao-mensagem mt-3">
            <div className="card-body">
              <div className="row">
                <div className="col-8">
                  <Field
                    label="Tipo de E-mail"
                    component={Select}
                    name="tipo_email"
                    onChange={(event) =>
                      this.onTipoEmailComboChanged(event.target.value)
                    }
                    options={getOptions(this.state.templates)}
                    validate={required}
                    required
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <Field
                    label="Assunto"
                    component={InputText}
                    name="assunto"
                    disabled
                  />
                </div>
              </div>
              <div className="row mb-5">
                <div className="col-12">
                  <Field
                    label="Template"
                    component={CKEditorField}
                    name="template_html"
                    temOpcoesCustomizadas
                  />
                </div>
              </div>
              <div className="row pt-3 mt-5">
                <div className="col-4 mt-4" />
                <div className="col-8 text-end">
                  <Botao
                    texto="Cancelar"
                    onClick={() => this.props.reset()}
                    style={BUTTON_STYLE.GREEN_OUTLINE}
                  />
                  <Botao
                    texto={"Salvar"}
                    onClick={handleSubmit((values) => {
                      this.onSubmit(values);
                    })}
                    className="ms-3"
                    disabled={!tipo_email || tipo_email === "Selecione"}
                    type={BUTTON_TYPE.SUBMIT}
                    style={BUTTON_STYLE.GREEN}
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const MensagemForm = reduxForm({
  form: "mensagemForm",
  enableReinitialize: true,
})(Mensagem);
const selector = formValueSelector("mensagemForm");
const mapStateToProps = (state) => {
  return {
    tipo_email: selector(state, "tipo_email"),
  };
};

export default connect(mapStateToProps)(MensagemForm);
