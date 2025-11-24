import {
  act,
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { Form } from "react-final-form";
import { mockGetVinculosTipoAlimentacaoPorEscola } from "src/mocks/cadastroTipoAlimentacao.service/mockGetVinculosTipoAlimentacaoPorEscola";
import TabelaDietaTipoB from "../../../components/Tabelas/TabelaDietaTipoB";

describe("Testes de Tabela Dietas Tipo B - Parametrização Financeira", () => {
  const tiposAlimentacao = mockGetVinculosTipoAlimentacaoPorEscola.results.find(
    (e) =>
      e.tipo_unidade_escolar.iniciais === "EMEI" &&
      e.periodo_escolar.nome === "MANHA",
  ).tipos_alimentacao;

  const setup = async ({ grupo, tipoTurma = "" }) => {
    await act(async () => {
      render(
        <Form
          onSubmit={jest.fn()}
          render={({ form }) => (
            <TabelaDietaTipoB
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
    expect(screen.getByText("Preço das Dietas Tipo B")).toBeInTheDocument();
    expect(screen.getByText("Lanche")).toBeInTheDocument();
    expect(screen.getByText("Lanche 4h")).toBeInTheDocument();
  });

  const setInput = (testId, value) => {
    const input = screen.getByTestId(testId);
    fireEvent.change(input, { target: { value } });
    return input;
  };

  it("altera campos de Lanche 4h, verifica se valores foram alterados e total calculado", async () => {
    await setup({ grupo: "Grupo 3" });

    const valorUnitario = setInput(
      "tabelas[Dietas Tipo B].Lanche 4h.valor_unitario",
      "5,00",
    );
    const valorReajuste = setInput(
      "tabelas[Dietas Tipo B].Lanche 4h.percentual_acrescimo",
      "100,00",
    );
    const valorTotal = screen.getByTestId(
      "tabelas[Dietas Tipo B].Lanche 4h.valor_unitario_total",
    );

    await waitFor(() => {
      expect(valorUnitario.value).toBe("5,00");
      expect(valorReajuste.value).toBe("100,00");
      expect(valorTotal.value).toBe("10,00");
    });
  });
});
