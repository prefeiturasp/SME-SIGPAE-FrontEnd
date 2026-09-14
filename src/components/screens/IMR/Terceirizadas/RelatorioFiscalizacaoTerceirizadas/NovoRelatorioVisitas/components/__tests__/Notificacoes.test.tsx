import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { downloadAndConvertToBase64 } from "src/components/Shareable/Input/InputFile/helper";
import { Notificacoes } from "../Notificacoes";

jest.mock("src/components/Shareable/Botao", () => {
  const React = require("react");

  return {
    __esModule: true,
    default: ({ texto, onClick, disabled, icon, iconPosition }) =>
      React.createElement(
        "button",
        {
          type: "button",
          onClick,
          disabled,
          "data-icon": icon,
          "data-icon-position": iconPosition,
        },
        texto,
      ),
  };
});

jest.mock("src/components/Shareable/InputFileField", () => {
  const React = require("react");

  return {
    __esModule: true,
    default: ({
      name,
      arquivosIniciais = [],
      setFiles,
      removeFile,
      formatosAceitos,
      toastSuccess,
      textoBotao,
      helpText,
      required,
    }) =>
      React.createElement(
        "div",
        {
          "data-testid": "campo-notificacoes",
          "data-name": name,
          "data-formatos-aceitos": formatosAceitos,
          "data-toast-success": toastSuccess,
          "data-required": String(required),
        },
        React.createElement("span", null, textoBotao),
        React.createElement("span", null, helpText),
        arquivosIniciais.map((arquivo) =>
          React.createElement(
            "div",
            {
              key: arquivo.nome,
              "data-testid": `arquivo-inicial-${arquivo.nome}`,
              "data-base64": arquivo.base64,
            },
            arquivo.nome,
          ),
        ),
        React.createElement(
          "button",
          {
            type: "button",
            onClick: () =>
              setFiles([
                {
                  nome: "assinada-um.pdf",
                  base64: "data:application/pdf;base64,YXNzaW5hZGEx",
                },
                {
                  nome: "assinada-dois.pdf",
                  base64: "data:application/pdf;base64,YXNzaW5hZGEy",
                },
              ]),
          },
          "Adicionar notificações",
        ),
        React.createElement(
          "button",
          { type: "button", onClick: () => removeFile(1) },
          "Remover segunda notificação",
        ),
      ),
  };
});

jest.mock("src/components/Shareable/Input/InputFile/helper", () => ({
  downloadAndConvertToBase64: jest.fn(),
}));

const notificacoesAssinadas = [
  {
    nome: "primeira.pdf",
    arquivo: "data:application/pdf;base64,cHJpbWVpcmE=",
  },
  {
    nome: "segunda.pdf",
    arquivo: "data:application/pdf;base64,c2VndW5kYQ==",
  },
];

const notificacoesIniciais = [
  {
    nome: "notificacao-um.pdf",
    anexo_url: "https://arquivos.sme.prefeitura.sp.gov.br/notificacao-um.pdf",
  },
  {
    nome: "notificacao-dois.pdf",
    anexo_url: "https://arquivos.sme.prefeitura.sp.gov.br/notificacao-dois.pdf",
  },
];

const mockDownloadAndConvertToBase64 = jest.mocked(downloadAndConvertToBase64);

const criarProps = (sobrescritas = {}) => ({
  onClickBaixarNotificacoes: jest.fn(),
  setNotificacoesAssinadas: jest.fn(),
  notificacoesAssinadas,
  notificacoesIniciais: [],
  somenteLeitura: false,
  disabledBaixarNotificacoes: false,
  ...sobrescritas,
});

const renderizarNotificacoes = (sobrescritas = {}) => {
  const props = criarProps(sobrescritas);
  render(<Notificacoes {...props} />);
  return props;
};

describe("Notificações do relatório de fiscalização", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDownloadAndConvertToBase64.mockImplementation(
      async (url) => `base64:${url}`,
    );
  });

  it("exibe os controles para adicionar e baixar notificações", () => {
    const props = renderizarNotificacoes();

    expect(screen.getByText("NOTIFICAÇÕES")).toBeInTheDocument();
    const botaoBaixar = screen.getByRole("button", {
      name: "Baixar Notificações",
    });
    expect(botaoBaixar).toBeEnabled();
    expect(botaoBaixar).toHaveAttribute("data-icon-position", "left");
    expect(screen.getByTestId("campo-notificacoes")).toHaveAttribute(
      "data-name",
      "notificacoes_assinadas",
    );
    expect(screen.getByTestId("campo-notificacoes")).toHaveAttribute(
      "data-formatos-aceitos",
      "PDF",
    );
    expect(screen.getByTestId("campo-notificacoes")).toHaveAttribute(
      "data-required",
      "true",
    );

    fireEvent.click(botaoBaixar);

    expect(props.onClickBaixarNotificacoes).toHaveBeenCalledTimes(1);
  });

  it("desabilita a ação de baixar notificações quando solicitado", () => {
    const props = renderizarNotificacoes({
      disabledBaixarNotificacoes: true,
    });

    const botaoBaixar = screen.getByRole("button", {
      name: "Baixar Notificações",
    });
    expect(botaoBaixar).toBeDisabled();

    fireEvent.click(botaoBaixar);

    expect(props.onClickBaixarNotificacoes).not.toHaveBeenCalled();
  });

  it("não exibe os controles no modo somente leitura", () => {
    renderizarNotificacoes({ somenteLeitura: true });

    expect(screen.queryByText("NOTIFICAÇÕES")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Baixar Notificações" }),
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId("campo-notificacoes")).not.toBeInTheDocument();
  });

  it("não converte arquivos quando as notificações iniciais estão vazias", () => {
    const props = renderizarNotificacoes();

    expect(mockDownloadAndConvertToBase64).not.toHaveBeenCalled();
    expect(props.setNotificacoesAssinadas).not.toHaveBeenCalled();
  });

  it("não converte arquivos quando as notificações iniciais não são informadas", () => {
    const props = renderizarNotificacoes({ notificacoesIniciais: undefined });

    expect(mockDownloadAndConvertToBase64).not.toHaveBeenCalled();
    expect(props.setNotificacoesAssinadas).not.toHaveBeenCalled();
  });

  it("converte e formata todas as notificações iniciais", async () => {
    const props = renderizarNotificacoes({ notificacoesIniciais });

    await waitFor(() => {
      expect(mockDownloadAndConvertToBase64).toHaveBeenCalledTimes(2);
      expect(mockDownloadAndConvertToBase64).toHaveBeenNthCalledWith(
        1,
        notificacoesIniciais[0].anexo_url,
      );
      expect(mockDownloadAndConvertToBase64).toHaveBeenNthCalledWith(
        2,
        notificacoesIniciais[1].anexo_url,
      );
      expect(props.setNotificacoesAssinadas).toHaveBeenCalledWith([
        {
          nome: "notificacao-um.pdf",
          arquivo: `base64:${notificacoesIniciais[0].anexo_url}`,
        },
        {
          nome: "notificacao-dois.pdf",
          arquivo: `base64:${notificacoesIniciais[1].anexo_url}`,
        },
      ]);
    });

    expect(
      screen.getByTestId("arquivo-inicial-notificacao-um.pdf"),
    ).toHaveAttribute(
      "data-base64",
      `base64:${notificacoesIniciais[0].anexo_url}`,
    );
    expect(
      screen.getByTestId("arquivo-inicial-notificacao-dois.pdf"),
    ).toHaveAttribute(
      "data-base64",
      `base64:${notificacoesIniciais[1].anexo_url}`,
    );
  });

  it("transforma os novos arquivos para o formato das notificações assinadas", () => {
    const props = renderizarNotificacoes();

    fireEvent.click(
      screen.getByRole("button", { name: "Adicionar notificações" }),
    );

    expect(props.setNotificacoesAssinadas).toHaveBeenCalledWith([
      {
        nome: "assinada-um.pdf",
        arquivo: "data:application/pdf;base64,YXNzaW5hZGEx",
      },
      {
        nome: "assinada-dois.pdf",
        arquivo: "data:application/pdf;base64,YXNzaW5hZGEy",
      },
    ]);
  });

  it("remove somente a notificação correspondente ao índice informado", () => {
    const props = renderizarNotificacoes();

    fireEvent.click(
      screen.getByRole("button", { name: "Remover segunda notificação" }),
    );

    expect(props.setNotificacoesAssinadas).toHaveBeenCalledWith([
      notificacoesAssinadas[0],
    ]);
    expect(notificacoesAssinadas).toHaveLength(2);
  });
});
