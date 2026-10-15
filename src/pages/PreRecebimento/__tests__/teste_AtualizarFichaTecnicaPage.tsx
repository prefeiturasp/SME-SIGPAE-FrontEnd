import React from "react";
import {
  render,
  screen,
  act,
  waitFor,
  fireEvent,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockListaUnidadesMedidaLogistica } from "src/mocks/cronograma.service/mockGetUnidadesDeMedidaLogistica";
import { mockListaFabricantes } from "src/mocks/produto.service/mockGetNomesFabricantes";
import { mockListaInformacoesNutricionais } from "src/mocks/produto.service/mockGetInformacoesNutricionaisOrdenadas";
import { mockEmpresa2 } from "src/mocks/terceirizada.service/mockGetTerceirizadaUUID";
import { mockMeusDadosFornecedor } from "src/mocks/services/perfil.service/mockMeusDados";
import { mockFichaTecnicaComDetalhe } from "src/mocks/services/fichaTecnica.service/mockGetFichaTecnicaComAnalise";
import AtualizarFichaTecnicaPage from "src/pages/PreRecebimento/FichaTecnica/AtualizarFichaTecnicaPage";
import mock from "src/services/_mock";
import {
  getNotificacoes,
  getQtdNaoLidas,
} from "src/services/notificacoes.service";
import { mockGetNotificacoes } from "src/mocks/services/notificacoes.service/mockGetNotificacoes";
import { mockGetQtdNaoLidas } from "src/mocks/services/notificacoes.service/mockGetQtdNaoLidas";
import { PERFIL, TIPO_SERVICO } from "src/constants/shared";
import { ATUALIZAR_FICHA_TECNICA } from "src/configs/constants";

jest.mock("src/services/notificacoes.service");

const UUID = mockFichaTecnicaComDetalhe.uuid;

const mocksDeCarregamento = () => {
  const mockPdfBlob = new Blob(["mocked PDF content"], {
    type: "application/pdf",
  });

  mock
    .onGet(`/unidades-medida-logistica/lista-nomes-abreviacoes/`)
    .reply(200, mockListaUnidadesMedidaLogistica);
  mock
    .onGet(`/informacoes-nutricionais/ordenadas/`)
    .reply(200, mockListaInformacoesNutricionais);
  mock.onGet(`/fabricantes/lista-nomes/`).reply(200, mockListaFabricantes);
  mock.onGet(new RegExp("^/terceirizadas/.*")).reply(200, mockEmpresa2);
  mock.onGet(new RegExp(".*/media/.*\\.pdf$")).reply(200, mockPdfBlob);
  mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosFornecedor);
};

const setup = async () => {
  window.history.pushState({}, "", `?uuid=${UUID}`);

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
          <AtualizarFichaTecnicaPage />
        </MeusDadosContext.Provider>
      </MemoryRouter>,
    );
  });
};

const getRotaAtualizar = () => {
  let rota;
  jest.isolateModules(() => {
    const { rotasPreRecebimento } = require("src/configs/rotas/preRecebimento");
    rota = rotasPreRecebimento.find((r: { path: string }) =>
      r.path.endsWith(`/${ATUALIZAR_FICHA_TECNICA}/`),
    );
  });
  return rota;
};

describe("AtualizarFichaTecnicaPage", () => {
  beforeEach(() => {
    mock.reset();
    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.clear();
    mocksDeCarregamento();

    (getNotificacoes as jest.Mock).mockResolvedValue({
      data: mockGetNotificacoes,
      status: 200,
    });
    (getQtdNaoLidas as jest.Mock).mockResolvedValue({
      data: mockGetQtdNaoLidas,
      status: 200,
    });
  });

  it("carrega e renderiza a ficha técnica para atualização", async () => {
    mock
      .onGet(`/ficha-tecnica/${UUID}/detalhar-com-analise/`)
      .reply(200, mockFichaTecnicaComDetalhe);

    await setup();

    await waitFor(() =>
      expect(screen.queryByText("Carregando...")).not.toBeInTheDocument(),
    );

    expect(screen.getByText("Ficha Técnica FT016")).toBeInTheDocument();
    expect(screen.getByText("Salvar e Enviar")).toBeInTheDocument();
  });

  it("abre o modal de voltar ao clicar em Voltar", async () => {
    mock
      .onGet(`/ficha-tecnica/${UUID}/detalhar-com-analise/`)
      .reply(200, mockFichaTecnicaComDetalhe);

    await setup();
    await waitFor(() =>
      expect(screen.queryByText("Carregando...")).not.toBeInTheDocument(),
    );

    const botoesVoltar = screen.getAllByText("Voltar");
    fireEvent.click(botoesVoltar[botoesVoltar.length - 1]);

    expect(
      screen.getByText("Deseja voltar para a tela anterior?"),
    ).toBeInTheDocument();
  });

  it("remove o arquivo pré-carregado ao clicar em remover", async () => {
    mock
      .onGet(`/ficha-tecnica/${UUID}/detalhar-com-analise/`)
      .reply(200, mockFichaTecnicaComDetalhe);

    await setup();
    await waitFor(() =>
      expect(screen.queryByText("Carregando...")).not.toBeInTheDocument(),
    );

    fireEvent.click(screen.getByTestId("delete-file-0"));

    expect(screen.queryByTestId("delete-file-0")).not.toBeInTheDocument();
  });

  it("libera acesso à rota para a empresa fornecedora", () => {
    localStorage.setItem("perfil", PERFIL.ADMINISTRADOR_EMPRESA);
    localStorage.setItem("tipo_servico", TIPO_SERVICO.FORNECEDOR);

    expect(getRotaAtualizar().tipoUsuario).toBe(true);
  });

  it("bloqueia acesso à rota para perfil não fornecedor (DILOG_QUALIDADE)", () => {
    localStorage.setItem("perfil", PERFIL.DILOG_QUALIDADE);

    expect(getRotaAtualizar().tipoUsuario).toBe(false);
  });
});
