import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { Botoes } from "src/components/screens/Produto/AvaliarReclamacaoProduto/components/Botoes";

jest.mock("src/components/Shareable/Botao", () => ({
  __esModule: true,
  default: ({ texto, onClick, disabled, icon }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      data-testid={`botao-${texto.toLowerCase().replace(/\s+/g, "-")}`}
      data-icon={icon || ""}
    >
      {texto}
    </button>
  ),
}));

const makeProduto = (status) => ({
  ultima_homologacao: { status },
});

const defaultProps = {
  produto: makeProduto("ESCOLA_OU_NUTRICIONISTA_RECLAMOU"),
  setVerProduto: jest.fn(),
  verUnicoProduto: false,
  setModal: jest.fn(),
  setProdutoAAtualizar: jest.fn(),
  setPropsPageProduto: jest.fn(),
};

const renderComponent = (props = {}) =>
  render(<Botoes {...defaultProps} {...props} />);

describe("Botoes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.scrollTo = jest.fn();
  });

  describe("Renderização", () => {
    it("deve renderizar os 4 botões", () => {
      renderComponent();
      expect(screen.getByTestId("botao-ver-produto")).toBeInTheDocument();
      expect(
        screen.getByTestId("botao-questionar-terceirizada"),
      ).toBeInTheDocument();
      expect(screen.getByTestId("botao-recusar")).toBeInTheDocument();
      expect(screen.getByTestId("botao-aceitar")).toBeInTheDocument();
    });

    it("deve exibir texto 'Ver produto' quando verUnicoProduto é false", () => {
      renderComponent({ verUnicoProduto: false });
      expect(screen.getByTestId("botao-ver-produto")).toHaveTextContent(
        "Ver produto",
      );
    });

    it("deve exibir texto 'Voltar' quando verUnicoProduto é true", () => {
      renderComponent({ verUnicoProduto: true });
      expect(screen.getByTestId("botao-voltar")).toBeInTheDocument();
    });
  });

  describe("Botão Ver produto / Voltar", () => {
    it("deve chamar setVerProduto com o produto quando verUnicoProduto é false", () => {
      renderComponent({ verUnicoProduto: false });
      fireEvent.click(screen.getByTestId("botao-ver-produto"));
      expect(defaultProps.setVerProduto).toHaveBeenCalledWith(
        defaultProps.produto,
      );
    });

    it("deve chamar setVerProduto com null quando verUnicoProduto é true", () => {
      renderComponent({ verUnicoProduto: true });
      fireEvent.click(screen.getByTestId("botao-voltar"));
      expect(defaultProps.setVerProduto).toHaveBeenCalledWith(null);
    });

    it("deve chamar setPropsPageProduto com o produto quando verUnicoProduto é false", () => {
      renderComponent({ verUnicoProduto: false });
      fireEvent.click(screen.getByTestId("botao-ver-produto"));
      expect(defaultProps.setPropsPageProduto).toHaveBeenCalledWith(
        defaultProps.produto,
      );
    });

    it("deve chamar setPropsPageProduto com null quando verUnicoProduto é true", () => {
      renderComponent({ verUnicoProduto: true });
      fireEvent.click(screen.getByTestId("botao-voltar"));
      expect(defaultProps.setPropsPageProduto).toHaveBeenCalledWith(null);
    });

    it("não deve chamar setPropsPageProduto quando a prop não é fornecida", () => {
      const props = { ...defaultProps, setPropsPageProduto: undefined };
      render(<Botoes {...props} />);
      // não deve lançar erro
      fireEvent.click(screen.getByTestId("botao-ver-produto"));
      expect(defaultProps.setVerProduto).toHaveBeenCalled();
    });

    it("deve chamar window.scrollTo(0, 0) ao clicar", () => {
      renderComponent();
      fireEvent.click(screen.getByTestId("botao-ver-produto"));
      expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    });
  });

  describe("Botão Questionar terceirizada", () => {
    it("deve estar habilitado quando status é ESCOLA_OU_NUTRICIONISTA_RECLAMOU", () => {
      renderComponent({
        produto: makeProduto("ESCOLA_OU_NUTRICIONISTA_RECLAMOU"),
      });
      expect(
        screen.getByTestId("botao-questionar-terceirizada"),
      ).not.toBeDisabled();
    });

    it("deve estar desabilitado quando status é TERCEIRIZADA_RESPONDEU_RECLAMACAO", () => {
      renderComponent({
        produto: makeProduto("TERCEIRIZADA_RESPONDEU_RECLAMACAO"),
      });
      expect(
        screen.getByTestId("botao-questionar-terceirizada"),
      ).toBeDisabled();
    });

    it("deve estar desabilitado para status não permitido", () => {
      renderComponent({ produto: makeProduto("OUTRO_STATUS") });
      expect(
        screen.getByTestId("botao-questionar-terceirizada"),
      ).toBeDisabled();
    });

    it("deve chamar setModal com 'Questionar terceirizada' ao clicar", () => {
      renderComponent();
      fireEvent.click(screen.getByTestId("botao-questionar-terceirizada"));
      expect(defaultProps.setModal).toHaveBeenCalledWith(
        "Questionar terceirizada",
      );
    });

    it("deve chamar setProdutoAAtualizar com o produto ao clicar", () => {
      renderComponent();
      fireEvent.click(screen.getByTestId("botao-questionar-terceirizada"));
      expect(defaultProps.setProdutoAAtualizar).toHaveBeenCalledWith(
        defaultProps.produto,
      );
    });
  });

  describe("Botão Recusar", () => {
    it.each([
      "ESCOLA_OU_NUTRICIONISTA_RECLAMOU",
      "TERCEIRIZADA_RESPONDEU_RECLAMACAO",
    ])("deve estar habilitado quando status é %s", (status) => {
      renderComponent({ produto: makeProduto(status) });
      expect(screen.getByTestId("botao-recusar")).not.toBeDisabled();
    });

    it("deve estar desabilitado para status não permitido", () => {
      renderComponent({ produto: makeProduto("OUTRO_STATUS") });
      expect(screen.getByTestId("botao-recusar")).toBeDisabled();
    });

    it("deve chamar setModal com 'Recusar reclamação' ao clicar", () => {
      renderComponent();
      fireEvent.click(screen.getByTestId("botao-recusar"));
      expect(defaultProps.setModal).toHaveBeenCalledWith("Recusar reclamação");
    });

    it("deve chamar setProdutoAAtualizar com o produto ao clicar", () => {
      renderComponent();
      fireEvent.click(screen.getByTestId("botao-recusar"));
      expect(defaultProps.setProdutoAAtualizar).toHaveBeenCalledWith(
        defaultProps.produto,
      );
    });
  });

  describe("Botão Aceitar", () => {
    it.each([
      "ESCOLA_OU_NUTRICIONISTA_RECLAMOU",
      "TERCEIRIZADA_RESPONDEU_RECLAMACAO",
    ])("deve estar habilitado quando status é %s", (status) => {
      renderComponent({ produto: makeProduto(status) });
      expect(screen.getByTestId("botao-aceitar")).not.toBeDisabled();
    });

    it("deve estar desabilitado para status não permitido", () => {
      renderComponent({ produto: makeProduto("OUTRO_STATUS") });
      expect(screen.getByTestId("botao-aceitar")).toBeDisabled();
    });

    it("deve chamar setModal com 'Aceitar reclamação' ao clicar", () => {
      renderComponent();
      fireEvent.click(screen.getByTestId("botao-aceitar"));
      expect(defaultProps.setModal).toHaveBeenCalledWith("Aceitar reclamação");
    });

    it("deve chamar setProdutoAAtualizar com o produto ao clicar", () => {
      renderComponent();
      fireEvent.click(screen.getByTestId("botao-aceitar"));
      expect(defaultProps.setProdutoAAtualizar).toHaveBeenCalledWith(
        defaultProps.produto,
      );
    });
  });
});
