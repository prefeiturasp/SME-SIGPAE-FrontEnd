import { Select } from "src/components/Shareable/Select";
import { required } from "src/helpers/fieldValidators";
import { TipoOcorrenciaInterface } from "src/interfaces/imr.interface";
import React, { ChangeEvent, Dispatch, SetStateAction } from "react";
import { Field } from "react-final-form";
import { RegistrarNovaOcorrenciaFormInterface } from "../../interfaces";
import { FormApi } from "final-form";

type SeletorTipoOcorrenciaType = {
  setTipoOcorrencia: Dispatch<SetStateAction<TipoOcorrenciaInterface>>;
  tiposOcorrencia: Array<TipoOcorrenciaInterface>;
  tiposOcorrenciaDaCategoria: Array<TipoOcorrenciaInterface>;
  values: RegistrarNovaOcorrenciaFormInterface;
  form: FormApi;
};

export const SeletorTipoOcorrencia = ({
  ...props
}: SeletorTipoOcorrenciaType) => {
  const {
    setTipoOcorrencia,
    tiposOcorrenciaDaCategoria,
    tiposOcorrencia,
    values,
    form,
  } = props;

  return (
    <Field
      component={Select}
      name="tipo_ocorrencia"
      label="Tipos de Ocorrência"
      options={[
        {
          nome: "Selecione um tipo de ocorrência",
          uuid: "",
        },
        ...tiposOcorrenciaDaCategoria,
      ]}
      required
      validate={required}
      disabled={!values.categoria}
      naoDesabilitarPrimeiraOpcao
      onChangeEffect={async (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        await setTipoOcorrencia(
          tiposOcorrencia.find(
            (tipoOcorrencia) => tipoOcorrencia.uuid === value
          )
        );
        await form.change("grupos", [{}]);
      }}
    />
  );
};
