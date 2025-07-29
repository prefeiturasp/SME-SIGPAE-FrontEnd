import {
  render,
  screen,
  act,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PERFIL } from "src/constants/shared";
import mock from "src/services/_mock";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockMeusDadosCODAEGA } from "src/mocks/meusDados/CODAE-GA";
import { ModalCadastroLote } from "../../components/ModalCadastroLote";

describe("Verifica modal de conferência de cadastro de lotes", () => {
  const closeModal = jest.fn();
  const onSubmit = jest.fn();
  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCODAEGA);
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
            <ModalCadastroLote
              closeModal={closeModal}
              onSubmit={onSubmit}
              atualizando={false}
              showModal={true}
              diretoria_regional={"DIRETORIA REGIONAL DE EDUCACAO CAMPO LIMPO"}
              subprefeituras={["BUTANTA", "CAMPO LIMPO"]}
              iniciais={"dfteras"}
              nome={"12321"}
              tipo_gestao={"TERC TOTAL"}
              escolasSelecionadas={[
                "000191 - EMEF ALIPIO CORREA NETO, PROF. - ",
                "000477 - EMEF EDA TEREZINHA CHICA MEDEIROS, PROFA. - ",
              ]}
            />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      );
    });
  });

  it("Verifica se a interface foi renderizada", () => {
    expect(screen.getByText(/resumo/i)).toBeInTheDocument();
    expect(screen.getByText(/lote:/i)).toBeInTheDocument();
    expect(screen.getByText(/número:/i)).toBeInTheDocument();
    expect(screen.getByText(/tipo de gestão:/i)).toBeInTheDocument();
    expect(screen.getByText(/sim/i)).toBeInTheDocument();
    expect(screen.getByText(/não/i)).toBeInTheDocument();
  });

  it("Verificando se informações correspondem aos props", async () => {
    expect(
      screen.getByText(/DIRETORIA REGIONAL DE EDUCACAO CAMPO LIMPO/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/dfteras/i)).toBeInTheDocument();
    expect(screen.getByText(/12321/i)).toBeInTheDocument();
    expect(screen.getByText(/TERC TOTAL/i)).toBeInTheDocument();
    expect(screen.getByText(/BUTANTA/i)).toBeInTheDocument();
    expect(screen.getByText(/EMEF ALIPIO CORREA NETO/i)).toBeInTheDocument();
  });

  it("Verifica comportamento ao clicar em 'não'", async () => {
    const botaoFechar = screen.getByText(/Não/i).closest("button");
    fireEvent.click(botaoFechar);
    await waitFor(() => {
      expect(closeModal).toHaveBeenCalled();
    });
  });

  it("Verifica comportamento ao clicar em 'sim'", async () => {
    const botaoSalvar = screen.getByText(/Sim/i).closest("button");
    fireEvent.click(botaoSalvar);
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });
  });
});
