import React from "react";
import { Field } from "redux-form";
import ManagedInputFileField from "../../../../../Shareable/Input/InputFile/ManagedField";
import CKEditorField from "src/components/Shareable/CKEditorField";
import { required } from "src/helpers/fieldValidators";

export default ({ pertence_a_escola }) => {
  return (
    <>
      <section className="row attachments">
        <div className="col-9">
          <div className="card-title fw-bold cinza-escuro mt-4">
            <span className="required-asterisk">*</span>
            Laudo
          </div>
          <div className="text">
            Anexe o laudo fornecido pelo profissional. Sem ele, a solicitação de
            dieta especial será negada.
          </div>
          <div className="card-warning mt-2">
            <strong>IMPORTANTE:</strong> Envie um arquivo formato .doc, .docx,
            .pdf, .png, .jpg ou .jpeg, com até 10Mb. <br /> O Laudo deve ter
            sido emitido há, no máximo, 12 meses.
          </div>
        </div>
        <div className="col-3 btn">
          <Field
            component={ManagedInputFileField}
            dataTestId="input-laudo-anexo"
            className="inputfile"
            texto="Anexar"
            name="anexos"
            accept=".png, .doc, .pdf, .docx, .jpeg, .jpg"
            validate={[required]}
            concatenarNovosArquivos
            toastSuccessMessage={"Laudo incluído com sucesso"}
            disabled={pertence_a_escola !== true}
          />
        </div>
      </section>
      <section className="row mt-5 mb-5">
        <div className="col-12">
          <Field
            component={CKEditorField}
            label="Observações"
            name="observacoes"
            className="form-control"
            disabled={pertence_a_escola !== true}
          />
        </div>
      </section>
    </>
  );
};
