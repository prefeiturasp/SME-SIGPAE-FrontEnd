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
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockRascunhosInclusaoAlimentacaoCEMEI } from "src/mocks/InclusaoAlimentacao/CEMEI/rascunhos";
import { mockMotivosInclusaoContinua } from "src/mocks/InclusaoAlimentacao/mockMotivosInclusaoContinua";
import { mockMotivosInclusaoNormal } from "src/mocks/InclusaoAlimentacao/mockMotivosInclusaoNormal";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosEscolaCEMEI } from "src/mocks/meusDados/escola/CEMEI";
import { mockQuantidadeAlunoCEMEIporCEIEMEI } from "src/mocks/services/aluno.service/CEMEI/quantidadeAlunoCEMEIporCEIEMEI";
import { mockGetVinculosMotivoEspecificoCEMEI } from "src/mocks/services/cadastroTipoAlimentacao.service/CEMEI/vinculosMotivoEspecifico";
import { mockGetVinculosTipoAlimentacaoPorEscolaCEMEI } from "src/mocks/services/cadastroTipoAlimentacao.service/CEMEI/vinculosTipoAlimentacaoPeriodoEscolar";
import { mockQuantidadeAlunosPorPeriodoCEMEI } from "src/mocks/services/escola.service/CEMEI/quantidadeAlunosPorPeriodo";
import { InclusaoDeAlimentacaoCEMEIPage } from "src/pages/Escola/InclusaoDeAlimentacaoCEMEIPage";
import mock from "src/services/_mock";

const rascunhoSomenteCEI = {
  ...mockRascunhosInclusaoAlimentacaoCEMEI,
  results: [
    {
      ...mockRascunhosInclusaoAlimentacaoCEMEI.results[0],
      quantidade_alunos_emei_da_inclusao_cemei: [],
    },
  ],
};

describe("Teste Formulário Inclusão de Alimentação - rascunho somente CEI - Escola CEMEI", () => {
  const escolaUuid = mockMeusDadosEscolaCEMEI.vinculo_atual.instituicao.uuid;

  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosEscolaCEMEI);
    mock
      .onGet("/motivos-inclusao-normal/")
      .reply(200, mockMotivosInclusaoNormal);
    mock
      .onGet("/motivos-inclusao-continua/")
      .reply(200, mockMotivosInclusaoContinua);
    mock
      .onGet(`/quantidade-alunos-por-periodo/escola/${escolaUuid}/`)
      .reply(200, mockQuantidadeAlunosPorPeriodoCEMEI);
    mock
      .onGet("/alunos/quantidade-cemei-por-cei-emei/")
      .reply(200, mockQuantidadeAlunoCEMEIporCEIEMEI);
    mock
      .onGet(
        `/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/${escolaUuid}/`,
      )
      .reply(200, mockGetVinculosTipoAlimentacaoPorEscolaCEMEI);
    mock.onGet("/dias-uteis/").reply(200, {
      proximos_cinco_dias_uteis: "2025-07-16",
      proximos_dois_dias_uteis: "2025-07-14",
    });
    mock
      .onGet(
        "/vinculos-tipo-alimentacao-u-e-periodo-escolar/motivo_inclusao_especifico/",
      )
      .reply(200, mockGetVinculosMotivoEspecificoCEMEI);
    mock.onGet("/inclusao-alimentacao-cemei/").reply(200, rascunhoSomenteCEI);
    mock
      .onGet("/inclusoes-alimentacao-continua/minhas-solicitacoes/")
      .reply(200, { count: 0, next: null, previous: null, results: [] });

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
            <InclusaoDeAlimentacaoCEMEIPage />
            <ToastContainer />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });
  });

  it("Carrega rascunho somente CEI e define alunos como CEI", async () => {
    const botaoCarregarRascunho = screen.getByTestId("botao-carregar-rascunho");
    await act(async () => {
      fireEvent.click(botaoCarregarRascunho);
    });

    await waitFor(() => {
      expect(screen.getByText("Solicitação # 00FA3")).toBeInTheDocument();
    });

    const selectAlunosDiv = screen.getByTestId(
      "div-select-alunos-cei-e-ou-emei",
    );
    const selectElementAlunos = selectAlunosDiv.querySelector("select");
    expect(selectElementAlunos.value).toBe("CEI");

    expect(
      screen.queryByTestId("select-tipos-alimentacao"),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Alunos CEI")).toBeInTheDocument();
  });

  it("Salva rascunho de inclusão de alimentação CEMEI somente CEI com sucesso", async () => {
    mock.onPost("/inclusao-alimentacao-cemei/").reply(201, {});

    const selectMotivo = screen.getByTestId("select-motivo-0");
    const selectElement = selectMotivo.querySelector("select");
    const uuidMotivoReposicaoDeAula = mockMotivosInclusaoNormal.results.find(
      (motivo) => motivo.nome === "Reposição de aula",
    ).uuid;
    fireEvent.change(selectElement, {
      target: { value: uuidMotivoReposicaoDeAula },
    });

    const divDia = screen.getByTestId("data-motivo-normal-0");
    const inputElement = divDia.querySelector("input");
    fireEvent.change(inputElement, {
      target: { value: "31/07/2025" },
    });

    const selectAlunosDiv = screen.getByTestId(
      "div-select-alunos-cei-e-ou-emei",
    );
    const selectElementAlunos = selectAlunosDiv.querySelector("select");
    fireEvent.change(selectElementAlunos, {
      target: { value: "CEI" },
    });

    const divCheckboxINTEGRAL = screen.getByTestId("div-checkbox-INTEGRAL");
    const spanElement = divCheckboxINTEGRAL.querySelector("span");
    await act(async () => {
      fireEvent.click(spanElement);
    });

    const divInputFaixaEtaria0 = screen.getByTestId(
      "quantidades_periodo[0].faixas.0",
    );
    const inputElementQuantidade0 = divInputFaixaEtaria0.querySelector("input");
    fireEvent.change(inputElementQuantidade0, {
      target: { value: "1" },
    });

    const botaoSalvarRascunho = screen
      .getByText("Salvar rascunho")
      .closest("button");
    fireEvent.click(botaoSalvarRascunho);

    await waitFor(() => {
      expect(
        screen.getByText("Solicitação Rascunho criada com sucesso!"),
      ).toBeInTheDocument();
    });
  });
});
