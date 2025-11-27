import {
  act,
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { Form } from "react-final-form";
import { mockFaixasEtarias } from "src/mocks/faixaEtaria.service/mockGetFaixasEtarias";
import TabelaDietasCEI from "../../../components/Tabelas/TabelaDietasCEI";

describe("Testes de Tabela Dietas CEI - Parametrização Financeira", () => {
  const faixasEtarias = mockFaixasEtarias.results;

  beforeEach(async () => {
    await act(async () => {
      render(
        <Form
          onSubmit={jest.fn()}
          render={({ form }) => (
            <TabelaDietasCEI
              form={form}
              faixasEtarias={faixasEtarias}
              grupoSelecionado="Grupo 1"
              nomeTabela="Preço das Dietas CEI"
              periodo="Integral"
            />
          )}
        />,
      );
    });
  });

  it("verifica se tabela foi renderizada corretamente", async () => {
    expect(screen.getByText(/Preço das Dietas CEI/i)).toBeInTheDocument();
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

  it("altera campos da faixa etária, verifica se valores foram alterados e total calculado", async () => {
    const valorUnitario = setInput(
      `tabelas[Preço das Dietas CEI - Período Integral].${faixasEtarias[0].__str__}.valor_unitario`,
      "2,00",
    );
    const valorReajuste = setInput(
      `tabelas[Preço das Dietas CEI - Período Integral].${faixasEtarias[0].__str__}.percentual_acrescimo`,
      "100,00",
    );
    const valorTotal = screen.getByTestId(
      `tabelas[Preço das Dietas CEI - Período Integral].${faixasEtarias[0].__str__}.valor_unitario_total`,
    );

    await waitFor(() => {
      expect(valorUnitario.value).toBe("2,00");
      expect(valorReajuste.value).toBe("100,00");
      expect(valorTotal.value).toBe("4,00");
    });
  });
});
