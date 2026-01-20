import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TabelaProdutos from "src/components/screens/Cadastros/VincularProdutosEditais/componentes/Tabela";
import "@testing-library/jest-dom";

jest.mock(
  "src/components/screens/Cadastros/VincularProdutosEditais/componentes/ModalAtivarInativar",
  () => {
    return function MockModal({ showModal, closeModal, changePage, item }) {
      if (!showModal) return null;
      return (
        <div data-testid="mock-modal">
          <span data-testid="item-selecionado">{item?.produto?.nome}</span>
          <button data-testid="btn-fecha-modal" onClick={closeModal}>
            Fechar Modal
          </button>
          <button data-testid="btn-atualiza-modal" onClick={changePage}>
            Atualizar Página
          </button>
        </div>
      );
    };
  },
);

const macarrao = {
  uuid: "0ebacc43-2188-4cad-86ff-09a2be219b40",
  produto: { nome: "Macarrão" },
  marca: { nome: "Vilma" },
  tipo_produto: "Alimento",
  edital: { numero: "123/2023" },
  ativo: true,
  outras_informacoes: "Feita com ovo",
};

const leite = {
  uuid: "9637ce4f-c71f-461a-809f-09ba363ac212",
  produto: { nome: "Leite" },
  marca: { nome: "Vale" },
  tipo_produto: "Alimento",
  edital: { numero: "456/2023" },
  ativo: false,
  outras_informacoes: "Contém lactose",
};

const mockResultado = [macarrao, leite];

const renderComponent = (mockResultado, mockChangePage) => {
  return render(
    <TabelaProdutos resultado={mockResultado} changePage={mockChangePage} />,
  );
};

describe(" Testa o componente de Listagem de Produtos", () => {
  const mockChangePage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve exibir mensagem de aviso quando a lista de resultados for vazia", () => {
    renderComponent([], mockChangePage);
    expect(
      screen.getByText(/Não existem dados para filtragem informada/i),
    ).toBeInTheDocument();
  });

  it("deve renderizar a tabela com os dados corretos dos produtos", () => {
    renderComponent(mockResultado, mockChangePage);
    expect(screen.getByText(macarrao.produto.nome)).toBeInTheDocument();
    expect(screen.getByText(macarrao.marca.nome)).toBeInTheDocument();
    expect(screen.getByText(macarrao.edital.numero)).toBeInTheDocument();
    expect(screen.getByText("Ativo")).toBeInTheDocument();

    expect(screen.getByText(leite.produto.nome)).toBeInTheDocument();
    expect(screen.getByText(leite.marca.nome)).toBeInTheDocument();
    expect(screen.getByText(leite.edital.numero)).toBeInTheDocument();
    expect(screen.getByText("Inativo")).toBeInTheDocument();
  });

  it("deve abrir o modal com o item correto ao clicar no botão Inativar", () => {
    renderComponent(mockResultado, mockChangePage);
    const botoesAcao = screen.getAllByRole("button", {
      name: /inativar|ativar/i,
    });
    fireEvent.click(botoesAcao[0]);
    expect(screen.getByTestId("mock-modal")).toBeInTheDocument();
    expect(screen.getByTestId("item-selecionado")).toHaveTextContent(
      macarrao.produto.nome,
    );
  });

  it("deve alternar a visibilidade das informações extras (Collapse) ao clicar no ícone", () => {
    renderComponent(mockResultado, mockChangePage);

    const uuid = macarrao.uuid;
    const infoExtraRow = document.getElementById(uuid);
    const iconAngle = document.getElementById(`${uuid}-angle`);

    expect(infoExtraRow).toHaveClass("d-none");
    expect(iconAngle).toHaveClass("fa-angle-down");

    const botaoExpandir = iconAngle.closest("button");
    fireEvent.click(botaoExpandir);

    expect(infoExtraRow).not.toHaveClass("d-none");
    expect(iconAngle).toHaveClass("fa-angle-up");

    fireEvent.click(botaoExpandir);
    expect(infoExtraRow).toHaveClass("d-none");
    expect(iconAngle).toHaveClass("fa-angle-down");
  });
  it("deve executar setShowModal(false) quando o closeModal do modal for chamado", async () => {
    renderComponent(mockResultado, mockChangePage);

    const botaoAcao = screen.getByRole("button", { name: /inativar/i });
    fireEvent.click(botaoAcao);
    expect(screen.getByTestId("mock-modal")).toBeInTheDocument();

    const btnFechar = screen.getByTestId("btn-fecha-modal");
    fireEvent.click(btnFechar);
    await waitFor(() => {
      expect(screen.queryByTestId("mock-modal")).not.toBeInTheDocument();
    });
  });

  it("deve executar a função changePage do pai quando o modal solicitar atualização", () => {
    renderComponent(mockResultado, mockChangePage);
    const botaoAcao = screen.getByRole("button", { name: /inativar/i });
    fireEvent.click(botaoAcao);
    const btnUpdate = screen.getByTestId("btn-atualiza-modal");
    fireEvent.click(btnUpdate);
    expect(mockChangePage).toHaveBeenCalledTimes(1);
  });
});
