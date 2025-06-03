import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Spin } from "antd";
import { useEffect, useState } from "react";
import CardCronograma from "src/components/Shareable/CardCronograma/CardCronograma";
import { cardsPainel } from "./constants";
import {
  ANALISAR_DOCUMENTO_RECEBIMENTO,
  DETALHAR_FORNECEDOR_DOCUMENTO_RECEBIMENTO,
  DETALHAR_CODAE_DOCUMENTO_RECEBIMENTO,
  PRE_RECEBIMENTO,
} from "src/configs/constants";
import {
  parseDataHoraBrToMoment,
  comparaObjetosMoment,
  truncarString,
  usuarioEhDilogQualidade,
} from "src/helpers/utilities";
import { Field, Form } from "react-final-form";
import InputText from "src/components/Shareable/Input/InputText";
import { debounce } from "lodash";
import { useCallback } from "react";
import { getDashboardDocumentosRecebimento } from "src/services/documentosRecebimento.service";
export default () => {
  const [carregando, setCarregando] = useState(false);
  const [filtrado, setFiltrado] = useState(false);
  const [cardsAprovacaoDocumento, setCardsAprovacaoDocumento] =
    useState(cardsPainel);
  const ordenarPorLogMaisRecente = (a, b) => {
    let data_a = parseDataHoraBrToMoment(a.log_mais_recente);
    let data_b = parseDataHoraBrToMoment(b.log_mais_recente);
    return comparaObjetosMoment(data_b, data_a);
  };
  const gerarTextoCardDocumento = (item) => {
    const TAMANHO_MAXIMO = 20;
    return `${item.numero_cronograma} / ${truncarString(
      item.nome_produto,
      TAMANHO_MAXIMO
    )} / ${truncarString(item.nome_empresa, TAMANHO_MAXIMO)}`;
  };
  const formatarCardsDocumento = (items) => {
    return items.sort(ordenarPorLogMaisRecente).map((item) => ({
      text: gerarTextoCardDocumento(item),
      date: item.log_mais_recente.slice(0, 10),
      link: gerarLinkDocumento(item),
      status: item.status,
    }));
  };
  const gerarLinkDocumento = (item) => {
    if (item.status === "Enviado para Análise") {
      if (usuarioEhDilogQualidade()) {
        return `/${PRE_RECEBIMENTO}/${ANALISAR_DOCUMENTO_RECEBIMENTO}?uuid=${item.uuid}`;
      }
      return `/${PRE_RECEBIMENTO}/${DETALHAR_FORNECEDOR_DOCUMENTO_RECEBIMENTO}?uuid=${item.uuid}`;
    }
    return `/${PRE_RECEBIMENTO}/${DETALHAR_CODAE_DOCUMENTO_RECEBIMENTO}?uuid=${item.uuid}`;
  };
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
  const buscarDocumentos = useCallback(async (filtros = null) => {
    setCarregando(true);
    let dadosDashboard = await getDashboardDocumentosRecebimento(
      filtros ? filtros : null
    );
    let cardsAprovacao = agruparCardsPorStatus(
      cardsAprovacaoDocumento,
      dadosDashboard
    );
    setCardsAprovacaoDocumento(cardsAprovacao);
    setCarregando(false);
  }, []);
  const filtrarDocumentos = debounce((values) => {
    const { nome_produto, numero_cronograma, nome_fornecedor } = values;
    const podeFiltrar = [nome_produto, numero_cronograma, nome_fornecedor].some(
      (value) => value && value.length > 2
    );
    if (podeFiltrar) {
      setCarregando(true);
      let newParams = Object.assign({}, { ...values });
      buscarDocumentos(newParams);
      setFiltrado(true);
    } else if (filtrado) {
      setCarregando(true);
      setFiltrado(false);
      buscarDocumentos();
    }
  }, 500);
  useEffect(() => {
    buscarDocumentos();
  }, [buscarDocumentos]);
  return _jsx(Spin, {
    tip: "Carregando...",
    spinning: carregando,
    children: _jsx("div", {
      className: "card mt-3 card-painel-documentos-recebimento",
      children: _jsxs("div", {
        className: "card-body painel-documentos-recebimento",
        children: [
          _jsx("h5", {
            className: "card-title mt-3",
            children: "Aprova\u00E7\u00E3o de Documentos",
          }),
          _jsx("div", {
            className: "row mt-4",
            children: _jsx("div", {
              className: "col",
              children: _jsx(Form, {
                initialValues: {
                  numero_cronograma: "",
                  nome_produto: "",
                  nome_fornecedor: "",
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
                          name: "numero_cronograma",
                          placeholder: "Filtrar por N\u00B0 do Cronograma",
                          inputOnChange: () =>
                            filtrarDocumentos(form.getState().values),
                        }),
                      }),
                      _jsx("div", {
                        className: "col-4",
                        children: _jsx(Field, {
                          component: InputText,
                          name: "nome_produto",
                          placeholder: "Filtrar por Nome do Produto",
                          inputOnChange: () =>
                            filtrarDocumentos(form.getState().values),
                        }),
                      }),
                      _jsx("div", {
                        className: "col-4",
                        children: _jsx(Field, {
                          component: InputText,
                          name: "nome_fornecedor",
                          placeholder: "Filtrar por Nome do Fornecedor",
                          inputOnChange: () =>
                            filtrarDocumentos(form.getState().values),
                        }),
                      }),
                    ],
                  }),
              }),
            }),
          }),
          _jsx("div", {
            className: "row mt-4",
            children: cardsAprovacaoDocumento.map((card, index) =>
              _jsx(
                "div",
                {
                  className: "col-6 mb-4",
                  children: _jsx(CardCronograma, {
                    cardTitle: card.titulo,
                    cardType: card.style,
                    solicitations: formatarCardsDocumento(
                      card.items ? card.items : []
                    ),
                    icon: card.icon,
                    href: card.href,
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
