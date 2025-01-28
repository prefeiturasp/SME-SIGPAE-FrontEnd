import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { Container } from "components/InclusaoDeAlimentacao/Escola/Formulario/componentes/Container";
import { TIPO_SOLICITACAO } from "constants/shared";
import { MeusDadosContext } from "context/MeusDadosContext";
import { mockCreateInclusaoContinua } from "mocks/InclusaoAlimentacao/mockCreateInclusaoContinua";
import { mockInicioPedidoInclusaoContinua } from "mocks/InclusaoAlimentacao/mockInicioPedidoInclusaoContinua";
import { mockMinhasSolicitacoesInclusaoContinua } from "mocks/InclusaoAlimentacao/mockMinhasSolicitacoesInclusaoContinua";
import { mockMotivoInclusaoEspecifico } from "mocks/InclusaoAlimentacao/mockMotivoInclusaoEspecifico";
import { mockMotivosInclusaoContinua } from "mocks/InclusaoAlimentacao/mockMotivosInclusaoContinua";
import { mockMotivosInclusaoNormal } from "mocks/InclusaoAlimentacao/mockMotivosInclusaoNormal";
import { mockPeriodosEscolaresNoite } from "mocks/InclusaoAlimentacao/mockPeriodosEscolaresNoite";
import { mockQuantidadeAlunosPorPeriodo } from "mocks/InclusaoAlimentacao/mockQuantidadeAlunosPorPeriodo";
import { mockVinculosTipoAlimentacaoEPeriodoEscolar } from "mocks/InclusaoAlimentacao/mockVinculosTipoAlimentacaoEPeriodoescolar";
import { mockDiasUteis } from "mocks/diasUseisMock";
import { localStorageMock } from "mocks/localStorageMock";
import { mockMeusDadosEscolaEMEFPericles } from "mocks/meusDados/escolaEMEFPericles";
import React from "react";
import {
  getVinculosTipoAlimentacaoMotivoInclusaoEspecifico,
  getVinculosTipoAlimentacaoPorEscola,
} from "services/cadastroTipoAlimentacao.service";
import { getDiasUteis } from "services/diasUteis.service";
import {
  buscaPeriodosEscolares,
  getQuantidadeAlunosEscola,
} from "services/escola.service";
import {
  createInclusaoAlimentacao,
  getMotivosInclusaoContinua,
  getMotivosInclusaoNormal,
  iniciaFluxoInclusaoAlimentacao,
  obterMinhasSolicitacoesDeInclusaoDeAlimentacao,
  updateInclusaoAlimentacao,
  escolaExcluirSolicitacaoDeInclusaoDeAlimentacao,
} from "services/inclusaoDeAlimentacao";

jest.mock("services/cadastroTipoAlimentacao.service");
jest.mock("services/escola.service");
jest.mock("services/diasUteis.service");
jest.mock("services/inclusaoDeAlimentacao");

const awaitServices = async () => {
  await waitFor(() => {
    expect(getDiasUteis).toHaveBeenCalled();
    expect(getMotivosInclusaoNormal).toHaveBeenCalled();
    expect(getMotivosInclusaoContinua).toHaveBeenCalled();
    expect(buscaPeriodosEscolares).toHaveBeenCalled();
    expect(getQuantidadeAlunosEscola).toHaveBeenCalled();
    expect(getVinculosTipoAlimentacaoPorEscola).toHaveBeenCalled();
    expect(
      getVinculosTipoAlimentacaoMotivoInclusaoEspecifico
    ).toHaveBeenCalled();
    expect(
      obterMinhasSolicitacoesDeInclusaoDeAlimentacao
    ).toHaveBeenCalledTimes(2);
  });
};

let container;

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
    getQuantidadeAlunosEscola.mockResolvedValue({
      data: mockQuantidadeAlunosPorPeriodo,
      status: 200,
    });
    getVinculosTipoAlimentacaoPorEscola.mockResolvedValue({
      data: mockVinculosTipoAlimentacaoEPeriodoEscolar,
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
      }
    );
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
    escolaExcluirSolicitacaoDeInclusaoDeAlimentacao.mockResolvedValue({
      status: 204,
    });

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem(
      "nome_instituicao",
      `"EMEF PERICLES EUGENIO DA SILVA RAMOS"`
    );

    global.window.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));

    await act(async () => {
      ({ container } = render(
        <MeusDadosContext.Provider
          value={{ meusDados: mockMeusDadosEscolaEMEFPericles }}
        >
          <Container />
        </MeusDadosContext.Provider>
      ));
    });
  });

  it("renderiza bloco com número de matriculados", async () => {
    await awaitServices();
    expect(screen.getByText("Nº de Matriculados")).toBeInTheDocument();
    expect(screen.getByText("524")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Informação automática disponibilizada pelo Cadastro da Unidade Escolar"
      )
    ).toBeInTheDocument();
  });

  it("renderiza bloco `Rascunhos`", async () => {
    await awaitServices();
    expect(screen.getByText("Rascunhos")).toBeInTheDocument();
    expect(
      screen.getByText("Inclusão de Alimentação # 12CDB")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Programas/Projetos Contínuos - (12/02/2025 - 27/02/2025)"
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText("Criado em: 27/01/2025 16:34:09")
    ).toBeInTheDocument();
  });

  it("renderiza label `Motivo`", async () => {
    await awaitServices();
    expect(screen.getByText("Motivo")).toBeInTheDocument();
  });

  const setMotivoValueETEC = () => {
    const selectMotivo = screen.getByTestId("select-motivo");
    const selectElement = selectMotivo.querySelector("select");
    const uuidMotivoETEC = mockMotivosInclusaoContinua.results.find(
      (motivo) => motivo.nome === "ETEC"
    ).uuid;
    fireEvent.change(selectElement, {
      target: { value: uuidMotivoETEC },
    });
  };

  const setupInclusaoContinuaETEC = async () => {
    setMotivoValueETEC();

    expect(screen.getByText("De")).toBeInTheDocument();
    expect(screen.getByText("Até")).toBeInTheDocument();

    const divDataInicial = screen.getByTestId("data-inicial-div");
    const inputDataInicial = divDataInicial.querySelector("input");
    fireEvent.change(inputDataInicial, {
      target: { value: "30/01/2025" },
    });

    const divDataFinal = screen.getByTestId("data-final-div");
    const inputDataFinal = divDataFinal.querySelector("input");
    fireEvent.change(inputDataFinal, {
      target: { value: "01/12/2025" },
    });

    expect(
      screen.queryByText("Recorrência e detalhes")
    ).not.toBeInTheDocument();

    expect(screen.getByText("Período")).toBeInTheDocument();
    expect(screen.getByText("NOITE")).toBeInTheDocument();

    expect(screen.queryByText("MANHA")).not.toBeInTheDocument();
    expect(screen.queryByText("TARDE")).not.toBeInTheDocument();

    const divCheckboxNOITE = screen.getByTestId("div-checkbox-NOITE");
    const spanElement = divCheckboxNOITE.querySelector("span");

    // check período NOITE
    await act(async () => {
      fireEvent.click(spanElement);
    });

    const divMultiselectNOITE = screen.getByTestId("multiselect-div-NOITE");
    const dropdown = within(divMultiselectNOITE).getByRole("combobox");

    const spanSelecione = within(dropdown.parentElement).getByText("Selecione");
    const divDropdownHeading = spanSelecione.parentElement.parentElement;

    // expande seletor Tipo de Alimentação
    await act(async () => {
      fireEvent.click(divDropdownHeading);
    });

    expect(screen.getByText("Refeição")).toBeInTheDocument();
    expect(screen.getByText("Sobremesa")).toBeInTheDocument();

    const divDropdownContent = container.querySelector(".dropdown-content");
    const checkboxLanche =
      within(divDropdownContent).getAllByRole("checkbox")[1];

    // seleciona tipo de alimentação Lanche
    await act(async () => {
      fireEvent.click(checkboxLanche);
    });

    const divNumeroAlunos = screen.getByTestId("numero-alunos-0");
    const inputElementNumeroAlunos = divNumeroAlunos.querySelector("input");

    await act(async () => {
      fireEvent.change(inputElementNumeroAlunos, {
        target: { value: 100 },
      });
    });
  };

  it("envia inclusão de alimentação continua com sucesso", async () => {
    await awaitServices();
    await setupInclusaoContinuaETEC();
    const botaoEnviarSolicitacao = screen.getByTestId("botao-enviar-inclusao");
    await act(async () => {
      fireEvent.click(botaoEnviarSolicitacao);
    });
  });

  it("salva rascunho com sucesso", async () => {
    await awaitServices();
    await setupInclusaoContinuaETEC();
    const botaoSalvarRascunho = screen.getByTestId("botao-salvar-rascunho");
    await act(async () => {
      fireEvent.click(botaoSalvarRascunho);
    });
  });

  it("carrega rascunho e atualiza", async () => {
    await awaitServices();
    const botaoCarregarRascunho = screen.getByTestId("rascunho-667F9");
    await act(async () => {
      fireEvent.click(botaoCarregarRascunho);
    });

    await waitFor(() => {
      expect(screen.getByText("Solicitação # 667F9")).toBeInTheDocument();
    });

    const botaoSalvarRascunho = screen.getByTestId("botao-salvar-rascunho");
    await act(async () => {
      fireEvent.click(botaoSalvarRascunho);
    });
  });

  it("remove rascunho", async () => {
    window.confirm = jest.fn().mockImplementation(() => true);
    await awaitServices();
    const botaoRemoverRascunho = screen.getByTestId("remover-rascunho-667F9");
    await act(async () => {
      fireEvent.click(botaoRemoverRascunho);
    });
  });
});
