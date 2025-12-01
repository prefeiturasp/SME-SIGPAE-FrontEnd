import { Spin } from "antd";
import { useEffect, useState } from "react";
import { Field, Form } from "react-final-form";
import { connect } from "react-redux";
import { InputComData } from "src/components/Shareable/DatePicker";
import InputText from "src/components/Shareable/Input/InputText";
import { ASelect } from "src/components/Shareable/MakeField";
import { Select } from "src/components/Shareable/Select";
import { TIPOS_SOLICITACOES_OPTIONS } from "src/constants/shared";
import { usuarioEhEmpresaTerceirizada } from "src/helpers/utilities";
import {
  updateDataEventoAlimentacao,
  updateLoteAlimentacao,
  updateStatusAlimentacao,
  updateTipoSolicitacaoAlimentacao,
  updateTituloAlimentacao,
} from "src/reducers/filtersAlimentacaoReducer";
import {
  updateLoteDieta,
  updateStatusDieta,
  updateTituloDieta,
} from "src/reducers/filtersDietaReducer";
import {
  updateEditalProduto,
  updateMarcaProduto,
  updateNomeProduto,
} from "src/reducers/filtersProdutoReducer";
import { getNomesUnicosEditais } from "src/services/produto.service";
import "./style.scss";

const CardBody = (props) => {
  const [editais, setEditais] = useState([]);
  const ehTerceirizada = usuarioEhEmpresaTerceirizada();
  const { exibirFiltrosDataEventoETipoSolicitacao } = props;
  const ehDashboardGestaoProduto = props.ehDashboardGestaoProduto;
  const filtrosDesabilitados = props.filtrosDesabilitados || false;
  const loadingDietas = props.loadingDietas || false;
  const pathname = window.location.pathname;
  useEffect(() => {
    (async () => {
      const listaEditais = await getNomesUnicosEditais();
      let listaRsultados = listaEditais.data.results;
      let listaFormatada = listaRsultados.map((element) => {
        return { value: element, label: element };
      });
      setEditais(listaFormatada);
    })();
  }, []);

  return (
    <div className="card mt-3">
      <div className="card-body dash-terc">
        <div className="card-title fw-bold dashboard-card-title">
          <Form
            onSubmit={() => {}}
            initialValues={{}}
            render={({ form, handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div
                    className={`${
                      ehTerceirizada && props.listaStatus && props.listaLotes
                        ? "col-3"
                        : ehDashboardGestaoProduto
                          ? "col-12 text-end"
                          : exibirFiltrosDataEventoETipoSolicitacao
                            ? "col-12 col-sm-6 col-md-6 col-lg-3 px-0"
                            : "col-12 col-sm-6"
                    }`}
                  >
                    <span>{props.titulo}</span>
                    <p className="current-date">
                      Data: <span>{props.dataAtual}</span>
                    </p>
                  </div>

                  {ehDashboardGestaoProduto && (
                    <div className="col-12 col-md-4 produtos-edital">
                      {loadingDietas && (
                        <div>
                          <Spin
                            className="carregando-filtro"
                            tip="Carregando Filtro..."
                          />
                        </div>
                      )}
                      <Field
                        component={ASelect}
                        showSearch
                        name="edital"
                        placeholder={loadingDietas ? "" : "Número do Edital"}
                        disabled={loadingDietas || filtrosDesabilitados}
                        options={
                          editais
                            ? [{ label: "Número do Edital", value: "" }].concat(
                                editais,
                              )
                            : []
                        }
                        onChange={(value) => {
                          form.change("edital", value);
                          props.updateEditalProduto(value);
                          props.onChange(form.getState().values);
                        }}
                      />
                    </div>
                  )}

                  <div
                    className={`${
                      ehTerceirizada && props.listaStatus && props.listaLotes
                        ? "offset-3 col-6"
                        : exibirFiltrosDataEventoETipoSolicitacao
                          ? "col-12 col-sm-6 col-md-3"
                          : ehDashboardGestaoProduto
                            ? "col-4"
                            : "offset-3 col-3"
                    } div-input-pesquisar`}
                  >
                    {loadingDietas && (
                      <div>
                        <Spin
                          className="carregando-filtro"
                          tip="Carregando Filtro..."
                        />
                      </div>
                    )}
                    <Field
                      className={
                        exibirFiltrosDataEventoETipoSolicitacao
                          ? "input-com-filtros-adicionais"
                          : ""
                      }
                      component={InputText}
                      name="titulo"
                      placeholder={loadingDietas ? "" : "Pesquisar"}
                      disabled={loadingDietas || filtrosDesabilitados}
                      inputOnChange={(e) => {
                        const value = e.target.value;
                        const values_ = form.getState().values;

                        pathname === "/painel-dieta-especial" &&
                          props.updateTituloDieta(value);
                        pathname === "/painel-gestao-produto" &&
                          props.updateNomeProduto(value);
                        pathname === "/painel-gestao-alimentacao" &&
                          props.updateTituloAlimentacao(value);
                        props.onChange(values_);
                      }}
                    />
                    <div className="warning-num-charac">
                      * mínimo de 3 caracteres
                    </div>
                  </div>
                  {exibirFiltrosDataEventoETipoSolicitacao && (
                    <>
                      <div className="col-12 col-sm-6 col-md-3 ps-0 div-select-tipo-solicitacao">
                        <Field
                          component={Select}
                          name="tipo_solicitacao"
                          naoDesabilitarPrimeiraOpcao
                          placeholder="Tipo de Solicitação"
                          disabled={props.filtrosDesabilitados}
                          options={TIPOS_SOLICITACOES_OPTIONS}
                          onChangeEffect={(e) => {
                            const value = e.target.value;
                            const values_ = form.getState().values;

                            props.updateTipoSolicitacaoAlimentacao(value);
                            props.onChange(values_);
                          }}
                        />
                      </div>
                      <div className="col-12 col-sm-6 col-md-3 ps-0 div-input-data-evento">
                        <Field
                          name="data_evento"
                          minDate={null}
                          component={InputComData}
                          disabled={props.filtrosDesabilitados}
                          placeholder="Data do evento"
                          inputOnChange={(value) => {
                            const values_ = form.getState().values;
                            props.updateDataEventoAlimentacao(value);
                            props.onChange(values_);
                          }}
                        />
                      </div>
                    </>
                  )}
                  {ehDashboardGestaoProduto && (
                    <div
                      className={`${
                        ehDashboardGestaoProduto ? "col-4" : "col-3"
                      }`}
                    >
                      <Field
                        component={InputText}
                        name="marca"
                        placeholder="Busca da Marca"
                        disabled={filtrosDesabilitados}
                        inputOnChange={(e) => {
                          const value = e.target.value;
                          const values_ = form.getState().values;

                          props.updateMarcaProduto(value);
                          props.onChange(values_);
                        }}
                      />
                      <div className="warning-num-charac">
                        * mínimo de 3 caracteres
                      </div>
                    </div>
                  )}
                </div>
                {ehTerceirizada && (
                  <div className="row">
                    {props.listaStatus && (
                      <div className="col-3">
                        <Field
                          component={Select}
                          options={props.listaStatus}
                          name="status"
                          placeholder="Conferência Status"
                          naoDesabilitarPrimeiraOpcao
                          onChangeEffect={(e) => {
                            const value = e.target.value;
                            const values_ = form.getState().values;

                            props.updateStatusAlimentacao(value);
                            props.updateStatusDieta(value);
                            props.onChange(values_);
                          }}
                        />
                      </div>
                    )}
                    {props.listaLotes && (
                      <div className="col-3">
                        <Field
                          component={Select}
                          options={props.listaLotes}
                          name="lote"
                          placeholder="Selecione um Lote"
                          naoDesabilitarPrimeiraOpcao
                          onChangeEffect={(e) => {
                            const value = e.target.value;
                            const values_ = form.getState().values;

                            props.updateLoteAlimentacao(value);
                            props.updateLoteDieta(value);
                            props.onChange(values_);
                          }}
                        />
                      </div>
                    )}
                    {pathname === "/painel-gestao-alimentacao" && (
                      <>
                        <div className="col-3">
                          <Field
                            component={Select}
                            options={TIPOS_SOLICITACOES_OPTIONS}
                            name="tipo_solicitacao"
                            disabled={props.filtrosDesabilitados}
                            naoDesabilitarPrimeiraOpcao
                            onChangeEffect={(e) => {
                              const value = e.target.value;
                              const values_ = form.getState().values;

                              props.updateTipoSolicitacaoAlimentacao(value);
                              props.onChange(values_);
                            }}
                          />
                        </div>
                        <div className="col-3">
                          <Field
                            name="data_evento"
                            minDate={null}
                            component={InputComData}
                            placeholder="Data do evento"
                            disabled={props.filtrosDesabilitados}
                            inputOnChange={(value) => {
                              const values_ = form.getState().values;
                              props.updateDataEventoAlimentacao(value);
                              props.onChange(values_);
                            }}
                          />
                        </div>
                      </>
                    )}
                  </div>
                )}
              </form>
            )}
          />
        </div>
        {props.children}
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  updateStatusDieta: (statusDieta) => {
    dispatch(updateStatusDieta(statusDieta));
  },
  updateTituloDieta: (tituloDieta) => {
    dispatch(updateTituloDieta(tituloDieta));
  },
  updateLoteDieta: (loteDieta) => {
    dispatch(updateLoteDieta(loteDieta));
  },
  updateMarcaProduto: (marcaProduto) => {
    dispatch(updateMarcaProduto(marcaProduto));
  },
  updateNomeProduto: (tituloProduto) => {
    dispatch(updateNomeProduto(tituloProduto));
  },
  updateEditalProduto: (editalProduto) => {
    dispatch(updateEditalProduto(editalProduto));
  },
  updateTituloAlimentacao: (tituloAlimentacao) => {
    dispatch(updateTituloAlimentacao(tituloAlimentacao));
  },
  updateLoteAlimentacao: (loteAlimentacao) => {
    dispatch(updateLoteAlimentacao(loteAlimentacao));
  },
  updateStatusAlimentacao: (statusAlimentacao) => {
    dispatch(updateStatusAlimentacao(statusAlimentacao));
  },
  updateTipoSolicitacaoAlimentacao: (tipoSolicitacaoAlimentacao) => {
    dispatch(updateTipoSolicitacaoAlimentacao(tipoSolicitacaoAlimentacao));
  },
  updateDataEventoAlimentacao: (dataEventoAlimentacao) => {
    dispatch(updateDataEventoAlimentacao(dataEventoAlimentacao));
  },
});

export default connect(null, mapDispatchToProps)(CardBody);
