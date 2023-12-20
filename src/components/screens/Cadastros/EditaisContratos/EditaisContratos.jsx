import React, { Component } from "react";
import { reduxForm, FormSection } from "redux-form";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { loadEdital } from "../../../../reducers/edital.reducer";
import { Link } from "react-router-dom";
import {
  getLotes,
  getDiretoriaregionalSimplissima,
} from "../../../../services/diretoriaRegional.service";
import HTTP_STATUS from "http-status-codes";
import {
  criarEditalEContrato,
  obtemEdital,
  excluirEdital,
  atualizarEditalEContrato,
} from "../../../../services/edital.service";
import { ModalCadastroEdital } from "./ModalCadastroEdital";
import { getTerceirizada } from "../../../../services/terceirizada.service";
import {
  normalizaLabelValueLote,
  normalizaLabelValueDRE,
  normalizaLabelValueEmpresa,
  montaContratoRelacionado,
} from "./helper";
import { SectionFormEdital } from "./SectionFormEdital";
import ContratosRelacionados from "./ContratosRelacionados";
import "../style.scss";
import { toastError, toastSuccess } from "../../../Shareable/Toast/dialogs";
import { Spin } from "antd";
import { Redirect } from "react-router-dom";
import Botao from "../../../Shareable/Botao";
import { BUTTON_STYLE, BUTTON_TYPE } from "../../../Shareable/Botao/constants";
import {
  CADASTROS,
  CONFIGURACOES,
  EDITAIS_CADASTRADOS,
} from "../../../../configs/constants";
import { getError } from "../../../../helpers/utilities";

const ENTER = 13;
class EditaisContratos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lotes: [],
      diretoriasRegionais: [],
      empresas: [],
      forms: ["secaoEdital0"],

      edital: {
        tipo_contratacao: null,
        numero: null,
        numero_processo: null,
        resumo: null,
      },

      contratos_relacionados: [
        {
          vigencias: [
            {
              data_inicial: null,
              data_final: null,
            },
          ],
          numero_contrato: null,
          processo_administrativo: null,
          data_proposta: null,
          lotes: null,
          lotes_nomes: null,
          dres: null,
          dres_nomes: null,
          empresas: null,
          empresas_nomes: null,
        },
      ],
      exibirModal: false,
      edital_contratos: null,
      reseta: false,
      redirect: false,
      loading: true,
      uuid: null,
      atualizacao: false,
    };
    this.exibirModal = this.exibirModal.bind(this);
    this.fecharModal = this.fecharModal.bind(this);
    this.obtemDadosParaSubmit = this.obtemDadosParaSubmit.bind(this);
    this.adicionaVigenciaContrato = this.adicionaVigenciaContrato.bind(this);
    this.adicionaNumeroContrato = this.adicionaNumeroContrato.bind(this);
    this.adicionaFieldsFormEdital = this.adicionaFieldsFormEdital.bind(this);
    this.adicionarNomesListagem = this.adicionarNomesListagem.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.setaResetFormChild = this.setaResetFormChild.bind(this);
    this.excluirContratoRelacionado =
      this.excluirContratoRelacionado.bind(this);
  }

  excluirEdital(uuid) {
    if (window.confirm("Tem certeza que deseja excluir o lote?")) {
      excluirEdital(uuid).then(
        (res) => {
          if (res.status === HTTP_STATUS.NO_CONTENT) {
            toastSuccess("Edital excluído com sucesso");
            this.setRedirect();
            this.resetForm();
          } else {
            toastError(
              `Houve um erro ao excluir o edital ${getError(res.data)}`
            );
          }
        },
        function () {
          toastError("Houve um erro ao excluir o edital");
        }
      );
    }
  }

  adicionaContratosRelacionados() {
    const CONTRATO_VAZIO = {
      vigencias: [
        {
          data_inicial: null,
          data_final: null,
        },
      ],
      numero_contrato: null,
      processo_administrativo: null,
      data_proposta: null,
      lotes: null,
      lotes_nomes: null,
      dres: null,
      dres_nomes: null,
      empresas: null,
      empresas_nomes: null,
    };

    const contratos_relacionados = this.state.contratos_relacionados;
    contratos_relacionados.push(CONTRATO_VAZIO);

    this.setState({
      contratos_relacionados,
    });
  }

  nomeFormAtual() {
    const indiceDoFormAtual = `secaoEdital${this.state.forms.length}`;
    let forms = this.state.forms;
    forms.push(indiceDoFormAtual);
    this.setState({ forms });
  }

  setRedirect() {
    this.setState({
      redirect: true,
    });
  }

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to="/configuracoes/cadastros/editais-cadastrados" />;
    }
  };

  excluirContratoRelacionado(indiceForm) {
    let contratos_relacionados = this.state.contratos_relacionados;
    contratos_relacionados.splice(indiceForm, 1);
    let forms = this.state.forms;
    forms.splice(indiceForm, 1);
    this.setState({ contratos_relacionados, forms });
  }

  exibirModal() {
    this.setState({ exibirModal: true });
  }

  fecharModal() {
    this.setState({ exibirModal: false });
  }

  onSubmit(values) {
    if (!this.state.uuid) {
      criarEditalEContrato(JSON.stringify(values)).then(
        (response) => {
          if (response.status === HTTP_STATUS.CREATED) {
            toastSuccess("Edital salvo com sucesso");
            this.setRedirect();
            this.resetForm();
          } else {
            toastError(
              `Houve um erro ao salvar o edital ${getError(response.data)}`
            );
          }
        },
        function () {
          toastError("Houve um erro ao salvar o edital");
        }
      );
    } else {
      atualizarEditalEContrato(JSON.stringify(values), this.state.uuid).then(
        (res) => {
          if (res.status === HTTP_STATUS.OK) {
            toastSuccess("Edital atualizado com sucesso");
            this.setRedirect();
            this.resetForm();
          } else {
            toastError(
              `Houve um erro ao atualizar o edita ${getError(res.data)}`
            );
          }
        },
        function () {
          toastError("Houve um erro ao atualizar o edital");
        }
      );
    }
  }

  resetForm() {
    [
      "tipo_contratacao",
      "edital_numero",
      "processo_administrativo",
      "resumo_objeto",
    ].forEach((element) => {
      this.props.change(element, null);
    });

    this.setState({ reseta: true, uuid: null });

    this.state.forms.forEach((form, index) => {
      this.props.change(`${form}.numero_contrato${index}`, null);
      this.props.change(`${form}.processo_administrativo${index}`, null);
      this.props.change(`${form}.data_proposta${index}`, null);
      this.state.contratos_relacionados[index].vigencias.forEach(
        (vigencia, key) => {
          this.props.change(
            `${form}.secaoContrato${key}.data_inicial${key}`,
            null
          );
          this.props.change(
            `${form}.secaoContrato${key}.data_final${key}`,
            null
          );
        }
      );
    });

    this.state.forms.splice(1, Number.MAX_VALUE);

    this.state.contratos_relacionados.splice(1, Number.MAX_VALUE);

    let contratos_relacionados = [
      {
        vigencias: [
          {
            data_inicial: null,
            data_final: null,
          },
        ],
        numero_contrato: null,
        processo_administrativo: null,
        data_proposta: null,
        lotes: null,
        lotes_nomes: null,
        dres: null,
        dres_nomes: null,
        empresas: null,
        empresas_nomes: null,
      },
    ];

    this.setState({ contratos_relacionados });
  }

  adicionarNomesListagem(chave, valor, indice) {
    let contratos_relacionados = this.state.contratos_relacionados;
    contratos_relacionados[indice][chave] = valor;
    this.setState({ contratos_relacionados });
  }

  adicionaNumeroContrato(indice, numero_contrato) {
    const contratos_relacionados = this.state.contratos_relacionados;
    contratos_relacionados[indice].numero_contrato = numero_contrato;
    this.setState({
      contratos_relacionados,
    });
  }

  adicionaFieldsFormEdital(field, value) {
    let edital = this.state.edital;
    edital[field] = value;
    this.setState({ edital });
  }

  validarForm(edital_contratos) {
    edital_contratos.contratos_relacionados.forEach((contrato) => {
      if (
        contrato.lotes === null ||
        contrato.dres === null ||
        contrato.empresas === null
      ) {
        toastError("Verifique os itens obrigatórios no formulário");
      } else {
        this.setState({ edital_contratos });
        this.exibirModal();
      }
    });
  }

  salvaFormulario() {
    const edital_contratos = this.state.edital;
    edital_contratos["contratos_relacionados"] =
      this.state.contratos_relacionados;
    this.validarForm(edital_contratos);
  }

  obtemDadosParaSubmit(field, value, key) {
    let contratos_relacionados = this.state.contratos_relacionados;
    contratos_relacionados[key][field] = value;
    this.setState({ contratos_relacionados });
  }

  adicionaVigenciaContrato(indice, vigencias) {
    const contratos_relacionados = this.state.contratos_relacionados;
    contratos_relacionados[indice].vigencias = vigencias;
    this.setState({ contratos_relacionados });
  }

  componentDidMount() {
    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");
    this.setState({ uuid });

    if (uuid) {
      obtemEdital(uuid)
        .then((response) => {
          response.data.contratos.forEach((contrato, indice_contrato) => {
            if (indice_contrato !== 0) {
              this.nomeFormAtual();
              this.adicionaContratosRelacionados();
            }
            let contratos_relacionados = montaContratoRelacionado(
              this.state.contratos_relacionados,
              contrato,
              indice_contrato
            );

            let edital = this.state.edital;
            edital["tipo_contratacao"] = response.data.tipo_contratacao;
            edital["numero"] = response.data.numero;
            edital["numero_processo"] = response.data.processo;
            edital["resumo"] = response.data.objeto;

            this.setState({
              contratos_relacionados,
              edital,
            });
          });

          if (this.state.edital?.resumo?.length > 0) {
            this.setState({ atualizacao: true });
          }
          this.props.loadEdital(response.data);
        })
        .finally(() => {
          this.setState({
            loading: false,
          });
        });
    } else {
      this.props.reset("cadastroEditaisForm");
      this.resetForm();
      this.setState({
        loading: false,
      });
    }

    getLotes().then((response) => {
      this.setState({ lotes: normalizaLabelValueLote(response.results) });
    });

    getDiretoriaregionalSimplissima().then((response) => {
      this.setState({
        diretoriasRegionais: normalizaLabelValueDRE(response.data),
      });
    });

    getTerceirizada().then((response) => {
      this.setState({
        empresas: normalizaLabelValueEmpresa(response.data.results),
      });
    });
  }

  setaResetFormChild() {
    this.setState({ reseta: false });
  }

  onKeyPress(event) {
    if (event.which === ENTER) {
      event.preventDefault();
    }
  }

  render() {
    const {
      lotes,
      forms,
      diretoriasRegionais,
      empresas,
      exibirModal,
      edital_contratos,
      reseta,
      contratos_relacionados,
      atualizacao,
      uuid,
      loading,
    } = this.state;

    return (
      <Spin tip="Carregando..." spinning={loading}>
        <section className="cadastro pt-3">
          {this.renderRedirect()}
          <ModalCadastroEdital
            closeModal={this.fecharModal}
            showModal={exibirModal}
            edital_contratos={edital_contratos}
            onSubmit={this.onSubmit}
          />
          <form onSubmit={() => {}} noValidate="novalidate">
            <div className="card">
              <div className="card-body p-0">
                <header className="header-form">
                  <div className="card-title fw-bold">
                    Dados do Edital e Contrato
                  </div>
                  <div className="row pt-3">
                    <div className="col-12">
                      <Link
                        to={`/${CONFIGURACOES}/${CADASTROS}/${EDITAIS_CADASTRADOS}`}
                      >
                        <Botao
                          texto="Consulta de editais e contratos cadastrados"
                          style={BUTTON_STYLE.GREEN_OUTLINE}
                        />
                      </Link>
                    </div>
                  </div>
                </header>
                <SectionFormEdital
                  adicionaFieldsFormEdital={this.adicionaFieldsFormEdital}
                />
                <hr />
                <div className="card-body card-title fw-bold pt-0 pb-0">
                  Contratos Relacionados
                </div>
                {forms.map((formEdital, key) => {
                  return (
                    <FormSection
                      key={key}
                      component={ContratosRelacionados}
                      lotes={lotes}
                      name={`secaoEdital${key}`}
                      nomeForm={formEdital}
                      diretoriasRegionais={diretoriasRegionais}
                      empresas={empresas}
                      obtemDadosParaSubmit={this.obtemDadosParaSubmit}
                      obtemLotesDresouEmpresas={this.obtemLotesDresouEmpresas}
                      indice={key}
                      adicionaVigenciaContrato={this.adicionaVigenciaContrato}
                      adicionaNumeroContrato={this.adicionaNumeroContrato}
                      adicionarNomesListagem={this.adicionarNomesListagem}
                      excluirContratoRelacionado={
                        this.excluirContratoRelacionado
                      }
                      reseta={reseta}
                      setaResetFormChild={this.setaResetFormChild}
                      contratos_relacionados={contratos_relacionados}
                      atualizacao={atualizacao}
                    />
                  );
                })}

                <article className="card-body dados-editais">
                  <Botao
                    className="header-button"
                    texto="+ Adicionar outro contrato relacionado"
                    style={BUTTON_STYLE.GREEN_OUTLINE}
                    onClick={() => {
                      this.nomeFormAtual();
                      this.adicionaContratosRelacionados();
                    }}
                  />
                </article>

                <footer>
                  <div className="card-body row">
                    <div className="col-12 text-end">
                      {!uuid ? (
                        <Botao
                          texto="Cancelar"
                          onClick={() => {
                            this.resetForm();
                          }}
                          style={BUTTON_STYLE.GREEN_OUTLINE}
                        />
                      ) : (
                        <Botao
                          texto="Excluir"
                          onClick={() => {
                            this.excluirEdital(uuid);
                          }}
                          style={BUTTON_STYLE.GREEN_OUTLINE}
                        />
                      )}
                      <Botao
                        texto={"Salvar"}
                        onClick={() => {
                          this.salvaFormulario();
                        }}
                        className="ms-3"
                        type={BUTTON_TYPE.SUBMIT}
                        style={BUTTON_STYLE.GREEN}
                      />
                    </div>
                  </div>
                </footer>
              </div>
            </div>
          </form>
        </section>
      </Spin>
    );
  }
}

const cadastroEditaisForm = reduxForm({
  form: "cadastroEditaisForm",
  enableReinitialize: true,
})(EditaisContratos);
const mapStateToProps = (state) => {
  return {
    initialValues: state.cadastroEditaisForm.data,
  };
};
const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      loadEdital,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(cadastroEditaisForm);
