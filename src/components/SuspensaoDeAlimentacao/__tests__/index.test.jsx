import React from "react";
import { fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import FoodSuspensionEditor from "../index";
import { renderWithProvider } from "src/utils/test-utils";
import { getSuspensoesDeAlimentacaoSalvas } from "src/services/suspensaoDeAlimentacao.service";

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
});
