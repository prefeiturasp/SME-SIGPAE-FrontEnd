import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import HTTP_STATUS from "http-status-codes";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { combineReducers, createStore } from "redux";
import * as utilities from "src/helpers/utilities";
import * as logisticaService from "src/services/logistica.service";
import Filtros from "../components/Filtros";

jest.mock("src/services/logistica.service");
jest.mock("src/helpers/utilities");

const finalFormReducer = (state = {}, action: any) => {
  if (action.type === "final-form/UPDATE_FORM_STATE") {
    return { ...state, [action.payload.form]: action.payload.state };
  }
  return state;
};

const createTestStore = () =>
  createStore(combineReducers({ finalForm: finalFormReducer }));

describe("Filtros - Cadastro Notificacao", () => {
  const mockSetFiltros = jest.fn();
  const mockSetGuias = jest.fn();
  const mockSetGuiasVinculadas = jest.fn();
  const mockSetShowVinculadas = jest.fn();
  const mockSetNotificacaoIndex = jest.fn();

  const mockDistribuidores = {
    data: {
      results: [
        { nome_fantasia: "Distribuidor 1", uuid: "dist-1" },
        { nome_fantasia: "Distribuidor 2", uuid: "dist-2" },
      ],
    },
  };

  const mockNotificacao = {
    status: HTTP_STATUS.OK,
    data: {
      uuid: "notif-uuid",
      numero: "123",
      empresa: { uuid: "dist-1", nome: "Distribuidor 1" },
      guias_notificadas: [{ numero_guia: "G-1", uuid: "g1" }],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (utilities.gerarParametrosConsulta as jest.Mock).mockImplementation(
      (p) => p,
    );
    (logisticaService.getNomesDistribuidores as jest.Mock).mockResolvedValue(
      mockDistribuidores,
    );
  });

  const renderFiltros = async ({
    state = null,
    travaEmpresa = false,
    showVinculadas = false,
  }: {
    state?: any;
    travaEmpresa?: boolean;
    showVinculadas?: boolean;
  } = {}) => {
    const store = createTestStore();
    await act(async () => {
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={[{ pathname: "/", state }]}>
            <Filtros
              setFiltros={mockSetFiltros}
              setGuias={mockSetGuias}
              setGuiasVinculadas={mockSetGuiasVinculadas}
              travaEmpresa={travaEmpresa}
              showVinculadas={showVinculadas}
              setShowVinculadas={mockSetShowVinculadas}
              setNotificacaoIndex={mockSetNotificacaoIndex}
            />
          </MemoryRouter>
        </Provider>,
      );
    });
  };

  const getEmpresaSelect = () =>
    document.querySelector('select[data-cy="Empresa"]') as HTMLSelectElement;

  it("deve carregar distribuidores e renderizar campos iniciais", async () => {
    await renderFiltros();

    await waitFor(() => {
      expect(logisticaService.getNomesDistribuidores).toHaveBeenCalled();
    });

    expect(screen.getByRole("button", { name: "Consultar" })).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Limpar Filtros" }),
    ).toBeInTheDocument();
  });

  it("deve carregar dados da notificação quando houver state no location", async () => {
    (
      logisticaService.getNotificacoesOcorrenciaByUuid as jest.Mock
    ).mockResolvedValue(mockNotificacao);

    await renderFiltros({ state: { guia: { uuid: "guia-789" } } });

    await waitFor(() => {
      expect(
        logisticaService.getNotificacoesOcorrenciaByUuid,
      ).toHaveBeenCalledWith("guia-789");
      expect(mockSetNotificacaoIndex).toHaveBeenCalledWith(
        mockNotificacao.data,
      );
      expect(mockSetGuiasVinculadas).toHaveBeenCalledWith(
        mockNotificacao.data.guias_notificadas,
      );
      expect(mockSetFiltros).toHaveBeenCalledWith({
        empresa: "dist-1",
        notificacao_uuid: "notif-uuid",
      });
    });
  });

  it("deve exibir erro ao falhar carregamento da notificação", async () => {
    (
      logisticaService.getNotificacoesOcorrenciaByUuid as jest.Mock
    ).mockResolvedValue({
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    });

    await renderFiltros({ state: { guia: { uuid: "guia-erro" } } });

    await waitFor(() => {
      expect(
        screen.getByText(
          "Erro ao carregar Notificação da Guia. Tente novamente mais tarde",
        ),
      ).toBeInTheDocument();
    });
  });

  it("deve submeter filtros ao selecionar empresa e clicar em consultar", async () => {
    await renderFiltros();

    await waitFor(() => {
      expect(getEmpresaSelect()).toBeInTheDocument();
    });

    fireEvent.change(getEmpresaSelect(), { target: { value: "dist-2" } });

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Consultar" }),
      ).not.toBeDisabled();
    });

    fireEvent.click(screen.getByRole("button", { name: "Consultar" }));

    await waitFor(() => {
      expect(mockSetFiltros).toHaveBeenCalledWith(
        expect.objectContaining({ empresa: "dist-2" }),
      );
    });
  });

  it("deve limpar filtros ao clicar no botão Limpar Filtros", async () => {
    await renderFiltros();

    await waitFor(() => {
      expect(getEmpresaSelect()).toBeInTheDocument();
    });

    fireEvent.change(getEmpresaSelect(), { target: { value: "dist-1" } });

    fireEvent.click(screen.getByRole("button", { name: "Limpar Filtros" }));

    expect(mockSetShowVinculadas).toHaveBeenCalledWith(false);
    expect(mockSetGuias).toHaveBeenCalledWith(undefined);
  });

  it("deve esconder botão Limpar Filtros quando travaEmpresa for true", async () => {
    await renderFiltros({ travaEmpresa: true });

    await waitFor(() => {
      expect(getEmpresaSelect()).toBeInTheDocument();
    });

    expect(
      screen.queryByRole("button", { name: "Limpar Filtros" }),
    ).not.toBeInTheDocument();
  });
});
