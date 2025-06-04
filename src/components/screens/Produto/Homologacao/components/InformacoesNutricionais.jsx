import React from "react";
import { Field } from "react-final-form";
import { InputText } from "src/components/Shareable/Input/InputText";

export const InformacoesNutricionais = ({ homologacao }) => {
  return (
    <div className="row">
      <div className="col-12">
        <p className="titulo-section">Informações Nutricionais</p>
      </div>
      <div className="col-7">
        <Field
          component={InputText}
          label="Porção"
          name="produto.porcao"
          disabled={true}
        />
      </div>
      <div className="col-5">
        <Field
          component={InputText}
          label="Unidade Caseira"
          name="produto.unidade_caseira"
          disabled={true}
        />
      </div>
      <div className="col-12 mt-2">
        <table className="table table-ficha-identificacao-produto">
          <thead>
            <tr>
              <th className="col-6">Título</th>
              <th className="col-3">Quantidade por porção</th>
              <th className="col-3">{`%VD(*)`}</th>
            </tr>
          </thead>
          <tbody>
            {homologacao.produto.informacoes_nutricionais.map(
              (informacaoNutricional, informacaoNutricionalIndice) => {
                return (
                  <tr key={informacaoNutricionalIndice}>
                    <td className="col-4">
                      {informacaoNutricional.informacao_nutricional.nome}
                    </td>
                    <td className="col-4">
                      {informacaoNutricional.quantidade_porcao}
                    </td>
                    <td className="col-4">
                      {informacaoNutricional.valor_diario}
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </div>
      <div className="col-12 info-calorias">
        * % Valores Diários com base em uma dieta de 2.000kcal ou 8.400kJ. Seus
        Valores Diários podem ser maiores ou menores dependendo de suas
        necessidades energéticas.
      </div>
      <div className="col-12">
        <hr />
      </div>
    </div>
  );
};
export default InformacoesNutricionais;
