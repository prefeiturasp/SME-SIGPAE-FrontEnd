import "@testing-library/jest-dom";
import React from "react";
import { Provider } from "react-redux";
import { combineReducers, createStore } from "redux";
import { reducer as formReducer } from "redux-form";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

const mockGetDREPedidosDeKitLanche = jest.fn();
const mockGetLotesSimples = jest.fn();
const mockMeusDados = jest.fn();
const mockCardPendenteAcao = jest.fn();

jest.mock("src/services/kitLanche", () => ({
  getDREPedidosDeKitLanche: (...args) => mockGetDREPedidosDeKitLanche(...args),
}));

jest.mock("src/services/lote.service", () => ({
  getLotesSimples: (...args) => mockGetLotesSimples(...args),
}));

jest.mock("src/services/perfil.service", () => ({
  meusDados: (...args) => mockMeusDados(...args),
}));

jest.mock("src/helpers/utilities", () => {
  const actualUtilities = jest.requireActual("src/helpers/utilities");

  return {
    ...actualUtilities,
    dataAtualDDMMYYYY: jest.fn(() => "09/06/2026"),
    formatarOpcoesLote: jest.fn((lotes) =>
      lotes.map((lote) => ({ value: lote.uuid, label: lote.nome })),
    ),
  };
});

jest.mock("src/components/Shareable/MakeField", () => {
  const React = require("react");

  return {
    ASelect: ({ input }) =>
      React.createElement("input", {
        "data-testid": `select-${input.name}`,
        value: input.value || "",
        onChange: (event) => input.onChange(event.target.value),
      }),
  };
});

jest.mock("src/components/Shareable/Select", () => {
  const React = require("react");

  return function Select({ input }) {
    return React.createElement("select", {
      "data-testid": "select-visao-por",
      value: input.value || "",
      onChange: (event) => input.onChange(event),
    });
  };
});

jest.mock("antd", () => {
  const React = require("react");

  const Select = ({ children }) => React.createElement("select", {}, children);

  Select.Option = ({ children, value }) =>
    React.createElement("option", { value }, children);

  const Spin = ({ children }) => React.createElement("div", {}, children);

  return { Select, Spin };
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
          { "data-testid": `card-${props.tipoDeCard}` },
          React.createElement("h2", {}, props.titulo),
          React.createElement(
            "span",
            { "data-testid": `busca-${props.tipoDeCard}` },
            props.busca || "",
          ),
          React.createElement(
            "span",
            { "data-testid": `quantidade-${props.tipoDeCard}` },
            props.pedidos.length,
          ),
          React.createElement(
            "button",
            {
              type: "button",
              "data-testid": `buscar-${props.tipoDeCard}`,
              onClick: () => props.onBusca("arroz"),
            },
            "Buscar",
          ),
          React.createElement(
            "button",
            {
              type: "button",
              "data-testid": `buscar-curto-${props.tipoDeCard}`,
              onClick: () => props.onBusca("ab"),
            },
            "Buscar curto",
          ),
        );
      },
    };
  },
);

const PainelPedidos = require("../DRE/PainelPedidos").default;

describe("PainelPedidos DRE", () => {
  const respostaPadrao = {
    count: 1,
    results: [
      {
        uuid: "uuid-pedido",
        id_externo: "ABC123",
        prioridade: "PRIORITARIO",
        data: "10/06/2026",
        escola: { uuid: "escola-1", nome: "Escola 1", codigo_eol: "123456" },
        solicitacoes_similares: [],
      },
    ],
    escolas_solicitantes: 1,
  };

  const renderPainelPedidos = () => {
    const store = createStore(combineReducers({ form: formReducer }));
    return render(
      <Provider store={store}>
        <PainelPedidos
          visaoPorCombo={[{ nome: "Escola", uuid: "escola" }]}
          filtros={{ lote: undefined }}
        />
      </Provider>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockMeusDados.mockResolvedValue({
      vinculo_atual: { instituicao: { uuid: "dre-1", lotes: [] } },
    });
    mockGetLotesSimples.mockResolvedValue({
      status: 200,
      data: { results: [] },
    });
    mockGetDREPedidosDeKitLanche.mockImplementation(async () => ({
      ...respostaPadrao,
    }));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("busca os pedidos dos três prazos ao montar a tela", async () => {
    renderPainelPedidos();

    await waitFor(() =>
      expect(mockGetDREPedidosDeKitLanche).toHaveBeenCalledTimes(3),
    );

    const prazos = mockGetDREPedidosDeKitLanche.mock.calls.map(
      ([, params]) => params.prazo,
    );
    expect(prazos.sort()).toEqual(["LIMITE", "PRIORITARIO", "REGULAR"]);
    expect(screen.getByTestId("quantidade-priority")).toHaveTextContent("1");
    expect(screen.getByTestId("quantidade-on-limit")).toHaveTextContent("1");
    expect(screen.getByTestId("quantidade-regular")).toHaveTextContent("1");
  });

  it("realiza a busca com debounce e não altera os demais cards", async () => {
    jest.useFakeTimers();
    renderPainelPedidos();

    await waitFor(() =>
      expect(mockGetDREPedidosDeKitLanche).toHaveBeenCalledTimes(3),
    );

    fireEvent.click(screen.getByTestId("buscar-priority"));

    expect(screen.getByTestId("busca-priority")).toHaveTextContent("arroz");
    expect(mockGetDREPedidosDeKitLanche).toHaveBeenCalledTimes(3);

    act(() => {
      jest.advanceTimersByTime(1500);
    });

    await waitFor(() =>
      expect(mockGetDREPedidosDeKitLanche).toHaveBeenCalledTimes(4),
    );

    const ultimaChamada =
      mockGetDREPedidosDeKitLanche.mock.calls[
        mockGetDREPedidosDeKitLanche.mock.calls.length - 1
      ];
    expect(ultimaChamada[1].busca).toEqual("arroz");
    expect(ultimaChamada[1].prazo).toEqual("PRIORITARIO");

    expect(screen.getByTestId("busca-on-limit")).toHaveTextContent("");
    expect(screen.getByTestId("busca-regular")).toHaveTextContent("");
  });

  it("ignora busca com menos de três caracteres", async () => {
    jest.useFakeTimers();
    renderPainelPedidos();

    await waitFor(() =>
      expect(mockGetDREPedidosDeKitLanche).toHaveBeenCalledTimes(3),
    );

    fireEvent.click(screen.getByTestId("buscar-curto-priority"));

    act(() => {
      jest.advanceTimersByTime(1500);
    });

    expect(mockGetDREPedidosDeKitLanche).toHaveBeenCalledTimes(3);
    expect(screen.getByTestId("busca-priority")).toHaveTextContent("ab");
  });
});
