import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
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

import { toastError } from "src/components/Shareable/Toast/dialogs";

jest.mock("src/services/medicaoInicial/controleDeFrequencia.service", () => ({
  getMesesAnos: jest.fn(),
  getFiltros: jest.fn(),
  getTotalAlunosMatriculados: jest.fn(),
  imprimirRelatorioControleFrequencia: jest.fn(),
}));

jest.mock(
  "src/components/Shareable/ModalSolicitacaoDownload",
  () => (props) =>
    props.show ? (
      <div data-testid="modal-download">
        <button onClick={() => props.setShow(false)}>Fechar</button>
      </div>
    ) : null,
);

jest.mock("src/components/Shareable/Toast/dialogs", () => ({
  toastError: jest.fn(),
}));

const preencherFiltros = async ({
  preencherDataInicial = true,
  preencherDataFinal = true,
  mesmaData = false,
  selecionarPeriodo = true,
  clicarFiltrar = true,
} = {}) => {
  const selects = screen.getAllByRole("combobox");

  fireEvent.mouseDown(selects[0]);

  const optionMes = await screen.findByText(/abril 2026/i);

  fireEvent.click(optionMes);

  await waitFor(() => {
    expect(getFiltros).toHaveBeenCalled();
  });

  if (selecionarPeriodo) {
    const dropdownHeading = document.querySelector(
      ".multi-select .dropdown-heading",
    );

    fireEvent.click(dropdownHeading);

    const optionPeriodo = await screen.findByText(/INTEGRAL/i);

    fireEvent.click(optionPeriodo);

    fireEvent.mouseDown(document.body);

    fireEvent.click(document.body);
  }

  const campoDataInicial = screen.getByPlaceholderText("De");

  const campoDataFinal = screen.getByPlaceholderText("Até");

  if (preencherDataInicial) {
    fireEvent.change(campoDataInicial, {
      target: {
        value: "01/04/2026",
      },
    });
  }

  if (preencherDataFinal) {
    fireEvent.change(campoDataFinal, {
      target: {
        value: mesmaData ? "01/04/2026" : "30/04/2026",
      },
    });
  }

  if (clicarFiltrar) {
    fireEvent.click(
      screen.getByRole("button", {
        name: /filtrar/i,
      }),
    );
  }
};

function getDataComZero() {
  const hoje = new Date();
  const dia = String(hoje.getDate()).padStart(2, "0");
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const ano = hoje.getFullYear();

  return `${dia}/${mes}/${ano}`;
}

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

  describe("Filtros", () => {
    it("Deve buscar filtros ao selecionar mês/ano", async () => {
      setupMocks();

      await renderComponent();

      const selects = screen.getAllByRole("combobox");

      fireEvent.mouseDown(selects[0]);

      const option = await screen.findByText(/abril/i);

      fireEvent.click(option);

      await waitFor(() => {
        expect(getFiltros).toHaveBeenCalled();
      });
    });

    it("Deve buscar total de matriculados ao filtrar", async () => {
      setupMocks();

      await renderComponent();

      await preencherFiltros();

      await waitFor(() => {
        expect(getTotalAlunosMatriculados).toHaveBeenCalled();
      });
    });

    it("Deve exibir mensagem quando não houver resultados", async () => {
      setupMocks();

      getTotalAlunosMatriculados.mockResolvedValue({
        data: {
          total_matriculados: 0,
          periodos: {},
        },
      });
      await renderComponent();
      await preencherFiltros();

      await waitFor(() => {
        expect(getTotalAlunosMatriculados).toHaveBeenCalled();
      });

      const resultado = screen.getByTestId("resultado-controle-frequencia");
      expect(resultado).toHaveTextContent("Nenhum resultado encontrado");
    });

    it("Deve considerar todos os períodos quando nenhum for selecionado", async () => {
      setupMocks();

      await renderComponent();
      await preencherFiltros({
        selecionarPeriodo: false,
      });

      await waitFor(() => {
        expect(getTotalAlunosMatriculados).toHaveBeenCalled();
      });

      const resultado = screen.getByTestId("resultado-controle-frequencia");

      expect(resultado).toHaveTextContent(
        "TOTAL DE MATRICULADOS NA UNIDADE ENTRE 01/04/2026 E 30/04/2026",
      );
      expect(resultado).toHaveTextContent("150");

      expect(resultado).toHaveTextContent("MATRICULADOS PERÍODO INTEGRAL");
      expect(resultado).toHaveTextContent("100");

      expect(resultado).toHaveTextContent("MATRICULADOS PERÍODO TARDE");
      expect(resultado).toHaveTextContent("50");
    });

    it("Deve repetir data inicial quando data final não for preenchida", async () => {
      setupMocks();
      await renderComponent();

      await preencherFiltros({
        preencherDataFinal: false,
      });

      await waitFor(() => {
        expect(getTotalAlunosMatriculados).toHaveBeenCalledWith(
          expect.objectContaining({
            data_final: "2026-04-01",
          }),
        );
      });

      const resultado = screen.getByTestId("resultado-controle-frequencia");

      expect(resultado).toHaveTextContent(
        "TOTAL DE MATRICULADOS NA UNIDADE EM 01/04/2026",
      );
      expect(resultado).toHaveTextContent("150");

      expect(resultado).toHaveTextContent("MATRICULADOS PERÍODO INTEGRAL");
      expect(resultado).toHaveTextContent("100");

      expect(resultado).toHaveTextContent("MATRICULADOS PERÍODO TARDE");
      expect(resultado).toHaveTextContent("50");
    });

    it("Deve repetir data final quando data inicial não for preenchida", async () => {
      setupMocks();
      await renderComponent();

      await preencherFiltros({
        preencherDataInicial: false,
      });

      await waitFor(() => {
        expect(getTotalAlunosMatriculados).toHaveBeenCalled();
      });

      const resultado = screen.getByTestId("resultado-controle-frequencia");

      expect(resultado).toHaveTextContent(
        "TOTAL DE MATRICULADOS NA UNIDADE EM 30/04/2026",
      );
      expect(resultado).toHaveTextContent("150");

      expect(resultado).toHaveTextContent("MATRICULADOS PERÍODO INTEGRAL");
      expect(resultado).toHaveTextContent("100");

      expect(resultado).toHaveTextContent("MATRICULADOS PERÍODO TARDE");
      expect(resultado).toHaveTextContent("50");
    });

    it("Deve exibir erro ao carregar períodos", async () => {
      setupMocks();

      getFiltros.mockRejectedValue(new Error("Erro"));

      await renderComponent();

      const selects = screen.getAllByRole("combobox");

      fireEvent.mouseDown(selects[0]);

      const optionMes = await screen.findByText(/abril 2026/i);

      fireEvent.click(optionMes);

      await waitFor(() => {
        expect(
          screen.getByText(
            /Erro ao carregar períodos. Tente novamente mais tarde./i,
          ),
        ).toBeInTheDocument();
      });
    });

    it("Deve exibir erro ao buscar alunos matriculados", async () => {
      setupMocks();

      getTotalAlunosMatriculados.mockRejectedValue(new Error("Erro"));
      await renderComponent();

      await preencherFiltros();

      await waitFor(() => {
        expect(
          screen.getByText(
            /Erro ao carregar os dados dos alunos matriculados. Tente novamente mais tarde./i,
          ),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Impressão relatório", () => {
    it("Deve imprimir relatório com sucesso", async () => {
      setupMocks();

      await renderComponent();
      preencherFiltros({ selecionarPeriodo: true });

      await waitFor(() => {
        expect(getTotalAlunosMatriculados).toHaveBeenCalled();
      });

      const resultado = screen.getByTestId("resultado-controle-frequencia");

      const btnImprimir = within(resultado).getByRole("button", {
        name: /imprimir/i,
      });

      expect(btnImprimir).toBeInTheDocument();

      fireEvent.click(btnImprimir);

      await waitFor(() => {
        expect(imprimirRelatorioControleFrequencia).toHaveBeenCalled();
      });

      expect(screen.getByTestId("modal-download")).toBeInTheDocument();
    });

    it("Deve imprimir usando data final quando data inicial não existir", async () => {
      setupMocks();

      await renderComponent();

      await preencherFiltros({
        preencherDataInicial: false,
      });

      await waitFor(() => {
        expect(getTotalAlunosMatriculados).toHaveBeenCalled();
      });

      const resultado = screen.getByTestId("resultado-controle-frequencia");

      const btnImprimir = within(resultado).getByRole("button", {
        name: /imprimir/i,
      });

      expect(btnImprimir).toBeInTheDocument();

      fireEvent.click(btnImprimir);

      await waitFor(() => {
        expect(imprimirRelatorioControleFrequencia).toHaveBeenCalledWith(
          expect.objectContaining({
            data_inicial: "2026-04-30",
          }),
        );
      });
      expect(screen.getByTestId("modal-download")).toBeInTheDocument();
    });

    it("Deve imprimir usando data inicial quando data final não existir", async () => {
      setupMocks();

      await renderComponent();

      await preencherFiltros({
        preencherDataFinal: false,
      });

      await waitFor(() => {
        expect(getTotalAlunosMatriculados).toHaveBeenCalled();
      });

      const resultado = screen.getByTestId("resultado-controle-frequencia");

      const btnImprimir = within(resultado).getByRole("button", {
        name: /imprimir/i,
      });

      expect(btnImprimir).toBeInTheDocument();

      fireEvent.click(btnImprimir);

      await waitFor(() => {
        expect(imprimirRelatorioControleFrequencia).toHaveBeenCalledWith(
          expect.objectContaining({
            data_final: "2026-04-01",
          }),
        );
      });
      expect(screen.getByTestId("modal-download")).toBeInTheDocument();
    });

    it("Deve exibir erro ao falhar impressão relatório", async () => {
      setupMocks();

      imprimirRelatorioControleFrequencia.mockRejectedValue(
        new Error("Erro ao imprimir"),
      );

      await renderComponent();
      preencherFiltros({ selecionarPeriodo: true });

      await waitFor(() => {
        expect(getTotalAlunosMatriculados).toHaveBeenCalled();
      });

      const resultado = screen.getByTestId("resultado-controle-frequencia");

      const btnImprimir = within(resultado).getByRole("button", {
        name: /imprimir/i,
      });

      expect(btnImprimir).toBeInTheDocument();

      fireEvent.click(btnImprimir);
      await waitFor(() => {
        expect(imprimirRelatorioControleFrequencia).toHaveBeenCalled();

        expect(toastError).toHaveBeenCalledWith(
          "Erro ao imprimir pdf. Tente novamente mais tarde.",
        );
      });
    });

    it("Deve desabilitar botão imprimir durante request", async () => {
      setupMocks();

      let resolvePromise;

      imprimirRelatorioControleFrequencia.mockImplementation(
        () =>
          new Promise((resolve) => {
            resolvePromise = resolve;
          }),
      );

      await renderComponent();

      await preencherFiltros();

      await waitFor(() => {
        expect(getTotalAlunosMatriculados).toHaveBeenCalled();
      });

      const resultado = screen.getByTestId("resultado-controle-frequencia");

      const btnImprimir = within(resultado).getByRole("button", {
        name: /imprimir/i,
      });

      expect(btnImprimir).toBeInTheDocument();

      fireEvent.click(btnImprimir);

      await waitFor(() => {
        expect(btnImprimir).toBeDisabled();
      });

      resolvePromise({});

      await waitFor(() => {
        expect(btnImprimir).not.toBeDisabled();
      });
    });

    it("Deve fechar modal corretamente", async () => {
      setupMocks();

      await renderComponent();

      await preencherFiltros();

      await waitFor(() => {
        expect(getTotalAlunosMatriculados).toHaveBeenCalled();
      });

      const resultado = screen.getByTestId("resultado-controle-frequencia");

      const btnImprimir = within(resultado).getByRole("button", {
        name: /imprimir/i,
      });

      expect(btnImprimir).toBeInTheDocument();

      fireEvent.click(btnImprimir);

      const modal = await screen.findByTestId("modal-download");

      expect(modal).toBeInTheDocument();

      const btnFechar = within(modal).getByRole("button", {
        name: /fechar/i,
      });

      fireEvent.click(btnFechar);

      await waitFor(() => {
        expect(screen.queryByTestId("modal-download")).not.toBeInTheDocument();
      });
    });
  });

  describe("Estados de tela", () => {
    it("Deve renderizar total por período", async () => {
      setupMocks();

      await renderComponent();
      preencherFiltros();
      await waitFor(() => {
        expect(getTotalAlunosMatriculados).toHaveBeenCalled();
      });

      const resultado = screen.getByTestId("resultado-controle-frequencia");

      expect(resultado).toHaveTextContent(
        "TOTAL DE MATRICULADOS NA UNIDADE ENTRE 01/04/2026 E 30/04/2026",
      );
      expect(resultado).toHaveTextContent("150");

      expect(resultado).toHaveTextContent("MATRICULADOS PERÍODO INTEGRAL");
      expect(resultado).toHaveTextContent("100");

      expect(resultado).toHaveTextContent("MATRICULADOS PERÍODO TARDE");
      expect(resultado).toHaveTextContent("50");

      expect(resultado).toHaveTextContent("Mês: ABRIL/2026");

      expect(
        within(resultado).getByRole("button", {
          name: /imprimir/i,
        }),
      ).toBeInTheDocument();
    });

    it("Deve renderizar título com mesma data", async () => {
      setupMocks();
      await renderComponent();

      await preencherFiltros({
        mesmaData: true,
      });

      fireEvent.click(
        screen.getByRole("button", {
          name: /filtrar/i,
        }),
      );

      await waitFor(() => {
        expect(
          screen.getByTestId("resultado-controle-frequencia"),
        ).toHaveTextContent("EM 01/04/2026");
      });
    });

    it("Deve limpar os filtros corretamente", async () => {
      setupMocks();

      await renderComponent();

      await preencherFiltros();

      await waitFor(() => {
        expect(getTotalAlunosMatriculados).toHaveBeenCalled();
      });

      const resultado = screen.getByTestId("resultado-controle-frequencia");

      expect(resultado).toHaveTextContent("INTEGRAL");

      const btnLimpar = screen.getByRole("button", {
        name: /limpar filtros/i,
      });

      fireEvent.click(btnLimpar);

      await waitFor(() => {
        expect(resultado).not.toHaveTextContent("INTEGRAL");
      });

      expect(resultado).not.toHaveTextContent("100");

      expect(
        screen.queryByRole("button", {
          name: /imprimir/i,
        }),
      ).not.toBeInTheDocument();
    });

    it("Deve renderizar título com data atual quando não houver datas", async () => {
      setupMocks();

      getTotalAlunosMatriculados.mockResolvedValue({
        data: {
          total_matriculados: 100,
          periodos: {
            INTEGRAL: 100,
          },
        },
      });

      await renderComponent();

      const selects = screen.getAllByRole("combobox");

      fireEvent.mouseDown(selects[0]);

      const optionMes = await screen.findByText(/abril 2026/i);

      fireEvent.click(optionMes);

      await waitFor(() => {
        expect(getFiltros).toHaveBeenCalled();
      });

      const btnFiltrar = screen.getByRole("button", {
        name: /filtrar/i,
      });

      fireEvent.click(btnFiltrar);

      const data = getDataComZero();
      await waitFor(() => {
        expect(
          screen.getByTestId("resultado-controle-frequencia"),
        ).toHaveTextContent(`EM ${data}`);
      });
    });

    it("Não deve renderizar mensagem sem resultados quando não houver mês selecionado", async () => {
      setupMocks();

      getTotalAlunosMatriculados.mockResolvedValue({
        data: {
          total_matriculados: 0,
          periodos: {},
        },
      });

      await renderComponent();

      expect(
        screen.queryByText(/nenhum resultado encontrado/i),
      ).not.toBeInTheDocument();
    });

    it("Deve remover botão imprimir ao limpar filtros", async () => {
      setupMocks();

      await renderComponent();

      await preencherFiltros();

      await waitFor(() => {
        expect(getTotalAlunosMatriculados).toHaveBeenCalled();
      });

      const resultado = screen.getByTestId("resultado-controle-frequencia");

      const btnImprimir = within(resultado).getByRole("button", {
        name: /imprimir/i,
      });

      expect(btnImprimir).toBeInTheDocument();

      const btnLimpar = screen.getByRole("button", {
        name: /limpar filtros/i,
      });

      fireEvent.click(btnLimpar);

      await waitFor(() => {
        expect(
          screen.queryByRole("button", {
            name: /imprimir/i,
          }),
        ).not.toBeInTheDocument();
      });
    });
  });
});
