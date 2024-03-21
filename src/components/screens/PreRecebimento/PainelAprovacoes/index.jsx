import { Spin } from "antd";
import React, { useEffect, useState } from "react";
import CardCronograma from "components/Shareable/CardCronograma/CardCronograma";
import {
  cards_dinutre,
  cards_dilog,
  cards_alteracao_dinutre,
  cards_alteracao_dilog,
  cards_visao_cronograma,
  cards_alteracao_visao_cronograma,
} from "./constants";
import {
  getDashboardCronograma,
  getDashboardCronogramaComFiltros,
  getDashboardSolicitacoesAlteracao,
  getDashboardSolicitacoesAlteracaoComFiltros,
} from "services/cronograma.service";
import {
  parseDataHoraBrToMoment,
  comparaObjetosMoment,
  truncarString,
} from "helpers/utilities";
import {
  DETALHAR_ALTERACAO_CRONOGRAMA,
  DETALHE_CRONOGRAMA,
  PRE_RECEBIMENTO,
} from "configs/constants";
import { Field, Form } from "react-final-form";
import InputText from "components/Shareable/Input/InputText";
import { debounce } from "lodash";
import { useCallback } from "react";

const obterCardsParaPerfilLogado = () => {
  const cardsIniciais = {
    DILOG_DIRETORIA: {
      cronograma: cards_dilog,
      alteracoes: cards_alteracao_dilog,
    },
    DINUTRE_DIRETORIA: {
      cronograma: cards_dinutre,
      alteracoes: cards_alteracao_dinutre,
    },
    DILOG_CRONOGRAMA: {
      cronograma: cards_visao_cronograma,
      alteracoes: cards_alteracao_visao_cronograma,
    },
    COORDENADOR_CODAE_DILOG_LOGISTICA: {
      cronograma: cards_visao_cronograma,
      alteracoes: cards_alteracao_visao_cronograma,
    },
    ADMINISTRADOR_CODAE_GABINETE: {
      cronograma: cards_visao_cronograma,
      alteracoes: cards_alteracao_visao_cronograma,
    },
  };

  const perfilLogado = JSON.parse(localStorage.getItem("perfil"));

  return cardsIniciais[perfilLogado];
};

export default () => {
  const [carregando, setCarregando] = useState(false);
  const [filtrado, setFiltrado] = useState(false);

  const cards = obterCardsParaPerfilLogado();
  const [cardsCronograma, setCardsCronograma] = useState(cards.cronograma);
  const [cardsAlteracao, setCardsAlteracao] = useState(cards.alteracoes);

  const ordenarPorLogMaisRecente = (a, b) => {
    let data_a = parseDataHoraBrToMoment(a.log_mais_recente);
    let data_b = parseDataHoraBrToMoment(b.log_mais_recente);
    return comparaObjetosMoment(data_b, data_a);
  };

  const gerarTextoCardCronograma = (item) => {
    const TAMANHO_MAXIMO = 48;

    return `${item.numero} - ${truncarString(item.produto, TAMANHO_MAXIMO)}`;
  };

  const gerarLinkCronograma = (item) => {
    return `/${PRE_RECEBIMENTO}/${DETALHE_CRONOGRAMA}?uuid=${item.uuid}`;
  };

  const gerarTextoCardAlteracao = (item) => {
    const TAMANHO_MAXIMO = 48;

    return `${item.cronograma} - ${truncarString(
      item.empresa,
      TAMANHO_MAXIMO
    )}`;
  };

  const gerarLinkSolicitacaoAlteracao = (item) => {
    return `/${PRE_RECEBIMENTO}/${DETALHAR_ALTERACAO_CRONOGRAMA}?uuid=${item.uuid}`;
  };

  const formatarCardsCronograma = (items) => {
    return items.sort(ordenarPorLogMaisRecente).map((item) => ({
      text: gerarTextoCardCronograma(item),
      date: item.log_mais_recente,
      link: gerarLinkCronograma(item),
      status: item.status,
    }));
  };

  const formatarCardsAlteracao = (items) => {
    return items.sort(ordenarPorLogMaisRecente).map((item) => ({
      text: gerarTextoCardAlteracao(item),
      date: item.log_mais_recente,
      link: gerarLinkSolicitacaoAlteracao(item),
      status: item.status,
    }));
  };

  const buscarCronogramas = useCallback(async (filtros = null) => {
    setCarregando(true);

    let dadosDashboard;
    if (!filtros) {
      dadosDashboard = await getDashboardCronograma();
    } else {
      dadosDashboard = await getDashboardCronogramaComFiltros(filtros);
    }

    let cards = [];
    cardsCronograma.forEach((card) => {
      card.items = [];
      dadosDashboard.data.results.forEach((data) => {
        if (card.incluir_status.includes(data.status)) {
          card.items = [...card.items, ...data.dados];
        }
      });
      cards.push(card);
    });

    setCardsCronograma(cards);
    setCarregando(false);
  }, []);

  const filtrarCronogramas = debounce((value, values) => {
    const { nome_produto, numero_cronograma } = values;
    const podeFiltrar = [nome_produto, numero_cronograma].some(
      (value) => value && value.length > 2
    );
    if (podeFiltrar) {
      setCarregando(true);
      let newParams = Object.assign({}, { ...values });
      buscarCronogramas(newParams);
      setFiltrado(true);
    } else if (filtrado) {
      setCarregando(true);
      setFiltrado(false);
      buscarCronogramas();
    }
  }, 500);

  const buscarSolicitacoesAlteracao = useCallback(async (filtros = null) => {
    setCarregando(true);

    let dadosDashboard;
    if (!filtros) {
      dadosDashboard = await getDashboardSolicitacoesAlteracao();
    } else {
      dadosDashboard = await getDashboardSolicitacoesAlteracaoComFiltros(
        filtros
      );
    }

    let cards = [];
    cardsAlteracao.forEach((card) => {
      card.items = [];
      dadosDashboard.data.results.forEach((data) => {
        if (card.incluir_status.includes(data.status)) {
          card.items = [...card.items, ...data.dados];
        }
      });
      cards.push(card);
    });

    setCardsAlteracao(cards);
    setCarregando(false);
  }, []);

  const filtrarSolicitacoesAlteracao = debounce((value, values) => {
    const { numero_cronograma, nome_fornecedor } = values;
    const podeFiltrar = [numero_cronograma, nome_fornecedor].some(
      (value) => value && value.length > 2
    );
    if (podeFiltrar) {
      setCarregando(true);
      let newParams = Object.assign({}, { ...values });
      buscarSolicitacoesAlteracao(newParams);
      setFiltrado(true);
    } else if (filtrado) {
      setCarregando(true);
      setFiltrado(false);
      buscarSolicitacoesAlteracao();
    }
  }, 500);

  useEffect(() => {
    buscarCronogramas();
    buscarSolicitacoesAlteracao();
  }, [buscarCronogramas, buscarSolicitacoesAlteracao]);

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card mt-3 card-painel-cronograma">
        <div className="card-body painel-cronograma">
          <div className="card-title">
            <div className="row">
              <div className="col-5">Programação de Cronogramas</div>
              <div className="col-7">
                <Form
                  initialValues={{
                    numero_cronograma: "",
                    nome_produto: "",
                  }}
                  onSubmit={() => {}}
                >
                  {({ form }) => (
                    <div className="row text-end">
                      <div className="col-6">
                        <Field
                          component={InputText}
                          name="numero_cronograma"
                          placeholder="N° do Cronograma"
                          inputOnChange={(e) =>
                            filtrarCronogramas(
                              e.target.value,
                              form.getState().values
                            )
                          }
                        />
                      </div>
                      <div className="col-6">
                        <Field
                          component={InputText}
                          name="nome_produto"
                          placeholder="Nome do Produto"
                          inputOnChange={(e) =>
                            filtrarCronogramas(
                              e.target.value,
                              form.getState().values
                            )
                          }
                        />
                      </div>
                    </div>
                  )}
                </Form>
              </div>
            </div>
          </div>
          <div className="row">
            {cardsCronograma.map((card, index) => (
              <div className="col-6 mb-4" key={index}>
                <CardCronograma
                  cardTitle={card.titulo}
                  cardType={card.style}
                  solicitations={formatarCardsCronograma(
                    card.items ? card.items : []
                  )}
                  icon={card.icon}
                  href={card.href}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card mt-3 card-painel-cronograma">
        <div className="card-body painel-cronograma">
          <div className="card-title">
            <div className="row">
              <div className="col-5">Alterações de Cronogramas</div>
              <div className="col-7">
                <Form
                  initialValues={{
                    nome_fornecedor: "",
                    numero_cronograma: "",
                  }}
                  onSubmit={() => {}}
                >
                  {({ form }) => (
                    <div className="row text-end">
                      <div className="col-6">
                        <Field
                          component={InputText}
                          name="numero_cronograma"
                          placeholder="N° do Cronograma"
                          inputOnChange={(e) =>
                            filtrarSolicitacoesAlteracao(
                              e.target.value,
                              form.getState().values
                            )
                          }
                        />
                      </div>
                      <div className="col-6">
                        <Field
                          component={InputText}
                          name="nome_fornecedor"
                          placeholder="Nome do Fornecedor"
                          inputOnChange={(e) =>
                            filtrarSolicitacoesAlteracao(
                              e.target.value,
                              form.getState().values
                            )
                          }
                        />
                      </div>
                    </div>
                  )}
                </Form>
              </div>
            </div>
          </div>
          <div className="row">
            {cardsAlteracao.map((card, index) => (
              <div className="col-6 mb-4" key={index}>
                <CardCronograma
                  cardTitle={card.titulo}
                  cardType={card.style}
                  solicitations={formatarCardsAlteracao(
                    card.items ? card.items : []
                  )}
                  icon={card.icon}
                  href={card.href}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Spin>
  );
};
