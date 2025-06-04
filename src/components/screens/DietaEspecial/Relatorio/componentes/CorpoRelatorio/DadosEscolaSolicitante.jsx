import React from "react";
import { Field } from "react-final-form";
import { InputText } from "src/components/Shareable/Input/InputText";

const DadosEscolaSolicitante = () => {
  return (
    <div className="row mb-3">
      <div className="col-12 mb-3">
        <label className="sectionName">Dados da Escola Solicitante</label>
      </div>
      <div className="col-5">
        <Field
          component={InputText}
          name="escola.nome"
          label="Nome"
          disabled={true}
        />
      </div>
      <div className="col-2">
        <Field
          component={InputText}
          name="escola.contato.telefone"
          label="Telefone"
          disabled={true}
        />
      </div>
      <div className="col-5">
        <Field
          component={InputText}
          name="escola.contato.email"
          label="E-mail"
          disabled={true}
        />
      </div>
      <div className="col-6">
        <Field
          component={InputText}
          name="escola.diretoria_regional.nome"
          label="DRE"
          disabled={true}
        />
      </div>
      <div className="col-3">
        <Field
          component={InputText}
          name="escola.lote.nome"
          label="Lote"
          disabled={true}
        />
      </div>
      <div className="col-3">
        <Field
          component={InputText}
          name="escola.tipo_gestao.nome"
          label="Tipo de Gestão"
          disabled={true}
        />
      </div>
    </div>
  );
};

export default DadosEscolaSolicitante;
