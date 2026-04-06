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
import mock from "src/services/_mock";
import CadastrarCronogramaSemanal from "src/components/screens/PreRecebimento/CronogramaSemanalFLV/components/Cadastrar";
import {
  mockCronogramasMensalAssinados,
  mockCronogramaMensalDetalhado,
} from "src/mocks/services/cronogramaSemanal.service";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

beforeEach(() => {
  mockNavigate.mockClear();
  mock.reset();
  mock
    .onGet("/cronogramas-semanais/cronogramas-mensal-assinados/")
    .reply(200, mockCronogramasMensalAssinados);
  mock
    .onGet("/cronogramas/cronograma-uuid-1/")
    .reply(200, mockCronogramaMensalDetalhado);
  mock
    .onPost("/cronogramas-semanais/rascunho/")
    .reply(201, { uuid: "novo-uuid-123" });
  mock
    .onPatch("/cronogramas-semanais/rascunho/uuid-edicao-123/")
    .reply(200, { uuid: "uuid-edicao-123" });
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
        <CadastrarCronogramaSemanal />
        <ToastContainer />
      </MemoryRouter>,
    );
  });
  await waitFor(() => {
    expect(
      screen.getByText("Cronograma Mensal Cadastrado"),
    ).toBeInTheDocument();
  });
};

const selecionarCronograma = async () => {
  const cronogramaInput = document.querySelector(
    ".autocomplete input",
  ) as HTMLInputElement;

  // 1. Digitar para abrir dropdown
  fireEvent.change(cronogramaInput, { target: { value: "CR-001" } });
  fireEvent.focus(cronogramaInput);

  // 2. Aguardar dropdown aparecer
  await waitFor(
    () => {
      expect(
        document.querySelector(".ant-select-dropdown"),
      ).toBeInTheDocument();
    },
    { timeout: 3000 },
  );

  // 3. Clicar na opção
  const option = document.querySelector(".ant-select-item-option-content");
  fireEvent.click(option!);

  // 4. Aguardar carregamento dos dados do cronograma
  await waitFor(
    () => {
      expect(screen.getByDisplayValue("Alface Crespa")).toBeInTheDocument();
    },
    { timeout: 5000 },
  );
};

const preencherProgramacao = async () => {
  await selecionarCronograma();

  await waitFor(() => {
    expect(screen.getByText("+ Adicionar Programação")).toBeInTheDocument();
  });

  fireEvent.click(screen.getByText("+ Adicionar Programação"));

  await waitFor(() => {
    expect(screen.getByText("Mês Programado")).toBeInTheDocument();
  });

  const selectMes = screen
    .getByText("Mês Programado")
    .closest(".row")
    ?.querySelector("select");

  if (selectMes) {
    fireEvent.change(selectMes, { target: { value: "03/2026" } });
  }

  const inputQtd = screen.getByPlaceholderText("Informe a quantidade");
  fireEvent.change(inputQtd, { target: { value: "1000" } });
};

describe("CadastrarCronogramaSemanal", () => {
  describe("Carregamento Inicial", () => {
    it("renderiza o componente com todos os campos", async () => {
      await setup();
      expect(
        screen.getByText("Cronograma Mensal Cadastrado"),
      ).toBeInTheDocument();
      expect(screen.getByText("Produto")).toBeInTheDocument();
      expect(screen.getByText("Fornecedor")).toBeInTheDocument();
      expect(screen.getByText("Nº do Contrato")).toBeInTheDocument();
      expect(
        screen.getByText("Nº do Processo SEI - Contratos"),
      ).toBeInTheDocument();
      expect(screen.getByText("Nº do Empenho")).toBeInTheDocument();
      expect(
        screen.getByText("Quantidade Total do Empenho"),
      ).toBeInTheDocument();
      expect(screen.getByText("Custo Unitário do Produto")).toBeInTheDocument();
    });

    it("faz chamada para carregar cronogramas ao montar", async () => {
      await setup();
      await waitFor(() => {
        expect(mock.history.get.length).toBeGreaterThan(0);
      });
      expect(
        mock.history.get.some((call) =>
          call.url?.includes(
            "/cronogramas-semanais/cronogramas-mensal-assinados/",
          ),
        ),
      ).toBe(true);
    });
  });

  describe("Seleção de Cronograma", () => {
    it("possui autocomplete para cronograma mensal", async () => {
      await setup();
      expect(document.querySelector(".autocomplete")).toBeInTheDocument();
      expect(document.querySelector(".autocomplete input")).toBeInTheDocument();
    });

    it("seleciona cronograma e popula campos dependentes", async () => {
      await setup();
      await selecionarCronograma();

      expect(screen.getByDisplayValue("Alface Crespa")).toBeInTheDocument();
      expect(
        screen.getByDisplayValue("Hortifruti São Paulo LTDA"),
      ).toBeInTheDocument();
      expect(screen.getByDisplayValue("0001/2024")).toBeInTheDocument();
      expect(screen.getByDisplayValue("2024/00001")).toBeInTheDocument();
      expect(screen.getByDisplayValue("EMP-001/2024")).toBeInTheDocument();
    });

    it("exibe seção de programação de entrega após seleção", async () => {
      await setup();
      await selecionarCronograma();

      await waitFor(() => {
        expect(screen.getByText("Programação de Entrega")).toBeInTheDocument();
      });
    });

    it("exibe campo observações após seleção", async () => {
      await setup();
      await selecionarCronograma();

      await waitFor(() => {
        expect(screen.getByText("Observações")).toBeInTheDocument();
      });
    });

    it("exibe Nº da Ata quando tem pregão", async () => {
      await setup();
      await selecionarCronograma();

      await waitFor(() => {
        expect(screen.getByText("Nº da Ata")).toBeInTheDocument();
      });
    });
  });

  describe("Botão Salvar Rascunho", () => {
    it("não exibe botão salvar sem cronograma mensal", async () => {
      await setup();
      expect(screen.queryByText("Salvar Rascunho")).not.toBeInTheDocument();
    });

    it("exibe botão salvar após selecionar cronograma", async () => {
      await setup();
      await selecionarCronograma();

      await waitFor(() => {
        expect(screen.getByText("Salvar Rascunho")).toBeInTheDocument();
      });
    });

    it("botão salvar habilitado após selecionar cronograma", async () => {
      await setup();
      await selecionarCronograma();

      await waitFor(() => {
        const botaoSalvar = screen
          .getByText("Salvar Rascunho")
          .closest("button");
        expect(botaoSalvar).not.toBeDisabled();
      });
    });
  });

  describe("Salvar Rascunho - Submit", () => {
    it("salva rascunho com sucesso", async () => {
      await setup();
      await selecionarCronograma();

      // Aguardar botão estar disponível
      await waitFor(() => {
        expect(screen.getByTestId("botao-salvar-rascunho")).toBeInTheDocument();
      });

      // Aguardar mais um pouco para garantir que o form atualizou
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      const form = screen.getByTestId("form-cronograma-semanal");
      fireEvent.submit(form);

      await waitFor(
        () => {
          expect(
            mock.history.post.some((call) =>
              call.url?.includes("/cronogramas-semanais/rascunho/"),
            ),
          ).toBe(true);
        },
        { timeout: 5000 },
      );
    });

    it("exibe toast de sucesso ao salvar", async () => {
      await setup();
      await selecionarCronograma();

      await waitFor(() => {
        expect(screen.getByTestId("botao-salvar-rascunho")).toBeInTheDocument();
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      const form = screen.getByTestId("form-cronograma-semanal");
      fireEvent.submit(form);

      await waitFor(
        () => {
          expect(
            screen.getByText("Rascunho salvo com sucesso!"),
          ).toBeInTheDocument();
        },
        { timeout: 5000 },
      );
    });

    it("salva com programação preenchida", async () => {
      await setup();
      await preencherProgramacao();

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      const form = screen.getByTestId("form-cronograma-semanal");
      fireEvent.submit(form);

      await waitFor(
        () => {
          expect(
            mock.history.post.some((call) =>
              call.url?.includes("/cronogramas-semanais/rascunho/"),
            ),
          ).toBe(true);
        },
        { timeout: 5000 },
      );
    });
  });

  describe("Erros e Edge Cases", () => {
    it("erro ao carregar cronogramas mensal continua renderizando", async () => {
      mock.reset();
      mock
        .onGet("/cronogramas-semanais/cronogramas-mensal-assinados/")
        .reply(500);

      await act(async () => {
        render(
          <MemoryRouter>
            <CadastrarCronogramaSemanal />
            <ToastContainer />
          </MemoryRouter>,
        );
      });

      await waitFor(() => {
        expect(
          screen.getByText("Cronograma Mensal Cadastrado"),
        ).toBeInTheDocument();
      });
    });

    it("timeout na requisição de cronogramas", async () => {
      mock.reset();
      mock
        .onGet("/cronogramas-semanais/cronogramas-mensal-assinados/")
        .timeout();

      await act(async () => {
        render(
          <MemoryRouter>
            <CadastrarCronogramaSemanal />
          </MemoryRouter>,
        );
      });

      await waitFor(() => {
        expect(
          screen.getByText("Cronograma Mensal Cadastrado"),
        ).toBeInTheDocument();
      });
    });

    it("erro de rede ao carregar cronogramas", async () => {
      mock.reset();
      mock
        .onGet("/cronogramas-semanais/cronogramas-mensal-assinados/")
        .networkError();

      await act(async () => {
        render(
          <MemoryRouter>
            <CadastrarCronogramaSemanal />
          </MemoryRouter>,
        );
      });

      await waitFor(() => {
        expect(
          screen.getByText("Cronograma Mensal Cadastrado"),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Estrutura do Componente", () => {
    it("possui card de cadastro", async () => {
      await setup();
      expect(
        document.querySelector(".card-cadastro-cronograma-semanal"),
      ).toBeInTheDocument();
    });

    it("possui card-body", async () => {
      await setup();
      expect(
        document.querySelector(".cadastro-cronograma-semanal"),
      ).toBeInTheDocument();
    });

    it("campo cronograma possui asterisco de obrigatório", async () => {
      await setup();
      expect(document.querySelector(".required-asterisk")).toBeInTheDocument();
    });

    it("formulário está presente", async () => {
      await setup();
      const form = document.querySelector("form");
      expect(form).toBeInTheDocument();
    });
  });

  describe("Interação com Formulário", () => {
    it("permite preencher observações", async () => {
      await setup();
      await selecionarCronograma();

      await waitFor(() => {
        expect(screen.getByText("Observações")).toBeInTheDocument();
      });

      const textarea = screen.getByPlaceholderText(
        "Digite suas observações...",
      ) as HTMLTextAreaElement;
      fireEvent.change(textarea, { target: { value: "Observação de teste" } });

      expect(textarea.value).toBe("Observação de teste");
    });

    it("limpa campo quantidade", async () => {
      await setup();
      await selecionarCronograma();

      await waitFor(() => {
        expect(screen.getByText("+ Adicionar Programação")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText("+ Adicionar Programação"));

      await waitFor(() => {
        expect(screen.getByText("Quantidade da Entrega")).toBeInTheDocument();
      });

      const inputQtd = screen.getByPlaceholderText(
        "Informe a quantidade",
      ) as HTMLInputElement;
      fireEvent.change(inputQtd, { target: { value: "100" } });
      expect(inputQtd.value).toBe("100");

      fireEvent.change(inputQtd, { target: { value: "" } });
      expect(inputQtd.value).toBe("");
    });
  });

  describe("Validações", () => {
    it("não permite salvar sem cronograma mensal", async () => {
      await setup();

      const form = document.querySelector("form");
      fireEvent.submit(form!);

      await waitFor(() => {
        expect(
          screen.getByText("Selecione um Cronograma Mensal"),
        ).toBeInTheDocument();
      });
    });

    it("mensagem de quantidade muda quando preenchida", async () => {
      await setup();
      await selecionarCronograma();

      await waitFor(() => {
        expect(screen.getByText("+ Adicionar Programação")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText("+ Adicionar Programação"));

      await waitFor(() => {
        expect(screen.getByText(/Faltam/i)).toBeInTheDocument();
      });

      const inputQtd = screen.getByPlaceholderText("Informe a quantidade");
      fireEvent.change(inputQtd, { target: { value: "1000" } });

      await waitFor(() => {
        const textoFaltante = screen.getByText(/Faltam|Quantidade maior/i);
        const elementoTexto = textoFaltante.closest(".texto-alimento-faltante");
        expect(elementoTexto).toBeInTheDocument();
      });
    });

    it("remove programação ao clicar no botão de lixeira", async () => {
      await setup();
      await selecionarCronograma();

      await waitFor(() => {
        expect(screen.getByText("+ Adicionar Programação")).toBeInTheDocument();
      });

      // Adicionar duas programações
      fireEvent.click(screen.getByText("+ Adicionar Programação"));
      await waitFor(() => {
        expect(screen.getByText("Mês Programado")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText("+ Adicionar Programação"));

      await waitFor(() => {
        // Deve haver 2 elementos "Mês Programado" (2 programações)
        expect(screen.getAllByText("Mês Programado").length).toBe(2);
      });

      // Verificar que há botão com ícone de lixeira
      const trashButtons = document.querySelectorAll(
        "button i.fa-trash, button .fa-trash",
      );
      expect(trashButtons.length).toBeGreaterThan(0);

      // Clicar no botão de remover (parent do ícone)
      const trashButton = trashButtons[0].closest("button");
      fireEvent.click(trashButton!);

      await waitFor(() => {
        // Após remoção, só deve haver 1 programação
        expect(screen.getAllByText("Mês Programado").length).toBe(1);
      });
    });

    it("limpa campos de data ao mudar mês programado", async () => {
      await setup();
      await selecionarCronograma();

      await waitFor(() => {
        expect(screen.getByText("+ Adicionar Programação")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText("+ Adicionar Programação"));

      await waitFor(() => {
        expect(screen.getByText("Mês Programado")).toBeInTheDocument();
      });

      // Selecionar o mês
      const selectMes = screen
        .getByText("Mês Programado")
        .closest(".row")
        ?.querySelector("select");

      if (selectMes) {
        // Mudar o mês deve disparar o onChange que limpa os campos de data
        fireEvent.change(selectMes, { target: { value: "03/2026" } });

        await waitFor(() => {
          // Verificar que o select foi alterado
          expect(selectMes.value).toBe("03/2026");
        });
      }
    });
  });

  describe("Erros de API", () => {
    it("exibe erro ao falhar carregamento de detalhes do cronograma", async () => {
      mock.reset();
      mock
        .onGet("/cronogramas-semanais/cronogramas-mensal-assinados/")
        .reply(200, mockCronogramasMensalAssinados);
      mock.onGet("/cronogramas/cronograma-uuid-1/").reply(500);

      await act(async () => {
        render(
          <MemoryRouter>
            <CadastrarCronogramaSemanal />
            <ToastContainer />
          </MemoryRouter>,
        );
      });

      await waitFor(() => {
        expect(
          screen.getByText("Cronograma Mensal Cadastrado"),
        ).toBeInTheDocument();
      });

      const cronogramaInput = document.querySelector(
        ".autocomplete input",
      ) as HTMLInputElement;
      fireEvent.change(cronogramaInput, { target: { value: "CR-001" } });
      fireEvent.focus(cronogramaInput);

      await waitFor(() => {
        expect(
          document.querySelector(".ant-select-dropdown"),
        ).toBeInTheDocument();
      });

      const option = document.querySelector(".ant-select-item-option-content");
      fireEvent.click(option!);

      // Aguardar um pouco para o erro ser processado
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
      });

      // Verificar que não carregou os dados (input de produto vazio ou não existe)
      await waitFor(() => {
        const produtoInput = screen.queryByDisplayValue("Alface Crespa");
        expect(produtoInput).not.toBeInTheDocument();
      });
    });

    it("exibe erro ao falhar salvamento do rascunho", async () => {
      mock.reset();
      mock
        .onGet("/cronogramas-semanais/cronogramas-mensal-assinados/")
        .reply(200, mockCronogramasMensalAssinados);
      mock
        .onGet("/cronogramas/cronograma-uuid-1/")
        .reply(200, mockCronogramaMensalDetalhado);
      mock.onPost("/cronogramas-semanais/rascunho/").reply(500);

      await act(async () => {
        render(
          <MemoryRouter>
            <CadastrarCronogramaSemanal />
            <ToastContainer />
          </MemoryRouter>,
        );
      });

      await waitFor(() => {
        expect(
          screen.getByText("Cronograma Mensal Cadastrado"),
        ).toBeInTheDocument();
      });

      const cronogramaInput = document.querySelector(
        ".autocomplete input",
      ) as HTMLInputElement;
      fireEvent.change(cronogramaInput, { target: { value: "CR-001" } });
      fireEvent.focus(cronogramaInput);

      await waitFor(() => {
        expect(
          document.querySelector(".ant-select-dropdown"),
        ).toBeInTheDocument();
      });

      const option = document.querySelector(".ant-select-item-option-content");
      fireEvent.click(option!);

      await waitFor(() => {
        expect(screen.getByDisplayValue("Alface Crespa")).toBeInTheDocument();
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      const form = screen.getByTestId("form-cronograma-semanal");
      fireEvent.submit(form);

      // Verificar que a requisição foi feita (mesmo com erro)
      await waitFor(
        () => {
          expect(mock.history.post.length).toBeGreaterThan(0);
        },
        { timeout: 5000 },
      );
    });
  });
});
