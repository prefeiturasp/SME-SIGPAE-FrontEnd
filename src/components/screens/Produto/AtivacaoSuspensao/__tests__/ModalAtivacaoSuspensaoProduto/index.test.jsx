import React from "react";
import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import HTTP_STATUS from "http-status-codes";

import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import { ativarProduto, suspenderProduto } from "src/services/produto.service";
import { meusDados } from "src/services/perfil.service";
import { getNumerosEditais } from "src/services/edital.service";

import ModalAtivacaoSuspensaoProduto from "../../ModalAtivacaoSuspensaoProduto";

jest.mock("react-bootstrap", () => {
  const React = require("react");

  const Modal = ({ children, show, onHide }) => {
    if (!show) return null;

    return React.createElement(
      "div",
      {
        "data-testid": "modal",
        "data-show": String(show),
      },
      React.createElement(
        "button",
        {
          type: "button",
          onClick: onHide,
        },
        "Fechar modal",
      ),
      children,
    );
  };

  Modal.Header = ({ children }) =>
    React.createElement(
      "div",
      {
        "data-testid": "modal-header",
      },
      children,
    );

  Modal.Title = ({ children }) => React.createElement("h2", null, children);

  Modal.Body = ({ children }) =>
    React.createElement(
      "div",
      {
        "data-testid": "modal-body",
      },
      children,
    );

  Modal.Footer = ({ children }) =>
    React.createElement(
      "div",
      {
        "data-testid": "modal-footer",
      },
      children,
    );

  return {
    Modal,
  };
});

jest.mock("src/components/Shareable/Input/InputText", () => {
  const React = require("react");

  return {
    __esModule: true,
    default: ({ input, label, disabled }) =>
      React.createElement(
        "label",
        null,
        label,
        React.createElement("input", {
          name: input.name,
          value: input.value || "",
          onChange: input.onChange,
          onBlur: input.onBlur,
          onFocus: input.onFocus,
          disabled,
          "data-testid": `campo-${input.name}`,
        }),
      ),
  };
});

jest.mock("src/components/Shareable/CKEditorField", () => {
  const React = require("react");

  return {
    __esModule: true,
    default: ({ input, label }) =>
      React.createElement(
        "label",
        null,
        label,
        React.createElement("textarea", {
          name: input.name,
          value: input.value || "",
          onChange: input.onChange,
          onBlur: input.onBlur,
          onFocus: input.onFocus,
          "data-testid": `campo-${input.name}`,
        }),
      ),
  };
});

jest.mock("src/components/Shareable/FinalForm/MultiSelect", () => {
  const React = require("react");

  return {
    __esModule: true,
    default: ({ input, label, options = [] }) => {
      const selecionados = Array.isArray(input.value) ? input.value : [];

      return React.createElement(
        "fieldset",
        {
          "data-testid": `campo-${input.name}`,
        },
        React.createElement("legend", null, label),
        options.map((option) =>
          React.createElement(
            "label",
            {
              key: option.value,
            },
            React.createElement("input", {
              type: "checkbox",
              value: option.value,
              checked: selecionados.includes(option.value),
              onChange: (event) => {
                const novosValores = event.target.checked
                  ? [...selecionados, option.value]
                  : selecionados.filter((value) => value !== option.value);

                input.onChange(novosValores);
              },
            }),
            option.label,
          ),
        ),
      );
    },
  };
});

jest.mock("src/components/Shareable/Input/InputFile/ManagedField", () => {
  const React = require("react");

  return {
    __esModule: true,
    default: ({ texto, accept, input }) =>
      React.createElement(
        "div",
        {
          "data-testid": `campo-${input.name}`,
          "data-accept": accept,
        },
        texto,
      ),
  };
});

jest.mock("src/components/Shareable/Botao", () => {
  const React = require("react");

  return {
    __esModule: true,
    default: jest.fn(({ texto, type, onClick, disabled, className, style }) =>
      React.createElement(
        "button",
        {
          type,
          onClick,
          disabled,
          className,
          "data-style": style,
        },
        texto,
      ),
    ),
  };
});

jest.mock("src/components/Shareable/Toast/dialogs", () => ({
  toastError: jest.fn(),
  toastSuccess: jest.fn(),
}));

jest.mock("src/helpers/fieldValidators", () => ({
  peloMenosUmCaractere: jest.fn((value) => {
    if (
      typeof value === "string" &&
      value.replace(/<[^>]*>/g, "").trim().length > 0
    ) {
      return undefined;
    }

    return "Campo obrigatório";
  }),
  required: jest.fn((value) => (value ? undefined : "Campo obrigatório")),
}));

jest.mock("src/helpers/gestaoDeProdutos", () => ({
  EDITAIS_INVALIDOS: ["EDITAL INVÁLIDO"],
}));

jest.mock("src/services/produto.service", () => ({
  ativarProduto: jest.fn(),
  suspenderProduto: jest.fn(),
}));

jest.mock("src/services/perfil.service", () => ({
  meusDados: jest.fn(),
}));

jest.mock("src/services/edital.service", () => ({
  getNumerosEditais: jest.fn(),
}));

const idHomologacao = "00000000-0000-4000-8000-000000000001";

const meusDadosMock = {
  registro_funcional: "1234567",
  nome: "Maria da Silva",
  cargo: "Nutricionista",
};

const editaisMock = [
  {
    uuid: "00000000-0000-4000-8000-000000000002",
    numero: "EDITAL 001",
  },
  {
    uuid: "00000000-0000-4000-8000-000000000003",
    numero: "EDITAL 002",
  },
  {
    uuid: "00000000-0000-4000-8000-000000000004",
    numero: "EDITAL INVÁLIDO",
  },
];

const produtoMock = {
  uuid: "00000000-0000-4000-8000-000000000005",
  nome: "Arroz integral",
  vinculos_produto_edital: [
    {
      suspenso: false,
      edital: editaisMock[0],
    },
    {
      suspenso: true,
      edital: editaisMock[1],
    },
    {
      suspenso: false,
      edital: editaisMock[2],
    },
  ],
};

const criarProps = (sobrescritas = {}) => ({
  acao: "ativação",
  idHomologacao,
  atualizarDados: jest.fn(),
  closeModal: jest.fn(),
  showModal: true,
  produto: produtoMock,
  ehSuspensaoFluxoAlteracaoDados: false,
  ...sobrescritas,
});

const renderizarComponente = (sobrescritas = {}) => {
  const props = criarProps(sobrescritas);

  render(<ModalAtivacaoSuspensaoProduto {...props} />);

  return props;
};

const aguardarCarregamentoInicial = async () => {
  await waitFor(() => {
    expect(meusDados).toHaveBeenCalledTimes(1);
    expect(getNumerosEditais).toHaveBeenCalledTimes(1);
  });
};

const preencherJustificativa = (justificativa = "Justificativa do teste") => {
  fireEvent.change(screen.getByTestId("campo-justificativa"), {
    target: {
      value: justificativa,
    },
  });
};

const selecionarEdital = (numeroEdital) => {
  fireEvent.click(
    screen.getByRole("checkbox", {
      name: numeroEdital,
    }),
  );
};

const enviarFormulario = () => {
  fireEvent.click(
    screen.getByRole("button", {
      name: "Enviar",
    }),
  );
};

const criarPromessaControlada = () => {
  let resolver;

  const promise = new Promise((resolve) => {
    resolver = resolve;
  });

  return {
    promise,
    resolver,
  };
};

describe("ModalAtivacaoSuspensaoProduto", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    window.history.pushState({}, "", "/detalhe");

    meusDados.mockResolvedValue(meusDadosMock);

    getNumerosEditais.mockResolvedValue({
      status: HTTP_STATUS.OK,
      data: {
        results: editaisMock,
      },
    });

    ativarProduto.mockResolvedValue({
      status: HTTP_STATUS.OK,
      data: {
        uuid: "00000000-0000-4000-8000-000000000006",
      },
    });

    suspenderProduto.mockResolvedValue({
      status: HTTP_STATUS.OK,
      data: {
        uuid: "00000000-0000-4000-8000-000000000007",
      },
    });
  });

  it("não renderiza o conteúdo quando o modal está fechado", () => {
    renderizarComponente({
      showModal: false,
    });

    expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
  });

  it("carrega os dados do usuário e os editais ao montar", async () => {
    renderizarComponente();

    expect(
      screen.getByRole("heading", {
        name: "Ativação de Produto",
      }),
    ).toBeInTheDocument();

    await aguardarCarregamentoInicial();

    await waitFor(() => {
      expect(
        screen.getByTestId("campo-funcionario_registro_funcional"),
      ).toHaveValue("1234567");

      expect(screen.getByTestId("campo-funcionario_nome")).toHaveValue(
        "Maria da Silva",
      );

      expect(screen.getByTestId("campo-funcionario_cargo")).toHaveValue(
        "Nutricionista",
      );
    });

    expect(
      screen.getByTestId("campo-funcionario_registro_funcional"),
    ).toBeDisabled();

    expect(screen.getByTestId("campo-funcionario_nome")).toBeDisabled();

    expect(screen.getByTestId("campo-funcionario_cargo")).toBeDisabled();
  });

  it("exibe somente os editais válidos para ativação", async () => {
    renderizarComponente({
      acao: "ativação",
    });

    await aguardarCarregamentoInicial();

    expect(
      await screen.findByRole("checkbox", {
        name: "EDITAL 001",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("checkbox", {
        name: "EDITAL 002",
      }),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("checkbox", {
        name: "EDITAL INVÁLIDO",
      }),
    ).not.toBeInTheDocument();

    expect(screen.getByText("Ativar produto nos editais")).toBeInTheDocument();
  });

  it("exibe somente os vínculos ativos e válidos para suspensão", async () => {
    renderizarComponente({
      acao: "suspensão",
    });

    await aguardarCarregamentoInicial();

    expect(
      await screen.findByRole("checkbox", {
        name: "EDITAL 001",
      }),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("checkbox", {
        name: "EDITAL 002",
      }),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole("checkbox", {
        name: "EDITAL INVÁLIDO",
      }),
    ).not.toBeInTheDocument();

    expect(
      screen.getByText("Suspender produto nos editais"),
    ).toBeInTheDocument();
  });

  it("mantém o botão Enviar desabilitado enquanto os campos obrigatórios não forem preenchidos", async () => {
    renderizarComponente();

    await aguardarCarregamentoInicial();

    const botaoEnviar = screen.getByRole("button", {
      name: "Enviar",
    });

    expect(botaoEnviar).toBeDisabled();

    preencherJustificativa();

    expect(botaoEnviar).toBeDisabled();

    selecionarEdital("EDITAL 001");

    await waitFor(() => {
      expect(botaoEnviar).toBeEnabled();
    });
  });

  it("exibe o título Manter o Produto Suspenso quando manterSuspenso é true", async () => {
    renderizarComponente({
      acao: "suspensão",
      manterSuspenso: true,
      produto: {
        ...produtoMock,
        vinculos_produto_edital: [
          {
            suspenso: true,
            edital: editaisMock[0],
          },
        ],
      },
    });

    await aguardarCarregamentoInicial();

    expect(
      screen.getByRole("heading", {
        name: "Manter o Produto Suspenso",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Suspender produto nos editais"),
    ).toBeInTheDocument();
  });

  it("habilita o botão Enviar apenas com a justificativa quando manterSuspenso é true", async () => {
    const props = renderizarComponente({
      acao: "suspensão",
      manterSuspenso: true,
      produto: {
        ...produtoMock,
        vinculos_produto_edital: [
          {
            suspenso: true,
            edital: editaisMock[0],
          },
        ],
      },
    });

    await aguardarCarregamentoInicial();

    const botaoEnviar = screen.getByRole("button", {
      name: "Enviar",
    });

    expect(botaoEnviar).toBeDisabled();

    preencherJustificativa("Manter o produto suspenso");

    await waitFor(() => {
      expect(botaoEnviar).toBeEnabled();
    });

    enviarFormulario();

    await waitFor(() => {
      expect(suspenderProduto).toHaveBeenCalledTimes(1);
    });

    expect(suspenderProduto).toHaveBeenCalledWith(
      idHomologacao,
      expect.objectContaining({
        justificativa: "Manter o produto suspenso",
      }),
    );

    expect(props.atualizarDados).toHaveBeenCalledTimes(1);
    expect(props.closeModal).toHaveBeenCalledTimes(1);
  });

  it("envia a ativação do produto com os dados preenchidos", async () => {
    const props = renderizarComponente({
      acao: "ativação",
    });

    await aguardarCarregamentoInicial();

    preencherJustificativa("Produto aprovado para ativação");
    selecionarEdital("EDITAL 001");
    enviarFormulario();

    await waitFor(() => {
      expect(ativarProduto).toHaveBeenCalledTimes(1);
    });

    expect(ativarProduto).toHaveBeenCalledWith(
      idHomologacao,
      expect.objectContaining({
        funcionario_registro_funcional: "1234567",
        funcionario_nome: "Maria da Silva",
        funcionario_cargo: "Nutricionista",
        justificativa: "Produto aprovado para ativação",
        editais_para_suspensao_ativacao: [editaisMock[0].uuid],
      }),
    );

    expect(suspenderProduto).not.toHaveBeenCalled();

    expect(toastSuccess).toHaveBeenCalledWith(
      "Ativação de produto enviada com sucesso.",
    );

    expect(props.atualizarDados).toHaveBeenCalledTimes(1);
    expect(props.closeModal).toHaveBeenCalledTimes(1);
  });

  it("envia a suspensão do produto com os dados preenchidos", async () => {
    const props = renderizarComponente({
      acao: "suspensão",
    });

    await aguardarCarregamentoInicial();

    preencherJustificativa("Produto suspenso para análise");
    selecionarEdital("EDITAL 001");
    enviarFormulario();

    await waitFor(() => {
      expect(suspenderProduto).toHaveBeenCalledTimes(1);
    });

    expect(suspenderProduto).toHaveBeenCalledWith(
      idHomologacao,
      expect.objectContaining({
        funcionario_registro_funcional: "1234567",
        funcionario_nome: "Maria da Silva",
        funcionario_cargo: "Nutricionista",
        justificativa: "Produto suspenso para análise",
        editais_para_suspensao_ativacao: [editaisMock[0].uuid],
      }),
    );

    expect(ativarProduto).not.toHaveBeenCalled();

    expect(toastSuccess).toHaveBeenCalledWith(
      "Suspensão de produto enviada com sucesso.",
    );

    expect(props.atualizarDados).toHaveBeenCalledTimes(1);
    expect(props.closeModal).toHaveBeenCalledTimes(1);
  });

  it("exibe mensagem de erro quando o endpoint retorna status diferente de OK", async () => {
    ativarProduto.mockResolvedValue({
      status: HTTP_STATUS.BAD_REQUEST,
    });

    const props = renderizarComponente({
      acao: "ativação",
    });

    await aguardarCarregamentoInicial();

    preencherJustificativa();
    selecionarEdital("EDITAL 001");
    enviarFormulario();

    await waitFor(() => {
      expect(ativarProduto).toHaveBeenCalledTimes(1);
    });

    expect(toastError).toHaveBeenCalledWith(
      "Houve um erro ao registrar a ativação de produto",
    );

    expect(toastSuccess).not.toHaveBeenCalled();
    expect(props.atualizarDados).not.toHaveBeenCalled();
    expect(props.closeModal).toHaveBeenCalledTimes(1);
  });

  it("adiciona o uuid na URL no fluxo de alteração de dados", async () => {
    const uuidResposta = "00000000-0000-4000-8000-000000000008";

    ativarProduto.mockResolvedValue({
      status: HTTP_STATUS.OK,
      data: {
        uuid: uuidResposta,
      },
    });

    window.history.pushState({}, "", "/detalhe?id=homologacao");

    const pushStateSpy = jest.spyOn(window.history, "pushState");

    renderizarComponente({
      acao: "ativação",
      ehSuspensaoFluxoAlteracaoDados: true,
    });

    await aguardarCarregamentoInicial();

    preencherJustificativa();
    selecionarEdital("EDITAL 001");
    enviarFormulario();

    await waitFor(() => {
      expect(ativarProduto).toHaveBeenCalledTimes(1);
    });

    expect(pushStateSpy).toHaveBeenCalledWith(
      null,
      "",
      `/detalhe?id=homologacao&uuid=${uuidResposta}`,
    );

    pushStateSpy.mockRestore();
  });

  it("remove o parâmetro card_suspensos quando todos os editais são ativados", async () => {
    const editaisValidos = [editaisMock[0], editaisMock[1]];

    getNumerosEditais.mockResolvedValue({
      status: HTTP_STATUS.OK,
      data: {
        results: editaisValidos,
      },
    });

    window.history.pushState(
      {},
      "",
      "/detalhe?card_suspensos=true&origem=painel",
    );

    const pushStateSpy = jest.spyOn(window.history, "pushState");

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    renderizarComponente({
      acao: "ativação",
    });

    await aguardarCarregamentoInicial();

    preencherJustificativa();
    selecionarEdital("EDITAL 001");
    selecionarEdital("EDITAL 002");
    enviarFormulario();

    await waitFor(() => {
      expect(ativarProduto).toHaveBeenCalledTimes(1);
    });

    expect(pushStateSpy).toHaveBeenCalledWith(
      null,
      "",
      "/detalhe?origem=painel",
    );

    expect(toastSuccess).toHaveBeenCalledTimes(2);

    pushStateSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it("adiciona o parâmetro card_suspensos quando todos os editais são suspensos", async () => {
    const produtoComDoisEditaisAtivos = {
      ...produtoMock,
      vinculos_produto_edital: [
        {
          suspenso: false,
          edital: editaisMock[0],
        },
        {
          suspenso: false,
          edital: editaisMock[1],
        },
      ],
    };

    getNumerosEditais.mockResolvedValue({
      status: HTTP_STATUS.OK,
      data: {
        results: [editaisMock[0], editaisMock[1]],
      },
    });

    window.history.pushState({}, "", "/detalhe?origem=painel");

    const pushStateSpy = jest.spyOn(window.history, "pushState");

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    renderizarComponente({
      acao: "suspensão",
      produto: produtoComDoisEditaisAtivos,
    });

    await aguardarCarregamentoInicial();

    preencherJustificativa();
    selecionarEdital("EDITAL 001");
    selecionarEdital("EDITAL 002");
    enviarFormulario();

    await waitFor(() => {
      expect(suspenderProduto).toHaveBeenCalledTimes(1);
    });

    expect(pushStateSpy).toHaveBeenCalledWith(
      null,
      "",
      "/detalhe?origem=painel&card_suspensos=true",
    );

    expect(toastSuccess).toHaveBeenCalledTimes(2);

    pushStateSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it("desabilita o botão Enviar enquanto a requisição está em andamento", async () => {
    const requisicaoControlada = criarPromessaControlada();

    ativarProduto.mockReturnValue(requisicaoControlada.promise);

    renderizarComponente({
      acao: "ativação",
    });

    await aguardarCarregamentoInicial();

    preencherJustificativa();
    selecionarEdital("EDITAL 001");

    const botaoEnviar = screen.getByRole("button", {
      name: "Enviar",
    });

    fireEvent.click(botaoEnviar);

    await waitFor(() => {
      expect(ativarProduto).toHaveBeenCalledTimes(1);
      expect(botaoEnviar).toBeDisabled();
    });

    await act(async () => {
      requisicaoControlada.resolver({
        status: HTTP_STATUS.OK,
        data: {
          uuid: "00000000-0000-4000-8000-000000000009",
        },
      });
    });

    await waitFor(() => {
      expect(botaoEnviar).toBeEnabled();
    });
  });

  it("fecha o modal pelos botões Voltar e Fechar modal", async () => {
    const props = renderizarComponente();

    await aguardarCarregamentoInicial();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Voltar",
      }),
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Fechar modal",
      }),
    );

    expect(props.closeModal).toHaveBeenCalledTimes(2);
  });
});
