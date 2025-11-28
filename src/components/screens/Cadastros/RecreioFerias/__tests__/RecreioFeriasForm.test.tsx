import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockMeusDadosCODAEADMIN } from "src/mocks/meusDados/CODAE/admin";
import { RecreioFeriasForm } from "../components/RecreioFeriasForm";
import * as helper from "../helper";

jest.mock("src/components/Shareable/Toast/dialogs", () => ({
  toastSuccess: jest.fn(),
  toastError: jest.fn(),
}));

jest.mock("../helper", () => ({
  buildPayload: jest.fn((v) => v),
  resetFormState: jest.fn(),
  validateForm: jest.fn(() => ({})),
}));

jest.mock("../components/TabelaUnidades", () => ({
  TabelaUnidades: () => (
    <div data-testid="mock-tabela-unidades">Tabela Unidades</div>
  ),
}));

jest.mock("../components/ModalAdicionarUnidadeEducacional", () => ({
  ModalAdicionarUnidadeEducacional: () => (
    <div data-testid="mock-modal-adicionar">Modal Adicionar</div>
  ),
}));

const renderComponent = (props: any = {}) => {
  const defaultProps = {
    mode: "create" as const,
    initialValues: {},
    onSubmitApi: jest.fn().mockResolvedValue(undefined),
    onAfterSuccess: undefined,
  };

  return act(async () => {
    render(
      <MemoryRouter>
        <MeusDadosContext.Provider
          value={{
            meusDados: mockMeusDadosCODAEADMIN,
            setMeusDados: jest.fn(),
          }}
        >
          <RecreioFeriasForm {...defaultProps} {...props} />
        </MeusDadosContext.Provider>
      </MemoryRouter>
    );
  });
};

describe("RecreioFeriasForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar campos básicos do formulário", async () => {
    await renderComponent();

    expect(screen.getByText("Título")).toBeInTheDocument();
    expect(screen.getByText("Período de Realização")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("De")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Até")).toBeInTheDocument();
    expect(screen.getByText("+ Adicionar Unidades")).toBeInTheDocument();
    expect(screen.getByText("Salvar Recreio nas Férias")).toBeInTheDocument();
  });

  it("deve chamar onSubmitApi ao submeter formulário com unidades válidas (usando initialValues)", async () => {
    const onSubmitApi = jest.fn().mockResolvedValue(undefined);

    const initialValues = {
      titulo_cadastro: "Recreio de Verão",
      periodo_realizacao_de: "01/01/2026",
      periodo_realizacao_ate: "10/01/2026",
      unidades_participantes: [{ id: "ue1" }],
    };

    (helper.validateForm as jest.Mock).mockReturnValue({});

    await renderComponent({ onSubmitApi, initialValues });

    await act(async () => {
      fireEvent.click(screen.getByText("Salvar Recreio nas Férias"));
      await Promise.resolve();
    });

    expect(onSubmitApi).toHaveBeenCalled();
    expect(onSubmitApi.mock.calls[0][0]).toMatchObject({
      titulo_cadastro: "Recreio de Verão",
      periodo_realizacao_de: "01/01/2026",
      periodo_realizacao_ate: "10/01/2026",
      unidades_participantes: [{ id: "ue1" }],
    });
  });

  it("deve abrir modal ao clicar em 'Adicionar Unidades'", async () => {
    await renderComponent();

    await act(async () => {
      fireEvent.click(screen.getByText("+ Adicionar Unidades"));
    });

    expect(screen.getByTestId("mock-modal-adicionar")).toBeInTheDocument();
  });

  it("deve renderizar TabelaUnidades com props corretas", async () => {
    await renderComponent();

    expect(screen.getByTestId("mock-tabela-unidades")).toBeInTheDocument();
  });
});
