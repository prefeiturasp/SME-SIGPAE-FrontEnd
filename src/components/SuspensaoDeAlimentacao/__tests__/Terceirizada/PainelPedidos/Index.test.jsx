import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import PainelPedidos from "../../../Terceirizada/PainelPedidos";
import {
  getSuspensaoDeAlimentacaoTomadaCiencia,
  getTerceirizadasSuspensoesDeAlimentacao,
} from "src/services/suspensaoDeAlimentacao.service";
import {
  filtraNoLimite,
  filtraPrioritarios,
  filtraRegular,
  formatarPedidos,
} from "src/helpers/painelPedidos";
import { dataAtualDDMMYYYY } from "src/helpers/utilities";

jest.mock("react-redux", () => ({
  connect: () => (Component) => Component,
}));

jest.mock("redux-form", () => {
  const React = require("react");

  return {
    Field: ({ component, ...props }) => React.createElement(component, props),
    reduxForm: () => (Component) => Component,
    formValueSelector: () => () => undefined,
  };
});

jest.mock("src/services/suspensaoDeAlimentacao.service", () => ({
  getTerceirizadasSuspensoesDeAlimentacao: jest.fn(),
  getSuspensaoDeAlimentacaoTomadaCiencia: jest.fn(),
}));

jest.mock("src/helpers/painelPedidos", () => ({
  filtraPrioritarios: jest.fn(),
  filtraNoLimite: jest.fn(),
  filtraRegular: jest.fn(),
  formatarPedidos: jest.fn(),
}));

jest.mock("src/helpers/utilities", () => ({
  dataAtualDDMMYYYY: jest.fn(),
}));

jest.mock(
  "src/components/SuspensaoDeAlimentacao/components/CardPendenteAcao",
  () => {
    const React = require("react");

    return {
      CardPendenteAcao: jest.fn(({ titulo, pedidos }) =>
        React.createElement(
          "div",
          { "data-testid": "card-pendente-acao" },
          React.createElement("span", {}, titulo),
          React.createElement(
            "span",
            { "data-testid": `total-${titulo}` },
            pedidos.length,
          ),
        ),
      ),
    };
  },
);

jest.mock(
  "src/components/SuspensaoDeAlimentacao/components/CardHistorico",
  () => {
    const React = require("react");

    return {
      __esModule: true,
      default: jest.fn(({ titulo, pedidos }) =>
        React.createElement(
          "div",
          { "data-testid": "card-historico" },
          React.createElement("span", {}, titulo),
          React.createElement(
            "span",
            { "data-testid": "total-card-historico" },
            pedidos.length,
          ),
        ),
      ),
    };
  },
);

jest.mock("src/components/Shareable/Select", () => {
  const React = require("react");

  return ({ name, options = [], onChange, placeholder }) =>
    React.createElement(
      "select",
      {
        name,
        "data-testid": `select-${name}`,
        onChange,
      },
      [
        React.createElement(
          "option",
          { key: "placeholder", value: "" },
          placeholder,
        ),
        ...options.map((option) => {
          const value = option.uuid || option.value || option;
          const label = option.nome || option.label || option;

          return React.createElement(
            "option",
            {
              key: value,
              value,
            },
            label,
          );
        }),
      ],
    );
});

const UUID_PEDIDO_PRIORITARIO = "00000000-0000-4000-8000-000000000001";
const UUID_PEDIDO_NO_LIMITE = "00000000-0000-4000-8000-000000000002";
const UUID_PEDIDO_REGULAR = "00000000-0000-4000-8000-000000000003";
const UUID_PEDIDO_TOMADA_CIENCIA = "00000000-0000-4000-8000-000000000004";
const UUID_FILTRO_CUSTOMIZADO = "00000000-0000-4000-8000-000000000005";
const UUID_PEDIDO_FORMATADO = "00000000-0000-4000-8000-000000000006";

const pedidoPrioritario = { uuid: UUID_PEDIDO_PRIORITARIO };
const pedidoNoLimite = { uuid: UUID_PEDIDO_NO_LIMITE };
const pedidoRegular = { uuid: UUID_PEDIDO_REGULAR };
const pedidoTomadaCiencia = { uuid: UUID_PEDIDO_TOMADA_CIENCIA };

const pedidosResponse = {
  results: [pedidoPrioritario, pedidoNoLimite, pedidoRegular],
};

const tomadaCienciaResponse = {
  data: {
    results: [pedidoTomadaCiencia],
  },
};

const visaoPorCombo = [
  {
    nome: "Filtro customizado",
    uuid: UUID_FILTRO_CUSTOMIZADO,
  },
];

const makeProps = (overrides = {}) => ({
  handleSubmit: jest.fn(),
  visaoPorCombo,
  ...overrides,
});

const renderPainelPedidos = (props = {}) => {
  return render(<PainelPedidos {...makeProps(props)} />);
};

const pendingPromise = () => new Promise(() => null);

describe("PainelPedidos - Suspensão de Alimentação Terceirizada", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    dataAtualDDMMYYYY.mockReturnValue("12/06/2026");

    getTerceirizadasSuspensoesDeAlimentacao.mockResolvedValue(pedidosResponse);
    getSuspensaoDeAlimentacaoTomadaCiencia.mockResolvedValue(
      tomadaCienciaResponse,
    );

    filtraPrioritarios.mockReturnValue([pedidoPrioritario]);
    filtraNoLimite.mockReturnValue([pedidoNoLimite]);
    filtraRegular.mockReturnValue([pedidoRegular]);
    formatarPedidos.mockReturnValue([{ uuid: UUID_PEDIDO_FORMATADO }]);
  });

  it("renderiza o carregamento antes dos pedidos serem carregados", () => {
    getTerceirizadasSuspensoesDeAlimentacao.mockReturnValue(pendingPromise());
    getSuspensaoDeAlimentacaoTomadaCiencia.mockReturnValue(pendingPromise());

    renderPainelPedidos();

    expect(screen.getByText("Carregando...")).toBeInTheDocument();
  });
});
