import React from "react";

import { Field } from "react-final-form";
import { FormApi } from "final-form";
import { Skeleton } from "antd";

import Select from "src/components/Shareable/Select";
import MultiSelect from "src/components/Shareable/FinalForm/MultiSelect";
import AutoCompleteSelectField from "src/components/Shareable/AutoCompleteSelectField";

import {
  usuarioEhDRE,
  usuarioEhEscolaTerceirizadaQualquerPerfil,
} from "src/helpers/utilities";

import useView from "./view";

import { Filtros } from "../../types";

type Props = {
  form: FormApi;
  // eslint-disable-next-line
  onChange: (values: Filtros) => void;
};

export default (props: Props) => {
  const { form, onChange } = props;

  const view = useView({ form, onChange });

  return (
    <div className="row">
      <div className="col-4">
        {view.buscandoOpcoes.buscandoMesesAnos ? (
          <Skeleton paragraph={false} active />
        ) : (
          <Field
            component={Select}
            label="Mês de Referência"
            name="mes"
            placeholder="Selecione o mês de referência"
            options={view.mesesAnosOpcoes}
            required
            naoDesabilitarPrimeiraOpcao
            validate={view.validaMesAno}
            onChangeEffect={view.onChangeMesAno}
          />
        )}
      </div>

      <div className="col-8">
        {view.buscandoOpcoes.buscandoDiretoriasRegionais ? (
          <Skeleton paragraph={false} active />
        ) : (
          <Field
            component={Select}
            label="DRE"
            name="dre"
            placeholder="Selecione uma DRE"
            options={view.diretoriasRegionaisOpcoes}
            naoDesabilitarPrimeiraOpcao
            onChangeEffect={view.onChangeDRE}
            disabled={
              usuarioEhDRE() || usuarioEhEscolaTerceirizadaQualquerPerfil()
            }
          />
        )}
      </div>

      <div className="col-4">
        {view.buscandoOpcoes.buscandoLotes ? (
          <Skeleton paragraph={false} active />
        ) : (
          <Field
            component={MultiSelect}
            disableSearch
            label="Lotes"
            name="lotes"
            placeholder="Selecione os lotes"
            options={view.lotesOpcoes}
            nomeDoItemNoPlural="lotes"
            onChangeEffect={view.onChangeLotes}
          />
        )}
      </div>

      <div className="col-8">
        {view.buscandoOpcoes.buscandoUnidadesEducacionais ? (
          <Skeleton paragraph={false} active />
        ) : (
          <Field
            component={AutoCompleteSelectField}
            label="Unidade Educacional"
            name="unidade_educacional"
            placeholder="Selecione uma Unidade Educacional"
            options={view.unidadesEducacionaisOpcoes}
            filterOption={view.filtraUnidadesEducacionaisOpcoes}
            onSelect={view.onChangeUnidadeEducacional}
            disabled={usuarioEhEscolaTerceirizadaQualquerPerfil()}
          />
        )}
      </div>

      <div className="col-4">
        {view.buscandoOpcoes.buscandoPeriodosEscolares ? (
          <Skeleton paragraph={false} active />
        ) : (
          <Field
            component={MultiSelect}
            disableSearch
            label="Período"
            name="periodos"
            nomeDoItemNoPlural="períodos"
            placeholder="Selecione os períodos"
            options={view.periodosEscolaresOpcoes}
          />
        )}
      </div>

      <div className="col-4">
        {view.buscandoOpcoes.buscandoTiposAlimentacao ? (
          <Skeleton paragraph={false} active />
        ) : (
          <Field
            component={MultiSelect}
            disableSearch
            label="Tipo de Alimentação"
            name="tipos_alimentacao"
            nomeDoItemNoPlural="alimentações"
            placeholder="Selecione os tipos de alimentação"
            options={view.tiposAlimentacaoOpcoes}
          />
        )}
      </div>
    </div>
  );
};
