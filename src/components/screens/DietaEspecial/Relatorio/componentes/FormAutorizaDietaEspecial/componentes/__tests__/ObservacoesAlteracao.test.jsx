import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ObservacoesAlteracao from "src/components/screens/DietaEspecial/Relatorio/componentes/FormAutorizaDietaEspecial/componentes/ObservacoesAlteracao/index.jsx";
import preview from "jest-preview";

describe("Teste do componente ObservacoesAlteracao", () => {
  it("deve renderizar o título e o conteúdo HTML corretamente", () => {
    const htmlMock =
      "<strong>Texto em negrito</strong> e um <p> parágrafo.</p>";
    render(<ObservacoesAlteracao observacoes={htmlMock} />);
    preview.debug();
    expect(screen.getByText("Observações da Alteração")).toBeInTheDocument();
    const containerHtml = screen.getByText((content, element) => {
      return element.classList.contains("orientacoes");
    });

    expect(containerHtml.innerHTML).toBe(htmlMock);
    expect(screen.getByText("Texto em negrito")).toBeInTheDocument();
  });

  it("deve renderizar vazio quando não houver observações", () => {
    const { container } = render(<ObservacoesAlteracao observacoes="" />);
    const divOrientacoes = container.querySelector(".orientacoes");
    expect(divOrientacoes.innerHTML).toBe("");
  });
});
