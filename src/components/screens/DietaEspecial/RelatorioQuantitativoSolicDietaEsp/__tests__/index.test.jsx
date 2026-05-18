import "@testing-library/jest-dom";

import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import { MemoryRouter } from "react-router-dom";

import RelatorioQuantitativoSolicDietaEsp from "../index";

import * as dietaEspecialService from "src/services/dietaEspecial.service";
import * as relatoriosService from "src/services/relatorios";

import {
  formFiltrosObtemDreEEscolasNovo,
  getCabecalhoPorFiltros,
  getDadosIniciais,
} from "src/helpers/dietaEspecial";

import { TIPO_PERFIL } from "src/constants/shared";

jest.mock("src/services/dietaEspecial.service", () => ({
  ...jest.requireActual("src/services/dietaEspecial.service"),
  getRelatorioQuantitativoSolicDietaEsp: jest.fn(),
  getClassificacoesDietas: jest.fn(),
}));

jest.mock("src/services/relatorios", () => ({
  imprimeRelatorioQuantitativoSolicDietaEsp: jest.fn(),
}));

jest.mock("src/helpers/dietaEspecial", () => ({
  ...jest.requireActual("src/helpers/dietaEspecial"),
  formFiltrosObtemDreEEscolasNovo: jest.fn(),
  getCabecalhoPorFiltros: jest.fn(() => "Cabeçalho teste"),
  getDadosIniciais: jest.fn(),
  validateFormDreEscola: jest.fn(() => undefined),
}));

jest.mock(
  "src/components/Shareable/FinalForm/MultiSelect",
  () =>
    ({ label, options = [], input }) => {
      const normalizedOptions = options.map((opt) => ({
        value: opt.value ?? opt.uuid,
        label: opt.label ?? opt.nome,
      }));

      return (
        <div>
          <label>{label}</label>

          <select
            data-testid={`multiselect-${label}`}
            value={input?.value?.[0] || ""}
            onChange={(e) => input?.onChange?.([e.target.value])}
          >
            <option value="">Selecione</option>

            {normalizedOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      );
    },
);

jest.mock("src/components/Shareable/DatePicker", () => ({
  InputComData: ({ input, placeholder }) => (
    <input
      placeholder={placeholder}
      value={input?.value || ""}
      onChange={(e) => input?.onChange?.(e.target.value)}
    />
  ),
}));

jest.mock("src/components/Shareable/Select", () => ({
  __esModule: true,
  default: ({ input, options = [], "data-testid": testId }) => (
    <select
      data-testid={testId || "select-status"}
      value={input?.value || ""}
      onChange={(e) => input?.onChange?.(e.target.value)}
    >
      <option value="">Selecione</option>

      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  ),
}));

const mockResponse = {
  data: {
    count: 20,
    results: [
      {
        dre: "IPIRANGA",
        escola: "EMEF TESTE",
        solicitacoes_ativas: 5,
        solicitacoes_pendentes: 2,
        solicitacoes_negadas: 1,
      },
    ],
  },
};

const renderComponent = () => {
  return render(
    <MemoryRouter>
      <RelatorioQuantitativoSolicDietaEsp />
    </MemoryRouter>,
  );
};

const preencherFormulario = async () => {
  fireEvent.change(
    screen.getByTestId("multiselect-Diretoria Regional de Educação"),
    {
      target: {
        value: "dre-1",
      },
    },
  );

  fireEvent.change(screen.getByTestId("multiselect-Unidade Escolar"), {
    target: {
      value: "esc-1",
    },
  });

  fireEvent.change(screen.getByTestId("select-status"), {
    target: {
      value: "ativas",
    },
  });

  fireEvent.change(screen.getByPlaceholderText("De"), {
    target: {
      value: "01/01/2025",
    },
  });

  fireEvent.change(screen.getByPlaceholderText("Até"), {
    target: {
      value: "31/01/2025",
    },
  });
};

describe("RelatorioQuantitativoSolicDietaEsp", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    Object.defineProperty(global, "localStorage", {
      value: {
        getItem: jest.fn((key) => {
          if (key === "tipo_perfil") {
            return TIPO_PERFIL.SUPERVISAO_NUTRICAO;
          }

          return null;
        }),
      },
      writable: true,
    });

    formFiltrosObtemDreEEscolasNovo.mockImplementation(
      async (setEscolas, setDiretorias) => {
        setDiretorias([
          {
            value: "dre-1",
            label: "IPIRANGA",
          },
        ]);

        setEscolas([
          {
            value: "esc-1",
            label: "EMEF TESTE",
            dre: {
              uuid: "dre-1",
            },
          },
        ]);
      },
    );

    getDadosIniciais.mockResolvedValue({});

    dietaEspecialService.getClassificacoesDietas.mockResolvedValue({
      status: 200,
      data: [
        {
          id: 1,
          nome: "Tipo A",
        },
      ],
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("deve renderizar formulário corretamente", async () => {
    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText(/Diretoria Regional de Educação/i),
      ).toBeInTheDocument();
    });

    expect(screen.getByText(/Unidade Escolar/i)).toBeInTheDocument();
    expect(screen.getByText(/Consultar/i)).toBeInTheDocument();
  });

  it("deve consultar relatório e renderizar tabela", async () => {
    dietaEspecialService.getRelatorioQuantitativoSolicDietaEsp.mockResolvedValue(
      mockResponse,
    );

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/Consultar/i)).toBeInTheDocument();
    });

    await preencherFormulario();

    await act(async () => {
      fireEvent.click(screen.getByText(/Consultar/i));
    });

    await waitFor(() => {
      expect(
        dietaEspecialService.getRelatorioQuantitativoSolicDietaEsp,
      ).toHaveBeenCalled();
    });

    expect(getCabecalhoPorFiltros).toHaveBeenCalled();

    expect(screen.getByText("Cabeçalho teste")).toBeInTheDocument();

    const linha = Array.from(
      document.querySelectorAll(".row-quantitativo-nome"),
    ).find((row) => row.textContent.includes("EMEF TESTE"));

    expect(linha).toBeInTheDocument();

    expect(linha).toHaveTextContent("IPIRANGA");
    expect(linha).toHaveTextContent("EMEF TESTE");

    expect(screen.getByText(/Imprimir/i)).toBeInTheDocument();
  });

  it("deve paginar corretamente", async () => {
    dietaEspecialService.getRelatorioQuantitativoSolicDietaEsp.mockResolvedValue(
      mockResponse,
    );

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/Consultar/i)).toBeInTheDocument();
    });

    await preencherFormulario();

    await act(async () => {
      fireEvent.click(screen.getByText(/Consultar/i));
    });

    await waitFor(() => {
      expect(screen.getByText(/Imprimir/i)).toBeInTheDocument();
    });

    const pagina2 = document.querySelector(".ant-pagination-item-2");

    await act(async () => {
      fireEvent.click(pagina2);
    });

    await waitFor(() => {
      expect(
        dietaEspecialService.getRelatorioQuantitativoSolicDietaEsp,
      ).toHaveBeenCalledTimes(2);
    });

    expect(
      dietaEspecialService.getRelatorioQuantitativoSolicDietaEsp.mock
        .calls[1][1],
    ).toBe(2);
  });

  it("deve imprimir relatório", async () => {
    dietaEspecialService.getRelatorioQuantitativoSolicDietaEsp.mockResolvedValue(
      mockResponse,
    );

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/Consultar/i)).toBeInTheDocument();
    });

    await preencherFormulario();

    await act(async () => {
      fireEvent.click(screen.getByText(/Consultar/i));
    });

    await waitFor(() => {
      expect(screen.getByText(/Imprimir/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Imprimir/i));

    expect(
      relatoriosService.imprimeRelatorioQuantitativoSolicDietaEsp,
    ).toHaveBeenCalled();
  });

  it("deve exibir mensagem sem resultados", async () => {
    dietaEspecialService.getRelatorioQuantitativoSolicDietaEsp.mockResolvedValue(
      {
        data: {
          count: 0,
          results: [],
        },
      },
    );

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/Consultar/i)).toBeInTheDocument();
    });

    await preencherFormulario();

    await act(async () => {
      fireEvent.click(screen.getByText(/Consultar/i));
    });

    await waitFor(() => {
      expect(
        screen.getByText(
          /Não foi encontrado dieta especial para filtragem realizada/i,
        ),
      ).toBeInTheDocument();
    });
  });
});
