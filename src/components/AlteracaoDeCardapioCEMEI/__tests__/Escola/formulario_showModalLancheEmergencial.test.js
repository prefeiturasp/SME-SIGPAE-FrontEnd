import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "constants/shared";
import { MeusDadosContext } from "context/MeusDadosContext";
import { mockDiasUteis } from "mocks/diasUseisMock";
import { localStorageMock } from "mocks/localStorageMock";
import { mockMeusDadosEscolaCEMEI } from "mocks/meusDados/escola/CEMEI";
import { mockMotivosAlteracaoCardapio } from "mocks/services/alteracaoCardapio.service/motivosAlteracaoCardapio";
import { mockQuantidadeAlunoCEMEIporCEIEMEI } from "mocks/services/aluno.service/CEMEI/quantidadeAlunoCEMEIporCEIEMEI";
import { mockGetVinculosTipoAlimentacaoPorEscolaCEMEI } from "mocks/services/cadastroTipoAlimentacao.service/CEMEI/vinculosTipoAlimentacaoPeriodoEscolar";
import { AlteracaoDeCardapioCEMEIPage } from "pages/Escola/AlteracaoDeCardapioCEMEIPage";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import mock from "services/_mock";

describe("Teste Formulário Alteração de Cardápio - Modal Lanche Emergencial - CEMEI", () => {
  const escolaUuid = mockMeusDadosEscolaCEMEI.vinculo_atual.instituicao.uuid;

  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosEscolaCEMEI);
    mock
      .onGet("/motivos-alteracao-cardapio/")
      .reply(200, mockMotivosAlteracaoCardapio);
    mock.onGet("/dias-uteis/").reply(200, mockDiasUteis);
    mock
      .onGet("/alunos/quantidade-cemei-por-cei-emei/")
      .reply(200, mockQuantidadeAlunoCEMEIporCEIEMEI);
    mock
      .onGet(
        `/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/${escolaUuid}/`
      )
      .reply(200, mockGetVinculosTipoAlimentacaoPorEscolaCEMEI);
    mock.onGet("/alteracoes-cardapio-cemei/").reply(200, []);
    mock
      .onPost("/alteracoes-cardapio-cemei/")
      .reply(201, { uuid: "475907b7-0b66-436d-a624-e18bffe65eb3" });

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("nome_instituicao", `"CEMEI SUZANA CAMPOS TAUIL"`);
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);
    localStorage.setItem("perfil", PERFIL.DIRETOR_UE);
    localStorage.setItem("modulo_gestao", MODULO_GESTAO.TERCEIRIZADA);
    localStorage.setItem("eh_cemei", "true");

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
              meusDados: mockMeusDadosEscolaCEMEI,
              setMeusDados: jest.fn(),
            }}
          >
            <AlteracaoDeCardapioCEMEIPage />
            <ToastContainer />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      );
    });
  });

  const selecionaAlunosCEI = () => {
    const selectAlunosDiv = screen.getByTestId(
      "div-select-alunos-cei-e-ou-emei"
    );
    const selectElementAlunos = selectAlunosDiv.querySelector("select");
    fireEvent.change(selectElementAlunos, {
      target: { value: "CEI" },
    });
  };

  const selecionaMotivoLancheEmergencial = () => {
    const selectMotivoDiv = screen.getByTestId("div-select-motivo");
    const selectElementMotivo = selectMotivoDiv.querySelector("select");
    const uuidLancheEmergencial = mockMotivosAlteracaoCardapio.results.find(
      (motivo) => motivo.nome.includes("Lanche Emergencial")
    ).uuid;
    fireEvent.change(selectElementMotivo, {
      target: { value: uuidLancheEmergencial },
    });
  };

  it("Testa Alteração - Motivo Lanche Emergencial - exibe modal lanche emergencial", async () => {
    expect(
      screen.queryByText(
        "O lanche emergencial somente é previsto para os alunos da EMEI da CEMEI."
      )
    ).not.toBeInTheDocument();

    selecionaAlunosCEI();
    selecionaMotivoLancheEmergencial();

    expect(
      screen.queryByText(
        "O lanche emergencial somente é previsto para os alunos da EMEI da CEMEI."
      )
    ).toBeInTheDocument();

    const botaoOK = screen.getByText("OK").closest("button");
    fireEvent.click(botaoOK);

    await waitFor(() => {
      expect(
        screen.queryByText(
          "O lanche emergencial somente é previsto para os alunos da EMEI da CEMEI."
        )
      ).not.toBeInTheDocument();
    });
  });
});
