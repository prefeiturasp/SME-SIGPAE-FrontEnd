import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { ModalCronograma } from "../componentes/ModalCronograma";
import {
  usuarioEhCronograma,
  usuarioEhCodaeDilog,
} from "../../../../helpers/utilities";
import { useNavigate } from "react-router-dom";

jest.mock("../../../../helpers/utilities", () => ({
  usuarioEhCronograma: jest.fn(),
  usuarioEhCodaeDilog: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("Teste <ModalCronograma>", () => {
  const etapaDoCronograma = {
    title: "Cronograma CAQUI", // Título do evento
    data: "2024-04-08", // Data em formato string
    start: new Date("2024-04-08T00:00:00"), // Data de início
    end: new Date("2024-04-08T23:59:59"), // Data de fim
    allDay: true, // Define que o evento ocorre o dia todo
    objeto: {
      uuid: "f490c5ab-bba0-4f1d-b7b7-8d98892cf1e6",
      numero_cronograma: "148/2024A",
      nome_produto: "CAQUI",
      nome_fornecedor: "JP Alimentos",
      data_programada: "08/04/2024",
      numero_empenho: "4825/2024",
      etapa: "Etapa 1",
      parte: "Parte 1",
      quantidade: 10000.0,
      status: "Assinado CODAE",
      unidade_medida: "kg",
      uuid_cronograma: "a11ded5a-e3b3-480f-8132-f412b9c9b5be",
    },
  };

  let showModalCronograma = true;
  const setShowModalCronograma = jest.fn((value) => {
    showModalCronograma = value;
  });

  const navigateMock = jest.fn();

  beforeEach(() => {
    usuarioEhCronograma.mockReturnValue(true);
    usuarioEhCodaeDilog.mockReturnValue(false);
    useNavigate.mockReturnValue(navigateMock);

    render(
      <MemoryRouter>
        <ModalCronograma
          showModal={showModalCronograma}
          closeModal={() => setShowModalCronograma(false)}
          event={etapaDoCronograma}
        />
      </MemoryRouter>,
    );
  });

  it("verifica se o modal é renderizado com as propriedades corretas", () => {
    const modal = screen.getByRole("dialog");
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveAttribute("aria-modal", "true");
  });

  it("verifica se o botão 'Alterar' é renderizado", () => {
    const botaoAlterar = screen.getByRole("button", { name: /Alterar/i });
    expect(botaoAlterar).toBeInTheDocument();
  });

  it("verifica se o botão 'Alterar' está clicável e chama a navegação correta", () => {
    const botaoAlterar = screen.getByRole("button", { name: /Alterar/i });
    fireEvent.click(botaoAlterar);
    expect(navigateMock).toHaveBeenCalledWith(
      "/pre-recebimento/altera-cronograma?uuid=a11ded5a-e3b3-480f-8132-f412b9c9b5be",
    );
  });

  it("verifica o número do cronograma com a classe específica", async () => {
    const cronograma = await screen.findByText("148/2024A");
    expect(cronograma).toBeInTheDocument();
    expect(cronograma).toHaveClass("green");
  });

  it("verifica se o nome do produto é exibido corretamente", () => {
    const produto = screen.getByText("CAQUI");
    expect(produto).toBeInTheDocument();
  });

  it("verifica se o nome do fornecedor é exibido corretamente", () => {
    const fornecedor = screen.getByText("JP Alimentos");
    expect(fornecedor).toBeInTheDocument();
  });

  it("verifica data de entrega e número do empenho", () => {
    const dataEntrega = screen.getByText("08/04/2024");
    const numeroEmpenho = screen.getByText("4825/2024");

    expect(dataEntrega).toBeInTheDocument();
    expect(numeroEmpenho).toBeInTheDocument();
  });

  it("verifica etapa, parte e quantidade com unidade de medida", () => {
    const etapa = screen.getByText("Etapa 1");
    const parte = screen.getByText("Parte 1");
    const quantidade = screen.getByText("10000 kg");

    expect(etapa).toBeInTheDocument();
    expect(parte).toBeInTheDocument();
    expect(quantidade).toBeInTheDocument();
  });

  it("verifica se o botão 'Fechar' é exibido com atributos corretos", () => {
    const botaoFechar = screen.getByRole("button", { name: /Fechar/i });
    expect(botaoFechar).toBeInTheDocument();
    expect(botaoFechar).toHaveClass("general-button", "green-button");
    expect(botaoFechar).toHaveAttribute("data-cy", "Fechar");
  });

  it("verifica se o botão 'Fechar' chama a função closeModal corretamente", () => {
    const botaoFechar = screen.getByRole("button", { name: /Fechar/i });
    fireEvent.click(botaoFechar);
    expect(setShowModalCronograma).toHaveBeenCalledWith(false);
  });

  it("deve renderizar a TagLeveLeite quando programa_leve_leite for true", () => {
    const eventoComProgramaLeveLeite = {
      ...etapaDoCronograma,
      programa_leve_leite: true,
    };

    render(
      <MemoryRouter>
        <ModalCronograma
          showModal={true}
          closeModal={() => setShowModalCronograma(false)}
          event={eventoComProgramaLeveLeite}
        />
      </MemoryRouter>,
    );

    const tagLeveLeite = screen.getByText("LEVE LEITE - PLL");
    expect(tagLeveLeite).toBeInTheDocument();
    expect(tagLeveLeite).toHaveClass("tag-leve-leite");
  });

  it("não deve renderizar a TagLeveLeite quando programa_leve_leite for false ou undefined", () => {
    const eventoSemProgramaLeveLeite = {
      ...etapaDoCronograma,
      programa_leve_leite: false,
    };

    render(
      <MemoryRouter>
        <ModalCronograma
          showModal={true}
          closeModal={() => setShowModalCronograma(false)}
          event={eventoSemProgramaLeveLeite}
        />
      </MemoryRouter>,
    );

    const tagLeveLeite = screen.queryByText("LEVE LEITE - PLL");
    expect(tagLeveLeite).not.toBeInTheDocument();
  });
});
