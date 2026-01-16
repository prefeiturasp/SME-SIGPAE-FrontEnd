import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CKEditorField from "src/components/Shareable/CKEditorField";
import "ckeditor5/ckeditor5.css";

jest.mock("@ckeditor/ckeditor5-react", () => ({
  CKEditor: ({ data, onChange, onBlur, config, ...rest }) => {
    return (
      <div data-testid={rest["data-testid"] || "ckeditor-mock"}>
        <textarea
          data-testid="ckeditor-mock"
          value={data || ""}
          onChange={(e) => {
            const mockEditor = {
              getData: () => e.target.value,
            };
            onChange && onChange(null, mockEditor);
          }}
          onBlur={onBlur}
          placeholder={config?.placeholder}
        />
      </div>
    );
  },
}));

jest.mock("src/components/Shareable/HelpText", () => ({
  HelpText: ({ helpText }) => <div data-testid="help-text">{helpText}</div>,
}));

jest.mock("src/components/Shareable/Input/InputErroMensagemCKEditor", () => ({
  default: ({ meta, touched }) => (
    <div data-testid="error-message">
      {meta?.error && touched && meta.error}
    </div>
  ),
}));

describe("CKEditorField", () => {
  const defaultProps = {
    input: {
      value: "",
      onChange: jest.fn(),
    },
    meta: {},
    name: "test-editor",
    dataTestId: "ckeditor-field",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve setar touched como true quando perde o foco", () => {
    render(<CKEditorField {...defaultProps} />);

    const editor = screen.getByTestId("ckeditor-mock");
    fireEvent.blur(editor);
  });

  it("deve aplicar classe de erro quando há erro e touched é true", () => {
    const props = {
      ...defaultProps,
      meta: { error: "Campo obrigatório" },
    };

    const { container } = render(<CKEditorField {...props} />);

    const editor = screen.getByTestId("ckeditor-mock");
    fireEvent.blur(editor);

    setTimeout(() => {
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass("ckeditor-error");
    }, 0);
  });

  it("deve mostrar mensagem de erro quando há erro e touched é true", () => {
    const props = {
      ...defaultProps,
      meta: { error: "Campo obrigatório" },
    };

    render(<CKEditorField {...props} />);

    const editor = screen.getByTestId("ckeditor-mock");
    fireEvent.blur(editor);

    setTimeout(() => {
      expect(screen.getByTestId("error-message")).toHaveTextContent(
        "Campo obrigatório",
      );
    }, 0);
  });

  it("deve desabilitar toolbar quando toolbar é false", () => {
    const props = {
      ...defaultProps,
      toolbar: false,
    };

    render(<CKEditorField {...props} />);

    expect(screen.getByTestId("ckeditor-mock")).toBeInTheDocument();
  });
});
