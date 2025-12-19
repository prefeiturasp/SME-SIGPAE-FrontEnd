import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosSuperUsuarioMedicao } from "src/mocks/meusDados/superUsuarioMedicao";
import { mockLotesSimples } from "src/mocks/lote.service/mockLotesSimples";
import { mockGetGrupoUnidadeEscolar } from "src/mocks/services/escola.service/mockGetGrupoUnidadeEscolar";
import { mockListaNumeros } from "src/mocks/LancamentoInicial/CadastroDeClausulas/listaDeNumeros";
import { mockFaixasEtarias } from "src/mocks/faixaEtaria.service/mockGetFaixasEtarias";
import { mockGetTiposUnidadeEscolarTiposAlimentacao } from "src/mocks/services/cadastroTipoAlimentacao.service/mockGetTiposUnidadeEscolarTiposAlimentacao";
import AdicionarParametrizacaoFinanceira from "../index";
import mock from "src/services/_mock";
import { mockParametrizacoesFinanceiras } from "src/mocks/services/parametrizacao_financeira.service/mockGetParametrizacoesFinanceiras";

jest.mock("src/components/Shareable/DatePicker", () => ({
  InputComData: ({ input, placeholder }) => (
    <input
      data-testid={input.name}
      placeholder={placeholder}
      value={input.value}
      onChange={(e) => input.onChange(e.target.value)}
    />
  ),
}));

describe("Testes formulário de cadastro - Parametrização Financeira", () => {
  beforeEach(async () => {
    mock.onGet("/editais/lista-numeros/").reply(200, mockListaNumeros);
    mock
      .onGet("/grupos-unidade-escolar/")
      .reply(200, mockGetGrupoUnidadeEscolar);
    mock.onGet("/lotes-simples/").reply(200, mockLotesSimples);
    mock
      .onGet("/usuarios/meus-dados/")
      .reply(200, mockMeusDadosSuperUsuarioMedicao);
    mock.onPost("/medicao-inicial/parametrizacao-financeira/").reply(201, {});
    mock.onGet("/faixas-etarias/").reply(200, mockFaixasEtarias);
    mock
      .onGet("/tipos-unidade-escolar-agrupados/")
      .reply(200, mockGetTiposUnidadeEscolarTiposAlimentacao);
    mock
      .onGet("/medicao-inicial/parametrizacao-financeira/")
      .reply(200, mockParametrizacoesFinanceiras);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
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
            <AdicionarParametrizacaoFinanceira />
            <ToastContainer />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });
  });

  it("verifica se a interface foi renderizada", () => {
    expect(screen.getByText("Nº do Edital")).toBeInTheDocument();
    expect(screen.getByText("Lote e DRE")).toBeInTheDocument();
    expect(screen.getByText("Salvar")).toBeInTheDocument();
  });

  const setSelect = (id, valor) => {
    const campoDre = screen.getByTestId(id);
    const select = campoDre.querySelector("select");
    fireEvent.change(select, {
      target: { value: valor },
    });
  };

  const setData = async (placeholder, valor) => {
    const input = screen.getByTestId(placeholder);
    fireEvent.change(input, { target: { value: valor } });
  };

  const setInput = (testId, value) => {
    const input = screen.getByTestId(testId);
    fireEvent.change(input, { target: { value } });
    return input;
  };

  it("deve preencher os campos obrigatórios do formulário e clica em salvar", async () => {
    setSelect("edital-select", "752c11a3-b4fe-4f1c-b9af-61d42f0a6b56");
    setSelect("lote-select", "e67daf61-810c-45f0-8eeb-a75dbe4be608");
    setSelect("grupo-unidade-select", "3601dfe6-4dd5-4099-9607-00cbfd04f49e");
    setData("data_inicial", "01/09/2025");

    const botao = screen.getByTestId("botao-salvar");
    expect(botao).toBeInTheDocument();
    fireEvent.click(botao);

    await waitFor(() => {
      expect(
        screen.getByText("Salvar Parametrização Financeira"),
      ).toBeInTheDocument();
    });

    const botaoNao = screen.getByText("Não").closest("button");
    fireEvent.click(botaoNao);

    await waitFor(() => {
      expect(
        screen.queryByText("Salvar Parametrização Financeira"),
      ).not.toBeInTheDocument();
    });
  });

  const carregarTabelas = () => {
    const botao = screen.getByTestId("botao-carregar");
    expect(botao).toBeInTheDocument();
    expect(botao).not.toBeDisabled();
    fireEvent.click(botao);
  };

  it("deve preencher os campos obrigatórios, clicar em carregar e visualizar tabelas grupo 1 - CEI", async () => {
    setSelect("edital-select", "752c11a3-b4fe-4f1c-b9af-61d42f0a6b56");
    setSelect("lote-select", "e67daf61-810c-45f0-8eeb-a75dbe4be608");
    setSelect("grupo-unidade-select", "550e8400-e29b-41d4-a716-446655440000");
    setData("data_inicial", "01/09/2025");

    carregarTabelas();

    await waitFor(() => {
      expect(
        screen.getAllByText(/Dietas Tipo A e Tipo A Enteral/i),
      ).toHaveLength(2);
      expect(screen.getAllByText(/Preço das Alimentações/i)).toHaveLength(2);
      expect(screen.getAllByText(/Dietas Tipo B/i)).toHaveLength(2);
      expect(screen.getAllByText(/Período Integral/i)).toHaveLength(3);
      expect(screen.getAllByText(/Período Parcial/i)).toHaveLength(3);
    });

    const faixasEtarias = mockFaixasEtarias.results;

    setInput(
      `tabelas[Preço das Alimentações - Período Integral].${faixasEtarias[0].__str__}.valor_unitario`,
      "3,00",
    );
    setInput(
      `tabelas[Preço das Alimentações - Período Integral].${faixasEtarias[0].__str__}.valor_unitario_reajuste`,
      "3,00",
    );
    const totalAlimentacoesIntegral = screen.getByTestId(
      `tabelas[Preço das Alimentações - Período Integral].${faixasEtarias[0].__str__}.valor_unitario_total`,
    );
    const totalDietasTipoA = screen.getByTestId(
      `tabelas[Dietas Tipo A e Tipo A Enteral/Restrição de Aminoácidos - Período Integral].${faixasEtarias[0].__str__}.valor_unitario_total`,
    );
    const totalDietasTipoB = screen.getByTestId(
      `tabelas[Dietas Tipo B - Período Integral].${faixasEtarias[0].__str__}.valor_unitario_total`,
    );

    await waitFor(() => {
      expect(totalAlimentacoesIntegral.value).toBe("6,00");
      expect(totalDietasTipoA.value).toBe("6,00");
      expect(totalDietasTipoB.value).toBe("6,00");
    });
  });

  it("deve preencher os campos obrigatórios, clicar em carregar e visualizar tabelas grupo 2 - CEMEI", async () => {
    setSelect("edital-select", "557d1c87-ea6c-4911-8876-2a133f754ea1");
    setSelect("lote-select", "775d49c5-9a84-4d5b-93e4-aa9d3a5f4459");
    setSelect("grupo-unidade-select", "3601dfe6-4dd5-4099-9607-00cbfd04f49e");
    setData("data_inicial", "01/11/2025");
    setData("data_final", "30/11/2025");

    carregarTabelas();

    await waitFor(() => {
      expect(
        screen.queryAllByText(/Preço das Dietas Tipo A e Tipo A Enteral/i),
      ).toHaveLength(3);
      expect(screen.queryAllByText(/Preço das Alimentações/i)).toHaveLength(3);
      expect(screen.queryAllByText(/Preço das Dietas Tipo B/i)).toHaveLength(3);
      expect(screen.queryAllByText(/Turma Infantil - EMEI/i)).toHaveLength(3);
      expect(screen.queryAllByText(/CEI - Período Parcial/i)).toHaveLength(3);
      expect(screen.queryAllByText(/CEI - Período Integral/i)).toHaveLength(3);
      expect(screen.getByText(/Kit Lanche/i)).toBeInTheDocument();
    });

    setInput(
      "tabelas[Preço das Alimentações - Turma Infantil - EMEI].Lanche.valor_unitario",
      "5,00",
    );
    setInput(
      "tabelas[Preço das Alimentações - Turma Infantil - EMEI].Lanche.valor_unitario_reajuste",
      "5,00",
    );
    const totalAlimentacoesEMEI = screen.getByTestId(
      "tabelas[Preço das Alimentações - Turma Infantil - EMEI].Lanche.valor_unitario_total",
    );
    const totalDietasTipoAEMEI = screen.getByTestId(
      "tabelas[Dietas Tipo A e Tipo A Enteral - Turma Infantil - EMEI].Lanche.valor_unitario_total",
    );
    const totalDietasTipoBEMEI = screen.getByTestId(
      "tabelas[Dietas Tipo B - Turma Infantil - EMEI].Lanche.valor_unitario_total",
    );

    await waitFor(() => {
      expect(totalAlimentacoesEMEI.value).toBe("10,00");
      expect(totalDietasTipoAEMEI.value).toBe("10,00");
      expect(totalDietasTipoBEMEI.value).toBe("10,00");
    });
  });

  it("deve preencher os campos obrigatórios, clicar em carregar e visualizar tabelas grupo 3 - EMEI", async () => {
    setSelect("edital-select", "3dea0d3c-eea2-4f32-90a6-ebae3597374b");
    setSelect("lote-select", "775d49c5-9a84-4d5b-93e4-aa9d3a5f4459");
    setSelect("grupo-unidade-select", "743ed59c-9861-4230-860e-e01e2e080327");
    setData("data_inicial", "01/09/2025");
    setData("data_final", "30/09/2025");

    carregarTabelas();

    await waitFor(() => {
      expect(
        screen.getByText(/Preço das Dietas Tipo A e Tipo A Enteral/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/Preço das Alimentações/i)).toBeInTheDocument();
      expect(screen.getByText(/Preço das Dietas Tipo B/i)).toBeInTheDocument();
      expect(screen.getByText(/Kit Lanche/i)).toBeInTheDocument();
    });
  });

  it("deve preencher os campos obrigatórios, clicar em carregar e visualizar tabelas grupo 4 - EMEF", async () => {
    setSelect("edital-select", "d5e05d2a-1d4f-456f-ac9a-07ecde54b1b3");
    setSelect("lote-select", "775d49c5-9a84-4d5b-93e4-aa9d3a5f4459");
    setSelect("grupo-unidade-select", "5bd9ad5c-e0ab-4812-b2b6-336fc8988960");
    setData("data_inicial", "01/12/2025");
    setData("data_final", "31/12/2025");

    carregarTabelas();

    await waitFor(() => {
      expect(screen.getByText(/Preço das Alimentações/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Preço das Dietas Tipo A e Tipo A Enteral/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/Preço das Dietas Tipo B/i)).toBeInTheDocument();
      expect(
        screen.queryAllByText(/- CEU EMEF, CEU GESTÃO, EMEF, EMEFM/i),
      ).toHaveLength(2);
      expect(screen.queryAllByText(/- EJA/i)).toHaveLength(2);
      expect(screen.getByText(/Kit Lanche/i)).toBeInTheDocument();
    });

    setInput(
      "tabelas[Preço das Alimentações].Refeição - CEU EMEF, CEU GESTÃO, EMEF, EMEFM.valor_unitario",
      "5,00",
    );
    setInput(
      "tabelas[Preço das Alimentações].Refeição - CEU EMEF, CEU GESTÃO, EMEF, EMEFM.valor_unitario_reajuste",
      "5,00",
    );
    setInput(
      "tabelas[Preço das Alimentações].Refeição - EJA.valor_unitario",
      "6,00",
    );
    setInput(
      "tabelas[Preço das Alimentações].Refeição - EJA.valor_unitario_reajuste",
      "6,00",
    );
    const totalRefeicaoEmef = screen.getByTestId(
      "tabelas[Preço das Alimentações].Refeição - CEU EMEF, CEU GESTÃO, EMEF, EMEFM.valor_unitario_total",
    );
    const totalRefeicaoEja = screen.getByTestId(
      "tabelas[Preço das Alimentações].Refeição - EJA.valor_unitario_total",
    );
    const totalDietasTipoAEmef = screen.getByTestId(
      "tabelas[Dietas Tipo A e Tipo A Enteral/Restrição de Aminoácidos].Refeição - Dieta Enteral - CEU EMEF, CEU GESTÃO, EMEF, EMEFM.valor_unitario",
    );
    const totalDietasTipoAEja = screen.getByTestId(
      "tabelas[Dietas Tipo A e Tipo A Enteral/Restrição de Aminoácidos].Refeição - Dieta Enteral - EJA.valor_unitario",
    );

    await waitFor(() => {
      expect(totalRefeicaoEmef.value).toBe("10,00");
      expect(totalDietasTipoAEmef.value).toBe("10,00");
      expect(totalRefeicaoEja.value).toBe("12,00");
      expect(totalDietasTipoAEja.value).toBe("12,00");
    });
  });

  it("deve preencher os campos obrigatórios, clicar em carregar e visualizar tabelas grupo 5 - EMEBS", async () => {
    setSelect("edital-select", "ff94d604-4468-4553-9b54-6b428ce3be75");
    setSelect("lote-select", "775d49c5-9a84-4d5b-93e4-aa9d3a5f4459");
    setSelect("grupo-unidade-select", "fd9907bf-b64e-4e35-8e8d-4909d4daa778");
    setData("data_inicial", "01/12/2025");
    setData("data_final", "31/12/2025");

    carregarTabelas();

    await waitFor(() => {
      expect(screen.queryAllByText(/Preço das Alimentações/i)).toHaveLength(2);
      expect(
        screen.queryAllByText(/Preço das Dietas Tipo A e Tipo A Enteral/i),
      ).toHaveLength(2);
      expect(screen.queryAllByText(/Preço das Dietas Tipo B/i)).toHaveLength(2);
      expect(screen.queryAllByText(/Kit Lanche/i)).toHaveLength(2);
      expect(screen.queryAllByText(/EMEBS Infantil/i)).toHaveLength(3);
      expect(screen.queryAllByText(/EMEBS Fundamental/i)).toHaveLength(3);
    });

    setInput(
      "tabelas[Preço das Alimentações - EMEBS Fundamental].Lanche.valor_unitario",
      "10,00",
    );
    setInput(
      "tabelas[Preço das Alimentações - EMEBS Fundamental].Lanche.valor_unitario_reajuste",
      "10,00",
    );
    const totalAlimentacoesFundamental = screen.getByTestId(
      "tabelas[Preço das Alimentações - EMEBS Fundamental].Lanche.valor_unitario_total",
    );
    const totalDietasTipoAFundamental = screen.getByTestId(
      "tabelas[Dietas Tipo A e Tipo A Enteral/Restrição de Aminoácidos - EMEBS Fundamental].Lanche.valor_unitario_total",
    );
    const totalDietasTipoBFundamental = screen.getByTestId(
      "tabelas[Dietas Tipo B - EMEBS Fundamental].Lanche.valor_unitario_total",
    );

    await waitFor(() => {
      expect(totalAlimentacoesFundamental.value).toBe("20,00");
      expect(totalDietasTipoAFundamental.value).toBe("20,00");
      expect(totalDietasTipoBFundamental.value).toBe("20,00");
    });
  });

  it("deve preencher os campos obrigatórios, clicar em carregar e visualizar tabelas grupo 6 - CIEJA", async () => {
    setSelect("edital-select", "172e71fa-e0df-4842-a91c-4542d5778aae");
    setSelect("lote-select", "775d49c5-9a84-4d5b-93e4-aa9d3a5f4459");
    setSelect("grupo-unidade-select", "fd04e2b8-c952-46f4-b5af-7260e6b7ace8");
    setData("data_inicial", "01/12/2025");
    setData("data_final", "31/12/2025");

    carregarTabelas();

    await waitFor(() => {
      expect(
        screen.getByText(/Preço das Dietas Tipo A e Tipo A Enteral/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/Preço das Alimentações/i)).toBeInTheDocument();
      expect(screen.getByText(/Preço das Dietas Tipo B/i)).toBeInTheDocument();
      expect(screen.getByText(/Kit Lanche/i)).toBeInTheDocument();
    });

    const botaoSalvar = screen.getByTestId("botao-salvar");
    expect(botaoSalvar).toBeInTheDocument();
    fireEvent.click(botaoSalvar);

    const botaoSim = screen.getByText("Sim").closest("button");
    fireEvent.click(botaoSim);

    await waitFor(() => {
      expect(
        screen.getByText("Parametrização Financeira cadastrada com sucesso!"),
      ).toBeInTheDocument();
    });
  });

  it("deve retornar o modal de conflito de vigência", async () => {
    setSelect("edital-select", "31587b4e-6aed-48d6-913c-7d9939032f15");
    setSelect("lote-select", "4e72e8e5-f0d3-4315-998e-2dfc7b8fff45");
    setSelect("grupo-unidade-select", "743ed59c-9861-4230-860e-e01e2e080327");
    setData("data_inicial", "01/12/2025");

    carregarTabelas();

    await waitFor(() => {
      expect(
        screen.getByText("Conflito no período de Vigência"),
      ).toBeInTheDocument();
    });
  });

  it("deve clicar em cancelar e exibir modal de cancelamento", async () => {
    const botao = screen.getByTestId("botao-cancelar");
    fireEvent.click(botao);

    await waitFor(() => {
      expect(
        screen.getByText("Cancelar Parametrização Financeira"),
      ).toBeInTheDocument();
    });
  });
});
