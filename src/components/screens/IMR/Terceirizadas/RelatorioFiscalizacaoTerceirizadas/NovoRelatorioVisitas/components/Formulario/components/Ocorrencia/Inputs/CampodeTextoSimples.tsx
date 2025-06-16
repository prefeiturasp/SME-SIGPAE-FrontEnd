import React from "react";
import { Field } from "react-final-form";
import { InputText } from "src/components/Shareable/Input/InputText";
import { required } from "src/helpers/fieldValidators";

type CampodeTextoSimplesType = {
  titulo: string;
  name: string;
  somenteLeitura: boolean;
};

export const CampodeTextoSimples = ({ ...props }: CampodeTextoSimplesType) => {
  const { titulo, name, somenteLeitura } = props;

  return (
    <Field
      component={InputText}
      label={titulo}
      name={name}
      required
      validate={required}
      disabled={somenteLeitura}
    />
  );
};
