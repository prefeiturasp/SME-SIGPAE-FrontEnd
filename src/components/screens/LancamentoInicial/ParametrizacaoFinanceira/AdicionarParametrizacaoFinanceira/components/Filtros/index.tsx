import React, { ChangeEvent, Dispatch, SetStateAction } from "react";
import { Skeleton } from "antd";
import { Field } from "react-final-form";
import { FormApi } from "final-form";

import { required } from "src/helpers/fieldValidators";

import { Select } from "src/components/Shareable/Select";

import useView from "./view";

type FormValues = {
  edital: string;
  lote: string;
  tipos_unidades: string;
  tabelas?: Record<string, any>;
  legenda: string;
};

type Cadastro = {
  setTiposAlimentacao: Dispatch<SetStateAction<Array<any>>>;
  setGrupoSelecionado: Dispatch<SetStateAction<string>>;
  setFaixasEtarias: Dispatch<SetStateAction<Array<any>>>;
  setParametrizacao: Dispatch<SetStateAction<FormValues>>;
  form: FormApi<any, any>;
  uuidParametrizacao: string;
  ehCadastro: true;
};

type Filtro = {
  ehCadastro?: false;
};

type Props = Cadastro | Filtro;

export default ({ ...props }: Props) => {
  const ehCadastro = props.ehCadastro;
  const setTiposAlimentacao = props.ehCadastro && props.setTiposAlimentacao;
  const setGrupoSelecionado = props.ehCadastro && props.setGrupoSelecionado;
  const setFaixasEtarias = props.ehCadastro && props.setFaixasEtarias;
  const setParametrizacao = props.ehCadastro && props.setParametrizacao;
  const form = props.ehCadastro && props.form;
  const uuidParametrizacao = props.ehCadastro && props.uuidParametrizacao;

  const view = useView({
    setTiposAlimentacao,
    setGrupoSelecionado,
    setFaixasEtarias,
    setParametrizacao,
    uuidParametrizacao,
    form,
  });

  return (
    <div className="row">
      <div className="col-4">
        {view.carregando ? (
          <Skeleton paragraph={false} active />
        ) : (
          <Field
            component={Select}
            name="edital"
            label="Nº do Edital"
            naoDesabilitarPrimeiraOpcao
            options={view.editais}
            validate={ehCadastro && required}
            required={ehCadastro}
            disabled={uuidParametrizacao}
          />
        )}
      </div>

      <div className="col-8">
        {view.carregando ? (
          <Skeleton paragraph={false} active />
        ) : (
          <Field
            component={Select}
            name="lote"
            label="Lote e DRE"
            naoDesabilitarPrimeiraOpcao
            options={view.lotes}
            validate={ehCadastro && required}
            required={ehCadastro}
            disabled={uuidParametrizacao}
          />
        )}
      </div>

      <div className="col-4">
        {view.carregando ? (
          <Skeleton paragraph={false} active />
        ) : (
          <Field
            component={Select}
            name="tipos_unidades"
            label="Tipo de Unidade"
            naoDesabilitarPrimeiraOpcao
            options={view.tiposUnidadesOpcoes}
            validate={ehCadastro && required}
            required={ehCadastro}
            onChangeEffect={(e: ChangeEvent<HTMLInputElement>) =>
              ehCadastro && view.onChangeTiposUnidades(e.target.value)
            }
            disabled={uuidParametrizacao}
          />
        )}
      </div>
    </div>
  );
};
