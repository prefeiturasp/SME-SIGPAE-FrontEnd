import { fireEvent, render, screen } from "@testing-library/react";
import {
  validarFormulariosParaCategoriasDeNotificacao,
  validarFormulariosTiposOcorrencia,
} from "../helpers";
import { NovoRelatorioVisitas } from "../index";

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

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock("react-final-form", () => {
  const React = require("react");

  return {
    Form: ({ children }) => {
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

jest.mock("../components/ModalSalvarRascunho", () => ({
  ModalSalvarRascunho: () => null,
}));

jest.mock("../components/ModalBaixarNotificacoes", () => ({
  ModalBaixarNotificaoces: () => null,
}));

jest.mock("../styles.scss", () => ({}));

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

describe("NovoRelatorioVisitas", () => {
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
});
