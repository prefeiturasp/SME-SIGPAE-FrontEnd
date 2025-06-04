import React from "react";
import { Field } from "react-final-form";
import { InputText } from "src/components/Shareable/Input/InputText";
import { TextArea } from "src/components/Shareable/TextArea/TextArea";

export const IdentificacaoProduto = ({ homologacao }) => {
  return (
    <div className="row">
      <div className="col-12">
        <p className="titulo-section">Identificação do Produto</p>
      </div>
      <div className="col-12">
        <Field
          component={InputText}
          label="Nome do Produto"
          name="produto.nome"
          disabled={true}
        />
      </div>
      <div className="col-6">
        <Field
          component={InputText}
          label="Marca"
          name="produto.marca.nome"
          disabled={true}
        />
      </div>
      <div className="col-6">
        <Field
          component={InputText}
          label="Fabricante"
          name="produto.fabricante.nome"
          disabled={true}
        />
      </div>
      <div className="col-12">
        <Field
          component={InputText}
          label="O produto se destina a alimentação de alunos com dieta especial?"
          name="produto.dieta_especial"
          disabled={true}
        />
      </div>
      <div className="col-12">
        <Field
          component={TextArea}
          label="Componentes do Produto"
          name="produto.componentes"
          disabled={true}
        />
      </div>
      <div className="col-7">
        <Field
          component={InputText}
          label="O produto contém ou pode conter ingredientes/aditivos alergênicos?"
          name="produto.aditivos_alergicos"
          disabled={true}
        />
      </div>
      <div className="col-5">
        <p className="importante-section">IMPORTANTE</p>
        <p className="importante-infobox">
          Relacioná-los conforme dispõe a RDC nº 26 de 02/07/15
        </p>
      </div>
      {homologacao.produto.aditivos && (
        <div
          className={`${homologacao.produto.aditivos && "ajusta-mt"} col-12`}
        >
          <Field
            component={InputText}
            label="Quais Alergênicos?"
            name="produto.aditivos"
            disabled={true}
          />
        </div>
      )}
      <div
        className={`${
          !homologacao.produto.tem_aditivos_alergenicos && "ajusta-mt"
        } col-7`}
      >
        <Field
          component={InputText}
          label="Contém Glútem?"
          name="produto.tem_gluten"
          disabled={true}
        />
      </div>
      <div className="col-12">
        <hr />
      </div>
    </div>
  );
};
export default IdentificacaoProduto;
