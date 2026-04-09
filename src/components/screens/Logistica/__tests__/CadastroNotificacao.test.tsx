import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import HTTP_STATUS from "http-status-codes";
import { MemoryRouter } from "react-router-dom";
import * as toastDialogs from "src/components/Shareable/Toast/dialogs";
import * as utilities from "src/helpers/utilities";
import * as logisticaService from "src/services/logistica.service";
import GuiasNotificacoes from "../CadastroNotificacao/index";

const mockNavigate = jest.fn();

jest.mock("src/helpers/utilities");
jest.mock("src/services/logistica.service");
jest.mock("src/components/Shareable/Toast/dialogs");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../CadastroNotificacao/components/Filtros", () => (props) => (
  <div>
    <button onClick={() => props.setFiltros({ empresa: "Empresa X" })}>
      aplicar-filtro
    </button>
    <button
      onClick={() =>
        props.setNotificacaoIndex({
          uuid: "notif-1",
          numero: "123",
          status: "RASCUNHO",
        })
      }
    >
      definir-notificacao
    </button>
    <button onClick={() => props.setShowVinculadas(true)}>
      mostrar-vinculadas
    </button>
  </div>
));

jest.mock("src/components/Logistica/DetalheGuiaRemessa", () => () => (
  <div>detalhe-guia</div>
));

describe("CadastroNotificacao", () => {
  const mockGerarParametros = utilities.gerarParametrosConsulta;
  const mockGetGuiasNaoNotificadas = logisticaService.getGuiasNaoNotificadas;
  const mockGetGuiaDetalhe = logisticaService.getGuiaDetalhe;
  const mockCriarNotificacao = logisticaService.criarNotificacao;
  const mockEditarNotificacao = logisticaService.editarNotificacao;
  const mockImprimirGuia = logisticaService.imprimirGuiaRemessa;
  const mockToastError = toastDialogs.toastError;

  const guia1 = {
    uuid: "g1",
    numero_guia: "001",
    nome_distribuidor: "Dist A",
    data_entrega: "01/01/2025",
    status: "OK",
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockGerarParametros.mockImplementation((p) => p);

    mockGetGuiasNaoNotificadas.mockResolvedValue({
      data: {
        count: 1,
        results: [guia1],
      },
    });

    mockGetGuiaDetalhe.mockResolvedValue({
      data: guia1,
    });

    mockCriarNotificacao.mockResolvedValue({
      status: HTTP_STATUS.CREATED,
    });

    mockEditarNotificacao.mockResolvedValue({
      status: HTTP_STATUS.OK,
    });

    mockImprimirGuia.mockResolvedValue({});
  });

  const renderComponent = async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <GuiasNotificacoes />
        </MemoryRouter>,
      );
    });
  };

  it("deve tratar erro ao buscar detalhe", async () => {
    mockGetGuiaDetalhe.mockRejectedValue({
      response: { data: { detail: "erro detalhe" } },
    });

    await renderComponent();
    fireEvent.click(screen.getByText("aplicar-filtro"));

    await waitFor(() => {
      expect(screen.getByText("001")).toBeInTheDocument();
    });

    fireEvent.click(document.querySelector(".fa-eye"));

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith("erro detalhe");
    });
  });

  it("deve tratar erro ao baixar PDF", async () => {
    mockImprimirGuia.mockRejectedValue({
      response: {
        data: {
          text: () => Promise.resolve("erro pdf"),
        },
      },
    });

    await renderComponent();
    fireEvent.click(screen.getByText("aplicar-filtro"));

    await waitFor(() => {
      expect(screen.getByText("001")).toBeInTheDocument();
    });

    fireEvent.click(document.querySelector(".fa-eye"));

    await waitFor(() => {
      expect(screen.getByText("Baixar PDF da Guia")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Baixar PDF da Guia"));

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith("erro pdf");
    });
  });

  it("deve salvar nova notificação", async () => {
    await renderComponent();

    fireEvent.click(screen.getByText("aplicar-filtro"));

    await waitFor(() => {
      expect(screen.getByText("001")).toBeInTheDocument();
    });

    fireEvent.click(document.querySelector(".fa-plus"));

    fireEvent.click(screen.getByText("Salvar Rascunho"));

    await waitFor(() => {
      expect(mockCriarNotificacao).toHaveBeenCalledWith({
        empresa: "Empresa X",
        guias: ["g1"],
      });
    });

    expect(mockNavigate).toHaveBeenCalled();
  });

  it("deve editar notificação existente", async () => {
    await renderComponent();

    fireEvent.click(screen.getByText("definir-notificacao"));
    fireEvent.click(screen.getByText("aplicar-filtro"));

    await waitFor(() => {
      expect(screen.getByText("001")).toBeInTheDocument();
    });

    fireEvent.click(document.querySelector(".fa-plus"));
    fireEvent.click(screen.getByText("Salvar Rascunho"));

    await waitFor(() => {
      expect(mockEditarNotificacao).toHaveBeenCalledWith("notif-1", {
        empresa: "Empresa X",
        guias: ["g1"],
      });
    });
  });

  it("deve usar lista local quando showVinculadas=true", async () => {
    await renderComponent();

    fireEvent.click(screen.getByText("aplicar-filtro"));

    await waitFor(() => {
      expect(screen.getByText("001")).toBeInTheDocument();
    });

    fireEvent.click(document.querySelector(".fa-plus"));
    fireEvent.click(screen.getByText("mostrar-vinculadas"));
    fireEvent.click(screen.getByText("aplicar-filtro"));

    // não chama API novamente
    expect(mockGetGuiasNaoNotificadas).toHaveBeenCalledTimes(1);

    expect(screen.getByText("001")).toBeInTheDocument();
  });
});
