import React from "react";
import { render, screen } from "@testing-library/react";
import { Form } from "react-final-form";
import MotivoAlteracao from "src/components/screens/DietaEspecial/Relatorio/componentes/FormAutorizaDietaEspecial/componentes/MotivoAlteracao";
import "@testing-library/jest-dom";

describe("Teste do componente MotivoAlteracao", () => {
  const renderWithForm = (motivoProp) => {
    return render(
      <Form
        onSubmit={jest.fn()}
        render={() => <MotivoAlteracao motivo={motivoProp} />}
      />,
    );
  };

  it("deve renderizar o campo com o nome do motivo corretamente", () => {
    const motivoMock = { nome: "Alteração de Unidade Escolar" };

    renderWithForm(motivoMock);

    expect(screen.getByText("Motivo da alteração")).toBeInTheDocument();

    const input = screen.getByDisplayValue("Alteração de Unidade Escolar");
    expect(input).toBeInTheDocument();
    expect(input).toBeDisabled();
  });

  it("deve renderizar o campo vazio quando o motivo for null", () => {
    renderWithForm(null);
    const input = screen.getByRole("textbox");
    expect(input.value).toBe("");
  });

  it("deve renderizar o campo vazio quando o motivo for undefined", () => {
    renderWithForm({});

    const input = screen.getByRole("textbox");
    expect(input.value).toBe("");
  });
});
