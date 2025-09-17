import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockMeusDadosDilogQualidade } from "src/mocks/meusDados/dilog-qualidade";
import mock from "src/services/_mock";

import AtribuirQuestoesPage from "src/pages/Recebimento/QuestoesPorProduto/AtribuirQuestoesPage";

import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { mockListaFichasTecnicasSimplesAprovadas } from "src/mocks/PreRecebimento/CadastroCronograma/mockListaFichasTecnicasSimplesAprovadas.jsx";
import { mockListarQuestoesConferenciaSimples } from "src/mocks/services/questoesConferencia.service/mockListarQuestoesConferenciaSimples";

describe("Testar Cadastro em Atribuir Questoes", () => {
  beforeEach(() => {
    localStorage.setItem("perfil", PERFIL.DILOG_QUALIDADE);
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.PRE_RECEBIMENTO);

    mock
      .onGet("/ficha-tecnica/lista-simples/")
      .reply(200, mockListaFichasTecnicasSimplesAprovadas);
    mock
      .onGet("/questoes-conferencia/lista-simples-questoes/")
      .reply(200, mockListarQuestoesConferenciaSimples);
  });

  const setup = async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <MeusDadosContext.Provider
            value={{
              meusDados: mockMeusDadosDilogQualidade,
              setMeusDados: jest.fn(),
            }}
          >
            <AtribuirQuestoesPage />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      );
    });
  };

  it("Permite salvar sem preencher Embalagem Secundária (não obrigatório)", async () => {
    mock
      .onGet("/ficha-tecnica/lista-simples-sem-questoes-conferencia/")
      .reply(200, {
        data: {
          results: [
            { uuid: "ft026", numero: "FT026", produto: "ARROZ TIPO I" },
          ],
        },
      });
    mock.onGet("/questoes-conferencia/").reply(200, {
      results: {
        primarias: [
          {
            uuid: "q1",
            questao: "Embalagem Primaria",
            tipo_questao: ["PRIMARIA"],
            pergunta_obrigatoria: true,
            posicao: 1,
          },
        ],
        secundarias: [],
      },
    });
    mock.onPost("/questoes-por-produto/atribuir/").reply(201, {});

    await setup();

    const inputProduto = await screen.findByRole("combobox");
    fireEvent.change(inputProduto, {
      target: { value: "FT026 - ARROZ TIPO I" },
    });

    const questaoPrimaria = await screen.findByText("Embalagem Primaria");
    expect(questaoPrimaria).toBeInTheDocument();

    const botaoSalvar = screen.getByRole("button", { name: "Salvar" });
    expect(botaoSalvar).toBeEnabled();
    fireEvent.click(botaoSalvar);

    await waitFor(() => {
      expect(
        screen.getByText(
          "Deseja salvar a atribuição das questões de conferência para esse produto?"
        )
      ).toBeInTheDocument();
    });

    expect(screen.queryByText("Campo obrigatório")).not.toBeInTheDocument();
  });
});
