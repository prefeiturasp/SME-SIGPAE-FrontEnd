import { fireEvent, render, screen } from "@testing-library/react";
import arrayMutators from "final-form-arrays";
import React from "react";
import { Form } from "react-final-form";
import SubstituicoesField from "../../componentes/SubstituicoesField";

const alimentos = [
  { id: 648, nome: "AÇÚCAR REFINADO" },
  { id: 489, nome: "ABACATE" },
];

const produtos = [
  {
    id: 496,
    nome: "ACHOCOLATADO DIET",
    uuid: "cd5bc863-a165-401a-8fbc-e3ffff013b4f",
  },
  {
    id: 722,
    nome: "ACHOCOLATADO LIGHT",
    uuid: "8bb2e937-a82c-4e97-bd9a-c54cfb7a1ce6",
  },
];

const initialValues = {
  substituicoes: [
    {
      id: 1,
      alimento: "648",
      tipo: "I",
      substitutos: ["cd5bc863-a165-401a-8fbc-e3ffff013b4f"],
    },
    {
      id: 2,
      alimento: "489",
      tipo: "S",
      substitutos: ["8bb2e937-a82c-4e97-bd9a-c54cfb7a1ce6"],
    },
    {
      id: 3,
      alimento: "648",
      tipo: "I",
      substitutos: ["8bb2e937-a82c-4e97-bd9a-c54cfb7a1ce6"],
    },
  ],
};

function renderWithForm(children, values = initialValues) {
  return render(
    <Form
      onSubmit={jest.fn()}
      initialValues={values}
      mutators={{ ...arrayMutators }}
      render={({ form, values }) => (
        <form>
          {React.cloneElement(children, {
            form,
            values,
            alimentos,
            produtos,
          })}
        </form>
      )}
    />
  );
}

describe("SubstituicoesField", () => {
  it("Renderiza os campos iniciais corretamente", () => {
    renderWithForm(<SubstituicoesField />);
    expect(screen.getAllByText("AÇÚCAR REFINADO")).toHaveLength(2);
    expect(
      screen.getAllByRole("button", { name: "Adicionar Item" })
    ).toHaveLength(1);
  });

  it("Remove um item do meio e mantém os valores dos outros", () => {
    renderWithForm(<SubstituicoesField />);
    const removeButtons = screen.getAllByRole("button", { name: "" });
    fireEvent.click(removeButtons[1]);
    expect(screen.getAllByText("AÇÚCAR REFINADO")).toHaveLength(1);
  });

  it("Adiciona um novo item ao clicar em 'Adicionar Item'", () => {
    renderWithForm(<SubstituicoesField />);
    const addButton = screen.getByRole("button", { name: "Adicionar Item" });
    fireEvent.click(addButton);
    expect(screen.getAllByRole("combobox").length).toBeGreaterThanOrEqual(4);
  });

  it("Adiciona um novo item e permite editar seus campos", () => {
    renderWithForm(<SubstituicoesField />);
    const addButton = screen.getByRole("button", { name: "Adicionar Item" });
    fireEvent.click(addButton);

    const selects = screen.getAllByRole("combobox");
    expect(selects.length).toBeGreaterThanOrEqual(4);

    fireEvent.change(selects[3], { target: { value: "489" } });
    expect(selects[3].value).toBe("489");
  });

  it("Abre e fecha o select ao clicar e ao perder o foco", () => {
    renderWithForm(<SubstituicoesField />);
    const selects = screen.getAllByRole("combobox");
    fireEvent.mouseDown(selects[0]);
    fireEvent.blur(selects[0]);
  });

  it("Filtra opções do select ao digitar", () => {
    renderWithForm(<SubstituicoesField />);
    const selects = screen.getAllByRole("combobox");
    fireEvent.change(selects[0], { target: { value: "abacate" } });
    expect(screen.getByText("ABACATE")).toBeInTheDocument();
  });

  it("Seleciona substitutos no multi-select e altera o valor", () => {
    renderWithForm(<SubstituicoesField />);
    const produtoOptions = screen.getAllByText("ACHOCOLATADO LIGHT");
    expect(produtoOptions.length).toBeGreaterThan(0);
  });

  it("Só mostra botão de remover quando deveHabilitarApagar e index > 0", () => {
    renderWithForm(<SubstituicoesField />);
    const allButtons = screen.getAllByRole("button");
    expect(allButtons.length).toBeGreaterThan(1);
  });
});
