import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { InputText } from "../index";
import { required } from "src/helpers/fieldValidators";

describe("teste InputText", () => {
  beforeEach(() => {
    const props = {
      meta: {
        touched: true,
        error: "This field is required",
      },
    };

    render(
      <InputText
        className="teste"
        name="myInput"
        label="mylabel"
        placeholder="myPlaceholder"
        validate={required}
        required
        {...props}
      />
    );
  });

  it("<input> contém o parâmetro required", () => {
    const inputDiv = screen.getByTestId("input-div");
    const inputElement = inputDiv.querySelector("input");
    expect(inputElement).toBeRequired();
  });

  it("<span> deve exibir asterisco quando obrigatorio", () => {
    const inputDiv = screen.getByTestId("input-div");
    const spanElement = inputDiv.querySelector("span");
    expect(spanElement).toHaveClass("required-asterisk");
  });

  it("<input> não deve ser disabled", () => {
    const inputDiv = screen.getByTestId("input-div");
    const inputElement = inputDiv.querySelector("input");
    expect(inputElement).toBeEnabled();
  });

  it("tipo deve ser text", () => {
    const inputDiv = screen.getByTestId("input-div");
    const inputElement = inputDiv.querySelector("input");
    expect(inputElement).toHaveAttribute("type", "text");
  });

  it("deve atribuir nome da label corretamente", () => {
    const inputDiv = screen.getByTestId("input-div");
    const labelElement = inputDiv.querySelector("label");
    expect(labelElement).toHaveTextContent("mylabel");
  });

  it("deve apresentar mensagem de erro receber erro via meta", () => {
    const inputDiv = screen.getByTestId("input-div");
    const inputElement = inputDiv.querySelector("input");
    fireEvent.click(inputElement);
    fireEvent.blur(inputElement);
    expect(inputElement).toHaveClass("form-control teste invalid-field");
  });
});

describe("teste InputText warning message", () => {
  beforeEach(() => {
    const props = {
      meta: {
        touched: true,
        warning: "Password invalid",
      },
    };
    render(
      <InputText
        className="teste"
        name="myInput"
        label="mylabel"
        placeholder="myPlaceholder"
        validate={required}
        required
        {...props}
      />
    );
  });

  it("deve apresentar mensagem de erro receber erro via meta", () => {
    const inputDiv = screen.getByTestId("input-div");
    const inputElement = inputDiv.querySelector("input");
    fireEvent.click(inputElement);
    fireEvent.blur(inputElement);
    expect(inputElement).toHaveClass("form-control teste invalid-field");
  });
});
