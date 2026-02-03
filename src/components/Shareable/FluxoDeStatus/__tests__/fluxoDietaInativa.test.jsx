import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import React from "react";
import { FluxoDeStatus } from "../../FluxoDeStatus";
import { fluxoDietaEspecialPartindoEscola } from "../helper";

describe("Teste <FluxoDeStatus> com Fluxo de Inativação", () => {
  const listaDeStatus = [
    {
      status_evento_explicacao: "Solicitação Realizada",
      usuario: {
        nome: "ESCOLA EMEF ADMIN",
        registro_funcional: "8115257",
        tipo_usuario: "escola",
        cpf: null,
      },
      criado_em: "02/02/2026 15:36:36",
      justificativa: "",
    },
    {
      status_evento_explicacao: "CODAE autorizou",
      usuario: {
        nome: "NUTRI CODAE ADMIN",
        registro_funcional: "8107807",
        tipo_usuario: "dieta_especial",
        cpf: null,
      },
      criado_em: "02/02/2026 15:38:31",
      justificativa: "",
    },
    {
      status_evento_explicacao: "CODAE inativou",
      usuario: {
        nome: "NUTRI CODAE ADMIN",
        registro_funcional: "8107807",
        tipo_usuario: "dieta_especial",
        cpf: null,
      },
      criado_em: "02/02/2026 15:51:25",
      justificativa: "",
    },
  ];

  beforeEach(() => {
    render(
      <FluxoDeStatus
        listaDeStatus={listaDeStatus}
        fluxo={fluxoDietaEspecialPartindoEscola}
        eh_dieta_especial={true}
      />,
    );
  });

  it("deve renderizar os nomes dos usuários nos status processados", () => {
    expect(screen.getByText(/ESCOLA EMEF ADMIN/i)).toBeInTheDocument();
    const nomesNutri = screen.getAllByText(/NUTRI CODAE ADMIN/i);
    expect(nomesNutri).toHaveLength(2);
  });

  it("deve exibir o RF correto para os usuários", () => {
    expect(screen.getByText(/RF: 8115257/i)).toBeInTheDocument();
    expect(screen.getAllByText(/RF: 8107807/i)).toHaveLength(2);
  });

  it("deve aplicar a classe 'active' para status de sucesso (Solicitação e Autorização)", () => {
    const progressItems = screen
      .getByTestId("progressbar")
      .querySelectorAll("li");
    expect(progressItems[0]).toHaveClass("active");
    expect(progressItems[1]).toHaveClass("active");
  });

  it("deve renderizar a quantidade correta de itens (baseado na lista de logs maior que o fluxo)", () => {
    const titulos = screen
      .getByTestId("progressbar-titles")
      .querySelectorAll("li");
    expect(titulos).toHaveLength(3);
  });

  it("deve formatar as datas de criação corretamente", () => {
    expect(screen.getByText("02/02/2026 15:36:36")).toBeInTheDocument();
    expect(screen.getByText("02/02/2026 15:51:25")).toBeInTheDocument();
  });

  it("deve exibir 'CODAE inativou' como título na lista de progressão superior", () => {
    const titulosUl = screen.getByTestId("progressbar-titles");
    const itensTitulos = titulosUl.querySelectorAll("li");
    expect(itensTitulos[2]).toHaveTextContent("CODAE inativou");
  });

  it("deve aplicar a classe CSS 'cancelled' ao círculo correspondente à inativação", () => {
    const progressUl = screen.getByTestId("progressbar");
    const itensProgresso = progressUl.querySelectorAll("li");
    expect(itensProgresso[2]).toHaveClass("cancelled");
    expect(itensProgresso[2]).not.toHaveClass("pending");
    expect(itensProgresso[2]).not.toHaveClass("active");
  });

  it("deve renderizar os dados do responsável pela inativação (Nome e RF)", () => {
    expect(screen.getByText(/NUTRI CODAE ADMIN/i)).toBeInTheDocument();
    expect(screen.getByText(/RF: 8107807/i)).toBeInTheDocument();
  });

  it("deve exibir a data e hora exata da inativação", () => {
    const progressUl = screen.getByTestId("progressbar");
    const itemInativado = progressUl.querySelectorAll("li")[2];
    expect(itemInativado).toHaveTextContent("02/02/2026 15:51:25");
  });
});
