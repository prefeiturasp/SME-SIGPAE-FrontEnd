import React from "react";
import { Field } from "react-final-form";
import CKEditorField from "src/components/Shareable/CKEditorField";
import {
  peloMenosUmCaractere,
  textAreaRequired,
} from "src/helpers/fieldValidators";

const InformacoesAdicionais = () => {
  return (
    <div className="row mt-3">
      <div className="col-12">
        <Field
          component={CKEditorField}
          label="Informações Adicionais"
          name="informacoes_adicionais"
          required
          validate={(textAreaRequired, peloMenosUmCaractere)}
        />
      </div>
    </div>
  );
};

export default InformacoesAdicionais;
