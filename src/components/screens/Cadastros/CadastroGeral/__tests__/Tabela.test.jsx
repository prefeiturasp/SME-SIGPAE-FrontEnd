import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TabelaItens from "src/components/screens/Cadastros/CadastroGeral/componentes/Tabela";
import { localStorageMock } from "src/mocks/localStorageMock";
import { PERFIL, TIPO_SERVICO } from "src/constants/shared";

jest.mock(
  "src/components/Shareable/ModalCadastrarItem",
  () =>
    ({ closeModal, changePage, showModal }) =>
      showModal ? (
        <div data-testid="modal-cadastrar">
          <button onClick={closeModal}>Fechar Cadastro</button>
          <button
            onClick={() => {
              closeModal();
              changePage();
            }}
          >
            Simular Submit Cadastro
          </button>
        </div>
      ) : null,
);

jest.mock(
  "src/components/screens/Cadastros/CadastroGeral/componentes/ModalExcluirItem",
  () =>
    ({ closeModal, changePage, showModal }) =>
      showModal ? (
        <div data-testid="modal-excluir">
          <button onClick={closeModal}>Fechar Excluir</button>
          <button
            onClick={() => {
              closeModal();
              changePage();
            }}
          >
            Simular Submit Excluir
          </button>
        </div>
      ) : null,
);

const mockChangePage = jest.fn();
const resultadoMock = [
  {
    nome: "Item Teste 1",
    tipo: "UNIDADE_MEDIDA",
    uuid: "67a1e380-b712-4295-b99a-701efa54b318",
  },
  {
    nome: "Item Teste 2",
    tipo: "OUTRO_TIPO",
    uuid: "87a1e380-b712-4295-b99a-701efa54b31",
  },
];

const renderComponent = (resultado) => {
  return render(
    <TabelaItens resultado={resultado} changePage={mockChangePage} />,
  );
};

describe("Componente Tabela  do Cadastro Geral", () => {
  beforeEach(() => {
    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem(
      "perfil",
      PERFIL.COORDENADOR_GESTAO_ALIMENTACAO_TERCEIRIZADA,
    );
    jest.clearAllMocks();
  });

  it("deve exibir mensagem quando a lista de resultados for vazia", () => {
    renderComponent([]);
    expect(
      screen.getByText(/Nenhum resultado encontrado/i),
    ).toBeInTheDocument();
  });

  it("deve desabilitar botões se o tipo for UNIDADE_MEDIDA e for empresa terceirizada", () => {
    localStorage.setItem("perfil", PERFIL.ADMINISTRADOR_EMPRESA);
    localStorage.setItem("tipo_servico", TIPO_SERVICO.TERCEIRIZADA);
    renderComponent(resultadoMock);

    const botoes = screen.getAllByRole("button");
    expect(botoes[0]).toBeDisabled();
    expect(botoes[1]).toBeDisabled();

    expect(botoes[2]).not.toBeDisabled();
  });

  it("deve manter botões habilitados se NÃO for empresa terceirizada mesmo sendo UNIDADE_MEDIDA", () => {
    renderComponent(resultadoMock);

    const botoes = screen.getAllByRole("button");
    expect(botoes[0]).not.toBeDisabled();
    expect(botoes[1]).not.toBeDisabled();
  });

  it("deve abrir o modal de edição ao clicar em Editar", () => {
    renderComponent(resultadoMock);

    const botaoEditar = screen.getAllByText(/Editar/i)[0];
    fireEvent.click(botaoEditar);

    expect(screen.getByTestId("modal-cadastrar")).toBeInTheDocument();
  });

  it("deve abrir o modal de exclusão ao clicar em Excluir", () => {
    renderComponent(resultadoMock);

    const botaoExcluir = screen.getAllByText(/Excluir/i)[0];
    fireEvent.click(botaoExcluir);

    expect(screen.getByTestId("modal-excluir")).toBeInTheDocument();
  });

  it("deve cobrir setShowModal(false) e changePage() ao finalizar cadastro", () => {
    renderComponent([resultadoMock[0]]);
    fireEvent.click(screen.getByText(/Editar/i));
    expect(screen.getByTestId("modal-cadastrar")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Simular Submit Cadastro"));

    expect(screen.queryByTestId("modal-cadastrar")).not.toBeInTheDocument();

    expect(mockChangePage).toHaveBeenCalled();
  });

  it("deve cobrir setShowModalExcluir(false) e changePage() ao finalizar exclusão", () => {
    renderComponent([resultadoMock[1]]);

    fireEvent.click(screen.getByText(/Excluir/i));
    expect(screen.getByTestId("modal-excluir")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Simular Submit Excluir"));

    expect(screen.queryByTestId("modal-excluir")).not.toBeInTheDocument();
    expect(mockChangePage).toHaveBeenCalled();
  });

  it("deve cobrir apenas o fechamento do modal sem atualizar a página", () => {
    renderComponent([resultadoMock[0]]);
    fireEvent.click(screen.getByText(/Excluir/i));
    fireEvent.click(screen.getByText("Fechar Excluir"));

    expect(screen.queryByTestId("modal-excluir")).not.toBeInTheDocument();
    expect(mockChangePage).not.toHaveBeenCalled();
  });
});
