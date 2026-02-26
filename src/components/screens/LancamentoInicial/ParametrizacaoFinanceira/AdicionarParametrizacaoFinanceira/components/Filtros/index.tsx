import moment from "moment";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
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
import ModalConflito from "../ModalConflito";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import { useSearchParams } from "react-router-dom";
import ModalCopiar from "../ModalCopiar";

type Cadastro = {
  setCarregarTabelas: Dispatch<SetStateAction<boolean>>;
  form: FormApi<any, any>;
  uuidParametrizacao: string | null;
  ehCadastro: true;
  view: ReturnType<typeof useView>;
};

type Filtro = {
  ehCadastro?: false;
};

type Props = Cadastro | Filtro;

export default (props: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showCopiar, setShowCopiar] = useState(false);

  const ehCadastro = props.ehCadastro === true;

  const onChangeCopiar = async () => {
    if (!ehCadastro) return;

    try {
      const { uuidParametrizacao, setCarregarTabelas } = props;

      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        if (uuidParametrizacao) params.set("uuid_origem", uuidParametrizacao);
        params.delete("uuid");
        return params;
      });

      setCarregarTabelas(true);
    } catch {
      toastError("Erro ao copiar dados da parametrização financeira.");
    }
  };

  return (
    <div className="row">
      <FormSpy subscription={{ values: true }}>
        {({ values }) => {
          const view = ehCadastro ? props.view : undefined;
          const form = ehCadastro ? props.form : undefined;
          const uuidParametrizacao = ehCadastro
            ? props.uuidParametrizacao
            : null;

          return (
            <>
              <div className="col-4">
                <Field
                  dataTestId="edital-select"
                  component={Select}
                  name="edital"
                  label="Nº do Edital"
                  naoDesabilitarPrimeiraOpcao
                  options={view?.editais}
                  validate={ehCadastro ? required : undefined}
                  required={ehCadastro}
                  disabled={!!uuidParametrizacao}
                  onChangeEffect={(e: ChangeEvent<HTMLInputElement>) => {
                    if (ehCadastro && form) view.onChangeEdital(e.target.value);
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
                  options={view?.lotes}
                  validate={ehCadastro ? required : undefined}
                  required={ehCadastro}
                  disabled={!!uuidParametrizacao}
                  onChangeEffect={(e: ChangeEvent<HTMLInputElement>) => {
                    if (ehCadastro && form) view.onChangeLote(e.target.value);
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
                  options={view?.gruposUnidadesOpcoes}
                  validate={ehCadastro ? required : undefined}
                  required={ehCadastro}
                  onChangeEffect={(e: ChangeEvent<HTMLInputElement>) => {
                    if (ehCadastro && form)
                      view.onChangeTiposUnidades(e.target.value);
                  }}
                  disabled={!!uuidParametrizacao}
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
                  validate={ehCadastro ? required : undefined}
                  required={ehCadastro}
                  minDate={false}
                  maxDate={
                    values.data_final
                      ? moment(values.data_final, "DD/MM/YYYY").toDate()
                      : null
                  }
                  disabled={!!uuidParametrizacao || !!searchParams.get("fluxo")}
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
                    dataTestId={
                      uuidParametrizacao
                        ? "botao-criar-copia"
                        : "botao-carregar"
                    }
                    texto={
                      uuidParametrizacao ? "Criar Cópia" : "Carregar Tabelas"
                    }
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
                      if (!ehCadastro) return;

                      const { uuidParametrizacao, setCarregarTabelas, view } =
                        props;

                      if (uuidParametrizacao) {
                        setShowCopiar(true);
                      } else {
                        view.getGruposPendentes();
                        setCarregarTabelas(true);
                      }
                    }}
                  />
                </div>
              )}
            </>
          );
        }}
      </FormSpy>

      {ehCadastro && (
        <>
          <ModalConflito
            conflito={props.view.parametrizacaoConflito}
            setConflito={props.view.setParametrizacaoConflito}
            onContinuar={props.view.onChangeConflito}
          />
          <ModalCopiar
            showModal={showCopiar}
            setShowModal={setShowCopiar}
            onCopiar={onChangeCopiar}
          />
        </>
      )}
    </div>
  );
};
