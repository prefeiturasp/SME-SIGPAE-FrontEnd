import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import MenuPosRecebimento from "../MenuPosRecebimento";
import {
  MEMORANDO_OCORRENCIAS,
  POS_RECEBIMENTO,
  TERMO_RECEBIMENTO_PROVISORIO,
} from "src/configs/constants";
import { PERFIL } from "src/constants/shared";

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

  it("exibe apenas o Memorando de Ocorrências para DIRETOR_UE", () => {
    localStorage.setItem("perfil", PERFIL.DIRETOR_UE);

    render(
      <MemoryRouter>
        <MenuPosRecebimento />
      </MemoryRouter>,
    );

    const linkMemorando = screen.getByText("Memorando de Ocorrências");
    expect(linkMemorando.closest("a")).toHaveAttribute(
      "href",
      `/${POS_RECEBIMENTO}/${MEMORANDO_OCORRENCIAS}`,
    );
    expect(
      screen.queryByText("Termo de Recebimento Provisório"),
    ).not.toBeInTheDocument();

    localStorage.clear();
  });
});
