import React from "react";
import { Link } from "react-router-dom";

import Botao from "components/Shareable/Botao";
import { BUTTON_STYLE } from "components/Shareable/Botao/constants";

import "./styles.scss";
import { Form, Field } from "react-final-form";
import InputText from "components/Shareable/Input/InputText";

const CabecalhoPainel = ({ totalDietasAtivas, totalDietasInativas }) => (
  <div className="row cabecalho-painel">
    <div className="col-4">
      <i className="fas fa-check-circle" />
      <span>Total de Dietas Ativas: {totalDietasAtivas}</span>
    </div>
    <div className="col-4">
      <i className="fas fa-times-circle" />
      <span>Total de Dietas Inativas: {totalDietasInativas}</span>
    </div>
  </div>
);

const TabelaDietas = ({ solicitacoes }) => {
  if (solicitacoes === undefined || solicitacoes.length === 0) {
    return <div>Carregando...</div>;
  }
  return (
    <div className="row">
      <div className="col-12">
        {solicitacoes.map((dados, key) => {
          return (
            <div key={key}>
              <div className="mt-4 pt-4 info-unid-escolar">
                <p className="mb-0">Unidade Escolar</p>
                <p>
                  {dados.codigo_eol_escola} {dados.escola}
                </p>
              </div>
              <div className="row col-12 m-0 p-0">
                <div className="col-xl-1 col-lg-2 my-auto p-0 foto-aluno">
                  <img
                    src={dados.foto_aluno || "/assets/image/no-avatar.png"}
                    alt="foto-aluno"
                  />
                </div>
                <div className="col-xl-11 col-lg-10 pr-0 pl-4">
                  <div className="mb-3">
                    <Form
                      onSubmit={() => {}}
                      render={() => (
                        <form className="row">
                          <div className="col-lg-4">
                            <Field
                              label="Cód. EOL do Aluno"
                              component={InputText}
                              className="input-info-aluno"
                              name="cod-eol-aluno"
                              disabled={true}
                              defaultValue={dados.codigo_eol}
                            />
                          </div>
                          <div className="col-lg-8">
                            <Field
                              label="Nome Completo do Aluno"
                              component={InputText}
                              name="nome-aluno"
                              className="input-info-aluno"
                              disabled={true}
                              defaultValue={dados.nome}
                            />
                          </div>
                        </form>
                      )}
                    />
                  </div>
                  <div className="row">
                    <div className="row col-lg-8 ml-0">
                      <div>
                        <p className="font-weight-bold mb-0">
                          Quantidade Ativas <br />
                        </p>
                        {dados.ativas}
                      </div>
                      <div className="pl-4">
                        <p className="font-weight-bold mb-0">
                          Quantidade Inativas <br />
                        </p>
                        {dados.inativas}
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <Link
                        to={`/aluno/dieta-especial?codigo_eol=${
                          dados.codigo_eol
                        }`}
                        className="float-right"
                      >
                        <Botao
                          texto="Visualizar"
                          icon={undefined}
                          style={BUTTON_STYLE.GREEN_OUTLINE}
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ({ dadosDietaPorAluno }) => {
  const { total_ativas, total_inativas, solicitacoes } = dadosDietaPorAluno;

  return (
    <div>
      <CabecalhoPainel
        totalDietasAtivas={total_ativas}
        totalDietasInativas={total_inativas}
      />
      <TabelaDietas solicitacoes={solicitacoes} />
    </div>
  );
};
