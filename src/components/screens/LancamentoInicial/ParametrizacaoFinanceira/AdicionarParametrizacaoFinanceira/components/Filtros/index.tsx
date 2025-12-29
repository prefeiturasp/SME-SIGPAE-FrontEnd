import moment from "moment";
import React, { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
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
import ModalConflito from "../ModalConflito";
import {
  toastSuccess,
  toastError,
} from "src/components/Shareable/Toast/dialogs";
import { useNavigate, useSearchParams } from "react-router-dom";
import ParametrizacaoFinanceiraService from "src/services/medicaoInicial/parametrizacao_financeira.service";
import { carregarValores } from "../../helpers";

type Cadastro = {
  setGrupoSelecionado: Dispatch<SetStateAction<string>>;
  setEditalSelecionado: Dispatch<SetStateAction<string>>;
  setLoteSelecionado: Dispatch<SetStateAction<string>>;
  setFaixasEtarias: Dispatch<SetStateAction<Array<FaixaEtaria>>>;
  setTiposAlimentacao: Dispatch<SetStateAction<Array<any>>>;
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
  const setEditalSelecionado = props.ehCadastro && props.setEditalSelecionado;
  const setLoteSelecionado = props.ehCadastro && props.setLoteSelecionado;
  const setFaixasEtarias = props.ehCadastro && props.setFaixasEtarias;
  const setTiposAlimentacao = props.ehCadastro && props.setTiposAlimentacao;
  const setParametrizacao = props.ehCadastro && props.setParametrizacao;
  const setCarregarTabelas = props.ehCadastro && props.setCarregarTabelas;
  const form = props.ehCadastro && props.form;
  const uuidParametrizacao = props.ehCadastro && props.uuidParametrizacao;
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const view = useView({
    setGrupoSelecionado,
    setEditalSelecionado,
    setLoteSelecionado,
    setFaixasEtarias,
    setTiposAlimentacao,
    setParametrizacao,
    uuidParametrizacao,
    form,
  });

  const [parametrizacaoConflito, setParametrizacaoConflito] = useState(null);

  const insereParametro = (parametro, valor) => {
    const params = new URLSearchParams(searchParams);
    params.set(parametro, valor);
    setSearchParams(params);
    setParametrizacaoConflito(null);
  };

  const onChangeConflito = async (opcao: string) => {
    try {
      if (opcao === "manter") {
        toastSuccess("Parametrização Financeira mantida com sucesso!");
        navigate(-1);
      } else if (opcao === "encerrar_copiar") {
        const { data_inicial, data_final, ...rest } = form.getState().values;

        const response =
          await ParametrizacaoFinanceiraService.cloneParametrizacaoFinanceira(
            parametrizacaoConflito,
            {
              data_inicial: data_inicial,
              data_final: data_final,
              ...rest,
            },
          );

        if (response.uuid) {
          form.change(
            "tabelas",
            carregarValores(
              response.tabelas,
              response.grupo_unidade_escolar.nome,
            ),
          );
          form.change("data_inicial", moment().format("DD/MM/YYYY"));
          insereParametro("nova_uuid", response.uuid);
          insereParametro("fluxo", "encerrar_copiar");
        } else
          toastError(
            "Erro ao encerrar e criar nova parametrização financeira.",
          );
      } else if (opcao === "encerrar_novo") {
        form.change("data_inicial", moment().format("DD/MM/YYYY"));
        await ParametrizacaoFinanceiraService.editParametrizacaoFinanceira(
          parametrizacaoConflito,
          { data_final: moment().subtract(1, "day").format("YYYY-MM-DD") },
        );
        insereParametro("fluxo", "encerrar_novo");
        setParametrizacaoConflito(null);
      }
    } catch {
      toastError("Ocorreu um erro inesperado");
    }
  };

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
                onChangeEffect={(e: ChangeEvent<HTMLInputElement>) => {
                  if (form) view.onChangeEdital(e.target.value);
                }}
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
                onChangeEffect={(e: ChangeEvent<HTMLInputElement>) => {
                  if (form) view.onChangeLote(e.target.value);
                }}
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
                onChangeEffect={(e: ChangeEvent<HTMLInputElement>) => {
                  if (form) view.onChangeTiposUnidades(e.target.value);
                }}
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
                disabled={uuidParametrizacao || searchParams.get("fluxo")}
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
                  onClick={() => {
                    if (!uuidParametrizacao && form)
                      view.getGruposPendentes(setParametrizacaoConflito);
                    setCarregarTabelas(true);
                  }}
                />
              </div>
            )}
          </>
        )}
      </FormSpy>
      <ModalConflito
        conflito={!!parametrizacaoConflito}
        setConflito={setParametrizacaoConflito}
        onContinuar={onChangeConflito}
      />
    </div>
  );
};
