import React from "react";
import { Field } from "react-final-form";
import { TextArea } from "src/components/Shareable/TextArea/TextArea";

export const EditaisSuspensos = () => {
  return (
    <div className="row">
      <div className="col-12">
        <p className="titulo-section">Produto Suspenso nos Editais</p>
      </div>
      <div className="col-12">
        <Field
          component={TextArea}
          label="Produto Suspenso nos Editais"
          className="editais-vinculados-textarea"
          name="produto.editais_suspensos"
          disabled
        />
      </div>
      <div className="col-12">
        <hr />
      </div>
    </div>
  );
};
