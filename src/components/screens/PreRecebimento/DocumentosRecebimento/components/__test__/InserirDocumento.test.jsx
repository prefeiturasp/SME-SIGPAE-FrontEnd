import React from "react";
import { render, screen } from "@testing-library/react";
import { Form } from "react-final-form";
import InserirDocumento from "src/components/screens/PreRecebimento/DocumentosRecebimento/components/InserirDocumento";

jest.mock("../../constants", () => ({
  OUTROS_DOCUMENTOS_OPTIONS: [
    { value: "RELATORIO", label: "Relatório Mensal" },
    { value: "OUTROS", label: "Outros Documentos" },
  ],
}));

jest.mock("src/components/Shareable/Input/InputFile", () => ({
  __esModule: true,
  default: ({ texto, setFiles }) => (
    <div data-testid="mock-input-file">
      <span>{texto}</span>
      <button onClick={() => setFiles([{ name: "teste.pdf" }])}>Upload</button>
    </div>
  ),
}));

jest.mock("src/components/Shareable/TextArea/TextArea", () => ({
  __esModule: true,
  TextArea: ({ label, placeholder }) => (
    <div data-testid="mock-textarea">
      <label>{label}</label>
      <textarea placeholder={placeholder} />
    </div>
  ),
}));

const mockSetFiles = jest.fn();
const mockRemoveFile = jest.fn();

describe("Teste do componente InserirDocumento", () => {
  const renderComponent = (props = {}) => {
    return render(
      <Form
        onSubmit={() => {}}
        render={() => (
          <InserirDocumento
            setFiles={mockSetFiles}
            removeFile={mockRemoveFile}
            {...props}
          />
        )}
      />,
    );
  };

  it("deve exibir o título correto quando tipoDocumento for RELATORIO", () => {
    renderComponent({ tipoDocumento: "RELATORIO" });

    expect(screen.getByText("Relatório Mensal")).toBeInTheDocument();
    expect(screen.getByText("Anexar Documentos")).toBeInTheDocument();
  });

  it("deve renderizar o TextArea de descrição apenas quando tipoDocumento for OUTROS", () => {
    renderComponent({ tipoDocumento: "RELATORIO" });
    expect(screen.queryByTestId("mock-textarea")).not.toBeInTheDocument();

    renderComponent({ tipoDocumento: "OUTROS" });
    expect(screen.getByTestId("mock-textarea")).toBeInTheDocument();
    expect(screen.getByText("Descrição dos Documentos")).toBeInTheDocument();
  });

  it("deve exibir a label de orientação de formato corretamente (singular/plural)", () => {
    renderComponent({ tipoDocumento: "" });
    expect(
      screen.getByText(/Envie um arquivo no formato:/i),
    ).toBeInTheDocument();

    renderComponent({ tipoDocumento: "RELATORIO" });
    expect(
      screen.getByText(/Envie um arquivo nos formatos:/i),
    ).toBeInTheDocument();
  });

  it("deve passar as extensões aceitas corretamente para o InputFile", () => {
    renderComponent({ formatosAceitos: "PDF" });
    expect(screen.getByText(/PDF/i)).toBeInTheDocument();
    expect(screen.queryByText(/PNG/i)).not.toBeInTheDocument();
  });
});
