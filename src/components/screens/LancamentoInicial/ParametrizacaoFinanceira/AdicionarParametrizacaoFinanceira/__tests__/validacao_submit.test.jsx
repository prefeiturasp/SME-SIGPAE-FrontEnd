import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  cleanup,
} from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { mockFaixasEtarias } from "src/mocks/faixaEtaria.service/mockGetFaixasEtarias";
import { mockListaNumeros } from "src/mocks/LancamentoInicial/CadastroDeClausulas/listaDeNumeros";
import { mockLotesSimples } from "src/mocks/lote.service/mockLotesSimples";
import { mockGetTiposUnidadeEscolarTiposAlimentacao } from "src/mocks/services/cadastroTipoAlimentacao.service/mockGetTiposUnidadeEscolarTiposAlimentacao";
import { mockGetGrupoUnidadeEscolar } from "src/mocks/services/escola.service/mockGetGrupoUnidadeEscolar";
import { mockGetDadosParametrizacaoFinanceira } from "src/mocks/services/parametrizacao_financeira.service/mockGetDadosParametrizacaoFinanceira";
import { mockParametrizacoesFinanceiras } from "src/mocks/services/parametrizacao_financeira.service/mockGetParametrizacoesFinanceiras";
import AdicionarParametrizacaoFinanceira from "../index";
import mock from "src/services/_mock";

jest.mock("src/components/Shareable/DatePicker", () => ({
  InputComData: ({ input, placeholder, disabled }) => (
    <input
      data-testid={input.name}
      placeholder={placeholder}
      disabled={disabled}
      value={input.value || ""}
      onChange={(e) => input.onChange(e.target.value)}
    />
  ),
}));

const edital = mockListaNumeros.results[0];
const lote = mockLotesSimples.results[0];
const grupo1 = mockGetGrupoUnidadeEscolar.results.find(
  (grupo) => grupo.nome === "Grupo 1",
);
const uuid = mockGetDadosParametrizacaoFinanceira.uuid;
const novaUuid = mockParametrizacoesFinanceiras.results[0].uuid;
const origemUuid = mockParametrizacoesFinanceiras.results[1].uuid;
const faixa = mockFaixasEtarias.results[1].__str__;

let listaFinanceira = { count: 0, results: [] };

const responderBases = () => {
  mock.onGet("/editais/lista-numeros/").reply(200, mockListaNumeros);
  mock.onGet("/lotes-simples/").reply(200, mockLotesSimples);
  mock.onGet("/grupos-unidade-escolar/").reply(200, mockGetGrupoUnidadeEscolar);
  mock.onGet("/faixas-etarias/").reply(200, mockFaixasEtarias);
  mock
    .onGet("/tipos-unidade-escolar-agrupados/")
    .reply(200, mockGetTiposUnidadeEscolarTiposAlimentacao);
  mock
    .onGet(/dados-parametrizacao-financeira/)
    .reply(200, mockGetDadosParametrizacaoFinanceira);
  mock
    .onGet("/medicao-inicial/parametrizacao-financeira/")
    .reply(() => [200, listaFinanceira]);
};

function Rota() {
  const location = useLocation();
  return (
    <div data-testid="rota">{`${location.pathname}${location.search}`}</div>
  );
}

const renderPagina = async (route = "/") => {
  await act(async () => {
    render(
      <MemoryRouter initialEntries={[route]}>
        <AdicionarParametrizacaoFinanceira />
        <ToastContainer />
        <Rota />
      </MemoryRouter>,
    );
  });
};

const preencherCadastro = async () => {
  await waitFor(() => {
    expect(
      screen.getByTestId("edital-select").querySelector("select").options
        .length,
    ).toBeGreaterThan(1);
  });
  const alterar = (id, value) => {
    fireEvent.change(screen.getByTestId(id).querySelector("select"), {
      target: { value },
    });
  };
  alterar("edital-select", edital.uuid);
  alterar("lote-select", lote.uuid);
  alterar("grupo-unidade-select", grupo1.uuid);
  fireEvent.change(screen.getByTestId("data_inicial"), {
    target: { value: "01/01/2099" },
  });
};

const reiniciar = async (route = "/") => {
  cleanup();
  mock.reset();
  responderBases();
  await renderPagina(route);
};

const confirmarSalvar = async () => {
  fireEvent.click(screen.getByTestId("botao-salvar"));
  const botaoSim = await screen.findByText("Sim");
  fireEvent.click(botaoSim.closest("button"));
};

const carregarTabelas = async () => {
  await preencherCadastro();
  fireEvent.click(screen.getByTestId("botao-carregar"));
  await screen.findAllByTestId(/\.valor_unitario$/);
};

const preencherValores = () => {
  screen.getAllByTestId(/\.valor_unitario$/).forEach((input) => {
    fireEvent.change(input, { target: { value: "1,00" } });
  });
};

describe("Validação e submissão da parametrização financeira", () => {
  beforeEach(() => {
    mock.reset();
    listaFinanceira = { count: 0, results: [] };
    responderBases();
  });

  afterEach(() => {
    cleanup();
    mock.reset();
  });

  it("impede o envio quando as tabelas carregadas estão sem valores", async () => {
    await renderPagina();
    await carregarTabelas();
    await confirmarSalvar();

    expect(
      await screen.findByText(/Não foi possível finalizar a parametrização/i),
    ).toBeInTheDocument();
  });

  it("cadastra, edita e trata os erros da API", async () => {
    mock.onPost("/medicao-inicial/parametrizacao-financeira/").reply(201, {});
    await renderPagina();
    await carregarTabelas();
    preencherValores();
    await confirmarSalvar();
    expect(
      await screen.findByText(
        "Parametrização Financeira cadastrada com sucesso!",
      ),
    ).toBeInTheDocument();

    await reiniciar(`/?uuid=${uuid}`);
    mock
      .onPatch(`/medicao-inicial/parametrizacao-financeira/${uuid}/`)
      .reply(200, {});
    await waitFor(() => {
      expect(
        screen.getByTestId("edital-select").querySelector("select").value,
      ).toBe(edital.uuid);
    });
    preencherValores();
    await confirmarSalvar();
    expect(
      await screen.findByText("Parametrização Financeira editada com sucesso!"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(
        `tabelas[Preço das Alimentações - Período Integral].${faixa}.valor_unitario`,
      ),
    ).toBeDisabled();

    await reiniciar(`/?nova_uuid=${novaUuid}`);
    mock
      .onPatch(`/medicao-inicial/parametrizacao-financeira/${novaUuid}/`)
      .reply(200, {});
    await waitFor(() => {
      expect(screen.getByTestId("data_inicial")).toHaveValue(
        mockGetDadosParametrizacaoFinanceira.data_inicial,
      );
    });
    preencherValores();
    await confirmarSalvar();
    expect(
      await screen.findByText(
        "Parametrização Financeira cadastrada com sucesso!",
      ),
    ).toBeInTheDocument();
  });

  it("exibe as mensagens específicas de erro ao salvar", async () => {
    mock.onPost("/medicao-inicial/parametrizacao-financeira/").reply(400, {
      non_field_errors: ["Vigência duplicada"],
    });
    await renderPagina();
    await carregarTabelas();
    preencherValores();
    await confirmarSalvar();
    expect(await screen.findByText("Vigência duplicada")).toBeInTheDocument();

    await reiniciar();
    mock.onPost("/medicao-inicial/parametrizacao-financeira/").reply(400, {
      detail: "erro",
    });
    await carregarTabelas();
    preencherValores();
    await confirmarSalvar();
    expect(
      await screen.findByText(/inclusão da parametrização/i),
    ).toBeInTheDocument();

    await reiniciar(`/?uuid=${uuid}`);
    mock
      .onPatch(`/medicao-inicial/parametrizacao-financeira/${uuid}/`)
      .reply(400, { detail: "erro" });
    await waitFor(() => {
      expect(screen.getByTestId("data_inicial")).toHaveValue(
        mockGetDadosParametrizacaoFinanceira.data_inicial,
      );
    });
    preencherValores();
    await confirmarSalvar();
    expect(
      await screen.findByText(/edição da parametrização/i),
    ).toBeInTheDocument();

    await reiniciar();
    mock.onPost("/medicao-inicial/parametrizacao-financeira/").networkError();
    await carregarTabelas();
    preencherValores();
    await confirmarSalvar();
    expect(
      await screen.findByText("Ocorreu um erro inesperado"),
    ).toBeInTheDocument();
  });

  it("cancela a nova parametrização e informa falha ao excluir", async () => {
    mock
      .onDelete(`/medicao-inicial/parametrizacao-financeira/${novaUuid}/`)
      .reply(204);
    await renderPagina(`/?nova_uuid=${novaUuid}`);
    fireEvent.click(screen.getByTestId("botao-cancelar"));
    fireEvent.click(await screen.findByText("Sim"));
    await waitFor(() => {
      expect(screen.getByTestId("rota")).toHaveTextContent(
        "/medicao-inicial/parametrizacao-financeira/",
      );
    });

    await reiniciar(`/?nova_uuid=${novaUuid}`);
    mock
      .onDelete(`/medicao-inicial/parametrizacao-financeira/${novaUuid}/`)
      .reply(500, {});
    fireEvent.click(screen.getByTestId("botao-cancelar"));
    fireEvent.click(await screen.findByText("Sim"));
    expect(
      await screen.findByText(
        "Ocorreu um erro inesperado ao cancelar a parametrização.",
      ),
    ).toBeInTheDocument();
  });

  it("abre o salvamento da cópia somente quando não há conflito", async () => {
    await renderPagina(`/?uuid_origem=${origemUuid}`);
    await waitFor(() => {
      expect(screen.getByTestId("data_inicial")).toHaveValue(
        mockGetDadosParametrizacaoFinanceira.data_inicial,
      );
    });
    fireEvent.click(screen.getByTestId("botao-salvar"));
    expect(
      await screen.findByText("Salvar Parametrização Financeira"),
    ).toBeInTheDocument();

    listaFinanceira = mockParametrizacoesFinanceiras;
    await reiniciar(`/?uuid_origem=${origemUuid}`);
    await waitFor(() => {
      expect(screen.getByTestId("data_inicial")).toHaveValue(
        mockGetDadosParametrizacaoFinanceira.data_inicial,
      );
    });
    fireEvent.click(screen.getByTestId("botao-salvar"));
    expect(
      await screen.findByText("Conflito no período de Vigência"),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Salvar Parametrização Financeira"),
    ).not.toBeInTheDocument();
  });
});
