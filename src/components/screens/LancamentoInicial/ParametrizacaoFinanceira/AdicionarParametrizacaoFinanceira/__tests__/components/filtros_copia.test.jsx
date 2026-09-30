import { act, fireEvent, render, screen } from "@testing-library/react";
import { Form } from "react-final-form";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { mockListaNumeros } from "src/mocks/LancamentoInicial/CadastroDeClausulas/listaDeNumeros";
import { mockLotesSimples } from "src/mocks/lote.service/mockLotesSimples";
import { mockGetGrupoUnidadeEscolar } from "src/mocks/services/escola.service/mockGetGrupoUnidadeEscolar";
import { mockGetDadosParametrizacaoFinanceira } from "src/mocks/services/parametrizacao_financeira.service/mockGetDadosParametrizacaoFinanceira";
import Filtros from "../../components/Filtros";

const view = {
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

describe("Cópia da parametrização financeira", () => {
  it("informa erro quando não consegue concluir a cópia", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <Form
            onSubmit={jest.fn()}
            initialValues={{
              edital: mockListaNumeros.results[0].uuid,
              lote: mockLotesSimples.results[0].uuid,
              grupo_unidade_escolar: mockGetGrupoUnidadeEscolar.results[0].uuid,
              data_inicial: mockGetDadosParametrizacaoFinanceira.data_inicial,
            }}
            render={({ form }) => (
              <Filtros
                ehCadastro
                setCarregarTabelas={() => {
                  throw new Error("falha ao copiar");
                }}
                uuidParametrizacao={mockGetDadosParametrizacaoFinanceira.uuid}
                view={view}
                form={form}
              />
            )}
          />
          <ToastContainer />
        </MemoryRouter>,
      );
    });

    fireEvent.click(screen.getByTestId("botao-criar-copia"));
    fireEvent.click(screen.getByTestId("botao-confirmar-copia"));

    expect(
      await screen.findByText(
        "Erro ao copiar dados da parametrização financeira.",
      ),
    ).toBeInTheDocument();
  });
});
