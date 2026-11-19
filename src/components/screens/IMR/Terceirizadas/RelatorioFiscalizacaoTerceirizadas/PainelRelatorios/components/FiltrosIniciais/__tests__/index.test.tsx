import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import HTTP_STATUS from "http-status-codes";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import { FiltrosRelatoriosVisitasInterface } from "src/interfaces/imr.interface";
import { getDiretoriaregionalSimplissima } from "src/services/diretoriaRegional.service";
import { obterMesesAnosSupervisao } from "src/services/imr/painelGerencial";
import { FiltrosIniciais } from "../index";

jest.mock("src/services/imr/painelGerencial", () => ({
  obterMesesAnosSupervisao: jest.fn(),
}));

jest.mock("src/components/Shareable/Toast/dialogs", () => ({
  toastError: jest.fn(),
}));

jest.mock("src/services/diretoriaRegional.service", () => ({
  getDiretoriaregionalSimplissima: jest.fn(),
}));

const UUID_DRE_BUTANTA = "8f1da4a7-11b6-4a09-9eaa-6633d066f26b";
const UUID_DRE_CAMPO_LIMPO = "9db1e5d8-dba3-4245-b937-a94c4ea44411";
const MENSAGEM_ERRO =
  "Não foi possível carregar as Diretorias Regionais de Educação.";

const respostaDiretorias = {
  status: HTTP_STATUS.OK,
  data: {
    count: 2,
    next: null,
    previous: null,
    results: [
      { uuid: UUID_DRE_BUTANTA, nome: "DRE Butantã" },
      { uuid: UUID_DRE_CAMPO_LIMPO, nome: "DRE Campo Limpo" },
    ],
  },
};

const mockBuscarDiretorias = jest.mocked(getDiretoriaregionalSimplissima);
const mockBuscarMeses = jest.mocked(obterMesesAnosSupervisao);
const mockToastErro = jest.mocked(toastError);

const criarPromessaControlada = () => {
  let resolver;
  let rejeitar;
  const promessa = new Promise((resolve, reject) => {
    resolver = resolve;
    rejeitar = reject;
  });

  return { promessa, resolver, rejeitar };
};

const renderizarFiltros = (filtros: FiltrosRelatoriosVisitasInterface = {}) => {
  const aoAlterarFiltros = jest.fn();
  const resultado = render(
    <FiltrosIniciais filtros={filtros} aoAlterarFiltros={aoAlterarFiltros} />,
  );

  return { ...resultado, aoAlterarFiltros };
};

const obterCampoDre = () =>
  screen.getByRole("combobox", { name: "Diretoria Regional de Educação" });

const obterCampoMes = () =>
  screen.getByRole("combobox", { name: "Mês de referência" });

const aguardarMeses = () =>
  waitFor(() => expect(obterCampoMes()).toBeEnabled());

const aguardarDiretorias = () =>
  screen.findByRole("option", { name: "DRE Campo Limpo" });

describe("Filtros iniciais do painel de fiscalização", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockBuscarDiretorias.mockResolvedValue(respostaDiretorias);
    mockBuscarMeses.mockResolvedValue({
      status: HTTP_STATUS.OK,
      data: {
        results: [
          { mes: 12, ano: 2027 },
          { mes: 1, ano: 2027 },
          { mes: 9, ano: 2026 },
        ],
      },
    });
  });

  it("desabilita a DRE durante a consulta e apresenta as opções ao concluir", async () => {
    const requisicao = criarPromessaControlada();
    mockBuscarDiretorias.mockReturnValue(requisicao.promessa);
    const { aoAlterarFiltros } = renderizarFiltros();

    expect(obterCampoDre()).toBeDisabled();
    expect(obterCampoDre()).toBeRequired();
    expect(obterCampoDre()).toHaveValue("");
    expect(obterCampoMes()).toHaveValue("");
    expect(
      screen.getByRole("option", { name: "Selecione uma DRE" }),
    ).toBeInTheDocument();

    await act(async () => {
      requisicao.resolver(respostaDiretorias);
    });

    expect(obterCampoDre()).toBeEnabled();
    expect(screen.getByRole("option", { name: "DRE Butantã" })).toHaveValue(
      UUID_DRE_BUTANTA,
    );
    expect(screen.getByRole("option", { name: "DRE Campo Limpo" })).toHaveValue(
      UUID_DRE_CAMPO_LIMPO,
    );
    expect(mockBuscarDiretorias).toHaveBeenCalledTimes(1);
    expect(aoAlterarFiltros).not.toHaveBeenCalled();
    expect(mockToastErro).not.toHaveBeenCalled();
  });

  it("informa a DRE selecionada e limpa mês e ano", async () => {
    const { aoAlterarFiltros } = renderizarFiltros({ mes: 9, ano: 2026 });
    await aguardarDiretorias();

    fireEvent.change(obterCampoDre(), {
      target: { value: UUID_DRE_CAMPO_LIMPO },
    });

    expect(aoAlterarFiltros).toHaveBeenCalledTimes(1);
    expect(aoAlterarFiltros).toHaveBeenCalledWith({
      diretoria_regional: UUID_DRE_CAMPO_LIMPO,
      mes: undefined,
      ano: undefined,
    });
  });

  it("não consulta os meses enquanto nenhuma DRE estiver selecionada", async () => {
    renderizarFiltros();
    await aguardarDiretorias();

    expect(obterCampoMes()).toBeDisabled();
    expect(mockBuscarMeses).not.toHaveBeenCalled();
  });

  it("lista somente os meses retornados para a DRE selecionada", async () => {
    renderizarFiltros({ diretoria_regional: UUID_DRE_BUTANTA });
    await aguardarMeses();

    expect(mockBuscarMeses).toHaveBeenCalledWith(UUID_DRE_BUTANTA);
    expect(
      within(obterCampoMes())
        .getAllByRole("option")
        .map((opcao) => opcao.textContent),
    ).toEqual([
      "Selecione o mês",
      "Dezembro - 2027",
      "Janeiro - 2027",
      "Setembro - 2026",
    ]);
  });

  it("mantém o seletor habilitado apenas com a opção inicial quando não há meses", async () => {
    mockBuscarMeses.mockResolvedValue({
      status: HTTP_STATUS.OK,
      data: { results: [] },
    });
    renderizarFiltros({ diretoria_regional: UUID_DRE_BUTANTA });
    await aguardarMeses();

    expect(obterCampoMes()).toHaveValue("");
    expect(within(obterCampoMes()).getAllByRole("option")).toHaveLength(1);
    expect(within(obterCampoMes()).getByRole("option")).toHaveTextContent(
      "Selecione o mês",
    );
    expect(mockToastErro).not.toHaveBeenCalled();
  });

  it("informa a falha HTTP ao consultar os meses e encerra o carregamento", async () => {
    mockBuscarMeses.mockResolvedValue({
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      data: { results: [] },
    });
    renderizarFiltros({ diretoria_regional: UUID_DRE_BUTANTA });
    await aguardarMeses();

    expect(mockToastErro).toHaveBeenCalledWith(
      "Não foi possível carregar os meses de referência.",
    );
    expect(within(obterCampoMes()).getAllByRole("option")).toHaveLength(1);
  });

  it("informa a falha de conexão ao consultar os meses e encerra o carregamento", async () => {
    mockBuscarMeses.mockRejectedValue(new Error("Falha de conexão"));
    renderizarFiltros({ diretoria_regional: UUID_DRE_BUTANTA });
    await aguardarMeses();

    expect(mockToastErro).toHaveBeenCalledWith(
      "Não foi possível carregar os meses de referência.",
    );
    expect(within(obterCampoMes()).getAllByRole("option")).toHaveLength(1);
  });

  it("permite limpar a DRE junto com o mês selecionado", async () => {
    const { aoAlterarFiltros } = renderizarFiltros({
      diretoria_regional: UUID_DRE_BUTANTA,
      mes: 9,
      ano: 2026,
    });
    await aguardarDiretorias();

    fireEvent.change(obterCampoDre(), { target: { value: "" } });

    expect(aoAlterarFiltros).toHaveBeenCalledWith({
      diretoria_regional: "",
      mes: undefined,
      ano: undefined,
    });
  });

  it.each([
    { valor: "09/2026", mes: 9, ano: 2026 },
    { valor: "12/2027", mes: 12, ano: 2027 },
  ])(
    "converte $valor em mês e ano numéricos mantendo a DRE",
    async ({ valor, mes, ano }) => {
      const { aoAlterarFiltros } = renderizarFiltros({
        diretoria_regional: UUID_DRE_BUTANTA,
      });
      await aguardarDiretorias();
      await aguardarMeses();

      fireEvent.change(obterCampoMes(), { target: { value: valor } });

      expect(aoAlterarFiltros).toHaveBeenCalledWith({
        diretoria_regional: UUID_DRE_BUTANTA,
        mes,
        ano,
      });
    },
  );

  it("limpa mês e ano preservando a DRE", async () => {
    const { aoAlterarFiltros } = renderizarFiltros({
      diretoria_regional: UUID_DRE_BUTANTA,
      mes: 9,
      ano: 2026,
    });
    await aguardarDiretorias();

    await aguardarMeses();
    expect(obterCampoMes()).toHaveValue("09/2026");
    fireEvent.change(obterCampoMes(), { target: { value: "" } });

    expect(aoAlterarFiltros).toHaveBeenCalledWith({
      diretoria_regional: UUID_DRE_BUTANTA,
      mes: undefined,
      ano: undefined,
    });
  });

  it("reflete novos filtros recebidos sem consultar as DREs novamente", async () => {
    const { rerender, aoAlterarFiltros } = renderizarFiltros({
      diretoria_regional: UUID_DRE_BUTANTA,
      mes: 9,
      ano: 2026,
    });
    await aguardarDiretorias();

    await aguardarMeses();
    expect(obterCampoDre()).toHaveValue(UUID_DRE_BUTANTA);
    expect(obterCampoMes()).toHaveValue("09/2026");

    rerender(
      <FiltrosIniciais
        filtros={{
          diretoria_regional: UUID_DRE_CAMPO_LIMPO,
          mes: 1,
          ano: 2027,
        }}
        aoAlterarFiltros={aoAlterarFiltros}
      />,
    );

    await aguardarMeses();
    expect(obterCampoDre()).toHaveValue(UUID_DRE_CAMPO_LIMPO);
    expect(obterCampoMes()).toHaveValue("01/2027");
    expect(mockBuscarDiretorias).toHaveBeenCalledTimes(1);
    expect(aoAlterarFiltros).not.toHaveBeenCalled();
  });

  it("mantém apenas a opção inicial quando não há DREs cadastradas", async () => {
    mockBuscarDiretorias.mockResolvedValue({
      status: HTTP_STATUS.OK,
      data: { count: 0, next: null, previous: null, results: [] },
    });
    renderizarFiltros();

    await waitFor(() => expect(obterCampoDre()).toBeEnabled());

    expect(within(obterCampoDre()).getAllByRole("option")).toHaveLength(1);
    expect(mockToastErro).not.toHaveBeenCalled();
  });

  it("informa a falha HTTP e encerra o carregamento das DREs", async () => {
    mockBuscarDiretorias.mockResolvedValue({
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      data: { detail: "Erro ao consultar as DREs." },
    });
    renderizarFiltros();

    await waitFor(() => expect(obterCampoDre()).toBeEnabled());

    expect(mockToastErro).toHaveBeenCalledTimes(1);
    expect(mockToastErro).toHaveBeenCalledWith(MENSAGEM_ERRO);
    expect(within(obterCampoDre()).getAllByRole("option")).toHaveLength(1);
  });

  it("informa a falha de conexão e encerra o carregamento das DREs", async () => {
    mockBuscarDiretorias.mockRejectedValue(new Error("Falha de conexão"));
    renderizarFiltros();

    await waitFor(() => expect(obterCampoDre()).toBeEnabled());

    expect(mockToastErro).toHaveBeenCalledTimes(1);
    expect(mockToastErro).toHaveBeenCalledWith(MENSAGEM_ERRO);
  });

  it("ignora uma resposta de erro recebida depois de sair da tela", async () => {
    const requisicao = criarPromessaControlada();
    mockBuscarDiretorias.mockReturnValue(requisicao.promessa);
    const { unmount } = renderizarFiltros();

    unmount();
    await act(async () => {
      requisicao.resolver({
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        data: { detail: "Erro ao consultar as DREs." },
      });
    });

    expect(mockToastErro).not.toHaveBeenCalled();
  });

  it("ignora uma falha de conexão recebida depois de sair da tela", async () => {
    const requisicao = criarPromessaControlada();
    mockBuscarDiretorias.mockReturnValue(requisicao.promessa);
    const { unmount } = renderizarFiltros();

    unmount();
    await act(async () => {
      requisicao.rejeitar(new Error("Falha de conexão"));
    });

    expect(mockToastErro).not.toHaveBeenCalled();
  });
});
