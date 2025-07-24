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
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockRascunhosInclusaoAlimentacaoCEMEIMotivoEspecifico } from "src/mocks/InclusaoAlimentacao/CEMEI/rascunhosEspecifico";
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

describe("Teste Formulário Inclusão de Alimentação - motivo específico - Escola CEMEI", () => {
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
      .reply(200, mockRascunhosInclusaoAlimentacaoCEMEIMotivoEspecifico);
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
      screen.getByText("Inclusão de Alimentação # B922B")
    ).toBeInTheDocument();
    expect(screen.getByText("2 dia(s)")).toBeInTheDocument();
    expect(
      screen.getByText("Criado em: 11/07/2025 17:59:44")
    ).toBeInTheDocument();
  });

  const setMotivoValueEventoEspecifico = (id) => {
    const selectMotivo = screen.getByTestId(`select-motivo-${id}`);
    const selectElement = selectMotivo.querySelector("select");
    const uuidMotivoEventoEspecifico = mockMotivosInclusaoNormal.results.find(
      (motivo) => motivo.nome === "Evento Específico"
    ).uuid;
    fireEvent.change(selectElement, {
      target: { value: uuidMotivoEventoEspecifico },
    });
  };

  const setupInclusaoEventoEspecifico = async () => {
    await setMotivoValueEventoEspecifico(0);
    const divDia = screen.getByTestId("data-motivo-normal-0");
    const inputElement = divDia.querySelector("input");
    fireEvent.change(inputElement, {
      target: { value: "31/07/2025" },
    });
    const textarea = screen.getByTestId("textarea-descricao-do-evento-0");
    fireEvent.change(textarea, {
      target: { value: "Bolo" },
    });

    const botaoAdicionarDia = screen
      .getByText("Adicionar dia")
      .closest("button");
    fireEvent.click(botaoAdicionarDia);

    await setMotivoValueEventoEspecifico(1);
    const divDia1 = screen.getByTestId("data-motivo-normal-1");
    const inputElement1 = divDia1.querySelector("input");
    fireEvent.change(inputElement1, {
      target: { value: "01/08/2025" },
    });
    const textarea1 = screen.getByTestId("textarea-descricao-do-evento-1");
    fireEvent.change(textarea1, {
      target: { value: "Piquenique" },
    });

    expect(screen.getByText("INTEGRAL")).toBeInTheDocument();

    const divCheckboxINTEGRAL = screen.getByTestId("div-checkbox-INTEGRAL");
    const spanElement = divCheckboxINTEGRAL.querySelector("span");

    await act(async () => {
      fireEvent.click(spanElement);
    });

    const selectTiposAlimentacaoEMEI = screen.getByTestId(
      "select-tipos-alimentacao"
    );
    const selectControl = within(selectTiposAlimentacaoEMEI).getByRole(
      "combobox"
    );
    fireEvent.mouseDown(selectControl);

    const optionLanche = screen.getByText("Lanche");
    fireEvent.click(optionLanche);

    const divInputAlunosEMEI = screen.getByTestId(
      "quantidades_periodo[0].alunos_emei"
    );
    const inputElementAlunosEMEI = divInputAlunosEMEI.querySelector("input");
    fireEvent.change(inputElementAlunosEMEI, {
      target: { value: "1" },
    });
  };

  it("Salva rascunho inclusão de alimentação CEMEI com sucesso", async () => {
    mock.onPost("/inclusao-alimentacao-cemei/").reply(201, {});
    await setupInclusaoEventoEspecifico();
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

  it("Carrega rascunho e envia", async () => {
    expect(screen.queryByText("INTEGRAL")).not.toBeInTheDocument();

    const botaoCarregarRascunho = screen.getByTestId("botao-carregar-rascunho");
    await act(async () => {
      fireEvent.click(botaoCarregarRascunho);
    });

    await waitFor(() => {
      expect(screen.getByText("Solicitação # B922B")).toBeInTheDocument();
      expect(screen.getByText("INTEGRAL")).toBeInTheDocument();
    });

    const divDia = screen.getByTestId("data-motivo-normal-0");
    const inputElement = divDia.querySelector("input");
    expect(inputElement).toHaveAttribute("value", "30/07/2025");

    mock
      .onPut(
        `/inclusao-alimentacao-cemei/${mockRascunhosInclusaoAlimentacaoCEMEIMotivoEspecifico.results[0].uuid}/`
      )
      .reply(200, {});
    mock
      .onPatch(
        `/inclusao-alimentacao-cemei/${mockRascunhosInclusaoAlimentacaoCEMEIMotivoEspecifico.results[0].uuid}/inicio-pedido/`
      )
      .reply(200, {});

    const botaoEnviar = screen.getByText("Enviar inclusão").closest("button");
    fireEvent.click(botaoEnviar);

    await waitFor(() => {
      expect(
        screen.getByText("Inclusão de Alimentação enviada com sucesso!")
      ).toBeInTheDocument();
    });
  });
});
