import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
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

const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

jest.mock("src/components/Shareable/DatePicker", () => {
  const React = require("react");
  return {
    InputComData: ({ input, dataTestId, placeholder }) => {
      React.useEffect(() => {
        if (input.value !== undefined) return;
      }, [input.value]);
      return (
        <div data-testid={dataTestId}>
          <input
            type="text"
            value={input.value || ""}
            placeholder={placeholder}
            onChange={(e) => input.onChange(e.target.value)}
            data-testid={`${dataTestId}-input`}
          />
        </div>
      );
    },
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
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <MeusDadosContext.Provider
          value={{
            meusDados: mockMeusDadosCODAEGA,
            setMeusDados: jest.fn(),
          }}
        >
          <EditarDiasLetivosPage />
          <ToastContainer />
        </MeusDadosContext.Provider>
      </MemoryRouter>,
    );
  });
};

const selecionarOpcao = async (dataTestId, optionText) => {
  const selectWrapper = screen.getByTestId(dataTestId);
  const combobox = within(selectWrapper).getByRole("combobox");
  fireEvent.mouseDown(combobox);
  const option = screen.getByText(optionText);
  fireEvent.click(option);
};

const preencherData = (dataTestId, value) => {
  const input = screen.getByTestId(`${dataTestId}-input`);
  fireEvent.change(input, { target: { value } });
};

describe("Teste Cadastrar Dia Letivo do SIGPAE", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    mock.reset();
    await setup();
  });

  it("Verifica se o componente foi renderizado", () => {
    expect(screen.getByText("DRE/Lote")).toBeInTheDocument();
    expect(screen.getByText("Tipo de Unidade")).toBeInTheDocument();
    expect(screen.getByText("Unidades Educacionais")).toBeInTheDocument();
    expect(screen.getByText("Recorrência")).toBeInTheDocument();
    expect(screen.getByText("Período Letivo")).toBeInTheDocument();
    expect(screen.getByText("Períodos Escolares")).toBeInTheDocument();
    expect(screen.getByText("Repetir")).toBeInTheDocument();
    expect(screen.getByText("Adicionar Recorrência")).toBeInTheDocument();
  });

  it("Deve preencher todos os campos, adicionar recorrência e submeter com sucesso", async () => {
    const payloadSpy = jest.fn();
    mock.onPost("/dias-letivos/").reply((config) => {
      payloadSpy(JSON.parse(config.data));
      return [201, {}];
    });

    await selecionarOpcao("select-lotes", "SA - 1");

    const origSetTimeout = global.setTimeout;
    jest.spyOn(global, "setTimeout").mockImplementation((cb, ms) => {
      if (ms === 3000) {
        cb();
        return 1;
      }
      return origSetTimeout(cb, ms);
    });

    await selecionarOpcao("select-tipos-unidades", "CCI/CIPS");

    const selectUnidades = screen.getByTestId("select-unidades-educacionais");
    const comboboxUnidades = within(selectUnidades).getByRole("combobox");
    fireEvent.mouseDown(comboboxUnidades);
    await waitFor(() => {
      expect(
        screen.getByText("000566 - EMEF TERESA MARGARIDA DA SILVA E ORTA"),
      ).toBeInTheDocument();
    });

    global.setTimeout.mockRestore();

    fireEvent.click(
      screen.getByText("000566 - EMEF TERESA MARGARIDA DA SILVA E ORTA"),
    );

    preencherData("input-data-inicial-0", "01/01/2025");
    preencherData("input-data-final-0", "31/01/2025");

    await selecionarOpcao("select-periodos-escolares-0", "INTEGRAL");
    fireEvent.click(screen.getByTestId("weekly-dias-semana-0-1"));

    fireEvent.click(screen.getByTestId("btn-adicionar-recorrencia"));

    preencherData("input-data-inicial-1", "02/02/2025");
    preencherData("input-data-final-1", "28/02/2025");
    await selecionarOpcao("select-periodos-escolares-1", "MANHA");
    fireEvent.click(screen.getByTestId("weekly-dias-semana-1-2"));

    fireEvent.click(screen.getByTestId("btn-salvar"));

    await waitFor(() => {
      expect(
        screen.getByText("Dias letivos cadastrados com sucesso"),
      ).toBeInTheDocument();
    });

    expect(payloadSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        unidades_educacionais: ["b8f765e5-91dc-4dc4-99a0-eccf0ddaecd9"],
      }),
    );
  });

  it("Deve adicionar recorrência e removê-la com a lixeira", async () => {
    fireEvent.click(screen.getByTestId("btn-adicionar-recorrencia"));

    expect(screen.getByTestId("btn-remover-recorrencia-1")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("btn-remover-recorrencia-1"));

    expect(
      screen.queryByTestId("btn-remover-recorrencia-1"),
    ).not.toBeInTheDocument();
  });

  it("Deve exibir toast de erro ao falhar no cadastro", async () => {
    mock
      .onPost("/dias-letivos/")
      .reply(400, { detail: "Erro ao cadastrar dias letivos" });

    await selecionarOpcao("select-lotes", "SA - 1");
    await selecionarOpcao("select-tipos-unidades", "CCI/CIPS");
    preencherData("input-data-inicial-0", "01/01/2025");
    preencherData("input-data-final-0", "31/01/2025");
    await selecionarOpcao("select-periodos-escolares-0", "INTEGRAL");
    fireEvent.click(screen.getByTestId("weekly-dias-semana-0-1"));

    fireEvent.click(screen.getByTestId("btn-salvar"));

    await waitFor(() => {
      expect(
        screen.getByText("Erro ao cadastrar dias letivos"),
      ).toBeInTheDocument();
    });
  });

  it("Deve limpar os campos ao clicar em Limpar", async () => {
    await selecionarOpcao("select-lotes", "SA - 1");

    const selectWrapper = screen.getByTestId("select-lotes");

    fireEvent.click(screen.getByTestId("btn-limpar"));

    await waitFor(() => {
      expect(
        within(selectWrapper).getByText("Selecione os Lote(s)"),
      ).toBeInTheDocument();
    });
  });

  it("Deve voltar para tela anterior ao clicar em Cancelar", () => {
    fireEvent.click(screen.getByTestId("btn-cancelar"));
    expect(mockedUsedNavigate).toHaveBeenCalledWith(-1);
  });
});
