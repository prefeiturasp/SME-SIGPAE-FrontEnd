import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import MenuPosRecebimento from "../MenuPosRecebimento";
import {
  MEMORANDO_OCORRENCIAS,
  POS_RECEBIMENTO,
  TERMO_RECEBIMENTO_DEFINITIVO,
  TERMO_RECEBIMENTO_DEFINITIVO_FORNECEDOR,
} from "src/configs/constants";
import { PERFIL } from "src/constants/shared";

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

  it("exibe o item Termo de Recebimento Definitivo apontando para a versão do fornecedor", () => {
    localStorage.setItem("perfil", '"ADMINISTRADOR_EMPRESA"');
    localStorage.setItem("tipo_servico", '"FORNECEDOR"');

    render(
      <MemoryRouter>
        <MenuPosRecebimento />
      </MemoryRouter>,
    );

    const linkTermo = screen.getByText("Termo de Recebimento Definitivo");
    expect(linkTermo.closest("a")).toHaveAttribute(
      "href",
      `/${POS_RECEBIMENTO}/${TERMO_RECEBIMENTO_DEFINITIVO_FORNECEDOR}`,
    );

    localStorage.clear();
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
      screen.queryByText("Termo de Recebimento Definitivo"),
    ).not.toBeInTheDocument();

    localStorage.clear();
  });
});
