import React from "react";
import { Field } from "react-final-form";
import { InputText } from "src/components/Shareable/Input/InputText";
import { TextArea } from "src/components/Shareable/TextArea/TextArea";

export const InformacoesProduto = ({ homologacao }) => {
  return (
    <div className="row">
      <div className="col-12">
        <p className="titulo-section">Informações do Produto (Classificação)</p>
      </div>
      <div className="col-7">
        <Field
          component={InputText}
          label="Nº de registro do produto de órgão competente"
          name="produto.numero_registro"
          disabled={true}
        />
      </div>
      <div className="col-5">
        <Field
          component={InputText}
          label="Prazo de Validade"
          name="produto.prazo_validade"
          disabled={true}
        />
      </div>
      <div className="col-12">
        <Field
          component={InputText}
          label="Classificação de Grãos"
          name="produto.tipo"
          disabled={true}
        />
      </div>
      <div className="col-12">
        <p>Informações referentes ao volume e unidade de medida</p>
        <table className="table table-ficha-identificacao-produto">
          <thead>
            <tr>
              <th className="col-4">Volume</th>
              <th className="col-4">Unidade de Medida</th>
              <th className="col-4">Embalagem</th>
            </tr>
          </thead>
          <tbody>
            {homologacao.produto.especificacoes.map(
              (especificacao, especificacaoIndice) => {
                return (
                  <tr key={especificacaoIndice}>
                    <td className="col-4">{especificacao.volume}</td>
                    <td className="col-4">
                      {especificacao.unidade_de_medida.nome}
                    </td>
                    <td className="col-4">
                      {especificacao.embalagem_produto.nome}
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </div>
      <div className="col-12">
        <Field
          component={TextArea}
          label="Condições de armazenamento, conservação e prazo máximo para consumo após abertura da embalagem"
          name="produto.info_armazenamento"
          disabled={true}
        />
      </div>
      <div className="col-12">
        <Field
          component={TextArea}
          label="Outras informações"
          name="produto.outras_informacoes"
          disabled={true}
        />
      </div>
      <div className="col-12">
        <hr />
      </div>
    </div>
  );
};
export default InformacoesProduto;
