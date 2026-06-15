import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import { getError, mensagemCancelamento } from "src/helpers/utilities";
import { SolicitacaoAlimentacaoContext } from "src/context/SolicitacaoAlimentacao";
import { ModalCancelarKitLancheCEMEI } from "src/components/SolicitacaoKitLancheCEMEI/Relatorio/components/ModalCancelarKitLancheCEMEI";

jest.mock("src/helpers/utilities", () => ({
  getError: jest.fn(),
  mensagemCancelamento: jest.fn(),
}));

jest.mock("src/helpers/fieldValidators", () => ({
  textAreaRequired: jest.fn(),
}));

jest.mock("src/components/Shareable/Botao/constants", () => ({
  BUTTON_STYLE: {
    GREEN: "green",
    GREEN_OUTLINE: "green-outline",
  },
  BUTTON_TYPE: {
    BUTTON: "button",
    SUBMIT: "submit",
  },
}));

jest.mock("src/components/Shareable/Botao", () => {
  const React = require("react");

  return {
    __esModule: true,
    default: ({ texto, type, onClick, disabled, className }) =>
      React.createElement(
        "button",
        {
          type,
          onClick,
          disabled,
          className,
        },
        texto,
      ),
  };
});

jest.mock("src/components/Shareable/TextArea/TextArea", () => {
  const React = require("react");

  return {
    TextArea: ({ input, label, placeholder, required, inputOnChange }) =>
      React.createElement(
        "label",
        null,
        label,
        React.createElement("textarea", {
          "aria-label": label,
          name: input.name,
          value: input.value || "",
          placeholder,
          required,
          onChange: (event) => {
            input.onChange(event);

            if (inputOnChange) {
              inputOnChange(event);
            }
          },
        }),
      ),
  };
});

jest.mock("react-bootstrap", () => {
  const React = require("react");

  const Modal = ({ show, children }) => {
    if (!show) {
      return null;
    }

    return React.createElement("div", { "data-testid": "modal" }, children);
  };

  Modal.Header = ({ children }) =>
    React.createElement("div", { "data-testid": "modal-header" }, children);

  Modal.Title = ({ children }) => React.createElement("h1", null, children);

  Modal.Body = ({ children }) =>
    React.createElement("div", { "data-testid": "modal-body" }, children);

  Modal.Footer = ({ children }) =>
    React.createElement("div", { "data-testid": "modal-footer" }, children);

  return {
    Modal,
  };
});

const mockUpdateSolicitacaoAlimentacao = jest.fn();

const solicitacaoMock = {
  uuid: "f79bb7f6-3e6f-4d07-b5f8-0e8bbd8d347a",
  status: "CODAE_AUTORIZADO",
};

const renderComponent = (props = {}) => {
  const defaultProps = {
    showModal: true,
    closeModal: jest.fn(),
    solicitacao: solicitacaoMock,
    endpoint: jest.fn(),
    loadSolicitacao: undefined,
  };

  const mergedProps = {
    ...defaultProps,
    ...props,
  };

  render(
    <SolicitacaoAlimentacaoContext.Provider
      value={{
        updateSolicitacaoAlimentacao: mockUpdateSolicitacaoAlimentacao,
      }}
    >
      <ModalCancelarKitLancheCEMEI {...mergedProps} />
    </SolicitacaoAlimentacaoContext.Provider>,
  );

  return mergedProps;
};

describe("ModalCancelarKitLancheCEMEI", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mensagemCancelamento.mockReturnValue("Essa solicitação será cancelada. ");
    getError.mockReturnValue("Erro tratado");
  });

  it("renderiza o modal com título, mensagem, campo de justificativa e botões", () => {
    renderComponent();

    expect(screen.getByTestId("modal")).toBeInTheDocument();

    expect(screen.getByText("Cancelamento de Solicitação")).toBeInTheDocument();

    expect(mensagemCancelamento).toHaveBeenCalledWith(solicitacaoMock.status);

    expect(
      screen.getByText(/Essa solicitação será cancelada/i),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Deseja seguir em frente com o cancelamento/i),
    ).toBeInTheDocument();

    expect(screen.getByLabelText("Justificativa")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Não" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sim" })).toBeDisabled();
  });

  it("não renderiza o modal quando showModal for false", () => {
    renderComponent({
      showModal: false,
    });

    expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
  });

  it("fecha o modal ao clicar no botão Não", () => {
    const closeModal = jest.fn();

    renderComponent({
      closeModal,
    });

    fireEvent.click(screen.getByRole("button", { name: "Não" }));

    expect(closeModal).toHaveBeenCalledTimes(1);
  });
});
