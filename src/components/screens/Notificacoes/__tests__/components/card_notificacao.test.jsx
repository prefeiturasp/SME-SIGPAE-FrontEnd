import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosCODAEGA } from "src/mocks/meusDados/CODAE-GA";
import { mockGetNotificacoes } from "src/mocks/services/notificacoes.service/mockGetNotificacoes";
import CardNotificacao from "../../components/CardNotificacao";
import mock from "src/services/_mock";

describe("Testes do componente de Card de Notificações", () => {
  const mockHandleChangeMarcarComoLida = jest.fn();
  const mockToggleBtnNotificacoes = jest.fn();
  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCODAEGA);
    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem(
      "perfil",
      PERFIL.COORDENADOR_GESTAO_ALIMENTACAO_TERCEIRIZADA
    );
    localStorage.setItem(
      "tipo_perfil",
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA
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
            <CardNotificacao
              notificacao={mockGetNotificacoes.results[0]}
              handleChangeMarcarComoLida={mockHandleChangeMarcarComoLida}
              clickBtnNotificacoes={{
                "7f44b94f-8a2e-41da-9e3f-2e5a74df2a37": false,
              }}
              toggleBtnNotificacoes={mockToggleBtnNotificacoes}
              index={0}
            />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      );
    });
  });

  test("Verifica se componente foi renderizado", () => {
    expect(screen.getByText("Notificação de teste")).toBeInTheDocument();
    expect(screen.getByText("Escola")).toBeInTheDocument();
    expect(screen.getByText("01/10/2025")).toBeInTheDocument();
  });

  it("Verifica renderização da descricao com HTML corretamente", () => {
    expect(
      screen.getByText("Descrição da notificação de teste")
    ).toBeInTheDocument();
  });

  test("Busca botão de toggle e dispara toggleBtnNotificacoes ao clicar", () => {
    const [toggleBtn] = screen.getAllByRole("button");
    fireEvent.click(toggleBtn);
    expect(mockToggleBtnNotificacoes).toHaveBeenCalledWith(
      "7f44b94f-8a2e-41da-9e3f-2e5a74df2a37"
    );
  });

  test("Busca checkbox 'Marcar como lida' e chama callback ao clicar", () => {
    const checkbox = screen.getByText("Marcar como lida");
    expect(checkbox).toBeInTheDocument();

    fireEvent.click(checkbox);
    expect(mockHandleChangeMarcarComoLida).toHaveBeenCalledWith(
      expect.objectContaining({
        uuid: "7f44b94f-8a2e-41da-9e3f-2e5a74df2a37",
      }),
      0
    );
  });

  it("Busca link 'Acesse Aqui' quando existe notificacao.link", () => {
    const link = screen.getByRole("link", { name: "Acesse Aqui" });
    expect(link).toHaveAttribute("href", "http://www.sme.prefeitura.sp.gov.br");
  });
});
