import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockMotivosInclusaoNormal } from "src/mocks/InclusaoAlimentacao/mockMotivosInclusaoNormal";
import { mockDiasUteis } from "src/mocks/diasUseisMock";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosEscolaCEIcomMANHAeTARDE } from "src/mocks/meusDados/escola/CEIcomMANHAeTARDE";
import { mockVinculosTipoAlimentacaoPeriodoEscolarCEIComManhaTarde } from "src/mocks/services/cadastroTipoAlimentacao.service/CEI/vinculosTipoAlimentacaoPeriodoEscolarComManhaTarde";
import { mockQuantidadeAlunosFaixaEtariaEscolaCEIINTEGRAL } from "src/mocks/services/inclusaoDeAlimentacao/escola.service/CEI/quantidadeAlunosFaixaEtariaINTEGRAL";
import { mockQuantidadeAlunosFaixaEtariaEscolaCEIMANHA } from "src/mocks/services/inclusaoDeAlimentacao/escola.service/CEI/quantidadeAlunosFaixaEtariaMANHA";
import { mockQuantidadeAlunosFaixaEtariaEscolaCEITARDE } from "src/mocks/services/inclusaoDeAlimentacao/escola.service/CEI/quantidadeAlunosFaixaEtariaTARDE";
import { mockRascunhosInclusaoAlimentacaoEscolaCEIManhaETarde } from "src/mocks/services/inclusaoDeAlimentacao/escola.service/CEI/rascunhos";
import { MemoryRouter } from "react-router-dom";
import { InclusaoDeAlimentacaoCEIPage } from "src/pages/Escola/InclusaoDeAlimentacaoCEIPage";
import { ToastContainer } from "react-toastify";
import mock from "src/services/_mock";
import Container from "../Container";

const escolaUuid =
  mockMeusDadosEscolaCEIcomMANHAeTARDE.vinculo_atual.instituicao.uuid;
const hoje = new Date().toISOString().split("T")[0];
const rascunhoUuid =
  mockRascunhosInclusaoAlimentacaoEscolaCEIManhaETarde.results[0].uuid;

const periodosVinculos =
  mockVinculosTipoAlimentacaoPeriodoEscolarCEIComManhaTarde.results;

const setupLocalStorage = () => {
  Object.defineProperty(global, "localStorage", {
    value: localStorageMock,
    configurable: true,
  });
  localStorage.setItem("nome_instituicao", `"CEI DIRET NEIDE KETELHUT"`);
  localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);
  localStorage.setItem("perfil", PERFIL.DIRETOR_UE);
  localStorage.setItem("modulo_gestao", MODULO_GESTAO.TERCEIRIZADA);
  localStorage.setItem("eh_cei", "true");
};

const mocksBase = (meusDados = mockMeusDadosEscolaCEIcomMANHAeTARDE) => {
  mock.onGet("/usuarios/meus-dados/").reply(200, meusDados);
  mock.onGet("/motivos-inclusao-normal/").reply(200, mockMotivosInclusaoNormal);
  mock.onGet("/dias-uteis/").reply(200, mockDiasUteis);
  mock
    .onGet(
      `/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/${escolaUuid}/`,
    )
    .reply(200, mockVinculosTipoAlimentacaoPeriodoEscolarCEIComManhaTarde);
  mock
    .onGet("/inclusoes-alimentacao-da-cei/minhas-solicitacoes/")
    .reply(200, mockRascunhosInclusaoAlimentacaoEscolaCEIManhaETarde);
  mock
    .onPost("/inclusoes-alimentacao-da-cei/")
    .reply(201, { uuid: rascunhoUuid });
  mock
    .onPut(`/inclusoes-alimentacao-da-cei/${rascunhoUuid}/`)
    .reply(200, { uuid: rascunhoUuid });
  mock
    .onPatch(`/inclusoes-alimentacao-da-cei/${rascunhoUuid}/inicio-pedido/`)
    .reply(200, {});
  const mocksQuantidade = [
    mockQuantidadeAlunosFaixaEtariaEscolaCEIINTEGRAL,
    mockQuantidadeAlunosFaixaEtariaEscolaCEIMANHA,
    mockQuantidadeAlunosFaixaEtariaEscolaCEITARDE,
  ];
  periodosVinculos.forEach((vinculo, index) => {
    mock
      .onGet(
        `/quantidade-alunos-por-periodo/${vinculo.periodo_escolar.uuid}/alunos-por-faixa-etaria/${hoje}/`,
      )
      .reply(200, mocksQuantidade[index]);
  });
};

const renderPage = async (meusDados = mockMeusDadosEscolaCEIcomMANHAeTARDE) => {
  setupLocalStorage();
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
            meusDados,
            setMeusDados: jest.fn(),
          }}
        >
          <InclusaoDeAlimentacaoCEIPage />
          <ToastContainer />
        </MeusDadosContext.Provider>
      </MemoryRouter>,
    );
  });
};

const selecionaMotivo = (nome) => {
  const selectMotivoDiv = screen.getByTestId("div-select-motivo");
  const selectElementMotivo = selectMotivoDiv.querySelector("select");
  const uuidMotivo = mockMotivosInclusaoNormal.results.find((motivo) =>
    motivo.nome.includes(nome),
  ).uuid;
  fireEvent.change(selectElementMotivo, { target: { value: uuidMotivo } });
};

const preencheData = (data) => {
  const divDia = screen.getByTestId("data-motivo-normal-0");
  const inputElement = divDia.querySelector("input");
  fireEvent.change(inputElement, { target: { value: data } });
};

const marcaIntegralComQuantidade = async () => {
  fireEvent.click(screen.getByTestId("span-INTEGRAL"));
  await waitFor(() => {
    expect(screen.queryAllByText("INTEGRAL")).toHaveLength(2);
  });
  fireEvent.click(screen.getByTestId("span-dentro-INTEGRAL"));
  await waitFor(() => {
    expect(
      screen.getByText("Tipos de Alimentação do período integral:"),
    ).toBeInTheDocument();
  });
  fireEvent.change(
    screen.getByTestId(
      "periodos_e_faixas[0].periodos[0].faixas_etarias[0].quantidade_alunos",
    ),
    { target: { value: "1" } },
  );
};

const preencheFormularioMinimo = async () => {
  selecionaMotivo("Reposição de aula");
  preencheData("30/05/2025");
  await marcaIntegralComQuantidade();
};

const carregaRascunho = async () => {
  fireEvent.click(screen.getByTestId("botao-carregar-rascunho"));
  await waitFor(() => {
    expect(screen.getByText("Solicitação # A38E6")).toBeInTheDocument();
    expect(screen.getByText("Atualizar rascunho")).toBeInTheDocument();
  });
};

describe("Fluxos complementares Inclusão de Alimentação - CEI", () => {
  it("Container sem meusDados exibe loader", async () => {
    setupLocalStorage();
    mock
      .onGet("/motivos-inclusao-normal/")
      .reply(200, mockMotivosInclusaoNormal);
    await act(async () => {
      render(
        <MeusDadosContext.Provider
          value={{ meusDados: undefined, setMeusDados: jest.fn() }}
        >
          <Container />
        </MeusDadosContext.Provider>,
      );
    });
    expect(screen.getByText("Carregando...")).toBeInTheDocument();
  });

  it("cria solicitação e envia (POST + iniciarPedido)", async () => {
    mocksBase();
    await renderPage();

    await preencheFormularioMinimo();

    const botaoEnviar = screen.getByText("Enviar").closest("button");
    fireEvent.click(botaoEnviar);

    await waitFor(() => {
      expect(
        screen.getByText("Inclusão de Alimentação enviada com sucesso!"),
      ).toBeInTheDocument();
    });
  });

  it("exibe erro ao criar solicitação (POST 400)", async () => {
    mocksBase();
    mock
      .onPost("/inclusoes-alimentacao-da-cei/")
      .reply(400, { detail: "Erro ao criar inclusão" });
    await renderPage();

    await preencheFormularioMinimo();

    const botaoSalvarRascunho = screen
      .getByText("Salvar rascunho")
      .closest("button");
    fireEvent.click(botaoSalvarRascunho);

    await waitFor(() => {
      expect(screen.getByText("Erro ao criar inclusão")).toBeInTheDocument();
    });
  });

  it("atualiza rascunho com sucesso (PUT sem DRE_A_VALIDAR)", async () => {
    mocksBase();
    await renderPage();

    await carregaRascunho();

    const botaoAtualizarRascunho = screen
      .getByText("Atualizar rascunho")
      .closest("button");
    fireEvent.click(botaoAtualizarRascunho);

    await waitFor(() => {
      expect(
        screen.getByText("Rascunho atualizado com sucesso"),
      ).toBeInTheDocument();
    });
  });

  it("exibe erro ao atualizar rascunho (PUT 400)", async () => {
    mocksBase();
    mock
      .onPut(`/inclusoes-alimentacao-da-cei/${rascunhoUuid}/`)
      .reply(400, { detail: "Erro ao atualizar inclusão" });
    await renderPage();

    await carregaRascunho();

    const botaoAtualizarRascunho = screen
      .getByText("Atualizar rascunho")
      .closest("button");
    fireEvent.click(botaoAtualizarRascunho);

    await waitFor(() => {
      expect(
        screen.getByText("Erro ao atualizar inclusão"),
      ).toBeInTheDocument();
    });
  });

  it("exibe erro ao iniciar pedido (iniciarPedido 400)", async () => {
    mocksBase();
    mock
      .onPatch(`/inclusoes-alimentacao-da-cei/${rascunhoUuid}/inicio-pedido/`)
      .reply(400, { detail: "Erro ao iniciar pedido" });
    await renderPage();

    await carregaRascunho();

    const botaoEnviar = screen.getByText("Enviar").closest("button");
    fireEvent.click(botaoEnviar);

    await waitFor(() => {
      expect(screen.getByText("Erro ao iniciar pedido")).toBeInTheDocument();
    });
  });

  it("exibe erro ao carregar rascunhos", async () => {
    mocksBase();
    mock
      .onGet("/inclusoes-alimentacao-da-cei/minhas-solicitacoes/")
      .reply(400, { detail: "erro" });
    await renderPage();

    await waitFor(() => {
      expect(
        screen.getByText("Houve um erro ao carregar os rascunhos salvos"),
      ).toBeInTheDocument();
    });
  });

  it("abre e fecha modal de data prioritária", async () => {
    mocksBase();
    await renderPage();

    preencheData("30/01/2025");

    await waitFor(() => {
      expect(
        screen.getByText(
          "A solicitação está fora do prazo contratual de cinco dias úteis. Sendo assim, a autorização dependerá de confirmação por parte da empresa terceirizada.",
        ),
      ).toBeInTheDocument();
    });

    const botaoOK = screen.getByText("OK").closest("button");
    fireEvent.click(botaoOK);

    await waitFor(() => {
      expect(
        screen.queryByText(
          "A solicitação está fora do prazo contratual de cinco dias úteis. Sendo assim, a autorização dependerá de confirmação por parte da empresa terceirizada.",
        ),
      ).not.toBeInTheDocument();
    });
  });

  it("botão Cancelar reseta o formulário", async () => {
    mocksBase();
    await renderPage();

    await carregaRascunho();

    const botaoCancelar = screen.getByText("Cancelar").closest("button");
    fireEvent.click(botaoCancelar);

    await waitFor(() => {
      expect(screen.queryByText("Solicitação # A38E6")).not.toBeInTheDocument();
      expect(screen.getAllByText("Nova Solicitação").length).toBeGreaterThan(0);
    });
  });

  it("selecionar motivo `Outro` exibe campo de outro motivo", async () => {
    mocksBase();
    await renderPage();

    selecionaMotivo("Outro");

    await waitFor(() => {
      expect(screen.getByText("Qual o motivo?")).toBeInTheDocument();
    });
  });

  it("desmarcar INTEGRAL externo limpa as quantidades", async () => {
    mocksBase();
    await renderPage();

    await marcaIntegralComQuantidade();

    fireEvent.click(screen.getByTestId("span-INTEGRAL"));

    await waitFor(() => {
      expect(
        screen.queryByText("Tipos de Alimentação do período integral:"),
      ).not.toBeInTheDocument();
    });
  });

  it("desmarcar MANHA externo limpa as quantidades", async () => {
    mocksBase();
    await renderPage();

    selecionaMotivo("Reposição de aula");
    fireEvent.click(screen.getByTestId("span-MANHA"));
    await waitFor(() => {
      expect(
        screen.getByText("Tipos de Alimentação do período manha:"),
      ).toBeInTheDocument();
    });
    fireEvent.change(
      screen.getByTestId(
        "periodos_e_faixas[1].faixas_etarias[0].quantidade_alunos",
      ),
      { target: { value: "88" } },
    );

    fireEvent.click(screen.getByTestId("span-MANHA"));

    await waitFor(() => {
      expect(
        screen.queryByText("Tipos de Alimentação do período manha:"),
      ).not.toBeInTheDocument();
    });
  });

  it("desmarcar INTEGRAL interno limpa as quantidades", async () => {
    mocksBase();
    await renderPage();

    fireEvent.click(screen.getByTestId("span-INTEGRAL"));
    await waitFor(() => {
      expect(screen.queryAllByText("INTEGRAL")).toHaveLength(2);
    });
    fireEvent.click(screen.getByTestId("span-dentro-INTEGRAL"));
    await waitFor(() => {
      expect(
        screen.getByText("Tipos de Alimentação do período integral:"),
      ).toBeInTheDocument();
    });
    fireEvent.change(
      screen.getByTestId(
        "periodos_e_faixas[0].periodos[0].faixas_etarias[0].quantidade_alunos",
      ),
      { target: { value: "1" } },
    );

    fireEvent.click(screen.getByTestId("span-dentro-INTEGRAL"));

    await waitFor(() => {
      expect(
        screen.queryByText("Tipos de Alimentação do período integral:"),
      ).not.toBeInTheDocument();
    });
  });

  it("teclado seleciona períodos externos (Enter, Espaço e tecla neutra)", async () => {
    mocksBase();
    await renderPage();

    fireEvent.keyDown(screen.getByTestId("span-MANHA"), { key: "Enter" });
    await waitFor(() => {
      expect(
        screen.getByText("Tipos de Alimentação do período manha:"),
      ).toBeInTheDocument();
    });

    fireEvent.keyDown(screen.getByTestId("span-TARDE"), { key: " " });
    await waitFor(() => {
      expect(
        screen.getByText("Tipos de Alimentação do período tarde:"),
      ).toBeInTheDocument();
    });

    fireEvent.keyDown(screen.getByTestId("span-INTEGRAL"), { key: "Tab" });
    expect(screen.queryAllByText("INTEGRAL")).toHaveLength(1);
  });

  it("teclado seleciona períodos internos do INTEGRAL", async () => {
    mocksBase();
    await renderPage();

    fireEvent.click(screen.getByTestId("span-INTEGRAL"));
    await waitFor(() => {
      expect(screen.queryAllByText("INTEGRAL")).toHaveLength(2);
    });

    fireEvent.keyDown(screen.getByTestId("span-dentro-MANHA"), {
      key: "Enter",
    });
    await waitFor(() => {
      expect(
        screen.getByText("Tipos de Alimentação do período manha:"),
      ).toBeInTheDocument();
    });

    fireEvent.keyDown(screen.getByTestId("span-dentro-TARDE"), { key: " " });
    await waitFor(() => {
      expect(
        screen.getByText("Tipos de Alimentação do período tarde:"),
      ).toBeInTheDocument();
    });

    fireEvent.keyDown(screen.getByTestId("span-dentro-INTEGRAL"), {
      key: "Shift",
    });
    expect(screen.queryAllByText("INTEGRAL")).toHaveLength(2);
  });

  it("remove rascunho pela tecla Enter", async () => {
    mocksBase();
    mock
      .onDelete(`/inclusoes-alimentacao-da-cei/${rascunhoUuid}/`)
      .reply(204, {});
    window.confirm = jest.fn().mockImplementation(() => true);
    await renderPage();

    fireEvent.keyDown(screen.getByTestId("botao-remover-rascunho"), {
      key: "Enter",
    });

    await waitFor(() => {
      expect(
        screen.getByText("Rascunho # A38E6 excluído com sucesso"),
      ).toBeInTheDocument();
    });
  });

  it("remove rascunho pela tecla Espaço", async () => {
    mocksBase();
    mock
      .onDelete(`/inclusoes-alimentacao-da-cei/${rascunhoUuid}/`)
      .reply(204, {});
    window.confirm = jest.fn().mockImplementation(() => true);
    await renderPage();

    fireEvent.keyDown(screen.getByTestId("botao-remover-rascunho"), {
      key: " ",
    });

    await waitFor(() => {
      expect(
        screen.getByText("Rascunho # A38E6 excluído com sucesso"),
      ).toBeInTheDocument();
    });
  });

  it("tecla neutra no botão remover rascunho não faz nada", async () => {
    mocksBase();
    window.confirm = jest.fn();
    await renderPage();

    fireEvent.keyDown(screen.getByTestId("botao-remover-rascunho"), {
      key: "Tab",
    });

    expect(window.confirm).not.toHaveBeenCalled();
  });

  it("carrega rascunho pela tecla Enter", async () => {
    mocksBase();
    await renderPage();

    fireEvent.keyDown(screen.getByTestId("botao-carregar-rascunho"), {
      key: "Enter",
    });

    await waitFor(() => {
      expect(screen.getByText("Solicitação # A38E6")).toBeInTheDocument();
    });
  });

  it("carrega rascunho pela tecla Espaço", async () => {
    mocksBase();
    await renderPage();

    fireEvent.keyDown(screen.getByTestId("botao-carregar-rascunho"), {
      key: " ",
    });

    await waitFor(() => {
      expect(screen.getByText("Solicitação # A38E6")).toBeInTheDocument();
    });
  });

  it("tecla neutra no botão carregar rascunho não faz nada", async () => {
    mocksBase();
    await renderPage();

    fireEvent.keyDown(screen.getByTestId("botao-carregar-rascunho"), {
      key: "Tab",
    });

    expect(screen.queryByText("Solicitação # A38E6")).not.toBeInTheDocument();
  });

  it("renderiza faixa etária sem quantidade ao carregar rascunho", async () => {
    mocksBase();
    const manhaUuid = periodosVinculos.find(
      (v) => v.periodo_escolar.nome === "MANHA",
    ).periodo_escolar.uuid;
    mock
      .onGet(
        `/quantidade-alunos-por-periodo/${manhaUuid}/alunos-por-faixa-etaria/${hoje}/`,
      )
      .reply(200, {
        count: 2,
        results: [
          {
            faixa_etaria: {
              __str__: "04 anos a 06 anos",
              uuid: "2e14cd6e-33e6-4168-b1ce-449f686d1e7d",
            },
            count: 88,
          },
          {
            faixa_etaria: {
              __str__: "00 meses a 06 meses",
              uuid: "aaaa0000-0000-0000-0000-000000000001",
            },
            count: 0,
          },
        ],
      });
    await renderPage();

    await carregaRascunho();

    expect(screen.getByText("Solicitação # A38E6")).toBeInTheDocument();
    expect(screen.getByText("00 meses a 06 meses")).toBeInTheDocument();
  });

  it("renderiza faixa etária com contagem zero no período externo", async () => {
    mocksBase();
    const manhaUuid = periodosVinculos.find(
      (v) => v.periodo_escolar.nome === "MANHA",
    ).periodo_escolar.uuid;
    mock
      .onGet(
        `/quantidade-alunos-por-periodo/${manhaUuid}/alunos-por-faixa-etaria/${hoje}/`,
      )
      .reply(200, {
        count: 2,
        results: [
          {
            faixa_etaria: {
              __str__: "04 anos a 06 anos",
              uuid: "2e14cd6e-33e6-4168-b1ce-449f686d1e7d",
            },
            count: 88,
          },
          {
            faixa_etaria: {
              __str__: "00 meses a 06 meses",
              uuid: "aaaa0000-0000-0000-0000-000000000001",
            },
            count: 0,
          },
        ],
      });
    await renderPage();

    fireEvent.click(screen.getByTestId("span-MANHA"));
    await waitFor(() => {
      expect(
        screen.getByText("Tipos de Alimentação do período manha:"),
      ).toBeInTheDocument();
    });

    expect(screen.getByText("00 meses a 06 meses")).toBeInTheDocument();
  });

  it("renderiza faixa etária com contagem zero no período interno do INTEGRAL", async () => {
    mocksBase();
    const integralUuid = periodosVinculos.find(
      (v) => v.periodo_escolar.nome === "INTEGRAL",
    ).periodo_escolar.uuid;
    mock
      .onGet(
        `/quantidade-alunos-por-periodo/${integralUuid}/alunos-por-faixa-etaria/${hoje}/`,
      )
      .reply(200, {
        count: 3,
        results: [
          {
            faixa_etaria: {
              __str__: "07 a 11 meses",
              uuid: "55f0af28-e1d5-43a0-a3f3-bbc453b784a5",
            },
            count: 1,
          },
          {
            faixa_etaria: {
              __str__: "01 ano a 03 anos e 11 meses",
              uuid: "e3030bd1-2e85-4676-87b3-96b4032370d4",
            },
            count: 0,
          },
          {
            faixa_etaria: {
              __str__: "04 anos a 06 anos",
              uuid: "2e14cd6e-33e6-4168-b1ce-449f686d1e7d",
            },
            count: 4,
          },
        ],
      });
    await renderPage();

    fireEvent.click(screen.getByTestId("span-INTEGRAL"));
    await waitFor(() => {
      expect(screen.queryAllByText("INTEGRAL")).toHaveLength(2);
    });
    fireEvent.click(screen.getByTestId("span-dentro-INTEGRAL"));
    await waitFor(() => {
      expect(
        screen.getByText("Tipos de Alimentação do período integral:"),
      ).toBeInTheDocument();
    });

    expect(screen.getByText("01 ano a 03 anos e 11 meses")).toBeInTheDocument();
  });

  it("ignora período escolar sem alunos ao montar o formulário", async () => {
    mocksBase();
    const tardeUuid = periodosVinculos.find(
      (v) => v.periodo_escolar.nome === "TARDE",
    ).periodo_escolar.uuid;
    mock
      .onGet(
        `/quantidade-alunos-por-periodo/${tardeUuid}/alunos-por-faixa-etaria/${hoje}/`,
      )
      .reply(200, { count: 0, results: [] });
    await renderPage();

    expect(
      screen.getByText("Descrição da Inclusão de Alimentação"),
    ).toBeInTheDocument();
    expect(screen.getByText("Salvar rascunho")).toBeInTheDocument();
  });

  it("não remove rascunho quando confirmação é negada", async () => {
    mocksBase();
    window.confirm = jest.fn().mockImplementation(() => false);
    await renderPage();

    fireEvent.click(screen.getByTestId("botao-remover-rascunho"));

    expect(window.confirm).toHaveBeenCalledWith(
      "Deseja remover este rascunho?",
    );
    expect(screen.getByText("Rascunhos")).toBeInTheDocument();
    expect(
      screen.queryByText("Rascunho # A38E6 excluído com sucesso"),
    ).not.toBeInTheDocument();
  });

  it("renderiza formulário sem bloco de matriculados quando quantidade é zero", async () => {
    const meusDadosSemMatriculados = JSON.parse(
      JSON.stringify(mockMeusDadosEscolaCEIcomMANHAeTARDE),
    );
    meusDadosSemMatriculados.vinculo_atual.instituicao.quantidade_alunos = 0;
    mocksBase(meusDadosSemMatriculados);
    await renderPage(meusDadosSemMatriculados);

    expect(
      screen.getByText("Descrição da Inclusão de Alimentação"),
    ).toBeInTheDocument();
    expect(screen.queryByText("Nº de Matriculados")).not.toBeInTheDocument();
  });
});
