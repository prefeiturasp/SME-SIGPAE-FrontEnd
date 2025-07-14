import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import InputSearchPendencias from "../index";
import { Form } from "react-final-form";

jest.mock("src/helpers/utilities", () => ({
  usuarioEhEmpresaTerceirizada: jest.fn(),
}));

jest.mock("src/configs/constants", () => ({
  SOLICITACOES_AUTORIZADAS: "AUTORIZADAS",
  SOLICITACOES_CANCELADAS: "CANCELADAS",
  SOLICITACOES_NEGADAS: "NEGADAS",
}));

const mockLocation = {
  pathname: "",
};
Object.defineProperty(window, "location", {
  value: mockLocation,
  writable: true,
});

describe("InputSearchPendencias", () => {
  const mockFilterList = jest.fn();
  const mockProps = {
    filterList: mockFilterList,
    tipoSolicitacao: "",
    listaLotes: [
      { nome: "Selecione um Lote", uuid: "" },
      { nome: "Lote 1", uuid: "1" },
    ],
    editais: [
      { label: "Edital 1", value: "1" },
      { label: "Edital 2", value: "2" },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar corretamente sem erros", () => {
    render(
      <Form onSubmit={() => {}}>
        {() => <InputSearchPendencias {...mockProps} />}
      </Form>
    );
    expect(screen.getByPlaceholderText("Pesquisar")).toBeInTheDocument();
  });

  describe("quando o usuário NÃO é terceirizada", () => {
    beforeEach(() => {
      require("src/helpers/utilities").usuarioEhEmpresaTerceirizada.mockReturnValue(
        false
      );
    });

    it("deve renderizar apenas o campo de pesquisa", () => {
      render(
        <Form onSubmit={() => {}}>
          {() => <InputSearchPendencias {...mockProps} />}
        </Form>
      );

      expect(screen.getByPlaceholderText("Pesquisar")).toBeInTheDocument();
      expect(screen.queryByText("Conferência Status")).not.toBeInTheDocument();
      expect(screen.queryByText("Selecione um Lote")).not.toBeInTheDocument();
    });

    it("deve chamar filterList ao digitar no campo de pesquisa", () => {
      render(
        <Form onSubmit={() => {}}>
          {() => <InputSearchPendencias {...mockProps} />}
        </Form>
      );

      const input = screen.getByPlaceholderText("Pesquisar");
      fireEvent.change(input, { target: { value: "teste" } });

      expect(mockFilterList).toHaveBeenCalled();
    });
  });

  describe("quando o usuário é terceirizada", () => {
    beforeEach(() => {
      require("src/helpers/utilities").usuarioEhEmpresaTerceirizada.mockReturnValue(
        true
      );
    });

    it("deve renderizar campos adicionais para terceirizada", () => {
      mockLocation.pathname = "/solicitacoes-dieta-especial";
      render(
        <Form onSubmit={() => {}}>
          {() => (
            <InputSearchPendencias
              {...mockProps}
              tipoSolicitacao="AUTORIZADAS"
            />
          )}
        </Form>
      );

      expect(screen.getByPlaceholderText("Pesquisar")).toBeInTheDocument();
      expect(screen.getByText("Conferência Status")).toBeInTheDocument();
      expect(screen.getByText("Selecione um Lote")).toBeInTheDocument();
    });

    it("deve chamar filterList ao selecionar status", () => {
      mockLocation.pathname = "/solicitacoes-dieta-especial";
      render(
        <Form onSubmit={() => {}}>
          {() => (
            <InputSearchPendencias
              {...mockProps}
              tipoSolicitacao="AUTORIZADAS"
            />
          )}
        </Form>
      );

      const select = screen.getByText("Conferência Status").closest("select");
      fireEvent.change(select, { target: { value: "1" } });

      expect(mockFilterList).toHaveBeenCalled();
    });

    it("deve chamar filterList ao selecionar lote", () => {
      mockLocation.pathname = "/solicitacoes-dieta-especial";
      render(
        <Form onSubmit={() => {}}>
          {() => (
            <InputSearchPendencias
              {...mockProps}
              tipoSolicitacao="AUTORIZADAS"
            />
          )}
        </Form>
      );

      const select = screen.getByText("Selecione um Lote").closest("select");
      fireEvent.change(select, { target: { value: "1" } });

      expect(mockFilterList).toHaveBeenCalled();
    });

    it("não deve renderizar campo de status quando tipoSolicitacao não está na lista permitida", () => {
      mockLocation.pathname = "/solicitacoes-dieta-especial";
      render(
        <Form onSubmit={() => {}}>
          {() => (
            <InputSearchPendencias {...mockProps} tipoSolicitacao="OUTRO" />
          )}
        </Form>
      );

      expect(screen.queryByText("Conferência Status")).not.toBeInTheDocument();
    });
  });

  describe("quando está na URL de gestão de produto", () => {
    beforeEach(() => {
      mockLocation.pathname = "/gestao-produto";
    });

    it("deve renderizar campos específicos para gestão de produto", () => {
      render(
        <Form onSubmit={() => {}}>
          {() => <InputSearchPendencias {...mockProps} />}
        </Form>
      );

      expect(screen.getByText("Número do Edital")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Pesquisar")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Busca da Marca")).toBeInTheDocument();
      expect(screen.getAllByText("* mínimo de 3 caracteres").length).toBe(2);
    });

    it("deve chamar filterList ao selecionar edital", () => {
      render(
        <Form onSubmit={() => {}}>
          {() => <InputSearchPendencias {...mockProps} />}
        </Form>
      );

      const select = screen
        .getByText("Número do Edital")
        .closest("div")
        .querySelector("input");
      fireEvent.mouseDown(select);
      const option = screen.getByText("Edital 1");
      fireEvent.click(option);

      expect(mockFilterList).toHaveBeenCalled();
    });

    it("deve chamar filterList ao digitar no campo de marca", () => {
      render(
        <Form onSubmit={() => {}}>
          {() => <InputSearchPendencias {...mockProps} />}
        </Form>
      );

      const input = screen.getByPlaceholderText("Busca da Marca");
      fireEvent.change(input, { target: { value: "teste" } });

      expect(mockFilterList).toHaveBeenCalled();
    });
  });

  it("deve carregar valores iniciais quando fornecidos", () => {
    const propsComValoresIniciais = {
      ...mockProps,
      propsDieta: {
        tituloDieta: "Dieta Teste",
        statusDieta: "1",
        loteDieta: "1",
      },
      propsProduto: {
        editalProduto: "1",
        nomeProduto: "Produto Teste",
        marcaProduto: "Marca Teste",
      },
    };

    mockLocation.pathname = "/gestao-produto";
    require("src/helpers/utilities").usuarioEhEmpresaTerceirizada.mockReturnValue(
      true
    );

    render(
      <Form onSubmit={() => {}}>
        {() => (
          <InputSearchPendencias
            {...propsComValoresIniciais}
            tipoSolicitacao="AUTORIZADAS"
          />
        )}
      </Form>
    );

    expect(screen.getByDisplayValue("Dieta Teste")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Marca Teste")).toBeInTheDocument();
    expect(screen.getByText("Edital 1")).toBeInTheDocument();
  });
});
