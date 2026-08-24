import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import TabelaDuvidasFrequentes from "..";
import { formatarDuvidasParaTabela } from "../helpers";

const UUID_DUVIDA = "c6843f47-7706-40a9-a83a-5bc38ccad53e";

describe("TabelaDuvidasFrequentes", () => {
  it("formata e apresenta categoria e múltiplos perfis separados por ponto e vírgula", () => {
    const duvidas = formatarDuvidasParaTabela([
      {
        categoria: { nome: "Gestão de Alimentação" },
        pergunta: "Como solicitar uma dieta?",
        perfis: [{ nome: "QUALIDADE" }, "NUTRICODAE"],
        todos_os_perfis: false,
        uuid: UUID_DUVIDA,
      },
    ]);

    render(<TabelaDuvidasFrequentes duvidas={duvidas} aoEditar={jest.fn()} />);

    expect(screen.getByText("Como solicitar uma dieta?")).toBeInTheDocument();
    expect(screen.getByText("Gestão de Alimentação")).toBeInTheDocument();
    expect(screen.getByText("QUALIDADE; NUTRICODAE")).toBeInTheDocument();
  });

  it("apresenta TODOS quando a dúvida é destinada a todos os perfis", () => {
    const duvidas = formatarDuvidasParaTabela([
      {
        categoria: "Abastecimento",
        pergunta: "Como conferir uma guia?",
        perfis: [],
        todos_os_perfis: true,
        uuid: UUID_DUVIDA,
      },
    ]);

    render(<TabelaDuvidasFrequentes duvidas={duvidas} aoEditar={jest.fn()} />);

    expect(screen.getByText("TODOS")).toBeInTheDocument();
  });

  it("aciona a edição e mantém a exclusão desabilitada", () => {
    const aoEditar = jest.fn();
    const duvida = {
      categoria: "Abastecimento",
      perfis: "QUALIDADE",
      titulo: "Como conferir uma guia?",
      uuid: UUID_DUVIDA,
    };

    render(<TabelaDuvidasFrequentes duvidas={[duvida]} aoEditar={aoEditar} />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Editar dúvida Como conferir uma guia?",
      }),
    );

    expect(aoEditar).toHaveBeenCalledWith(duvida);
    expect(
      screen.getByRole("button", {
        name: "Excluir dúvida Como conferir uma guia?",
      }),
    ).toBeDisabled();
  });

  it("utiliza valores alternativos quando categoria e perfis estão ausentes", () => {
    const duvidas = formatarDuvidasParaTabela([
      {
        categoria: { nome: "" },
        pergunta: "Dúvida sem vínculos",
        uuid: UUID_DUVIDA,
      },
    ]);

    expect(duvidas[0]).toEqual({
      categoria: "--",
      perfis: "--",
      titulo: "Dúvida sem vínculos",
      uuid: UUID_DUVIDA,
    });
  });
});
