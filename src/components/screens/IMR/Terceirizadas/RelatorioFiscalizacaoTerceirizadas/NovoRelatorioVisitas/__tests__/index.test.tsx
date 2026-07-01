import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import {
  validarFormulariosParaCategoriasDeNotificacao,
  validarFormulariosTiposOcorrencia,
} from "../helpers";
import { NovoRelatorioVisitas } from "../index";

import {
  getFormularioSupervisao,
  getRespostasFormularioSupervisao,
  getRespostasNaoSeAplicaFormularioSupervisao,
  createRascunhoFormularioSupervisao,
  updateRascunhoFormularioSupervisao,
} from "src/services/imr/relatorioFiscalizacaoTerceirizadas";

let mockFormValues: Record<string, unknown> = {};
let mockHasValidationErrors = false;

const mockNavigate = jest.fn();
const mockFormChange = jest.fn();
const mockPush = jest.fn();
const mockHandleSubmit = jest.fn((event) => event?.preventDefault?.());

const tipoOcorrenciaUuid = "11111111-1111-4111-8111-111111111111";
const escolaUuid = "22222222-2222-4222-8222-222222222222";
const editalUuid = "33333333-3333-4333-8333-333333333333";
const notificacaoUuid = "44444444-4444-4444-8444-444444444444";
const formularioUuid = "55555555-5555-4555-8555-555555555555";
const anexoUuid = "66666666-6666-4666-8666-666666666666";
const respostaUuid = "77777777-7777-4777-8777-777777777777";
const respostaNaoSeAplicaUuid = "88888888-8888-4888-8888-888888888888";

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock("react-final-form", () => {
  const React = require("react");

  return {
    Form: ({ children, initialValues }) => {
      const form = {
        getState: () => ({
          values: mockFormValues,
          hasValidationErrors: mockHasValidationErrors,
        }),
        change: mockFormChange,
        mutators: {
          push: mockPush,
        },
      };

      return React.createElement(
        React.Fragment,
        null,
        React.createElement(
          "pre",
          {
            "data-testid": "form-initial-values",
          },
          JSON.stringify(initialValues ?? {}),
        ),
        children({
          handleSubmit: mockHandleSubmit,
          values: mockFormValues,
          form,
          submitting: false,
        }),
      );
    },
  };
});

jest.mock("final-form-arrays", () => ({
  __esModule: true,
  default: {},
}));

jest.mock("antd", () => {
  const React = require("react");

  return {
    Spin: ({ children }) => React.createElement(React.Fragment, null, children),
  };
});

jest.mock("src/components/Shareable/Botao", () => {
  const React = require("react");

  return {
    __esModule: true,
    default: ({ texto, disabled, onClick }) =>
      React.createElement(
        "button",
        {
          type: "button",
          disabled,
          onClick,
        },
        texto,
      ),
  };
});

jest.mock("src/components/Shareable/Toast/dialogs", () => ({
  toastError: jest.fn(),
  toastSuccess: jest.fn(),
}));

jest.mock("src/components/Shareable/ModalSolicitacaoDownload", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock("src/services/imr/relatorioFiscalizacaoTerceirizadas", () => ({
  createFormularioSupervisao: jest.fn(),
  createRascunhoFormularioSupervisao: jest.fn(),
  updateRascunhoFormularioSupervisao: jest.fn(),
  updateFormularioSupervisao: jest.fn(),
  getTiposOcorrenciaPorEditalNutrisupervisao: jest.fn(),
  getFormularioSupervisao: jest.fn(),
  getRespostasFormularioSupervisao: jest.fn(),
  getRespostasNaoSeAplicaFormularioSupervisao: jest.fn(),
  exportarPDFRelatorioNotificacao: jest.fn(),
}));

jest.mock("../helpers", () => ({
  formataPayload: jest.fn(),
  formataPayloadUpdate: jest.fn(),
  validarFormulariosTiposOcorrencia: jest.fn(),
  validarFormulariosParaCategoriasDeNotificacao: jest.fn(),
}));

jest.mock("../components/Cabecalho", () => {
  const React = require("react");

  return {
    Cabecalho: ({ setEscolaSelecionada, setTiposOcorrencia }) =>
      React.createElement(
        "button",
        {
          type: "button",
          onClick: () => {
            setEscolaSelecionada({
              uuid: escolaUuid,
              edital: editalUuid,
              label: "Unidade Educacional",
            });

            setTiposOcorrencia([
              {
                uuid: tipoOcorrenciaUuid,
                nome: "Tipo de ocorrência",
              },
            ]);
          },
        },
        "Selecionar unidade educacional",
      ),
  };
});

jest.mock("../components/Formulario", () => {
  const React = require("react");

  return {
    Formulario: () =>
      React.createElement("div", {
        "data-testid": "formulario",
      }),
  };
});

jest.mock("../components/Notificacoes", () => {
  const React = require("react");

  return {
    Notificacoes: ({ setNotificacoesAssinadas }) =>
      React.createElement(
        "button",
        {
          type: "button",
          onClick: () =>
            setNotificacoesAssinadas([
              {
                uuid: notificacaoUuid,
                nome: "notificacao-assinada.pdf",
              },
            ]),
        },
        "Anexar notificação assinada",
      ),
  };
});

jest.mock("../components/Anexos", () => {
  const React = require("react");

  return {
    Anexos: () =>
      React.createElement("div", {
        "data-testid": "anexos",
      }),
  };
});

jest.mock("../components/ModalCancelaPreenchimento", () => ({
  ModalCancelaPreenchimento: () => null,
}));

jest.mock("../components/ModalSalvar", () => ({
  ModalSalvar: () => null,
}));

jest.mock("../components/ModalSalvarRascunho", () => {
  const React = require("react");

  return {
    ModalSalvarRascunho: ({ show }) =>
      show
        ? React.createElement("div", {
            "data-testid": "modal-salvar-rascunho",
          })
        : null,
  };
});

jest.mock("../components/ModalBaixarNotificacoes", () => ({
  ModalBaixarNotificaoces: () => null,
}));

jest.mock("../styles.scss", () => ({}));

const mockGetFormularioSupervisao =
  getFormularioSupervisao as jest.MockedFunction<
    typeof getFormularioSupervisao
  >;

const mockGetRespostasFormularioSupervisao =
  getRespostasFormularioSupervisao as jest.MockedFunction<
    typeof getRespostasFormularioSupervisao
  >;

const mockGetRespostasNaoSeAplica =
  getRespostasNaoSeAplicaFormularioSupervisao as jest.MockedFunction<
    typeof getRespostasNaoSeAplicaFormularioSupervisao
  >;

const mockValidarFormulariosTiposOcorrencia =
  validarFormulariosTiposOcorrencia as jest.MockedFunction<
    typeof validarFormulariosTiposOcorrencia
  >;

const mockValidarCategoriasDeNotificacao =
  validarFormulariosParaCategoriasDeNotificacao as jest.MockedFunction<
    typeof validarFormulariosParaCategoriasDeNotificacao
  >;

const renderizarFormulario = async () => {
  render(<NovoRelatorioVisitas />);

  fireEvent.click(
    screen.getByRole("button", {
      name: "Selecionar unidade educacional",
    }),
  );

  return screen.findByRole("button", {
    name: "Enviar Formulário",
  });
};

const mockToastError = toastError as jest.MockedFunction<typeof toastError>;

const mockCreateRascunhoFormularioSupervisao =
  createRascunhoFormularioSupervisao as jest.MockedFunction<
    typeof createRascunhoFormularioSupervisao
  >;

const mockUpdateRascunhoFormularioSupervisao =
  updateRascunhoFormularioSupervisao as jest.MockedFunction<
    typeof updateRascunhoFormularioSupervisao
  >;

describe("NovoRelatorioVisitas", () => {
  window.history.pushState({}, "", "/");

  beforeEach(() => {
    jest.clearAllMocks();

    mockFormValues = {
      [`grupos_${tipoOcorrenciaUuid}`]: [
        {
          resposta: "SIM",
        },
      ],
    };

    mockHasValidationErrors = false;

    mockValidarFormulariosTiposOcorrencia.mockReturnValue({
      formulariosValidos: true,
      listaValidacaoPorTipoOcorrencia: [],
    } as any);

    mockValidarCategoriasDeNotificacao.mockReturnValue({
      formulariosValidos: true,
      listaValidacaoPorTipoOcorrencia: [],
    } as any);
  });

  mockGetFormularioSupervisao.mockResolvedValue({
    status: 200,
    data: {
      uuid: formularioUuid,
      acompanhou_visita: true,
      anexos: [
        {
          uuid: anexoUuid,
          nome: "anexo.pdf",
        },
      ],
      notificacoes_assinadas: [
        {
          uuid: notificacaoUuid,
          nome: "notificacao-assinada.pdf",
        },
      ],
    },
  } as any);

  mockGetRespostasFormularioSupervisao.mockResolvedValue({
    status: 200,
    data: [
      {
        uuid: respostaUuid,
      },
    ],
  } as any);

  mockGetRespostasNaoSeAplica.mockResolvedValue({
    status: 200,
    data: [
      {
        uuid: respostaNaoSeAplicaUuid,
      },
    ],
  } as any);

  it("habilita o envio quando todos os itens estão avaliados com SIM", async () => {
    const enviarFormulario = await renderizarFormulario();

    expect(enviarFormulario).toBeEnabled();

    expect(mockValidarFormulariosTiposOcorrencia).toHaveBeenCalledWith(
      mockFormValues,
      expect.arrayContaining([
        expect.objectContaining({
          uuid: tipoOcorrenciaUuid,
        }),
      ]),
    );

    expect(mockValidarCategoriasDeNotificacao).toHaveBeenCalled();
  });

  it("mantém o envio desabilitado quando o formulário possui erros de validação", async () => {
    mockHasValidationErrors = true;
    const enviarFormulario = await renderizarFormulario();
    expect(enviarFormulario).toBeDisabled();
  });

  it("mantém o envio desabilitado quando a categoria exige notificação assinada", async () => {
    mockValidarCategoriasDeNotificacao.mockReturnValue({
      formulariosValidos: true,
      listaValidacaoPorTipoOcorrencia: [
        {
          uuid: tipoOcorrenciaUuid,
        },
      ],
    } as any);

    const enviarFormulario = await renderizarFormulario();

    expect(
      screen.getByRole("button", {
        name: "Anexar notificação assinada",
      }),
    ).toBeInTheDocument();

    expect(enviarFormulario).toBeDisabled();
  });

  it("carrega os dados do formulário no modo de edição", async () => {
    window.history.pushState({}, "", `/?uuid=${formularioUuid}`);

    render(<NovoRelatorioVisitas isEditing />);

    await waitFor(() => {
      expect(mockGetFormularioSupervisao).toHaveBeenCalledWith(formularioUuid);

      expect(mockGetRespostasFormularioSupervisao).toHaveBeenCalledWith(
        formularioUuid,
      );

      expect(mockGetRespostasNaoSeAplica).toHaveBeenCalledWith(formularioUuid);
    });

    await waitFor(() => {
      const initialValues = JSON.parse(
        screen.getByTestId("form-initial-values").textContent ?? "{}",
      );

      expect(initialValues).toEqual(
        expect.objectContaining({
          uuid: formularioUuid,
          acompanhou_visita: "sim",
          anexos: null,
          notificacoes_assinadas: null,
        }),
      );
    });
  });

  it("carrega os dados no modo somente leitura e formata acompanhou visita como nao", async () => {
    mockGetFormularioSupervisao.mockResolvedValue({
      status: 200,
      data: {
        uuid: formularioUuid,
        acompanhou_visita: false,
        anexos: [],
        notificacoes_assinadas: [],
      },
    } as any);

    window.history.pushState({}, "", `/?uuid=${formularioUuid}`);

    render(<NovoRelatorioVisitas somenteLeitura />);

    await waitFor(() => {
      expect(mockGetFormularioSupervisao).toHaveBeenCalledWith(formularioUuid);
    });

    await waitFor(() => {
      const initialValues = JSON.parse(
        screen.getByTestId("form-initial-values").textContent ?? "{}",
      );

      expect(initialValues).toEqual(
        expect.objectContaining({
          uuid: formularioUuid,
          acompanhou_visita: "nao",
          anexos: null,
          notificacoes_assinadas: null,
        }),
      );
    });
  });

  it("exibe erro ao tentar salvar rascunho sem escola ou data", () => {
    mockFormValues = {};

    render(<NovoRelatorioVisitas />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Salvar rascunho",
      }),
    );

    expect(mockToastError).toHaveBeenCalledWith(
      "Os campos unidade educacional e data da visita são obrigatórios para salvar um rascunho.",
    );

    expect(
      screen.queryByTestId("modal-salvar-rascunho"),
    ).not.toBeInTheDocument();

    expect(mockCreateRascunhoFormularioSupervisao).not.toHaveBeenCalled();

    expect(mockUpdateRascunhoFormularioSupervisao).not.toHaveBeenCalled();
  });

  it("abre o modal de confirmação ao salvar um rascunho válido", () => {
    mockFormValues = {
      escola: escolaUuid,
      data: "2026-07-01",
    };

    render(<NovoRelatorioVisitas />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Salvar rascunho",
      }),
    );

    expect(screen.getByTestId("modal-salvar-rascunho")).toBeInTheDocument();

    expect(mockToastError).not.toHaveBeenCalled();

    expect(mockCreateRascunhoFormularioSupervisao).not.toHaveBeenCalled();

    expect(mockUpdateRascunhoFormularioSupervisao).not.toHaveBeenCalled();
  });
});
