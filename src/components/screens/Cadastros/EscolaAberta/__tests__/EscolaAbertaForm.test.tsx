import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockMeusDadosCODAEADMIN } from "src/mocks/meusDados/CODAE/admin";
import { EscolaAbertaForm } from "../components/EscolaAbertaForm";
import * as helper from "../helper";

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
  ModalAdicionarUnidadeEducacional: ({ showModal }: { showModal: boolean }) =>
    showModal ? (
      <div data-testid="mock-modal-adicionar">Modal Adicionar</div>
    ) : null,
}));

jest.mock("src/components/Shareable/Weekly/Weekly", () => ({
  __esModule: true,
  default: ({ handleWeekly }: any) => (
    <div data-testid="mock-weekly">
      <button
        type="button"
        data-testid="btn-weekly-domingo"
        onClick={() => handleWeekly("0")}
      >
        Domingo
      </button>
      <button
        type="button"
        data-testid="btn-weekly-sabado"
        onClick={() => handleWeekly("6")}
      >
        Sábado
      </button>
    </div>
  ),
}));

const renderComponent = (props: any = {}) => {
  const defaultProps = {
    mode: "create" as const,
    initialValues: {
      periodo_realizacao_de: undefined,
      periodo_realizacao_ate: undefined,
      recorrencias: { dias_semana: [] },
      unidades_participantes: [],
    },
    onSubmitApi: jest.fn().mockResolvedValue(undefined),
    onAfterSuccess: jest.fn(),
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
          <EscolaAbertaForm {...defaultProps} {...props} />
          <ToastContainer />
        </MeusDadosContext.Provider>
      </MemoryRouter>,
    );
  });
};

describe("EscolaAbertaForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar os campos obrigatórios da Escola Aberta", async () => {
    await renderComponent();

    expect(screen.getByText("Período de Realização")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("De")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Até")).toBeInTheDocument();
    expect(screen.getByTestId("mock-weekly")).toBeInTheDocument();
    expect(screen.getByText("+ Adicionar Unidades")).toBeInTheDocument();
    expect(screen.getByText("Salvar Escola Aberta")).toBeInTheDocument();
  });

  it("não deve chamar onSubmitApi se não houver unidades participantes", async () => {
    const onSubmitApi = jest.fn();

    await renderComponent({
      onSubmitApi,
      initialValues: {
        periodo_realizacao_de: "12/10/2026",
        periodo_realizacao_ate: "23/10/2026",
        recorrencias: { dias_semana: ["0", "6"] },
        unidades_participantes: [],
      },
    });

    await act(async () => {
      fireEvent.click(screen.getByText("Salvar Escola Aberta"));
      await Promise.resolve();
    });

    expect(onSubmitApi).not.toHaveBeenCalled();
    expect(
      screen.getByText(
        "Não é possível salvar a Escola Aberta sem Unidades Participantes. Adicione pelo menos uma unidade.",
      ),
    ).toBeInTheDocument();
  });

  it("deve chamar onSubmitApi com sucesso ao submeter formulário válido", async () => {
    const onSubmitApi = jest.fn().mockResolvedValue(undefined);
    const onAfterSuccess = jest.fn();

    const initialValues = {
      periodo_realizacao_de: "12/10/2026",
      periodo_realizacao_ate: "23/10/2026",
      recorrencias: { dias_semana: ["0", "6"] },
      unidades_participantes: [
        {
          id: "ue-1",
          loteUuid: "lote-uuid",
          unidadeEducacionalUuid: "escola-uuid",
          tiposAlimentacaoInscritosUuids: ["alim-uuid"],
        },
      ],
    };

    (helper.validateForm as jest.Mock).mockReturnValue({});

    await renderComponent({ onSubmitApi, onAfterSuccess, initialValues });

    await act(async () => {
      fireEvent.click(screen.getByText("Salvar Escola Aberta"));
      await Promise.resolve();
    });

    expect(onSubmitApi).toHaveBeenCalled();
    expect(helper.buildPayload).toHaveBeenCalled();
  });

  it("deve abrir o modal ao clicar em '+ Adicionar Unidades'", async () => {
    await renderComponent();

    expect(
      screen.queryByTestId("mock-modal-adicionar"),
    ).not.toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByText("+ Adicionar Unidades"));
    });

    expect(screen.getByTestId("mock-modal-adicionar")).toBeInTheDocument();
  });

  it("deve renderizar a TabelaUnidades", async () => {
    await renderComponent();

    expect(screen.getByTestId("mock-tabela-unidades")).toBeInTheDocument();
  });

  it("deve renderizar botão Cancelar quando mode não for 'create'", async () => {
    await renderComponent({ mode: "edit" });

    expect(screen.getByText("Cancelar")).toBeInTheDocument();
  });
});
