import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import {
  AJUDA,
  CADASTRO_DUVIDAS_FREQUENTES,
  EDITAR_DUVIDA_FREQUENTE,
} from "src/configs/constants";
import { listarPerguntasFrequentes } from "src/services/faq.service";
import ListagemDuvidasFrequentes from "..";

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

jest.mock("src/services/faq.service", () => ({
  listarPerguntasFrequentes: jest.fn(),
}));

jest.mock("src/components/Shareable/Toast/dialogs", () => ({
  toastError: jest.fn(),
}));

jest.mock("src/components/Shareable/SigpaeLogoLoader", () => ({
  SigpaeLogoLoader: () => <div>Carregando dúvidas</div>,
}));

jest.mock("src/components/Shareable/Paginacao", () => ({
  Paginacao: ({ current, onChange }) => (
    <button type="button" onClick={() => onChange(current + 1)}>
      Próxima página
    </button>
  ),
}));

jest.mock("../../components/BotaoCadastroDuvidasFrequentes", () => ({
  __esModule: true,
  default: () => <button>Cadastrar Dúvidas Frequentes</button>,
}));

jest.mock("../../components/TabelaDuvidasFrequentes", () => ({
  __esModule: true,
  default: ({ aoEditar, duvidas }) => (
    <div data-testid="tabela-duvidas">
      {duvidas.map((duvida) => (
        <div key={duvida.uuid}>
          <span>{duvida.titulo}</span>
          <span>{duvida.categoria}</span>
          <span>{duvida.perfis}</span>
          <button type="button" onClick={() => aoEditar(duvida)}>
            Editar {duvida.titulo}
          </button>
        </div>
      ))}
    </div>
  ),
}));

const UUID_DUVIDA = "22b0d5e4-50f1-46cc-9cee-5fa30b7d7f57";
const UUID_CATEGORIA = "96da837c-009f-41f2-ae46-d4a7fa52aa30";
const UUID_PERFIL = "996c50ce-ea3c-450f-8af0-f19940de223e";

const respostaPaginada = {
  data: {
    count: 14,
    next: "http://localhost/perguntas-frequentes/?page=2&page_size=10",
    previous: null,
    results: [
      {
        categoria: {
          nome: "Gestão de Alimentação",
          uuid: UUID_CATEGORIA,
        },
        pergunta: "Como solicitar uma dieta?",
        perfis: [
          {
            nome: "QUALIDADE",
            uuid: UUID_PERFIL,
          },
        ],
        todos_os_perfis: false,
        uuid: UUID_DUVIDA,
      },
    ],
  },
};

describe("ListagemDuvidasFrequentes", () => {
  const navegar = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(navegar);
    listarPerguntasFrequentes.mockResolvedValue(respostaPaginada);
  });

  it("lista as dúvidas formatadas e apresenta cadastro e paginação", async () => {
    render(<ListagemDuvidasFrequentes />);

    expect(screen.getByText("Carregando dúvidas")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Como solicitar uma dieta?")).toBeInTheDocument();
    });

    expect(
      screen.getByText("Cadastrar Dúvidas Frequentes"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Dúvidas Frequentes Cadastradas"),
    ).toBeInTheDocument();
    expect(screen.getByText("Gestão de Alimentação")).toBeInTheDocument();
    expect(screen.getByText("QUALIDADE")).toBeInTheDocument();
    expect(listarPerguntasFrequentes).toHaveBeenCalledWith({
      ordering: "-criado_em",
      page: 1,
      page_size: 10,
    });
    expect(
      screen.getByRole("button", { name: "Próxima página" }),
    ).toBeInTheDocument();
  });

  it("consulta a página selecionada na paginação", async () => {
    render(<ListagemDuvidasFrequentes />);

    await screen.findByRole("button", { name: "Próxima página" });
    fireEvent.click(screen.getByRole("button", { name: "Próxima página" }));

    await waitFor(() => {
      expect(listarPerguntasFrequentes).toHaveBeenLastCalledWith({
        ordering: "-criado_em",
        page: 2,
        page_size: 10,
      });
    });
  });

  it("direciona para a edição da dúvida selecionada", async () => {
    render(<ListagemDuvidasFrequentes />);

    fireEvent.click(
      await screen.findByRole("button", {
        name: "Editar Como solicitar uma dieta?",
      }),
    );

    expect(navegar).toHaveBeenCalledWith(
      `/${AJUDA}/${CADASTRO_DUVIDAS_FREQUENTES}/${UUID_DUVIDA}/${EDITAR_DUVIDA_FREQUENTE}`,
    );
  });

  it("apresenta a mensagem prevista quando não há dúvidas cadastradas", async () => {
    listarPerguntasFrequentes.mockResolvedValue({
      data: { count: 0, next: null, previous: null, results: [] },
    });

    render(<ListagemDuvidasFrequentes />);

    expect(
      await screen.findByText(/Ainda não há dúvidas frequentes cadastradas/),
    ).toHaveTextContent(
      'Ainda não há dúvidas frequentes cadastradas. Utilize o botão "Cadastrar Dúvidas Frequentes" para realizar o primeiro cadastro.',
    );
  });

  it("limpa a listagem e informa erro quando a consulta falha", async () => {
    listarPerguntasFrequentes.mockRejectedValue(new Error("Falha na API"));

    render(<ListagemDuvidasFrequentes />);

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith(
        "Não foi possível carregar as dúvidas frequentes.",
      );
    });
  });
});
