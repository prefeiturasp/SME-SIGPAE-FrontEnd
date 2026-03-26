import React from "react";
import { render, screen } from "@testing-library/react";
import { ModalAlunoParcial } from ".";

const mockInputComData = jest.fn(() => (
  <div data-testid="input-com-data-mock" />
));

jest.mock("src/components/Shareable/DatePicker", () => ({
  __esModule: true,
  InputComData: (props) => mockInputComData(props),
}));

describe("ModalAlunoParcial", () => {
  beforeEach(() => {
    mockInputComData.mockClear();
  });

  it("abre o calendario no mes de referencia do periodo", () => {
    render(
      <ModalAlunoParcial
        closeModal={jest.fn()}
        showModal={true}
        onSubmit={jest.fn()}
        mes="03"
        ano="2026"
        setAlunosParcialAlterado={jest.fn()}
        adicionarOuExcluir="Adicionar"
        dataAdicionado=""
      />,
    );

    expect(
      screen.getByText("Adicionar Aluno no Período Parcial"),
    ).toBeInTheDocument();

    const props = mockInputComData.mock.calls.at(-1)[0];

    expect(props.openToDate).toEqual(new Date(2026, 2, 1));
    expect(props.minDate).toEqual(new Date(2026, 2, 1));
    expect(props.maxDate).toEqual(new Date(2026, 2, 31));
  });
});
