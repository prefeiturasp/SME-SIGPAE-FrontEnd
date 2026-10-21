import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { localStorageMock } from "src/mocks/localStorageMock";
import { PERFIL, TIPO_PERFIL, TIPO_SERVICO } from "src/constants/shared";
import { mockListaInformacoesNutricionais } from "src/mocks/produto.service/mockGetInformacoesNutricionaisOrdenadas";
import { mockEmpresa } from "src/mocks/terceirizada.service/mockGetTerceirizadaUUID";
import { mockMeusDadosFornecedor } from "src/mocks/services/perfil.service/mockMeusDados";
import { mockFichaTecnicaComDetalhe } from "src/mocks/services/fichaTecnica.service/mockGetFichaTecnicaComAnalise";
import DetalharFichaTecnicaPage from "src/pages/PreRecebimento/FichaTecnica/DetalharFichaTecnicaPage";
import mock from "src/services/_mock";
import {
  CRIAR_COPIA_FICHA_TECNICA,
  PRE_RECEBIMENTO,
} from "src/configs/constants";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const fichaAprovada = {
  ...mockFichaTecnicaComDetalhe,
  status: "Aprovada",
};

const configurarLocalStorage = (perfil: string, tipoServico = "") => {
  Object.defineProperty(global, "localStorage", { value: localStorageMock });
  localStorage.clear();
  localStorage.setItem("tipo_perfil", TIPO_PERFIL.PRE_RECEBIMENTO);
  localStorage.setItem("perfil", perfil);
  if (tipoServico) {
    localStorage.setItem("tipo_servico", tipoServico);
  }
  localStorage.setItem("meusDados", JSON.stringify(mockMeusDadosFornecedor));
};

const setup = async () => {
  window.history.pushState({}, "", `?uuid=${fichaAprovada.uuid}`);

  await act(async () => {
    render(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <MeusDadosContext.Provider
          value={{
            meusDados: mockMeusDadosFornecedor,
            setMeusDados: jest.fn(),
          }}
        >
          <DetalharFichaTecnicaPage />
        </MeusDadosContext.Provider>
      </MemoryRouter>,
    );
  });

  await screen.findByText("Identificação do Produto");
};

function mockarCarregamento() {
  mock.reset();

  mock.onGet("/api-version/").reply(200, {});
  mock.onGet("/notificacoes/").reply(200, {
    next: null,
    previous: null,
    count: 0,
    page_size: 4,
    results: [],
  });
  mock
    .onGet("/notificacoes/quantidade-nao-lidos/")
    .reply(200, { quantidade_nao_lidos: 0 });

  mock
    .onGet(`/informacoes-nutricionais/ordenadas/`)
    .reply(200, mockListaInformacoesNutricionais);
  mock
    .onGet(`/terceirizadas/${fichaAprovada.empresa.uuid}/`)
    .reply(200, mockEmpresa);
  mock
    .onGet(`/ficha-tecnica/${fichaAprovada.uuid}/detalhar-com-analise/`)
    .reply(200, fichaAprovada);
}

describe("DetalharFichaTecnicaPage - Criar Cópia", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockarCarregamento();
  });

  it("exibe o botão Criar Cópia para ficha aprovada de fornecedor", async () => {
    configurarLocalStorage(
      PERFIL.ADMINISTRADOR_EMPRESA,
      TIPO_SERVICO.FORNECEDOR,
    );

    await setup();

    expect(screen.getByText("Criar Cópia")).toBeInTheDocument();
  });

  it("não exibe o botão Criar Cópia para perfil de visualização", async () => {
    configurarLocalStorage(PERFIL.DILOG_VISUALIZACAO);

    await setup();

    expect(screen.queryByText("Criar Cópia")).not.toBeInTheDocument();
  });

  it("mantém o usuário na tela ao cancelar a cópia", async () => {
    configurarLocalStorage(
      PERFIL.ADMINISTRADOR_EMPRESA,
      TIPO_SERVICO.FORNECEDOR,
    );

    await setup();

    fireEvent.click(
      screen.getByText("Criar Cópia").closest("button") as HTMLElement,
    );
    expect(screen.getByText("Copiar Ficha Técnica")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Não" }) as HTMLElement);

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("navega para a tela de cópia ao confirmar", async () => {
    configurarLocalStorage(
      PERFIL.ADMINISTRADOR_EMPRESA,
      TIPO_SERVICO.FORNECEDOR,
    );

    await setup();

    fireEvent.click(
      screen.getByText("Criar Cópia").closest("button") as HTMLElement,
    );
    fireEvent.click(
      screen.getByText("Sim, Criar Cópia").closest("button") as HTMLElement,
    );

    expect(mockNavigate).toHaveBeenCalledWith(
      `/${PRE_RECEBIMENTO}/${CRIAR_COPIA_FICHA_TECNICA}?uuid=${fichaAprovada.uuid}`,
    );
  });
});
