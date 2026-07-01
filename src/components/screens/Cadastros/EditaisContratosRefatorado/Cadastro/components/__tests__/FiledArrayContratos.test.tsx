import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import HTTP_STATUS from "http-status-codes";
import React from "react";

import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import { getError } from "src/helpers/utilities";
import { encerraContratoTerceirizada } from "src/services/terceirizada.service";

import { FieldArrayContratos } from "../FieldArrayContratos";

let mockValues: any;

jest.mock("react-final-form", () => ({
  Field: ({ component: Component, ...props }: any) => {
    const React = require("react");

    return React.createElement(Component, props);
  },
}));

jest.mock("react-final-form-arrays", () => ({
  FieldArray: ({ name, children }: any) => {
    let items = [];

    if (name === "contratos") {
      items = mockValues?.contratos || [];
    } else {
      const contratoIndex = Number(
        name.match(/contratos\[(\d+)\]\.vigencias/)?.[1],
      );

      items = mockValues?.contratos?.[contratoIndex]?.vigencias || [];
    }

    return children({
      fields: {
        map: (callback: any) =>
          items.map((_: any, index: number) =>
            callback(`${name}[${index}]`, index),
          ),
      },
    });
  },
}));

jest.mock("src/components/Shareable/Input/InputText", () => {
  const React = require("react");

  return {
    InputText: ({ name, label, placeholder, disabled }: any) =>
      React.createElement("input", {
        "data-testid": `field-${name}`,
        "aria-label": label,
        placeholder,
        disabled,
      }),
  };
});

jest.mock("src/components/Shareable/DatePicker", () => {
  const React = require("react");

  return {
    InputComData: ({ name, label, placeholder, disabled }: any) =>
      React.createElement("input", {
        "data-testid": `field-${name}`,
        "aria-label": label === "&nbsp;" ? placeholder : label,
        placeholder,
        disabled,
      }),
  };
});

jest.mock("src/components/Shareable/Select", () => {
  const React = require("react");

  return {
    Select: ({ name, options }: any) =>
      React.createElement(
        "select",
        {
          "data-testid": `select-${name}`,
        },
        options.map((option: any) =>
          React.createElement(
            "option",
            {
              key: option.uuid,
              value: option.uuid,
            },
            option.nome,
          ),
        ),
      ),
  };
});

jest.mock("src/components/Shareable/MultiSelect/StatefulMultiSelect", () => {
  const React = require("react");

  return {
    __esModule: true,
    default: ({
      name,
      selected = [],
      options = [],
      valueRenderer,
      onSelectedChanged,
    }: any) =>
      React.createElement(
        "div",
        {
          "data-testid": `multiselect-${name}`,
        },
        React.createElement(
          "span",
          null,
          valueRenderer(
            selected,
            options.map((option: any) => option.value),
          ),
        ),
        React.createElement(
          "button",
          {
            type: "button",
            "data-testid": `alterar-${name}`,
            onClick: () =>
              onSelectedChanged(
                options.slice(0, 1).map((option: any) => option.value),
              ),
          },
          "Alterar seleção",
        ),
      ),
  };
});

jest.mock("src/components/Shareable/Botao", () => {
  const React = require("react");

  return {
    Botao: ({ texto, onClick, disabled, type, className }: any) =>
      React.createElement(
        "button",
        {
          type: type || "button",
          onClick,
          disabled,
          className,
        },
        texto,
      ),
  };
});

jest.mock("../ModalEncerrarContrato.tsx", () => {
  const React = require("react");

  return {
    ModalEncerrarContrato: ({
      showModal,
      closeModal,
      contrato,
      encerrarContrato,
    }: any) =>
      showModal
        ? React.createElement(
            "div",
            {
              "data-testid": "modal-encerrar-contrato",
            },
            React.createElement(
              "button",
              {
                type: "button",
                onClick: () => encerrarContrato(contrato),
              },
              "Confirmar encerramento",
            ),
            React.createElement(
              "button",
              {
                type: "button",
                onClick: closeModal,
              },
              "Fechar modal",
            ),
          )
        : null,
  };
});

jest.mock("src/services/terceirizada.service", () => ({
  encerraContratoTerceirizada: jest.fn(),
}));

jest.mock("src/components/Shareable/Toast/dialogs", () => ({
  toastSuccess: jest.fn(),
  toastError: jest.fn(),
}));

jest.mock("src/helpers/utilities", () => ({
  getError: jest.fn(),
}));

const LOTE_1_UUID = "11111111-1111-4111-8111-111111111111";
const LOTE_2_UUID = "22222222-2222-4222-8222-222222222222";
const DRE_1_UUID = "33333333-3333-4333-8333-333333333333";
const DRE_2_UUID = "44444444-4444-4444-8444-444444444444";
const EMPRESA_UUID = "55555555-5555-4555-8555-555555555555";
const CONTRATO_UUID = "66666666-6666-4666-8666-666666666666";
const EDITAL_UUID = "77777777-7777-4777-8777-777777777777";
const VIGENCIA_UUID = "88888888-8888-4888-8888-888888888888";

const lotes = [
  {
    uuid: LOTE_1_UUID,
    nome: "Lote 01",
  },
  {
    uuid: LOTE_2_UUID,
    nome: "Lote 02",
  },
] as any;

const DREs = [
  {
    uuid: DRE_1_UUID,
    nome: "DRE Norte",
  },
  {
    uuid: DRE_2_UUID,
    nome: "DRE Sul",
  },
] as any;

const empresas = [
  {
    uuid: EMPRESA_UUID,
    nome_fantasia: "Empresa de Teste",
  },
] as any;

const criarContrato = (sobrescritas: Record<string, any> = {}) => ({
  uuid: CONTRATO_UUID,
  processo: "PROCESSO-001",
  numero: "CONTRATO-001",
  data_proposta: "01/01/2026",
  encerrado: false,
  data_hora_encerramento: null,
  lotes: [LOTE_1_UUID],
  diretorias_regionais: [DRE_1_UUID],
  terceirizada: EMPRESA_UUID,
  vigencias: [
    {
      uuid: VIGENCIA_UUID,
      data_inicial: "01/01/2026",
      data_final: "31/12/2999",
      status: "ativo",
    },
  ],
  ...sobrescritas,
});

const criarValues = (contratos = [criarContrato()]) =>
  ({
    uuid: EDITAL_UUID,
    contratos,
  }) as any;

const renderizarComponente = (values = criarValues()) => {
  mockValues = values;

  const form = {
    change: jest.fn(),
  } as any;

  const push = jest.fn();
  const getEditalContratoAsync = jest.fn().mockResolvedValue(undefined);

  render(
    <FieldArrayContratos
      form={form}
      values={values}
      push={push}
      lotes={lotes}
      DREs={DREs}
      empresas={empresas}
      getEditalContratoAsync={getEditalContratoAsync}
    />,
  );

  return {
    form,
    push,
    getEditalContratoAsync,
  };
};

describe("FieldArrayContratos", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza os campos e os dados selecionados do contrato", () => {
    renderizarComponente();

    expect(screen.getByText("Contratos Relacionados")).toBeInTheDocument();

    expect(
      screen.getByLabelText("Processo administrativo do contrato"),
    ).toBeInTheDocument();

    expect(screen.getByLabelText("Data da proposta")).toBeInTheDocument();
    expect(screen.getByLabelText("Nº do Contrato")).toBeInTheDocument();

    expect(screen.getByText("1 lote selecionado")).toBeInTheDocument();
    expect(screen.getByText("1 diretoria selecionada")).toBeInTheDocument();

    expect(screen.getByText("Lote 01 |")).toBeInTheDocument();
    expect(screen.getByText("DRE Norte")).toBeInTheDocument();

    expect(
      screen.getByRole("option", {
        name: "Empresa de Teste",
      }),
    ).toBeInTheDocument();
  });

  it("atualiza os lotes e as diretorias regionais selecionadas", () => {
    const { form } = renderizarComponente();

    fireEvent.click(screen.getByTestId("alterar-contratos[0].lotes"));

    expect(form.change).toHaveBeenCalledWith("contratos[0].lotes", [
      LOTE_1_UUID,
    ]);

    fireEvent.click(
      screen.getByTestId("alterar-contratos[0].diretorias_regionais"),
    );

    expect(form.change).toHaveBeenCalledWith(
      "contratos[0].diretorias_regionais",
      [DRE_1_UUID],
    );
  });

  it("adiciona uma nova vigência ao contrato", () => {
    const { push } = renderizarComponente();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Adicionar Vigência",
      }),
    );

    expect(push).toHaveBeenCalledWith("contratos[0].vigencias");
  });

  it("remove o segundo contrato", () => {
    const primeiroContrato = criarContrato();
    const segundoContrato = criarContrato({
      uuid: undefined,
      numero: "CONTRATO-002",
    });

    const values = criarValues([primeiroContrato, segundoContrato]);

    const { form } = renderizarComponente(values);

    fireEvent.click(screen.getByText("Remover contrato"));

    expect(form.change).toHaveBeenCalledWith("contratos", [primeiroContrato]);
  });

  it("remove uma vigência adicional", () => {
    const primeiraVigencia = {
      uuid: VIGENCIA_UUID,
      data_inicial: "01/01/2026",
      data_final: "31/12/2026",
      status: "ativo",
    };

    const segundaVigencia = {
      uuid: undefined,
      data_inicial: "01/01/2027",
      data_final: "31/12/2999",
      status: "ativo",
    };

    const contrato = criarContrato({
      vigencias: [primeiraVigencia, segundaVigencia],
    });

    const { form } = renderizarComponente(criarValues([contrato]));

    fireEvent.click(
      screen.getByRole("button", {
        name: "Remover",
      }),
    );

    expect(form.change).toHaveBeenCalledWith("contratos[0].vigencias", [
      primeiraVigencia,
    ]);
  });

  it("exibe aviso quando a última vigência está vencida", () => {
    const contrato = criarContrato({
      vigencias: [
        {
          uuid: VIGENCIA_UUID,
          data_inicial: "01/01/2020",
          data_final: "31/12/2020",
          status: "vencido",
        },
      ],
    });

    renderizarComponente(criarValues([contrato]));

    expect(
      screen.getByText(/Contrato fora do prazo de vigência/i),
    ).toBeInTheDocument();
  });

  it("exibe aviso e oculta ações quando o contrato está encerrado", () => {
    const contrato = criarContrato({
      encerrado: true,
      data_hora_encerramento: "15/06/2026 10:30:00",
    });

    renderizarComponente(criarValues([contrato]));

    expect(
      screen.getByText(/Contrato encerrado em 15\/06\/2026 10:30:00/i),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("button", {
        name: "Adicionar Vigência",
      }),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole("button", {
        name: "Encerrar contrato",
      }),
    ).not.toBeInTheDocument();
  });

  it("encerra o contrato e recarrega os dados do edital", async () => {
    (encerraContratoTerceirizada as jest.Mock).mockResolvedValue({
      status: HTTP_STATUS.OK,
      data: {},
    });

    const { getEditalContratoAsync } = renderizarComponente();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Encerrar contrato",
      }),
    );

    expect(screen.getByTestId("modal-encerrar-contrato")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Confirmar encerramento",
      }),
    );

    await waitFor(() => {
      expect(encerraContratoTerceirizada).toHaveBeenCalledWith(CONTRATO_UUID);

      expect(toastSuccess).toHaveBeenCalledWith(
        "Contrato encerrado com sucesso!",
      );

      expect(getEditalContratoAsync).toHaveBeenCalledWith(EDITAL_UUID);
    });

    expect(
      screen.queryByTestId("modal-encerrar-contrato"),
    ).not.toBeInTheDocument();
  });

  it("exibe mensagem de erro quando não consegue encerrar o contrato", async () => {
    (encerraContratoTerceirizada as jest.Mock).mockResolvedValue({
      status: HTTP_STATUS.BAD_REQUEST,
      data: {
        detail: "Não foi possível encerrar",
      },
    });

    (getError as jest.Mock).mockReturnValue("Não foi possível encerrar");

    renderizarComponente();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Encerrar contrato",
      }),
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Confirmar encerramento",
      }),
    );

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith("Não foi possível encerrar");
    });

    expect(toastSuccess).not.toHaveBeenCalled();
  });
});
