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
import { mockSolicitacaoKitLancheUnificadoRascunho } from "src/mocks/SolicitacaoUnificada/Relatorio/solicitacaoKitLancheUnificadoRascunho";
import { mockKitLanche } from "src/mocks/SolicitacaokitLanche/mockKitLanche";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosCogestor } from "src/mocks/meusDados/cogestor";
import { mockGetEscolaTercTotal } from "src/mocks/services/escola.service/mockGetEscolasTercTotal";
import { SolicitacaoUnificadaPage } from "src/pages/DRE/SolicitacaoUnificadaPage";
import mock from "src/services/_mock";

describe("Formulário Solicitação Unificada - DRE", () => {
  const solicitacaoUnificada =
    mockSolicitacaoKitLancheUnificadoRascunho.results[0];
  const solicitacaoUnificadaUuid = solicitacaoUnificada.uuid;

  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCogestor);
    mock.onGet("/kit-lanches/").reply(200, mockKitLanche);
    mock.onGet("/dias-uteis/").reply(200, {
      proximos_cinco_dias_uteis: "2025-04-22",
      proximos_dois_dias_uteis: "2025-04-16",
    });
    mock
      .onGet("/escolas-simplissima-com-dre-unpaginated/terc-total/")
      .reply(200, mockGetEscolaTercTotal);
    mock
      .onGet("/solicitacoes-kit-lanche-unificada/minhas-solicitacoes/")
      .reply(200, mockSolicitacaoKitLancheUnificadoRascunho);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.DIRETORIA_REGIONAL);
    localStorage.setItem("perfil", PERFIL.COGESTOR_DRE);

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
              meusDados: mockMeusDadosCogestor,
              setMeusDados: jest.fn(),
            }}
          >
            <SolicitacaoUnificadaPage />
            <ToastContainer />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });
  });

  it("Deve renderizar título e breadcrumb `Solicitação Unificada`", () => {
    expect(screen.queryAllByText("Solicitação Unificada")).toHaveLength(2);
  });

  it("Deve renderizar o bloco de matriculados", () => {
    expect(screen.getAllByText("Matriculados")).toHaveLength(2);
    expect(screen.getByText("Terceirizada Total")).toBeInTheDocument();
    expect(screen.getByText("Rede Parceira")).toBeInTheDocument();
    expect(screen.getByText(/informação automática/i)).toBeInTheDocument();
  });

  it("Preenche e envia formulário de solicitação unificada", async () => {
    const divDataPasseio = screen.getByTestId("div-input-data-passeio");
    const inputElement = divDataPasseio.querySelector("input");
    fireEvent.change(inputElement, {
      target: { value: "28/01/2026" },
    });

    const divLocalPasseio = screen.getByTestId("div-input-local-passeio");
    const inputLocalPasseio = divLocalPasseio.querySelector("input");
    fireEvent.change(inputLocalPasseio, {
      target: { value: "Parque Ibirapuera" },
    });

    const divInputEvento = screen.getByTestId("div-input-evento");
    const inputEvento = divInputEvento.querySelector("input");
    fireEvent.change(inputEvento, {
      target: { value: "Passeio Cultural" },
    });

    const selectUnidadesEscolares = screen.getByTestId(
      "select-unidades-escolares",
    );
    const selectControl = within(selectUnidadesEscolares).getByRole("combobox");
    fireEvent.mouseDown(selectControl);
    const EMEISENAMADUREIRA = screen.getByText("000558 - EMEI SENA MADUREIRA");
    fireEvent.click(EMEISENAMADUREIRA);

    await waitFor(() => {
      expect(
        screen.queryAllByText("000558 - EMEI SENA MADUREIRA"),
      ).toHaveLength(2);
    });

    const botaoExpandirDetalhes = screen.getByTestId(
      "botao-toggle-detalhes-escola-0",
    );
    fireEvent.click(botaoExpandirDetalhes);

    const divInputNmrAlunos = screen.getByTestId("div-input-nmr-alunos-0");
    const inputNmrAlunos = divInputNmrAlunos.querySelector("input");
    fireEvent.change(inputNmrAlunos, {
      target: { value: "25" },
    });

    const inputTempoPrevisto = screen.getByTestId(
      "radio-tempo-previsto-ate-4-horas-0",
    );
    fireEvent.click(inputTempoPrevisto);

    const inputKit0Escola0 = screen.getByTestId("checkbox-kit-0-escola-0");
    fireEvent.click(inputKit0Escola0);

    const botaoSalvarRascunho = screen
      .getByText("Salvar Rascunho")
      .closest("button");
    fireEvent.click(botaoSalvarRascunho);

    mock.onPost("/solicitacoes-kit-lanche-unificada/").reply(201, {});

    await waitFor(() => {
      expect(
        screen.getByText("Solicitação Unificada salva com sucesso!"),
      ).toBeInTheDocument();
    });
  });

  it("Carrega rascunho e envia a solicitação unificada", async () => {
    const botaoCarregarRascunho = screen.getByTestId("botao-editar-rascunho-0");
    fireEvent.click(botaoCarregarRascunho);

    mock
      .onPut(`/solicitacoes-kit-lanche-unificada/${solicitacaoUnificadaUuid}/`)
      .reply(200, solicitacaoUnificada);

    mock
      .onPatch(
        `/solicitacoes-kit-lanche-unificada/${solicitacaoUnificadaUuid}/inicio-pedido/`,
      )
      .reply(200, {});

    const botaoEnviarSolicitacao = await screen
      .getByText("Enviar")
      .closest("button");
    fireEvent.click(botaoEnviarSolicitacao);

    await waitFor(() => {
      expect(
        screen.getByText("Solicitação Unificada enviada com sucesso!"),
      ).toBeInTheDocument();
    });
  });
});
