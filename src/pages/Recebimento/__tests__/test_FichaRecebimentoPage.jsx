import { render, act, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import mock from "src/services/_mock";
import { MemoryRouter } from "react-router-dom";
import FichaRecebimentoPage from "src/pages/Recebimento/FichaRecebimento/FichaRecebimentoPage";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockMeusDadosDilogQualidade } from "src/mocks/meusDados/dilog-qualidade";

import { mockListaSimplesTerceirizadas } from "src/mocks/services/terceirizada.service/mockListaSimplesTerceirizadas";
import { mockGetListaCompletaProdutosLogistica } from "src/mocks/produto.service/mockGetListaCompletaProdutosLogistica";
import {
  mockListarFichasRecebimento,
  mockListarFichasRecebimentovazio,
} from "src/mocks/services/fichaRecebimento.service/mockListarFichasRecebimento";

import { PERFIL, TIPO_PERFIL } from "src/constants/shared";

describe("Testar Listagem de Fichas de Recebimento", () => {
  beforeEach(async () => {
    localStorage.setItem("perfil", PERFIL.DILOG_QUALIDADE);
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.PRE_RECEBIMENTO);

    mock
      .onGet(`/terceirizadas/lista-simples/`)
      .reply(200, mockListaSimplesTerceirizadas);

    mock
      .onGet(`/cadastro-produtos-edital/lista-completa-logistica/`)
      .reply(200, mockGetListaCompletaProdutosLogistica);

    mock
      .onGet(`/fichas-de-recebimento/`)
      .replyOnce(200, mockListarFichasRecebimento);

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
              meusDados: mockMeusDadosDilogQualidade,
              setMeusDados: jest.fn(),
            }}
          >
            <FichaRecebimentoPage />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      );
    });
  });

  const preencheInputByPlaceholder = (placeholder, value) => {
    const element = screen.getByPlaceholderText(placeholder);
    fireEvent.change(element, {
      target: { value: value },
    });
  };

  it("Testa o comportamento correto dos filtros e da tabela", async () => {
    expect(screen.getByText("Recebimentos Cadastrados")).toBeInTheDocument();
    expect(screen.getByText("CAQUI")).toBeInTheDocument();

    preencheInputByPlaceholder("Digite o Nº do Cronograma", "123");

    const btnLimparFiltros = screen
      .getByText("Limpar Filtros")
      .closest("button");
    fireEvent.click(btnLimparFiltros);

    expect(
      screen.getByPlaceholderText("Digite o Nº do Cronograma")
    ).toHaveValue("");

    preencheInputByPlaceholder("Digite o Nº do Cronograma", "123");

    mock
      .onGet(`/fichas-de-recebimento/`)
      .replyOnce(200, mockListarFichasRecebimentovazio);

    const btnFiltrar = screen.getByText("Filtrar").closest("button");
    fireEvent.click(btnFiltrar);

    expect(screen.queryByText("CAQUI")).not.toBeInTheDocument();
  });
});
