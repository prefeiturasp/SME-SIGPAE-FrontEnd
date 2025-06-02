import React from "react";
import { Field } from "react-final-form";
import { Select } from "src/components/Shareable/Select";
import InputText from "src/components/Shareable/Input/InputText";
import {
  usuarioEhEscolaTerceirizadaDiretor,
  usuarioEhEscolaTerceirizada,
  usuarioEhEmpresaTerceirizada,
} from "src/helpers/utilities";
import { Spin } from "antd";
import { TIPOS_SOLICITACOES_OPTIONS } from "src/constants/shared";
import { InputComData } from "./DatePicker";

// Para usar este componente é necessário remover o redux-form do dashboard

const CardBodySemRedux = (props) => {
  const ehTerceirizada = usuarioEhEmpresaTerceirizada();
  const ehEscola =
    usuarioEhEscolaTerceirizada() || usuarioEhEscolaTerceirizadaDiretor();
  const { exibirFiltrosDataEventoETipoSolicitacao } = props;
  const ehDashboardGestaoProduto = props.ehDashboardGestaoProduto;
  const filtrosDesabilitados = props.filtrosDesabilitados || false;
  const loadingDietas = props.loadingDietas || false;

  return (
    <div className="card mt-3">
      <div className="card-body dash-terc">
        <div className="card-title fw-bold dashboard-card-title">
          <div className="row">
            <div
              className={`${
                (ehTerceirizada && props.listaStatus && props.listaLotes) ||
                ehDashboardGestaoProduto
                  ? "col-3"
                  : exibirFiltrosDataEventoETipoSolicitacao
                  ? "col-3 px-0"
                  : "col-6"
              }`}
            >
              <span>{props.titulo}</span>
              <p className="current-date">
                Data: <span>{props.dataAtual}</span>
              </p>
            </div>
            {!ehEscola && (
              <div
                className={`${
                  ehTerceirizada && props.listaStatus && props.listaLotes
                    ? "offset-3 col-6"
                    : exibirFiltrosDataEventoETipoSolicitacao
                    ? "col-3"
                    : "offset-3 col-3"
                }`}
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
                  inputOnChange={() => props.onChange(props.values)}
                />
                <div className="warning-num-charac">
                  * mínimo de 3 caracteres
                </div>
              </div>
            )}
            {exibirFiltrosDataEventoETipoSolicitacao && (
              <>
                <div
                  className={`${
                    ehEscola ? "offset-3 col-3 ps-0" : "col-3 ps-0"
                  }`}
                >
                  <Field
                    component={Select}
                    name="tipo_solicitacao"
                    naoDesabilitarPrimeiraOpcao
                    placeholder="Tipo de Solicitação"
                    options={TIPOS_SOLICITACOES_OPTIONS}
                    onChangeEffect={() => props.onChange(props.values)}
                  />
                </div>
                <div className="col-3 ps-0">
                  <Field
                    name="data_evento"
                    minDate={null}
                    component={InputComData}
                    placeholder="Data do evento"
                    inputOnChange={() => props.onChange(props.values)}
                  />
                </div>
              </>
            )}
            {ehDashboardGestaoProduto && (
              <div className="col-3">
                <Field
                  component={InputText}
                  name="marca"
                  placeholder="Busca da Marca"
                  disabled={filtrosDesabilitados}
                  inputOnChange={() => props.onChange(props.values)}
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
                    onChangeEffect={() => props.onChange(props.values)}
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
                    onChangeEffect={() => props.onChange(props.values)}
                  />
                </div>
              )}
              <div className="col-3">
                <Field
                  component={Select}
                  options={TIPOS_SOLICITACOES_OPTIONS}
                  name="tipo_solicitacao"
                  naoDesabilitarPrimeiraOpcao
                  onChangeEffect={() => props.onChange(props.values)}
                />
              </div>
              <div className="col-3">
                <Field
                  name="data_evento"
                  minDate={null}
                  component={InputComData}
                  placeholder="Data do evento"
                  inputOnChange={() => props.onChange(props.values)}
                />
              </div>
            </div>
          )}
        </div>
        {props.children}
      </div>
    </div>
  );
};

export default CardBodySemRedux;
