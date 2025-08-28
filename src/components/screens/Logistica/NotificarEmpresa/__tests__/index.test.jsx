import React from "react";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import mock from "src/services/_mock";
import { ToastContainer } from "react-toastify";
import HTTP_STATUS from "http-status-codes";
import NotificarEmpresaPage from "src/pages/Logistica/NotificarEmpresaPage";
import DetalharNotificacaoPage from "src/pages/Logistica/DetalharNotificacaoPage";
import AnalisarAssinarPage from "src/pages/Logistica/AnalisarAssinarPage";
import { TIPOS_OCORRENCIAS_OPTIONS } from "src/constants/shared";
import { mockNotificacao } from "src/mocks/logistica.service/mockGetNotificacaoGuiasComOcorrencias";

beforeEach(() => {
  mock
    .onGet(/\/notificacao-guias-com-ocorrencias\/.+/)
    .reply(200, mockNotificacao);
  mock.onPost("/notificacoes/").reply(HTTP_STATUS.OK);
  mock.onPost("/notificacoes/enviar/").reply(HTTP_STATUS.OK);
  mock.onPost("/notificacoes/assinar-enviar/").reply(HTTP_STATUS.OK);
  mock.onPost("/notificacoes/solicitar-alteracao/").reply(HTTP_STATUS.OK);

  const search = `?uuid=test-uuid`;

  Object.defineProperty(window, "location", {
    value: {
      search: search,
    },
    writable: true,
  });
});

afterEach(() => {
  mock.reset();
});

// Funções de setup para cada página
const setupNotificarEmpresaPage = async () => {
  await act(async () => {
    render(
      <MemoryRouter>
        <NotificarEmpresaPage />
        <ToastContainer />
      </MemoryRouter>
    );
  });
};

const setupDetalharNotificacaoPage = async () => {
  await act(async () => {
    render(
      <MemoryRouter>
        <DetalharNotificacaoPage />
        <ToastContainer />
      </MemoryRouter>
    );
  });
};

const setupAnalisarAssinarPage = async () => {
  await act(async () => {
    render(
      <MemoryRouter>
        <AnalisarAssinarPage />
        <ToastContainer />
      </MemoryRouter>
    );
  });
};

describe("NotificarEmpresaPage", () => {
  it("deve carregar a página de notificação da empresa", async () => {
    await setupNotificarEmpresaPage();

    await waitFor(() => {
      // Verifica se existe pelo menos um elemento com o texto "Notificar Empresa"
      const notificarEmpresaElements = screen.getAllByText("Notificar Empresa");
      expect(notificarEmpresaElements.length).toBeGreaterThan(0);

      expect(screen.getByDisplayValue("NOT-001")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Empresa Teste")).toBeInTheDocument();
    });

    // Verifica que os botões de ação existem
    expect(screen.getByText("Cancelar")).toBeInTheDocument();
    expect(screen.getByText("Salvar Notificação")).toBeInTheDocument();
    expect(screen.getByText("Salvar e Enviar Notificação")).toBeInTheDocument();

    // Verifica que botões do modo fiscal não existem
    expect(screen.queryByText("Solicitar Alteração")).not.toBeInTheDocument();
    expect(screen.queryByText("Aprovar")).not.toBeInTheDocument();
  });
});

describe("DetalharNotificacaoPage", () => {
  it("deve carregar a página de detalhamento de notificação", async () => {
    await setupDetalharNotificacaoPage();

    await waitFor(() => {
      // Verifica se existe pelo menos um elemento com o texto "Detalhar Notificação"
      const detalharNotificacaoElements = screen.getAllByText(
        "Detalhar Notificação"
      );
      expect(detalharNotificacaoElements.length).toBeGreaterThan(0);

      expect(screen.getByDisplayValue("NOT-001")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Empresa Teste")).toBeInTheDocument();
    });

    // Campos devem estar desabilitados no modo não editável
    const processoInput = screen.getByPlaceholderText(
      "Digite o Nº do Processo SEI"
    );
    expect(processoInput).toBeDisabled();

    const previsaoInputs = screen.getAllByPlaceholderText(
      "Descreva a Previsão contratual"
    );
    previsaoInputs.forEach((input) => {
      expect(input).toBeDisabled();
    });

    // Verifica que botões de ação não existem
    expect(screen.queryByText("Cancelar")).not.toBeInTheDocument();
    expect(screen.queryByText("Salvar Notificação")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Salvar e Enviar Notificação")
    ).not.toBeInTheDocument();
  });
});

describe("AnalisarAssinarPage", () => {
  it("deve carregar a página de análise e assinatura", async () => {
    await setupAnalisarAssinarPage();

    await waitFor(() => {
      // Verifica se existe pelo menos um elemento com o texto "Analisar e Assinar"
      const analisarAssinarElements = screen.getAllByText("Analisar e Assinar");
      expect(analisarAssinarElements.length).toBeGreaterThan(0);

      expect(screen.getByDisplayValue("NOT-001")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Empresa Teste")).toBeInTheDocument();
    });

    // Verifica que botões do modo fiscal existem (pelo menos um de cada)
    const solicitarButtons = screen.getAllByText("Solicitar Alteração");
    const aprovarButtons = screen.getAllByText("Aprovar");
    expect(solicitarButtons.length).toBeGreaterThan(0);
    expect(aprovarButtons.length).toBeGreaterThan(0);

    // Campos devem estar desabilitados no modo não editável
    const processoInput = screen.getByPlaceholderText(
      "Digite o Nº do Processo SEI"
    );
    expect(processoInput).toBeDisabled();

    const previsaoInputs = screen.getAllByPlaceholderText(
      "Descreva a Previsão contratual"
    );
    previsaoInputs.forEach((input) => {
      expect(input).toBeDisabled();
    });
  });

  it("deve permitir aprovar ocorrências no modo fiscal", async () => {
    await setupAnalisarAssinarPage();

    // Encontra todos os botões de aprovar e clica no primeiro
    const aprovarButtons = screen.getAllByText("Aprovar");
    expect(aprovarButtons.length).toBeGreaterThan(0);
    fireEvent.click(aprovarButtons[0]);

    // Verifica se a mensagem de aprovação aparece
    await waitFor(() => {
      expect(screen.getByText(/Aprovado em/)).toBeInTheDocument();
    });
  });

  it("deve abrir modal de solicitação de alteração no modo fiscal", async () => {
    await setupAnalisarAssinarPage();

    // Encontra todos os botões de solicitar alteração e clica no primeiro
    const solicitarButtons = screen.getAllByText("Solicitar Alteração");
    expect(solicitarButtons.length).toBeGreaterThan(0);
    fireEvent.click(solicitarButtons[0]);

    // Verifica se o modal de justificativa aparece
    await waitFor(() => {
      expect(screen.getByText("Justificativa")).toBeInTheDocument();
    });
  });

  it("deve habilitar botão de assinar quando todas as ocorrências forem aprovadas", async () => {
    await setupAnalisarAssinarPage();

    // Aprova todas as ocorrências
    const aprovarButtons = screen.getAllByText("Aprovar");
    expect(aprovarButtons.length).toBeGreaterThan(0);

    aprovarButtons.forEach((button) => {
      fireEvent.click(button);
    });

    // Verifica se o botão de assinar está habilitado
    await waitFor(() => {
      const assinarButton = screen.getByText("Assinar e Enviar Notificação");
      expect(assinarButton).not.toBeDisabled();
    });
  });
});

// Testes comuns a todas as páginas
describe("Comportamentos comuns", () => {
  it("deve exibir as ocorrências e guias corretamente em todas as páginas", async () => {
    await setupNotificarEmpresaPage();

    await waitFor(() => {
      // Verifica se as ocorrências são exibidas
      TIPOS_OCORRENCIAS_OPTIONS.forEach((option) => {
        if (
          option.value === "VALIDADE_EXPIRADA" ||
          option.value === "AUSENCIA_PRODUTO"
        ) {
          expect(screen.getByText(option.label)).toBeInTheDocument();
        }
      });

      // Verifica se as guias são exibidas (pelo menos uma)
      const guiaElements = screen.getAllByText("GUIA-001");
      expect(guiaElements.length).toBeGreaterThan(0);
    });
  });

  it("deve abrir o modal de detalhes da guia ao clicar em uma guia", async () => {
    await setupNotificarEmpresaPage();

    await waitFor(() => {
      // Encontra todas as guias e clica na primeira
      const guiaElements = screen.getAllByText("GUIA-001");
      expect(guiaElements.length).toBeGreaterThan(0);
      fireEvent.click(guiaElements[0]);
    });

    // Verifica se o modal de detalhes da guia é exibido
    await waitFor(() => {
      expect(
        screen.getByText("Nº da Guia de Remessa: GUIA-001")
      ).toBeInTheDocument();
    });
  });
});

//////////////////////////////////////////////////////////

describe("NotificarEmpresaPage - Cenários de Erro", () => {
  it("deve exibir mensagem de erro ao falhar ao carregar notificação", async () => {
    mock
      .onGet(/\/notificacao-guias-com-ocorrencias\/.+/)
      .reply(500, { detail: "Erro interno" });

    await setupNotificarEmpresaPage();

    await waitFor(() => {
      expect(screen.getByText("Erro interno")).toBeInTheDocument();
    });
  });

  it("deve exibir mensagem de erro ao falhar ao salvar notificação", async () => {
    mock.onPost("/notificacoes/").reply(500, { detail: "Erro ao salvar" });

    await setupNotificarEmpresaPage();

    await waitFor(() => {
      expect(screen.getByDisplayValue("NOT-001")).toBeInTheDocument();
    });

    const salvarButton = screen.getByText("Salvar Notificação");
    fireEvent.click(salvarButton);

    await waitFor(() => {
      expect(
        screen.getByText("Erro ao salvar Notificação")
      ).toBeInTheDocument();
    });
  });

  it("deve exibir mensagem de erro ao falhar ao enviar notificação", async () => {
    mock
      .onPost("/notificacoes/enviar/")
      .reply(500, { detail: "Erro ao enviar" });

    await setupNotificarEmpresaPage();

    await waitFor(() => {
      expect(screen.getByDisplayValue("NOT-001")).toBeInTheDocument();
    });

    // Preenche campos obrigatórios
    const processoInput = screen.getByPlaceholderText(
      "Digite o Nº do Processo SEI"
    );
    fireEvent.change(processoInput, { target: { value: "12345" } });

    const previsaoInputs = screen.getAllByPlaceholderText(
      "Descreva a Previsão contratual"
    );
    previsaoInputs.forEach((input) => {
      fireEvent.change(input, { target: { value: "Previsão teste" } });
    });

    const enviarButton = screen.getByText("Salvar e Enviar Notificação");
    fireEvent.click(enviarButton);

    // Confirma no modal
    const confirmarButton = screen.getByText("Sim");
    fireEvent.click(confirmarButton);

    await waitFor(() => {
      expect(
        screen.getByText("Erro ao enviar Notificação")
      ).toBeInTheDocument();
    });
  });
});

describe("AnalisarAssinarPage - Cenários de Erro", () => {
  it("deve exibir mensagem de senha inválida ao falhar ao assinar notificação com erro 401", async () => {
    mock
      .onPost("/notificacoes/assinar-enviar/")
      .reply(HTTP_STATUS.UNAUTHORIZED);

    await setupAnalisarAssinarPage();

    // Aprova todas as ocorrências
    const aprovarButtons = screen.getAllByText("Aprovar");
    aprovarButtons.forEach((button) => {
      fireEvent.click(button);
    });

    await waitFor(() => {
      const assinarButton = screen.getByText("Assinar e Enviar Notificação");
      expect(assinarButton).not.toBeDisabled();
      fireEvent.click(assinarButton);
    });

    const assinarModalButton = screen.getByText("Sim, Assinar Notificação");
    fireEvent.click(assinarModalButton);

    // Preenche senha no modal
    const senhaInput = screen.getByPlaceholderText("Digite sua senha");
    fireEvent.change(senhaInput, { target: { value: "senha" } });

    const confirmarButton = screen.getByText("Confirmar").closest("button");
    fireEvent.click(confirmarButton);

    await waitFor(() => {
      expect(screen.getByText("Confirme sua senha")).toBeInTheDocument();
    });
  });

  it("deve exibir mensagem de erro genérico ao falhar ao assinar notificação", async () => {
    mock
      .onPost("/notificacoes/assinar-enviar/")
      .reply(500, { detail: "Erro interno" });

    await setupAnalisarAssinarPage();

    // Aprova todas as ocorrências
    const aprovarButtons = screen.getAllByText("Aprovar");
    aprovarButtons.forEach((button) => {
      fireEvent.click(button);
    });

    await waitFor(() => {
      const assinarButton = screen.getByText("Assinar e Enviar Notificação");
      expect(assinarButton).not.toBeDisabled();
      fireEvent.click(assinarButton);
    });

    const assinarModalButton = screen.getByText("Sim, Assinar Notificação");
    fireEvent.click(assinarModalButton);

    // Preenche senha no modal
    const senhaInput = screen.getByPlaceholderText("Digite sua senha");
    fireEvent.change(senhaInput, { target: { value: "senha" } });

    const confirmarButton = screen.getByText("Confirmar").closest("button");
    fireEvent.click(confirmarButton);

    await waitFor(() => {
      expect(
        screen.getByText("Erro ao assinar notificação")
      ).toBeInTheDocument();
    });
  });

  it("deve exibir mensagem de erro ao falhar ao solicitar alteração", async () => {
    mock
      .onPost("/notificacoes/solicitar-alteracao/")
      .reply(500, { detail: "Erro interno" });

    await setupAnalisarAssinarPage();

    // Solicita alteração
    const solicitarButtons = screen.getAllByText("Solicitar Alteração");
    fireEvent.click(solicitarButtons[0]);

    // Preenche justificativa
    const justificativaInput = screen.getByPlaceholderText(
      "Digite a justificativa"
    );
    fireEvent.change(justificativaInput, {
      target: { value: "Justificativa teste" },
    });

    const salvarButton = screen.getByText("Salvar").closest("button");
    expect(salvarButton).not.toBeDisabled();
    fireEvent.click(salvarButton);

    const aprovarButtons = screen.getAllByText("Aprovar");
    aprovarButtons.forEach((button) => {
      fireEvent.click(button);
    });

    const enviarSolicitacaoButton = screen
      .getByText("Enviar Solicitação")
      .closest("button");
    expect(enviarSolicitacaoButton).not.toBeDisabled();
    fireEvent.click(enviarSolicitacaoButton);

    await waitFor(() => {
      expect(
        screen.getByText("Erro ao solicitar alteração")
      ).toBeInTheDocument();
    });
  });
});

describe("Validação de Formulário", () => {
  it("deve desabilitar o botão de enviar quando o formulário estiver inválido", async () => {
    await setupNotificarEmpresaPage();

    await waitFor(() => {
      expect(screen.getByDisplayValue("NOT-001")).toBeInTheDocument();
    });

    const enviarButton = screen
      .getByText("Salvar e Enviar Notificação")
      .closest("button");
    expect(enviarButton).toBeDisabled();

    // Preenche apenas processo SEI
    const processoInput = screen.getByPlaceholderText(
      "Digite o Nº do Processo SEI"
    );
    fireEvent.change(processoInput, { target: { value: "12345" } });

    expect(enviarButton).toBeDisabled();

    // Preenche previsão contratual
    const previsaoInputs = screen.getAllByPlaceholderText(
      "Descreva a Previsão contratual"
    );
    previsaoInputs.forEach((input) => {
      fireEvent.change(input, { target: { value: "Previsão teste" } });
    });

    expect(enviarButton).not.toBeDisabled();
  });
});

describe("Agrupamento de Ocorrências", () => {
  it("deve agrupar as guias por ocorrência", async () => {
    await setupNotificarEmpresaPage();

    await waitFor(() => {
      expect(
        screen.getByText("Prazo de validade expirado")
      ).toBeInTheDocument();
    });
  });
});

describe("Interação com Modais", () => {
  it("deve abrir o modal com os detalhes da guia", async () => {
    await setupNotificarEmpresaPage();

    await waitFor(() => {
      expect(screen.getAllByText("GUIA-001")).toHaveLength(2);
    });

    const guiaElement = screen.getAllByText("GUIA-001")[0];
    fireEvent.click(guiaElement);

    await waitFor(() => {
      expect(
        screen.getByText("Nº da Guia de Remessa: GUIA-001")
      ).toBeInTheDocument();
    });
  });
});

describe("Controle de Aprovações", () => {
  it("deve habilitar o botão de assinar apenas quando todas as ocorrências forem aprovadas", async () => {
    await setupAnalisarAssinarPage();

    const assinarButton = screen
      .getByText("Assinar e Enviar Notificação")
      .closest("button");
    expect(assinarButton).toBeDisabled();

    // Aprova todas as ocorrências
    const aprovarButtons = screen.getAllByText("Aprovar");
    aprovarButtons.forEach((button) => {
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(assinarButton).not.toBeDisabled();
    });
  });

  it("deve exibir a mensagem de aprovação ao aprovar uma ocorrência", async () => {
    await setupAnalisarAssinarPage();

    const aprovarButtons = screen.getAllByText("Aprovar");
    fireEvent.click(aprovarButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/Aprovado em/)).toBeInTheDocument();
    });
  });
});
