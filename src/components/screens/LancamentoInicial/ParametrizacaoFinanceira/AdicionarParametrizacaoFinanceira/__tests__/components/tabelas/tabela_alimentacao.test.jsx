import {
  act,
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { Form } from "react-final-form";
import { mockGetVinculosTipoAlimentacaoPorEscola } from "src/mocks/cadastroTipoAlimentacao.service/mockGetVinculosTipoAlimentacaoPorEscola";
import TabelaAlimentacao from "../../../components/Tabelas/TabelaAlimentacao";

describe("Testes de Tabela Alimentacao - Parametrização Financeira", () => {
  const tiposAlimentacao = mockGetVinculosTipoAlimentacaoPorEscola.results.find(
    (e) => e.tipo_unidade_escolar.iniciais === "EMEI",
  ).tipos_alimentacao;

  const setup = async () => {
    await act(async () => {
      render(
        <Form
          onSubmit={jest.fn()}
          render={({ form }) => (
            <TabelaAlimentacao
              form={form}
              tiposAlimentacao={tiposAlimentacao}
              grupoSelecionado="Grupo 3"
              pendencias={[
                "Preço das Dietas Tipo A e Tipo A Enteral/Restrição de Aminoácidos",
                "Dietas Tipo B",
              ]}
            />
          )}
        />,
      );
    });
  };

  it("verifica se tabela foi renderizada corretamente", async () => {
    await setup();
    expect(screen.getByText("Preço das Alimentações")).toBeInTheDocument();
    tiposAlimentacao.forEach((tipo) => {
      expect(screen.getByText(tipo.nome)).toBeInTheDocument();
    });
  });

  const setInput = (testId, value) => {
    const input = screen.getByTestId(testId);
    fireEvent.change(input, { target: { value } });
    return input;
  };

  it("altera campos de Lanche, verifica se valores foram alterados e total calculado", async () => {
    await setup();

    const valorUnitario = setInput(
      "tabelas[Preço das Alimentações].Lanche.valor_unitario",
      "5,00",
    );
    const valorReajuste = setInput(
      "tabelas[Preço das Alimentações].Lanche.valor_unitario_reajuste",
      "5,00",
    );
    const valorTotal = screen.getByTestId(
      "tabelas[Preço das Alimentações].Lanche.valor_unitario_total",
    );

    await waitFor(() => {
      expect(valorUnitario.value).toBe("5,00");
      expect(valorReajuste.value).toBe("5,00");
      expect(valorTotal.value).toBe("10,00");
    });
  });

  it("exibe a tag da turma, o grupo do alimento e bloqueia a edição", async () => {
    await act(async () => {
      render(
        <Form
          onSubmit={jest.fn()}
          initialValues={{
            tabelas: {
              "Dietas Tipo A": {
                "Lanche - Extra": { percentual_acrescimo: "10" },
              },
            },
          }}
          render={({ form }) => (
            <TabelaAlimentacao
              form={form}
              tiposAlimentacao={[
                { uuid: "l", nome: "Lanche", grupo: "Extra" },
                { uuid: "r", nome: "Refeição" },
              ]}
              grupoSelecionado="Grupo 2"
              tipoTurma="Turma Infantil - EMEI"
              temaTag="turma-emei"
              pendencias={["Dietas Tipo A"]}
              bloqueiaEdicao
            />
          )}
        />,
      );
    });

    expect(screen.getByText("Turma Infantil - EMEI")).toBeInTheDocument();
    expect(screen.getByText("Lanche - Extra")).toBeInTheDocument();
    expect(
      screen.getByTestId(
        "tabelas[Preço das Alimentações - Turma Infantil - EMEI].Lanche.valor_unitario",
      ),
    ).toBeDisabled();

    fireEvent.change(
      screen.getByTestId(
        "tabelas[Preço das Alimentações - Turma Infantil - EMEI].Refeição.valor_unitario",
      ),
      { target: { value: null } },
    );
    fireEvent.change(
      screen.getByTestId(
        "tabelas[Preço das Alimentações - Turma Infantil - EMEI].Lanche.valor_unitario",
      ),
      { target: { value: "2,00" } },
    );

    await waitFor(() => {
      expect(
        screen.getByTestId(
          "tabelas[Preço das Alimentações - Turma Infantil - EMEI].Lanche.valor_unitario_total",
        ).value,
      ).toBe("2,00");
    });
  });

  it("recalcula pendências do grupo 4 com e sem percentual informado", async () => {
    const refeicao = "Refeição - CEU EMEF, CEU GESTÃO, EMEF, EMEFM";
    await act(async () => {
      render(
        <Form
          onSubmit={jest.fn()}
          initialValues={{
            tabelas: {
              "Dietas Tipo A": {
                "Refeição - Dieta Enteral - CEU EMEF, CEU GESTÃO, EMEF, EMEFM":
                  {
                    percentual_acrescimo: "10",
                  },
              },
            },
          }}
          render={({ form }) => (
            <TabelaAlimentacao
              form={form}
              tiposAlimentacao={[
                { uuid: "r", nome: refeicao },
                { uuid: "l", nome: "Lanche" },
              ]}
              grupoSelecionado="Grupo 4"
              pendencias={["Dietas Tipo A"]}
            />
          )}
        />,
      );
    });

    fireEvent.change(
      screen.getByTestId(
        `tabelas[Preço das Alimentações].${refeicao}.valor_unitario`,
      ),
      { target: { value: "10,00" } },
    );
    fireEvent.change(
      screen.getByTestId(
        "tabelas[Preço das Alimentações].Lanche.valor_unitario",
      ),
      { target: { value: "0" } },
    );
    const reajuste = screen.getByTestId(
      `tabelas[Preço das Alimentações].${refeicao}.valor_unitario_reajuste`,
    );
    const propsKey = Object.keys(reajuste).find((key) =>
      key.startsWith("__reactProps"),
    );
    reajuste[propsKey].onChange({ target: { value: undefined } });

    await waitFor(() => {
      expect(
        screen.getByTestId(
          `tabelas[Preço das Alimentações].${refeicao}.valor_unitario`,
        ).value,
      ).toBe("10,00");
    });
  });
});
