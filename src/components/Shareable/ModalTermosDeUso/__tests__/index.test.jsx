import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ModalTermosDeUso from "../index";
import mock from "src/services/_mock";

describe("Testes de comportamentos do componente - ModalTermosDeUso", () => {
  const setup = (props = {}) => {
    render(
      <ModalTermosDeUso
        nomeUsuario="Guilherme"
        uuidUsuario="uuid-123"
        {...props}
      />,
    );
  };

  beforeEach(() => {
    mock.resetHistory();

    mock.onPatch("/usuarios/uuid-123/aceitar-termos/").reply(200, {});
  });

  it("verifica se o componente foi renderizado", () => {
    setup();

    expect(screen.getByText(/Olá,/)).toBeInTheDocument();

    expect(screen.getByText("Guilherme")).toBeInTheDocument();

    expect(
      screen.getByText(/Declaro que li e estou de acordo com os Termos de Uso/),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Continuar" }),
    ).toBeInTheDocument();
  });

  it("botão Continuar deve iniciar desabilitado", () => {
    setup();

    expect(screen.getByRole("button", { name: "Continuar" })).toBeDisabled();
  });

  it("deve habilitar botão Continuar ao marcar checkbox", async () => {
    setup();

    const checkbox = screen.getByRole("checkbox");

    await userEvent.click(checkbox);

    expect(
      screen.getByRole("button", { name: "Continuar" }),
    ).not.toBeDisabled();
  });

  it("deve chamar endpoint aceitarTermos ao clicar em Continuar", async () => {
    setup();

    await userEvent.click(screen.getByRole("checkbox"));

    await userEvent.click(screen.getByRole("button", { name: "Continuar" }));

    await waitFor(() => {
      expect(mock.history.patch.length).toBe(1);
    });

    expect(mock.history.patch[0].url).toBe(
      "/usuarios/uuid-123/aceitar-termos/",
    );
  });

  it("deve fechar modal quando request retornar status 200", async () => {
    setup();

    await userEvent.click(screen.getByRole("checkbox"));

    await userEvent.click(screen.getByRole("button", { name: "Continuar" }));

    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: "Continuar" }),
      ).not.toBeInTheDocument();
    });
  });

  it("deve renderizar link dos termos de uso", () => {
    setup();

    const link = screen.getByRole("link", {
      name: /Termos de Uso e a Política de Privacidade do SIGPAE/i,
    });

    expect(link).toBeInTheDocument();

    expect(link).toHaveAttribute(
      "href",
      "assets/documents/termos-de-uso-sigpae.pdf",
    );
  });
});
