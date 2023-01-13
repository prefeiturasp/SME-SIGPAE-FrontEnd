import React from "react";
import { Form, Field } from "react-final-form";

import BorderlessInput from "../BorderlessInput";

import "./styles.scss";

export default () => {
  const programas = [
    { uuid: "maisedu", nome: "Mais Educação" },
    { uuid: "spintegral", nome: "SP Integral" },
    { uuid: "etec", nome: "ETEC" }
  ];
  const periodos = [
    { uuid: "lanche", nome: "Lanche" },
    { uuid: "lanche4h", nome: "Lanche 4h" },
    { uuid: "refeicao", nome: "Refeição/sobremesa" },
    { uuid: "refeicaoeja", nome: "Refeição EJA/sobremesa" }
  ];
  return (
    <div className="programas-autorizados">
      <div className="row">
        <div className="col report-label-value">
          <p className="value">Programas/projetos pedagógicos autorizados</p>
        </div>
      </div>
      <div className="cabecalho-tabela">
        <div>Programas/projetos*</div>
        <div>Lanche</div>
        <div>Lanche 4 h</div>
        <div>Refeição/sobremesa</div>
        <div>Refeição EJA/sobremesa</div>
      </div>
      <Form
        onSubmit={() => {}}
        render={() => {
          return (
            <>
              {programas.map((programa, index) => (
                <div key={index} className="linha-tabela">
                  <div>{programa.nome}</div>
                  {periodos.map((periodo, index2) => (
                    <Field
                      key={index2}
                      name={`${programa.uuid}.${periodo.uuid}`}
                      component={BorderlessInput}
                    />
                  ))}
                </div>
              ))}
            </>
          );
        }}
      />
      <div className="texto-rodape">
        * Informar nº de alunos matriculados nos programas/projetos autorizados
        por tipo de alimentação
      </div>
    </div>
  );
};
