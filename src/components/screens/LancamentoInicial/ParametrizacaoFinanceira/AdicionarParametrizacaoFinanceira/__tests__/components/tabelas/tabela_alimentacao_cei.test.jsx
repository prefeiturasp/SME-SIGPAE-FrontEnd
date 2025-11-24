import {
  act,
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { Form } from "react-final-form";
import { mockFaixasEtarias } from "src/mocks/faixaEtaria.service/mockGetFaixasEtarias";
import { TabelaAlimentacaoCEI } from "../../../components/Tabelas/TabelaAlimentacaoCEI";

describe("Testes de Tabela Alimentacao - CEI", () => {
  const faixasEtarias = mockFaixasEtarias.results;

  beforeEach(async () => {
    await act(async () => {
      render(
        <Form
          onSubmit={jest.fn()}
          render={({ form }) => (
            <TabelaAlimentacaoCEI
              form={form}
              faixasEtarias={faixasEtarias}
              grupoSelecionado="Grupo 1"
              periodo="Integral"
              pendencias={[
                "Dietas Tipo A e Tipo A Enteral/Restrição de Aminoácidos",
                "Dietas Tipo B",
              ]}
            />
          )}
        />,
      );
    });
  });

  it("verifica se tabela foi renderizada corretamente", () => {
    expect(screen.getByText(/Preço das Alimentações/i)).toBeInTheDocument();
    expect(screen.getByText(/Período Integral/i)).toBeInTheDocument();
    faixasEtarias.forEach((faixa) => {
      expect(screen.getByText(faixa.__str__)).toBeInTheDocument();
    });
  });

  const setInput = (testId, value) => {
    const input = screen.getByTestId(testId);
    fireEvent.change(input, { target: { value } });
    return input;
  };

  it("altera campos de Lanche, verifica se valores foram alterados e total calculado", async () => {
    const valorUnitario = setInput(
      `tabelas[Preço das Alimentações - Período Integral].${faixasEtarias[0].__str__}.valor_unitario`,
      "2,00",
    );
    const valorReajuste = setInput(
      `tabelas[Preço das Alimentações - Período Integral].${faixasEtarias[0].__str__}.valor_unitario_reajuste`,
      "2,00",
    );
    const valorTotal = screen.getByTestId(
      `tabelas[Preço das Alimentações - Período Integral].${faixasEtarias[0].__str__}.valor_unitario_total`,
    );

    await waitFor(() => {
      expect(valorUnitario.value).toBe("2,00");
      expect(valorReajuste.value).toBe("2,00");
      expect(valorTotal.value).toBe("4,00");
    });
  });
});
