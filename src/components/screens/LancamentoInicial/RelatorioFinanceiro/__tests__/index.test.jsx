import {
  act,
  render,
  screen,
  fireEvent,
  cleanup,
  within,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { RelatorioFinanceiro } from "../index";
import { mockMeusDadosSuperUsuarioMedicao } from "src/mocks/meusDados/superUsuarioMedicao";
import { mockLotesSimples } from "src/mocks/lote.service/mockLotesSimples";
import { mockGetGrupoUnidadeEscolar } from "src/mocks/services/escola.service/mockGetGrupoUnidadeEscolar";
import { mockRelatoriosFinanceiro } from "src/mocks/services/relatorioFinanceiro.service/mockGetRelatoriosFinanceiro";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockGetMesesAnosMedicaoInicial } from "src/mocks/services/dashboard.service/mockGetMesesAnosMedicaoInicial";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import mock from "src/services/_mock";

describe("Testes da interface de Relatorio Financeiro", () => {
  beforeEach(async () => {
    mock
      .onGet("/grupos-unidade-escolar/")
      .reply(200, mockGetGrupoUnidadeEscolar);
    mock.onGet("/lotes-simples/").reply(200, mockLotesSimples);
    mock
      .onGet("/usuarios/meus-dados/")
      .reply(200, mockMeusDadosSuperUsuarioMedicao);
    mock
      .onGet("/medicao-inicial/relatorio-financeiro/")
      .reply(200, mockRelatoriosFinanceiro);
    mock
      .onGet("/medicao-inicial/solicitacao-medicao-inicial/meses-anos/")
      .reply(200, mockGetMesesAnosMedicaoInicial);

    localStorage.setItem("perfil", PERFIL.ADMINITRADOR_MEDICAO);
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.MEDICAO);

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
              meusDados: mockMeusDadosSuperUsuarioMedicao,
              setMeusDados: jest.fn(),
            }}
          >
            <RelatorioFinanceiro />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });
  });

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
    mock.resetHandlers();
  });

  it("deve renderizar os filtros corretamente", () => {
    expect(screen.getByText("Filtrar Resultados")).toBeInTheDocument();
    expect(screen.getAllByText("Lote e DRE")).toHaveLength(2);
    expect(screen.getAllByText("Tipo de Unidade")).toHaveLength(2);
    expect(screen.getAllByText("Mês de Referência")).toHaveLength(2);
    expect(screen.getAllByText("Status")).toHaveLength(2);
    expect(screen.getByText("Filtrar").closest("button")).toBeInTheDocument();
    expect(
      screen.getByText("Limpar Filtros").closest("button"),
    ).toBeInTheDocument();
  });

  // O @khanacademy/react-multi-select só abre o painel no clique do
  // .dropdown-heading (não no mouseDown do container) e, sem abrir o painel,
  // o findByRole abaixo rejeita a promise sem ninguém aguardar — a rejeição
  // vira falha intermitente do teste.
  const setMultiSelect = async (label, value) => {
    const selectLabel = screen
      .getAllByText(label)
      .find((element) => element.tagName === "LABEL");
    const dropdown = selectLabel.closest(".final-form-multi-select");

    fireEvent.click(dropdown.querySelector(".dropdown-heading"));

    const listbox = await screen.findByRole("listbox");
    fireEvent.click(within(listbox).getByText(value));

    fireEvent.mouseDown(document.body);
    fireEvent.click(document.body);
  };

  it("deve exibir resultados ao selecionar filtro e clicar em filtrar", async () => {
    await setMultiSelect("Lote e DRE", "1 - SANTO AMARO");

    const filtrar = screen.getByText("Filtrar").closest("button");
    fireEvent.click(filtrar);

    expect(screen.getByText("Resultados da Pesquisa")).toBeInTheDocument();

    expect(
      screen.getAllByText(/DIRETORIA REGIONAL DE EDUCACAO CAPELA DO SOCORRO/i),
    ).toHaveLength(2);

    expect(screen.getByText("Grupo 6 (CIEJA, CMCT)")).toBeInTheDocument();
    expect(screen.getByText("Grupo 1 (CCI, CEI, CEI CEU)")).toBeInTheDocument();
  });

  it("deve limpar o campo selecionado ao clicar em limpar filtros", async () => {
    await setMultiSelect("Lote e DRE", "1 - SANTO AMARO");

    expect(screen.getByText("1 - SANTO AMARO")).toBeInTheDocument();

    const limpar = screen.getByText("Limpar Filtros").closest("button");
    fireEvent.click(limpar);

    expect(screen.queryByText("1 - SANTO AMARO")).not.toBeInTheDocument();
  });

  it("deve abrir o ModalAnalisar ao clicar em opção Analisar", () => {
    fireEvent.click(screen.getByTitle("Analisar"));

    expect(
      screen.getByText("Analisar ou Visualizar Medição"),
    ).toBeInTheDocument();
  });
});
