import React, { useState } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import HTTP_STATUS from "http-status-codes";
import { MemoryRouter } from "react-router-dom";
import { mockProdutoHomologado } from "src/mocks/produto.service/mockProdutoHomologado.jsx";
import TabelaProdutos from "src/components/screens/Produto/ResponderQuestionamentoNutrisupervisor/components/TabelaProdutos";
import { vinculosAtivosProdutoEditais } from "src/services/produto.service";
import { usuarioEhEscolaTerceirizadaQualquerPerfil } from "src/helpers/utilities";
import { toastError } from "src/components/Shareable/Toast/dialogs";

jest.mock("src/components/Shareable/Toast/dialogs");
jest.mock("src/components/Shareable/ModalJustificativa", () => () => (
  <div data-testid="modal-justificativa">Modal Aberta</div>
));

jest.mock("src/services/produto.service", () => ({
  vinculosAtivosProdutoEditais: jest.fn(),
}));

jest.mock("src/helpers/utilities", () => ({
  usuarioEhEscolaTerceirizadaQualquerPerfil: jest.fn(),
}));

const produtoMock = [mockProdutoHomologado];

const Wrapper = () => {
  const [exibirModal, setExibirModal] = useState(true);

  return (
    <MemoryRouter>
      <TabelaProdutos
        produtos={produtoMock}
        exibirModal={exibirModal}
        setExibirModal={setExibirModal}
        setCarregando={jest.fn()}
        filtros={{}}
        setTotal={jest.fn()}
        setProdutos={jest.fn()}
        setShowBuscaVazia={jest.fn()}
        filtradoPorParametro={false}
      />
    </MemoryRouter>
  );
};

describe("TabelaProdutos - abertura da modal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    usuarioEhEscolaTerceirizadaQualquerPerfil.mockReturnValue(false);
  });

  test("deve abrir a modal com sucesso quando o produto possui vínculos ativos", async () => {
    vinculosAtivosProdutoEditais.mockResolvedValue({
      status: HTTP_STATUS.OK,
    });

    render(<Wrapper />);

    fireEvent.click(document.querySelector(".fa-angle-down"));
    fireEvent.click(screen.getByText("Responder"));

    expect(screen.getByText("Aguarde...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId("modal-justificativa")).toBeInTheDocument();
    });
    expect(screen.getByText("Responder")).toBeInTheDocument();
  });

  test("deve exibir toast de erro e NÃO abrir a modal se o perfil for proibido (403)", async () => {
    const mensagemErroBack = "Você não tem permissão para esta ação.";
    vinculosAtivosProdutoEditais.mockResolvedValue({
      status: HTTP_STATUS.FORBIDDEN,
      data: { detail: mensagemErroBack },
    });

    render(<Wrapper />);

    fireEvent.click(document.querySelector(".fa-angle-down"));
    fireEvent.click(screen.getByText("Responder"));
    expect(screen.getByText("Aguarde...")).toBeInTheDocument();

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith(mensagemErroBack);
      expect(
        screen.queryByTestId("modal-justificativa"),
      ).not.toBeInTheDocument();
    });
  });

  test("deve exibir mensagem de erro padrão em caso de falha genérica na API", async () => {
    const mensagemErro = "Houve um erro ao carregar a lista de editais ativos";
    vinculosAtivosProdutoEditais.mockResolvedValue({
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    });

    render(<Wrapper />);

    fireEvent.click(document.querySelector(".fa-angle-down"));
    fireEvent.click(screen.getByText("Responder"));
    expect(screen.getByText("Aguarde...")).toBeInTheDocument();

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith(mensagemErro);
      expect(
        screen.queryByTestId("modal-justificativa"),
      ).not.toBeInTheDocument();
    });
  });
});
