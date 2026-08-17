import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { Form } from "react-final-form";
import { InformacaoNutricional } from "src/interfaces/produto.interface";
import TabelaNutricional from "src/components/Shareable/TabelaNutricional";
import {
  infoFibra,
  infoSodio,
  mockInformacoesNutricionaisTabela as listaCompleta,
} from "src/mocks/produto.service/mockInformacoesNutricionaisTabela";

const BOTAO_ADICIONAR = "+ Adicionar Outra Informação Nutricional";

const SEM_INFORMACOES: InformacaoNutricional[] = [];

// Referência estável (evita o useEffect resetar as linhas a cada render).
const CARREGADAS_NAO_FIXAS: InformacaoNutricional[] = [infoSodio, infoFibra];

const renderTabela = (props = {}) =>
  render(
    <Form
      onSubmit={jest.fn()}
      render={({ values }) => (
        <TabelaNutricional
          values={values}
          listaCompletaInformacoesNutricionais={listaCompleta}
          informacoesNutricionaisCarregadas={SEM_INFORMACOES}
          {...props}
        />
      )}
    />,
  );

describe("Componente TabelaNutricional - adicionar/remover informações", () => {
  it("renderiza as linhas fixas e o botão de adicionar, sem linhas adicionais", () => {
    renderTabela();

    expect(screen.getByText("VALOR ENERGÉTICO")).toBeInTheDocument();
    expect(screen.getByText("CARBOIDRATOS TOTAIS")).toBeInTheDocument();
    expect(screen.getByText(BOTAO_ADICIONAR)).toBeInTheDocument();

    expect(screen.queryByTitle("Remover")).not.toBeInTheDocument();
  });

  it("adiciona uma nova linha ao clicar em adicionar", () => {
    renderTabela();

    expect(screen.queryByTitle("Remover")).not.toBeInTheDocument();
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText(BOTAO_ADICIONAR));

    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByTitle("Remover")).toBeInTheDocument();
  });

  it("popula os campos de quantidade ao selecionar uma informação na nova linha", () => {
    const { container } = renderTabela();

    fireEvent.click(screen.getByText(BOTAO_ADICIONAR));

    expect(
      container.querySelector('input[data-cy="quantidade_por_100g_u-sodio"]'),
    ).not.toBeInTheDocument();

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "u-sodio" },
    });

    expect(
      container.querySelector('input[data-cy="quantidade_por_100g_u-sodio"]'),
    ).toBeInTheDocument();
    expect(
      container.querySelector('input[data-cy="quantidade_porcao_u-sodio"]'),
    ).toBeInTheDocument();
    expect(
      container.querySelector('input[data-cy="valor_diario_u-sodio"]'),
    ).toBeInTheDocument();
  });

  it("remove a linha adicional ao clicar em Remover", () => {
    const { container } = renderTabela({
      informacoesNutricionaisCarregadas: [infoSodio],
    });

    expect(
      container.querySelector('input[data-cy="quantidade_por_100g_u-sodio"]'),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByTitle("Remover").closest("button"));

    expect(
      container.querySelector('input[data-cy="quantidade_por_100g_u-sodio"]'),
    ).not.toBeInTheDocument();
    expect(screen.queryByTitle("Remover")).not.toBeInTheDocument();
  });
});

describe("Componente TabelaNutricional - inicialização das linhas (useEffect)", () => {
  it("reconstrói as linhas a partir dos valores do formulário, ignorando as carregadas", () => {
    const { container } = render(
      <Form
        onSubmit={jest.fn()}
        initialValues={{
          informacao_adicional_0: "u-sodio",
          informacao_adicional_1: "u-fibra",
        }}
        render={({ values }) => (
          <TabelaNutricional
            values={values}
            listaCompletaInformacoesNutricionais={listaCompleta}
            informacoesNutricionaisCarregadas={SEM_INFORMACOES}
          />
        )}
      />,
    );

    // As linhas vêm dos valores do form, mesmo com "carregadas" vazio.
    expect(
      container.querySelector('input[data-cy="quantidade_por_100g_u-sodio"]'),
    ).toBeInTheDocument();
    expect(
      container.querySelector('input[data-cy="quantidade_por_100g_u-fibra"]'),
    ).toBeInTheDocument();
    expect(screen.getAllByTitle("Remover")).toHaveLength(2);
  });

  it("usa as informações carregadas (só as não-fixas) quando o form não tem valores adicionais", () => {
    const { container } = render(
      <Form
        onSubmit={jest.fn()}
        render={({ values }) => (
          <TabelaNutricional
            values={values}
            listaCompletaInformacoesNutricionais={listaCompleta}
            informacoesNutricionaisCarregadas={CARREGADAS_NAO_FIXAS}
          />
        )}
      />,
    );

    // Form vazio => cai no fallback e monta as linhas a partir das carregadas.
    expect(
      container.querySelector('input[data-cy="quantidade_por_100g_u-sodio"]'),
    ).toBeInTheDocument();
    expect(
      container.querySelector('input[data-cy="quantidade_por_100g_u-fibra"]'),
    ).toBeInTheDocument();
    expect(screen.getAllByTitle("Remover")).toHaveLength(2);
  });
});
