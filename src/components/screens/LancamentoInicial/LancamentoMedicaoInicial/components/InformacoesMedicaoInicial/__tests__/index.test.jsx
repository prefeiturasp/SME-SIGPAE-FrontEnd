import React from "react";
import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { useLocation } from "react-router-dom";
import HTTP_STATUS from "http-status-codes";
import InformacoesBasicas from "src/components/screens/LancamentoInicial/LancamentoMedicaoInicial/components/InformacoesMedicaoInicial";
import { mockSolicitacaoMedicaoInicialEMEFMaio2025 } from "src/mocks/services/solicitacaoMedicaoInicial.service/EMEF/solicitacaoMedicaoInicialMaio2025";

jest.mock("react-router-dom", () => ({
  useLocation: jest.fn(),
}));

jest.mock(
  "src/services/medicaoInicial/solicitacaoMedicaoInicial.service",
  () => ({
    getTiposDeContagemAlimentacao: jest.fn(),
    setSolicitacaoMedicaoInicial: jest.fn(),
    updateInformacoesBasicas: jest.fn(),
  }),
);

jest.mock("src/components/Shareable/Toast/dialogs", () => ({
  toastError: jest.fn(),
  toastSuccess: jest.fn(),
}));

jest.mock("src/configs/constants", () => ({
  DETALHAMENTO_DO_LANCAMENTO: "detalhamento-lancamento",
}));

const mockGetTiposDeContagemAlimentacao =
  require("src/services/medicaoInicial/solicitacaoMedicaoInicial.service").getTiposDeContagemAlimentacao;
const mockSetSolicitacaoMedicaoInicial =
  require("src/services/medicaoInicial/solicitacaoMedicaoInicial.service").setSolicitacaoMedicaoInicial;
const mockUpdateInformacoesBasicas =
  require("src/services/medicaoInicial/solicitacaoMedicaoInicial.service").updateInformacoesBasicas;
const mockToastError =
  require("src/components/Shareable/Toast/dialogs").toastError;
const mockToastSuccess =
  require("src/components/Shareable/Toast/dialogs").toastSuccess;

describe("InformacoesBasicas", () => {
  const defaultProps = {
    periodoSelecionado: "2025-05-01",
    escolaInstituicao: {
      uuid: "3c32be8e-f191-468d-a4e2-3dd8751e5e7a",
      nome: "EMEF PERICLES EUGENIO DA SILVA RAMOS",
    },
    nomeTerceirizada: "Terceirizada Teste Ltda",
    solicitacaoMedicaoInicial: null,
    onClickInfoBasicas: jest.fn(),
  };

  const mockTiposContagem = [
    {
      nome: "Fichas Coloridas",
      ativo: true,
      uuid: "ecf37fa8-4f6c-4b55-9df3-868c12999015",
    },
    {
      nome: "Contagem de Utensílios",
      ativo: true,
      uuid: "d1027ac7-439f-4d5c-b010-d50d8eed2b40",
    },
    {
      nome: "Balança (autosserviço)",
      ativo: true,
      uuid: "94993c31-6ba9-49db-9fb3-83326ba0209b",
    },
    {
      nome: "Catraca",
      ativo: true,
      uuid: "ba5136c7-5da0-4904-9774-b61252902857",
    },
  ];

  const mockSolicitacaoExistente = {
    // mockSolicitacaoMedicaoInicialEMEFMaio2025
    uuid: "solicitacao-uuid-123",
    tipos_contagem_alimentacao: [
      {
        nome: "Contagem de Utensílios",
        ativo: true,
        uuid: "d1027ac7-439f-4d5c-b010-d50d8eed2b40",
      },
    ],
    responsaveis: [
      { nome: "João Silva", rf: "1234567" },
      { nome: "Maria Santos", rf: "7654321" },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetTiposDeContagemAlimentacao.mockResolvedValue({
      data: mockTiposContagem,
    });
    useLocation.mockReturnValue({
      pathname: "/medicao-inicial",
      state: null,
    });
  });

  it("deve renderizar o componente corretamente", async () => {
    await act(async () => {
      render(<InformacoesBasicas {...defaultProps} />);
    });

    expect(
      screen.getByText("Informações Básicas da Medição Inicial"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Método de Contagem das Alimentações Servidas"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Nome da Empresa Responsável pelo Atendimento"),
    ).toBeInTheDocument();
    expect(screen.getByText("Terceirizada Teste Ltda")).toBeInTheDocument();
  });

  it("deve carregar os tipos de contagem ao montar o componente", async () => {
    await act(async () => {
      render(<InformacoesBasicas {...defaultProps} />);
    });
    expect(mockGetTiposDeContagemAlimentacao).toHaveBeenCalledTimes(1);
  });

  it("deve preencher os dados quando solicitacaoMedicaoInicial existe", async () => {
    const propsComSolicitacao = {
      ...defaultProps,
      solicitacaoMedicaoInicial: mockSolicitacaoExistente,
    };

    await act(async () => {
      render(<InformacoesBasicas {...propsComSolicitacao} />);
    });

    const collapseHeader = screen.getByText(
      "Informações Básicas da Medição Inicial",
    );
    await act(async () => {
      fireEvent.click(collapseHeader);
    });
    expect(screen.getByDisplayValue("João Silva")).toBeInTheDocument();
    expect(screen.getByDisplayValue("1234567")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Maria Santos")).toBeInTheDocument();
    expect(screen.getByDisplayValue("7654321")).toBeInTheDocument();
  });

  it("deve atualizar solicitação existente", async () => {
    mockUpdateInformacoesBasicas.mockResolvedValue({
      status: HTTP_STATUS.OK,
    });

    const propsComSolicitacao = {
      ...defaultProps,
      solicitacaoMedicaoInicial: mockSolicitacaoMedicaoInicialEMEFMaio2025[0],
    };

    await act(async () => {
      render(<InformacoesBasicas {...propsComSolicitacao} />);
    });

    const collapseHeader = screen.getByText(
      "Informações Básicas da Medição Inicial",
    );
    await act(async () => {
      fireEvent.click(collapseHeader);
    });

    const botaoEditar = screen.getByText("Editar");
    await act(async () => {
      fireEvent.click(botaoEditar);
    });

    const botaoSalvar = screen.getByText("Salvar");
    await act(async () => {
      fireEvent.click(botaoSalvar);
    });

    expect(mockToastSuccess).toHaveBeenCalledWith(
      "Método de Contagem / Responsável atualizado com sucesso",
    );
  });

  it("deve mostrar mensagem de erro quando criação falhar", async () => {
    const erroResponse = {
      status: HTTP_STATUS.BAD_REQUEST,
      data: {
        escola: ["Escola inválida"],
        tipos_contagem: ["Tipo de contagem obrigatório"],
      },
    };
    mockSetSolicitacaoMedicaoInicial.mockResolvedValue(erroResponse);

    await act(async () => {
      render(<InformacoesBasicas {...defaultProps} />);
    });

    const botaoEditar = screen.getByText("Editar");
    await act(async () => {
      fireEvent.click(botaoEditar);
    });

    const inputResponsavelNome = screen.getByTestId("input-responsavel-nome-0");
    fireEvent.change(inputResponsavelNome, {
      target: { value: "Fulano da Silva" },
    });

    const inputResponsavelRf = screen.getByTestId("input-responsavel-rf-0");
    fireEvent.change(inputResponsavelRf, {
      target: { value: "1234567" },
    });

    const botaoSalvar = screen.getByText("Salvar");
    await act(async () => {
      fireEvent.click(botaoSalvar);
    });

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith(
        "Erro: Escola inválida; Tipo de contagem obrigatório",
      );
    });
  });

  it("não deve mostrar botões quando status é 'Aprovado pela DRE'", async () => {
    useLocation.mockReturnValue({
      pathname: "/medicao-inicial",
      state: { status: "Aprovado pela DRE" },
    });

    await act(async () => {
      render(<InformacoesBasicas {...defaultProps} />);
    });

    expect(screen.queryByText("Editar")).not.toBeInTheDocument();
    expect(screen.queryByText("Salvar")).not.toBeInTheDocument();
  });

  it("não deve mostrar botões quando pathname inclui DETALHAMENTO_DO_LANCAMENTO", async () => {
    useLocation.mockReturnValue({
      pathname: "/detalhamento-lancamento/123",
      state: null,
    });

    await act(async () => {
      render(<InformacoesBasicas {...defaultProps} />);
    });

    expect(screen.queryByText("Editar")).not.toBeInTheDocument();
    expect(screen.queryByText("Salvar")).not.toBeInTheDocument();
  });

  it("deve permitir apenas números no campo RF", async () => {
    await act(async () => {
      render(<InformacoesBasicas {...defaultProps} />);
    });

    const botaoEditar = screen.getByText("Editar");
    await act(async () => {
      fireEvent.click(botaoEditar);
    });

    const inputRF = screen.getByTestId("input-responsavel-nome-0");
    await act(async () => {
      fireEvent.keyPress(inputRF, { key: "a", code: "KeyA" });
    });
    expect(inputRF).toHaveValue("");

    await act(async () => {
      fireEvent.change(inputRF, { target: { value: "1234567" } });
    });

    expect(inputRF).toHaveValue("1234567");
  });

  it("deve validar responsáveis antes de salvar", async () => {
    await act(async () => {
      render(<InformacoesBasicas {...defaultProps} />);
    });

    const botaoEditar = screen.getByText("Editar");
    await act(async () => {
      fireEvent.click(botaoEditar);
    });

    const botaoSalvar = screen.getByText("Salvar");
    await act(async () => {
      fireEvent.click(botaoSalvar);
    });

    expect(mockToastError).toHaveBeenCalledWith(
      "Pelo menos um responsável deve ser cadastrado",
    );
  });
});
