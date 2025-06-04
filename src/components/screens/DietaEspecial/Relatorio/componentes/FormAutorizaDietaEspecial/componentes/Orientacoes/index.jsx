import React from "react";
import { Field } from "react-final-form";
import CKEditorField from "src/components/Shareable/CKEditorField";
import {
  peloMenosUmCaractere,
  textAreaRequired,
} from "src/helpers/fieldValidators";

const Orientacoes = () => {
  return (
    <div className="row">
      <div className="col-12">
        <Field
          component={CKEditorField}
          label="Orientações Gerais"
          name="orientacoes_gerais"
          validate={(textAreaRequired, peloMenosUmCaractere)}
          required
        />
      </div>
    </div>
  );
};

export default Orientacoes;
