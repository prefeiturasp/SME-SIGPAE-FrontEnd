import { Spin } from "antd";
import { InputText } from "components/Shareable/Input/InputText";
import { ASelect } from "components/Shareable/MakeField";
import { GESTAO_PRODUTO } from "configs/constants";
import { listarCardsPermitidos } from "helpers/gestaoDeProdutos";
import { dataAtual } from "helpers/utilities";
import HTTP_STATUS from "http-status-codes";
import React, { useEffect, useState } from "react";
import { Field, Form } from "react-final-form";
import { getProdutosPendenteHomologacao } from "services/dashboardGestaoProduto";
import { getNomesUnicosEditais } from "services/produto.service";
import { CardPainel } from "./componentes/CardPainel";
import { formataCards } from "./helper";
import { usuarioEhEmpresa } from "../../../helpers/utilities";

export const DashboardGestaoProduto = () => {
  const [editais, setEditais] = useState();
  const [pendenteHomologacao, setPendenteHomologacao] = useState();

  const [cards] = useState(listarCardsPermitidos());

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const getEditaisAsync = async () => {
    const response = await getNomesUnicosEditais();
    if (response.status === HTTP_STATUS.OK) {
      setEditais(
        response.data.results.map((edital) => {
          return { label: edital, value: edital };
        })
      );
    } else {
      setErro("Erro ao carregar Editais. Tente novamente mais tarde.");
    }
  };

  const getProdutosPendenteHomologacaoAsync = async () => {
    const response = await getProdutosPendenteHomologacao();
    if (response.status === HTTP_STATUS.OK) {
      setPendenteHomologacao(response.data.results);
    } else {
      setErro(
        "Erro ao carregar produtos pendente homologação. Tente novamente mais tarde."
      );
    }
  };

  const getProdutosAsync = async () => {
    await getProdutosPendenteHomologacaoAsync();
  };

  const apontaParaFormularioDeAlteracao = (titulo) => {
    if (!usuarioEhEmpresa()) return false;
    switch (titulo) {
      case "Produtos suspensos":
      case "Reclamação de produto":
      case "Correções de Produtos":
      case "Homologados":
      case "Não homologados":
        return true;
      default:
        return false;
    }
  };

  useEffect(() => {
    Promise.all([getEditaisAsync(), getProdutosAsync()]).then(() => {
      setLoading(false);
    });
  }, []);

  const LOADING_INICIAL = !editais && !pendenteHomologacao;

  return (
    <div className="card mt-3">
      <div className="card-body dash-terc">
        {erro && <div>{erro}</div>}
        {!erro && (
          <Spin tip="Carregando painel..." spinning={LOADING_INICIAL}>
            {!LOADING_INICIAL && (
              <div className="card-title fw-bold dashboard-card-title">
                <Form
                  onSubmit={() => {}}
                  initialValues={{}}
                  render={({ form, handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-12 text-end">
                          <p className="current-date">
                            Data: <span>{dataAtual()}</span>
                          </p>
                        </div>
                      </div>
                      <div className="row">
                        {editais && (
                          <div className="col-4 produtos-edital">
                            <Field
                              component={ASelect}
                              showSearch
                              name="edital"
                              placeholder="Número do Edital"
                              disabled={LOADING_INICIAL || loading}
                              options={[
                                { label: "Número do Edital", value: "" },
                              ].concat(editais)}
                              onChange={(value) => {
                                form.change("edital", value);
                              }}
                            />
                          </div>
                        )}
                        <div className="col-4">
                          <Field
                            component={InputText}
                            name="titulo"
                            placeholder="Pesquisar"
                            disabled={LOADING_INICIAL || loading}
                            inputOnChange={(e) => {
                              const value = e.target.value;
                              form.change("titulo", value);
                            }}
                          />
                          <div className="warning-num-charac">
                            * mínimo de 3 caracteres
                          </div>
                        </div>
                        <div className="col-4">
                          <Field
                            component={InputText}
                            name="marca"
                            placeholder="Busca da Marca"
                            disabled={LOADING_INICIAL || loading}
                            inputOnChange={(e) => {
                              const value = e.target.value;
                              form.change("marca", value);
                            }}
                          />
                          <div className="warning-num-charac">
                            * mínimo de 3 caracteres
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        {pendenteHomologacao &&
                          cards.map((card, index) => {
                            return (
                              <div key={index} className="col-6 mt-3">
                                <CardPainel
                                  cardTitle={card.titulo}
                                  cardType={card.style}
                                  produtos={formataCards(
                                    pendenteHomologacao,
                                    apontaParaFormularioDeAlteracao(
                                      card.titulo
                                    ),
                                    card.titulo
                                  )}
                                  icon={card.icon}
                                  href={`/${GESTAO_PRODUTO}/${card.rota}`}
                                  hrefCard={card.href_card}
                                />
                              </div>
                            );
                          })}
                      </div>
                    </form>
                  )}
                />
              </div>
            )}
          </Spin>
        )}
      </div>
    </div>
  );
};
