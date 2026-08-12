import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { usuarioComAcessoAoCadastroDeCategorias } from "../../../helpers/utilities";
import { getFaq } from "../../../services/faq.service";
import FaqPage from "../FaqPage";

jest.mock("../../../services/faq.service");

jest.mock("../../../helpers/utilities", () => ({
  ...jest.requireActual("../../../helpers/utilities"),
  usuarioComAcessoAoCadastroDeCategorias: jest.fn(),
}));

jest.mock(
  "../../../components/Shareable/Page/PageNoSidebar",
  () =>
    function PageNoSidebarMock({ children }) {
      return <main>{children}</main>;
    },
);

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("Testes do componente FaqPage", () => {
  const navigateMock = jest.fn();

  const mockCategories = [
    {
      uuid: "389e0274-9adf-45c6-bdb0-c249bfb08bfa",
      nome: "Geral",
      perguntas: [
        {
          uuid: "d3de8a14-ac78-4ed4-a4bc-97b9266a8461",
          pergunta: "Como resetar minha senha?",
          resposta:
            "Você pode resetar sua senha clicando em 'Esqueci minha senha' na página de login.",
        },
        {
          uuid: "930bda7c-c025-417d-8810-e35e288e5e4f",
          pergunta: "Como entrar em contato com o suporte?",
          resposta: "Entre em contato pelo email suporte@sigpae.com.br",
        },
      ],
    },
    {
      uuid: "f1932643-28b3-4a88-b7c6-ab908c665dc3",
      nome: "Cadastros",
      perguntas: [
        {
          uuid: "99f74537-e7a7-4b73-b5ef-2736cae4b733",
          pergunta: "Como cadastrar um novo usuário?",
          resposta: "Acesse o menu 'Usuários' e clique em 'Adicionar novo'.",
        },
      ],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    getFaq.mockResolvedValue({
      data: mockCategories,
    });

    usuarioComAcessoAoCadastroDeCategorias.mockReturnValue(true);
    useNavigate.mockReturnValue(navigateMock);
  });

  const renderFaqPage = () => {
    return render(
      <MemoryRouter>
        <FaqPage />
      </MemoryRouter>,
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

    expect(getFaq).toHaveBeenCalledTimes(1);
  });

  it("deve exibir o loading enquanto os dados são carregados", async () => {
    renderFaqPage();

    expect(screen.getByAltText("ajax-loader")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByAltText("ajax-loader")).not.toBeInTheDocument();
    });
  });

  it("deve exibir somente as perguntas da primeira categoria após o carregamento", async () => {
    renderFaqPage();

    expect(
      await screen.findByText("Como resetar minha senha?"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Como entrar em contato com o suporte?"),
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Como cadastrar um novo usuário?"),
    ).not.toBeInTheDocument();
  });

  it("deve exibir as perguntas da categoria selecionada", async () => {
    renderFaqPage();

    await screen.findByText("Como resetar minha senha?");

    fireEvent.click(
      screen.getByRole("button", {
        name: "Cadastros",
      }),
    );

    expect(
      await screen.findByText("Como cadastrar um novo usuário?"),
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Como resetar minha senha?"),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText("Como entrar em contato com o suporte?"),
    ).not.toBeInTheDocument();
  });

  it("deve filtrar perguntas da categoria atual pelo texto pesquisado", async () => {
    renderFaqPage();

    await screen.findByText("Como resetar minha senha?");

    fireEvent.change(screen.getByPlaceholderText("Pesquisar"), {
      target: {
        value: "resetar",
      },
    });

    await waitFor(() => {
      expect(screen.getByText("Como resetar minha senha?")).toBeInTheDocument();

      expect(
        screen.queryByText("Como entrar em contato com o suporte?"),
      ).not.toBeInTheDocument();
    });
  });

  it("deve localizar uma pergunta pertencente a outra categoria", async () => {
    renderFaqPage();

    await screen.findByText("Como resetar minha senha?");

    fireEvent.change(screen.getByPlaceholderText("Pesquisar"), {
      target: {
        value: "cadastrar",
      },
    });

    expect(
      await screen.findByText("Como cadastrar um novo usuário?"),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("button", {
        name: "Geral",
      }),
    ).not.toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Cadastros",
      }),
    ).toBeInTheDocument();
  });

  it("deve restaurar as categorias e selecionar a primeira ao limpar o campo", async () => {
    renderFaqPage();

    await screen.findByText("Como resetar minha senha?");

    const searchInput = screen.getByPlaceholderText("Pesquisar");

    fireEvent.change(searchInput, {
      target: {
        value: "cadastrar",
      },
    });

    await screen.findByText("Como cadastrar um novo usuário?");

    fireEvent.change(searchInput, {
      target: {
        value: "",
      },
    });

    await waitFor(() => {
      expect(searchInput).toHaveValue("");

      expect(
        screen.getByRole("button", {
          name: "Geral",
        }),
      ).toBeInTheDocument();

      expect(
        screen.getByRole("button", {
          name: "Cadastros",
        }),
      ).toBeInTheDocument();

      expect(screen.getByText("Como resetar minha senha?")).toBeInTheDocument();
    });

    expect(
      screen.queryByText("Como cadastrar um novo usuário?"),
    ).not.toBeInTheDocument();
  });

  it("não deve exibir categorias ou perguntas quando nenhum resultado for encontrado", async () => {
    renderFaqPage();

    await screen.findByText("Como resetar minha senha?");

    fireEvent.change(screen.getByPlaceholderText("Pesquisar"), {
      target: {
        value: "xyz123",
      },
    });

    await waitFor(() => {
      expect(
        screen.queryByRole("button", {
          name: "Geral",
        }),
      ).not.toBeInTheDocument();

      expect(
        screen.queryByRole("button", {
          name: "Cadastros",
        }),
      ).not.toBeInTheDocument();

      expect(
        screen.queryByText("Como resetar minha senha?"),
      ).not.toBeInTheDocument();

      expect(
        screen.queryByText("Como cadastrar um novo usuário?"),
      ).not.toBeInTheDocument();
    });
  });

  it("deve exibir o botão de cadastro de categoria para usuário autorizado", async () => {
    renderFaqPage();

    await screen.findByText("Geral");

    expect(
      screen.getByRole("button", {
        name: "Cadastro de Categoria",
      }),
    ).toBeInTheDocument();
  });

  it("não deve exibir o botão de cadastro de categoria para usuário sem permissão", async () => {
    usuarioComAcessoAoCadastroDeCategorias.mockReturnValue(false);

    renderFaqPage();

    await screen.findByText("Geral");

    expect(
      screen.queryByRole("button", {
        name: "Cadastro de Categoria",
      }),
    ).not.toBeInTheDocument();
  });

  it("deve navegar para o cadastro de categoria ao clicar no botão", async () => {
    renderFaqPage();

    await screen.findByText("Geral");

    fireEvent.click(
      screen.getByRole("button", {
        name: "Cadastro de Categoria",
      }),
    );

    expect(navigateMock).toHaveBeenCalledTimes(1);

    expect(navigateMock).toHaveBeenCalledWith("/ajuda/cadastro-categoria");
  });
});
