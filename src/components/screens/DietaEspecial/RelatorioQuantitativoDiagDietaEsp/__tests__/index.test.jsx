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

import RelatorioQuantitativoDiagDietaEsp from "../index";

import * as dietaEspecialService from "src/services/dietaEspecial.service";
import * as perfilService from "src/services/perfil.service";
import * as relatoriosService from "src/services/relatorios";

import {
  formFiltrosObtemDreEEscolasNovo,
  getDadosIniciais,
} from "src/helpers/dietaEspecial";

import { TIPO_PERFIL } from "src/constants/shared";

jest.mock("src/services/dietaEspecial.service", () => ({
  ...jest.requireActual("src/services/dietaEspecial.service"),
  getRelatorioQuantitativoDiagDietaEsp: jest.fn(),
  getAlergiasIntolerancias: jest.fn(),
}));

jest.mock("src/services/perfil.service", () => ({
  meusDados: jest.fn(),
}));

jest.mock("src/services/relatorios", () => ({
  imprimeRelatorioQuantitativoDiagDietaEsp: jest.fn(),
}));

jest.mock("src/helpers/dietaEspecial", () => ({
  ...jest.requireActual("src/helpers/dietaEspecial"),
  formFiltrosObtemDreEEscolasNovo: jest.fn(),
  getDadosIniciais: jest.fn(),
  validateFormDreEscola: jest.fn(() => undefined),
  getCabecalhoPorFiltros: jest.fn(() => "Cabeçalho teste"),
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

const mockDietaResponse = {
  data: {
    count: 20,
    results: [
      {
        dre: "IPIRANGA",
        escola: "EMEF TESTE",
        diagnostico: "Diabetes",
        ano_nasc_aluno: "2015",
        qtde_pendentes: 1,
        qtde_ativas: 2,
        qtde_inativas: 3,
      },
    ],
  },
};

const renderComponent = () => {
  return render(
    <MemoryRouter>
      <RelatorioQuantitativoDiagDietaEsp />
    </MemoryRouter>,
  );
};

const preencherFormulario = async () => {
  fireEvent.change(
    screen.getByTestId("multiselect-Diretoria Regional de Educação"),
    {
      target: { value: "dre-1" },
    },
  );

  fireEvent.change(screen.getByTestId("multiselect-Unidade Escolar"), {
    target: { value: "esc-1" },
  });

  fireEvent.change(screen.getByTestId("multiselect-Diagnóstico"), {
    target: { value: "1" },
  });

  fireEvent.change(screen.getByTestId("select-status"), {
    target: { value: "ativas" },
  });

  fireEvent.change(screen.getByPlaceholderText("De"), {
    target: { value: "01/01/2025" },
  });

  fireEvent.change(screen.getByPlaceholderText("Até"), {
    target: { value: "31/01/2025" },
  });
};

describe("RelatorioQuantitativoDiagDietaEsp", () => {
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

    perfilService.meusDados.mockResolvedValue({
      nome: "Usuário teste",
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

    getDadosIniciais.mockResolvedValue({
      status: "ativas",
    });

    dietaEspecialService.getAlergiasIntolerancias.mockResolvedValue({
      status: 200,
      data: [
        {
          id: 1,
          descricao: "Diabetes",
        },
      ],
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("deve renderizar formulário e finalizar loading inicial", async () => {
    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText(/Diretoria Regional de Educação/i),
      ).toBeInTheDocument();
    });

    expect(screen.getByText(/Consultar/i)).toBeInTheDocument();
    expect(screen.getByText(/Limpar filtros/i)).toBeInTheDocument();
  });

  it("deve consultar relatório e renderizar tabela completa", async () => {
    dietaEspecialService.getRelatorioQuantitativoDiagDietaEsp.mockResolvedValue(
      mockDietaResponse,
    );

    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByTestId("multiselect-Diretoria Regional de Educação"),
      ).toBeInTheDocument();
    });

    await preencherFormulario();

    await act(async () => {
      fireEvent.click(screen.getByText(/Consultar/i));
    });

    await waitFor(() => {
      expect(
        dietaEspecialService.getRelatorioQuantitativoDiagDietaEsp,
      ).toHaveBeenCalled();
    });

    expect(screen.getByText("Cabeçalho teste")).toBeInTheDocument();

    const linhas = document.querySelectorAll(".row-quantitativo-nome");
    const linha = Array.from(linhas).find((row) =>
      row.textContent.includes("Diabetes"),
    );

    expect(linha).toBeInTheDocument();
    expect(linha).toHaveTextContent("2015");
    expect(linha).toHaveTextContent("2");

    expect(screen.getByText(/Imprimir/i)).toBeInTheDocument();
  });

  it("deve paginar corretamente", async () => {
    dietaEspecialService.getRelatorioQuantitativoDiagDietaEsp.mockResolvedValue(
      mockDietaResponse,
    );

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/Consultar/i)).toBeInTheDocument();
    });

    await preencherFormulario();

    await act(async () => {
      fireEvent.click(screen.getByText(/Consultar/i));
    });

    const linhas = document.querySelectorAll(".row-quantitativo-nome");
    const linha = Array.from(linhas).find((row) =>
      row.textContent.includes("Diabetes"),
    );

    expect(linha).toBeInTheDocument();
    expect(linha).toHaveTextContent("2015");
    expect(linha).toHaveTextContent("2");

    const pagina2 = document.querySelector(".ant-pagination-item-2");

    fireEvent.click(pagina2);

    await act(async () => {
      fireEvent.click(pagina2);
    });

    await waitFor(() => {
      expect(
        dietaEspecialService.getRelatorioQuantitativoDiagDietaEsp,
      ).toHaveBeenCalledTimes(2);
    });
  });

  it("deve imprimir relatório", async () => {
    dietaEspecialService.getRelatorioQuantitativoDiagDietaEsp.mockResolvedValue(
      mockDietaResponse,
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
      relatoriosService.imprimeRelatorioQuantitativoDiagDietaEsp,
    ).toHaveBeenCalled();
  });

  it("deve exibir mensagem sem resultados", async () => {
    dietaEspecialService.getRelatorioQuantitativoDiagDietaEsp.mockResolvedValue(
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

  it("deve renderizar tabela no modo somente dietas ativas", async () => {
    dietaEspecialService.getRelatorioQuantitativoDiagDietaEsp.mockResolvedValue(
      {
        data: {
          count: 1,
          results: [
            {
              diagnostico: "Alergia",
              qtde_ativas: 9,
            },
          ],
        },
      },
    );

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/Consultar/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Visualizar somente diagnóstico ativo/i));

    await act(async () => {
      fireEvent.click(screen.getByText(/Consultar/i));
    });

    await waitFor(() => {
      expect(screen.getByText("Alergia")).toBeInTheDocument();
    });

    expect(screen.getByText("9")).toBeInTheDocument();
  });
});
