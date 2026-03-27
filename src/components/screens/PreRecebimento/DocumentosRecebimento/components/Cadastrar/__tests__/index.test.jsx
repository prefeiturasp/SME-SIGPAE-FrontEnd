import "@testing-library/jest-dom";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import CadastrarDocumentosRecebimentoPage from "src/pages/PreRecebimento/CadastroDocumentosRecebimentoPage";
import mock from "src/services/_mock";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const mockCronogramas = {
  results: [
    {
      uuid: "cronograma-uuid-1",
      numero: "001/2024",
      pregao_chamada_publica: "123/2024",
      nome_produto: "Produto Teste 1",
      programa_leve_leite: false,
    },
    {
      uuid: "cronograma-uuid-2",
      numero: "002/2024",
      pregao_chamada_publica: "456/2024",
      nome_produto: "Produto Teste 2",
      programa_leve_leite: true,
    },
  ],
};

beforeEach(() => {
  mockNavigate.mockClear();
  mock
    .onGet(/\/cronogramas\/lista-cronogramas-cadastro\/?/)
    .reply(200, mockCronogramas);
  mock
    .onPost(/\/documentos-de-recebimento\/?/)
    .reply(201, { uuid: "new-uuid" });
});

afterEach(() => {
  cleanup();
  mock.reset();
  jest.clearAllMocks();
});

const setup = async () => {
  await act(async () => {
    render(
      <MemoryRouter>
        <CadastrarDocumentosRecebimentoPage />
        <ToastContainer />
      </MemoryRouter>,
    );
  });
  await waitFor(() => {
    expect(screen.getByText("Dados do Laudo")).toBeInTheDocument();
  });
};

const fillInput = (placeholder, value) => {
  const input = screen.getByPlaceholderText(placeholder);
  fireEvent.change(input, { target: { value } });
};

const selecionarCronograma = async () => {
  const cronogramaInput = document.querySelector(".autocomplete-select input");
  fireEvent.change(cronogramaInput, { target: { value: "001" } });
  fireEvent.focus(cronogramaInput);

  await waitFor(
    () => {
      const dropdown = document.querySelector(".ant-select-dropdown");
      if (dropdown) {
        const option = dropdown.querySelector(
          ".ant-select-item-option-content",
        );
        if (option) fireEvent.click(option);
      }
    },
    { timeout: 3000 },
  );
};

const fazerUploadLaudo = async (fileName = "laudo.pdf") => {
  const uploadButton = document.querySelector(".upload-button");
  fireEvent.click(uploadButton);

  await waitFor(
    () => {
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) {
        const file = new File(["conteúdo"], fileName, {
          type: "application/pdf",
        });
        fireEvent.change(fileInput, { target: { files: [file] } });
      }
    },
    { timeout: 1000 },
  );

  await waitFor(
    () => {
      expect(screen.getByText(fileName)).toBeInTheDocument();
    },
    { timeout: 3000 },
  );
};

const preencherFormularioCompleto = async () => {
  await selecionarCronograma();
  fillInput("Digite o Nº do Laudo", "LAUDO-001");
  await fazerUploadLaudo();
};

describe("CadastrarDocumentosRecebimento", () => {
  describe("Carregamento Inicial", () => {
    it("renderiza o componente com todos os campos", async () => {
      await setup();
      expect(screen.getByText("Dados do Laudo")).toBeInTheDocument();
      expect(screen.getByText("Nº do Cronograma")).toBeInTheDocument();
      expect(
        screen.getByText("Nº do Pregão/Chamada Pública"),
      ).toBeInTheDocument();
      expect(screen.getByText("Nome do Produto")).toBeInTheDocument();
      expect(screen.getByText("Nº do Laudo")).toBeInTheDocument();
      expect(screen.getByText("Salvar e Enviar")).toBeInTheDocument();
      expect(screen.getByText("Cancelar")).toBeInTheDocument();
      expect(screen.getByText("Outros Documentos")).toBeInTheDocument();
      expect(
        screen.getByText(/Caso o laudo contiver múltiplas páginas/),
      ).toBeInTheDocument();
    });
  });

  describe("Seleção de Cronograma", () => {
    it("possui autocomplete para cronograma", async () => {
      await setup();
      expect(
        document.querySelector(".autocomplete-select"),
      ).toBeInTheDocument();
    });

    it("abre dropdown ao digitar no campo cronograma", async () => {
      await setup();

      const cronogramaInput = document.querySelector(
        ".autocomplete-select input",
      );
      fireEvent.change(cronogramaInput, { target: { value: "001" } });
      fireEvent.focus(cronogramaInput);

      await waitFor(
        () => {
          expect(
            document.querySelector(".ant-select-dropdown"),
          ).toBeInTheDocument();
        },
        { timeout: 2000 },
      );
    });

    it("seleciona cronograma e popula campos dependentes", async () => {
      await setup();
      await selecionarCronograma();

      await waitFor(
        () => {
          expect(screen.getByDisplayValue("123/2024")).toBeInTheDocument();
          expect(
            screen.getByDisplayValue("Produto Teste 1"),
          ).toBeInTheDocument();
        },
        { timeout: 2000 },
      );
    });
  });

  describe("Preenchimento de Formulário", () => {
    it("preenche número do laudo", async () => {
      await setup();
      fillInput("Digite o Nº do Laudo", "LAUDO-TEST-001");
      expect(screen.getByDisplayValue("LAUDO-TEST-001")).toBeInTheDocument();
    });

    it("limpa campo laudo", async () => {
      await setup();
      const input = screen.getByPlaceholderText("Digite o Nº do Laudo");
      fireEvent.change(input, { target: { value: "LAUDO-TEST" } });
      expect(input.value).toBe("LAUDO-TEST");

      fireEvent.change(input, { target: { value: "" } });
      expect(input.value).toBe("");
    });
  });

  describe("Validação de Formulário", () => {
    it("botão Salvar está desabilitado inicialmente", async () => {
      await setup();
      expect(
        screen.getByText("Salvar e Enviar").closest("button"),
      ).toBeDisabled();
    });

    it("botão Cancelar está habilitado", async () => {
      await setup();
      expect(screen.getByText("Cancelar").closest("button")).not.toBeDisabled();
    });

    it("botão permanece desabilitado sem cronograma", async () => {
      await setup();
      fillInput("Digite o Nº do Laudo", "LAUDO-001");
      expect(
        screen.getByText("Salvar e Enviar").closest("button"),
      ).toBeDisabled();
    });

    it("botão permanece desabilitado sem arquivo", async () => {
      await setup();
      await selecionarCronograma();
      fillInput("Digite o Nº do Laudo", "LAUDO-001");
      expect(
        screen.getByText("Salvar e Enviar").closest("button"),
      ).toBeDisabled();
    });

    it("botão habilita após preencher todos os campos obrigatórios", async () => {
      await setup();
      await preencherFormularioCompleto();
      expect(
        screen.getByText("Salvar e Enviar").closest("button"),
      ).not.toBeDisabled();
    });
  });

  describe("Upload de Arquivos", () => {
    it("exibe área de upload do laudo", async () => {
      await setup();
      expect(screen.getByText("Anexar Laudo")).toBeInTheDocument();
      expect(screen.getByText(/Campo Obrigatório/)).toBeInTheDocument();
      expect(screen.getByText(/10MB/)).toBeInTheDocument();
      expect(screen.getByText(/PDF/)).toBeInTheDocument();
      expect(document.querySelector('input[type="file"]')).toBeInTheDocument();
    });

    it("faz upload de arquivo e exibe na lista", async () => {
      await setup();
      await fazerUploadLaudo("laudo-test.pdf");
      expect(screen.getByText("laudo-test.pdf")).toBeInTheDocument();
    });

    it("remove arquivo ao clicar no botão de remover", async () => {
      await setup();
      await fazerUploadLaudo("to-remove.pdf");

      const removeButton = document.querySelector(".exclude-icon");
      fireEvent.click(removeButton);

      await waitFor(
        () => {
          expect(screen.queryByText("to-remove.pdf")).not.toBeInTheDocument();
        },
        { timeout: 2000 },
      );
    });
  });

  describe("Modal de Confirmação", () => {
    it("abre modal ao submeter formulário", async () => {
      await setup();
      await preencherFormularioCompleto();

      const submitButton = screen
        .getByText("Salvar e Enviar")
        .closest("button");
      fireEvent.click(submitButton);

      await waitFor(
        () => {
          expect(
            screen.getByText("Salvar e Enviar Documentos"),
          ).toBeInTheDocument();
          expect(screen.getByText("Sim")).toBeInTheDocument();
          expect(screen.getByText("Não")).toBeInTheDocument();
        },
        { timeout: 3000 },
      );
    });

    it("fecha modal ao clicar em Não", async () => {
      await setup();
      await preencherFormularioCompleto();

      fireEvent.click(screen.getByText("Salvar e Enviar").closest("button"));

      await waitFor(() => {
        expect(screen.getByText("Não")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText("Não"));

      await waitFor(
        () => {
          expect(
            screen.queryByText("Salvar e Enviar Documentos"),
          ).not.toBeInTheDocument();
        },
        { timeout: 2000 },
      );
    });

    it("envia formulário ao clicar em Sim", async () => {
      await setup();
      await preencherFormularioCompleto();

      fireEvent.click(screen.getByText("Salvar e Enviar").closest("button"));

      await waitFor(() => {
        expect(screen.getByText("Sim")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText("Sim"));

      await waitFor(
        () => {
          expect(mockNavigate).toHaveBeenCalled();
        },
        { timeout: 3000 },
      );
    });
  });

  describe("Navegação", () => {
    it("cancela e navega para página anterior", async () => {
      await setup();
      fireEvent.click(screen.getByText("Cancelar").closest("button"));
      expect(mockNavigate).toHaveBeenCalled();
    });
  });

  describe("Estrutura do Componente", () => {
    it("renderiza com classes corretas", async () => {
      await setup();
      expect(
        document.querySelector(".card-cadastro-documento-recebimento"),
      ).toBeInTheDocument();
      expect(document.querySelector("hr")).toBeInTheDocument();
      expect(document.querySelector(".alert-warning")).toBeInTheDocument();
    });
  });

  describe("API", () => {
    it("faz chamada para carregar cronogramas", async () => {
      await setup();
      await waitFor(() => {
        expect(mock.history.get.length).toBeGreaterThan(0);
      });
    });
  });
});
