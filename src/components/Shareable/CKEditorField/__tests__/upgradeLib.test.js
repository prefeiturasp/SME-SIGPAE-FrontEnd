import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CKEditorField from "../index";

jest.mock("src/components/Shareable/HelpText", () => ({
  HelpText: ({ helpText }) => <div data-testid="help-text">{helpText}</div>,
}));

jest.mock("src/components/Shareable/Input/InputErroMensagemCKEditor", () => ({
  __esModule: true,
  default: ({ meta, touched }) => (
    <div data-testid="input-erro">
      {touched && meta?.error ? meta.error : "no error"}
    </div>
  ),
}));

jest.mock("@ckeditor/ckeditor5-react", () => ({
  CKEditor: jest.fn(({ onChange }) => (
    <div
      data-testid="mock-ckeditor"
      onClick={() => onChange(null, { getData: () => "mocked data" })}
    >
      Mock CKEditor
    </div>
  )),
}));

describe("CKEditorField", () => {
  const defaultProps = {
    helpText: "Help text",
    label: "Test Label",
    input: {
      value: "Initial content",
      onChange: jest.fn(),
    },
    meta: {
      error: "Required field",
    },
    name: "test-editor",
    required: true,
    placeholder: "Type here",
    dataTestId: "ckeditor-field",
  };

  it("deve renderizar o CKEditorField sem erro", () => {
    render(<CKEditorField {...defaultProps} />);
    expect(screen.getByTestId("ckeditor-field")).toBeInTheDocument();
    expect(screen.getByText("Test Label")).toBeInTheDocument();
    expect(screen.getByTestId("help-text")).toHaveTextContent("Help text");
    expect(screen.getByTestId("mock-ckeditor")).toBeInTheDocument();
  });

  it("deve chamar onChange ao interagir com o CKEditor", () => {
    render(<CKEditorField {...defaultProps} />);
    fireEvent.click(screen.getByTestId("mock-ckeditor"));
    expect(defaultProps.input.onChange).toHaveBeenCalledWith("mocked data");
  });

  it("deve passar o ClassicEditor como editor para o CKEditor", () => {
    render(<CKEditorField {...defaultProps} />);
    expect(require("@ckeditor/ckeditor5-react").CKEditor).toHaveBeenCalledWith(
      expect.objectContaining({
        editor: expect.anything(),
      }),
      expect.anything()
    );
  });
});
