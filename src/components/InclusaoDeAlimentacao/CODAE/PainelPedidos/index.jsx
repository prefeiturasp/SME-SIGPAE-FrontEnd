import { Select as SelectAntd, Spin } from "antd";
import { ASelect } from "src/components/Shareable/MakeField";
import { FiltroEnum, TIPODECARD } from "src/constants/shared";
import {
  dataAtualDDMMYYYY,
  formatarOpcoesDRE,
  formatarOpcoesLote,
} from "src/helpers/utilities";
import HTTP_STATUS from "http-status-codes";
import React, { useEffect, useRef, useState } from "react";
import { Field, Form } from "react-final-form";
import { getDiretoriaregionalSimplissima } from "src/services/diretoriaRegional.service";
import { codaeListarSolicitacoesDeInclusaoDeAlimentacao } from "src/services/inclusaoDeAlimentacao";
import { getLotesSimples } from "src/services/lote.service";
import { CardPendenteAcao } from "../../components/CardPendenteAcao";

const TEMPO_DEBOUNCE_BUSCA = 1500;

const CARDS = [
  {
    chave: "prioritario",
    prazo: "PRIORITARIO",
    titulo: "Solicitações próximas ao prazo de vencimento (2 dias ou menos)",
    tipoDeCard: TIPODECARD.PRIORIDADE,
  },
  {
    chave: "limite",
    prazo: "LIMITE",
    titulo: "Solicitações no prazo limite",
    tipoDeCard: TIPODECARD.NO_LIMITE,
  },
  {
    chave: "regular",
    prazo: "REGULAR",
    titulo: "Solicitações no prazo regular",
    tipoDeCard: TIPODECARD.REGULAR,
  },
];

const novoCardData = () => ({
  pedidos: [],
  count: 0,
  page: 1,
  escolasSolicitantes: 0,
  buscando: true,
  busca: "",
});

export const PainelPedidos = ({ ...props }) => {
  const [cards, setCards] = useState({
    prioritario: novoCardData(),
    limite: novoCardData(),
    regular: novoCardData(),
  });
  const [lotes, setLotes] = useState();
  const [diretoriasRegionais, setDiretoriasRegionais] = useState();
  const [filtros, setFiltros] = useState(
    props.filtrosProps || {
      lote: undefined,
      diretoria_regional: undefined,
    },
  );
  const buscaTimeouts = useRef({});

  const setCard = (chave, dados) => {
    setCards((prev) => ({ ...prev, [chave]: { ...prev[chave], ...dados } }));
  };

  const filtrarPrazo = async (chave, { filtros, busca, page }) => {
    const prazo = CARDS.find((card) => card.chave === chave).prazo;
    const params = { ...filtros, page, prazo };
    if (busca) {
      params.busca = busca;
    }
    setCard(chave, { buscando: true, busca });
    const data = await codaeListarSolicitacoesDeInclusaoDeAlimentacao(
      FiltroEnum.SEM_FILTRO,
      params,
    );
    setCard(chave, {
      pedidos: data.results || [],
      count: data.count || 0,
      escolasSolicitantes: data.escolas_solicitantes || 0,
      page,
      buscando: false,
      busca,
    });
  };

  const onBusca = (chave, termo) => {
    setCard(chave, { busca: termo });
    clearTimeout(buscaTimeouts.current[chave]);
    buscaTimeouts.current[chave] = setTimeout(() => {
      if (termo.length === 0 || termo.length > 2) {
        filtrarPrazo(chave, { filtros, busca: termo, page: 1 });
      }
    }, TEMPO_DEBOUNCE_BUSCA);
  };

  const onPageChange = (chave, page) => {
    filtrarPrazo(chave, { filtros, busca: cards[chave].busca, page });
  };

  const getLotesAsync = async () => {
    const response = await getLotesSimples();
    if (response.status === HTTP_STATUS.OK) {
      const { Option } = SelectAntd;
      const lotes_ = formatarOpcoesLote(response.data.results).map((lote) => {
        return <Option key={lote.value}>{lote.label}</Option>;
      });
      setLotes(
        [
          <Option value="" key={0}>
            Filtrar por Lote
          </Option>,
        ].concat(lotes_),
      );
    }
  };

  const getDiretoriasRegionaisAsync = async () => {
    const response = await getDiretoriaregionalSimplissima();
    if (response.status === HTTP_STATUS.OK) {
      const { Option } = SelectAntd;
      const dres = formatarOpcoesDRE(response.data.results).map((dre) => {
        return <Option key={dre.value}>{dre.label}</Option>;
      });
      setDiretoriasRegionais(
        [
          <Option value="" key={0}>
            Filtrar por DRE
          </Option>,
        ].concat(dres),
      );
    }
  };

  useEffect(() => {
    getLotesAsync();
    getDiretoriasRegionaisAsync();
    const paramsFromPrevPage = props.filtrosProps || {
      lote: undefined,
      diretoria_regional: undefined,
    };
    CARDS.forEach(({ chave }) =>
      filtrarPrazo(chave, {
        filtros: paramsFromPrevPage,
        busca: "",
        page: 1,
      }),
    );
    return () => {
      Object.values(buscaTimeouts.current).forEach((timeout) =>
        clearTimeout(timeout),
      );
    };
  }, []);

  return (
    <div>
      <Form initialValues={{ ...props.filtrosProps }} onSubmit={() => {}}>
        {({ handleSubmit, form }) => (
          <form onSubmit={handleSubmit}>
            <div className="card mt-3">
              <div className="card-body">
                <div className="row">
                  <div className="col-3 font-10 my-auto">
                    Data: {dataAtualDDMMYYYY()}
                  </div>
                  <div className="offset-3 col-3">
                    <Field
                      component={ASelect}
                      showSearch
                      onChange={(value) => {
                        form.change("diretoria_regional", value);
                        const filtros_ = {
                          diretoria_regional: value,
                          lote: filtros.lote,
                        };
                        setFiltros(filtros_);
                        CARDS.forEach(({ chave }) =>
                          filtrarPrazo(chave, {
                            filtros: filtros_,
                            busca: cards[chave].busca,
                            page: 1,
                          }),
                        );
                      }}
                      name="diretoria_regional"
                      filterOption={(inputValue, option) =>
                        option.props.children
                          .toString()
                          .toLowerCase()
                          .includes(inputValue.toLowerCase())
                      }
                      dataTestId="select-diretoria-regional"
                    >
                      {diretoriasRegionais}
                    </Field>
                  </div>
                  <div className="col-3">
                    <Field
                      component={ASelect}
                      showSearch
                      onChange={(value) => {
                        form.change("lote", value);
                        const filtros_ = {
                          diretoria_regional: filtros.diretoria_regional,
                          lote: value,
                        };
                        setFiltros(filtros_);
                        CARDS.forEach(({ chave }) =>
                          filtrarPrazo(chave, {
                            filtros: filtros_,
                            busca: cards[chave].busca,
                            page: 1,
                          }),
                        );
                      }}
                      name="lote"
                      filterOption={(inputValue, option) =>
                        option.props.children
                          .toString()
                          .toLowerCase()
                          .includes(inputValue.toLowerCase())
                      }
                      dataTestId="select-lote"
                    >
                      {lotes}
                    </Field>
                  </div>
                </div>
                {CARDS.map(({ chave, titulo, tipoDeCard }) => {
                  const card = cards[chave];
                  return (
                    <Spin
                      key={chave}
                      tip="Carregando solicitações..."
                      spinning={card.buscando}
                    >
                      <div className="row pt-3">
                        <div className="col-12">
                          <CardPendenteAcao
                            titulo={titulo}
                            tipoDeCard={tipoDeCard}
                            pedidos={card.pedidos}
                            totalSolicitacoes={card.count}
                            escolasSolicitantes={card.escolasSolicitantes}
                            page={card.page}
                            onPageChange={(page) => onPageChange(chave, page)}
                            colunaDataLabel={"Data da Inclusão"}
                            dataTestId={chave}
                            busca={card.busca}
                            onBusca={(termo) => onBusca(chave, termo)}
                          />
                        </div>
                      </div>
                    </Spin>
                  );
                })}
              </div>
            </div>
          </form>
        )}
      </Form>
    </div>
  );
};
