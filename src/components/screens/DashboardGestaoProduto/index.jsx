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

  let typingTimeout = null;

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

  const getProdutosPendenteHomologacaoAsync = async (params) => {
    const response = await getProdutosPendenteHomologacao(params);
    if (response.status === HTTP_STATUS.OK) {
      setPendenteHomologacao(response.data.results);
    } else {
      setErro(
        "Erro ao carregar produtos pendente homologação. Tente novamente mais tarde."
      );
    }
  };

  const getProdutosSuspensosAsync = async (params) => {
    const response = await getProdutosSuspensos(params);
    if (response.status === HTTP_STATUS.OK) {
      setSuspensos(response.data.results);
    } else {
      setErro(
        "Erro ao carregar produtos suspensos. Tente novamente mais tarde."
      );
    }
  };

  const getProdutosHomologadosAsync = async (params) => {
    const response = await getProdutosHomologados(params);
    if (response.status === HTTP_STATUS.OK) {
      setHomologados(response.data.results);
    } else {
      setErro(
        "Erro ao carregar produtos homologados. Tente novamente mais tarde."
      );
    }
  };

  const getProdutosNaoHomologadosAsync = async (params) => {
    const response = await getProdutosNaoHomologados(params);
    if (response.status === HTTP_STATUS.OK) {
      setNaoHomologados(response.data.results);
    } else {
      setErro(
        "Erro ao carregar produtos não homologados. Tente novamente mais tarde."
      );
    }
  };

  const getProdutosAguardandoAnaliseReclamacaoAsync = async (params) => {
    const response = await getProdutosAguardandoAnaliseReclamacao(params);
    if (response.status === HTTP_STATUS.OK) {
      setAguardandoAnaliseReclamacoes(response.data.results);
    } else {
      setErro(
        "Erro ao carregar produtos aguardando análise reclamação. Tente novamente mais tarde."
      );
    }
  };

  const getProdutosCorrecaoDeProdutosAsync = async (params) => {
    const response = await getProdutosCorrecaoDeProdutos(params);
    if (response.status === HTTP_STATUS.OK) {
      setCorrecaoDeProdutos(response.data.results);
    } else {
      setErro(
        "Erro ao carregar produtos em correção de produtos. Tente novamente mais tarde."
      );
    }
  };

  const getProdutosAguardandoAmostraAnaliseSensorialAsync = async (params) => {
    const response = await getProdutosAguardandoAmostraAnaliseSensorial(params);
    if (response.status === HTTP_STATUS.OK) {
      setAguardandoAmostraAnaliseSensorial(response.data.results);
    } else {
      setErro(
        "Erro ao carregar produtos em aguardando amostra analise sensorial. Tente novamente mais tarde."
      );
    }
  };

  const getProdutosQuestionamentoDaCODAEAsync = async (params) => {
    const response = await getProdutosQuestionamentoDaCODAE(params);
    if (response.status === HTTP_STATUS.OK) {
      setQuestionamentoDaCODAE(response.data.results);
    } else {
      setErro(
        "Erro ao carregar produtos em questionamento da CODAE. Tente novamente mais tarde."
      );
    }
  };

  const getProdutosAsync = async (params = {}) => {
    await getProdutosPendenteHomologacaoAsync(params);
    await getProdutosSuspensosAsync(params);
    await getProdutosHomologadosAsync(params);
    await getProdutosNaoHomologadosAsync(params);
    await getProdutosAguardandoAnaliseReclamacaoAsync(params);
    await getProdutosCorrecaoDeProdutosAsync(params);
    await getProdutosAguardandoAmostraAnaliseSensorialAsync(params);
    await getProdutosQuestionamentoDaCODAEAsync(params);
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

  const clearCards = () => {
    setHomologados([]);
    setNaoHomologados([]);
    setPendenteHomologacao([]);
    setAguardandoAmostraAnaliseSensorial([]);
    setCorrecaoDeProdutos([]);
    setQuestionamentoDaCODAE([]);
    setAguardandoAnaliseReclamacoes([]);
    setSuspensos([]);
  };

  useEffect(() => {
    Promise.all([getEditaisAsync(), getProdutosAsync()]).then(() => {
      setLoading(false);
    });
  }, []);

  const onPesquisaChanged = (values) => {
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(async () => {
      clearCards();
      setLoading(true);
      const data = {};
      if (values.titulo && values.titulo.length > 2) {
        data["titulo_produto"] = values.titulo;
      }
      if (values.marca && values.marca.length > 2) {
        data["marca_produto"] = values.marca;
      }
      if (values.edital) {
        data["edital_produto"] = values.edital;
      }
      await getProdutosAsync(data);
      setLoading(false);
    }, 1000);
  };

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
          <Spin
            tip="Carregando painel..."
            spinning={LOADING_INICIAL || loading}
          >
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
                              onPesquisaChanged(form.getState().values);
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
                              onPesquisaChanged(form.getState().values);
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
                              onPesquisaChanged(form.getState().values);
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
