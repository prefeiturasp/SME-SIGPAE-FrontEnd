import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import CadastroTipoEmbalagemPage from "../CadastroTipoEmbalagemPage";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import mock from "src/services/_mock";

import { mockGetListaNomesTiposEmbalagens } from "src/mocks/services/qualidade.service/mockGetListaNomesTiposEmbalagens";
import { mockCadastroTipoEmbalagem } from "src/mocks/services/qualidade.service/mockCadastroTipoEmbalagem";
import { mockMeusDadosDilogQualidade } from "src/mocks/meusDados/dilog-qualidade";

describe("Teste da página CadastroTipoEmbalagem", () => {
  beforeEach(async () => {
    localStorage.setItem("perfil", PERFIL.DILOG_QUALIDADE);
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.PRE_RECEBIMENTO);

    mock
      .onGet("/tipos-embalagens/lista-nomes-tipos-embalagens/")
      .reply(200, mockGetListaNomesTiposEmbalagens);

    mock.onPost("/tipos-embalagens/").reply(201, mockCadastroTipoEmbalagem);

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
            <CadastroTipoEmbalagemPage />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });
  });

  it("valida se os elementos básicos da página estão renderizando corretamente", async () => {
    await waitFor(() => {
      expect(
        screen.getByText("Dados do Tipo da Embalagem"),
      ).toBeInTheDocument();
      expect(screen.getByText("Nome do Tipo da Embalagem")).toBeInTheDocument();
      expect(screen.getByText("Abreviação")).toBeInTheDocument();
      expect(screen.getByText("Data do Cadastro")).toBeInTheDocument();
    });
  });

  it("valida se o cadastro está funcionando corretamente", async () => {
    await waitFor(() => {
      expect(screen.getByText("Nome do Tipo da Embalagem")).toBeInTheDocument();

      const inputNomeTipoEmbalagem = screen.getByPlaceholderText(
        "Digite o nome do Tipo da Embalagem",
      );
      fireEvent.change(inputNomeTipoEmbalagem, {
        target: { value: "POTINHO" },
      });
      expect(inputNomeTipoEmbalagem).toHaveValue("POTINHO");

      const inputAbreviacao = screen.getByPlaceholderText(
        "Digite a Abreviação",
      );
      fireEvent.change(inputAbreviacao, { target: { value: "POT" } });
      expect(inputAbreviacao).toHaveValue("POT");

      const botaoSalvar = screen.getByText("Salvar").closest("button");
      fireEvent.click(botaoSalvar);

      expect(
        screen.getByText("Confirma o cadastro do Tipo da Embalagem?"),
      ).toBeInTheDocument();

      const botaoSim = screen.getByText("Sim").closest("button");
      fireEvent.click(botaoSim);
    });
  });
});
