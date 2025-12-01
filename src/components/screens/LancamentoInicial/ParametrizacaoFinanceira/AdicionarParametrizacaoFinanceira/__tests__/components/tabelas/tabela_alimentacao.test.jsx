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
});
