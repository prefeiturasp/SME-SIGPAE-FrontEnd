import React from "react";
import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import { useLocation, useSearchParams } from "react-router-dom";
import { InformacoesMedicaoInicialCEI } from "src/components/screens/LancamentoInicial/LancamentoMedicaoInicial/components/InformacoesMedicaoInicialCEI";

jest.mock("react-router-dom", () => ({
  useLocation: jest.fn(),
  useSearchParams: jest.fn(),
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

describe("InformacoesBasicasCEI", () => {
  const defaultProps = {
    periodoSelecionado: "Dezembro / 2025",
    escolaInstituicao: {
      uuid: "f6bcf672-e8f4-4182-89ee-0633f2dd95a2",
      nome: "CEI INDIRETO ALVORECER",
    },
    nomeTerceirizada: "Terceirizada CEI Teste Ltda",
    solicitacaoMedicaoInicial: null,
    onClickInfoBasicas: jest.fn(),
    objectoPeriodos: [],
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

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetTiposDeContagemAlimentacao.mockResolvedValue({
      data: mockTiposContagem,
    });
    useLocation.mockReturnValue({
      pathname: "/medicao-inicial",
      state: null,
    });

    // Mock do useSearchParams retornando URLSearchParams vazio
    const mockSearchParams = new URLSearchParams();
    const mockSetSearchParams = jest.fn();
    useSearchParams.mockReturnValue([mockSearchParams, mockSetSearchParams]);
  });

  it("deve desabilitar o botão Editar quando não há período selecionado", async () => {
    const propsComPeriodoNulo = {
      ...defaultProps,
      periodoSelecionado: null,
    };

    await act(async () => {
      render(<InformacoesMedicaoInicialCEI {...propsComPeriodoNulo} />);
    });

    const botaoEditar = screen.getByText("Editar").closest("button");
    expect(botaoEditar).toBeDisabled();
  });
});
