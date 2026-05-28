import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import ListagemGuias from "src/components/screens/Logistica/GestaoRequisicaoEntrega/components/ListagemGuias";

jest.mock("src/components/Shareable/Botao", () => {
  return ({ texto, onClick, disabled }) => (
    <button onClick={onClick} disabled={disabled}>
      {texto}
    </button>
  );
});

jest.mock("src/components/Shareable/Botao/constants", () => ({
  BUTTON_TYPE: { BUTTON: "button" },
  BUTTON_STYLE: { GREEN: "green", GREEN_OUTLINE: "green-outline" },
}));

jest.mock("antd", () => ({
  Spin: ({ children }) => <div>{children}</div>,
}));

const guiaMock = {
  numero_guia: "G-001",
  nome_unidade: "Escola Municipal A",
  status: "Pendente",
  codigo_unidade: "COD-123",
  endereco_unidade: "Rua das Flores",
  numero_unidade: "100",
  bairro_unidade: "Centro",
  cep_unidade: "01000-000",
  cidade_unidade: "São Paulo",
  estado_unidade: "SP",
  contato_unidade: "João Silva",
  telefone_unidade: "(11) 99999-9999",
  alimentos: [
    {
      nome_alimento: "Arroz",
      embalagens: [
        {
          qtd_volume: 10,
          tipo_embalagem: "Saco",
          capacidade_completa: "5kg",
        },
      ],
    },
  ],
};

const guiaAguardandoCancelamentoMock = {
  ...guiaMock,
  numero_guia: "G-002",
  status: "Aguardando cancelamento",
};

const solicitacaoMock = {
  guias: [guiaMock],
};

const solicitacaoComCancelamentoMock = {
  guias: [guiaAguardandoCancelamentoMock],
};

const solicitacaoVaziaMock = {
  guias: [],
};

const confirmaCancelamentoGuiasMock = jest.fn();

const renderComponent = (solicitacao = solicitacaoMock) =>
  render(
    <ListagemGuias
      solicitacao={solicitacao}
      confirmaCancelamentoGuias={confirmaCancelamentoGuiasMock}
    />,
  );

describe("ListagemGuias", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Renderização da listagem", () => {
    it("não renderiza a seção quando não há guias", () => {
      renderComponent(solicitacaoVaziaMock);
      expect(
        screen.queryByText("Nº da Guia de Remessa"),
      ).not.toBeInTheDocument();
    });

    it("renderiza os cabeçalhos da tabela quando há guias", () => {
      renderComponent();
      expect(screen.getByText("Nº da Guia de Remessa")).toBeInTheDocument();
      expect(
        screen.getByText("Nome da Unidade Educacional"),
      ).toBeInTheDocument();
      expect(screen.getByText("Status")).toBeInTheDocument();
    });

    it("renderiza os dados da guia corretamente", () => {
      renderComponent();
      expect(screen.getByText("G-001")).toBeInTheDocument();
      expect(screen.getByText("Escola Municipal A")).toBeInTheDocument();
      expect(screen.getByText("Pendente")).toBeInTheDocument();
    });
  });

  describe("Botão Confirmar Cancelamento", () => {
    it("está desabilitado quando nenhuma guia está com status 'Aguardando cancelamento'", () => {
      renderComponent(solicitacaoMock);
      const botao = screen.getByText("Confirmar Cancelamento");
      expect(botao).toBeDisabled();
    });

    it("está habilitado quando há guia com status 'Aguardando cancelamento'", () => {
      renderComponent(solicitacaoComCancelamentoMock);
      const botao = screen.getByText("Confirmar Cancelamento");
      expect(botao).not.toBeDisabled();
    });

    it("abre o modal de confirmação ao clicar no botão", () => {
      renderComponent(solicitacaoComCancelamentoMock);
      fireEvent.click(screen.getByText("Confirmar Cancelamento"));
      expect(
        screen.getByText(/Cancelar a\(s\) Guia\(s\) de Remessa\?/),
      ).toBeInTheDocument();
    });
  });

  describe("Modal de confirmação de cancelamento", () => {
    beforeEach(() => {
      renderComponent(solicitacaoComCancelamentoMock);
      fireEvent.click(screen.getByText("Confirmar Cancelamento"));
    });

    it("chama confirmaCancelamentoGuias ao clicar em SIM", () => {
      fireEvent.click(screen.getByText("SIM"));
      expect(confirmaCancelamentoGuiasMock).toHaveBeenCalledWith(
        solicitacaoComCancelamentoMock,
        expect.any(Function),
        expect.any(Function),
      );
    });
  });

  describe("Modal de detalhes da guia", () => {
    beforeEach(() => {
      renderComponent();
      fireEvent.click(screen.getByText("G-001"));
    });

    it("abre o modal ao clicar no número da guia", () => {
      expect(
        screen.getByText("Nº da Guia de Remessa: G-001"),
      ).toBeInTheDocument();
    });

    it("exibe o endereço completo", () => {
      expect(screen.getByText(/Rua das Flores/)).toBeInTheDocument();
      expect(screen.getByText(/Centro/)).toBeInTheDocument();
      expect(screen.getByText(/01000-000/)).toBeInTheDocument();
      expect(screen.getByText(/São Paulo/)).toBeInTheDocument();
    });

    it("exibe a lista de produtos", () => {
      expect(screen.getByText("Arroz")).toBeInTheDocument();
      expect(screen.getByText("10")).toBeInTheDocument();
      expect(screen.getByText("Saco")).toBeInTheDocument();
      expect(screen.getByText("5kg")).toBeInTheDocument();
    });

    it("abre o modal ao clicar no nome da unidade", () => {
      fireEvent.click(screen.getByText("Fechar"));
      fireEvent.click(screen.getAllByText("Escola Municipal A")[0]);
      expect(
        screen.getByText("Nº da Guia de Remessa: G-001"),
      ).toBeInTheDocument();
    });

    it("abre o modal ao clicar no status", () => {
      fireEvent.click(screen.getByText("Fechar"));
      fireEvent.click(screen.getByText("Pendente"));
      expect(
        screen.getByText("Nº da Guia de Remessa: G-001"),
      ).toBeInTheDocument();
    });
  });
});
