import { Select } from "src/components/Shareable/Select";
import { required } from "src/helpers/fieldValidators";
import { TipoOcorrenciaInterface } from "src/interfaces/imr.interface";
import React, { ChangeEvent, Dispatch, SetStateAction } from "react";
import { Field } from "react-final-form";

type SeletorCategoriaType = {
  categorias: Array<{ nome: string; uuid: string }>;
  setTiposOcorrenciaDaCategoria: Dispatch<
    SetStateAction<TipoOcorrenciaInterface[]>
  >;
  tiposOcorrencia: Array<TipoOcorrenciaInterface>;
};

export const SeletorCategoria = ({ ...props }: SeletorCategoriaType) => {
  const { categorias, setTiposOcorrenciaDaCategoria, tiposOcorrencia } = props;

  return (
    <Field
      component={Select}
      name="categoria"
      label="Categoria da Ocorrência"
      options={[{ nome: "Selecione uma categoria", uuid: "" }, ...categorias]}
      onChangeEffect={(e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTiposOcorrenciaDaCategoria(
          tiposOcorrencia
            .filter((tipoOcorrencia) => tipoOcorrencia.categoria.uuid === value)
            .map((tipoOcorrencia) => {
              return {
                nome: tipoOcorrencia.titulo,
                ...tipoOcorrencia,
              };
            })
        );
      }}
      required
      validate={required}
    />
  );
};
