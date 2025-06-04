import React from "react";
import { Field } from "react-final-form";
import { TextArea } from "src/components/Shareable/TextArea/TextArea";

export const EditaisVinculados = () => {
  return (
    <div className="row">
      <div className="col-12">
        <p className="titulo-section">Editais Vinculados</p>
      </div>
      <div className="col-12">
        <Field
          component={TextArea}
          label="Editais Vinculados ao Produto"
          className="editais-vinculados-textarea"
          name="produto.editais_homologados"
          disabled
        />
      </div>
      <div className="col-12">
        <hr />
      </div>
    </div>
  );
};
