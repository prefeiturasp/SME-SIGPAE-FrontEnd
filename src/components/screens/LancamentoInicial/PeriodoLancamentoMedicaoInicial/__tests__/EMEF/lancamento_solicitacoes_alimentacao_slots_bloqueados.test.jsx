import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockGetTipoAlimentacao } from "src/mocks/cadastroTipoAlimentacao.service/mockGetTipoAlimentacao";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockCategoriasMedicao } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/categoriasMedicao";
import { mockDiasCalendarioEMEFDezembro2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/EMEF/Dezembro2025/diasCalendario";
import { mockStateSolicitacoesDeAlimentacaoEMEFDezembro2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/EMEF/Dezembro2025/stateSolicitacoesAlimentacao";
import { mockMeusDadosEscolaEMEFPericles } from "src/mocks/meusDados/escolaEMEFPericles";
import { mockVinculosTipoAlimentacaoPeriodoEscolarEMEF } from "src/mocks/services/cadastroTipoAlimentacao.service/EMEF/vinculosTipoAlimentacaoPeriodoEscolar";
import { PeriodoLancamentoMedicaoInicialPage } from "src/pages/LancamentoMedicaoInicial/PeriodoLancamentoMedicaoInicialPage";
import mock from "src/services/_mock";

describe("Lancamento de Solicitações de Alimentação com Slots Bloqueados - EMEF", () => {
  const escolaUuid =
    mockMeusDadosEscolaEMEFPericles.vinculo_atual.instituicao.uuid;

  beforeEach(async () => {
    mock
      .onGet("/usuarios/meus-dados/")
      .reply(200, mockMeusDadosEscolaEMEFPericles);
    mock
      .onGet(
        `/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/${escolaUuid}/`,
      )
      .reply(200, mockVinculosTipoAlimentacaoPeriodoEscolarEMEF);
    mock
      .onGet("/medicao-inicial/dias-sobremesa-doce/lista-dias/")
      .reply(200, []);
    mock.onGet("/tipos-alimentacao/").reply(200, mockGetTipoAlimentacao);
    mock
      .onGet("/escola-solicitacoes/inclusoes-autorizadas/")
      .reply(200, { results: [] });
    mock
      .onGet("/medicao-inicial/categorias-medicao/")
      .reply(200, mockCategoriasMedicao);
    mock.onGet("/medicao-inicial/valores-medicao/").reply(200, [
      {
        categoria_medicao: 5,
        nome_campo: "kit_lanche",
        valor: "10",
        dia: "06",
        medicao_uuid: "4713f074-24f0-4719-8785-5fc2b2ac08d6",
        faixa_etaria: null,
        faixa_etaria_str: null,
        faixa_etaria_inicio: null,
        uuid: "fc5692ab-2c48-4895-8dc3-b0ec4958303f",
        medicao_alterado_em: "18/12/2025, às 15:51:46",
        habilitado_correcao: false,
        infantil_ou_fundamental: "N/A",
      },
    ]);
    mock.onGet("/medicao-inicial/dias-para-corrigir/").reply(200, []);
    mock.onGet("/escola-solicitacoes/kit-lanches-autorizadas/").reply(200, {
      results: [
        { dia: "06", numero_alunos: 10, kit_lanche_id_externo: "0B9FF" },
      ],
    });
    mock
      .onGet("/escola-solicitacoes/alteracoes-alimentacao-autorizadas/")
      .reply(200, {
        results: [
          {
            dia: "05",
            numero_alunos: 12,
            inclusao_id_externo: "4E398",
            motivo: "Lanche Emergencial",
          },
        ],
      });
    mock
      .onGet("/dias-calendario/")
      .reply(200, mockDiasCalendarioEMEFDezembro2025);
    mock
      .onGet("/medicao-inicial/medicao/feriados-no-mes/")
      .reply(200, { results: ["25"] });

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem(
      "nome_instituicao",
      `"EMEF PERICLES EUGENIO DA SILVA RAMOS"`,
    );
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);
    localStorage.setItem("perfil", PERFIL.DIRETOR_UE);
    localStorage.setItem("modulo_gestao", MODULO_GESTAO.TERCEIRIZADA);

    const search = `?uuid=0dc919b7-aa30-48a0-bdff-e72e448a5094&ehGrupoSolicitacoesDeAlimentacao=true&ehGrupoETEC=false&ehPeriodoEspecifico=false`;
    Object.defineProperty(window, "location", {
      value: {
        search: search,
      },
    });

    await act(async () => {
      render(
        <MemoryRouter
          initialEntries={[
            {
              pathname: "/",
              state: mockStateSolicitacoesDeAlimentacaoEMEFDezembro2025,
            },
          ]}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          {" "}
          <MeusDadosContext.Provider
            value={{
              meusDados: mockMeusDadosEscolaEMEFPericles,
              setMeusDados: jest.fn(),
            }}
          >
            <PeriodoLancamentoMedicaoInicialPage />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });
  });

  it("Renderiza título da página `Lançamento Medição Inicial`", () => {
    expect(screen.getAllByText("Lançamento Medição Inicial").length).toBe(3);
  });

  it("Renderiza label `Mês do Lançamento` e seu valor", () => {
    expect(screen.getByText("Mês do Lançamento")).toBeInTheDocument();
  });

  it("renderiza valor `Dezembro / 2025` no input `Mês do Lançamento`", () => {
    const inputElement = screen.getByTestId("input-mes-lancamento");
    expect(inputElement).toHaveAttribute("value", "Dezembro / 2025");
  });

  it("renderiza valor `Solicitações de Alimentação` no input `Período de Lançamento`", () => {
    const inputElement = screen.getByTestId("input-periodo-lancamento");
    expect(inputElement).toHaveAttribute(
      "value",
      "Solicitações de Alimentação",
    );
  });

  it("Renderiza tabela de Solicitações de Alimentação com slots bloqueados", () => {
    expect(screen.getByText("SOLICITAÇÕES DE ALIMENTAÇÃO")).toBeInTheDocument();
    expect(screen.getByText("Lanche Emergencial")).toBeInTheDocument();
    expect(screen.getByText("Kit Lanche")).toBeInTheDocument();

    // ---- testa slots de Lanche Emergencial ----

    const inputLancheEmergencialDia05 = screen.getByTestId(
      "lanche_emergencial__dia_05__categoria_5",
    );
    expect(inputLancheEmergencialDia05).not.toBeDisabled();

    const inputLancheEmergencialDia06 = screen.getByTestId(
      "lanche_emergencial__dia_06__categoria_5",
    );
    expect(inputLancheEmergencialDia06).toBeDisabled();

    // ---- testa slots de Kit Lanche ----

    const inputKitLancheDia05 = screen.getByTestId(
      "kit_lanche__dia_05__categoria_5",
    );
    expect(inputKitLancheDia05).toBeDisabled();

    const inputKitLancheDia06 = screen.getByTestId(
      "kit_lanche__dia_06__categoria_5",
    );
    expect(inputKitLancheDia06).not.toBeDisabled();
  });
});
