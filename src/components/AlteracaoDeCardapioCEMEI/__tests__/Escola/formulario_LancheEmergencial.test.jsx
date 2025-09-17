import "@testing-library/jest-dom";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockDiasUteis } from "src/mocks/diasUseisMock";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosEscolaCEMEI } from "src/mocks/meusDados/escola/CEMEI";
import { mockMotivosAlteracaoCardapio } from "src/mocks/services/alteracaoCardapio.service/motivosAlteracaoCardapio";
import { mockQuantidadeAlunoCEMEIporCEIEMEI } from "src/mocks/services/aluno.service/CEMEI/quantidadeAlunoCEMEIporCEIEMEI";
import { mockGetVinculosTipoAlimentacaoPorEscolaCEMEI } from "src/mocks/services/cadastroTipoAlimentacao.service/CEMEI/vinculosTipoAlimentacaoPeriodoEscolar";
import { AlteracaoDeCardapioCEMEIPage } from "src/pages/Escola/AlteracaoDeCardapioCEMEIPage";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import mock from "src/services/_mock";

describe("Teste Formulário Alteração de Cardápio - Lanche Emergencial - CEMEI", () => {
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

  it("renderiza título da página e o breadcrumb `Alteração do Tipo de Alimentação`", async () => {
    expect(
      screen.queryAllByText("Alteração do Tipo de Alimentação").length
    ).toBe(2);
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

  const selecionaAlunosEMEI = () => {
    const selectAlunosDiv = screen.getByTestId(
      "div-select-alunos-cei-e-ou-emei"
    );
    const selectElementAlunos = selectAlunosDiv.querySelector("select");
    fireEvent.change(selectElementAlunos, {
      target: { value: "EMEI" },
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

  it("Testa Alteração - Motivo Lanche Emergencial", async () => {
    selecionaAlunosEMEI();
    selecionaMotivoLancheEmergencial();
    expect(screen.getByText("Alterar dia")).toBeInTheDocument();

    const divInputDataInicial = screen.getByTestId("div-input-data-inicial");
    const inputElementDataInicial = divInputDataInicial.querySelector("input");
    fireEvent.change(inputElementDataInicial, {
      target: { value: "30/01/2025" },
    });

    const divInputDataFinal = screen.getByTestId("div-input-data-inicial");
    const inputElementDataFinal = divInputDataFinal.querySelector("input");
    fireEvent.change(inputElementDataFinal, {
      target: { value: "01/02/2025" },
    });

    expect(screen.getByText("INTEGRAL")).toBeInTheDocument();

    const divCheckboxINTEGRAL = screen.getByTestId("div-checkbox-INTEGRAL");
    const spanElement = divCheckboxINTEGRAL.querySelector("span");
    const inputCheckboxtElement = spanElement.querySelector("input");

    // check período INTEGRAL

    fireEvent.click(inputCheckboxtElement);

    expect(screen.queryByText("Alunos CEI")).not.toBeInTheDocument();
    expect(screen.getByText("Alunos EMEI")).toBeInTheDocument();

    const selectAlterarAlimentacaoDeEMEI = screen.getByTestId(
      "select-alterar-alimentacao-de-EMEI"
    );
    const selectControlDe = within(selectAlterarAlimentacaoDeEMEI).getByRole(
      "combobox"
    );
    fireEvent.mouseDown(selectControlDe);

    const optionDe = screen.getByText("Sobremesa");
    fireEvent.click(optionDe);

    const selectAlterarAlimentacaoParaEMEI = screen.getByTestId(
      "select-alterar-alimentacao-para-EMEI"
    );
    const selectControlPara = within(
      selectAlterarAlimentacaoParaEMEI
    ).getByRole("combobox");
    fireEvent.mouseDown(selectControlPara);

    const optionPara = screen.getAllByText("Lanche Emergencial")[1];
    fireEvent.click(optionPara);

    const inputElementNumeroAlunosEMEI = screen.getByTestId(
      `substituicoes[0][emei][quantidade_alunos]`
    );
    fireEvent.change(inputElementNumeroAlunosEMEI, {
      target: { value: "1" },
    });

    const botaoSalvarRascunho = screen
      .getByText("Salvar rascunho")
      .closest("button");
    fireEvent.click(botaoSalvarRascunho);
  });
});
