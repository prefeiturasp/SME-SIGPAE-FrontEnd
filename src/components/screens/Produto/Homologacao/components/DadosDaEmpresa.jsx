import React from "react";
import { Field } from "react-final-form";
import { InputText } from "src/components/Shareable/Input/InputText";

export const DadosDaEmpresa = () => {
  return (
    <div className="row">
      <div className="col-12">
        <p className="titulo-section">
          Dados da Empresa Solicitante (Terceirizada)
        </p>
      </div>
      <div className="col-5">
        <Field
          component={InputText}
          label="Empresa Solicitante (Terceirizada)"
          name="rastro_terceirizada.nome_fantasia"
          disabled={true}
        />
      </div>
      <div className="col-3">
        <Field
          component={InputText}
          label="Telefone"
          name="rastro_terceirizada.contatos[0].telefone"
          disabled={true}
        />
      </div>
      <div className="col-4">
        <Field
          component={InputText}
          label="E-mail"
          name="rastro_terceirizada.contatos[0].email"
          disabled={true}
        />
      </div>
      <div className="col-12">
        <hr />
      </div>
    </div>
  );
};
export default DadosDaEmpresa;
