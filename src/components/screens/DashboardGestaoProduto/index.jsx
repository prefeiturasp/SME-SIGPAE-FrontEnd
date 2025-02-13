import { Spin } from "antd";
import CardAtalho from "components/Shareable/CardAtalho";
import { InputText } from "components/Shareable/Input/InputText";
import { ASelect } from "components/Shareable/MakeField";
import { GESTAO_PRODUTO } from "configs/constants";
import { listarCardsPermitidos } from "helpers/gestaoDeProdutos";
import {
  dataAtual,
  usuarioEhEscolaTerceirizadaQualquerPerfil,
} from "helpers/utilities";
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
import {
  apontaParaFormularioDeAlteracao,
  exibeCardAguardandoAmostraAnaliseSensorial,
  exibeCardCorrecaoDeProduto,
  exibeCardPendenteHomologacao,
  exibeCardQuestionamentoDaCODAE,
  formataCards,
} from "./helper";
import "./style.scss";

export const DashboardGestaoProduto = () => {
  const [editais, setEditais] = useState();
  const [suspensos, setSuspensos] = useState();
  const [homologados, setHomologados] = useState();
  const [naoHomologados, setNaoHomologados] = useState();
  const [aguardandoAnaliseReclamacoes, setAguardandoAnaliseReclamacoes] =
    useState();
  const [pendenteHomologacao, setPendenteHomologacao] = useState(
    exibeCardPendenteHomologacao() ? undefined : []
  );
  const [correcaoDeProdutos, setCorrecaoDeProdutos] = useState(
    exibeCardCorrecaoDeProduto() ? undefined : []
  );
  const [
    aguardandoAmostraAnaliseSensorial,
    setAguardandoAmostraAnaliseSensorial,
  ] = useState(exibeCardAguardandoAmostraAnaliseSensorial() ? undefined : []);
  const [questionamentoDaCODAE, setQuestionamentoDaCODAE] = useState(
    exibeCardQuestionamentoDaCODAE() ? undefined : []
  );

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
        "Erro ao carregar produtos em correção de produto. Tente novamente mais tarde."
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
    await Promise.all([
      getProdutosAguardandoAnaliseReclamacaoAsync(params),
      getProdutosSuspensosAsync(params),
      getProdutosHomologadosAsync(params),
      getProdutosNaoHomologadosAsync(params),
      exibeCardQuestionamentoDaCODAE() &&
        getProdutosQuestionamentoDaCODAEAsync(params),
      exibeCardPendenteHomologacao() &&
        getProdutosPendenteHomologacaoAsync(params),
      exibeCardAguardandoAmostraAnaliseSensorial() &&
        getProdutosAguardandoAmostraAnaliseSensorialAsync(params),
      exibeCardCorrecaoDeProduto() &&
        getProdutosCorrecaoDeProdutosAsync(params),
    ]);
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
            size="large"
            className="centered-spin"
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
                            dataTestId="select-edital"
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
                            dataTestIdDiv="div-input-titulo"
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
                            dataTestIdDiv="div-input-marca"
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
                                dataTestId={card.titulo}
                                cardTitle={card.titulo}
                                cardType={card.style}
                                produtos={formataCards(
                                  getProdutosPorCard[card.titulo],
                                  apontaParaFormularioDeAlteracao(card.titulo),
                                  card.titulo
                                )}
                                icon={card.icon}
                                href={`/${GESTAO_PRODUTO}/${card.rota}`}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </form>
                  )}
                />
                {usuarioEhEscolaTerceirizadaQualquerPerfil() && (
                  <div className="row row-shortcuts mt-3">
                    <div className="col-sm-3 col-12">
                      <CardAtalho
                        titulo={"Reclamação de Produtos"}
                        nome="card-inclusao"
                        texto={
                          "Quando houver necessidade de registrar" +
                          " Reclamação de Produtos para os produtos homologados"
                        }
                        textoLink={"Nova Reclamação"}
                        href={"/gestao-produto/nova-reclamacao-de-produto"}
                      />
                    </div>
                    <div className="col-sm-3 col-12">
                      <CardAtalho
                        titulo={"Responder Questionamentos de CODAE"}
                        nome="card-alteracao"
                        texto={
                          "Quando houver necessidade de responder os questionamentos " +
                          "da CODAE referente a uma reclamação de produto. "
                        }
                        textoLink={"Responder Questionamentos"}
                        href={"/gestao-produto/responder-questionamento-ue"}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </Spin>
        )}
      </div>
    </div>
  );
};
