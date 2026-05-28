import "@testing-library/jest-dom";
import { act, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import mock from "src/services/_mock";

import { ControleDeFrequenciaPage } from "src/pages/LancamentoMedicaoInicial/ControleDeFrequenciaPage";

import {
  getMesesAnos,
  getFiltros,
  getTotalAlunosMatriculados,
  imprimirRelatorioControleFrequencia,
} from "src/services/medicaoInicial/controleDeFrequencia.service";

jest.mock("src/services/medicaoInicial/controleDeFrequencia.service", () => ({
  getMesesAnos: jest.fn(),
  getFiltros: jest.fn(),
  getTotalAlunosMatriculados: jest.fn(),
  imprimirRelatorioControleFrequencia: jest.fn(),
}));

describe("Teste ControleDeFrequencia", () => {
  const mockMesesAnos = {
    data: {
      results: [
        {
          mes: 4,
          ano: 2026,
        },
        {
          mes: 5,
          ano: 2026,
        },
        {
          mes: 6,
          ano: 2026,
        },
      ],
    },
  };

  const mockFiltros = {
    data: {
      periodos: [
        {
          uuid: "e17e2405-36be-4981-a09c-35c89ae0f8b7",
          nome: "INTEGRAL",
        },
        {
          uuid: "1a0dcc92-d1ea-4a91-bafd-8879f9463fe8",
          nome: "TARDE",
        },
      ],
      data_inicial: "2026-04-01",
      data_final: "2026-04-30",
    },
  };
  const mockTotalMatriculados = {
    data: {
      total_matriculados: 150,
      periodos: {
        INTEGRAL: 100,
        TARDE: 50,
      },
    },
  };

  const setupMocks = () => {
    getMesesAnos.mockResolvedValue(mockMesesAnos);

    getFiltros.mockResolvedValue(mockFiltros);

    getTotalAlunosMatriculados.mockResolvedValue(mockTotalMatriculados);

    imprimirRelatorioControleFrequencia.mockResolvedValue({
      status: 200,
    });
  };

  const renderComponent = async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <ToastContainer />
          <ControleDeFrequenciaPage />
        </MemoryRouter>,
      );
    });

    await waitFor(() => {
      expect(screen.queryByText(/carregando/i)).not.toBeInTheDocument();
    });
  };

  beforeEach(() => {
    process.env.IS_TEST = true;
  });

  afterEach(() => {
    mock.reset();
    jest.clearAllMocks();
  });

  describe("Carregamento inicial", () => {
    it("Deve carregar os meses e anos corretamente", async () => {
      setupMocks();

      await renderComponent();

      await waitFor(() => {
        expect(getMesesAnos).toHaveBeenCalled();
      });
    });

    it("Deve exibir erro ao carregar meses de referência", async () => {
      getMesesAnos.mockRejectedValue(new Error("Erro"));

      await renderComponent();

      expect(
        screen.getByText(/Erro ao carregar meses de referência/i),
      ).toBeInTheDocument();
    });
  });
});
