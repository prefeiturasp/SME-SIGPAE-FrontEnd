import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import React from "react";
import { TextArea } from "../TextArea";

describe("teste TextArea", () => {
  const props = {
    input: { onChange: jest.fn() },
    name: "TESTX",
    placeholder: "PLACETEST",
    label: "LBLTEST",
  };

  beforeEach(() => {
    render(<TextArea {...props} />);
  });

  it("<textarea> apresenta a propriedade name correta", () => {
    const textareaDiv = screen.getByTestId("textarea-div");
    const textareaElement = textareaDiv.querySelector("textarea");
    expect(textareaElement).toHaveAttribute("name", "TESTX");
  });

  it("<div> contem <label> com texto correto passsado via props", () => {
    const textareaDiv = screen.getByTestId("textarea-div");
    const labelElement = textareaDiv.querySelector("label");
    expect(labelElement).toHaveTextContent("LBLTEST");
  });

  it("<textarea> apresenta a propriedade placeholder correta", () => {
    const textareaDiv = screen.getByTestId("textarea-div");
    const textareaElement = textareaDiv.querySelector("textarea");
    expect(textareaElement).toHaveAttribute("placeholder", "PLACETEST");
  });
});
