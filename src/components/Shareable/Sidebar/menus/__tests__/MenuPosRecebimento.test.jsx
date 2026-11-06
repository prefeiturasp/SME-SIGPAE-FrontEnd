import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import MenuPosRecebimento from "../MenuPosRecebimento";
import {
  POS_RECEBIMENTO,
  TERMO_RECEBIMENTO_PROVISORIO,
  TERMO_RECEBIMENTO_PROVISORIO_FORNECEDOR,
} from "src/configs/constants";

describe("MenuPosRecebimento", () => {
  it("exibe o menu Pós-Recebimento com o submenu Termo de Recebimento Provisório apontando para a página (não para o cadastro)", () => {
    render(
      <MemoryRouter>
        <MenuPosRecebimento />
      </MemoryRouter>,
    );

    expect(screen.getByText("Pós-Recebimento")).toBeInTheDocument();
    const linkTermo = screen.getByText("Termo de Recebimento Provisório");
    expect(linkTermo.closest("a")).toHaveAttribute(
      "href",
      `/${POS_RECEBIMENTO}/${TERMO_RECEBIMENTO_PROVISORIO}`,
    );
  });

  it("exibe o item Termo de Recebimento Provisório apontando para a versão do fornecedor", () => {
    localStorage.setItem("perfil", '"ADMINISTRADOR_EMPRESA"');
    localStorage.setItem("tipo_servico", '"FORNECEDOR"');

    render(
      <MemoryRouter>
        <MenuPosRecebimento />
      </MemoryRouter>,
    );

    const linkTermo = screen.getByText("Termo de Recebimento Provisório");
    expect(linkTermo.closest("a")).toHaveAttribute(
      "href",
      `/${POS_RECEBIMENTO}/${TERMO_RECEBIMENTO_PROVISORIO_FORNECEDOR}`,
    );

    localStorage.clear();
  });
});
