import { render, screen } from "@testing-library/react";
import TabelaQuantidadePorFaixaEtaria from "../../TabelaQuantidadePorFaixaEtaria";
import { Field } from "redux-form";

jest.mock("redux-form", () => ({
  Field: jest.fn(({ name }) => <input data-testid={`field-${name}`} />),
}));

jest.mock("src/components/Shareable/Input/InputText", () => ({
  __esModule: true,
  default: () => <input data-testid="input-text" />,
}));

jest.mock("src/helpers/faixasEtarias", () => ({
  faixaToString: jest.fn((f) => `Faixa ${f.uuid}`),
}));

jest.mock("src/helpers/fieldValidators", () => ({
  maxValue: jest.fn(() => jest.fn()),
  naoPodeSerZero: jest.fn(),
}));

jest.mock("src/helpers/utilities", () => ({
  composeValidators: jest.fn(() => jest.fn()),
}));

const mockFaixas = [
  { faixa_etaria: { uuid: "1" }, count: 10 },
  { faixa_etaria: { uuid: "2" }, count: 5 },
  { faixa_etaria: { uuid: "3" }, count: 7 },
];

describe("TabelaQuantidadePorFaixaEtaria", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza cabeçalho completo quando escondeTotalAlunos = false", () => {
    render(
      <TabelaQuantidadePorFaixaEtaria
        alunosPorFaixaEtaria={mockFaixas}
        escondeTotalAlunos={false}
        totalSelecionados={3}
      />,
    );

    expect(screen.getByText("Faixa Etária")).toBeInTheDocument();
    expect(screen.getByText("Alunos Matriculados")).toBeInTheDocument();
    expect(screen.getByText("Quantidade")).toBeInTheDocument();
  });

  it("não renderiza coluna de alunos quando escondeTotalAlunos = true", () => {
    render(
      <TabelaQuantidadePorFaixaEtaria
        alunosPorFaixaEtaria={mockFaixas}
        escondeTotalAlunos={true}
        totalSelecionados={3}
      />,
    );

    expect(screen.queryByText("Alunos Matriculados")).not.toBeInTheDocument();
  });

  it("renderiza todas as faixas etárias corretamente", () => {
    render(
      <TabelaQuantidadePorFaixaEtaria
        alunosPorFaixaEtaria={mockFaixas}
        escondeTotalAlunos={false}
        totalSelecionados={3}
      />,
    );

    expect(screen.getByText("Faixa 1")).toBeInTheDocument();
    expect(screen.getByText("Faixa 2")).toBeInTheDocument();
    expect(screen.getByText("Faixa 3")).toBeInTheDocument();
  });

  it("renderiza os counts de cada faixa quando escondeTotalAlunos = false", () => {
    render(
      <TabelaQuantidadePorFaixaEtaria
        alunosPorFaixaEtaria={mockFaixas}
        escondeTotalAlunos={false}
        totalSelecionados={3}
      />,
    );

    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
  });

  it("não renderiza counts quando escondeTotalAlunos = true", () => {
    render(
      <TabelaQuantidadePorFaixaEtaria
        alunosPorFaixaEtaria={mockFaixas}
        escondeTotalAlunos={true}
        totalSelecionados={3}
      />,
    );

    expect(screen.queryByText("10")).not.toBeInTheDocument();
    expect(screen.queryByText("5")).not.toBeInTheDocument();
    expect(screen.queryByText("7")).not.toBeInTheDocument();
  });

  it("cria um Field para cada faixa etária com o nome correto", () => {
    render(
      <TabelaQuantidadePorFaixaEtaria
        alunosPorFaixaEtaria={mockFaixas}
        escondeTotalAlunos={false}
        totalSelecionados={3}
      />,
    );

    expect(Field).toHaveBeenCalledTimes(3);

    expect(Field).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "faixas_etarias.1",
      }),
      {},
    );

    expect(Field).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "faixas_etarias.2",
      }),
      {},
    );

    expect(Field).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "faixas_etarias.3",
      }),
      {},
    );
  });

  it("usa corretamente os validators (naoPodeSerZero + maxValue)", () => {
    render(
      <TabelaQuantidadePorFaixaEtaria
        alunosPorFaixaEtaria={mockFaixas}
        escondeTotalAlunos={false}
        totalSelecionados={3}
      />,
    );

    expect(
      require("src/helpers/fieldValidators").maxValue,
    ).toHaveBeenCalledWith(10);
    expect(
      require("src/helpers/fieldValidators").maxValue,
    ).toHaveBeenCalledWith(5);
    expect(
      require("src/helpers/fieldValidators").maxValue,
    ).toHaveBeenCalledWith(7);
  });

  it("calcula corretamente o total de alunos", () => {
    render(
      <TabelaQuantidadePorFaixaEtaria
        alunosPorFaixaEtaria={mockFaixas}
        escondeTotalAlunos={false}
        totalSelecionados={50}
      />,
    );

    // 10 + 5 + 7 = 22
    expect(screen.getByText("22")).toBeInTheDocument();
  });

  it("renderiza o totalSelecionados corretamente", () => {
    render(
      <TabelaQuantidadePorFaixaEtaria
        alunosPorFaixaEtaria={mockFaixas}
        escondeTotalAlunos={false}
        totalSelecionados={99}
      />,
    );

    expect(screen.getByText("99")).toBeInTheDocument();
  });
});
