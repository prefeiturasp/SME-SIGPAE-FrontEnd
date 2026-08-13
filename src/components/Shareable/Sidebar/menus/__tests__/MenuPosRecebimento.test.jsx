import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import MenuPosRecebimento from "../MenuPosRecebimento";
import {
  POS_RECEBIMENTO,
  TERMO_RECEBIMENTO_DEFINITIVO,
} from "src/configs/constants";

describe("MenuPosRecebimento", () => {
  it("exibe o menu Pós-Recebimento com o submenu Termo de Recebimento Definitivo apontando para a página (não para o cadastro)", () => {
    render(
      <MemoryRouter>
        <MenuPosRecebimento />
      </MemoryRouter>,
    );

    expect(screen.getByText("Pós-Recebimento")).toBeInTheDocument();
    const linkTermo = screen.getByText("Termo de Recebimento Definitivo");
    expect(linkTermo.closest("a")).toHaveAttribute(
      "href",
      `/${POS_RECEBIMENTO}/${TERMO_RECEBIMENTO_DEFINITIVO}`,
    );
  });
});
