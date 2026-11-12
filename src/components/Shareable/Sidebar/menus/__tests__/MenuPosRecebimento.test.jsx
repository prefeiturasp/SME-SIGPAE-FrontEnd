import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import MenuPosRecebimento from "../MenuPosRecebimento";
import {
  MEMORANDO_OCORRENCIAS,
  PAINEL_ASSINATURA_TERMOS_RECEBIMENTO,
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

  it("exibe Painel de Assinaturas e Termo de Recebimento Provisório para DILOG_QUALIDADE", () => {
    localStorage.setItem("perfil", PERFIL.DILOG_QUALIDADE);

    render(
      <MemoryRouter>
        <MenuPosRecebimento />
      </MemoryRouter>,
    );

    const linkPainel = screen.getByText("Painel de Assinaturas");
    expect(linkPainel.closest("a")).toHaveAttribute(
      "href",
      `/${POS_RECEBIMENTO}/${PAINEL_ASSINATURA_TERMOS_RECEBIMENTO}`,
    );
    const linkTermo = screen.getByText("Termo de Recebimento Provisório");
    expect(linkTermo.closest("a")).toHaveAttribute(
      "href",
      `/${POS_RECEBIMENTO}/${TERMO_RECEBIMENTO_PROVISORIO}`,
    );

    localStorage.clear();
  });

  it.each([
    { nome: "DILOG_CRONOGRAMA", perfil: PERFIL.DILOG_CRONOGRAMA },
    { nome: "DILOG_DIRETORIA", perfil: PERFIL.DILOG_DIRETORIA },
    {
      nome: "COORDENADOR_CODAE_DILOG_LOGISTICA",
      perfil: PERFIL.COORDENADOR_CODAE_DILOG_LOGISTICA,
    },
  ])("oculta Painel de Assinaturas para $nome ", ({ perfil }) => {
    localStorage.setItem("perfil", perfil);

    render(
      <MemoryRouter>
        <MenuPosRecebimento />
      </MemoryRouter>,
    );

    expect(screen.queryByText("Painel de Assinaturas")).not.toBeInTheDocument();
    const linkTermo = screen.getByText("Termo de Recebimento Provisório");
    expect(linkTermo.closest("a")).toHaveAttribute(
      "href",
      `/${POS_RECEBIMENTO}/${TERMO_RECEBIMENTO_PROVISORIO}`,
    );

    localStorage.clear();
  });
});
