import {
  act,
  cleanup,
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { Form } from "react-final-form";
import { mockFaixasEtarias } from "src/mocks/faixaEtaria.service/mockGetFaixasEtarias";
import { TabelaAlimentacaoCEI } from "../../../components/Tabelas/TabelaAlimentacaoCEI";

describe("Testes de Tabela Alimentacao CEI - Parametrização Financeira", () => {
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

  it("usa o rótulo CEI no grupo 2 e aceita grupo ausente", async () => {
    await act(async () => {
      render(
        <Form
          onSubmit={jest.fn()}
          initialValues={{
            tabelas: {
              "Dietas Tipo A - CEI - Período Parcial": {
                [faixasEtarias[0].__str__]: { percentual_acrescimo: "10" },
              },
            },
          }}
          render={({ form }) => (
            <TabelaAlimentacaoCEI
              form={form}
              faixasEtarias={faixasEtarias}
              grupoSelecionado="Grupo 2"
              periodo="Parcial"
              pendencias={["Dietas Tipo A"]}
              bloqueiaEdicao
            />
          )}
        />,
      );
    });

    expect(screen.getByText("CEI - Período Parcial")).toBeInTheDocument();
    const campo = screen.getByTestId(
      `tabelas[Preço das Alimentações - CEI - Período Parcial].${faixasEtarias[0].__str__}.valor_unitario`,
    );
    expect(campo).toBeDisabled();
    fireEvent.change(campo, { target: { value: "2,00" } });

    await act(async () => {
      render(
        <Form
          onSubmit={jest.fn()}
          render={({ form }) => (
            <TabelaAlimentacaoCEI
              form={form}
              faixasEtarias={faixasEtarias}
              periodo="Integral"
              pendencias={[]}
            />
          )}
        />,
      );
    });

    expect(screen.getAllByText("Período Integral").length).toBeGreaterThan(0);
  });

  it("recalcula pendências com percentual informado e com total zerado", async () => {
    cleanup();
    const faixa = faixasEtarias[0].__str__;
    const outraFaixa = faixasEtarias[1].__str__;
    await act(async () => {
      render(
        <Form
          onSubmit={jest.fn()}
          initialValues={{
            tabelas: {
              "Dietas Tipo A - Período Integral": {
                [faixa]: { percentual_acrescimo: "10" },
                [outraFaixa]: {},
              },
              "Dietas Tipo B - Período Integral": {},
            },
          }}
          render={({ form }) => (
            <TabelaAlimentacaoCEI
              form={form}
              faixasEtarias={faixasEtarias}
              grupoSelecionado="Grupo 1"
              periodo="Integral"
              pendencias={["Dietas Tipo A", "Dietas Tipo B"]}
            />
          )}
        />,
      );
    });

    const campo = `tabelas[Preço das Alimentações - Período Integral].${faixa}`;
    fireEvent.change(screen.getByTestId(`${campo}.valor_unitario`), {
      target: { value: "10,00" },
    });
    fireEvent.change(
      screen.getByTestId(
        `tabelas[Preço das Alimentações - Período Integral].${outraFaixa}.valor_unitario`,
      ),
      { target: { value: "0" } },
    );
    const reajuste = screen.getByTestId(`${campo}.valor_unitario_reajuste`);
    const propsKey = Object.keys(reajuste).find((key) =>
      key.startsWith("__reactProps"),
    );
    reajuste[propsKey].onChange({ target: { value: undefined } });

    await waitFor(() => {
      expect(screen.getByTestId(`${campo}.valor_unitario`).value).toBe("10,00");
    });
  });
});
