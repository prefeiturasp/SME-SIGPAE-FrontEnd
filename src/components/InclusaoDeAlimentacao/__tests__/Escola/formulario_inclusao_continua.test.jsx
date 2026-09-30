import "@testing-library/jest-dom";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { Container } from "src/components/InclusaoDeAlimentacao/Escola/Formulario/componentes/Container";
import { PERFIL, TIPO_SOLICITACAO } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockCreateInclusaoContinua } from "src/mocks/InclusaoAlimentacao/mockCreateInclusaoContinua";
import { mockInicioPedidoInclusaoContinua } from "src/mocks/InclusaoAlimentacao/mockInicioPedidoInclusaoContinua";
import { mockMinhasSolicitacoesInclusaoContinua } from "src/mocks/InclusaoAlimentacao/mockMinhasSolicitacoesInclusaoContinua";
import { mockMotivoInclusaoEspecifico } from "src/mocks/InclusaoAlimentacao/mockMotivoInclusaoEspecifico";
import { mockMotivosInclusaoContinua } from "src/mocks/InclusaoAlimentacao/mockMotivosInclusaoContinua";
import { mockMotivosInclusaoNormal } from "src/mocks/InclusaoAlimentacao/mockMotivosInclusaoNormal";
import { mockPeriodosEscolaresNoite } from "src/mocks/InclusaoAlimentacao/mockPeriodosEscolaresNoite";
import { mockQuantidadeAlunosPorPeriodo } from "src/mocks/InclusaoAlimentacao/mockQuantidadeAlunosPorPeriodo";
import { mockMatriculadosProgramas } from "src/mocks/InclusaoAlimentacao/mockMatriculadosProgramas";
import { mockTiposAlimentacao } from "src/mocks/InclusaoAlimentacao/mockTiposAlimentacao";
import { mockDiasUteis } from "src/mocks/diasUseisMock";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosEscolaEMEFPericles } from "src/mocks/meusDados/escolaEMEFPericles";
import {
  getTiposDeAlimentacao,
  getVinculosTipoAlimentacaoMotivoInclusaoEspecifico,
  getVinculosTipoAlimentacaoPorEscola,
} from "src/services/cadastroTipoAlimentacao.service";
import { filtrarAlunosMatriculados } from "src/services/alunosMatriculados.service";
import { getDiasUteis } from "src/services/diasUteis.service";
import {
  buscaPeriodosEscolares,
  getQuantidaDeAlunosPorPeriodoEEscola,
} from "src/services/escola.service";
import {
  createInclusaoAlimentacao,
  getMotivosInclusaoContinua,
  getMotivosInclusaoNormal,
  iniciaFluxoInclusaoAlimentacao,
  obterMinhasSolicitacoesDeInclusaoDeAlimentacao,
  updateInclusaoAlimentacao,
} from "src/services/inclusaoDeAlimentacao";
import { toastError } from "src/components/Shareable/Toast/dialogs";

jest.mock("src/services/cadastroTipoAlimentacao.service");
jest.mock("src/services/escola.service");
jest.mock("src/services/alunosMatriculados.service");
jest.mock("src/services/diasUteis.service");
jest.mock("src/services/inclusaoDeAlimentacao");
jest.mock("src/components/Shareable/Toast/dialogs", () => ({
  toastError: jest.fn(),
  toastSuccess: jest.fn(),
}));
jest.mock("src/components/Shareable/CKEditorField", () => {
  const React = require("react");
  return {
    __esModule: true,
    default: ({ input }) => (
      <textarea
        data-testid="ckeditor-mock"
        name="observacoes"
        value={input?.value || ""}
        onChange={(e) => input?.onChange?.(e.target.value)}
      />
    ),
  };
});

const UUID_MANHA = "5067e137-e5f3-4876-a63f-7f58cce93f33";
const UUID_TARDE = "20bd9ca9-d499-456a-bd86-fb8f297947d6";
const UUID_LANCHE = "5d1304c8-77a8-4c96-badb-dd2e8c1b76d5";
const UUID_LANCHE_4H = "83fefd96-e476-42a0-81fc-75b9853b726c";
const REFEICAO_E_SOBREMESA = "Refeição e Sobremesa";

const UUID_MOTIVO_CONTINUOS = mockMotivosInclusaoContinua.results.find(
  (motivo) => motivo.nome === "Programas/Projetos Contínuos",
).uuid;
const UUID_MOTIVO_ESPECIFICOS = mockMotivosInclusaoContinua.results.find(
  (motivo) => motivo.nome === "Programas/Projetos Específicos",
).uuid;

const mockMatriculadosComOutrosTipos = {
  results: [
    ...mockMatriculadosProgramas.results,
    {
      periodo_escolar: {
        nome: "INTEGRAL",
        uuid: "e17e2405-36be-4981-a09c-35c89ae0f8b7",
      },
      quantidade_alunos: null,
      tipo_turma: "PROGRAMAS",
    },
  ],
};

const mockVinculosComLanche4hTarde = {
  count: 2,
  next: null,
  previous: null,
  results: [
    {
      uuid: "8782a32d-fb93-474f-82a3-175fcf3d3b5c",
      tipo_unidade_escolar: { iniciais: "EMEF" },
      periodo_escolar: { nome: "MANHA", uuid: UUID_MANHA },
      tipos_alimentacao: [
        { nome: "Lanche", uuid: UUID_LANCHE, posicao: 2 },
        {
          nome: "Refeição",
          uuid: "65f11f11-630b-4629-bb17-07c875c548f1",
          posicao: 2,
        },
        {
          nome: "Sobremesa",
          uuid: "5aa2c32b-1df2-46b6-b2e7-514b885fa9a4",
          posicao: 4,
        },
      ],
    },
    {
      uuid: "ab5ce087-1dc0-4cac-ab1b-92c0bf262ede",
      tipo_unidade_escolar: { iniciais: "EMEF" },
      periodo_escolar: { nome: "TARDE", uuid: UUID_TARDE },
      tipos_alimentacao: [
        { nome: "Lanche 4h", uuid: UUID_LANCHE_4H, posicao: 1 },
        { nome: "Lanche", uuid: UUID_LANCHE, posicao: 2 },
        {
          nome: "Refeição",
          uuid: "65f11f11-630b-4629-bb17-07c875c548f1",
          posicao: 2,
        },
        {
          nome: "Sobremesa",
          uuid: "5aa2c32b-1df2-46b6-b2e7-514b885fa9a4",
          posicao: 4,
        },
      ],
    },
  ],
};

const awaitServices = async () => {
  await waitFor(() => {
    expect(getDiasUteis).toHaveBeenCalled();
    expect(getMotivosInclusaoNormal).toHaveBeenCalled();
    expect(getMotivosInclusaoContinua).toHaveBeenCalled();
    expect(buscaPeriodosEscolares).toHaveBeenCalled();
    expect(getQuantidaDeAlunosPorPeriodoEEscola).toHaveBeenCalled();
    expect(getVinculosTipoAlimentacaoPorEscola).toHaveBeenCalled();
    expect(filtrarAlunosMatriculados).toHaveBeenCalled();
    expect(
      getVinculosTipoAlimentacaoMotivoInclusaoEspecifico,
    ).toHaveBeenCalled();
  });
};

const renderContainer = async () => {
  await act(async () => {
    render(
      <MeusDadosContext.Provider
        value={{ meusDados: mockMeusDadosEscolaEMEFPericles }}
      >
        <Container />
      </MeusDadosContext.Provider>,
    );
  });
};

const selecionaMotivo = (uuid) => {
  const selectElement = screen
    .getByTestId("select-motivo-0")
    .querySelector("select");
  fireEvent.change(selectElement, { target: { value: uuid } });
};

const preencheDatas = async () => {
  const divDataInicial = screen.getByTestId("data-inicial-div");
  const inputDataInicial = divDataInicial.querySelector("input");
  fireEvent.change(inputDataInicial, { target: { value: "30/01/2025" } });

  const divDataFinal = screen.getByTestId("data-final-div");
  const inputDataFinal = divDataFinal.querySelector("input");
  fireEvent.change(inputDataFinal, { target: { value: "01/12/2025" } });

  await waitFor(() => {
    expect(getTiposDeAlimentacao).toHaveBeenCalled();
  });

  expect(screen.getByText("Recorrência e detalhes")).toBeInTheDocument();
};

const clicarDia = (indice) => {
  fireEvent.click(screen.getByTestId(`dias-semana-${indice}`));
};

const selecionaPeriodo = (uuid) => {
  const selectElement = screen
    .getByTestId("div-select-periodo-escolar")
    .querySelector("select");
  fireEvent.change(selectElement, { target: { value: uuid } });
};

const selecionaTipoAlimentacao = (valor) => {
  const selectElement = screen
    .getByTestId("div-select-tipo-alimentacao")
    .querySelector("select");
  fireEvent.change(selectElement, { target: { value: valor } });
};

const preencheNumeroAlunos = async (numero) => {
  const inputElement = screen
    .getByTestId("numero-alunos")
    .querySelector("input");
  await act(async () => {
    fireEvent.change(inputElement, { target: { value: numero } });
  });
  await act(async () => {
    fireEvent.blur(inputElement);
  });
};

const adicionaRecorrencia = async () => {
  const botao = screen.getByTestId("botao-adicionar-recorrencia");
  await act(async () => {
    fireEvent.click(botao);
  });
};

const setupInclusaoContinua = async (numeroAlunos = 10) => {
  selecionaMotivo(UUID_MOTIVO_CONTINUOS);

  expect(screen.getByText("De")).toBeInTheDocument();
  expect(screen.getByText("Até")).toBeInTheDocument();

  await preencheDatas();

  const spanDomingo = screen.getByTestId("dias-semana-0");
  fireEvent.click(spanDomingo);
  fireEvent.click(spanDomingo);
  fireEvent.click(spanDomingo);

  selecionaPeriodo(UUID_MANHA);

  expect(screen.getByText("Lanche 4h")).toBeInTheDocument();
  expect(screen.getByText("Lanche")).toBeInTheDocument();
  expect(screen.getByText("Refeição")).toBeInTheDocument();
  expect(screen.getByText("Sobremesa")).toBeInTheDocument();
  expect(screen.getByText(REFEICAO_E_SOBREMESA)).toBeInTheDocument();

  selecionaTipoAlimentacao(REFEICAO_E_SOBREMESA);

  await preencheNumeroAlunos(numeroAlunos);

  await adicionaRecorrencia();

  await waitFor(() => {
    expect(screen.getByText("Refeição, Sobremesa")).toBeInTheDocument();
  });
};

const linhaDaTabela = (indice) => {
  return document.querySelectorAll("table tbody tr")[indice];
};

describe("Teste Formulário Inclusão de Alimentação", () => {
  beforeEach(async () => {
    getMotivosInclusaoNormal.mockResolvedValue({
      data: mockMotivosInclusaoNormal,
      status: 200,
    });
    getMotivosInclusaoContinua.mockResolvedValue({
      data: mockMotivosInclusaoContinua,
      status: 200,
    });
    buscaPeriodosEscolares.mockResolvedValue({
      data: mockPeriodosEscolaresNoite,
      status: 200,
    });
    getQuantidaDeAlunosPorPeriodoEEscola.mockResolvedValue({
      data: mockQuantidadeAlunosPorPeriodo,
      status: 200,
    });
    filtrarAlunosMatriculados.mockResolvedValue({
      data: mockMatriculadosComOutrosTipos,
      status: 200,
    });
    getVinculosTipoAlimentacaoPorEscola.mockResolvedValue({
      data: mockVinculosComLanche4hTarde,
      status: 200,
    });
    getVinculosTipoAlimentacaoMotivoInclusaoEspecifico.mockResolvedValue({
      data: mockMotivoInclusaoEspecifico,
      status: 200,
    });
    getDiasUteis.mockResolvedValue({
      data: mockDiasUteis,
      status: 200,
    });
    obterMinhasSolicitacoesDeInclusaoDeAlimentacao.mockImplementation(
      (tipo) => {
        if (tipo === TIPO_SOLICITACAO.SOLICITACAO_NORMAL) {
          return Promise.resolve({
            data: { results: [] },
            status: 200,
          });
        }
        if (tipo === TIPO_SOLICITACAO.SOLICITACAO_CONTINUA) {
          return Promise.resolve({
            data: mockMinhasSolicitacoesInclusaoContinua,
            status: 200,
          });
        }
        return Promise.resolve({
          data: { results: [] },
          status: 500,
        });
      },
    );
    getTiposDeAlimentacao.mockResolvedValue({
      data: mockTiposAlimentacao,
      status: 200,
    });
    createInclusaoAlimentacao.mockResolvedValue({
      data: mockCreateInclusaoContinua,
      status: 201,
    });
    updateInclusaoAlimentacao.mockResolvedValue({
      data: mockCreateInclusaoContinua,
      status: 200,
    });
    iniciaFluxoInclusaoAlimentacao.mockResolvedValue({
      data: mockInicioPedidoInclusaoContinua,
      status: 200,
    });

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem(
      "nome_instituicao",
      `"EMEF PERICLES EUGENIO DA SILVA RAMOS"`,
    );
    localStorage.setItem("perfil", PERFIL.DIRETOR_UE);

    toastError.mockClear();

    await renderContainer();
  });

  it("renderiza bloco com número de matriculados", async () => {
    await awaitServices();
    expect(screen.getByText("Nº de Matriculados")).toBeInTheDocument();
    expect(screen.getByText("524")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Informação automática disponibilizada pelo Cadastro da Unidade Escolar",
      ),
    ).toBeInTheDocument();
  });

  it("renderiza bloco `Rascunhos`", async () => {
    await awaitServices();
    expect(screen.getByText("Rascunhos")).toBeInTheDocument();
    expect(
      screen.getByText("Inclusão de Alimentação # 12CDB"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Programas/Projetos Contínuos - (12/02/2025 - 27/02/2025)",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Criado em: 27/01/2025 16:34:09"),
    ).toBeInTheDocument();
  });

  it("valida número de alunos para Programas Contínuos", async () => {
    await awaitServices();
    selecionaMotivo(UUID_MOTIVO_CONTINUOS);

    await waitFor(() => {
      expect(screen.getByText("Recorrência e detalhes")).toBeInTheDocument();
    });

    fireEvent.change(
      screen.getByTestId("data-inicial-div").querySelector("input"),
      { target: { value: "30/01/2025" } },
    );

    fireEvent.change(
      screen.getByTestId("data-final-div").querySelector("input"),
      { target: { value: "01/12/2025" } },
    );

    await waitFor(() => {
      expect(getTiposDeAlimentacao).toHaveBeenCalled();
    });

    fireEvent.click(screen.getByTestId("dias-semana-0"));

    fireEvent.change(
      screen.getByTestId("div-select-periodo-escolar").querySelector("select"),
      {
        target: {
          value: UUID_MANHA,
        },
      },
    );

    fireEvent.change(
      screen.getByTestId("div-select-tipo-alimentacao").querySelector("select"),
      {
        target: { value: REFEICAO_E_SOBREMESA },
      },
    );

    const inputNumeroAlunos = screen
      .getByTestId("numero-alunos")
      .querySelector("input");

    await act(async () => {
      fireEvent.change(inputNumeroAlunos, {
        target: { value: "55" },
      });
    });

    await act(async () => {
      fireEvent.blur(inputNumeroAlunos);
    });

    await waitFor(() => {
      expect(screen.getByText("Não pode ser maior que 25")).toBeInTheDocument();
    });
  });

  it("renderiza label `Motivo`", async () => {
    await awaitServices();
    expect(screen.getByText("Motivo")).toBeInTheDocument();
  });

  it("exibe erro ao adicionar recorrência sem preencher campos obrigatórios", async () => {
    await awaitServices();
    selecionaMotivo(UUID_MOTIVO_CONTINUOS);
    await preencheDatas();

    await adicionaRecorrencia();

    expect(toastError).toHaveBeenCalledWith(
      "Necessário selecionar ao menos um dia na recorrência, período, um tipo de alimentação e adicionar o número de alunos para adicionar recorrência",
    );
  });

  it("exibe erro ao adicionar recorrência com número de alunos inválido", async () => {
    await awaitServices();
    selecionaMotivo(UUID_MOTIVO_CONTINUOS);
    await preencheDatas();

    clicarDia(0);
    selecionaPeriodo(UUID_MANHA);
    selecionaTipoAlimentacao(REFEICAO_E_SOBREMESA);
    await preencheNumeroAlunos(30);

    await adicionaRecorrencia();

    expect(toastError).toHaveBeenCalledWith("Número de alunos inválido");
  });

  it("adiciona recorrência com tipo de alimentação único e observação", async () => {
    await awaitServices();
    selecionaMotivo(UUID_MOTIVO_CONTINUOS);
    await preencheDatas();

    clicarDia(0);
    selecionaPeriodo(UUID_MANHA);
    selecionaTipoAlimentacao(UUID_LANCHE);
    await preencheNumeroAlunos(10);

    fireEvent.change(screen.getByTestId("ckeditor-mock"), {
      target: { value: "<p>observação teste</p>" },
    });

    await adicionaRecorrencia();

    await waitFor(() => {
      expect(screen.getByText("Lanche")).toBeInTheDocument();
    });
    expect(within(linhaDaTabela(0)).getByText("Lanche")).toBeInTheDocument();
  });

  it("detecta recorrência duplicada", async () => {
    await awaitServices();
    selecionaMotivo(UUID_MOTIVO_CONTINUOS);
    await preencheDatas();

    clicarDia(0);
    selecionaPeriodo(UUID_MANHA);
    selecionaTipoAlimentacao(REFEICAO_E_SOBREMESA);
    await preencheNumeroAlunos(10);
    await adicionaRecorrencia();

    await waitFor(() => {
      expect(screen.getByText("Refeição, Sobremesa")).toBeInTheDocument();
    });

    clicarDia(0);
    selecionaPeriodo(UUID_MANHA);
    selecionaTipoAlimentacao(REFEICAO_E_SOBREMESA);
    await preencheNumeroAlunos(10);
    await adicionaRecorrencia();

    expect(toastError).toHaveBeenCalledWith(
      "Esse tipo de Alimentação já foi selecionado para o mesmo período e dia da semana",
    );
  });

  it("adiciona múltiplas recorrências pelo fluxo de push", async () => {
    await awaitServices();
    selecionaMotivo(UUID_MOTIVO_CONTINUOS);
    await preencheDatas();

    clicarDia(0);
    selecionaPeriodo(UUID_MANHA);
    selecionaTipoAlimentacao(REFEICAO_E_SOBREMESA);
    await preencheNumeroAlunos(10);
    await adicionaRecorrencia();

    await waitFor(() => {
      expect(screen.getByText("Refeição, Sobremesa")).toBeInTheDocument();
    });

    clicarDia(0);
    selecionaPeriodo(UUID_MANHA);
    selecionaTipoAlimentacao(UUID_LANCHE);
    await preencheNumeroAlunos(8);
    await adicionaRecorrencia();

    clicarDia(0);
    selecionaPeriodo(UUID_TARDE);
    selecionaTipoAlimentacao(REFEICAO_E_SOBREMESA);
    await preencheNumeroAlunos(5);
    await adicionaRecorrencia();

    await waitFor(() => {
      expect(document.querySelectorAll("table tbody tr").length).toBe(3);
    });

    expect(within(linhaDaTabela(1)).getByText("MANHA")).toBeInTheDocument();
    expect(within(linhaDaTabela(2)).getByText("TARDE")).toBeInTheDocument();
    expect(
      within(linhaDaTabela(2)).getByText("Refeição, Sobremesa"),
    ).toBeInTheDocument();
  });

  it("usa a lista global de alimentações quando o período não possui o tipo selecionado", async () => {
    await awaitServices();
    selecionaMotivo(UUID_MOTIVO_CONTINUOS);
    await preencheDatas();

    clicarDia(0);
    selecionaPeriodo(UUID_MANHA);
    selecionaTipoAlimentacao(UUID_LANCHE_4H);
    await preencheNumeroAlunos(10);
    await adicionaRecorrencia();

    await waitFor(() => {
      expect(
        within(linhaDaTabela(0)).getByText("Lanche 4h"),
      ).toBeInTheDocument();
    });
  });

  it("mantém Lanche 4h nas opções quando o período já o possui", async () => {
    await awaitServices();
    selecionaMotivo(UUID_MOTIVO_CONTINUOS);
    await preencheDatas();

    selecionaPeriodo(UUID_TARDE);

    const selectTipo = screen
      .getByTestId("div-select-tipo-alimentacao")
      .querySelector("select");
    const opcoesLanche4h = Array.from(selectTipo.options).filter(
      (option) => option.textContent === "Lanche 4h",
    );

    expect(opcoesLanche4h.length).toBe(1);
    expect(opcoesLanche4h[0].value).toBe(UUID_LANCHE_4H);
  });

  it("remove recorrência mantendo as demais", async () => {
    await awaitServices();
    selecionaMotivo(UUID_MOTIVO_CONTINUOS);
    await preencheDatas();

    clicarDia(0);
    selecionaPeriodo(UUID_MANHA);
    selecionaTipoAlimentacao(REFEICAO_E_SOBREMESA);
    await preencheNumeroAlunos(10);
    await adicionaRecorrencia();

    await waitFor(() => {
      expect(screen.getByText("Refeição, Sobremesa")).toBeInTheDocument();
    });

    clicarDia(0);
    selecionaPeriodo(UUID_TARDE);
    selecionaTipoAlimentacao(UUID_LANCHE);
    await preencheNumeroAlunos(5);
    await adicionaRecorrencia();

    await waitFor(() => {
      expect(document.querySelectorAll("table tbody tr").length).toBe(2);
    });

    await act(async () => {
      fireEvent.click(linhaDaTabela(0).querySelector("button"));
    });

    await waitFor(() => {
      expect(document.querySelectorAll("table tbody tr").length).toBe(1);
    });
    expect(within(linhaDaTabela(0)).getByText("TARDE")).toBeInTheDocument();
  });

  it("remove a única recorrência adicionada", async () => {
    await awaitServices();
    selecionaMotivo(UUID_MOTIVO_CONTINUOS);
    await preencheDatas();

    clicarDia(0);
    selecionaPeriodo(UUID_MANHA);
    selecionaTipoAlimentacao(REFEICAO_E_SOBREMESA);
    await preencheNumeroAlunos(10);
    await adicionaRecorrencia();

    await waitFor(() => {
      expect(screen.getByText("Refeição, Sobremesa")).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(linhaDaTabela(0).querySelector("button"));
    });

    await waitFor(() => {
      expect(document.querySelector("table")).not.toBeInTheDocument();
    });
  });

  it("não renderiza recorrência quando getTiposDeAlimentacao falha", async () => {
    getTiposDeAlimentacao.mockResolvedValueOnce({
      data: { results: [] },
      status: 500,
    });

    await awaitServices();
    selecionaMotivo(UUID_MOTIVO_CONTINUOS);

    await waitFor(() => {
      expect(getTiposDeAlimentacao).toHaveBeenCalled();
    });

    const divDataInicial = screen.getByTestId("data-inicial-div");
    const inputDataInicial = divDataInicial.querySelector("input");
    fireEvent.change(inputDataInicial, { target: { value: "30/01/2025" } });

    const divDataFinal = screen.getByTestId("data-final-div");
    const inputDataFinal = divDataFinal.querySelector("input");
    fireEvent.change(inputDataFinal, { target: { value: "01/12/2025" } });

    await waitFor(() => {
      expect(
        screen.queryByText("Recorrência e detalhes"),
      ).not.toBeInTheDocument();
    });
  });

  it("renderiza tabela mesmo quando getTiposDeAlimentacao falha na tabela", async () => {
    getTiposDeAlimentacao
      .mockResolvedValueOnce({
        data: mockTiposAlimentacao,
        status: 200,
      })
      .mockResolvedValueOnce({
        data: { results: [] },
        status: 500,
      });

    await awaitServices();
    selecionaMotivo(UUID_MOTIVO_CONTINUOS);
    await preencheDatas();

    clicarDia(0);
    selecionaPeriodo(UUID_MANHA);
    selecionaTipoAlimentacao(REFEICAO_E_SOBREMESA);
    await preencheNumeroAlunos(10);
    await adicionaRecorrencia();

    await waitFor(() => {
      expect(
        within(linhaDaTabela(0)).getByText("Refeição, Sobremesa"),
      ).toBeInTheDocument();
    });
  });

  it("adiciona recorrência para motivo específico", async () => {
    await awaitServices();
    selecionaMotivo(UUID_MOTIVO_ESPECIFICOS);
    await preencheDatas();

    clicarDia(0);
    selecionaPeriodo(UUID_MANHA);
    selecionaTipoAlimentacao(UUID_LANCHE);
    await preencheNumeroAlunos(5);
    await adicionaRecorrencia();

    await waitFor(() => {
      expect(within(linhaDaTabela(0)).getByText("Lanche")).toBeInTheDocument();
    });
  });

  it("considera recorrência sem número de alunos no cálculo de programas", async () => {
    cleanup();

    const mockRascunhoContinuaSemNumero = {
      count: 1,
      next: null,
      previous: null,
      results: [
        {
          prioridade: "REGULAR",
          motivo: {
            nome: "Programas/Projetos Contínuos",
            uuid: UUID_MOTIVO_CONTINUOS,
          },
          quantidades_periodo: [
            {
              periodo_escolar: {
                tipos_alimentacao: [{ nome: "Lanche", uuid: UUID_LANCHE }],
                possui_alunos_regulares: null,
                nome: "MANHA",
                uuid: "ce7f3cb2-a216-4931-a04a-43dbcf690a84",
                posicao: null,
                tipo_turno: 1,
              },
              tipos_alimentacao: [{ uuid: UUID_LANCHE, nome: "Lanche" }],
              uuid: "566e4fd8-71eb-4a2b-a424-192d7de533e6",
              dias_semana: [0],
              cancelado: false,
              cancelado_justificativa: "",
              cancelado_em: null,
              numero_alunos: null,
              observacao: "",
              cancelado_por: null,
              grupo_inclusao_normal: null,
              inclusao_alimentacao_continua: 2817,
            },
          ],
          escola: { nome: "EMEF PERICLES EUGENIO DA SILVA RAMOS" },
          logs: [],
          id_externo: "SEMNUM",
          rastro_terceirizada: null,
          solicitacoes_similares: [],
          descricao: "",
          criado_em: "27/01/2025 16:34:09",
          data_inicial: "12/02/2025",
          data_final: "27/02/2025",
          uuid: "semnumbc-2499-4df1-83fb-33ba4cc1028e",
          foi_solicitado_fora_do_prazo: false,
          terceirizada_conferiu_gestao: false,
          status: "RASCUNHO",
          outro_motivo: "",
          criado_por: 16363,
          rastro_escola: null,
          rastro_dre: null,
          rastro_lote: null,
        },
      ],
    };

    obterMinhasSolicitacoesDeInclusaoDeAlimentacao.mockImplementation(
      (tipo) => {
        if (tipo === TIPO_SOLICITACAO.SOLICITACAO_NORMAL) {
          return Promise.resolve({
            data: { results: [] },
            status: 200,
          });
        }
        if (tipo === TIPO_SOLICITACAO.SOLICITACAO_CONTINUA) {
          return Promise.resolve({
            data: mockRascunhoContinuaSemNumero,
            status: 200,
          });
        }
        return Promise.resolve({
          data: { results: [] },
          status: 500,
        });
      },
    );

    await renderContainer();
    await awaitServices();

    const botaoCarregarRascunho = screen.getByTestId("rascunho-SEMNUM");
    await act(async () => {
      fireEvent.click(botaoCarregarRascunho);
    });

    await waitFor(() => {
      expect(screen.getByText("Solicitação # SEMNUM")).toBeInTheDocument();
    });

    selecionaPeriodo(UUID_MANHA);
    clicarDia(0);

    await waitFor(() => {
      expect(document.querySelector("table")).toBeInTheDocument();
    });
    expect(within(linhaDaTabela(0)).getByText("Lanche")).toBeInTheDocument();
  });

  it("envia inclusão de alimentação continua com sucesso", async () => {
    await awaitServices();
    await setupInclusaoContinua();
    const botaoEnviarSolicitacao = screen.getByTestId("botao-enviar-inclusao");
    await act(async () => {
      fireEvent.click(botaoEnviarSolicitacao);
    });
  });

  it("salva rascunho com sucesso", async () => {
    await awaitServices();
    await setupInclusaoContinua();
    const botaoSalvarRascunho = screen.getByTestId("botao-salvar-rascunho");
    await act(async () => {
      fireEvent.click(botaoSalvarRascunho);
    });
  });

  it("carrega rascunho e atualiza", async () => {
    await awaitServices();
    const botaoCarregarRascunho = screen.getByTestId("rascunho-12CDB");
    await act(async () => {
      fireEvent.click(botaoCarregarRascunho);
    });

    await waitFor(() => {
      expect(screen.getByText("Solicitação # 12CDB")).toBeInTheDocument();
    });

    const botaoSalvarRascunho = screen.getByTestId("botao-salvar-rascunho");
    await act(async () => {
      fireEvent.click(botaoSalvarRascunho);
    });
  });
});
