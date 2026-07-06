import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockGetTiposUnidadeEscolar } from "src/mocks/cadastroTipoAlimentacao.service/mockGetTiposUnidadeEscolar";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockLotesSimples } from "src/mocks/lote.service/mockLotesSimples";
import { mockMeusDadosCODAEGA } from "src/mocks/meusDados/CODAE-GA";
import { mockGetPeriodoEscolar } from "src/mocks/services/dietaEspecial.service/mockGetPeriodoEscolar";
import { mockGetUnidadeEducacional } from "src/mocks/services/dietaEspecial.service/mockGetUnidadeEducacional";
import { EditarDiasLetivosPage } from "src/pages/Cadastros/EditarDiasLetivosSIGPAEPage";
import mock from "src/services/_mock";

const UUID_DIA_LETIVO = "88bc7f29-6b78-4ba6-b821-bc3f3b524afd";

const mockDiaLetivo = {
  uuid: UUID_DIA_LETIVO,
  data: "01/04/2025",
  lotes: ["9a9d403d-2f63-4d14-bca4-aa9b6fb4579d"],
  tipos_unidades: ["1cc69b3e-6210-4825-bf67-274d3c050bc0"],
  unidades_educacionais: ["b8f765e5-91dc-4dc4-99a0-eccf0ddaecd9"],
  periodos_escolares: [
    "6a1f2dde-424c-4900-8f7f-e6198d7df395",
    "4c6544e1-8308-467f-a547-817e6fb8c59e",
  ],
};

const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

jest.mock("src/components/Shareable/DatePicker", () => {
  return {
    InputComData: ({ input, dataTestId, placeholder, disabled }) => (
      <div data-testid={dataTestId}>
        <input
          type="text"
          value={input.value || ""}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => input.onChange(e.target.value)}
          data-testid={`${dataTestId}-input`}
        />
      </div>
    ),
  };
});

const setup = async () => {
  mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCODAEGA);
  mock.onGet("/lotes-simples/").reply(200, mockLotesSimples);
  mock.onGet("/tipos-unidade-escolar/").reply(200, mockGetTiposUnidadeEscolar);
  mock.onGet("/periodos-escolares/").reply(200, mockGetPeriodoEscolar);
  mock.onGet("/notificacoes/").reply(200, { results: [] });
  mock
    .onGet("/notificacoes/quantidade-nao-lidos/")
    .reply(200, { quantidade: 0 });
  mock
    .onPost("/escolas-simplissima-com-eol/escolas-com-cod-eol/")
    .reply(200, mockGetUnidadeEducacional);
  mock.onGet(`/dias-letivos/${UUID_DIA_LETIVO}/`).reply(200, mockDiaLetivo);

  Object.defineProperty(global, "localStorage", { value: localStorageMock });
  localStorage.setItem(
    "tipo_perfil",
    TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
  );
  localStorage.setItem(
    "perfil",
    PERFIL.COORDENADOR_GESTAO_ALIMENTACAO_TERCEIRIZADA,
  );

  await act(async () => {
    render(
      <MemoryRouter
        initialEntries={[`/editar-dia-letivo?uuid=${UUID_DIA_LETIVO}`]}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <MeusDadosContext.Provider
          value={{ meusDados: mockMeusDadosCODAEGA, setMeusDados: jest.fn() }}
        >
          <EditarDiasLetivosPage />
          <ToastContainer />
        </MeusDadosContext.Provider>
      </MemoryRouter>,
    );
  });
};

describe("Teste Editar/Excluir Dia Letivo do SIGPAE", () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2000-01-01T00:00:00"));
  });
  beforeEach(async () => {
    jest.clearAllMocks();
    mock.reset();
    await setup();
  });

  it("Deve renderizar o formulário em modo edição com os botões corretos", () => {
    expect(screen.getByTestId("btn-cancelar")).toBeInTheDocument();
    expect(screen.getByTestId("btn-excluir")).toBeInTheDocument();
    expect(screen.getByTestId("btn-salvar")).toBeInTheDocument();

    expect(screen.queryByTestId("btn-limpar")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("btn-adicionar-recorrencia"),
    ).not.toBeInTheDocument();
  });

  it("Deve ter os campos de data e dias da semana desabilitados em modo edição", () => {
    const dataInicial = screen.getByTestId("input-data-inicial-0-input");
    expect(dataInicial).toBeDisabled();

    const dataFinal = screen.getByTestId("input-data-final-0-input");
    expect(dataFinal).toBeDisabled();
  });

  it("Deve submeter a edição com sucesso e exibir toast", async () => {
    const payloadSpy = jest.fn();
    mock.onPut(`/dias-letivos/${UUID_DIA_LETIVO}/`).reply((config) => {
      payloadSpy(JSON.parse(config.data));
      return [200, {}];
    });

    fireEvent.click(screen.getByTestId("btn-salvar"));

    await waitFor(() => {
      expect(
        screen.getByText("Dia letivo atualizado com sucesso"),
      ).toBeInTheDocument();
    });

    expect(payloadSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        lotes: mockDiaLetivo.lotes,
        tipos_unidades: mockDiaLetivo.tipos_unidades,
        periodos_escolares: mockDiaLetivo.periodos_escolares,
      }),
    );
  });

  it("Deve exibir toast de erro ao falhar na edição", async () => {
    mock.onPut(`/dias-letivos/${UUID_DIA_LETIVO}/`).reply(400, {
      detail: "Erro ao atualizar dia letivo",
    });

    fireEvent.click(screen.getByTestId("btn-salvar"));

    await waitFor(() => {
      expect(
        screen.getByText("Erro ao atualizar dia letivo"),
      ).toBeInTheDocument();
    });
  });

  it("Deve voltar para tela anterior ao clicar em Cancelar", () => {
    fireEvent.click(screen.getByTestId("btn-cancelar"));
    expect(mockedUsedNavigate).toHaveBeenCalledWith(-1);
  });

  it("Deve abrir a modal de exclusão ao clicar em 'Excluir Cadastro'", async () => {
    fireEvent.click(screen.getByTestId("btn-excluir"));

    await waitFor(() => {
      expect(
        screen.getByText(/excluir cadastro de dia letivo/i),
      ).toBeInTheDocument();
    });

    expect(screen.getByRole("dialog")).toHaveTextContent(
      /deseja excluir o cadastro do dia letivo/i,
    );
  });

  it("Deve fechar a modal ao clicar em 'Não'", async () => {
    fireEvent.click(screen.getByTestId("btn-excluir"));

    await waitFor(() => {
      expect(
        screen.getByText(/excluir cadastro de dia letivo/i),
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Não"));

    await waitFor(() => {
      expect(
        screen.queryByText(/excluir cadastro de dia letivo/i),
      ).not.toBeInTheDocument();
    });
  });

  it("Deve excluir o dia letivo com sucesso ao confirmar na modal", async () => {
    mock.onDelete(`/dias-letivos/${UUID_DIA_LETIVO}/`).reply(204);

    fireEvent.click(screen.getByTestId("btn-excluir"));

    await waitFor(() => {
      expect(
        screen.getByText(/excluir cadastro de dia letivo/i),
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Sim"));

    await waitFor(() => {
      expect(
        screen.getByText("Dia letivo excluído com sucesso"),
      ).toBeInTheDocument();
    });

    expect(mockedUsedNavigate).toHaveBeenCalledWith(-1);
  });

  it("Deve exibir toast de erro ao falhar na exclusão", async () => {
    mock.onDelete(`/dias-letivos/${UUID_DIA_LETIVO}/`).reply(400, {
      detail: "Erro ao excluir dia letivo",
    });

    fireEvent.click(screen.getByTestId("btn-excluir"));

    await waitFor(() => {
      expect(
        screen.getByText(/excluir cadastro de dia letivo/i),
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Sim"));

    await waitFor(() => {
      expect(
        screen.getByText("Erro ao excluir dia letivo"),
      ).toBeInTheDocument();
    });

    expect(mockedUsedNavigate).not.toHaveBeenCalledWith(-1);
  });
});
