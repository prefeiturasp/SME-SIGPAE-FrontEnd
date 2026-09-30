import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";

import { BotoesTerceirizada } from "../BotoesTerceirizada";

const mockModalCancelarHomologacaoProduto = jest.fn(() => (
  <div data-testid="modal-cancelar-homologacao" />
));

jest.mock("src/components/Shareable/Botao", () => ({
  __esModule: true,
  default: ({ disabled, onClick, texto }) => (
    <button type="button" disabled={disabled} onClick={onClick}>
      {texto}
    </button>
  ),
}));

jest.mock("../ModalCancelarHomologacaoProduto", () => ({
  __esModule: true,
  default: (props) => mockModalCancelarHomologacaoProduto(props),
}));

describe("BotoesTerceirizada", () => {
  const homologacao = {
    uuid: "8029df52-3630-4d13-b7ea-752a459f2475",
  };
  const produto = {
    uuid: "76028c32-ef32-4096-ae47-751ac06a252a",
    nome: "Arroz integral",
  };
  const getHomologacaoProdutoAsync = jest.fn();

  const renderizarComponente = (props = {}) =>
    render(
      <BotoesTerceirizada
        homologacao={homologacao}
        produto={produto}
        getHomologacaoProdutoAsync={getHomologacaoProdutoAsync}
        {...props}
      />,
    );

  const obterUltimasPropsModal = () =>
    mockModalCancelarHomologacaoProduto.mock.calls[
      mockModalCancelarHomologacaoProduto.mock.calls.length - 1
    ][0];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza a ação e configura o modal de cancelamento", () => {
    renderizarComponente();

    expect(
      screen.getByRole("button", { name: "Cancelar Solicitação" }),
    ).toBeInTheDocument();
    expect(obterUltimasPropsModal()).toEqual(
      expect.objectContaining({
        showModal: false,
        produto,
        idHomologacao: homologacao.uuid,
      }),
    );
  });

  it("utiliza um objeto vazio quando o produto não é informado", () => {
    renderizarComponente({ produto: null });

    expect(obterUltimasPropsModal().produto).toEqual({});
  });

  it("abre e fecha o modal de cancelamento", () => {
    renderizarComponente();

    fireEvent.click(
      screen.getByRole("button", { name: "Cancelar Solicitação" }),
    );
    let propsModal = obterUltimasPropsModal();
    expect(propsModal.showModal).toBe(true);

    act(() => propsModal.closeModal());
    propsModal = obterUltimasPropsModal();
    expect(propsModal.showModal).toBe(false);
  });

  it("atualiza os dados da homologação após o cancelamento", () => {
    renderizarComponente();

    obterUltimasPropsModal().onAtualizarHomologacao();

    expect(getHomologacaoProdutoAsync).toHaveBeenCalledTimes(1);
  });
});
