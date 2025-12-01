import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockStateConferenciaLancamentosSemLancamentosCEUJulho2025 } from "src/mocks/medicaoInicial/ConferenciaDeLancamentos/states/stateConferenciaLancamentosSemLancamentosCEUJulho2025";
import { mockMeusDadosCogestor } from "src/mocks/meusDados/cogestor";
import { mockVinculosTipoAlimentacaoPeriodoEscolarCEU } from "src/mocks/services/cadastroTipoAlimentacao.service/CEUGESTAO/vinculosTipoAlimentacaoPeriodoEscolar";
import { mockSolicitacaoMedicaoInicialSemLancamentoCEU } from "src/mocks/services/medicaoInicial/solicitacaoMedicaoinicial.service/CEUGESTAO/solicitacaoMedicaoInicialSemLancamento";
import { ConferenciaDosLancamentosPage } from "src/pages/LancamentoMedicaoInicial/ConferenciaDosLancamentosPage";
import mock from "src/services/_mock";

describe("Teste Conferência de Lançamentos - Usuário DRE - Solicitação correção no formulário sem ocorrência", () => {
  const escolaUuid = mockSolicitacaoMedicaoInicialSemLancamentoCEU.escola_uuid;

  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCogestor);
    mock
      .onGet(
        "/medicao-inicial/solicitacao-medicao-inicial/periodos-grupos-medicao/",
      )
      .reply(200, { results: [] });
    mock
      .onGet(
        `/medicao-inicial/solicitacao-medicao-inicial/${mockSolicitacaoMedicaoInicialSemLancamentoCEU.uuid}/`,
      )
      .reply(200, mockSolicitacaoMedicaoInicialSemLancamentoCEU);
    mock
      .onGet("/medicao-inicial/medicao/feriados-no-mes-com-nome/")
      .reply(200, {
        results: [
          { dia: "09", feriado: "Revolução Constitucionalista de 1932" },
        ],
      });
    mock.onGet("/dias-calendario/").reply(200, []);
    mock
      .onGet("/medicao-inicial/dias-sobremesa-doce/lista-dias/")
      .reply(200, []);
    mock
      .onGet(
        `/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/${escolaUuid}/`,
      )
      .reply(200, mockVinculosTipoAlimentacaoPeriodoEscolarCEU);
    mock
      .onGet(
        "/vinculos-tipo-alimentacao-u-e-periodo-escolar/vinculos-inclusoes-evento-especifico-autorizadas/",
      )
      .reply(200, []);

    const search = `?uuid=${mockSolicitacaoMedicaoInicialSemLancamentoCEU.uuid}`;
    Object.defineProperty(window, "location", {
      value: { search },
    });

    Object.defineProperty(global, "localStorage", { value: localStorageMock });

    localStorage.setItem("tipo_perfil", TIPO_PERFIL.DIRETORIA_REGIONAL);
    localStorage.setItem("perfil", PERFIL.COGESTOR_DRE);

    await act(async () => {
      render(
        <MemoryRouter
          initialEntries={[
            {
              pathname: "/",
              state: mockStateConferenciaLancamentosSemLancamentosCEUJulho2025,
            },
          ]}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <ConferenciaDosLancamentosPage />
        </MemoryRouter>,
      );
    });
  });

  it("Renderiza botão `Solicitar correção no formulário`", async () => {
    const span = screen.getByText("Solicitar correção no formulário");
    const botao = span.closest("button");

    expect(botao).toBeInTheDocument();
    expect(botao).toBeEnabled();
  });
});
