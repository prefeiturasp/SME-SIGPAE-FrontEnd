import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { CADASTROS, CONFIGURACOES, ESCOLA_ABERTA } from "src/configs/constants";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockMeusDadosCODAEADMIN } from "src/mocks/meusDados/CODAE/admin";
import { EscolaAbertaForm } from "../components/EscolaAbertaForm";
import * as helper from "../helper";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../helper", () => ({
  buildPayload: jest.fn((v) => v),
  resetFormState: jest.fn(),
  validateForm: jest.fn(() => ({})),
}));

jest.mock("../components/TabelaUnidades", () => ({
  TabelaUnidades: ({
    openRemoverModal,
    closeRemoverModal,
    confirmRemover,
    page,
  }: any) => (
    <div>
      <span data-testid="tabela-page">{page}</span>
      <button
        data-testid="btn-open-remover"
        onClick={() => openRemoverModal("ue-1")}
      >
        Abrir
      </button>
      <button
        data-testid="btn-open-remover-invalid"
        onClick={() => openRemoverModal("ue-x")}
      >
        Invalido
      </button>
      <button data-testid="btn-close-remover" onClick={closeRemoverModal}>
        Fechar
      </button>
      <button data-testid="btn-confirm-remover" onClick={confirmRemover}>
        Confirmar
      </button>
    </div>
  ),
}));

jest.mock("../components/ModalAdicionarUnidadeEducacional", () => ({
  ModalAdicionarUnidadeEducacional: ({ showModal, closeModal }: any) =>
    showModal ? (
      <div data-testid="mock-modal-adicionar">
        <button data-testid="btn-fechar-adicionar" onClick={closeModal}>
          Fechar
        </button>
      </div>
    ) : null,
}));

jest.mock("src/components/Shareable/Weekly/Weekly", () => ({
  __esModule: true,
  default: ({ handleWeekly, arrayDiasSemana = [] }: any) => (
    <div>
      <span data-testid="weekly-dias">{JSON.stringify(arrayDiasSemana)}</span>
      <button data-testid="btn-weekly" onClick={() => handleWeekly("0")}>
        Dia
      </button>
    </div>
  ),
}));

const valoresValidos = {
  periodo_realizacao_de: "12/10/2026",
  periodo_realizacao_ate: "23/10/2026",
  recorrencias: { dias_semana: ["0"] },
  unidades_participantes: [{ id: "ue-1" }],
};

const renderComponent = (props: any = {}) => {
  return act(async () => {
    render(
      <MemoryRouter>
        <MeusDadosContext.Provider
          value={{
            meusDados: mockMeusDadosCODAEADMIN,
            setMeusDados: jest.fn(),
          }}
        >
          <EscolaAbertaForm
            mode="create"
            initialValues={{
              recorrencias: { dias_semana: [] },
              unidades_participantes: [],
            }}
            onSubmitApi={jest.fn().mockResolvedValue(undefined)}
            {...props}
          />
          <ToastContainer />
        </MeusDadosContext.Provider>
      </MemoryRouter>,
    );
  });
};

const salvar = async () => {
  await act(async () => {
    fireEvent.click(screen.getByText("Salvar Escola Aberta"));
  });
};

describe("EscolaAbertaForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (helper.validateForm as jest.Mock).mockReturnValue({});
  });

  afterEach(() => toast.dismiss());

  it("renderiza campos iniciais e valida bloqueio sem unidades participantes", async () => {
    const onSubmitApi = jest.fn();
    await renderComponent({ onSubmitApi, initialValues: {} });

    expect(screen.getByText("Período de Realização")).toBeInTheDocument();
    expect(screen.getByText("Unidades Participantes: 0")).toBeInTheDocument();

    await salvar();
    expect(onSubmitApi).not.toHaveBeenCalled();
    expect(
      screen.getByText(
        /Não é possível salvar a Escola Aberta sem Unidades Participantes/,
      ),
    ).toBeInTheDocument();
  });

  it("submete com sucesso no modo 'create' e reseta formulário", async () => {
    const onSubmitApi = jest.fn().mockResolvedValue(undefined);
    await renderComponent({ onSubmitApi, initialValues: valoresValidos });

    await salvar();
    await waitFor(() => expect(onSubmitApi).toHaveBeenCalled());
    expect(helper.resetFormState).toHaveBeenCalled();
    expect(
      screen.getByText("Escola Aberta cadastrada com sucesso!"),
    ).toBeInTheDocument();
  });

  it("submete com sucesso no modo 'edit', redireciona e permite cancelar", async () => {
    const onSubmitApi = jest.fn().mockResolvedValue(undefined);
    await renderComponent({
      mode: "edit",
      onSubmitApi,
      initialValues: valoresValidos,
    });

    fireEvent.click(screen.getByText("Cancelar"));
    expect(mockNavigate).toHaveBeenCalledWith(
      "/configuracoes/cadastros/escola-aberta-cadastradas",
    );

    await salvar();
    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith(
        `/${CONFIGURACOES}/${CADASTROS}/${ESCOLA_ABERTA}`,
      ),
    );
    expect(
      screen.getByText("Escola Aberta atualizada com sucesso!"),
    ).toBeInTheDocument();
  });

  it("trata erros de validação nas unidades calculando a página correta", async () => {
    const erros = Array.from({ length: 15 }, () => false);
    erros[12] = true;
    (helper.validateForm as jest.Mock).mockReturnValue({
      unidades_participantes: erros,
    });

    await renderComponent({
      initialValues: {
        ...valoresValidos,
        unidades_participantes: Array.from({ length: 15 }, (_, i) => ({
          id: `ue-${i}`,
        })),
      },
    });

    await salvar();
    expect(screen.getByTestId("tabela-page").textContent).toBe("2");

    (helper.validateForm as jest.Mock).mockReturnValue({
      unidades_participantes: [false],
    });
    await salvar();
    expect(screen.getByTestId("tabela-page").textContent).toBe("2");
  });

  it("adiciona e remove dias de recorrência ao alternar no Weekly", async () => {
    await renderComponent({ initialValues: { unidades_participantes: [] } });

    const btn = screen.getByTestId("btn-weekly");
    fireEvent.click(btn);
    expect(screen.getByTestId("weekly-dias").textContent).toBe('["0"]');
    fireEvent.click(btn);
    expect(screen.getByTestId("weekly-dias").textContent).toBe("[]");
  });

  it("controla abertura e fechamento do modal de adicionar unidades", async () => {
    await renderComponent();
    expect(
      screen.queryByTestId("mock-modal-adicionar"),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("+ Adicionar Unidades"));
    expect(screen.getByTestId("mock-modal-adicionar")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("btn-fechar-adicionar"));
    expect(
      screen.queryByTestId("mock-modal-adicionar"),
    ).not.toBeInTheDocument();
  });

  it("executa todo o ciclo de remoção de unidades (abrir, cancelar, id inválido e confirmação)", async () => {
    await renderComponent({ initialValues: valoresValidos });

    // 1. Confirmar sem ter aberto/selecionado id
    fireEvent.click(screen.getByTestId("btn-confirm-remover"));

    // 2. Abrir e fechar sem confirmar
    fireEvent.click(screen.getByTestId("btn-open-remover"));
    fireEvent.click(screen.getByTestId("btn-close-remover"));

    // 3. Abrir com ID que não existe na lista
    fireEvent.click(screen.getByTestId("btn-open-remover-invalid"));
    fireEvent.click(screen.getByTestId("btn-confirm-remover"));

    // 4. Fluxo feliz: remover unidade existente com sucesso
    fireEvent.click(screen.getByTestId("btn-open-remover"));
    fireEvent.click(screen.getByTestId("btn-confirm-remover"));
    await waitFor(() =>
      expect(
        screen.getByText("Unidade Educacional removida com sucesso!"),
      ).toBeInTheDocument(),
    );
  });
});
