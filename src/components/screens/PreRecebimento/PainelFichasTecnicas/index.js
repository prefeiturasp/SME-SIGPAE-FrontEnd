import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Spin } from "antd";
import { useEffect, useState } from "react";
import CardCronograma from "src/components/Shareable/CardCronograma/CardCronograma";
import { cardsPainel } from "./constants";
import { Field, Form } from "react-final-form";
import InputText from "src/components/Shareable/Input/InputText";
import { debounce } from "lodash";
import { useCallback } from "react";
import { getDashboardFichasTecnicas } from "src/services/fichaTecnica.service";
import { formatarCards } from "./helpers";
export default () => {
  const [carregando, setCarregando] = useState(false);
  const [filtrado, setFiltrado] = useState(false);
  const [cards, setCards] = useState(cardsPainel);
  const filtrarItens = debounce((values) => {
    const { nome_produto, numero_ficha, nome_empresa } = values;
    const podeFiltrar = [nome_produto, numero_ficha, nome_empresa].some(
      (value) => value && value.length > 2
    );
    if (podeFiltrar) {
      setCarregando(true);
      let newParams = Object.assign({}, { ...values });
      buscarItens(newParams);
      setFiltrado(true);
    } else if (filtrado) {
      setCarregando(true);
      setFiltrado(false);
      buscarItens();
    }
  }, 500);
  const buscarItens = useCallback(async (filtros = null) => {
    setCarregando(true);
    let dadosDashboard = await getDashboardFichasTecnicas(
      filtros ? filtros : null
    );
    let cardsAprovacao = agruparCardsPorStatus(cards, dadosDashboard);
    setCards(cardsAprovacao);
    setCarregando(false);
  }, []);
  const agruparCardsPorStatus = (cardsIniciais, dadosDashboard) => {
    const cardsAgrupados = [];
    cardsIniciais.forEach((card) => {
      card.items = [];
      dadosDashboard.data.results.forEach((data) => {
        if (card.incluir_status.includes(data.status)) {
          card.items = [...card.items, ...data.dados];
        }
      });
      cardsAgrupados.push(card);
    });
    return cardsAgrupados;
  };
  useEffect(() => {
    buscarItens();
  }, [buscarItens]);
  return _jsx(Spin, {
    tip: "Carregando...",
    spinning: carregando,
    children: _jsx("div", {
      className: "card mt-3 card-painel-fichas-tecnicas",
      children: _jsxs("div", {
        className: "card-body painel-fichas-tecnicas",
        children: [
          _jsx("div", {
            className: "row mt-4",
            children: _jsx("div", {
              className: "col",
              children: _jsx(Form, {
                initialValues: {
                  numero_ficha: "",
                  nome_produto: "",
                  nome_empresa: "",
                },
                onSubmit: () => {},
                children: ({ form }) =>
                  _jsxs("div", {
                    className: "row text-end",
                    children: [
                      _jsx("div", {
                        className: "col-4",
                        children: _jsx(Field, {
                          component: InputText,
                          dataTestIdDiv: "div-input-numero-ficha",
                          name: "numero_ficha",
                          placeholder:
                            "Filtrar por N\u00BA da Ficha T\u00E9cnica",
                          inputOnChange: () =>
                            filtrarItens(form.getState().values),
                        }),
                      }),
                      _jsx("div", {
                        className: "col-4",
                        children: _jsx(Field, {
                          component: InputText,
                          dataTestIdDiv: "div-input-nome-produto",
                          name: "nome_produto",
                          placeholder: "Filtrar por Nome do Produto",
                          inputOnChange: () =>
                            filtrarItens(form.getState().values),
                        }),
                      }),
                      _jsx("div", {
                        className: "col-4",
                        children: _jsx(Field, {
                          component: InputText,
                          dataTestIdDiv: "div-input-nome-empresa",
                          name: "nome_empresa",
                          placeholder: "Filtrar por Nome do Fornecedor",
                          inputOnChange: () =>
                            filtrarItens(form.getState().values),
                        }),
                      }),
                    ],
                  }),
              }),
            }),
          }),
          _jsx("div", {
            className: "row mt-4",
            children: cards.map((card, index) =>
              _jsx(
                "div",
                {
                  className: "col-6 mb-4",
                  children: _jsx(CardCronograma, {
                    cardTitle: card.titulo,
                    cardType: card.style,
                    solicitations: formatarCards(card.items ? card.items : []),
                    icon: card.icon,
                    href: card.href,
                    exibirTooltip: true,
                  }),
                },
                index
              )
            ),
          }),
        ],
      }),
    }),
  });
};
