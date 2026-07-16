import React from "react";
import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import DetalheDoProduto from "src/components/Shareable/DetalheDoProduto";
import { ENDPOINT_HOMOLOGACOES_PRODUTO_STATUS } from "src/constants/shared";
import { getHomologacaoProduto } from "src/services/produto.service";

import AtivacaoSuspensaoDetalheProduto from "../AtivacaoSuspensaoDetalheProduto";
import ModalAtivacaoSuspensaoProduto from "../ModalAtivacaoSuspensaoProduto";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("antd", () => {
  const React = require("react");

  return {
    Spin: ({ children, spinning, tip }) =>
      React.createElement(
        "div",
        {
          "data-testid": "spin",
          "data-spinning": String(spinning),
          "data-tip": tip,
        },
        children,
      ),
  };
});

jest.mock("src/components/Shareable/Botao", () => {
  const React = require("react");

  return {
    __esModule: true,
    default: jest.fn(({ texto, onClick, disabled, className }) =>
      React.createElement(
        "button",
        {
          type: "button",
          className,
          disabled,
          onClick,
        },
        texto,
      ),
    ),
  };
});

jest.mock("src/components/Shareable/DetalheDoProduto", () => {
  const React = require("react");

  const DetalheDoProdutoMock = jest.fn(({ produto, status, suspenso }) =>
    React.createElement(
      "div",
      {
        "data-testid": "detalhe-produto",
        "data-status": status,
        "data-suspenso": String(suspenso),
      },
      produto.nome,
    ),
  );

  return {
    __esModule: true,
    default: DetalheDoProdutoMock,
  };
});

jest.mock("../ModalAtivacaoSuspensaoProduto", () => {
  const React = require("react");

  const ModalAtivacaoSuspensaoProdutoMock = jest.fn(
    ({
      showModal,
      closeModal,
      atualizarDados,
      acao,
      idHomologacao,
      status,
      suspenso,
    }) =>
      React.createElement(
        "div",
        {
          "data-testid": "modal-ativacao-suspensao",
          "data-show-modal": String(showModal),
          "data-acao": acao || "",
          "data-id-homologacao": idHomologacao || "",
          "data-status": status || "",
          "data-suspenso": String(suspenso),
        },
        React.createElement(
          "button",
          {
            type: "button",
            onClick: closeModal,
          },
          "Fechar modal",
        ),
        React.createElement(
          "button",
          {
            type: "button",
            onClick: atualizarDados,
          },
          "Atualizar dados",
        ),
      ),
  );

  return {
    __esModule: true,
    default: ModalAtivacaoSuspensaoProdutoMock,
  };
});

jest.mock("src/services/produto.service", () => ({
  getHomologacaoProduto: jest.fn(),
}));

const { CODAE_HOMOLOGADO, ESCOLA_OU_NUTRICIONISTA_RECLAMOU } =
  ENDPOINT_HOMOLOGACOES_PRODUTO_STATUS;

const uuidHomologacao = "00000000-0000-4000-8000-000000000001";

const produtoAtivoMock = {
  uuid: "00000000-0000-4000-8000-000000000002",
  nome: "Arroz integral",
};

const produtoSuspensoMock = {
  uuid: "00000000-0000-4000-8000-000000000003",
  nome: "Feijão suspenso",
};

const homologacaoAtivaMock = {
  status: CODAE_HOMOLOGADO.toUpperCase(),
  produto: produtoAtivoMock,
};

const homologacaoSuspensaMock = {
  status: "CODAE_SUSPENDEU",
  produto: produtoSuspensoMock,
};

const renderizarComponente = ({ uuid = uuidHomologacao, suspenso } = {}) => {
  const parametros = new URLSearchParams();

  if (uuid) {
    parametros.set("id", uuid);
  }

  if (suspenso !== undefined) {
    parametros.set("suspenso", suspenso);
  }

  window.history.pushState({}, "", `/detalhe?${parametros.toString()}`);

  return render(<AtivacaoSuspensaoDetalheProduto />);
};

const obterUltimasProps = (mock) => {
  const chamadas = mock.mock.calls;

  return chamadas[chamadas.length - 1][0];
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

describe("AtivacaoSuspensaoDetalheProduto", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.history.pushState({}, "", "/");

    getHomologacaoProduto.mockResolvedValue({
      data: homologacaoAtivaMock,
    });
  });

  it("exibe o carregamento enquanto busca os dados da homologação", async () => {
    const consultaControlada = criarPromessaControlada();

    getHomologacaoProduto.mockReturnValue(consultaControlada.promise);

    renderizarComponente();

    expect(screen.getByTestId("spin")).toHaveAttribute("data-spinning", "true");

    expect(screen.queryByTestId("detalhe-produto")).not.toBeInTheDocument();

    await act(async () => {
      consultaControlada.resolver({
        data: homologacaoAtivaMock,
      });
    });

    expect(await screen.findByTestId("detalhe-produto")).toBeInTheDocument();

    expect(screen.getByTestId("spin")).toHaveAttribute(
      "data-spinning",
      "false",
    );
  });

  it.each([
    CODAE_HOMOLOGADO.toUpperCase(),
    ESCOLA_OU_NUTRICIONISTA_RECLAMOU.toUpperCase(),
  ])(
    "considera a homologação com status %s como produto ativo",
    async (status) => {
      getHomologacaoProduto.mockResolvedValue({
        data: {
          status,
          produto: produtoAtivoMock,
        },
      });

      renderizarComponente();

      expect(await screen.findByText("Arroz integral")).toBeInTheDocument();

      expect(getHomologacaoProduto).toHaveBeenCalledWith(uuidHomologacao);

      const detalheProduto = screen.getByTestId("detalhe-produto");

      expect(detalheProduto).toHaveAttribute("data-status", "ativo");

      const botoesAtivar = screen.getAllByRole("button", {
        name: "Ativar",
      });

      const botoesSuspender = screen.getAllByRole("button", {
        name: "Suspender",
      });

      expect(botoesAtivar).toHaveLength(2);
      expect(botoesSuspender).toHaveLength(2);

      botoesAtivar.forEach((botao) => {
        expect(botao).toBeDisabled();
      });

      botoesSuspender.forEach((botao) => {
        expect(botao).toBeEnabled();
      });

      const propsDetalhe = obterUltimasProps(DetalheDoProduto);

      expect(propsDetalhe).toEqual(
        expect.objectContaining({
          produto: produtoAtivoMock,
          status: "ativo",
          suspenso: null,
        }),
      );

      const propsModal = obterUltimasProps(ModalAtivacaoSuspensaoProduto);

      expect(propsModal).toEqual(
        expect.objectContaining({
          showModal: false,
          acao: undefined,
          produto: produtoAtivoMock,
          idHomologacao: uuidHomologacao,
          status,
          suspenso: null,
          closeModal: expect.any(Function),
          atualizarDados: expect.any(Function),
        }),
      );
    },
  );

  it("considera o produto como suspenso quando a homologação não está ativa", async () => {
    getHomologacaoProduto.mockResolvedValue({
      data: homologacaoSuspensaMock,
    });

    renderizarComponente();

    expect(await screen.findByText("Feijão suspenso")).toBeInTheDocument();

    expect(screen.getByTestId("detalhe-produto")).toHaveAttribute(
      "data-status",
      "suspenso",
    );

    const botoesAtivar = screen.getAllByRole("button", {
      name: "Ativar",
    });

    const botoesSuspender = screen.getAllByRole("button", {
      name: "Suspender",
    });

    botoesAtivar.forEach((botao) => {
      expect(botao).toBeEnabled();
    });

    botoesSuspender.forEach((botao) => {
      expect(botao).toBeDisabled();
    });
  });

  it("considera o produto como suspenso quando a URL possui suspenso=true", async () => {
    renderizarComponente({
      suspenso: "true",
    });

    expect(await screen.findByText("Arroz integral")).toBeInTheDocument();

    const detalheProduto = screen.getByTestId("detalhe-produto");

    expect(detalheProduto).toHaveAttribute("data-status", "suspenso");

    expect(detalheProduto).toHaveAttribute("data-suspenso", "true");

    const botoesAtivar = screen.getAllByRole("button", {
      name: "Ativar",
    });

    const botoesSuspender = screen.getAllByRole("button", {
      name: "Suspender",
    });

    botoesAtivar.forEach((botao) => {
      expect(botao).toBeEnabled();
    });

    botoesSuspender.forEach((botao) => {
      expect(botao).toBeDisabled();
    });

    const propsModal = obterUltimasProps(ModalAtivacaoSuspensaoProduto);

    expect(propsModal.suspenso).toBe("true");
  });

  it("retorna para a página anterior pelos botões superiores e inferiores", async () => {
    renderizarComponente();

    await screen.findByText("Arroz integral");

    const botoesVoltar = screen.getAllByRole("button", {
      name: "Voltar",
    });

    expect(botoesVoltar).toHaveLength(2);

    fireEvent.click(botoesVoltar[0]);
    fireEvent.click(botoesVoltar[1]);

    expect(mockNavigate).toHaveBeenCalledTimes(2);
    expect(mockNavigate).toHaveBeenNthCalledWith(1, -1);
    expect(mockNavigate).toHaveBeenNthCalledWith(2, -1);
  });

  it("abre e fecha o modal de ativação pelos botões da tela", async () => {
    getHomologacaoProduto.mockResolvedValue({
      data: homologacaoSuspensaMock,
    });

    renderizarComponente();

    await screen.findByText("Feijão suspenso");

    const botoesAtivar = screen.getAllByRole("button", {
      name: "Ativar",
    });

    fireEvent.click(botoesAtivar[0]);

    expect(screen.getByTestId("modal-ativacao-suspensao")).toHaveAttribute(
      "data-show-modal",
      "true",
    );

    expect(screen.getByTestId("modal-ativacao-suspensao")).toHaveAttribute(
      "data-acao",
      "ativação",
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Fechar modal",
      }),
    );

    expect(screen.getByTestId("modal-ativacao-suspensao")).toHaveAttribute(
      "data-show-modal",
      "false",
    );

    fireEvent.click(botoesAtivar[1]);

    expect(screen.getByTestId("modal-ativacao-suspensao")).toHaveAttribute(
      "data-show-modal",
      "true",
    );

    expect(screen.getByTestId("modal-ativacao-suspensao")).toHaveAttribute(
      "data-acao",
      "ativação",
    );
  });

  it("abre e fecha o modal de suspensão pelos botões da tela", async () => {
    renderizarComponente();

    await screen.findByText("Arroz integral");

    const botoesSuspender = screen.getAllByRole("button", {
      name: "Suspender",
    });

    fireEvent.click(botoesSuspender[0]);

    expect(screen.getByTestId("modal-ativacao-suspensao")).toHaveAttribute(
      "data-show-modal",
      "true",
    );

    expect(screen.getByTestId("modal-ativacao-suspensao")).toHaveAttribute(
      "data-acao",
      "suspensão",
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Fechar modal",
      }),
    );

    expect(screen.getByTestId("modal-ativacao-suspensao")).toHaveAttribute(
      "data-show-modal",
      "false",
    );

    fireEvent.click(botoesSuspender[1]);

    expect(screen.getByTestId("modal-ativacao-suspensao")).toHaveAttribute(
      "data-show-modal",
      "true",
    );

    expect(screen.getByTestId("modal-ativacao-suspensao")).toHaveAttribute(
      "data-acao",
      "suspensão",
    );
  });

  it("atualiza os dados da homologação pelo callback do modal", async () => {
    getHomologacaoProduto
      .mockResolvedValueOnce({
        data: homologacaoAtivaMock,
      })
      .mockResolvedValueOnce({
        data: homologacaoSuspensaMock,
      });

    renderizarComponente();

    expect(await screen.findByText("Arroz integral")).toBeInTheDocument();

    expect(screen.getByTestId("detalhe-produto")).toHaveAttribute(
      "data-status",
      "ativo",
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Atualizar dados",
      }),
    );

    await waitFor(() => {
      expect(getHomologacaoProduto).toHaveBeenCalledTimes(2);
    });

    expect(getHomologacaoProduto).toHaveBeenNthCalledWith(1, uuidHomologacao);

    expect(getHomologacaoProduto).toHaveBeenNthCalledWith(2, uuidHomologacao);

    expect(await screen.findByText("Feijão suspenso")).toBeInTheDocument();

    expect(screen.getByTestId("detalhe-produto")).toHaveAttribute(
      "data-status",
      "suspenso",
    );

    const propsModal = obterUltimasProps(ModalAtivacaoSuspensaoProduto);

    expect(propsModal).toEqual(
      expect.objectContaining({
        produto: produtoSuspensoMock,
        status: "CODAE_SUSPENDEU",
        idHomologacao: uuidHomologacao,
      }),
    );
  });
});
