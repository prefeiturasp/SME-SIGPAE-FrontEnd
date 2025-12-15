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
import { mockQuantidadeAlunosPorPeriodo } from "src/mocks/InclusaoAlimentacao/mockQuantidadeAlunosPorPeriodo";
import { mockVinculosTipoAlimentacaoEPeriodoEscolar } from "src/mocks/InclusaoAlimentacao/mockVinculosTipoAlimentacaoEPeriodoescolar";
import { mockDiasUteis } from "src/mocks/diasUseisMock";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosEscolaEMEFPericles } from "src/mocks/meusDados/escolaEMEFPericles";
import React from "react";
import {
  getVinculosTipoAlimentacaoMotivoInclusaoEspecifico,
  getVinculosTipoAlimentacaoPorEscola,
} from "src/services/cadastroTipoAlimentacao.service";
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

jest.mock("src/services/cadastroTipoAlimentacao.service");
jest.mock("src/services/escola.service");
jest.mock("src/services/diasUteis.service");
jest.mock("src/services/inclusaoDeAlimentacao");

const awaitServices = async () => {
  await waitFor(() => {
    expect(getDiasUteis).toHaveBeenCalled();
    expect(getMotivosInclusaoNormal).toHaveBeenCalled();
    expect(getMotivosInclusaoContinua).toHaveBeenCalled();
    expect(buscaPeriodosEscolares).toHaveBeenCalled();
    expect(getQuantidaDeAlunosPorPeriodoEEscola).toHaveBeenCalled();
    expect(getVinculosTipoAlimentacaoPorEscola).toHaveBeenCalled();
    expect(
      getVinculosTipoAlimentacaoMotivoInclusaoEspecifico,
    ).toHaveBeenCalled();
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
    getQuantidaDeAlunosPorPeriodoEEscola.mockResolvedValue({
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
            data: mockMinhasSolicitacoesInclusaoNormal,
            status: 200,
          });
        }
        if (tipo === TIPO_SOLICITACAO.SOLICITACAO_CONTINUA) {
          return Promise.resolve({
            data: { results: [] },
            status: 200,
          });
        }
        return Promise.resolve({
          data: { results: [] },
          status: 500,
        });
      },
    );
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
      screen.getByText("Inclusão de Alimentação # 06E82"),
    ).toBeInTheDocument();
    expect(screen.getByText("1 dia(s)")).toBeInTheDocument();
    expect(
      screen.getByText("Criado em: 24/01/2025 09:43:08"),
    ).toBeInTheDocument();
  });

  it("renderiza label `Motivo`", async () => {
    await awaitServices();
    expect(screen.getByText("Motivo")).toBeInTheDocument();
  });

  const setMotivoValueEventoEspecífico = () => {
    const selectMotivo = screen.getByTestId("select-motivo-0");
    const selectElement = selectMotivo.querySelector("select");
    const uuidMotivoReposicaoDeAula = mockMotivosInclusaoNormal.results.find(
      (motivo) => motivo.nome === "Evento Específico",
    ).uuid;
    fireEvent.change(selectElement, {
      target: { value: uuidMotivoReposicaoDeAula },
    });
  };

  it("renderiza label `Dia` após selecionar um motivo", async () => {
    await awaitServices();
    setMotivoValueEventoEspecífico();
    expect(screen.getByText("Dia")).toBeInTheDocument();
  });

  it("renderiza modal para dia selecionado ser menor que 5 dias úteis", async () => {
    await awaitServices();
    setMotivoValueEventoEspecífico();
    const divDia = screen.getByTestId("data-motivo-normal-0");
    const inputElement = divDia.querySelector("input");

    expect(screen.queryByText("Atenção")).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        "A solicitação está fora do prazo contratual de cinco dias úteis. Sendo assim, a autorização dependerá de confirmação por parte da empresa terceirizada.",
      ),
    ).not.toBeInTheDocument();

    fireEvent.change(inputElement, {
      target: { value: "30/01/2025" },
    });

    expect(screen.queryByText("Atenção")).toBeInTheDocument();
    expect(
      screen.queryByText(
        "A solicitação está fora do prazo contratual de cinco dias úteis. Sendo assim, a autorização dependerá de confirmação por parte da empresa terceirizada.",
      ),
    ).toBeInTheDocument();
  });

  const setupInclusaoNormalMotivoEspecifico = async () => {
    setMotivoValueEventoEspecífico();

    const divDia = screen.getByTestId("data-motivo-normal-0");
    const inputElement = divDia.querySelector("input");
    fireEvent.change(inputElement, {
      target: { value: "30/01/2025" },
    });

    expect(screen.getByText("Período")).toBeInTheDocument();
    expect(screen.getByText("MANHA")).toBeInTheDocument();
    expect(screen.getByText("TARDE")).toBeInTheDocument();
    expect(screen.getByText("INTEGRAL")).toBeInTheDocument();
    expect(screen.getByText("NOITE")).toBeInTheDocument();

    const divCheckboxINTEGRAL = screen.getByTestId("div-checkbox-INTEGRAL");
    const spanElement = divCheckboxINTEGRAL.querySelector("span");

    // check período INTEGRAL
    await act(async () => {
      fireEvent.click(spanElement);
    });

    const divMultiselectINTEGRAL = screen.getByTestId(
      "multiselect-div-INTEGRAL",
    );
    const dropdown = within(divMultiselectINTEGRAL).getByRole("combobox");

    const spanSelecione = within(dropdown.parentElement).getByText("Selecione");
    const divDropdownHeading = spanSelecione.parentElement.parentElement;

    // expande seletor Tipo de Alimentação
    await act(async () => {
      createInclusaoAlimentacao;
      fireEvent.click(divDropdownHeading);
    });

    expect(screen.getByText("Todos")).toBeInTheDocument();
    expect(screen.queryAllByText("Lanche").length).toBeGreaterThan(0);
    expect(screen.queryAllByText("Refeição").length).toBeGreaterThan(0);
    expect(screen.queryAllByText("Sobremesa").length).toBeGreaterThan(0);
    expect(screen.queryAllByText("Lanche 4h").length).toBeGreaterThan(0);

    const divDropdownContent = container.querySelector(".dropdown-content");
    const checkboxLanche =
      within(divDropdownContent).getAllByRole("checkbox")[1];

    // seleciona tipo de alimentação Lanche
    await act(async () => {
      fireEvent.click(checkboxLanche);
    });

    const divNumeroAlunos = screen.getByTestId("numero-alunos-2");
    const inputElementNumeroAlunos = divNumeroAlunos.querySelector("input");

    await act(async () => {
      fireEvent.change(inputElementNumeroAlunos, {
        target: { value: 100 },
      });
    });
  };

  it("envia inclusão de alimentação com sucesso", async () => {
    await awaitServices();
    await setupInclusaoNormalMotivoEspecifico();
    const botaoEnviarSolicitacao = screen.getByTestId("botao-enviar-inclusao");
    await act(async () => {
      fireEvent.click(botaoEnviarSolicitacao);
    });
  });

  it("salva rascunho com sucesso", async () => {
    await awaitServices();
    await setupInclusaoNormalMotivoEspecifico();
    const botaoSalvarRascunho = screen.getByTestId("botao-salvar-rascunho");
    await act(async () => {
      fireEvent.click(botaoSalvarRascunho);
    });
  });

  it("carrega rascunho e atualiza", async () => {
    await awaitServices();
    const botaoCarregarRascunho = screen.getByTestId("rascunho-9C037");
    await act(async () => {
      fireEvent.click(botaoCarregarRascunho);
    });

    await waitFor(() => {
      expect(screen.getByText("Solicitação # 9C037")).toBeInTheDocument();

      expect(screen.getByText("Período")).toBeInTheDocument();
      expect(screen.getByText("MANHA")).toBeInTheDocument();
      expect(screen.getByText("INTEGRAL")).toBeInTheDocument();

      const divNumeroAlunos = screen.getByTestId("numero-alunos-2");
      const inputElementNumeroAlunos = divNumeroAlunos.querySelector("input");
      expect(inputElementNumeroAlunos).toHaveValue(12);
    });

    const botaoSalvarRascunho = screen.getByTestId("botao-salvar-rascunho");
    await act(async () => {
      fireEvent.click(botaoSalvarRascunho);
    });
  });
});
