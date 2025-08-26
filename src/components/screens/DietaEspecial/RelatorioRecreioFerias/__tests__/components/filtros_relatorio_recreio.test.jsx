import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import mock from "src/services/_mock";
import { MemoryRouter } from "react-router-dom";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockLotesSimples } from "src/mocks/lote.service/mockLotesSimples";
import { mockGetClassificacaoDieta } from "src/mocks/services/dietaEspecial.service/mockGetClassificacoesDietas";
import { mockGetUnidadeEducacional } from "src/mocks/services/dietaEspecial.service/mockGetUnidadeEducacional";
import { alergiasIntolerantes } from "src/components/screens/DietaEspecial/Relatorio/dados";
import { mockMeusDadosCODAEGA } from "src/mocks/meusDados/CODAE-GA";
import { Filtros } from "../../components/Filtros";

describe("Comportamentos filtros do Relatório de Dietas para Recreio nas Férias", () => {
  const carregaDietas = jest.fn();
  const _DRE = "775d49c5-9a84-4d5b-93e4-aa9d3a5f4459";

  beforeEach(async () => {
    mock.onGet("/lotes-simples/").reply(200, mockLotesSimples);
    mock.onGet("/classificacoes-dieta/").reply(200, mockGetClassificacaoDieta);
    mock.onGet("/alergias-intolerancias/").reply(200, alergiasIntolerantes());
    mock
      .onPost("/escolas-simplissima-com-eol/escolas-com-cod-eol/")
      .reply(200, mockGetUnidadeEducacional);
    localStorage.setItem(
      "tipo_perfil",
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA
    );
    localStorage.setItem(
      "perfil",
      PERFIL.COORDENADOR_GESTAO_ALIMENTACAO_TERCEIRIZADA
    );

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
              meusDados: mockMeusDadosCODAEGA,
              setMeusDados: jest.fn(),
            }}
          >
            <Filtros
              meusDados={mockMeusDadosCODAEGA}
              setValuesForm={jest.fn()}
              carregaDietas={carregaDietas}
              setErro={jest.fn()}
              setDietas={jest.fn()}
            />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      );
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    mock.reset();
  });

  it("Verifica se o componente e seus campos foram renderizados", () => {
    expect(screen.getByText(/filtrar resultados/i)).toBeInTheDocument();
    expect(screen.getByText(/unidades de destino/i)).toBeInTheDocument();
    expect(
      screen.getByText(/período atendimento da dieta/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/classificação das dietas/i)).toBeInTheDocument();
    expect(screen.getByText(/relação por diagnóstico/i)).toBeInTheDocument();
    expect(screen.getByText("DRE / Lote")).toBeInTheDocument();
    expect(screen.getByText("Filtrar")).toBeInTheDocument();
    expect(screen.getByText("Limpar Filtros")).toBeInTheDocument();
  });

  const setDre = (valor) => {
    const campoDre = screen.getByTestId("select-dre-lote");
    const select = campoDre.querySelector("select");
    fireEvent.change(select, {
      target: { value: valor },
    });
  };

  it("Seleciona DRE, verifica se opção está selecionada", async () => {
    await act(async () => {
      setDre(_DRE);
    });
    expect(screen.getByText("1 - BUTANTA")).toBeInTheDocument();
  });

  const filtrar = () => {
    const botaoFiltrar = screen.getByText("Filtrar");
    expect(botaoFiltrar).toBeInTheDocument();
    fireEvent.click(botaoFiltrar);
  };

  it("Seleciona DRE e chama o filtro", async () => {
    await act(async () => {
      setDre(_DRE);
    });
    filtrar();
    await waitFor(() => {
      expect(carregaDietas).toHaveBeenCalled();
    });
  });

  const getOpcoes = async (id) => {
    await waitFor(() => {
      const container = screen.getByTestId(id);
      const multiselect = within(container).getByRole("combobox");
      expect(multiselect).not.toBeDisabled();
    });
    const container = screen.getByTestId(id);
    const multiselect = within(container).getByRole("combobox");
    fireEvent.mouseDown(multiselect);
  };

  it("Seleciona DRE e verifica se foi carregado as 'unidades do lote'", async () => {
    await act(async () => {
      setDre(_DRE);
    });

    getOpcoes("unidades-educacionais-select");
    await waitFor(() => {
      const options = document.querySelectorAll(
        ".unidades-educacionais-select__option"
      );
      expect(options.length).toBeGreaterThan(0);
    });
  });

  it("Seleciona campo multi select de classificações e verifica retorno de opções", async () => {
    getOpcoes("classificassoes-select");
    await waitFor(() => {
      const options = document.querySelectorAll(
        ".classificassoes-select__option"
      );
      expect(options.length).toBeGreaterThan(0);
    });
  });

  it("Seleciona campo multi select de alergias e intolerâncias e verifica retorno de opções", async () => {
    getOpcoes("alergias-intolerancias-select");
    await waitFor(() => {
      const options = document.querySelectorAll(
        ".alergias-intolerancias-select__option"
      );
      expect(options.length).toBeGreaterThan(0);
    });
  });

  const setOpcao = async (id, placeholder) => {
    const unidadesSelect = screen.getByTestId(id);
    const input = within(unidadesSelect).getByRole("combobox");
    fireEvent.keyDown(input, { key: "ArrowDown" });
    await waitFor(() => {
      const option = screen.getByText(placeholder);
      fireEvent.click(option);
    });
  };

  const setData = async (id, valor) => {
    const divData = screen.getByTestId(id);
    const input = divData.querySelector("input");
    await waitFor(async () => {
      fireEvent.change(input, {
        target: { value: valor },
      });
    });
  };

  it("Preenche todos os campos do formulário e chama o botão filtrar", async () => {
    await act(async () => {
      setDre(_DRE);
    });

    await setOpcao("unidades-educacionais-select", "TODAS");

    await setOpcao("classificassoes-select", "TODAS");

    await setOpcao("alergias-intolerancias-select", "TODOS");

    setData("data-inicio-input", "01/01/2022");
    setData("data-fim-input", "01/01/2024");

    filtrar();
    await waitFor(() => {
      const callArgs = carregaDietas.mock.calls[0][0];
      expect(
        callArgs.unidades_educacionais_selecionadas.length
      ).toBeGreaterThan(0);
      expect(callArgs.classificacoes_selecionadas.length).toBeGreaterThan(0);
      expect(
        callArgs.alergias_intolerancias_selecionadas.length
      ).toBeGreaterThan(0);
      expect(callArgs.data_inicio).toBe("01/01/2022");
      expect(callArgs.data_fim).toBe("01/01/2024");
    });
  });
});
