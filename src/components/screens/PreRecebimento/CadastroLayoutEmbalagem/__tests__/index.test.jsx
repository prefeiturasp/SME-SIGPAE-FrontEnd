import React from "react";
import {
  render,
  screen,
  act,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import CadastroLayoutEmbalagem from "../index";
import mock from "src/services/_mock";
import { mockListaFichasSemLayout } from "src/mocks/services/fichaTecnica.service/mockGetListaFichasSemLayout";
import { PRE_RECEBIMENTO, LAYOUT_EMBALAGEM } from "src/configs/constants";
import { formatarNumeroEProdutoFichaTecnica } from "src/helpers/preRecebimento";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

beforeEach(() => {
  mock
    .onGet("/ficha-tecnica/lista-simples-sem-layout-embalagem/")
    .reply(200, mockListaFichasSemLayout);

  mock.onPost("/layouts-de-embalagem/").reply(201);
});

afterEach(() => {
  mock.reset();
});

const setup = async () => {
  await act(async () => {
    render(
      <MemoryRouter>
        <CadastroLayoutEmbalagem />
      </MemoryRouter>,
    );
  });
};

const clicarBotao = async (texto) => {
  const botao = screen.getByText(texto).closest("button");
  await waitFor(() => {
    expect(botao).not.toBeDisabled();
  });
  fireEvent.click(botao);
};

const selecionaFichaTecnica = async (index = 0) => {
  const ficha = mockListaFichasSemLayout.results[index];
  const textoFormatado = formatarNumeroEProdutoFichaTecnica(ficha);

  const select = screen.getByTestId("ficha_tecnica");
  const input = select.querySelector(".ant-select-selection-search-input");

  // Use fireEvent.mouseDown to open the dropdown (proven reliable in other tests)
  await act(async () => {
    fireEvent.mouseDown(input);
  });

  // Wait for dropdown to appear and find the option within it
  await waitFor(() => {
    const dropdown = document.querySelector(".ant-select-dropdown");
    expect(dropdown).toBeInTheDocument();
  });

  // Find the option by text content within the dropdown
  const option = Array.from(document.querySelectorAll(".ant-select-item")).find(
    (item) => item.textContent.includes(textoFormatado),
  );

  if (option) {
    await act(async () => {
      fireEvent.click(option);
    });
  } else {
    throw new Error(`Option with text "${textoFormatado}" not found`);
  }
};

const simularUpload = (dataTestId, fileName = "arquivo-teste.jpg") => {
  const file = new File(["(⌐□_□)"], fileName, { type: "image/jpeg" });

  const input = screen.getByTestId(dataTestId);
  fireEvent.change(input, { target: { files: [file] } });
};

const encontrarBotaoRemover = (fileName) => {
  const container = screen.getByText(fileName).closest("div");
  return container.querySelector(".exclude-icon");
};

describe("Testa página de Cadastro de Layout de Embalagem", () => {
  it("carrega a página com requisições", async () => {
    await setup();

    await waitFor(() => {
      expect(screen.getByText("Dados do Produto")).toBeInTheDocument();
    });

    expect(mock.history.get.length).toBe(1);
    expect(mock.history.get[0].url).toBe(
      "/ficha-tecnica/lista-simples-sem-layout-embalagem/",
    );
  });

  it("seleciona uma ficha técnica e preenche automaticamente o pregão", async () => {
    await setup();

    await selecionaFichaTecnica(0);

    await waitFor(() => {
      expect(screen.getByTestId("pregao-chamada-publica")).toHaveValue(
        mockListaFichasSemLayout.results[0].pregao_chamada_publica,
      );
    });
  });

  it("exibe etiqueta LEVE LEITE - PLL quando ficha técnica do programa LEVE_LEITE está disponível nas opções", async () => {
    await setup();

    const select = screen.getByTestId("ficha_tecnica");
    const input = select.querySelector(".ant-select-selection-search-input");

    // Open the dropdown to see the options
    await act(async () => {
      fireEvent.mouseDown(input);
    });

    // Wait for dropdown to appear
    await waitFor(() => {
      const dropdown = document.querySelector(".ant-select-dropdown");
      expect(dropdown).toBeInTheDocument();
    });

    // Check that LEVE LEITE tag is visible in the dropdown for the LEVE_LEITE program
    await waitFor(() => {
      expect(screen.getByText("LEVE LEITE - PLL")).toBeInTheDocument();
    });
  });

  it("exibe etiqueta LEVE LEITE - PLL apenas para fichas técnicas do programa LEVE_LEITE no dropdown", async () => {
    await setup();

    const select = screen.getByTestId("ficha_tecnica");
    const input = select.querySelector(".ant-select-selection-search-input");

    // Open the dropdown to see the options
    await act(async () => {
      fireEvent.mouseDown(input);
    });

    // Wait for dropdown to appear
    await waitFor(() => {
      const dropdown = document.querySelector(".ant-select-dropdown");
      expect(dropdown).toBeInTheDocument();
    });

    // Check that there are options with and without the LEVE LEITE tag
    const leveLeiteTags = screen.getAllByText("LEVE LEITE - PLL");
    expect(leveLeiteTags.length).toBeGreaterThan(0); // At least one LEVE_LEITE item

    // Check that FT082 (LEVE_LEITE) has the tag
    const ft082Option = Array.from(
      document.querySelectorAll(".ant-select-item"),
    ).find((item) => item.textContent.includes("FT082 - ARROZ TIPO I"));
    expect(ft082Option).toBeInTheDocument();
    expect(ft082Option.textContent).toContain("LEVE LEITE - PLL");

    // Check that FT078 (not LEVE_LEITE) doesn't have the tag
    const ft078Option = Array.from(
      document.querySelectorAll(".ant-select-item"),
    ).find((item) => item.textContent.includes("FT078 - FARINHA MANDIOCA"));
    expect(ft078Option).toBeInTheDocument();
    expect(ft078Option.textContent).not.toContain("LEVE LEITE - PLL");
  });

  it("faz upload de arquivos para diferentes tipos de embalagem", async () => {
    await setup();

    // Primária
    simularUpload("inserir-arquivo-primaria", "primaria.jpg");
    await waitFor(() => {
      expect(screen.getByText("primaria.jpg")).toBeInTheDocument();
    });

    // Secundária
    simularUpload("inserir-arquivo-secundaria", "secundaria.pdf");
    await waitFor(() => {
      expect(screen.getByText("secundaria.pdf")).toBeInTheDocument();
    });

    // Terciária
    simularUpload("inserir-arquivo-terciaria", "terciaria.png");
    await waitFor(() => {
      expect(screen.getByText("terciaria.png")).toBeInTheDocument();
    });
  });

  it("habilita botão de envio apenas com ficha selecionada e arquivo primário", async () => {
    await setup();

    const btnEnviar = screen.getByText("Enviar Para Análise").closest("button");
    expect(btnEnviar).toBeDisabled();

    await selecionaFichaTecnica(0);
    expect(btnEnviar).toBeDisabled();

    simularUpload("inserir-arquivo-primaria", "primaria.jpg");
    await waitFor(() => {
      expect(btnEnviar).not.toBeDisabled();
    });
  });

  it("abre e fecha modais de confirmação e cancelamento", async () => {
    await setup();
    await selecionaFichaTecnica(0);
    simularUpload("inserir-arquivo-primaria", "primaria.jpg");

    // Modal de confirmação
    await clicarBotao("Enviar Para Análise");
    expect(screen.getByText("Enviar Layout para Análise")).toBeInTheDocument();
    await clicarBotao("Não");

    // Modal de cancelamento
    await clicarBotao("Cancelar");
    expect(
      screen.getByText("Deseja cancelar o Cadastro do Layout de Embalagem?"),
    ).toBeInTheDocument();
    await clicarBotao("Não");
  });

  it("envia o formulário corretamente", async () => {
    await setup();
    await selecionaFichaTecnica(1);

    simularUpload("inserir-arquivo-primaria", "primaria.jpg");
    simularUpload("inserir-arquivo-secundaria", "secundaria.pdf");

    // Preenche observações
    const observacoesInput = screen.getByTestId("observacoes");
    fireEvent.change(observacoesInput, {
      target: { value: "Observações de teste" },
    });

    await clicarBotao("Enviar Para Análise");
    await clicarBotao("Sim");

    await waitFor(() => {
      expect(mock.history.post.length).toBe(1);
      expect(mock.history.post[0].url).toBe("/layouts-de-embalagem/");
      expect(mockNavigate).toHaveBeenCalledWith(
        `/${PRE_RECEBIMENTO}/${LAYOUT_EMBALAGEM}`,
      );
    });
  });

  it("cancela o cadastro e volta para a página anterior", async () => {
    await setup();

    await clicarBotao("Cancelar");
    await clicarBotao("Sim");

    expect(mockNavigate).toHaveBeenCalledWith(
      `/${PRE_RECEBIMENTO}/${LAYOUT_EMBALAGEM}`,
    );
  });

  it("remove arquivos corretamente", async () => {
    await setup();

    simularUpload("inserir-arquivo-primaria", "para-remover.jpg");
    await waitFor(() => {
      expect(screen.getByText("para-remover.jpg")).toBeInTheDocument();
    });

    const removeButton = encontrarBotaoRemover("para-remover.jpg");
    fireEvent.click(removeButton);

    await waitFor(() => {
      expect(screen.queryByText("para-remover.jpg")).not.toBeInTheDocument();
    });
  });
});
