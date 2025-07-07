import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import FaqPage from "../FaqPage";
import { getFaq } from "../../../services/faq.service";

jest.mock("../../../services/faq.service");

describe("Testes do componente FaqPage", () => {
  const mockCategories = [
    {
      nome: "Geral",
      perguntas: [
        {
          pergunta: "Como resetar minha senha?",
          resposta:
            "Você pode resetar sua senha clicando em 'Esqueci minha senha' na página de login.",
        },
        {
          pergunta: "Como entrar em contato com o suporte?",
          resposta: "Entre em contato pelo email suporte@sigpae.com.br",
        },
      ],
    },
    {
      nome: "Cadastros",
      perguntas: [
        {
          pergunta: "Como cadastrar um novo usuário?",
          resposta: "Acesse o menu 'Usuários' e clique em 'Adicionar novo'.",
        },
      ],
    },
  ];

  beforeEach(() => {
    getFaq.mockResolvedValue({ data: mockCategories });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderFaqPage = () => {
    return render(
      <MemoryRouter>
        <FaqPage />
      </MemoryRouter>
    );
  };

  it("deve renderizar o componente corretamente", async () => {
    renderFaqPage();

    expect(screen.getByText("Como podemos ajudar?")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Pesquisar")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Geral")).toBeInTheDocument();
      expect(screen.getByText("Cadastros")).toBeInTheDocument();
    });
  });

  it("deve exibir o loading enquanto os dados são carregados", async () => {
    renderFaqPage();

    expect(screen.getByAltText("ajax-loader")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByAltText("ajax-loader")).not.toBeInTheDocument();
    });
  });

  it("deve exibir as categorias e perguntas após carregamento", async () => {
    renderFaqPage();

    await waitFor(() => {
      expect(screen.getByText("Geral")).toBeInTheDocument();
      expect(screen.getByText("Como resetar minha senha?")).toBeInTheDocument();
      expect(
        screen.getByText("Como entrar em contato com o suporte?")
      ).toBeInTheDocument();
    });
  });

  it("deve filtrar perguntas ao digitar no campo de busca", async () => {
    renderFaqPage();

    await waitFor(() => {
      expect(screen.getByText("Geral")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText("Pesquisar");
    fireEvent.change(searchInput, { target: { value: "resetar" } });

    await waitFor(() => {
      expect(screen.getByText("Geral (1)")).toBeInTheDocument();
      expect(screen.getByText("Como resetar minha senha?")).toBeInTheDocument();
      expect(
        screen.queryByText("Como entrar em contato com o suporte?")
      ).not.toBeInTheDocument();
    });
  });

  it("deve mostrar 'Limpar busca' quando há texto no campo de busca", async () => {
    renderFaqPage();

    await waitFor(() => {
      expect(screen.getByText("Geral")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText("Pesquisar");
    fireEvent.change(searchInput, { target: { value: "teste" } });

    expect(screen.getByText("Limpar busca")).toBeInTheDocument();
  });

  it("deve limpar a busca ao clicar em 'Limpar busca'", async () => {
    renderFaqPage();

    await waitFor(() => {
      expect(screen.getByText("Geral")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText("Pesquisar");
    fireEvent.change(searchInput, { target: { value: "teste" } });

    const clearSearch = screen.getByText("Limpar busca");
    fireEvent.click(clearSearch);

    await waitFor(() => {
      expect(searchInput).toHaveValue("");
      expect(screen.getByText("Geral")).toBeInTheDocument();
      expect(screen.getByText("Cadastros")).toBeInTheDocument();
    });
  });

  it("deve mostrar todas as perguntas quando o campo de busca está vazio", async () => {
    renderFaqPage();

    await waitFor(() => {
      expect(screen.getByText("Geral")).toBeInTheDocument();
      expect(screen.getByText("Cadastros")).toBeInTheDocument();
    });

    expect(screen.getByText("Como resetar minha senha?")).toBeInTheDocument();
    expect(
      screen.getByText("Como entrar em contato com o suporte?")
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText("Cadastros"));

    await waitFor(() => {
      expect(
        screen.getByText("Como cadastrar um novo usuário?")
      ).toBeInTheDocument();
    });
  });

  it("deve mostrar mensagem quando nenhum resultado é encontrado", async () => {
    renderFaqPage();

    await waitFor(() => {
      expect(screen.getByText("Geral")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText("Pesquisar");
    fireEvent.change(searchInput, { target: { value: "xyz123" } });

    await waitFor(() => {
      expect(screen.getByText("Geral (0)")).toBeInTheDocument();
      expect(screen.getByText("Cadastros (0)")).toBeInTheDocument();
    });
  });
});
