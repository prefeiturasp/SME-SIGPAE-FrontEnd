import { act, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockMeusDadosCODAEGA } from "src/mocks/meusDados/CODAE-GA";
import { mockRelatorioDietasEpeciais } from "src/mocks/services/dietaEspecial.service/relatorioDietasEspeciaisTerceirizada";
import { ListagemDietas } from "../../components/ListagemDietas";
import mock from "src/services/_mock";

describe("Verifica componente de tabela relatório de dietas canceladas", () => {
  beforeEach(async () => {
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
            <ListagemDietas
              dietasEspeciais={mockRelatorioDietasEpeciais}
              meusDados={mockMeusDadosCODAEGA}
              setDietasEspeciais={jest.fn()}
              setLoadingDietas={jest.fn()}
              values={{
                status_selecionado: "AUTORIZADAS",
              }}
            />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      );
    });
  });

  it("Verifica se o componente foi renderizado com todos campos e registros", () => {
    expect(screen.getByText("Nome da Escola")).toBeInTheDocument();
    expect(screen.getByText("Nome do aluno")).toBeInTheDocument();
    expect(
      screen.getByText("RHUAN ANGELLO FERREIRA ABREU")
    ).toBeInTheDocument();
    expect(screen.getByText("MARTIN ABREU GUIMARAES")).toBeInTheDocument();
  });
});
