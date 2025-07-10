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
import { mockRascunhosInclusaoAlimentacaoContinuaCEMEI } from "src/mocks/InclusaoAlimentacao/CEMEI/rascunhosContinua";
import { mockMotivosInclusaoContinua } from "src/mocks/InclusaoAlimentacao/mockMotivosInclusaoContinua";
import { mockMotivosInclusaoNormal } from "src/mocks/InclusaoAlimentacao/mockMotivosInclusaoNormal";
import { mockTiposAlimentacao } from "src/mocks/InclusaoAlimentacao/mockTiposAlimentacao";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosEscolaCEMEI } from "src/mocks/meusDados/escola/CEMEI";
import { mockQuantidadeAlunoCEMEIporCEIEMEI } from "src/mocks/services/aluno.service/CEMEI/quantidadeAlunoCEMEIporCEIEMEI";
import { mockGetVinculosMotivoEspecificoCEMEI } from "src/mocks/services/cadastroTipoAlimentacao.service/CEMEI/vinculosMotivoEspecifico";
import { mockGetVinculosTipoAlimentacaoPorEscolaCEMEI } from "src/mocks/services/cadastroTipoAlimentacao.service/CEMEI/vinculosTipoAlimentacaoPeriodoEscolar";
import { mockQuantidadeAlunosPorPeriodoCEMEI } from "src/mocks/services/escola.service/CEMEI/quantidadeAlunosPorPeriodo";
import { InclusaoDeAlimentacaoCEMEIPage } from "src/pages/Escola/InclusaoDeAlimentacaoCEMEIPage";
import mock from "src/services/_mock";

describe("Teste Formulário Inclusão de Alimentação Contínua - Escola CEMEI", () => {
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
        `/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/${escolaUuid}/`
      )
      .reply(200, mockGetVinculosTipoAlimentacaoPorEscolaCEMEI);
    mock.onGet("/dias-uteis/").reply(200, {
      proximos_cinco_dias_uteis: "2025-07-16",
      proximos_dois_dias_uteis: "2025-07-14",
    });
    mock
      .onGet(
        "/vinculos-tipo-alimentacao-u-e-periodo-escolar/motivo_inclusao_especifico/"
      )
      .reply(200, mockGetVinculosMotivoEspecificoCEMEI);
    mock
      .onGet("/inclusao-alimentacao-cemei/")
      .reply(200, { count: 0, next: null, previous: null, results: [] });
    mock
      .onGet("/inclusoes-alimentacao-continua/minhas-solicitacoes/")
      .reply(200, mockRascunhosInclusaoAlimentacaoContinuaCEMEI);
    mock.onGet("/tipos-alimentacao/").reply(200, mockTiposAlimentacao);

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
        </MemoryRouter>
      );
    });
  });

  it("renderiza título da página e o breadcrumb `Inclusão de Alimentação`", async () => {
    expect(screen.queryAllByText("Inclusão de Alimentação").length).toBe(2);
  });

  it("renderiza bloco com número de matriculados", async () => {
    expect(screen.getByText("Total de Matriculados")).toBeInTheDocument();
    expect(screen.getByText("187")).toBeInTheDocument();

    expect(screen.getByText("Matriculados CEI")).toBeInTheDocument();
    expect(screen.getByText("79")).toBeInTheDocument();

    expect(screen.getByText("Matriculados EMEI")).toBeInTheDocument();
    expect(screen.getByText("108")).toBeInTheDocument();

    expect(
      screen.getByText(
        "Informação automática disponibilizada pelo Cadastro da Unidade Escolar"
      )
    ).toBeInTheDocument();
  });

  it("renderiza bloco `Rascunhos`", async () => {
    expect(screen.getByText("Rascunhos")).toBeInTheDocument();
    expect(
      screen.getByText("Inclusão de Alimentação # CC1E6")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Programas/Projetos Contínuos - (29/07/2025 - 01/08/2025)"
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText("Criado em: 10/07/2025 14:56:52")
    ).toBeInTheDocument();
  });

  const setMotivoValueProgramasProjetos = () => {
    const selectMotivo = screen.getByTestId("select-motivo-0");
    const selectElement = selectMotivo.querySelector("select");
    const uuidMotivoProgramasProjetos =
      mockMotivosInclusaoContinua.results.find(
        (motivo) => motivo.nome === "Programas/Projetos Contínuos"
      ).uuid;
    fireEvent.change(selectElement, {
      target: { value: uuidMotivoProgramasProjetos },
    });
  };

  const setupInclusaoContinua = async () => {
    setMotivoValueProgramasProjetos();

    await waitFor(() => {
      expect(screen.getByText("Recorrência e detalhes")).toBeInTheDocument();
    });

    const divDataInicial = screen.getByTestId("data-inicial-div");
    const inputElementDataInicial = divDataInicial.querySelector("input");
    fireEvent.change(inputElementDataInicial, {
      target: { value: "22/07/2025" },
    });

    const divDataFinal = screen.getByTestId("data-final-div");
    const inputElementDataFinal = divDataFinal.querySelector("input");
    fireEvent.change(inputElementDataFinal, {
      target: { value: "31/07/2025" },
    });

    const spanSegunda = screen.getByTestId("dias-semana-1");
    fireEvent.click(spanSegunda);
    const spanTerca = screen.getByTestId("dias-semana-2");
    fireEvent.click(spanTerca);

    const divNumeroAlunos = screen.getByTestId("numero-alunos");
    const inputElementNumeroAlunos = divNumeroAlunos.querySelector("input");

    expect(inputElementNumeroAlunos).toBeDisabled();

    const selectPeriodoDiv = screen.getByTestId("div-select-periodo-escolar");
    const selectElement1 = selectPeriodoDiv.querySelector("select");
    const uuidINTEGRAL = "e17e2405-36be-4981-a09c-35c89ae0f8b7";
    fireEvent.change(selectElement1, {
      target: { value: uuidINTEGRAL },
    });

    await waitFor(() => {
      expect(inputElementNumeroAlunos).not.toBeDisabled();
    });

    const selectTipoAlimentacaoDiv = screen.getByTestId(
      "div-select-tipo-alimentacao"
    );
    const selectElementTipoAlimentacao =
      selectTipoAlimentacaoDiv.querySelector("select");
    fireEvent.change(selectElementTipoAlimentacao, {
      target: { value: "Refeição e Sobremesa" },
    });

    await act(async () => {
      fireEvent.change(inputElementNumeroAlunos, {
        target: { value: 100 },
      });
    });

    const botaoAdicionarRecorrencia = screen.getByTestId(
      "botao-adicionar-recorrencia"
    );
    await act(async () => {
      fireEvent.click(botaoAdicionarRecorrencia);
    });
  };

  it("Salva rascunho inclusão de alimentação contínua CEMEI com sucesso", async () => {
    mock.onPost("/inclusoes-alimentacao-continua/").reply(201, {});
    await setupInclusaoContinua();
    const botaoSalvarRascunho = screen
      .getByText("Salvar rascunho")
      .closest("button");
    fireEvent.click(botaoSalvarRascunho);

    await waitFor(() => {
      expect(
        screen.getByText("Solicitação Rascunho criada com sucesso!")
      ).toBeInTheDocument();
    });
  });
});
