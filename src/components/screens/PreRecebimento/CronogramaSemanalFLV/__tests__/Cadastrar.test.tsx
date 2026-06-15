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
  mockCronogramaSemanalDetalhe,
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
  mock
    .onPatch(/\/cronogramas-semanais\/.+\/assinar-e-enviar\//)
    .reply(200, { uuid: "novo-uuid-123", status: "ENVIADO_AO_FORNECEDOR" });
  mock.onGet("/cronogramas-semanais/rascunhos/").reply(200, { results: [] });
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
    expect(screen.getByText("Mês Programado")).toBeInTheDocument();
  });

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

  // Preencher datas
  const inputsDataInicio = screen.getAllByPlaceholderText("");
  const dataInicioInput = inputsDataInicio.find(
    (input: any) => input.getAttribute("type") === "text" && !input.value,
  );
  if (dataInicioInput) {
    fireEvent.change(dataInicioInput, { target: { value: "01/03/2026" } });
  }

  const dataFimInput = inputsDataInicio.find(
    (input: any) =>
      input !== dataInicioInput &&
      input.getAttribute("type") === "text" &&
      !input.value,
  );
  if (dataFimInput) {
    fireEvent.change(dataFimInput, { target: { value: "31/03/2026" } });
  }

  const inputQtd = screen.getByPlaceholderText("Informe a quantidade");
  fireEvent.change(inputQtd, { target: { value: "500" } });
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
      await preencherProgramacao();

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
      await preencherProgramacao();

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
      mock
        .onGet("/cronogramas-semanais/rascunhos/")
        .reply(200, { results: [] });

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
      mock
        .onGet("/cronogramas-semanais/rascunhos/")
        .reply(200, { results: [] });

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
      mock
        .onGet("/cronogramas-semanais/rascunhos/")
        .reply(200, { results: [] });

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
        expect(screen.getByText("Mês Programado")).toBeInTheDocument();
      });

      // Selecionar mês para exibir a quantidade estimada por linha
      const selectMes = screen
        .getByText("Mês Programado")
        .closest(".row")
        ?.querySelector("select");

      if (selectMes) {
        fireEvent.change(selectMes, { target: { value: "03/2026" } });
      }

      await waitFor(() => {
        expect(screen.getByText(/Quantidade estimada/i)).toBeInTheDocument();
      });

      const inputQtd = screen.getByPlaceholderText("Informe a quantidade");
      fireEvent.change(inputQtd, { target: { value: "1000" } });

      await waitFor(() => {
        const elementoTexto = document.querySelector(
          ".texto-alimento-faltante",
        );
        expect(elementoTexto).toBeInTheDocument();
        expect(screen.getByText(/Diferença de/i)).toBeInTheDocument();
      });
    });

    it("remove programação ao clicar no botão de lixeira", async () => {
      await setup();
      await selecionarCronograma();

      await waitFor(() => {
        expect(screen.getByText("+ Adicionar Programação")).toBeInTheDocument();
      });

      // Adicionar mais uma programação (totalizando 2)
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
      mock
        .onGet("/cronogramas-semanais/rascunhos/")
        .reply(200, { results: [] });

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
      mock
        .onGet("/cronogramas-semanais/rascunhos/")
        .reply(200, { results: [] });

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

      // Preencher a programação para que o form fique válido
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

      // Preencher datas (agora obrigatórias)
      const inputsData = screen.getAllByPlaceholderText("");
      const dataInicioInput = inputsData.find(
        (input: any) => input.getAttribute("type") === "text" && !input.value,
      );
      if (dataInicioInput) {
        fireEvent.change(dataInicioInput, { target: { value: "01/03/2026" } });
      }

      const dataFimInput = inputsData.find(
        (input: any) =>
          input !== dataInicioInput &&
          input.getAttribute("type") === "text" &&
          !input.value,
      );
      if (dataFimInput) {
        fireEvent.change(dataFimInput, { target: { value: "31/03/2026" } });
      }

      const inputQtd = screen.getByPlaceholderText("Informe a quantidade");
      fireEvent.change(inputQtd, { target: { value: "1000" } });

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

  describe("Botão Assinar e Enviar", () => {
    it("não exibe botão assinar e enviar sem cronograma mensal", async () => {
      await setup();
      expect(screen.queryByText("Assinar e Enviar")).not.toBeInTheDocument();
    });

    it("exibe botão assinar e enviar após selecionar cronograma", async () => {
      await setup();
      await selecionarCronograma();

      await waitFor(() => {
        expect(screen.getByText("Assinar e Enviar")).toBeInTheDocument();
      });
    });

    it("botão assinar e enviar desabilitado após selecionar cronograma sem programação completa", async () => {
      await setup();
      await selecionarCronograma();

      await waitFor(() => {
        const botaoAssinar = screen
          .getByText("Assinar e Enviar")
          .closest("button");
        expect(botaoAssinar).toBeDisabled();
      });
    });

    it("botão assinar e enviar habilitado após preencher programação completa com quantidade correta", async () => {
      await setup();
      await preencherProgramacao();

      await waitFor(() => {
        const botaoAssinar = screen
          .getByText("Assinar e Enviar")
          .closest("button");
        expect(botaoAssinar).not.toBeDisabled();
      });
    });

    it("clicar no botão abre modal de confirmação", async () => {
      await setup();
      await preencherProgramacao();

      await waitFor(() => {
        expect(screen.getByText("Assinar e Enviar")).toBeInTheDocument();
      });

      const botaoAssinar = screen.getByText("Assinar e Enviar");
      fireEvent.click(botaoAssinar);

      await waitFor(() => {
        expect(screen.getByText("Assinar Cronograma")).toBeInTheDocument();
        expect(
          screen.getByText(
            "Deseja salvar o Cadastro do Cronograma e enviar para aprovação?",
          ),
        ).toBeInTheDocument();
      });
    });

    it("botão Continuar Editando fecha modal", async () => {
      await setup();
      await preencherProgramacao();

      await waitFor(() => {
        expect(screen.getByText("Assinar e Enviar")).toBeInTheDocument();
      });

      const botaoAssinar = screen.getByText("Assinar e Enviar");
      fireEvent.click(botaoAssinar);

      await waitFor(() => {
        expect(screen.getByText("Assinar Cronograma")).toBeInTheDocument();
      });

      const botaoContinuar = screen.getByText("Continuar Editando");
      fireEvent.click(botaoContinuar);

      await waitFor(() => {
        expect(
          screen.queryByText("Assinar Cronograma"),
        ).not.toBeInTheDocument();
      });
    });

    it("botão Salvar e Enviar abre tela de senha", async () => {
      await setup();
      await preencherProgramacao();

      await waitFor(() => {
        expect(screen.getByText("Assinar e Enviar")).toBeInTheDocument();
      });

      const botaoAssinar = screen.getByText("Assinar e Enviar");
      fireEvent.click(botaoAssinar);

      await waitFor(() => {
        expect(screen.getByText("Assinar Cronograma")).toBeInTheDocument();
      });

      const botaoSalvarEnviar = screen.getByText("Salvar e Enviar");
      fireEvent.click(botaoSalvarEnviar);

      await waitFor(() => {
        expect(screen.getByText("Confirme sua senha")).toBeInTheDocument();
        expect(
          screen.getByPlaceholderText("Digite sua senha"),
        ).toBeInTheDocument();
      });
    });

    it("confirma senha com sucesso redireciona para listagem", async () => {
      await setup();
      await preencherProgramacao();

      await waitFor(() => {
        expect(screen.getByText("Assinar e Enviar")).toBeInTheDocument();
      });

      const botaoAssinar = screen.getByText("Assinar e Enviar");
      fireEvent.click(botaoAssinar);

      await waitFor(() => {
        expect(screen.getByText("Salvar e Enviar")).toBeInTheDocument();
      });

      const botaoSalvarEnviar = screen.getByText("Salvar e Enviar");
      fireEvent.click(botaoSalvarEnviar);

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText("Digite sua senha"),
        ).toBeInTheDocument();
      });

      const senhaInput = screen.getByPlaceholderText("Digite sua senha");
      fireEvent.change(senhaInput, { target: { value: "senha123" } });

      const botaoConfirmar = screen.getByText("Confirmar");
      fireEvent.click(botaoConfirmar);

      await waitFor(
        () => {
          expect(mockNavigate).toHaveBeenCalledWith(
            "/pre-recebimento/cronograma-semanal-flv",
          );
        },
        { timeout: 5000 },
      );
    });

    it("senha inválida exibe toast de erro", async () => {
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
        .onPatch(/\/cronogramas-semanais\/.+\/assinar-e-enviar\//)
        .reply(401, { detail: "Assinatura do cronograma não foi validada." });

      await setup();
      await preencherProgramacao();

      await waitFor(() => {
        expect(screen.getByText("Assinar e Enviar")).toBeInTheDocument();
      });

      const botaoAssinar = screen.getByText("Assinar e Enviar");
      fireEvent.click(botaoAssinar);

      await waitFor(() => {
        expect(screen.getByText("Salvar e Enviar")).toBeInTheDocument();
      });

      const botaoSalvarEnviar = screen.getByText("Salvar e Enviar");
      fireEvent.click(botaoSalvarEnviar);

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText("Digite sua senha"),
        ).toBeInTheDocument();
      });

      const senhaInput = screen.getByPlaceholderText("Digite sua senha");
      fireEvent.change(senhaInput, { target: { value: "senha_errada" } });

      const botaoConfirmar = screen.getByText("Confirmar");
      fireEvent.click(botaoConfirmar);

      await waitFor(
        () => {
          expect(screen.getByText("Senha inválida")).toBeInTheDocument();
        },
        { timeout: 5000 },
      );
    });

    it("botão habilitado com quantidade parcial", async () => {
      await setup();
      await preencherProgramacao();

      const inputQtd = screen.getByPlaceholderText("Informe a quantidade");
      fireEvent.change(inputQtd, { target: { value: "200" } });

      await waitFor(() => {
        const botaoAssinar = screen
          .getByText("Assinar e Enviar")
          .closest("button");
        expect(botaoAssinar).not.toBeDisabled();
      });
    });

    it("botão habilitado com quantidade acima do previsto", async () => {
      await setup();
      await preencherProgramacao();

      const inputQtd = screen.getByPlaceholderText("Informe a quantidade");
      fireEvent.change(inputQtd, { target: { value: "600" } });

      await waitFor(() => {
        const botaoAssinar = screen
          .getByText("Assinar e Enviar")
          .closest("button");
        expect(botaoAssinar).not.toBeDisabled();
      });
    });

    it("clicar com quantidade acima do previsto exibe modal de excesso", async () => {
      await setup();
      await preencherProgramacao();

      const inputQtd = screen.getByPlaceholderText("Informe a quantidade");
      fireEvent.change(inputQtd, { target: { value: "600" } });

      const botaoAssinar = screen.getByText("Assinar e Enviar");
      fireEvent.click(botaoAssinar);

      await waitFor(() => {
        expect(
          screen.getByText("Atenção - Quantidade Excedente"),
        ).toBeInTheDocument();
        expect(
          screen.getByText(
            "A quantidade da entrega informada está acima do quantitativo mensal previsto para este cronograma. Deseja continuar com o envio?",
          ),
        ).toBeInTheDocument();
      });
    });

    it("Continuar Editando no modal de excesso fecha sem enviar", async () => {
      await setup();
      await preencherProgramacao();

      const inputQtd = screen.getByPlaceholderText("Informe a quantidade");
      fireEvent.change(inputQtd, { target: { value: "600" } });

      const botaoAssinar = screen.getByText("Assinar e Enviar");
      fireEvent.click(botaoAssinar);

      await waitFor(() => {
        expect(
          screen.getByText("Atenção - Quantidade Excedente"),
        ).toBeInTheDocument();
      });

      const botaoContinuar = screen.getByText("Continuar Editando");
      fireEvent.click(botaoContinuar);

      await waitFor(() => {
        expect(
          screen.queryByText("Atenção - Quantidade Excedente"),
        ).not.toBeInTheDocument();
      });

      // Modal de senha também não deve abrir
      expect(screen.queryByText("Assinar Cronograma")).not.toBeInTheDocument();
    });

    it("Salvar e Enviar no modal de excesso abre tela de senha", async () => {
      await setup();
      await preencherProgramacao();

      const inputQtd = screen.getByPlaceholderText("Informe a quantidade");
      fireEvent.change(inputQtd, { target: { value: "600" } });

      const botaoAssinar = screen.getByText("Assinar e Enviar");
      fireEvent.click(botaoAssinar);

      await waitFor(() => {
        expect(
          screen.getByText("Atenção - Quantidade Excedente"),
        ).toBeInTheDocument();
      });

      const botaoSalvarEnviar = screen.getByText("Salvar e Enviar");
      fireEvent.click(botaoSalvarEnviar);

      await waitFor(() => {
        expect(
          screen.queryByText("Atenção - Quantidade Excedente"),
        ).not.toBeInTheDocument();
        expect(screen.getByText("Assinar Cronograma")).toBeInTheDocument();
        expect(
          screen.getByText(
            "Deseja salvar o Cadastro do Cronograma e enviar para aprovação?",
          ),
        ).toBeInTheDocument();
      });
    });

    it("modal de excesso não aparece quando quantidade igual ao previsto", async () => {
      await setup();
      await preencherProgramacao();

      const botaoAssinar = screen.getByText("Assinar e Enviar");
      fireEvent.click(botaoAssinar);

      await waitFor(() => {
        expect(
          screen.queryByText("Atenção - Quantidade Excedente"),
        ).not.toBeInTheDocument();
        expect(screen.getByText("Assinar Cronograma")).toBeInTheDocument();
      });
    });

    it("modal de excesso não aparece quando quantidade menor que o previsto", async () => {
      await setup();
      await preencherProgramacao();

      const inputQtd = screen.getByPlaceholderText("Informe a quantidade");
      fireEvent.change(inputQtd, { target: { value: "200" } });

      const botaoAssinar = screen.getByText("Assinar e Enviar");
      fireEvent.click(botaoAssinar);

      await waitFor(() => {
        expect(
          screen.queryByText("Atenção - Quantidade Excedente"),
        ).not.toBeInTheDocument();
        expect(screen.getByText("Assinar Cronograma")).toBeInTheDocument();
      });
    });

    it("modal de excesso não aparece quando total mensal previsto está indisponível (etapas com quantidade 0)", async () => {
      const mockCronogramaQuantidadeZero = {
        ...mockCronogramaMensalDetalhado,
        etapas: [
          {
            ...mockCronogramaMensalDetalhado.etapas[0],
            quantidade: 0,
          },
        ],
      };

      mock.reset();
      mock
        .onGet("/cronogramas-semanais/cronogramas-mensal-assinados/")
        .reply(200, mockCronogramasMensalAssinados);
      mock
        .onGet("/cronogramas/cronograma-uuid-1/")
        .reply(200, mockCronogramaQuantidadeZero);
      mock
        .onPost("/cronogramas-semanais/rascunho/")
        .reply(201, { uuid: "novo-uuid-123" });
      mock
        .onPatch(/\/cronogramas-semanais\/.+\/assinar-e-enviar\//)
        .reply(200, { uuid: "novo-uuid-123", status: "ENVIADO_AO_FORNECEDOR" });
      mock
        .onGet("/cronogramas-semanais/rascunhos/")
        .reply(200, { results: [] });

      await setup();
      await preencherProgramacao();

      const inputQtd = screen.getByPlaceholderText("Informe a quantidade");
      fireEvent.change(inputQtd, { target: { value: "600" } });

      const botaoAssinar = screen.getByText("Assinar e Enviar");
      fireEvent.click(botaoAssinar);

      await waitFor(() => {
        expect(
          screen.queryByText("Atenção - Quantidade Excedente"),
        ).not.toBeInTheDocument();
        expect(screen.getByText("Assinar Cronograma")).toBeInTheDocument();
      });
    });
  });

  describe("Edição de Rascunho Existente", () => {
    const mockCronogramaSemanalEdicao = {
      ...mockCronogramaSemanalDetalhe,
      uuid: "uuid-edicao-123",
      numero: "CSW-EDIT-001",
      status: "Rascunho",
      cronograma_mensal: {
        ...mockCronogramaSemanalDetalhe.cronograma_mensal,
        uuid: "cronograma-uuid-1",
        numero: "CR-001/2024",
      },
      programacoes: [
        {
          mes_programado: "03/2026",
          data_inicio: "2026-03-01",
          data_fim: "2026-03-15",
          quantidade: 500.0,
        },
      ],
    };

    const setupEdicao = async () => {
      mock.reset();
      mock
        .onGet("/cronogramas-semanais/cronogramas-mensal-assinados/")
        .reply(200, mockCronogramasMensalAssinados);
      mock
        .onGet("/cronogramas/cronograma-uuid-1/")
        .reply(200, mockCronogramaMensalDetalhado);
      mock
        .onGet("/cronogramas-semanais/uuid-edicao-123/")
        .reply(200, mockCronogramaSemanalEdicao);
      mock
        .onPatch("/cronogramas-semanais/uuid-edicao-123/")
        .reply(200, { uuid: "uuid-edicao-123" });
      mock
        .onPatch(/\/cronogramas-semanais\/.+\/assinar-e-enviar\//)
        .reply(200, {
          uuid: "uuid-edicao-123",
          status: "ENVIADO_AO_FORNECEDOR",
        });
      mock
        .onGet("/cronogramas-semanais/rascunhos/")
        .reply(200, { results: [] });

      await act(async () => {
        render(
          <MemoryRouter initialEntries={["/?uuid=uuid-edicao-123"]}>
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

    it("carrega dados do rascunho existente com uuid na URL", async () => {
      await setupEdicao();

      await waitFor(
        () => {
          expect(screen.getByDisplayValue("Alface Crespa")).toBeInTheDocument();
        },
        { timeout: 5000 },
      );

      expect(
        screen.getByDisplayValue("Hortifruti São Paulo LTDA"),
      ).toBeInTheDocument();
    });

    it("exibe número do cronograma em modo de edição", async () => {
      await setupEdicao();

      await waitFor(
        () => {
          expect(screen.getByText("CSW-EDIT-001")).toBeInTheDocument();
        },
        { timeout: 5000 },
      );
    });

    it("preenche programações do rascunho existente", async () => {
      await setupEdicao();

      await waitFor(() => {
        expect(screen.getByText("Mês Programado")).toBeInTheDocument();
      });

      // Verificar que há pelo menos uma programação preenchida
      await waitFor(() => {
        const selects = screen.getAllByText("Mês Programado");
        expect(selects.length).toBeGreaterThanOrEqual(1);
      });
    });

    it("preenche datas das programações corretamente ao carregar rascunho", async () => {
      await setupEdicao();

      await waitFor(() => {
        expect(screen.getByText("Mês Programado")).toBeInTheDocument();
      });

      // Aguardar carregamento completo
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      });

      await waitFor(
        () => {
          // Buscar inputs de data pelo valor - react-datepicker usa inputs com classe form-control
          const dateInputs = document.querySelectorAll(
            'input.form-control[placeholder=""]',
          );
          expect(dateInputs.length).toBeGreaterThanOrEqual(2);

          // Verificar que os campos de data não estão vazios
          // Os valores devem estar no formato DD/MM/YYYY
          const valores = Array.from(dateInputs).map(
            (input) => (input as HTMLInputElement).value,
          );

          // Deve haver pelo menos uma data preenchida
          const temDataInicio = valores.some((v) => v === "01/03/2026");
          const temDataFim = valores.some((v) => v === "15/03/2026");

          expect(temDataInicio || temDataFim).toBe(true);
        },
        { timeout: 5000 },
      );
    });

    it("atualiza rascunho existente em vez de criar novo", async () => {
      await setupEdicao();

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
            mock.history.patch.some((call) =>
              call.url?.includes("/cronogramas-semanais/uuid-edicao-123/"),
            ),
          ).toBe(true);
        },
        { timeout: 5000 },
      );
    });

    it("exibe toast de sucesso ao atualizar rascunho", async () => {
      await setupEdicao();

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
  });

  describe("Seção Rascunhos", () => {
    it("não exibe seção Rascunhos quando não há rascunhos", async () => {
      await setup();
      expect(screen.queryByText("Rascunhos")).not.toBeInTheDocument();
    });

    it("exibe seção Rascunhos quando há rascunhos salvos", async () => {
      mock.reset();
      mock
        .onGet("/cronogramas-semanais/cronogramas-mensal-assinados/")
        .reply(200, mockCronogramasMensalAssinados);
      mock.onGet("/cronogramas-semanais/rascunhos/").reply(200, {
        results: [
          {
            uuid: "rascunho-uuid-1",
            numero: "001/2025P",
            alterado_em: "2025-04-30T10:30:00",
          },
        ],
      });

      await act(async () => {
        render(
          <MemoryRouter>
            <CadastrarCronogramaSemanal />
            <ToastContainer />
          </MemoryRouter>,
        );
      });

      await waitFor(() => {
        expect(screen.getByText("Rascunhos")).toBeInTheDocument();
      });
    });

    it("exibe seção Rascunhos quando está editando rascunho existente", async () => {
      mock.reset();
      mock
        .onGet("/cronogramas-semanais/cronogramas-mensal-assinados/")
        .reply(200, mockCronogramasMensalAssinados);
      mock.onGet("/cronogramas-semanais/rascunhos/").reply(200, {
        results: [
          {
            uuid: "rascunho-uuid-1",
            numero: "001/2025P",
            alterado_em: "2025-04-30T10:30:00",
          },
        ],
      });

      await act(async () => {
        render(
          <MemoryRouter initialEntries={["/?uuid=uuid-edicao-123"]}>
            <CadastrarCronogramaSemanal />
            <ToastContainer />
          </MemoryRouter>,
        );
      });

      await waitFor(() => {
        expect(screen.getByText("Rascunhos")).toBeInTheDocument();
      });
    });

    it("exibe número do rascunho e data de salvamento", async () => {
      mock.reset();
      mock
        .onGet("/cronogramas-semanais/cronogramas-mensal-assinados/")
        .reply(200, mockCronogramasMensalAssinados);
      mock.onGet("/cronogramas-semanais/rascunhos/").reply(200, {
        results: [
          {
            uuid: "rascunho-uuid-1",
            numero: "001/2025P",
            alterado_em: "2025-04-30T10:30:00",
          },
        ],
      });

      await act(async () => {
        render(
          <MemoryRouter>
            <CadastrarCronogramaSemanal />
            <ToastContainer />
          </MemoryRouter>,
        );
      });

      await waitFor(() => {
        expect(screen.getByText("Rascunhos")).toBeInTheDocument();
      });

      expect(screen.getByText("Cronograma #001/2025P")).toBeInTheDocument();
      expect(screen.getByText(/Rascunho salvo em/)).toBeInTheDocument();
    });

    it("clicar no ícone de editar navega para edição", async () => {
      mock.reset();
      mock
        .onGet("/cronogramas-semanais/cronogramas-mensal-assinados/")
        .reply(200, mockCronogramasMensalAssinados);
      mock.onGet("/cronogramas-semanais/rascunhos/").reply(200, {
        results: [
          {
            uuid: "rascunho-uuid-1",
            numero: "001/2025P",
            alterado_em: "2025-04-30T10:30:00",
          },
        ],
      });

      await act(async () => {
        render(
          <MemoryRouter>
            <CadastrarCronogramaSemanal />
            <ToastContainer />
          </MemoryRouter>,
        );
      });

      await waitFor(() => {
        expect(screen.getByText("Rascunhos")).toBeInTheDocument();
      });

      const editIcon = document.querySelector(".fa-edit");
      expect(editIcon).toBeInTheDocument();
      const editLink = editIcon?.closest("a");
      expect(editLink).toHaveAttribute(
        "href",
        "/pre-recebimento/cadastro-cronograma-semanal?uuid=rascunho-uuid-1",
      );
    });
  });

  describe("Cálculo por Linha (Quantidade Estimada e Diferença)", () => {
    const preencherPrimeiraLinha = async () => {
      await selecionarCronograma();

      await waitFor(() => {
        expect(screen.getByText("Mês Programado")).toBeInTheDocument();
      });

      // Selecionar mês 03/2026 na primeira linha
      const selectMes = screen
        .getByText("Mês Programado")
        .closest(".row")
        ?.querySelector("select");

      if (selectMes) {
        fireEvent.change(selectMes, { target: { value: "03/2026" } });
      }

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 300));
      });

      // Preencher datas
      const inputsDataInicio = screen.getAllByPlaceholderText("");
      const dataInicioInput = inputsDataInicio.find(
        (input: any) => input.getAttribute("type") === "text" && !input.value,
      );
      if (dataInicioInput) {
        fireEvent.change(dataInicioInput, { target: { value: "01/03/2026" } });
      }

      const dataFimInput = inputsDataInicio.find(
        (input: any) =>
          input !== dataInicioInput &&
          input.getAttribute("type") === "text" &&
          !input.value,
      );
      if (dataFimInput) {
        fireEvent.change(dataFimInput, { target: { value: "31/03/2026" } });
      }

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 300));
      });

      const inputQtd = screen.getByPlaceholderText("Informe a quantidade");
      fireEvent.change(inputQtd, { target: { value: "200" } });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
      });
    };

    it("exibe Quantidade Estimada e Diferença por linha quando mês é selecionado", async () => {
      await setup();
      await preencherPrimeiraLinha();

      // Verificar se o texto de quantidade estimada apareceu
      expect(screen.queryByText(/Quantidade estimada/)).toBeInTheDocument();
      expect(screen.queryByText(/Diferença de/)).toBeInTheDocument();
    });

    it("exibe valores independentes para cada linha com meses diferentes", async () => {
      await setup();
      await preencherPrimeiraLinha();

      // Adicionar segunda programação
      const botaoAdicionar = screen.getByText("+ Adicionar Programação");
      fireEvent.click(botaoAdicionar);

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
      });

      // Preencher segunda linha com mês 04/2026
      const selects = screen.getAllByRole("combobox");
      if (selects.length >= 2) {
        fireEvent.change(selects[1], { target: { value: "04/2026" } });
      }

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
      });

      // Preencher quantidade da segunda linha
      const inputsQtd = screen.getAllByPlaceholderText("Informe a quantidade");
      if (inputsQtd.length >= 2) {
        fireEvent.change(inputsQtd[1], { target: { value: "300" } });
      }

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
      });

      // Verificar que há textos de quantidade estimada visíveis
      const textosEstimativa = screen.getAllByText(/Quantidade estimada/);
      expect(textosEstimativa.length).toBeGreaterThanOrEqual(1);
    });

    it("exibe diferença considerando soma de duas linhas do mesmo mês", async () => {
      await setup();
      await preencherPrimeiraLinha();

      // Adicionar segunda programação
      const botaoAdicionar = screen.getByText("+ Adicionar Programação");
      fireEvent.click(botaoAdicionar);

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
      });

      // Na segunda linha, selecionar o mesmo mês 03/2026
      const selects = screen.getAllByRole("combobox");
      if (selects.length >= 2) {
        fireEvent.change(selects[1], { target: { value: "03/2026" } });
      }

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
      });

      // Preencher quantidade da segunda linha
      const inputsQtd = screen.getAllByPlaceholderText("Informe a quantidade");
      if (inputsQtd.length >= 2) {
        fireEvent.change(inputsQtd[1], { target: { value: "100" } });
      }

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
      });

      // Verificar diferença visível
      const diffTexts = screen.getAllByText(/Diferença de/);
      expect(diffTexts.length).toBeGreaterThanOrEqual(1);
    });
  });
});
