import HTTP_STATUS from "http-status-codes";
import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import { Field, Form } from "react-final-form";
import {
  alphaNumeric,
  composeValidators,
  peloMenosUmCaractere,
  required,
  requiredOptionSearchSelect,
} from "helpers/fieldValidators";
import CKEditorField from "components/Shareable/CKEditorField";
import InputText from "components/Shareable/Input/InputText";
import { InputComData } from "components/Shareable/DatePicker";
import AutoCompleteField from "components/Shareable/AutoCompleteField";
import moment from "moment";
import ManagedInputFileField from "components/Shareable/Input/InputFile/ManagedField";
import { toastError, toastSuccess } from "components/Shareable/Toast/dialogs";
import Botao from "components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
  BUTTON_ICON,
} from "components/Shareable/Botao/constants";

import { escolaOuNutriReclamaDoProduto } from "services/produto.service";
import { getEscolasTercTotal } from "services/escola.service";

import "./style.scss";

import { meusDados } from "services/perfil.service";
import {
  usuarioEhNutricionistaSupervisao,
  usuarioEhCODAEDietaEspecial,
  deepCopy,
  usuarioEhEscolaTerceirizadaDiretor,
  usuarioEhEscolaTerceirizada,
} from "helpers/utilities";
import { TIPO_PERFIL } from "constants/shared";
export default class ModalReclamacaoProduto extends Component {
  constructor(props) {
    super(props);
    this.state = {
      meusDados: undefined,
      escolas: [],
      nomesEscolas: [],
    };
  }

  UNSAFE_componentWillMount = async () => {
    const meusDadosResposta = await meusDados();
    const escolasResposta = await getEscolasTercTotal({
      nome_edital: this.props.edital,
    });
    this.setState({
      meusDados: meusDadosResposta,
      escolas: escolasResposta.data.map((escola) => {
        return {
          uuid: escola.uuid,
          label: `${escola.codigo_eol} - ${escola.nome}`,
        };
      }),
      nomesEscolas: escolasResposta.data.map(
        (escola) => `${escola.codigo_eol} - ${escola.nome}`
      ),
    });
    if (escolasResposta) {
      this.props.setEscolasRequisicaoConcluida(true);
    }
  };

  getDadosIniciais = () => {
    const meusDados = this.state.meusDados;
    if (meusDados) {
      const dadosIniciais = {
        reclamante_registro_funcional: meusDados.registro_funcional
          ? meusDados.registro_funcional
          : undefined,
        reclamante_nome: meusDados.nome,
        reclamante_cargo: meusDados.cargo ? meusDados.cargo : undefined,
      };
      if (
        usuarioEhEscolaTerceirizadaDiretor() ||
        usuarioEhEscolaTerceirizada()
      ) {
        dadosIniciais.escola = meusDados.vinculo_atual.instituicao.uuid;
      }
      return dadosIniciais;
    }
    return {};
  };

  getNomesItemsFiltrado = (value) => {
    const { nomesEscolas } = this.state;
    if (value) {
      return nomesEscolas.filter((a) => a.includes(value.toUpperCase()));
    }
    return [];
  };

  onSubmit = async (values) => {
    const values_ = deepCopy(values);
    const { escolas } = this.state;
    const tipoPerfil = localStorage.getItem("tipo_perfil");
    if (tipoPerfil === TIPO_PERFIL.SUPERVISAO_NUTRICAO) {
      values_.escola = escolas.find(
        (escola) => escola.label === values_.escola
      ).uuid;
    }
    const response = await escolaOuNutriReclamaDoProduto(
      this.props.produto.ultima_homologacao.uuid,
      values_
    );
    if (response.status === HTTP_STATUS.OK) {
      toastSuccess("Reclamação de produto registrada com sucesso!");
      this.props.closeModal();
      this.props.onAtualizarProduto();
    } else if (response.status === HTTP_STATUS.BAD_REQUEST) {
      toastError("Houve um erro ao registrar a reclamação de produto");
    }
  };

  render() {
    const { showModal, closeModal, produto, edital } = this.props;
    const { meusDados, escolas } = this.state;
    const escola = meusDados ? meusDados.vinculo_atual.instituicao : undefined;
    const deveEscolherUmaEscola =
      usuarioEhNutricionistaSupervisao() || usuarioEhCODAEDietaEspecial();
    return (
      <Modal
        dialogClassName="modal-reclamacao-produto modal-90w"
        show={showModal}
        onHide={closeModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Reclamação de Produto</Modal.Title>
        </Modal.Header>
        <Form
          onSubmit={this.onSubmit}
          initialValues={this.getDadosIniciais()}
          render={({ handleSubmit, submitting, form, values }) => (
            <form onSubmit={handleSubmit}>
              <Modal.Body>
                <div className="form-row">
                  <div className="col-4">
                    <Field
                      component={InputText}
                      label="RF/CRN/CRF"
                      name="reclamante_registro_funcional"
                      required
                      validate={required}
                    />
                  </div>
                  <div className="col-8">
                    <Field
                      component={InputText}
                      label="Cargo"
                      name="reclamante_cargo"
                      required
                      validate={required}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="col-12">
                    <Field
                      component={InputText}
                      label="Nome"
                      name="reclamante_nome"
                      disabled={true}
                      required
                      validate={required}
                    />
                  </div>
                </div>
                {(usuarioEhEscolaTerceirizadaDiretor() ||
                  usuarioEhEscolaTerceirizada()) &&
                  escola && (
                    <div className="form-row">
                      <div className="col-6">
                        <label htmlFor="escola" className="col-form-label">
                          Escola
                        </label>
                        <div>{escola.nome}</div>
                      </div>
                      {escola.codigo_eol && (
                        <div className="col-6">
                          <label htmlFor="vinculo" className="col-form-label">
                            Código EOL
                          </label>
                          <div>{escola.codigo_eol}</div>
                        </div>
                      )}
                    </div>
                  )}
                <div className="form-row">
                  <div className="col-12">
                    <label htmlFor="escola" className="col-form-label">
                      Edital
                    </label>
                    <div>{edital}</div>
                  </div>
                </div>
                {deveEscolherUmaEscola && (
                  <div className="form-row">
                    <div className="col-12">
                      <Field
                        dataSource={this.getNomesItemsFiltrado(values.escola)}
                        component={AutoCompleteField}
                        name="escola"
                        label="Escola"
                        placeholder="Digite um nome"
                        className="input-busca-nome-item"
                        validate={composeValidators(
                          required,
                          requiredOptionSearchSelect(escolas)
                        )}
                        required
                      />
                    </div>
                  </div>
                )}
                <div className="form-row">
                  <div className="col-4">
                    <Field
                      component={InputText}
                      label="Nome do produto"
                      name="produto_nome"
                      defaultValue={produto.nome}
                      disabled={true}
                      required
                      validate={required}
                    />
                  </div>
                  <div className="col-8">
                    <Field
                      component={InputText}
                      label="Marca"
                      name="produto_marca"
                      defaultValue={produto.marca.nome}
                      disabled={true}
                      required
                      validate={required}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="col-4">
                    <Field
                      component={InputText}
                      label="Lote do produto"
                      name="produto_lote"
                      tooltipText="Inserir o lote do produto conforme especificação contida no rótulo."
                      validate={alphaNumeric}
                    />
                  </div>
                  <div className="col-4">
                    <Field
                      component={InputComData}
                      label="Data de fabricação"
                      name="produto_data_fabricacao"
                      minDate={null}
                      maxDate={moment().toDate()}
                      inputOnChange={(value) => {
                        form.change("produto_data_validade", undefined);
                        this.setState({ ...this.state, fabricacao: value });
                      }}
                    />
                  </div>
                  <div className="col-4">
                    <Field
                      component={InputComData}
                      label="Data de validade"
                      name="produto_data_validade"
                      minDate={
                        this.state.fabricacao
                          ? moment(this.state.fabricacao, "DD/MM/YYYY").toDate()
                          : null
                      }
                      maxDate={null}
                    />
                  </div>
                </div>
                <div className="form-row row-reclamacao">
                  <div className="col-12">
                    <Field
                      component={CKEditorField}
                      label="Reclamação"
                      name="reclamacao"
                      required
                      validate={composeValidators(
                        required,
                        peloMenosUmCaractere
                      )}
                    />
                  </div>
                </div>
                <section className="form-row attachments">
                  <div className="col-9">
                    <div className="card-title fw-bold cinza-escuro">
                      Anexar
                    </div>
                    <div className="text">
                      Anexar fotos, documentos ou relatórios relacionados à
                      reclamação do produto.
                    </div>
                  </div>
                  <div className="col-3 btn">
                    <Field
                      component={ManagedInputFileField}
                      className="inputfile"
                      texto="Anexar"
                      name="anexos"
                      accept=".png, .doc, .pdf, .docx, .jpeg, .jpg"
                      icone={BUTTON_ICON.ATTACH}
                      toastSuccessMessage="Anexo incluso com sucesso"
                      concatenarNovosArquivos
                    />
                  </div>
                </section>
              </Modal.Body>
              <Modal.Footer>
                <div className="row mt-4">
                  <div className="col-12">
                    <Botao
                      texto="Voltar"
                      type={BUTTON_TYPE.BUTTON}
                      onClick={closeModal}
                      style={BUTTON_STYLE.GREEN_OUTLINE}
                      className="ms-3"
                    />
                    <Botao
                      texto="Enviar"
                      type={BUTTON_TYPE.SUBMIT}
                      style={BUTTON_STYLE.GREEN}
                      className="ms-3"
                      disabled={submitting}
                    />
                  </div>
                </div>
              </Modal.Footer>
            </form>
          )}
        />
      </Modal>
    );
  }
}
