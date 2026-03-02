import { act, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockMeusDadosSuperUsuarioMedicao } from "src/mocks/meusDados/superUsuarioMedicao";
import Filtros from "../../components/Filtros";
import { Form } from "react-final-form";

describe("Testes comportamento componente de Filtros - Parametrização Financeira", () => {
  const mockView = {
    editais: [],
    lotes: [],
    gruposUnidadesOpcoes: [],
    parametrizacaoConflito: null,
    setParametrizacaoConflito: jest.fn(),
    onChangeConflito: jest.fn(),
    onChangeEdital: jest.fn(),
    onChangeLote: jest.fn(),
    onChangeTiposUnidades: jest.fn(),
    getGruposPendentes: jest.fn(),
  };

  const setup = async (props) => {
    await act(async () => {
      render(
        <MemoryRouter>
          <MeusDadosContext.Provider
            value={{
              meusDados: mockMeusDadosSuperUsuarioMedicao,
              setMeusDados: jest.fn(),
            }}
          >
            <Form
              onSubmit={jest.fn()}
              render={({ form }) => (
                <Filtros
                  ehCadastro={props.ehCadastro}
                  setCarregarTabelas={jest.fn()}
                  uuidParametrizacao={props.uuidParametrizacao ?? null}
                  view={mockView}
                  form={form}
                />
              )}
            />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });
  };

  it("verifica se o componente e seus campos foram renderizados", async () => {
    await setup({
      ehCadastro: true,
      uuidParametrizacao: null,
    });

    expect(screen.getByTestId("edital-select")).toBeInTheDocument();
    expect(screen.getByTestId("lote-select")).toBeInTheDocument();
    expect(screen.getByTestId("grupo-unidade-select")).toBeInTheDocument();
    expect(screen.getByTestId("data-inicial-input")).toBeInTheDocument();
    expect(screen.getByTestId("data-final-input")).toBeInTheDocument();
    expect(screen.getByTestId("botao-carregar")).toBeInTheDocument();
  });

  it("não deve renderizar o botão carregar se ehCadastro = false", async () => {
    await setup({
      ehCadastro: false,
    });

    expect(screen.queryByTestId("botao-carregar")).not.toBeInTheDocument();
  });
});
