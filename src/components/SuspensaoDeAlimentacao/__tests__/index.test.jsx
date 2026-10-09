import React from "react";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import FoodSuspensionEditor from "../index";
import { renderWithProvider } from "src/utils/test-utils";
import { getSuspensoesDeAlimentacaoSalvas } from "src/services/suspensaoDeAlimentacao.service";
import { createSuspensaoDeAlimentacao } from "src/services/suspensaoDeAlimentacao.service";
import { toastError } from "src/components/Shareable/Toast/dialogs";

jest.mock("src/components/Shareable/Toast/dialogs");

jest.mock("../validacao", () => ({
  validateSubmit: jest.fn(() => null),
}));
jest.mock("src/services/suspensaoDeAlimentacao.service");

const meusDadosMock = {
  vinculo_atual: {
    instituicao: {
      uuid: "escola-uuid",
      codigo_eol: "12345",
      nome: "EMEF TESTE",
      quantidade_alunos: 100,
      quantidade_alunos_terceirizada: 0,
      quantidade_alunos_parceira: 0,
    },
  },
};

const periodosMock = [
  {
    nome: "MANHA",
    uuid: "uuid-manha",
    checked: false,
    quantidade_alunos: 50,
  },
];

const motivosMock = [{ uuid: "m1", nome: "Motivo teste" }];

describe("Teste FoodSuspensionEditor - dias_razoes", () => {
  const setup = () =>
    renderWithProvider(
      <FoodSuspensionEditor
        meusDados={meusDadosMock}
        periodos={periodosMock}
        motivos={motivosMock}
        proximos_dois_dias_uteis={new Date("2026-10-01")}
      />,
    );

  beforeEach(() => {
    getSuspensoesDeAlimentacaoSalvas.mockResolvedValue({ results: [] });
  });

  it("deve renderizar o formulário após o carregamento", async () => {
    setup();

    expect(await screen.findByText("Adicionar dia")).toBeInTheDocument();
  });

  it("deve manter dias_razoes como array ao editar um motivo", async () => {
    const { container } = setup();
    await screen.findByText("Adicionar dia");

    const selectMotivo = container.querySelector('[data-cy="Motivo"]');
    fireEvent.change(selectMotivo, { target: { value: "m1" } });

    // Antes da correção, dias_razoes virava um objeto e o render
    // quebrava com "dias_razoes.map is not a function"
    expect(screen.getByText("Adicionar dia")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Adicionar dia"));
    expect(container.querySelectorAll('[data-cy="Motivo"]')).toHaveLength(2);
  });

  it("deve disparar toastError com a mensagem de duplicidade e marcar o campo data", async () => {
    const MENSAGEM =
      "Já existe uma Solicitação de Suspensão de Alimentação para a data selecionada. Verifique os dados informados.";

    createSuspensaoDeAlimentacao.mockResolvedValue({
      status: 400,
      data: {
        message: [MENSAGEM],
        conflitos: [{ data: "2026-10-15", periodo: "MANHA" }],
      },
    });

    const { container } = setup();
    await screen.findByText("Adicionar dia");

    fireEvent.change(container.querySelector('[data-cy="Motivo"]'), {
      target: { value: "m1" },
    });
    fireEvent.change(container.querySelector(".datepicker input"), {
      target: { value: "15/10/2026" },
    });

    fireEvent.click(screen.getByText("Salvar Rascunho"));

    await waitFor(() => {
      expect(createSuspensaoDeAlimentacao).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith(MENSAGEM);
    });

    expect(
      await screen.findAllByText("Conflito com outra solicitação"),
    ).not.toHaveLength(0);
    expect(container.querySelector(".invalid-field")).toBeInTheDocument();
  });
});
