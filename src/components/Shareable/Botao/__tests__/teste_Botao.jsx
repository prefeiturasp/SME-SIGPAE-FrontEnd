import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Botao } from "../index";
import { BUTTON_TYPE, BUTTON_STYLE, BUTTON_ICON } from "../constants";

describe("Test <Botao>", () => {
  const onClick = jest.fn();

  beforeEach(() => {
    render(
      <Botao
        type={BUTTON_TYPE.SUBMIT}
        style={BUTTON_STYLE.GREEN}
        onClick={onClick}
        icon={BUTTON_ICON.ARROW_LEFT}
        texto={"texto do botao"}
        className="btn-block"
      />
    );
  });

  it("renders", () => {
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("renders label props", () => {
    expect(screen.getByText("texto do botao")).toBeInTheDocument();
  });

  it("renders correct style props", () => {
    const button = screen.getByRole("button");
    expect(button).toHaveClass("green-button");
  });

  it("correct type props", () => {
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("type", "submit");
  });

  it("disabled by default", () => {
    const button = screen.getByRole("button");
    expect(button).not.toBeDisabled();
  });

  it("clicked 2 times", () => {
    const button = screen.getByRole("button");
    fireEvent.click(button);
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalled();
  });
});
