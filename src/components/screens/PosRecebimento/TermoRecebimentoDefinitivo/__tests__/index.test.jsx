import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import TermoRecebimentoDefinitivo from "../index";
import {
  CADASTRO_TERMO_RECEBIMENTO_DEFINITIVO,
  POS_RECEBIMENTO,
} from "src/configs/constants";

describe("TermoRecebimentoDefinitivo", () => {
  it("exibe o botão Cadastrar apontando para a rota de cadastro", () => {
    render(
      <MemoryRouter>
        <TermoRecebimentoDefinitivo />
      </MemoryRouter>,
    );

    const botao = screen.getByText("Cadastrar");
    expect(botao.closest("a")).toHaveAttribute(
      "href",
      `/${POS_RECEBIMENTO}/${CADASTRO_TERMO_RECEBIMENTO_DEFINITIVO}`,
    );
  });
});
