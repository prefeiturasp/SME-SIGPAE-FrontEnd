import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { Select } from "../index";
import { required } from "helpers/fieldValidators";

let options = [
  { uuid: "v1", nome: "op1", disable: false },
  { uuid: "v2", nome: "op2", selected: true },
  { uuid: "v3", nome: "op3", selected: false },
];

describe("teste Select", () => {
  let onChange = jest.fn();
  let input = { onChange };

  beforeEach(() => {
    const props = {
      meta: {
        touched: true,
        error: "This field is required",
      },
    };
    render(
      <Select
        options={options}
        className="teste"
        name="myCombo"
        input={input}
        label="mylabel"
        required
        validate={required}
        dataTestId="select-div"
        {...props}
      />
    );
  });

  it("<span> deve exibir asterisco quando obrigatorio", () => {
    const selectDiv = screen.getByTestId("select-div");
    const spanElement = selectDiv.querySelector("span");
    expect(spanElement).toHaveClass("required-asterisk");
    expect(spanElement).toHaveTextContent("*");
  });

  it("<select> deve conter a quantidade de options correta", () => {
    const selectDiv = screen.getByTestId("select-div");
    const listItems = selectDiv.querySelectorAll("option");
    expect(listItems).toHaveLength(options.length);
  });

  it("<select> não deve ser disabled", () => {
    const selectDiv = screen.getByTestId("select-div");
    const selectElement = selectDiv.querySelector("select");
    expect(selectElement).toBeEnabled();
  });

  it("<select> deve ter a propriedade name correta", () => {
    const selectDiv = screen.getByTestId("select-div");
    const selectElement = selectDiv.querySelector("select");
    expect(selectElement).toHaveAttribute("name", "myCombo");
  });

  it("<select> deve ter o nome da label correta", () => {
    const selectDiv = screen.getByTestId("select-div");
    const labelElement = selectDiv.querySelector("label");
    expect(labelElement).toHaveTextContent("mylabel");
  });

  it("onChange chamado duas vezes", () => {
    const selectDiv = screen.getByTestId("select-div");
    const selectElement = selectDiv.querySelector("select");
    fireEvent.change(selectElement, { target: { value: "A" } });
    fireEvent.change(selectElement, { target: { value: "B" } });
    expect(input.onChange).toHaveBeenCalledTimes(2);
  });

  it("<select> deve apresentar mensagem de erro receber erro via meta", () => {
    const selectDiv = screen.getByTestId("select-div");
    const selectElement = selectDiv.querySelector("select");
    fireEvent.click(selectElement);
    fireEvent.blur(selectElement);
    expect(selectElement).toHaveClass("form-control teste invalid-field");
  });
});
