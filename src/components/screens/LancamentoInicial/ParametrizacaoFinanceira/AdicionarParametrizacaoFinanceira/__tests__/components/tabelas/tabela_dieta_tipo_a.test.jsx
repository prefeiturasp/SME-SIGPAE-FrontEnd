import {
  act,
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { Form } from "react-final-form";
import { mockGetVinculosTipoAlimentacaoPorEscola } from "src/mocks/cadastroTipoAlimentacao.service/mockGetVinculosTipoAlimentacaoPorEscola";
import TabelaDietaTipoA from "../../../components/Tabelas/TabelaDietaTipoA";

describe("Testes de Tabela Dietas Tipo A - Parametrização Financeira", () => {
  const tiposAlimentacao = mockGetVinculosTipoAlimentacaoPorEscola.results.find(
    (e) =>
      e.tipo_unidade_escolar.iniciais === "EMEI" &&
      e.periodo_escolar.nome === "MANHA",
  ).tipos_alimentacao;

  const setup = async ({ grupo, tipoTurma = null }) => {
    await act(async () => {
      render(
        <Form
          onSubmit={jest.fn()}
          render={({ form }) => (
            <TabelaDietaTipoA
              form={form}
              tiposAlimentacao={tiposAlimentacao}
              grupoSelecionado={grupo}
              tipoTurma={tipoTurma}
            />
          )}
        />,
      );
    });
  };

  it("verifica se tabela foi renderizada corretamente", async () => {
    await setup({ grupo: "Grupo 3" });
    expect(
      screen.getByText(
        "Preço das Dietas Tipo A e Tipo A Enteral/Restrição de Aminoácidos",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Lanche")).toBeInTheDocument();
    expect(screen.getByText("Lanche 4h")).toBeInTheDocument();
    expect(screen.getByText("Refeição - Dieta Enteral")).toBeInTheDocument();
  });

  const setInput = (testId, value) => {
    const input = screen.getByTestId(testId);
    fireEvent.change(input, { target: { value } });
    return input;
  };

  it("altera campos de Lanche 4h, verifica se valores foram alterados e total calculado", async () => {
    await setup({ grupo: "Grupo 3" });

    const valorUnitario = setInput(
      "tabelas[Dietas Tipo A e Tipo A Enteral/Restrição de Aminoácidos].Lanche 4h.valor_unitario",
      "5,00",
    );
    const valorReajuste = setInput(
      "tabelas[Dietas Tipo A e Tipo A Enteral/Restrição de Aminoácidos].Lanche 4h.percentual_acrescimo",
      "100,00",
    );
    const valorTotal = screen.getByTestId(
      "tabelas[Dietas Tipo A e Tipo A Enteral/Restrição de Aminoácidos].Lanche 4h.valor_unitario_total",
    );

    await waitFor(() => {
      expect(valorUnitario.value).toBe("5,00");
      expect(valorReajuste.value).toBe("100,00");
      expect(valorTotal.value).toBe("10,00");
    });
  });

  it("verifica comportamento de atualização de percentuais", async () => {
    await setup({ grupo: "Grupo 3" });

    const percentualRefeicao = setInput(
      "tabelas[Dietas Tipo A e Tipo A Enteral/Restrição de Aminoácidos].Refeição.percentual_acrescimo",
      "10,00",
    );

    await waitFor(() => {
      expect(percentualRefeicao.value).toBe("10,00");
      expect(
        screen.getByTestId(
          `tabelas[Dietas Tipo A e Tipo A Enteral/Restrição de Aminoácidos].Lanche.percentual_acrescimo`,
        ).value,
      ).toBe("10,00");
      expect(
        screen.getByTestId(
          `tabelas[Dietas Tipo A e Tipo A Enteral/Restrição de Aminoácidos].Lanche 4h.percentual_acrescimo`,
        ).value,
      ).toBe("10,00");
    });
  });
});
