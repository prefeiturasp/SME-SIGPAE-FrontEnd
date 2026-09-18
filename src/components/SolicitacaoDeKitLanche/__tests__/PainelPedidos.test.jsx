import "@testing-library/jest-dom";
import React from "react";
import { Provider } from "react-redux";
import { combineReducers, createStore } from "redux";
import { reducer as formReducer } from "redux-form";
import {
  act,
  render,
  screen,
  waitFor,
  fireEvent,
} from "@testing-library/react";
import { FiltroEnum } from "src/constants/shared";

const mockGetCodaePedidosDeKitLanche = jest.fn();
const mockGetLotesSimples = jest.fn();
const mockGetDiretoriaregionalSimplissima = jest.fn();
const mockUsuarioEhCODAEGestaoAlimentacao = jest.fn();
const mockCardPendenteAcao = jest.fn();

jest.mock("src/services/kitLanche", () => ({
  getCodaePedidosDeKitLanche: (...args) =>
    mockGetCodaePedidosDeKitLanche(...args),
}));

jest.mock("src/services/lote.service", () => ({
  getLotesSimples: (...args) => mockGetLotesSimples(...args),
}));

jest.mock("src/services/diretoriaRegional.service", () => ({
  getDiretoriaregionalSimplissima: (...args) =>
    mockGetDiretoriaregionalSimplissima(...args),
}));

jest.mock("src/helpers/utilities", () => {
  const actualUtilities = jest.requireActual("src/helpers/utilities");

  return {
    ...actualUtilities,
    dataAtualDDMMYYYY: jest.fn(() => "09/06/2026"),
    formatarOpcoesLote: jest.fn((lotes) =>
      lotes.map((lote) => ({
        value: lote.uuid,
        label: lote.nome,
      })),
    ),
    formatarOpcoesDRE: jest.fn((dres) =>
      dres.map((dre) => ({
        value: dre.uuid,
        label: dre.nome,
      })),
    ),
    usuarioEhCODAEGestaoAlimentacao: () =>
      mockUsuarioEhCODAEGestaoAlimentacao(),
  };
});

jest.mock("src/components/Shareable/MakeField", () => {
  const React = require("react");

  return {
    ASelect: ({ input, filterOption }) => {
      if (filterOption) {
        filterOption(input.value || "", {
          props: {
            children: "Diretoria Regional",
          },
        });
      }

      return React.createElement("input", {
        "data-testid": `select-${input.name}`,
        value: input.value || "",
        onChange: (event) => {
          input.onChange(event.target.value);
        },
        onBlur: (event) => {
          input.onBlur(event);
        },
      });
    },
  };
});

jest.mock("src/components/Shareable/Select", () => {
  const React = require("react");

  return function Select({ input, options = [] }) {
    return React.createElement(
      "select",
      {
        "data-testid": "select-visao-por",
        value: input.value || "",
        onChange: (event) => {
          input.onChange(event);
        },
      },
      [
        React.createElement(
          "option",
          {
            key: "empty",
            value: "",
          },
          "Filtro por",
        ),
        ...options.map((option) =>
          React.createElement(
            "option",
            {
              key: option.value,
              value: option.value,
            },
            option.label,
          ),
        ),
      ],
    );
  };
});

jest.mock("antd", () => {
  const React = require("react");

  const Select = ({ children }) => React.createElement("select", {}, children);

  Select.Option = ({ children, value }) =>
    React.createElement(
      "option",
      {
        value,
      },
      children,
    );

  const Spin = ({ children, spinning }) => {
    const deveMostrarSpin = !children || spinning;

    return React.createElement(
      "div",
      {
        "data-testid": deveMostrarSpin ? "spin" : undefined,
      },
      children,
    );
  };

  return {
    Select,
    Spin,
  };
});

jest.mock(
  "src/components/SolicitacaoDeKitLanche/components/CardPendenteAcao",
  () => {
    const React = require("react");

    return {
      CardPendenteAcao: (props) => {
        mockCardPendenteAcao(props);

        return React.createElement(
          "section",
          {
            "data-testid": `card-${props.tipoDeCard}`,
          },
          React.createElement("h2", {}, props.titulo),
          React.createElement(
            "span",
            {
              "data-testid": `quantidade-${props.tipoDeCard}`,
            },
            props.pedidos.length,
          ),
        );
      },
    };
  },
);

const PainelPedidos = require("../CODAE/PainelPedidos").default;

describe("PainelPedidos", () => {
  const dreUuid = "8f1da4a7-11b6-4a09-9eaa-6633d066f26b";
  const loteUuid = "f9cb1f30-7b86-4cc2-9f5f-d9e7d81c1234";

  const pedidoPrioritario = {
    uuid: "uuid-prioritario",
    id_externo: "ABC123",
    prioridade: "PRIORITARIO",
    data: "10/06/2026",
    escola: { uuid: "escola-1", nome: "Escola 1", codigo_eol: "123456" },
    solicitacoes_similares: [],
  };

  const pedidoNoLimite = {
    uuid: "uuid-limite",
    id_externo: "DEF456",
    prioridade: "LIMITE",
    data: "11/06/2026",
    escola: { uuid: "escola-1", nome: "Escola 1", codigo_eol: "123456" },
    solicitacoes_similares: [],
  };

  const pedidoRegular = {
    uuid: "uuid-regular",
    id_externo: "GHI789",
    prioridade: "REGULAR",
    data: "12/06/2026",
    escola: { uuid: "escola-2", nome: "Escola 2", codigo_eol: "654321" },
    solicitacoes_similares: [],
  };

  const totaisPadrao = { PRIORITARIO: 1, LIMITE: 1, REGULAR: 1 };

  const respostaPadraoPorPrazo = async (filtro, params) => {
    if (params.prazo === "PRIORITARIO") {
      return {
        count: 1,
        results: [pedidoPrioritario],
        escolas_solicitantes: 1,
        totais: totaisPadrao,
      };
    }
    if (params.prazo === "LIMITE") {
      return {
        count: 1,
        results: [pedidoNoLimite],
        escolas_solicitantes: 1,
        totais: totaisPadrao,
      };
    }
    return {
      count: 1,
      results: [pedidoRegular],
      escolas_solicitantes: 1,
      totais: totaisPadrao,
    };
  };

  const createTestStore = (initialState = {}) =>
    createStore(
      combineReducers({
        form: formReducer,
      }),
      initialState,
    );

  const renderPainelPedidos = ({ props = {}, initialState = {} } = {}) => {
    const store = createTestStore(initialState);

    return render(
      <Provider store={store}>
        <PainelPedidos
          visaoPorCombo={[
            {
              value: FiltroEnum.SEM_FILTRO,
              label: "Sem filtro",
            },
            {
              value: "outro_filtro",
              label: "Outro filtro",
            },
          ]}
          {...props}
        />
      </Provider>,
    );
  };

  const waitForPedidosLoad = async () => {
    await waitFor(() => {
      expect(screen.queryAllByTestId("spin")).toHaveLength(0);
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockUsuarioEhCODAEGestaoAlimentacao.mockReturnValue(true);

    mockGetLotesSimples.mockResolvedValue({
      status: 200,
      data: {
        results: [
          {
            uuid: loteUuid,
            nome: "CS - 04",
          },
        ],
      },
    });

    mockGetDiretoriaregionalSimplissima.mockResolvedValue({
      status: 200,
      data: {
        results: [
          {
            uuid: dreUuid,
            nome: "DIRETORIA REGIONAL DE EDUCACAO CAPELA DO SOCORRO",
          },
        ],
      },
    });

    mockGetCodaePedidosDeKitLanche.mockImplementation(respostaPadraoPorPrazo);
  });

  it("exibe carregando antes de finalizar a busca dos pedidos", async () => {
    renderPainelPedidos();

    expect(screen.getAllByTestId("spin").length).toBeGreaterThan(0);

    await waitForPedidosLoad();
  });

  it("busca os pedidos dos três prazos ao montar a tela", async () => {
    renderPainelPedidos();

    await waitFor(() => {
      expect(mockGetCodaePedidosDeKitLanche).toHaveBeenCalledTimes(3);
    });

    expect(mockGetCodaePedidosDeKitLanche).toHaveBeenNthCalledWith(
      1,
      FiltroEnum.SEM_FILTRO,
      {
        lote: [],
        diretoria_regional: [],
        page: 1,
        prazo: "PRIORITARIO",
      },
    );
    expect(mockGetCodaePedidosDeKitLanche).toHaveBeenNthCalledWith(
      2,
      FiltroEnum.SEM_FILTRO,
      {
        lote: [],
        diretoria_regional: [],
        page: 1,
        prazo: "LIMITE",
      },
    );
    expect(mockGetCodaePedidosDeKitLanche).toHaveBeenNthCalledWith(
      3,
      FiltroEnum.SEM_FILTRO,
      {
        lote: [],
        diretoria_regional: [],
        page: 1,
        prazo: "REGULAR",
      },
    );
  });

  it("busca lotes e diretorias regionais ao montar a tela", async () => {
    renderPainelPedidos();

    await waitFor(() => {
      expect(mockGetLotesSimples).toHaveBeenCalledTimes(1);
      expect(mockGetDiretoriaregionalSimplissima).toHaveBeenCalledTimes(1);
    });
  });

  it("preenche os campos do formulário quando recebe filtros por props", async () => {
    renderPainelPedidos({
      props: {
        filtros: {
          diretoria_regional: dreUuid,
          lote: loteUuid,
        },
      },
    });

    await waitForPedidosLoad();

    expect(screen.getByTestId("select-diretoria_regional")).toHaveValue(
      dreUuid,
    );
    expect(screen.getByTestId("select-lote")).toHaveValue(loteUuid);
  });

  it("filtra pelo select comum quando o usuário não é CODAE Gestão Alimentação", async () => {
    mockUsuarioEhCODAEGestaoAlimentacao.mockReturnValue(false);

    renderPainelPedidos();

    await waitForPedidosLoad();

    mockGetCodaePedidosDeKitLanche.mockClear();

    fireEvent.change(screen.getByTestId("select-visao-por"), {
      target: {
        value: "outro_filtro",
      },
    });

    await waitFor(() => {
      expect(mockGetCodaePedidosDeKitLanche).toHaveBeenCalledTimes(3);
    });

    expect(mockGetCodaePedidosDeKitLanche).toHaveBeenNthCalledWith(
      1,
      "outro_filtro",
      {
        lote: undefined,
        diretoria_regional: undefined,
        page: 1,
        prazo: "PRIORITARIO",
      },
    );
  });

  it("filtra novamente ao selecionar DRE e lote", async () => {
    renderPainelPedidos();

    await waitForPedidosLoad();

    mockGetCodaePedidosDeKitLanche.mockClear();

    fireEvent.change(screen.getByTestId("select-diretoria_regional"), {
      target: {
        value: dreUuid,
      },
    });

    await waitFor(() => {
      expect(mockGetCodaePedidosDeKitLanche).toHaveBeenCalledTimes(3);
    });

    expect(mockGetCodaePedidosDeKitLanche).toHaveBeenNthCalledWith(
      1,
      FiltroEnum.SEM_FILTRO,
      {
        diretoria_regional: dreUuid,
        lote: undefined,
        page: 1,
        prazo: "PRIORITARIO",
      },
    );

    await waitForPedidosLoad();

    mockGetCodaePedidosDeKitLanche.mockClear();

    fireEvent.change(screen.getByTestId("select-lote"), {
      target: {
        value: loteUuid,
      },
    });

    await waitFor(() => {
      expect(mockGetCodaePedidosDeKitLanche).toHaveBeenCalledTimes(3);
    });

    expect(mockGetCodaePedidosDeKitLanche).toHaveBeenNthCalledWith(
      1,
      FiltroEnum.SEM_FILTRO,
      {
        diretoria_regional: dreUuid,
        lote: loteUuid,
        page: 1,
        prazo: "PRIORITARIO",
      },
    );

    await waitForPedidosLoad();

    fireEvent.blur(screen.getByTestId("select-diretoria_regional"));
    fireEvent.blur(screen.getByTestId("select-lote"));

    expect(screen.getByTestId("select-diretoria_regional")).toBeInTheDocument();
    expect(screen.getByTestId("select-lote")).toBeInTheDocument();
  });

  it("refaz a busca do card após parar de digitar por 1,5 segundos", async () => {
    renderPainelPedidos();

    await waitForPedidosLoad();

    jest.useFakeTimers();
    mockGetCodaePedidosDeKitLanche.mockClear();

    const propsDoCard = mockCardPendenteAcao.mock.calls[0][0];
    act(() => {
      propsDoCard.onBusca("EMEF");
      propsDoCard.onBusca("EMEF PERICLES");
    });

    act(() => {
      jest.advanceTimersByTime(1499);
    });
    expect(mockGetCodaePedidosDeKitLanche).not.toHaveBeenCalled();

    await act(async () => {
      jest.advanceTimersByTime(1);
    });
    jest.useRealTimers();

    expect(mockGetCodaePedidosDeKitLanche).toHaveBeenCalledTimes(1);
    expect(mockGetCodaePedidosDeKitLanche).toHaveBeenCalledWith(
      FiltroEnum.SEM_FILTRO,
      {
        lote: undefined,
        diretoria_regional: undefined,
        page: 1,
        prazo: "PRIORITARIO",
        busca: "EMEF PERICLES",
      },
    );
  });

  it("repassa as escolas solicitantes e totais para cada bloco", async () => {
    renderPainelPedidos();

    await waitForPedidosLoad();

    const chamadas = mockCardPendenteAcao.mock.calls.map(
      (chamada) => chamada[0],
    );
    const ultimaDoCard = (tipoDeCard) =>
      [...chamadas].reverse().find((props) => props.tipoDeCard === tipoDeCard);
    const prioridade = ultimaDoCard("priority");
    const limite = ultimaDoCard("on-limit");
    const regular = ultimaDoCard("regular");

    expect(prioridade.escolasSolicitantes).toEqual(1);
    expect(limite.escolasSolicitantes).toEqual(1);
    expect(regular.escolasSolicitantes).toEqual(1);

    expect(prioridade.totalSolicitacoes).toEqual(1);
    expect(limite.totalSolicitacoes).toEqual(1);
    expect(regular.totalSolicitacoes).toEqual(1);
  });

  it("muda de página de um card e refaz a busca com a nova página", async () => {
    mockGetCodaePedidosDeKitLanche.mockImplementation(
      async (filtro, params) => {
        if (params.prazo === "REGULAR") {
          return {
            count: 15,
            results: [pedidoRegular],
            escolas_solicitantes: 1,
            totais: { PRIORITARIO: 1, LIMITE: 1, REGULAR: 15 },
          };
        }
        return respostaPadraoPorPrazo(filtro, params);
      },
    );

    renderPainelPedidos();

    await waitForPedidosLoad();

    const chamadas = mockCardPendenteAcao.mock.calls.map(
      (chamada) => chamada[0],
    );
    const cardRegular = [...chamadas]
      .reverse()
      .find((props) => props.tipoDeCard === "regular");

    await act(async () => {
      cardRegular.onPageChange(2);
    });

    await waitFor(() => {
      expect(mockGetCodaePedidosDeKitLanche).toHaveBeenLastCalledWith(
        FiltroEnum.SEM_FILTRO,
        {
          lote: undefined,
          diretoria_regional: undefined,
          page: 2,
          prazo: "REGULAR",
        },
      );
    });
  });
});
