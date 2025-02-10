import { Spin } from "antd";
import { InputText } from "components/Shareable/Input/InputText";
import { ASelect } from "components/Shareable/MakeField";
import { GESTAO_PRODUTO } from "configs/constants";
import { listarCardsPermitidos } from "helpers/gestaoDeProdutos";
import { dataAtual, usuarioEhEmpresa } from "helpers/utilities";
import HTTP_STATUS from "http-status-codes";
import React, { useEffect, useState } from "react";
import { Field, Form } from "react-final-form";
import {
  getProdutosAguardandoAmostraAnaliseSensorial,
  getProdutosAguardandoAnaliseReclamacao,
  getProdutosCorrecaoDeProdutos,
  getProdutosHomologados,
  getProdutosNaoHomologados,
  getProdutosPendenteHomologacao,
  getProdutosQuestionamentoDaCODAE,
  getProdutosSuspensos,
} from "services/dashboardGestaoProduto";
import { getNomesUnicosEditais } from "services/produto.service";
import { CardPainel } from "./componentes/CardPainel";
import { formataCards } from "./helper";

export const DashboardGestaoProduto = () => {
  const [editais, setEditais] = useState();
  const [pendenteHomologacao, setPendenteHomologacao] = useState();
  const [suspensos, setSuspensos] = useState();
  const [homologados, setHomologados] = useState();
  const [naoHomologados, setNaoHomologados] = useState();
  const [aguardandoAnaliseReclamacoes, setAguardandoAnaliseReclamacoes] =
    useState();
  const [correcaoDeProdutos, setCorrecaoDeProdutos] = useState();
  const [
    aguardandoAmostraAnaliseSensorial,
    setAguardandoAmostraAnaliseSensorial,
  ] = useState();
  const [questionamentoDaCODAE, setQuestionamentoDaCODAE] = useState();

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

  const getProdutosSuspensosAsync = async () => {
    const response = await getProdutosSuspensos();
    if (response.status === HTTP_STATUS.OK) {
      setSuspensos(response.data.results);
    } else {
      setErro(
        "Erro ao carregar produtos suspensos. Tente novamente mais tarde."
      );
    }
  };

  const getProdutosHomologadosAsync = async () => {
    const response = await getProdutosHomologados();
    if (response.status === HTTP_STATUS.OK) {
      setHomologados(response.data.results);
    } else {
      setErro(
        "Erro ao carregar produtos homologados. Tente novamente mais tarde."
      );
    }
  };

  const getProdutosNaoHomologadosAsync = async () => {
    const response = await getProdutosNaoHomologados();
    if (response.status === HTTP_STATUS.OK) {
      setNaoHomologados(response.data.results);
    } else {
      setErro(
        "Erro ao carregar produtos não homologados. Tente novamente mais tarde."
      );
    }
  };

  const getProdutosAguardandoAnaliseReclamacaoAsync = async () => {
    const response = await getProdutosAguardandoAnaliseReclamacao();
    if (response.status === HTTP_STATUS.OK) {
      setAguardandoAnaliseReclamacoes(response.data.results);
    } else {
      setErro(
        "Erro ao carregar produtos aguardando análise reclamação. Tente novamente mais tarde."
      );
    }
  };

  const getProdutosCorrecaoDeProdutosAsync = async () => {
    const response = await getProdutosCorrecaoDeProdutos();
    if (response.status === HTTP_STATUS.OK) {
      setCorrecaoDeProdutos(response.data.results);
    } else {
      setErro(
        "Erro ao carregar produtos em correção de produtos. Tente novamente mais tarde."
      );
    }
  };

  const getProdutosAguardandoAmostraAnaliseSensorialAsync = async () => {
    const response = await getProdutosAguardandoAmostraAnaliseSensorial();
    if (response.status === HTTP_STATUS.OK) {
      setAguardandoAmostraAnaliseSensorial(response.data.results);
    } else {
      setErro(
        "Erro ao carregar produtos em aguardando amostra analise sensorial. Tente novamente mais tarde."
      );
    }
  };

  const getProdutosQuestionamentoDaCODAEAsync = async () => {
    const response = await getProdutosQuestionamentoDaCODAE();
    if (response.status === HTTP_STATUS.OK) {
      setQuestionamentoDaCODAE(response.data.results);
    } else {
      setErro(
        "Erro ao carregar produtos em questionamento da CODAE. Tente novamente mais tarde."
      );
    }
  };

  const getProdutosAsync = async () => {
    await getProdutosPendenteHomologacaoAsync();
    await getProdutosSuspensosAsync();
    await getProdutosHomologadosAsync();
    await getProdutosNaoHomologadosAsync();
    await getProdutosAguardandoAnaliseReclamacaoAsync();
    await getProdutosCorrecaoDeProdutosAsync();
    await getProdutosAguardandoAmostraAnaliseSensorialAsync();
    await getProdutosQuestionamentoDaCODAEAsync();
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

  const getProdutosPorCard = {
    "Produtos suspensos": suspensos,
    Homologados: homologados,
    "Não homologados": naoHomologados,
    "Aguardando análise das reclamações": aguardandoAnaliseReclamacoes,
    "Correções de Produtos": correcaoDeProdutos,
    "Aguardando amostra para análise sensorial":
      aguardandoAmostraAnaliseSensorial,
    "Pendentes de homologação": pendenteHomologacao,
    "Responder Questionamentos da CODAE": questionamentoDaCODAE,
  };

  useEffect(() => {
    Promise.all([getEditaisAsync(), getProdutosAsync()]).then(() => {
      setLoading(false);
    });
  }, []);

  const LOADING_INICIAL =
    !editais ||
    !pendenteHomologacao ||
    !suspensos ||
    !homologados ||
    !naoHomologados ||
    !aguardandoAnaliseReclamacoes ||
    !correcaoDeProdutos ||
    !aguardandoAmostraAnaliseSensorial ||
    !questionamentoDaCODAE;

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
                        {cards.map((card, index) => {
                          return (
                            <div key={index} className="col-6 mt-3">
                              <CardPainel
                                cardTitle={card.titulo}
                                cardType={card.style}
                                produtos={formataCards(
                                  getProdutosPorCard[card.titulo],
                                  apontaParaFormularioDeAlteracao(card.titulo),
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
