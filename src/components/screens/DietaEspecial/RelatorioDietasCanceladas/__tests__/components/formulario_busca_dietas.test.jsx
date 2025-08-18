import {
  render,
  screen,
  act,
  waitFor,
  fireEvent,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import mock from "src/services/_mock";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockMeusDadosCODAEGA } from "src/mocks/meusDados/CODAE-GA";
import { mockFiltrosRelatorioDietasEspeciais } from "src/mocks/services/dietaEspecial.service/mockGetFiltrosRelatorioDietasEspeciais";
import { mockRelatorioDietasEpeciais } from "src/mocks/services/dietaEspecial.service/relatorioDietasEspeciaisTerceirizada";
import { Filtros } from "../../components/Filtros";
import { mockGetUnidadeEducacional } from "src/mocks/services/dietaEspecial.service/mockGetUnidadeEducacional";

describe("Verifica comportamentos componente de filtros do relatório de dietas canceladas", () => {
  const setUnidades = jest.fn();
  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCODAEGA);
    mock
      .onGet(
        "/solicitacoes-dieta-especial/relatorio-dieta-especial-terceirizada/"
      )
      .reply(200, mockRelatorioDietasEpeciais);
    mock
      .onPost("/escolas-simplissima-com-eol/terc-total/")
      .reply(200, mockGetUnidadeEducacional);

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
              erroAPI=""
              filtros={mockFiltrosRelatorioDietasEspeciais}
              meusDados={mockMeusDadosCODAEGA}
              onClear={jest.fn()}
              setDietasEspeciais={jest.fn()}
              setLoadingDietas={jest.fn()}
              setUnidadesEducacionais={setUnidades}
              setValuesForm={jest.fn()}
              unidadesEducacionais={[]}
            />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      );
    });
  });

  localStorage.setItem(
    "tipo_perfil",
    TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA
  );
  localStorage.setItem(
    "perfil",
    PERFIL.COORDENADOR_GESTAO_ALIMENTACAO_TERCEIRIZADA
  );

  it("Verifica se o componente foi renderizado", () => {
    expect(screen.getByText("Período de:")).toBeInTheDocument();
    expect(screen.getByText("Até:")).toBeInTheDocument();
    expect(screen.getByText("Filtrar")).toBeInTheDocument();
    expect(screen.getByText("Limpar Filtros")).toBeInTheDocument();
  });

  const setData = async (id, valor) => {
    const divData = screen.getByTestId(id);
    const input = divData.querySelector("input");
    await waitFor(async () => {
      fireEvent.change(input, {
        target: { value: valor },
      });
    });
  };

  it("Preenche campos de data e verifica se valores foram registrados", async () => {
    setData("data-cancelamento-inicial", "01/01/2024");
    setData("data-cancelamento-final", "31/01/2024");

    await waitFor(() => {
      expect(screen.getByDisplayValue("01/01/2024")).toBeInTheDocument();
      expect(screen.getByDisplayValue("31/01/2024")).toBeInTheDocument();
    });
  });

  it("Preenche campo de data, limpa formulário e verifica se valores foi removido", async () => {
    setData("data-cancelamento-inicial", "01/01/2024");
    const botao = screen.getByText("Limpar Filtros").closest("button");
    fireEvent.click(botao);
    await waitFor(() => {
      expect(screen.queryByDisplayValue("01/01/2024")).not.toBeInTheDocument();
    });
  });

  it("Seleciona Lote e verifica se unidades foram carregadas", async () => {
    const lotesSelect = screen.getByText("Selecione lotes");
    fireEvent.click(lotesSelect);

    const todosOpcao = screen.getByText("Todos");
    fireEvent.click(todosOpcao);

    await waitFor(() => {
      expect(setUnidades).toHaveBeenCalled();
    });
  });
});
