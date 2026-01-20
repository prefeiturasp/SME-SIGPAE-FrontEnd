import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ModalCancelaCopia from "src/components/screens/DietaEspecial/CadastroProtocoloPadraoDietaEsp/componentes/ModalCancelaCopia/index.jsx"; // ajuste o caminho
import "@testing-library/jest-dom";

describe("Teste do componente ModalCancelaCopia", () => {
  const mockCloseModal = jest.fn();

  const renderComponent = (show = true) => {
    return render(
      <MemoryRouter initialEntries={["/pagina-atual"]}>
        <Routes>
          <Route
            path="/pagina-atual"
            element={
              <ModalCancelaCopia showModal={show} closeModal={mockCloseModal} />
            }
          />
          <Route
            path="/dieta-especial/consultar-protocolo-padrao-dieta"
            element={<div>Página de Consulta</div>}
          />
        </Routes>
      </MemoryRouter>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("não deve renderizar o modal quando showModal for false", () => {
    renderComponent(false);
    expect(screen.queryByText("Cancelar Cópia")).not.toBeInTheDocument();
  });

  it("deve renderizar o título e a mensagem corretamente quando aberto", () => {
    renderComponent(true);
    expect(screen.getByText("Cancelar Cópia")).toBeInTheDocument();
    expect(
      screen.getByText(
        /Deseja cancelar a cópia do protocolo padrão selecionado/i,
      ),
    ).toBeInTheDocument();
  });

  it("deve chamar closeModal quando o botão 'Não' for clicado", () => {
    renderComponent(true);
    const botaoNao = screen.getByRole("button", { name: /não/i });
    fireEvent.click(botaoNao);
    expect(mockCloseModal).toHaveBeenCalledTimes(1);
  });

  it("deve navegar para a rota correta ao clicar no botão 'Sim'", () => {
    renderComponent(true);
    const botaoSim = screen.getByRole("button", { name: /sim/i });
    const link = botaoSim.closest("a");
    expect(link).toHaveAttribute(
      "href",
      "/dieta-especial/consultar-protocolo-padrao-dieta",
    );
    fireEvent.click(botaoSim);
    expect(screen.getByText("Página de Consulta")).toBeInTheDocument();
  });

  it("deve chamar closeModal ao clicar no botão de fechar do header (X)", () => {
    renderComponent(true);
    const botaoFecharHeader = screen.getByRole("button", { name: /close/i });
    fireEvent.click(botaoFecharHeader);
    expect(mockCloseModal).toHaveBeenCalledTimes(1);
  });
});
