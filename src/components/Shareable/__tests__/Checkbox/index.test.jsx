import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Checkbox } from "src/components/Shareable/Checkbox/index";

jest.mock("redux-form", () => ({
  Field: jest.fn((props) => (
    <input data-testid="field-checkbox" type="checkbox" {...props} />
  )),
}));

describe("Checkbox Component", () => {
  const mockInput = {
    name: "testCheckbox",
    value: false,
    onChange: jest.fn(),
    onBlur: jest.fn(),
    onFocus: jest.fn(),
  };

  it("renderiza o checkbox corretamente", () => {
    render(<Checkbox input={mockInput} />);

    expect(screen.getByTestId("field-checkbox")).toBeInTheDocument();
    expect(screen.getByTestId("field-checkbox")).toHaveAttribute(
      "name",
      "testCheckbox",
    );
  });

  it("renderiza o texto quando props.texto é fornecido", () => {
    render(<Checkbox input={mockInput} texto="Meu Texto" />);

    expect(screen.getByText("Meu Texto")).toBeInTheDocument();
  });

  it("renderiza children quando texto não é fornecido", () => {
    render(
      <Checkbox input={mockInput}>
        <span>Texto do checkbox</span>
      </Checkbox>,
    );
    expect(screen.getByText("Texto do checkbox")).toBeInTheDocument();
  });

  it("chama onClick quando clica no span customizado", () => {
    const onClick = jest.fn();
    render(<Checkbox input={mockInput} onClick={onClick} />);

    const customSpan = screen.getByTestId("checkbox-custom");

    fireEvent.click(customSpan);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("aplica classes recebidas corretamente", () => {
    render(
      <Checkbox
        input={mockInput}
        className="classe-teste"
        classNameTexto="classe-texto"
        texto="ABC"
      />,
    );

    expect(screen.getByText("ABC")).toHaveClass("classe-texto");
  });
});
