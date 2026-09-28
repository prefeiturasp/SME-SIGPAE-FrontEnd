import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { Container } from "src/components/InclusaoDeAlimentacao/Escola/Formulario/componentes/Container";
import { PERFIL, TIPO_SOLICITACAO } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockCreateGrupoInclusaoNormal } from "src/mocks/InclusaoAlimentacao/mockCreateGrupoInclusaoNormal";
import { mockInicioPedidoGrupoInclusaoAlimentacao } from "src/mocks/InclusaoAlimentacao/mockInicioPedidoGrupoInclusaoAlimentacao";
import { mockMinhasSolicitacoesInclusaoNormal } from "src/mocks/InclusaoAlimentacao/mockMinhasSolicitacoesInclusaoNormal";
import { mockMotivoInclusaoEspecifico } from "src/mocks/InclusaoAlimentacao/mockMotivoInclusaoEspecifico";
import { mockMotivosInclusaoContinua } from "src/mocks/InclusaoAlimentacao/mockMotivosInclusaoContinua";
import { mockMotivosInclusaoNormal } from "src/mocks/InclusaoAlimentacao/mockMotivosInclusaoNormal";
import { mockPeriodosEscolaresNoite } from "src/mocks/InclusaoAlimentacao/mockPeriodosEscolaresNoite";
import { mockTiposAlimentacao } from "src/mocks/InclusaoAlimentacao/mockTiposAlimentacao";
import { mockQuantidadeAlunosPorPeriodo } from "src/mocks/InclusaoAlimentacao/mockQuantidadeAlunosPorPeriodo";
import { mockVinculosTipoAlimentacaoEPeriodoEscolar } from "src/mocks/InclusaoAlimentacao/mockVinculosTipoAlimentacaoEPeriodoescolar";
import { mockDiasUteis } from "src/mocks/diasUseisMock";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosEscolaEMEFPericles } from "src/mocks/meusDados/escolaEMEFPericles";
import React from "react";
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
  escolaExcluirSolicitacaoDeInclusaoDeAlimentacao,
  getMotivosInclusaoContinua,
  getMotivosInclusaoNormal,
  iniciaFluxoInclusaoAlimentacao,
  obterMinhasSolicitacoesDeInclusaoDeAlimentacao,
  updateInclusaoAlimentacao,
} from "src/services/inclusaoDeAlimentacao";

jest.mock("src/services/cadastroTipoAlimentacao.service");
jest.mock("src/services/escola.service");
jest.mock("src/services/alunosMatriculados.service");
jest.mock("src/services/diasUteis.service");
jest.mock("src/services/inclusaoDeAlimentacao");

const awaitServices = async () => {
  await waitFor(() => {
    expect(getDiasUteis).toHaveBeenCalled();
    expect(getMotivosInclusaoNormal).toHaveBeenCalled();
    expect(getMotivosInclusaoContinua).toHaveBeenCalled();
    expect(buscaPeriodosEscolares).toHaveBeenCalled();
    expect(getQuantidaDeAlunosPorPeriodoEEscola).toHaveBeenCalled();
    expect(filtrarAlunosMatriculados).toHaveBeenCalled();
    expect(getVinculosTipoAlimentacaoPorEscola).toHaveBeenCalled();
    expect(
      getVinculosTipoAlimentacaoMotivoInclusaoEspecifico,
    ).toHaveBeenCalled();
  });
};

let container;
let mockRascunhosNormais = mockMinhasSolicitacoesInclusaoNormal;

const setMotivoValueReposicaoDeAula = () => {
  const selectMotivo = screen.getByTestId("select-motivo-0");
  const selectElement = selectMotivo.querySelector("select");
  const uuidMotivoReposicaoDeAula = mockMotivosInclusaoNormal.results.find(
    (motivo) => motivo.nome === "Reposição de aula",
  ).uuid;
  fireEvent.change(selectElement, {
    target: { value: uuidMotivoReposicaoDeAula },
  });
};

const setupInclusaoNormal = async (numeroAlunos = 100) => {
  setMotivoValueReposicaoDeAula();

  const divDia = screen.getByTestId("data-motivo-normal-0");
  const inputElement = divDia.querySelector("input");
  fireEvent.change(inputElement, {
    target: { value: "30/01/2025" },
  });

  expect(screen.getByText("Período")).toBeInTheDocument();

  const divCheckboxMANHA = screen.getByTestId("div-checkbox-MANHA");
  const spanElement = divCheckboxMANHA.querySelector("span");

  await act(async () => {
    fireEvent.click(spanElement);
  });

  const divMultiselectMANHA = screen.getByTestId("multiselect-div-MANHA");
  const dropdown = within(divMultiselectMANHA).getByRole("combobox");
  const spanSelecione = within(dropdown.parentElement).getByText("Selecione");
  const divDropdownHeading = spanSelecione.parentElement.parentElement;

  await act(async () => {
    fireEvent.click(divDropdownHeading);
  });

  const divDropdownContent = container.querySelector(".dropdown-content");
  const checkboxLanche = within(divDropdownContent).getAllByRole("checkbox")[1];

  await act(async () => {
    fireEvent.click(checkboxLanche);
  });

  const divNumeroAlunos = screen.getByTestId("numero-alunos-0");
  const inputElementNumeroAlunos = divNumeroAlunos.querySelector("input");

  await act(async () => {
    fireEvent.change(inputElementNumeroAlunos, {
      target: { value: numeroAlunos },
    });
  });
};

const setupBase = async () => {
  createInclusaoAlimentacao.mockClear();
  updateInclusaoAlimentacao.mockClear();
  iniciaFluxoInclusaoAlimentacao.mockClear();
  escolaExcluirSolicitacaoDeInclusaoDeAlimentacao.mockClear();
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
  getVinculosTipoAlimentacaoPorEscola.mockResolvedValue({
    data: mockVinculosTipoAlimentacaoEPeriodoEscolar,
    status: 200,
  });
  filtrarAlunosMatriculados.mockResolvedValue({
    data: { results: [] },
    status: 200,
  });
  getVinculosTipoAlimentacaoMotivoInclusaoEspecifico.mockResolvedValue({
    data: mockMotivoInclusaoEspecifico,
    status: 200,
  });
  getTiposDeAlimentacao.mockResolvedValue({
    data: mockTiposAlimentacao,
    status: 200,
  });
  getDiasUteis.mockResolvedValue({
    data: mockDiasUteis,
    status: 200,
  });
  obterMinhasSolicitacoesDeInclusaoDeAlimentacao.mockImplementation((tipo) => {
    if (tipo === TIPO_SOLICITACAO.SOLICITACAO_NORMAL) {
      return Promise.resolve({
        data: mockRascunhosNormais,
        status: 200,
      });
    }
    return Promise.resolve({
      data: { results: [] },
      status: 200,
    });
  });
  createInclusaoAlimentacao.mockResolvedValue({
    data: mockCreateGrupoInclusaoNormal,
    status: 201,
  });
  updateInclusaoAlimentacao.mockResolvedValue({
    data: mockCreateGrupoInclusaoNormal,
    status: 200,
  });
  iniciaFluxoInclusaoAlimentacao.mockResolvedValue({
    data: mockInicioPedidoGrupoInclusaoAlimentacao,
    status: 200,
  });
  escolaExcluirSolicitacaoDeInclusaoDeAlimentacao.mockResolvedValue({
    data: {},
    status: 204,
  });
  window.confirm = jest.fn(() => true);

  Object.defineProperty(global, "localStorage", { value: localStorageMock });
  localStorage.setItem(
    "nome_instituicao",
    `"EMEF PERICLES EUGENIO DA SILVA RAMOS"`,
  );
  localStorage.setItem("perfil", PERFIL.DIRETOR_UE);

  await act(async () => {
    ({ container } = render(
      <MeusDadosContext.Provider
        value={{ meusDados: mockMeusDadosEscolaEMEFPericles }}
      >
        <Container />
      </MeusDadosContext.Provider>,
    ));
  });
};

describe("Teste Formulário Inclusão de Alimentação - fluxos adicionais", () => {
  beforeEach(async () => {
    await setupBase();
  });

  it("cancela e limpa o formulário", async () => {
    await awaitServices();
    const botaoCancelar = screen.getByText("Cancelar").closest("button");

    await act(async () => {
      fireEvent.click(botaoCancelar);
    });

    expect(screen.getByText("Nova Solicitação")).toBeInTheDocument();
  });

  it("fecha o modal de data prioritária", async () => {
    await awaitServices();
    setMotivoValueReposicaoDeAula();

    const divDia = screen.getByTestId("data-motivo-normal-0");
    fireEvent.change(divDia.querySelector("input"), {
      target: { value: "30/01/2025" },
    });

    expect(screen.getByText("Atenção")).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByTestId("botao-ok-modal-data-prioritaria"));
    });

    expect(screen.queryByText("Atenção")).not.toBeInTheDocument();
  });

  it("exibe erro ao remover rascunho", async () => {
    await awaitServices();
    escolaExcluirSolicitacaoDeInclusaoDeAlimentacao.mockResolvedValueOnce({
      data: {},
      status: 400,
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId("remover-rascunho-06E82"));
    });

    expect(escolaExcluirSolicitacaoDeInclusaoDeAlimentacao).toHaveBeenCalled();
  });

  it("não remove rascunho quando a confirmação é negada", async () => {
    await awaitServices();
    window.confirm = jest.fn(() => false);

    await act(async () => {
      fireEvent.click(screen.getByTestId("remover-rascunho-06E82"));
    });

    expect(
      escolaExcluirSolicitacaoDeInclusaoDeAlimentacao,
    ).not.toHaveBeenCalled();
  });

  it("exibe erro de validação ao enviar formulário sem período selecionado", async () => {
    await awaitServices();
    setMotivoValueReposicaoDeAula();

    const divDia = screen.getByTestId("data-motivo-normal-0");
    fireEvent.change(divDia.querySelector("input"), {
      target: { value: "30/01/2025" },
    });
    await act(async () => {});

    const botaoEnviar = screen.getByTestId("botao-enviar-inclusao");
    await act(async () => {
      fireEvent.click(botaoEnviar);
    });
  });

  it("exibe erro ao criar inclusão", async () => {
    await awaitServices();
    await setupInclusaoNormal();
    createInclusaoAlimentacao.mockResolvedValueOnce({
      data: {},
      status: 400,
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId("botao-enviar-inclusao"));
    });
  });

  it("exibe erro ao iniciar pedido", async () => {
    await awaitServices();
    await setupInclusaoNormal();
    iniciaFluxoInclusaoAlimentacao.mockResolvedValueOnce({
      data: {},
      status: 500,
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId("botao-enviar-inclusao"));
    });
  });

  it("envia inclusão carregada de rascunho", async () => {
    await awaitServices();
    await act(async () => {
      fireEvent.click(screen.getByTestId("rascunho-06E82"));
    });
    await waitFor(() => screen.getByText("Solicitação # 06E82"));

    await act(async () => {
      fireEvent.click(screen.getByTestId("botao-enviar-inclusao"));
    });

    expect(iniciaFluxoInclusaoAlimentacao).toHaveBeenCalled();
  });

  it("exibe erro ao atualizar rascunho", async () => {
    await awaitServices();
    await act(async () => {
      fireEvent.click(screen.getByTestId("rascunho-06E82"));
    });
    await waitFor(() => screen.getByText("Solicitação # 06E82"));
    updateInclusaoAlimentacao.mockResolvedValueOnce({
      data: {},
      status: 400,
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId("botao-salvar-rascunho"));
    });
  });

  it("limpa campos ao selecionar motivo vazio", async () => {
    await awaitServices();
    const selectMotivo = screen.getByTestId("select-motivo-0");
    fireEvent.change(selectMotivo.querySelector("select"), {
      target: { value: "" },
    });
  });

  it("seleciona motivo desconhecido", async () => {
    await awaitServices();
    const selectMotivo = screen.getByTestId("select-motivo-0");
    fireEvent.change(selectMotivo.querySelector("select"), {
      target: { value: "uuid-inexistente" },
    });
  });

  it("mantém uuid ao trocar motivo de rascunho carregado", async () => {
    await awaitServices();
    await act(async () => {
      fireEvent.click(screen.getByTestId("rascunho-06E82"));
    });
    await waitFor(() => screen.getByText("Solicitação # 06E82"));

    setMotivoValueReposicaoDeAula();
  });
});

describe("Teste Formulário Inclusão de Alimentação - rascunho com seleção simples", () => {
  beforeEach(async () => {
    const rascunhoBase = mockMinhasSolicitacoesInclusaoNormal.results[0];
    mockRascunhosNormais = {
      results: [
        {
          ...rascunhoBase,
          id_externo: "06E99",
          uuid: "06e99999-9999-4999-8999-999999999999",
          quantidades_periodo: [
            {
              ...rascunhoBase.quantidades_periodo[0],
              tipos_alimentacao: [
                {
                  uuid: "5d1304c8-77a8-4c96-badb-dd2e8c1b76d5",
                  nome: "Lanche",
                },
                {
                  uuid: "65f11f11-630b-4629-bb17-07c875c548f1",
                  nome: "Refeição",
                },
              ],
            },
            {
              periodo_escolar: {
                nome: "TARDE",
                uuid: "20bd9ca9-d499-456a-bd86-fb8f297947d6",
              },
              tipos_alimentacao: [
                {
                  uuid: "5d1304c8-77a8-4c96-badb-dd2e8c1b76d5",
                  nome: "Lanche",
                },
              ],
              uuid: "fe9c47ba-9ce9-4d4a-9879-030c892bccec",
              dias_semana: [],
              numero_alunos: 50,
            },
          ],
        },
      ],
    };

    await setupBase();
    localStorage.setItem("possui_alunos_regulares", "false");
  });

  it("carrega rascunho usando seleção simples de tipo de alimentação", async () => {
    await awaitServices();
    await act(async () => {
      fireEvent.click(screen.getByTestId("rascunho-06E99"));
    });

    await waitFor(() => screen.getByText("Solicitação # 06E99"));
    expect(screen.getByText("Período")).toBeInTheDocument();
  });
});

describe("Teste Formulário Inclusão de Alimentação - fluxo contínuo", () => {
  const setMotivoContinuo = (nome) => {
    const selectMotivo = screen.getByTestId("select-motivo-0");
    const uuidMotivo = mockMotivosInclusaoContinua.results.find(
      (motivo) => motivo.nome === nome,
    ).uuid;
    fireEvent.change(selectMotivo.querySelector("select"), {
      target: { value: uuidMotivo },
    });
  };

  const setupInclusaoContinua = async (nomeMotivo) => {
    setMotivoContinuo(nomeMotivo);

    await waitFor(() => screen.getByText("De"));

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

    await waitFor(() => screen.getByText("Recorrência e detalhes"));

    fireEvent.click(screen.getByTestId("dias-semana-0"));

    fireEvent.change(
      screen.getByTestId("div-select-periodo-escolar").querySelector("select"),
      { target: { value: "5067e137-e5f3-4876-a63f-7f58cce93f33" } },
    );

    await waitFor(() => screen.getByText("Refeição e Sobremesa"));

    fireEvent.change(
      screen.getByTestId("div-select-tipo-alimentacao").querySelector("select"),
      { target: { value: "Refeição e Sobremesa" } },
    );

    const inputNumeroAlunos = screen
      .getByTestId("numero-alunos")
      .querySelector("input");
    await act(async () => {
      fireEvent.change(inputNumeroAlunos, { target: { value: 100 } });
    });

    const botaoAdicionarRecorrencia = screen.getByTestId(
      "botao-adicionar-recorrencia",
    );
    await act(async () => {
      fireEvent.click(botaoAdicionarRecorrencia);
    });
  };

  beforeEach(async () => {
    await setupBase();
  });

  it("salva rascunho de inclusão contínua com sucesso", async () => {
    await awaitServices();
    await setupInclusaoContinua("Programas/Projetos Contínuos");

    await act(async () => {
      fireEvent.click(screen.getByTestId("botao-salvar-rascunho"));
    });

    expect(createInclusaoAlimentacao).toHaveBeenCalled();
  });

  it("salva rascunho de inclusão contínua específica com sucesso", async () => {
    await awaitServices();
    await setupInclusaoContinua("Programas/Projetos Específicos");

    expect(screen.getByText("Recorrência e detalhes")).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByTestId("botao-salvar-rascunho"));
    });

    expect(createInclusaoAlimentacao).toHaveBeenCalled();
  });
});
