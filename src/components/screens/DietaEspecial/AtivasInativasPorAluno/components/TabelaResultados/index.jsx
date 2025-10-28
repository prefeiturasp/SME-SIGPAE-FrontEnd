import { Link } from "react-router-dom";

import Botao from "src/components/Shareable/Botao";
import { BUTTON_STYLE } from "src/components/Shareable/Botao/constants";

import { Field, Form } from "react-final-form";
import InputText from "src/components/Shareable/Input/InputText";
import "./styles.scss";

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

  const gerarLink = (dados) => {
    let link = "";
    if (!dados.codigo_eol) {
      link = `/aluno/dieta-especial?eh_aluno_nao_matriculado=true&codigo_eol_escola=${dados.codigo_eol_escola}&nome_aluno=${dados.nome}`;
    } else {
      link = `/aluno/dieta-especial?codigo_eol=${dados.codigo_eol}&codigo_eol_escola=${dados.codigo_eol_escola}`;
    }
    return link;
  };

  return (
    <div className="row">
      <div className="col-12">
        {solicitacoes.map((dados, key) => {
          return (
            <div key={key}>
              <div className="mt-4 pt-4 info-unid-escolar">
                <p className="mb-0 texto-destacado">Unidade Educacional:</p>
                <p className="mx-1">
                  {dados.codigo_eol_escola} {dados.escola}
                </p>
              </div>
              <div className="col-12 m-0 p-0">
                <div className="pe-0 ps-0">
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
                    <div className="row col-lg-10 ms-0">
                      <div className="flex-row">
                        <div className="flex-row">
                          <p className="fw-bold mb-0">Quantidade Ativas:</p>
                          <span className="texto-destacado mx-1">
                            {dados.ativas}
                          </span>
                        </div>

                        <div className="ps-4 flex-row">
                          <p className="fw-bold mb-0">
                            Classificação da Dieta Especial:
                          </p>
                          <span className="texto-destacado mx-1">
                            {dados.classificacao_dieta_ativa || "--"}
                          </span>
                        </div>
                      </div>

                      <div className="mt-2 flex-row">
                        <p className="fw-bold mb-0">Quantidade Inativas:</p>
                        <span className="texto-destacado mx-1">
                          {dados.inativas}
                        </span>
                      </div>
                    </div>
                    <div className="col-lg-2 pe-0">
                      <Link to={gerarLink(dados)} className="float-end">
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
