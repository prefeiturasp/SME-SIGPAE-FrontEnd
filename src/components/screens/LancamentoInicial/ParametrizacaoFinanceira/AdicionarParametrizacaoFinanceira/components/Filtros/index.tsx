import moment from "moment";
import React, { ChangeEvent, Dispatch, SetStateAction } from "react";
import { Field, FormSpy } from "react-final-form";
import { FormApi } from "final-form";
import { required } from "src/helpers/fieldValidators";
import { Select } from "src/components/Shareable/Select";
import useView from "./view";
import { InputComData } from "src/components/Shareable/DatePicker";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import {
  ParametrizacaoFinanceiraPayload,
  FaixaEtaria,
} from "src/services/medicaoInicial/parametrizacao_financeira.interface";

type Cadastro = {
  setGrupoSelecionado: Dispatch<SetStateAction<string>>;
  setFaixasEtarias: Dispatch<SetStateAction<Array<FaixaEtaria>>>;
  setParametrizacao: Dispatch<SetStateAction<ParametrizacaoFinanceiraPayload>>;
  setCarregarTabelas: Dispatch<SetStateAction<boolean>>;
  form: FormApi<any, any>;
  uuidParametrizacao: string | null;
  ehCadastro: true;
};

type Filtro = {
  ehCadastro?: false;
};

type Props = Cadastro | Filtro;

export default (props: Props) => {
  const ehCadastro = props.ehCadastro;
  const setGrupoSelecionado = props.ehCadastro && props.setGrupoSelecionado;
  const setFaixasEtarias = props.ehCadastro && props.setFaixasEtarias;
  const setParametrizacao = props.ehCadastro && props.setParametrizacao;
  const setCarregarTabelas = props.ehCadastro && props.setCarregarTabelas;
  const form = props.ehCadastro && props.form;
  const uuidParametrizacao = props.ehCadastro && props.uuidParametrizacao;

  const view = useView({
    setGrupoSelecionado,
    setFaixasEtarias,
    setParametrizacao,
    uuidParametrizacao,
    form,
  });

  return (
    <div className="row">
      <FormSpy subscription={{ values: true }}>
        {({ values }) => (
          <>
            <div className="col-4">
              <Field
                dataTestId="edital-select"
                component={Select}
                name="edital"
                label="Nº do Edital"
                naoDesabilitarPrimeiraOpcao
                options={view.editais}
                validate={ehCadastro && required}
                required={ehCadastro}
                disabled={uuidParametrizacao}
              />
            </div>
            <div className="col-8">
              <Field
                dataTestId="lote-select"
                component={Select}
                name="lote"
                label="Lote e DRE"
                naoDesabilitarPrimeiraOpcao
                options={view.lotes}
                validate={ehCadastro && required}
                required={ehCadastro}
                disabled={uuidParametrizacao}
              />
            </div>
            <div className="col-4">
              <Field
                dataTestId="grupo-unidade-select"
                component={Select}
                name="grupo_unidade_escolar"
                label="Tipo de Unidade"
                naoDesabilitarPrimeiraOpcao
                options={view.gruposUnidadesOpcoes}
                validate={ehCadastro && required}
                required={ehCadastro}
                onChangeEffect={(e: ChangeEvent<HTMLInputElement>) =>
                  view.onChangeTiposUnidades(e.target.value)
                }
                disabled={uuidParametrizacao}
              />
            </div>
            <div className="col-3">
              <Field
                dataTestId="data-inicial-input"
                component={InputComData}
                label="Período de Vigência"
                name="data_inicial"
                className="data-inicio"
                placeholder="De"
                validate={ehCadastro && required}
                required={ehCadastro}
                minDate={false}
                maxDate={
                  values.data_final
                    ? moment(values.data_final, "DD/MM/YYYY").toDate()
                    : null
                }
                disabled={uuidParametrizacao}
              />
            </div>
            <div className="col-3">
              <Field
                dataTestId="data-final-input"
                component={InputComData}
                label="&nbsp;"
                name="data_final"
                className="data-final"
                popperPlacement="bottom-end"
                placeholder="Até"
                minDate={
                  values.data_inicial
                    ? moment(values.data_inicial, "DD/MM/YYYY").toDate()
                    : null
                }
              />
            </div>
            {ehCadastro && (
              <div className="col-2 mt-1">
                <br />
                <Botao
                  dataTestId="botao-carregar"
                  texto="Carregar Tabelas"
                  disabled={
                    !(
                      values.edital &&
                      values.lote &&
                      values.grupo_unidade_escolar &&
                      values.data_inicial
                    )
                  }
                  style={BUTTON_STYLE.ORANGE_OUTLINE}
                  type={BUTTON_TYPE.BUTTON}
                  onClick={() => setCarregarTabelas(true)}
                />
              </div>
            )}
          </>
        )}
      </FormSpy>
    </div>
  );
};
