import React from "react";
import { Field } from "react-final-form";
import { TextArea } from "src/components/Shareable/TextArea/TextArea";
import { formataJustificativa } from "../../helpers";

const JustificativaCancelamento = ({ dietaEspecial }) => {
  const justificativa = formataJustificativa(dietaEspecial);

  return (
    <div className="row mt-3 mb-3">
      <div className="col-12 mb-3">
        <label className="sectionName">Justificativa do Cancelamento</label>
      </div>
      {[
        "ESCOLA_CANCELOU",
        "ESCOLA_SOLICITOU_INATIVACAO",
        "CODAE_NEGOU_CANCELAMENTO",
      ].includes(dietaEspecial.status_solicitacao) ? (
        <div className="col-12">
          <div
            name="log_cancelamento"
            className="orientacoes"
            dangerouslySetInnerHTML={{
              __html: justificativa,
            }}
          />
        </div>
      ) : (
        <div className="col-12">
          <Field
            component={TextArea}
            name="log_cancelamento"
            disabled={true}
            defaultValue={justificativa}
          />
        </div>
      )}
    </div>
  );
};

export default JustificativaCancelamento;
