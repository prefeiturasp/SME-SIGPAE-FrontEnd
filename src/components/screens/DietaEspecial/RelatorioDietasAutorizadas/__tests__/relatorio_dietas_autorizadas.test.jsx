import {
  render,
  screen,
  act,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import mock from "src/services/_mock";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockMeusDadosCODAEGA } from "src/mocks/meusDados/CODAE-GA";
import { mockFiltrosRelatorioDietasEspeciais } from "src/mocks/services/dietaEspecial.service/mockGetFiltrosRelatorioDietasEspeciais";
import { mockRelatorioDietasEpeciais } from "src/mocks/services/dietaEspecial.service/relatorioDietasEspeciaisTerceirizada";
import { RelatorioDietasAutorizadas } from "..";

describe("Verifica comportamentos do relatório de dietas autorizadas", () => {
  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCODAEGA);
    mock
      .onGet("/solicitacoes-dieta-especial/filtros-relatorio-dieta-especial/")
      .reply(200, mockFiltrosRelatorioDietasEspeciais);
    mock
      .onPost(
        "/solicitacoes-genericas/filtrar-solicitacoes-cards-totalizadores/"
      )
      .reply(200, { results: [{ "Rede Municipal de Educação": 28 }] });
    mock
      .onGet(
        "/solicitacoes-dieta-especial/relatorio-dieta-especial-terceirizada/"
      )
      .reply(200, mockRelatorioDietasEpeciais);

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
            <RelatorioDietasAutorizadas />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      );
    });
  });

  it("Verifica se o componente foi renderizado", () => {
    expect(screen.getByText("Filtrar Resultados")).toBeInTheDocument();
    expect(screen.getByText("Tipo de Gestão")).toBeInTheDocument();
    expect(screen.getByText("Filtrar")).toBeInTheDocument();
    expect(screen.getByText("Limpar Filtros")).toBeInTheDocument();
  });

  const setSelect = (id, valor) => {
    const campoSelect = screen.getByTestId(id).querySelector("select");
    fireEvent.change(campoSelect, {
      target: { value: valor },
    });
  };

  const TIPO_GESTAO = "f54b0aca-56cc-4b27-9991-0a50257ae9c0";
  it("Preenche o campo 'tipo de Gestão' no formulário e verifica se opção está na interface", async () => {
    setSelect("tipo-gestao-select", TIPO_GESTAO);
    await waitFor(() => {
      expect(screen.getByText("PARCEIRA")).toBeInTheDocument();
    });
  });

  it("Preenche campo no formulário, limpa filtros e verifica se valores foram removidos", async () => {
    setSelect("tipo-gestao-select", TIPO_GESTAO);

    await waitFor(() => {
      const tipoUnidade = screen.getByText("Selecione o tipo de unidade");
      fireEvent.click(tipoUnidade);
      fireEvent.click(screen.getByText("EMEF"));
    });
    expect(screen.getAllByText("EMEF").length).toBe(2);

    const botaoLimpar = screen.getByText("Limpar Filtros").closest("button");
    fireEvent.click(botaoLimpar);

    await waitFor(() => {
      expect(screen.queryByText("PARCEIRA")).not.toBeInTheDocument();
      expect(screen.queryByText("EMEF")).not.toBeInTheDocument();
    });
  });

  const filtrar = () => {
    const botao = screen.getByText("Filtrar");
    fireEvent.click(botao);
  };

  it("Preenche campo no formulário, clica em filtrar e verifica registros", async () => {
    setSelect("tipo-gestao-select", TIPO_GESTAO);
    filtrar();
    await waitFor(() => {
      expect(
        screen.getByText("4722212 - RHUAN ANGELLO FERREIRA ABREU")
      ).toBeInTheDocument();
      expect(
        screen.getByText("8026992 - MARTIN ABREU GUIMARAES")
      ).toBeInTheDocument();
    });
  });

  it("Filtra, clica para visualizar em gráfico e verifica se foi alterado", async () => {
    filtrar();

    await waitFor(() => {
      expect(
        screen.getByText("4722212 - RHUAN ANGELLO FERREIRA ABREU")
      ).toBeInTheDocument();
      expect(
        screen.getByText("8026992 - MARTIN ABREU GUIMARAES")
      ).toBeInTheDocument();
    });

    const botaoGrafico = screen.getByText("Gráficos");
    fireEvent.click(botaoGrafico);

    await waitFor(() => {
      expect(screen.getByText("Tabela")).toBeInTheDocument();
    });
  });
});
