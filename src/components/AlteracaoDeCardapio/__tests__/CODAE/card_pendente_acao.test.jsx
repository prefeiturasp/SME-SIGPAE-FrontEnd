import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { TIPO_PERFIL, TIPO_SOLICITACAO } from "src/constants/shared";
import { mockDiretoriaRegionalSimplissima } from "src/mocks/diretoriaRegional.service/mockDiretoriaRegionalSimplissima";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockLotesSimples } from "src/mocks/lote.service/mockLotesSimples";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { codaeListarSolicitacoesDeAlteracaoDeCardapio } from "src/services/alteracaoDeCardapio";
import { getDiretoriaregionalSimplissima } from "src/services/diretoriaRegional.service";
import { getLotesSimples } from "src/services/lote.service";
import Container from "../../CODAE/PainelPedidos/Container";

jest.mock("src/services/alteracaoDeCardapio");
jest.mock("src/services/lote.service");
jest.mock("src/services/diretoriaRegional.service");

const pedidoBase = (uuid, id, nomeEscola, codigoEol, overrides) => ({
  uuid,
  id_externo: id,
  escola: { uuid: `escola-${uuid}`, nome: nomeEscola, codigo_eol: codigoEol },
  prioridade: "REGULAR",
  ...overrides,
});

const pedidosCustomizados = [
  pedidoBase("u1", "P001", "EMEF TESTE UM", "000001", {
    data_inicial: "20/02/2025",
  }),
  pedidoBase("u2", "P002", "EMEF TESTE DOIS", "000002", {
    alterar_dia: "21/02/2025",
  }),
  pedidoBase("u3", "P003", "EMEF TESTE TRES", "000003", {
    inclusoes: [{ data: "22/02/2025" }],
  }),
  pedidoBase("u4", "P004", "EMEF TESTE QUATRO", "000004", {
    data: "23/02/2025",
  }),
  pedidoBase("u5", "P005", "EMEF TESTE CINCO", "000005", {
    data_inicial: "24/02/2025",
    alunos_cei_e_ou_emei: "EMEI",
  }),
];

describe("CardPendenteAcao - Painel Pedidos CODAE", () => {
  beforeEach(async () => {
    getDiretoriaregionalSimplissima.mockResolvedValue({
      data: mockDiretoriaRegionalSimplissima,
      status: 200,
    });
    getLotesSimples.mockResolvedValue({
      data: mockLotesSimples,
      status: 200,
    });

    codaeListarSolicitacoesDeAlteracaoDeCardapio.mockImplementation(
      (_, tipoSolicitacao) => {
        if (tipoSolicitacao === TIPO_SOLICITACAO.SOLICITACAO_NORMAL) {
          return Promise.resolve({
            results: pedidosCustomizados,
            status: 200,
          });
        }
        return Promise.resolve({ results: [], status: 200 });
      },
    );

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem(
      "tipo_perfil",
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
    );

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Container
            filtros={{ lotes: undefined, diretoria_regional: undefined }}
          />
        </MemoryRouter>,
      );
    });
  });

  const awaitServices = async () => {
    await waitFor(() => {
      expect(getDiretoriaregionalSimplissima).toHaveBeenCalled();
      expect(getLotesSimples).toHaveBeenCalled();
    });
  };

  it("renderiza a tabela com variações de data e motivo CEMEI", async () => {
    await awaitServices();

    expect(screen.getByText("P001")).toBeInTheDocument();
    expect(screen.getByText("P002")).toBeInTheDocument();
    expect(screen.getByText("P003")).toBeInTheDocument();
    expect(screen.getByText("P004")).toBeInTheDocument();
    expect(screen.getByText("P005")).toBeInTheDocument();

    expect(screen.getByText("20/02/2025")).toBeInTheDocument();
    expect(screen.getByText("21/02/2025")).toBeInTheDocument();
    expect(screen.getByText("22/02/2025")).toBeInTheDocument();
    expect(screen.getByText("23/02/2025")).toBeInTheDocument();
    expect(screen.getByText("24/02/2025")).toBeInTheDocument();
  });

  it("filtra pedidos pela busca", async () => {
    await awaitServices();

    const cardRegular = screen.getByTestId("regular");
    const inputPesquisa = within(cardRegular).getByPlaceholderText("Pesquisar");
    fireEvent.change(inputPesquisa, { target: { value: "TESTE DOIS" } });

    expect(within(cardRegular).getByText("P002")).toBeInTheDocument();
    expect(within(cardRegular).queryByText("P001")).not.toBeInTheDocument();
  });

  it("expande e recolhe o card", async () => {
    await awaitServices();

    const botaoExpandir = screen.getByLabelText("Expandir");
    fireEvent.click(botaoExpandir);

    expect(screen.getByLabelText("Recolher")).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Recolher"));
    expect(screen.getByLabelText("Expandir")).toBeInTheDocument();
  });
});

describe("CardPendenteAcao - um único pedido", () => {
  beforeEach(async () => {
    getDiretoriaregionalSimplissima.mockResolvedValue({
      data: mockDiretoriaRegionalSimplissima,
      status: 200,
    });
    getLotesSimples.mockResolvedValue({
      data: mockLotesSimples,
      status: 200,
    });

    codaeListarSolicitacoesDeAlteracaoDeCardapio.mockImplementation(
      (_, tipoSolicitacao) => {
        if (tipoSolicitacao === TIPO_SOLICITACAO.SOLICITACAO_NORMAL) {
          return Promise.resolve({
            results: [pedidosCustomizados[0]],
            status: 200,
          });
        }
        return Promise.resolve({ results: [], status: 200 });
      },
    );

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem(
      "tipo_perfil",
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
    );

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Container
            filtros={{ lotes: undefined, diretoria_regional: undefined }}
          />
        </MemoryRouter>,
      );
    });
  });

  it("renderiza a palavra solicitação no singular", async () => {
    await waitFor(() => {
      expect(getDiretoriaregionalSimplissima).toHaveBeenCalled();
      expect(getLotesSimples).toHaveBeenCalled();
    });

    expect(screen.getByText("solicitação")).toBeInTheDocument();
  });
});
