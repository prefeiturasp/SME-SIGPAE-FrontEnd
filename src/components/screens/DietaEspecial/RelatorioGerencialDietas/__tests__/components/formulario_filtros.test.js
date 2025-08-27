import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockMeusDadosCODAEGA } from "src/mocks/meusDados/CODAE-GA";
import FormFiltro from "../../components/FormFiltro/index";
import mock from "src/services/_mock";
import { Form } from "react-final-form";

describe("Verifica comportamentos componente de filtros - Relatório Gerencial de Dietas", () => {
  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCODAEGA);
    mock
      .onGet("/nutrisupervisao-solicitacoes/anos-com-dietas/")
      .reply(200, [2024, 2025]);
    localStorage.setItem("perfil", PERFIL.ADMINISTRADOR_SUPERVISAO_NUTRICAO);

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
            <Form
              onSubmit={jest.fn()}
              initialValues={{ anos: [2025], meses: [], dias: [] }}
              render={({ handleSubmit, values, form }) => (
                <form onSubmit={handleSubmit}>
                  <FormFiltro anoVigente={2025} values={values} form={form} />
                </form>
              )}
            />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      );
    });
  });

  it("Verifica renderização do componente", () => {
    expect(screen.getByText("Ano")).toBeInTheDocument();
    expect(screen.getByText("Mês")).toBeInTheDocument();
    expect(screen.getByText("Dia")).toBeInTheDocument();
  });

  it("Seleciona datas e verifica comportamento do componente", () => {
    const anoSelect = screen.getByText("Ano");
    expect(anoSelect).toBeInTheDocument();
    fireEvent.mouseDown(anoSelect);

    fireEvent.click(screen.getByText("2025"));
    fireEvent.click(screen.getByText("2024"));

    expect(screen.getByText("Todos os anos")).toBeInTheDocument();
  });
});
