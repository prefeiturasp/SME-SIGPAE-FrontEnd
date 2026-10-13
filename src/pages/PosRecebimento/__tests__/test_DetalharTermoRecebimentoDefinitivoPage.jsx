import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import mock from "src/services/_mock";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockMeusDadosDilogQualidade } from "src/mocks/meusDados/dilog-qualidade";
import DetalharTermoRecebimentoDefinitivoPage from "src/pages/PosRecebimento/DetalharTermoRecebimentoDefinitivoPage";
import { mockTermoRecebimentoDetalhe } from "src/mocks/services/posRecebimento.service/mockTermoRecebimentoDetalhe";
import { mockGetNotificacoes } from "src/mocks/services/notificacoes.service/mockGetNotificacoes";
import { mockGetQtdNaoLidas } from "src/mocks/services/notificacoes.service/mockGetQtdNaoLidas";
import {
  getNotificacoes,
  getQtdNaoLidas,
} from "src/services/notificacoes.service";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import { MSG_SENHA_INVALIDA } from "src/components/screens/helper";

const TERMO_UUID = mockTermoRecebimentoDetalhe.uuid;

const normalizar = (texto) => texto.replace(/\s+/g, " ").trim();

const mockNavigate = jest.fn();

jest.mock("src/services/notificacoes.service");
jest.mock("src/components/Shareable/Toast/dialogs");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const setup = async () => {
  let utils;
  await act(async () => {
    utils = render(
      <MemoryRouter>
        <MeusDadosContext.Provider
          value={{
            meusDados: mockMeusDadosDilogQualidade,
            setMeusDados: jest.fn(),
          }}
        >
          <DetalharTermoRecebimentoDefinitivoPage />
        </MeusDadosContext.Provider>
      </MemoryRouter>,
    );
  });
  return utils;
};

describe("DetalharTermoRecebimentoDefinitivoPage", () => {
  beforeEach(() => {
    getNotificacoes.mockResolvedValue({
      data: mockGetNotificacoes,
      status: 200,
    });

    getQtdNaoLidas.mockResolvedValue({
      data: mockGetQtdNaoLidas,
      status: 200,
    });

    localStorage.setItem(
      "meusDados",
      JSON.stringify(mockMeusDadosDilogQualidade),
    );
    window.history.pushState({}, "", `?uuid=${TERMO_UUID}`);

    mock.reset();
    mock
      .onGet(`/pos-recebimento/termos/${TERMO_UUID}/`)
      .reply(200, mockTermoRecebimentoDetalhe);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("carrega e exibe os dados principais do termo", async () => {
    await setup();

    expect(
      await screen.findByText("Empresa do Luis Zimmermann"),
    ).toBeInTheDocument();

    expect(screen.getByText("135/2024 | 142/2024A")).toBeInTheDocument();

    expect(screen.getByText("12345/22")).toBeInTheDocument();
    expect(screen.getByText("123456789012")).toBeInTheDocument();

    expect(screen.getByTestId("voltar")).toBeInTheDocument();
  });

  it("monta o Objeto do Contrato no padrão esperado", async () => {
    const { container } = await setup();

    await screen.findByText("Empresa do Luis Zimmermann");

    const objeto = normalizar(
      container.querySelector(".objeto-contrato").textContent,
    );
    expect(objeto).toBe(
      "Aquisição de 17,00 kg de MANGA e 19,00 kg de BANANA NANICA, para atendimento ao Programa Nacional de Alimentação Escolar - PNAE.",
    );
  });

  it("lista a quantidade total recebida por produto e o valor do contrato", async () => {
    const { container } = await setup();

    await screen.findByText("Empresa do Luis Zimmermann");

    const dados = normalizar(
      container.querySelector(".dados-contrato").textContent,
    );
    expect(dados).toContain("135/2024 - MANGA: 17,00 kg");
    expect(dados).toContain("142/2024A - BANANA NANICA: 19,00 kg");
    expect(dados).toContain("R$ 2.000,00");
  });

  it("renderiza o texto do termo (HTML) como conteúdo", async () => {
    await setup();

    expect(
      await screen.findByText("Texto do termo de recebimento definitivo."),
    ).toBeInTheDocument();
  });
});

describe("DetalharTermoRecebimentoDefinitivoPage - Assinatura do Fiscal", () => {
  const URL_ASSINAR = `/pos-recebimento/termos/${TERMO_UUID}/fiscal-assina-termo/`;

  const abrirModalConfirmacao = async () => {
    await act(async () => {
      fireEvent.click(screen.getByText("Assinar Termo"));
    });
  };

  const abrirModalSenha = async () => {
    await abrirModalConfirmacao();
    await act(async () => {
      fireEvent.click(screen.getByText("Sim, Assinar Termo"));
    });
  };

  const confirmarAssinatura = async (senha) => {
    fireEvent.change(screen.getByPlaceholderText("Digite sua Senha"), {
      target: { value: senha },
    });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Confirmar" }));
    });
  };

  beforeEach(() => {
    getNotificacoes.mockResolvedValue({
      data: mockGetNotificacoes,
      status: 200,
    });

    getQtdNaoLidas.mockResolvedValue({
      data: mockGetQtdNaoLidas,
      status: 200,
    });

    localStorage.setItem(
      "meusDados",
      JSON.stringify(mockMeusDadosDilogQualidade),
    );
    window.history.pushState({}, "", `?uuid=${TERMO_UUID}`);

    mock.reset();
    mock
      .onGet(`/pos-recebimento/termos/${TERMO_UUID}/`)
      .reply(200, mockTermoRecebimentoDetalhe);
    jest.clearAllMocks();
    mockNavigate.mockClear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("exibe o botão Assinar Termo quando o fiscal pode assinar", async () => {
    await setup();

    expect(
      await screen.findByText("Empresa do Luis Zimmermann"),
    ).toBeInTheDocument();
    expect(screen.getByText("Assinar Termo")).toBeInTheDocument();
  });

  it("não exibe o botão Assinar Termo quando o fiscal já assinou", async () => {
    mock.reset();
    mock
      .onGet(`/pos-recebimento/termos/${TERMO_UUID}/`)
      .reply(200, { ...mockTermoRecebimentoDetalhe, pode_assinar: false });

    await setup();

    expect(
      await screen.findByText("Empresa do Luis Zimmermann"),
    ).toBeInTheDocument();
    expect(screen.queryByText("Assinar Termo")).not.toBeInTheDocument();
    expect(screen.getByTestId("voltar")).toBeInTheDocument();
  });

  it("exibe a modal de confirmação com os textos da HU", async () => {
    await setup();
    await screen.findByText("Empresa do Luis Zimmermann");
    await abrirModalConfirmacao();

    expect(
      screen.getByText("Assinar Termo de Recebimento Definitivo"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Você confirma a leitura das informações apresentadas no Termo de Recebimento Definitivo?",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Não")).toBeInTheDocument();
    expect(screen.getByText("Sim, Assinar Termo")).toBeInTheDocument();
  });

  it("fecha a modal sem assinar ao acionar Não", async () => {
    await setup();
    await screen.findByText("Empresa do Luis Zimmermann");
    await abrirModalConfirmacao();

    await act(async () => {
      fireEvent.click(screen.getByText("Não"));
    });

    expect(screen.queryByText("Sim, Assinar Termo")).not.toBeInTheDocument();
    expect(mock.history.patch.length).toBe(0);
  });

  it("exibe a modal de senha com o botão Confirmar controlado pelo preenchimento", async () => {
    await setup();
    await screen.findByText("Empresa do Luis Zimmermann");
    await abrirModalSenha();

    expect(screen.getByText("Assinatura")).toBeInTheDocument();
    expect(
      screen.getByText(
        (_, node) =>
          node.tagName === "P" &&
          node.textContent ===
            "Confirme sua senha de acesso ao SIGPAE para assinar digitalmente o documento:",
      ),
    ).toBeInTheDocument();

    const inputSenha = screen.getByPlaceholderText("Digite sua Senha");
    expect(inputSenha).toHaveAttribute("type", "password");
    const botaoConfirmar = screen.getByRole("button", { name: "Confirmar" });
    expect(botaoConfirmar).toBeDisabled();

    fireEvent.change(inputSenha, { target: { value: "senha-qualquer" } });
    expect(botaoConfirmar).toBeEnabled();
  });

  it("assina o termo, exibe a mensagem de sucesso e redireciona para o Painel", async () => {
    mock.onPatch(URL_ASSINAR).reply(200, mockTermoRecebimentoDetalhe);

    await setup();
    await screen.findByText("Empresa do Luis Zimmermann");
    await abrirModalSenha();
    await confirmarAssinatura("senha-qualquer");

    const chamada = mock.history.patch.find((call) =>
      call.url.includes("fiscal-assina-termo"),
    );
    expect(JSON.parse(chamada.data)).toEqual({ password: "senha-qualquer" });
    expect(toastSuccess).toHaveBeenCalledWith(
      "Termo de Recebimento Definitivo assinado com sucesso!",
    );
    expect(mockNavigate).toHaveBeenCalledWith(
      "/pos-recebimento/painel-assinatura-termos-recebimento",
    );
    expect(toastError).not.toHaveBeenCalled();
  });

  it("exibe a mensagem de senha inválida quando a senha está incorreta", async () => {
    mock.onPatch(URL_ASSINAR).reply(401, {
      detail: "Assinatura do termo não foi validada. Verifique sua senha.",
    });

    await setup();
    await screen.findByText("Empresa do Luis Zimmermann");
    await abrirModalSenha();
    await confirmarAssinatura("senha-errada");

    expect(toastError).toHaveBeenCalledWith(MSG_SENHA_INVALIDA);
    expect(toastSuccess).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("exibe mensagem genérica quando a requisição falha sem resposta", async () => {
    mock.onPatch(URL_ASSINAR).networkError();

    await setup();
    await screen.findByText("Empresa do Luis Zimmermann");
    await abrirModalSenha();
    await confirmarAssinatura("senha-qualquer");

    expect(toastError).toHaveBeenCalledWith(
      "Ocorreu um erro ao assinar o Termo de Recebimento Definitivo",
    );
    expect(toastSuccess).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
