import HTTP_STATUS from "http-status-codes";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import {
  formataPayload,
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
  createFormularioSupervisao,
  updateFormularioSupervisao,
  getTiposOcorrenciaPorEditalNutrisupervisao,
  exportarPDFRelatorioNotificacao,
} from "src/services/imr/relatorioFiscalizacaoTerceirizadas";
import { formataPayloadUpdate } from "../helpers";
import type { ComponentProps, FormEvent } from "react";
import type {
  EscolaLabelInterface,
  NovoRelatorioVisitasFormInterface,
  TipoOcorrenciaInterface,
} from "src/interfaces/imr.interface";

type PropriedadesCabecalho = ComponentProps<
  typeof import("../components/Cabecalho").Cabecalho
>;
type PropriedadesFormulario = ComponentProps<
  typeof import("../components/Formulario").Formulario
>;
type PropriedadesNotificacoes = ComponentProps<
  typeof import("../components/Notificacoes").Notificacoes
>;
type PropriedadesAnexos = ComponentProps<
  typeof import("../components/Anexos").Anexos
>;

let mockFormValues: Record<string, unknown> = {};
let mockHasValidationErrors = false;
let mockSubmitting = false;

const mockNavigate = jest.fn();
const mockFormChange = jest.fn();
const mockPush = jest.fn();
const mockHandleSubmit = jest.fn((event) => event?.preventDefault?.());
const mockCabecalho = jest.fn();
const mockFormulario = jest.fn();
const mockNotificacoes = jest.fn();
const mockAnexos = jest.fn();

const tipoOcorrenciaUuid = "11111111-1111-4111-8111-111111111111";
const escolaUuid = "22222222-2222-4222-8222-222222222222";
const editalUuid = "33333333-3333-4333-8333-333333333333";
const notificacaoUuid = "44444444-4444-4444-8444-444444444444";
const formularioUuid = "55555555-5555-4555-8555-555555555555";
const anexoUuid = "66666666-6666-4666-8666-666666666666";
const respostaUuid = "77777777-7777-4777-8777-777777777777";
const respostaNaoSeAplicaUuid = "88888888-8888-4888-8888-888888888888";

const mockEscolaSelecionada: EscolaLabelInterface = {
  uuid: escolaUuid,
  value: escolaUuid,
  edital: editalUuid,
  label: "000054 - EMEI ALUISIO DE ALMEIDA",
  lote_nome: "LOTE 01",
  terceirizada: "Empresa de teste",
};
const mockTipoOcorrencia: TipoOcorrenciaInterface = {
  uuid: tipoOcorrenciaUuid,
  titulo: "Uniforme dos manipuladores",
  descricao: "Funcionários utilizavam uniforme completo?",
  aceita_multiplas_respostas: true,
  posicao: 1,
  parametrizacoes: [],
  categoria: {
    uuid: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    nome: "FUNCIONÁRIOS",
    posicao: 1,
    gera_notificacao: false,
  },
  penalidade: {
    descricao: "Penalidade de teste",
    numero_clausula: "1.1",
    obrigacoes: ["Utilizar uniforme completo"],
  },
};
const mockAnexo = {
  uuid: anexoUuid,
  nome: "anexo.pdf",
  arquivo: "data:application/pdf;base64,JVBERi0xLjQK",
};
const mockNotificacaoAssinada = {
  uuid: notificacaoUuid,
  nome: "notificacao-assinada.pdf",
  arquivo: "data:application/pdf;base64,JVBERi0xLjQK",
};
const valoresFormularioPadrao: NovoRelatorioVisitasFormInterface = {
  escola: escolaUuid,
  diretoria_regional: "99999999-9999-4999-8999-999999999999",
  data: "01/07/2026",
  lote: "LOTE 01",
  terceirizada: "Empresa de teste",
  total_matriculados_por_data: 100,
  maior_frequencia_no_periodo: 100,
  acompanhou_visita: "nao",
  anexos: [],
  notificacoes_assinadas: [],
};
const payloadCriacaoPadrao = {
  ...valoresFormularioPadrao,
  acompanhou_visita: false,
  ocorrencias: [],
  ocorrencias_nao_se_aplica: [],
};
const caminhoPainel =
  "/supervisao/terceirizadas/painel-relatorios-fiscalizacao";

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock("react-final-form", () => {
  const React = require("react");

  return {
    Form: ({ children, initialValues, onSubmit }) => {
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
          handleSubmit: (evento: FormEvent<HTMLFormElement>) => {
            evento.preventDefault();
            mockHandleSubmit(evento);
            return onSubmit(mockFormValues, form);
          },
          values: mockFormValues,
          form,
          submitting: mockSubmitting,
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
    Spin: ({ children, spinning }) =>
      React.createElement(
        "div",
        { "data-testid": "carregamento-ocorrencias", "aria-busy": spinning },
        children,
      ),
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

jest.mock("src/components/Shareable/ModalSolicitacaoDownload", () => {
  const React = require("react");

  return {
    __esModule: true,
    default: ({ show, setShow, callbackClose }) =>
      show
        ? React.createElement(
            "button",
            {
              type: "button",
              onClick: () => {
                setShow(false);
                callbackClose();
              },
            },
            "Fechar Central de Downloads",
          )
        : null,
  };
});

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
    Cabecalho: (props: PropriedadesCabecalho) => {
      mockCabecalho(props);
      const {
        form,
        setEscolaSelecionada,
        setTiposOcorrencia,
        getTiposOcorrenciaPorEditalNutrisupervisaoAsync,
      } = props;

      return React.createElement(
        React.Fragment,
        null,
        React.createElement(
          "button",
          {
            type: "button",
            onClick: () => {
              setEscolaSelecionada(mockEscolaSelecionada);
              setTiposOcorrencia([mockTipoOcorrencia]);
            },
          },
          "Selecionar unidade educacional",
        ),
        React.createElement(
          "button",
          {
            type: "button",
            onClick: () =>
              getTiposOcorrenciaPorEditalNutrisupervisaoAsync(
                form,
                mockEscolaSelecionada,
              ),
          },
          "Consultar tipos de ocorrência",
        ),
        React.createElement(
          "button",
          {
            type: "button",
            onClick: () => setEscolaSelecionada(undefined),
          },
          "Limpar unidade educacional",
        ),
      );
    },
  };
});

jest.mock("../components/Formulario", () => {
  const React = require("react");

  return {
    Formulario: (props: PropriedadesFormulario) => {
      mockFormulario(props);
      return React.createElement("div", {
        "data-testid": "formulario",
      });
    },
  };
});

jest.mock("../components/Notificacoes", () => {
  const React = require("react");

  return {
    Notificacoes: (props: PropriedadesNotificacoes) => {
      mockNotificacoes(props);
      const {
        setNotificacoesAssinadas,
        onClickBaixarNotificacoes,
        disabledBaixarNotificacoes,
        somenteLeitura,
      } = props;

      return React.createElement(
        "section",
        { "data-testid": "notificacoes" },
        !somenteLeitura &&
          React.createElement(
            React.Fragment,
            null,
            React.createElement(
              "button",
              {
                type: "button",
                onClick: () =>
                  setNotificacoesAssinadas([mockNotificacaoAssinada]),
              },
              "Anexar notificação assinada",
            ),
            React.createElement(
              "button",
              {
                type: "button",
                disabled: disabledBaixarNotificacoes,
                onClick: () => onClickBaixarNotificacoes(true),
              },
              "Baixar notificações",
            ),
          ),
      );
    },
  };
});

jest.mock("../components/Anexos", () => {
  const React = require("react");

  return {
    Anexos: (props: PropriedadesAnexos) => {
      mockAnexos(props);
      return React.createElement(
        "section",
        { "data-testid": "anexos" },
        React.createElement(
          "button",
          {
            type: "button",
            onClick: () => props.setAnexos([mockAnexo]),
          },
          "Adicionar anexo",
        ),
      );
    },
  };
});

jest.mock("../components/ModalCancelaPreenchimento", () => {
  const React = require("react");

  return {
    ModalCancelaPreenchimento: ({ show, handleClose }) =>
      show
        ? React.createElement(
            "button",
            { type: "button", onClick: handleClose },
            "Fechar cancelamento",
          )
        : null,
  };
});

jest.mock("../components/ModalSalvar", () => {
  const React = require("react");

  return {
    ModalSalvar: ({ show, handleClose, values, salvar }) =>
      show
        ? React.createElement(
            React.Fragment,
            null,
            React.createElement(
              "button",
              { type: "button", onClick: () => salvar(values) },
              "Confirmar envio do formulário",
            ),
            React.createElement(
              "button",
              { type: "button", onClick: handleClose },
              "Cancelar envio do formulário",
            ),
          )
        : null,
  };
});

jest.mock("../components/ModalBaixarNotificacoes", () => {
  const React = require("react");

  return {
    ModalBaixarNotificaoces: ({
      show,
      handleClose,
      salvarRascunhoEBaixarNotificacoes,
    }) =>
      show
        ? React.createElement(
            React.Fragment,
            null,
            React.createElement(
              "button",
              { type: "button", onClick: salvarRascunhoEBaixarNotificacoes },
              "Confirmar geração das notificações",
            ),
            React.createElement(
              "button",
              { type: "button", onClick: handleClose },
              "Cancelar geração das notificações",
            ),
          )
        : null,
  };
});

jest.mock("../styles.scss", () => ({}));

jest.mock("../components/ModalSalvarRascunho", () => {
  const React = require("react");

  return {
    ModalSalvarRascunho: ({ show, handleClose, values, salvarRascunho }) =>
      show
        ? React.createElement(
            React.Fragment,
            null,
            React.createElement(
              "button",
              {
                type: "button",
                "data-testid": "modal-salvar-rascunho",
                onClick: () => salvarRascunho(values),
              },
              "Confirmar salvamento do rascunho",
            ),
            React.createElement(
              "button",
              { type: "button", onClick: handleClose },
              "Cancelar salvamento do rascunho",
            ),
          )
        : null,
  };
});

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

const mockToastSuccess = toastSuccess as jest.MockedFunction<
  typeof toastSuccess
>;

const mockFormataPayloadUpdate = formataPayloadUpdate as jest.MockedFunction<
  typeof formataPayloadUpdate
>;

const mockFormataPayload = formataPayload as jest.MockedFunction<
  typeof formataPayload
>;

const mockCriarFormulario = jest.mocked(createFormularioSupervisao);
const mockAtualizarFormulario = jest.mocked(updateFormularioSupervisao);
const mockConsultarTipos = jest.mocked(
  getTiposOcorrenciaPorEditalNutrisupervisao,
);
const mockExportarNotificacoes = jest.mocked(exportarPDFRelatorioNotificacao);

const payloadUpdateMock = {
  uuid: formularioUuid,
  escola: escolaUuid,
  data: "2026-07-01",
};

const validacaoComNotificacao = {
  formulariosValidos: true,
  listaValidacaoPorTipoOcorrencia: [
    { tipo_ocorrencia: tipoOcorrenciaUuid, valid: true },
  ],
};

const solicitarNotificacoes = async (): Promise<void> => {
  mockValidarCategoriasDeNotificacao.mockReturnValue(validacaoComNotificacao);
  await renderizarFormulario();
  fireEvent.click(screen.getByRole("button", { name: "Baixar notificações" }));
  fireEvent.click(
    screen.getByRole("button", {
      name: "Confirmar geração das notificações",
    }),
  );
};

describe("NovoRelatorioVisitas", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    window.history.pushState({}, "", "/");

    mockFormValues = {
      ...valoresFormularioPadrao,
      [`grupos_${tipoOcorrenciaUuid}`]: [
        {
          resposta: "SIM",
        },
      ],
    };

    mockHasValidationErrors = false;
    mockSubmitting = false;

    mockValidarFormulariosTiposOcorrencia.mockReturnValue({
      formulariosValidos: true,
      listaValidacaoPorTipoOcorrencia: [],
    });

    mockValidarCategoriasDeNotificacao.mockReturnValue({
      formulariosValidos: true,
      listaValidacaoPorTipoOcorrencia: [],
    });

    mockGetFormularioSupervisao.mockResolvedValue({
      status: HTTP_STATUS.OK,
      data: {
        ...valoresFormularioPadrao,
        uuid: formularioUuid,
        acompanhou_visita: true,
        anexos: [mockAnexo],
        notificacoes_assinadas: [mockNotificacaoAssinada],
      },
    });
    mockGetRespostasFormularioSupervisao.mockResolvedValue({
      status: HTTP_STATUS.OK,
      data: [{ uuid: respostaUuid }],
    });
    mockGetRespostasNaoSeAplica.mockResolvedValue({
      status: HTTP_STATUS.OK,
      data: [{ uuid: respostaNaoSeAplicaUuid }],
    });
    mockFormataPayload.mockReturnValue(payloadCriacaoPadrao);
    mockFormataPayloadUpdate.mockReturnValue({
      ...payloadCriacaoPadrao,
      uuid: formularioUuid,
      ocorrencias_sim: [],
    });
    mockCreateRascunhoFormularioSupervisao.mockResolvedValue({
      status: HTTP_STATUS.CREATED,
      data: { uuid: formularioUuid },
    });
    mockUpdateRascunhoFormularioSupervisao.mockResolvedValue({
      status: HTTP_STATUS.OK,
      data: { uuid: formularioUuid },
    });
    mockCriarFormulario.mockResolvedValue({
      status: HTTP_STATUS.CREATED,
      data: { uuid: formularioUuid },
    });
    mockAtualizarFormulario.mockResolvedValue({
      status: HTTP_STATUS.OK,
      data: { uuid: formularioUuid },
    });
    mockConsultarTipos.mockResolvedValue({
      status: HTTP_STATUS.OK,
      data: [mockTipoOcorrencia],
    });
    mockExportarNotificacoes.mockResolvedValue({
      status: HTTP_STATUS.OK,
      data: {
        detail: "Solicitação de geração de arquivo recebida com sucesso.",
      },
    });
  });

  describe("Envio do relatório", () => {
    it("cria o relatório somente depois de confirmar e retorna ao painel", async () => {
      const enviarFormulario = await renderizarFormulario();

      fireEvent.click(enviarFormulario);

      expect(
        screen.getByRole("button", { name: "Confirmar envio do formulário" }),
      ).toBeInTheDocument();
      expect(mockCriarFormulario).not.toHaveBeenCalled();
      expect(mockAtualizarFormulario).not.toHaveBeenCalled();

      fireEvent.click(
        screen.getByRole("button", { name: "Confirmar envio do formulário" }),
      );

      await waitFor(() =>
        expect(mockNavigate).toHaveBeenCalledWith(caminhoPainel),
      );
      expect(mockFormataPayload).toHaveBeenCalledWith(
        mockFormValues,
        mockEscolaSelecionada,
        [],
        [],
      );
      expect(mockCriarFormulario).toHaveBeenCalledTimes(1);
      expect(mockCriarFormulario).toHaveBeenCalledWith(payloadCriacaoPadrao);
      expect(mockAtualizarFormulario).not.toHaveBeenCalled();
      expect(mockToastSuccess).toHaveBeenCalledWith(
        "Relatório de Fiscalização enviado com sucesso!",
      );
      expect(mockToastError).not.toHaveBeenCalled();
    });

    it("atualiza o relatório existente somente depois de confirmar", async () => {
      mockFormValues = { ...valoresFormularioPadrao, uuid: formularioUuid };
      const enviarFormulario = await renderizarFormulario();

      fireEvent.click(enviarFormulario);
      expect(mockAtualizarFormulario).not.toHaveBeenCalled();

      fireEvent.click(
        screen.getByRole("button", { name: "Confirmar envio do formulário" }),
      );

      await waitFor(() =>
        expect(mockNavigate).toHaveBeenCalledWith(caminhoPainel),
      );
      expect(mockFormataPayloadUpdate).toHaveBeenCalledWith(
        mockFormValues,
        mockEscolaSelecionada,
        [],
        [],
        [],
      );
      expect(mockAtualizarFormulario).toHaveBeenCalledTimes(1);
      expect(mockAtualizarFormulario).toHaveBeenCalledWith({
        ...payloadCriacaoPadrao,
        uuid: formularioUuid,
        ocorrencias_sim: [],
      });
      expect(mockCriarFormulario).not.toHaveBeenCalled();
      expect(mockToastSuccess).toHaveBeenCalledWith(
        "Relatório de Fiscalização enviado com sucesso!",
      );
      expect(mockToastError).not.toHaveBeenCalled();
    });

    it.each([
      { cenario: "criação", uuid: undefined, servico: mockCriarFormulario },
      {
        cenario: "atualização",
        uuid: formularioUuid,
        servico: mockAtualizarFormulario,
      },
    ])(
      "exibe erro quando a $cenario do relatório falha",
      async ({ uuid, servico }) => {
        mockFormValues = { ...valoresFormularioPadrao, uuid };
        servico.mockResolvedValueOnce({
          status: HTTP_STATUS.BAD_REQUEST,
          data: { detail: "Dados do relatório inválidos." },
        });
        const enviarFormulario = await renderizarFormulario();

        fireEvent.click(enviarFormulario);
        fireEvent.click(
          screen.getByRole("button", { name: "Confirmar envio do formulário" }),
        );

        await waitFor(() =>
          expect(mockToastError).toHaveBeenCalledWith(
            "Erro ao enviar Relatório de Fiscalização. Tente novamente mais tarde.",
          ),
        );
        expect(servico).toHaveBeenCalledTimes(1);
        expect(mockToastSuccess).not.toHaveBeenCalled();
        expect(mockNavigate).not.toHaveBeenCalled();
      },
    );

    it("fecha a confirmação de envio sem salvar o relatório", async () => {
      fireEvent.click(await renderizarFormulario());
      fireEvent.click(
        screen.getByRole("button", { name: "Cancelar envio do formulário" }),
      );

      expect(
        screen.queryByRole("button", { name: "Confirmar envio do formulário" }),
      ).not.toBeInTheDocument();
      expect(mockCriarFormulario).not.toHaveBeenCalled();
      expect(mockAtualizarFormulario).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("não envia automaticamente ao submeter o formulário nativo", async () => {
      const enviarFormulario = await renderizarFormulario();

      await act(async () => {
        fireEvent.submit(enviarFormulario.closest("form"));
      });

      expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
      expect(mockCriarFormulario).not.toHaveBeenCalled();
      expect(mockAtualizarFormulario).not.toHaveBeenCalled();
      expect(mockCreateRascunhoFormularioSupervisao).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe("Validações e arquivos", () => {
    it("bloqueia o envio quando as respostas das ocorrências estão incompletas", async () => {
      mockValidarFormulariosTiposOcorrencia.mockReturnValue({
        formulariosValidos: false,
        listaValidacaoPorTipoOcorrencia: [
          { tipo_ocorrencia: tipoOcorrenciaUuid, valid: false },
        ],
      });

      const enviarFormulario = await renderizarFormulario();

      expect(enviarFormulario).toBeDisabled();
      expect(screen.getByTestId("anexos")).toBeInTheDocument();
    });

    it("libera o envio após anexar a notificação assinada exigida", async () => {
      mockValidarCategoriasDeNotificacao.mockReturnValue(
        validacaoComNotificacao,
      );
      const enviarFormulario = await renderizarFormulario();

      expect(enviarFormulario).toBeDisabled();
      fireEvent.click(
        screen.getByRole("button", { name: "Anexar notificação assinada" }),
      );

      expect(enviarFormulario).toBeEnabled();
      expect(mockNotificacoes).toHaveBeenLastCalledWith(
        expect.objectContaining({
          notificacoesAssinadas: [mockNotificacaoAssinada],
        }),
      );
    });

    it.each([
      { errosFormulario: true, respostasValidas: true, bloqueado: true },
      { errosFormulario: false, respostasValidas: false, bloqueado: true },
      { errosFormulario: false, respostasValidas: true, bloqueado: false },
    ])(
      "controla o download com erros=$errosFormulario e respostas válidas=$respostasValidas",
      async ({ errosFormulario, respostasValidas, bloqueado }) => {
        mockHasValidationErrors = errosFormulario;
        mockValidarCategoriasDeNotificacao.mockReturnValue({
          formulariosValidos: respostasValidas,
          listaValidacaoPorTipoOcorrencia: [
            { tipo_ocorrencia: tipoOcorrenciaUuid, valid: respostasValidas },
          ],
        });

        await renderizarFormulario();

        expect(mockNotificacoes).toHaveBeenLastCalledWith(
          expect.objectContaining({ disabledBaixarNotificacoes: bloqueado }),
        );
        const baixarNotificacoes = screen.getByRole("button", {
          name: "Baixar notificações",
        });
        if (bloqueado) {
          expect(baixarNotificacoes).toBeDisabled();
        } else {
          expect(baixarNotificacoes).toBeEnabled();
        }
      },
    );

    it("oculta anexos e notificações quando não há ocorrências que os exigem", async () => {
      await renderizarFormulario();

      expect(screen.queryByTestId("anexos")).not.toBeInTheDocument();
      expect(screen.queryByTestId("notificacoes")).not.toBeInTheDocument();
    });

    it.each([
      { cenario: "criação", uuid: undefined },
      { cenario: "atualização", uuid: formularioUuid },
    ])(
      "encaminha os arquivos anexados para a $cenario do rascunho",
      async ({ uuid }) => {
        mockFormValues = { ...valoresFormularioPadrao, uuid };
        mockValidarCategoriasDeNotificacao.mockReturnValue(
          validacaoComNotificacao,
        );
        mockValidarFormulariosTiposOcorrencia.mockReturnValue(
          validacaoComNotificacao,
        );
        await renderizarFormulario();

        fireEvent.click(
          screen.getByRole("button", { name: "Adicionar anexo" }),
        );
        fireEvent.click(
          screen.getByRole("button", { name: "Anexar notificação assinada" }),
        );
        fireEvent.click(
          screen.getByRole("button", { name: "Salvar rascunho" }),
        );
        fireEvent.click(
          screen.getByRole("button", {
            name: "Confirmar salvamento do rascunho",
          }),
        );

        await waitFor(() =>
          expect(mockNavigate).toHaveBeenCalledWith(caminhoPainel),
        );
        if (uuid) {
          expect(mockFormataPayloadUpdate).toHaveBeenCalledWith(
            mockFormValues,
            mockEscolaSelecionada,
            [mockAnexo],
            [mockNotificacaoAssinada],
            [],
          );
        } else {
          expect(mockFormataPayload).toHaveBeenCalledWith(
            mockFormValues,
            mockEscolaSelecionada,
            [mockAnexo],
            [mockNotificacaoAssinada],
          );
        }
      },
    );

    it("desabilita as ações de salvar e enviar durante a submissão", async () => {
      mockSubmitting = true;
      const enviarFormulario = await renderizarFormulario();

      expect(enviarFormulario).toBeDisabled();
      expect(
        screen.getByRole("button", { name: "Salvar rascunho" }),
      ).toBeDisabled();
    });
  });

  describe("Consulta dos tipos de ocorrência", () => {
    it("consulta por escola e edital e inicializa um grupo para cada tipo", async () => {
      const outroTipo = {
        ...mockTipoOcorrencia,
        uuid: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
        titulo: "Condições de higiene",
        posicao: 2,
      };
      mockConsultarTipos.mockResolvedValueOnce({
        status: HTTP_STATUS.OK,
        data: [mockTipoOcorrencia, outroTipo],
      });
      await renderizarFormulario();

      fireEvent.click(
        screen.getByRole("button", { name: "Consultar tipos de ocorrência" }),
      );

      await waitFor(() =>
        expect(mockFormulario).toHaveBeenLastCalledWith(
          expect.objectContaining({
            tiposOcorrencia: [mockTipoOcorrencia, outroTipo],
          }),
        ),
      );
      expect(mockConsultarTipos).toHaveBeenCalledWith({
        edital_uuid: editalUuid,
        escola_uuid: escolaUuid,
      });
      expect(mockFormChange).toHaveBeenCalledWith(
        `grupos_${tipoOcorrenciaUuid}`,
        [{}],
      );
      expect(mockFormChange).toHaveBeenCalledWith(`grupos_${outroTipo.uuid}`, [
        {},
      ]);
      expect(mockFormChange).toHaveBeenCalledTimes(2);
      expect(screen.getByTestId("carregamento-ocorrencias")).toHaveAttribute(
        "aria-busy",
        "false",
      );
    });

    it("aceita a consulta sem tipos de ocorrência e não cria grupos", async () => {
      mockConsultarTipos.mockResolvedValueOnce({
        status: HTTP_STATUS.OK,
        data: [],
      });
      await renderizarFormulario();

      fireEvent.click(
        screen.getByRole("button", { name: "Consultar tipos de ocorrência" }),
      );

      await waitFor(() =>
        expect(mockFormulario).toHaveBeenLastCalledWith(
          expect.objectContaining({ tiposOcorrencia: [] }),
        ),
      );
      expect(mockFormChange).not.toHaveBeenCalled();
    });

    it("oculta o formulário após erro e o apresenta novamente após uma consulta bem-sucedida", async () => {
      mockConsultarTipos.mockResolvedValueOnce({
        status: HTTP_STATUS.BAD_REQUEST,
        data: [],
      });
      await renderizarFormulario();

      fireEvent.click(
        screen.getByRole("button", { name: "Consultar tipos de ocorrência" }),
      );
      await waitFor(() =>
        expect(screen.queryByTestId("formulario")).not.toBeInTheDocument(),
      );
      expect(
        screen.queryByTestId("carregamento-ocorrencias"),
      ).not.toBeInTheDocument();

      fireEvent.click(
        screen.getByRole("button", { name: "Consultar tipos de ocorrência" }),
      );

      expect(await screen.findByTestId("formulario")).toBeInTheDocument();
      expect(mockConsultarTipos).toHaveBeenCalledTimes(2);
    });

    it("indica o carregamento enquanto a consulta de tipos está pendente", async () => {
      type RespostaTipos = Awaited<
        ReturnType<typeof getTiposOcorrenciaPorEditalNutrisupervisao>
      >;
      let concluirConsulta: (_resposta: RespostaTipos) => void;
      const consulta = new Promise<RespostaTipos>((resolver) => {
        concluirConsulta = resolver;
      });
      mockConsultarTipos.mockReturnValueOnce(consulta);
      await renderizarFormulario();

      fireEvent.click(
        screen.getByRole("button", { name: "Consultar tipos de ocorrência" }),
      );

      expect(screen.getByTestId("carregamento-ocorrencias")).toHaveAttribute(
        "aria-busy",
        "true",
      );

      await act(async () => {
        concluirConsulta({
          status: HTTP_STATUS.OK,
          data: [mockTipoOcorrencia],
        });
        await consulta;
      });

      expect(screen.getByTestId("carregamento-ocorrencias")).toHaveAttribute(
        "aria-busy",
        "false",
      );
    });

    it("limpa as ocorrências ao remover a escola selecionada", async () => {
      await renderizarFormulario();
      expect(screen.getByTestId("formulario")).toBeInTheDocument();

      fireEvent.click(
        screen.getByRole("button", { name: "Limpar unidade educacional" }),
      );

      await waitFor(() =>
        expect(screen.queryByTestId("formulario")).not.toBeInTheDocument(),
      );
      expect(
        screen.queryByRole("button", { name: "Enviar Formulário" }),
      ).not.toBeInTheDocument();
      expect(mockCabecalho).toHaveBeenLastCalledWith(
        expect.objectContaining({ escolaSelecionada: undefined }),
      );
    });
  });

  describe("Carregamento e navegação", () => {
    it.each([
      { nome: "edição", propriedades: { isEditing: true } },
      { nome: "consulta", propriedades: { somenteLeitura: true } },
    ])("não consulta relatório sem UUID no modo $nome", ({ propriedades }) => {
      render(<NovoRelatorioVisitas {...propriedades} />);

      expect(mockGetFormularioSupervisao).not.toHaveBeenCalled();
      expect(mockGetRespostasFormularioSupervisao).not.toHaveBeenCalled();
      expect(mockGetRespostasNaoSeAplica).not.toHaveBeenCalled();
    });

    it("não carrega um relatório existente no modo de cadastro", () => {
      window.history.pushState({}, "", `/?uuid=${formularioUuid}`);

      render(<NovoRelatorioVisitas />);

      expect(mockGetFormularioSupervisao).not.toHaveBeenCalled();
      expect(mockGetRespostasFormularioSupervisao).not.toHaveBeenCalled();
      expect(mockGetRespostasNaoSeAplica).not.toHaveBeenCalled();
    });

    it("repassa respostas, anexos e notificações carregadas aos componentes filhos", async () => {
      window.history.pushState({}, "", `/?uuid=${formularioUuid}`);
      mockValidarCategoriasDeNotificacao.mockReturnValue(
        validacaoComNotificacao,
      );
      mockValidarFormulariosTiposOcorrencia.mockReturnValue(
        validacaoComNotificacao,
      );

      render(<NovoRelatorioVisitas isEditing />);
      fireEvent.click(
        screen.getByRole("button", { name: "Selecionar unidade educacional" }),
      );

      await waitFor(() => {
        expect(mockFormulario).toHaveBeenLastCalledWith(
          expect.objectContaining({
            respostasOcorrencias: [{ uuid: respostaUuid }],
            respostasOcorrenciaNaoSeAplica: [{ uuid: respostaNaoSeAplicaUuid }],
            somenteLeitura: false,
          }),
        );
        expect(mockAnexos).toHaveBeenLastCalledWith(
          expect.objectContaining({ anexosIniciais: [mockAnexo] }),
        );
        expect(mockNotificacoes).toHaveBeenLastCalledWith(
          expect.objectContaining({
            notificacoesIniciais: [mockNotificacaoAssinada],
          }),
        );
      });
      expect(mockCabecalho).toHaveBeenLastCalledWith(
        expect.objectContaining({ isEditing: true, somenteLeitura: false }),
      );
    });

    it("oculta as ações de alteração no modo somente leitura e permite voltar ao painel", () => {
      render(<NovoRelatorioVisitas somenteLeitura />);

      expect(
        screen.queryByRole("button", { name: "Cancelar" }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "Salvar rascunho" }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "Enviar Formulário" }),
      ).not.toBeInTheDocument();
      expect(mockCabecalho).toHaveBeenLastCalledWith(
        expect.objectContaining({ somenteLeitura: true }),
      );

      fireEvent.click(screen.getByRole("button", { name: "Voltar" }));

      expect(mockNavigate).toHaveBeenCalledWith(caminhoPainel);
    });

    it("abre e fecha o modal de cancelamento sem navegar", () => {
      render(<NovoRelatorioVisitas />);

      fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));
      expect(
        screen.getByRole("button", { name: "Fechar cancelamento" }),
      ).toBeInTheDocument();
      fireEvent.click(
        screen.getByRole("button", { name: "Fechar cancelamento" }),
      );

      expect(
        screen.queryByRole("button", { name: "Fechar cancelamento" }),
      ).not.toBeInTheDocument();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("fecha a confirmação do rascunho sem chamar os serviços", () => {
      render(<NovoRelatorioVisitas />);

      fireEvent.click(screen.getByRole("button", { name: "Salvar rascunho" }));
      fireEvent.click(
        screen.getByRole("button", { name: "Cancelar salvamento do rascunho" }),
      );

      expect(
        screen.queryByTestId("modal-salvar-rascunho"),
      ).not.toBeInTheDocument();
      expect(mockCreateRascunhoFormularioSupervisao).not.toHaveBeenCalled();
      expect(mockUpdateRascunhoFormularioSupervisao).not.toHaveBeenCalled();
    });
  });

  describe("Relatório de notificações", () => {
    it.each([
      { cenario: "novo rascunho", uuid: undefined },
      { cenario: "rascunho existente", uuid: formularioUuid },
    ])(
      "salva $cenario antes de gerar o PDF e abre a Central de Downloads",
      async ({ uuid }) => {
        mockFormValues = { ...valoresFormularioPadrao, uuid };
        const uuidGerado = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";
        mockCreateRascunhoFormularioSupervisao.mockResolvedValueOnce({
          status: HTTP_STATUS.CREATED,
          data: { uuid: uuidGerado },
        });

        await solicitarNotificacoes();

        const fecharCentral = await screen.findByRole("button", {
          name: "Fechar Central de Downloads",
        });
        const servicoSalvar = uuid
          ? mockUpdateRascunhoFormularioSupervisao
          : mockCreateRascunhoFormularioSupervisao;
        expect(servicoSalvar).toHaveBeenCalledTimes(1);
        expect(mockExportarNotificacoes).toHaveBeenCalledWith(
          uuid || uuidGerado,
        );
        expect(servicoSalvar.mock.invocationCallOrder[0]).toBeLessThan(
          mockExportarNotificacoes.mock.invocationCallOrder[0],
        );
        expect(
          screen.queryByTestId("modal-salvar-rascunho"),
        ).not.toBeInTheDocument();
        expect(
          screen.queryByRole("button", {
            name: "Confirmar geração das notificações",
          }),
        ).not.toBeInTheDocument();
        expect(mockNavigate).not.toHaveBeenCalled();

        fireEvent.click(fecharCentral);

        expect(mockNavigate).toHaveBeenCalledWith(caminhoPainel);
        expect(
          screen.queryByRole("button", { name: "Fechar Central de Downloads" }),
        ).not.toBeInTheDocument();
      },
    );

    it("fecha a confirmação de download sem salvar ou gerar o PDF", async () => {
      mockValidarCategoriasDeNotificacao.mockReturnValue(
        validacaoComNotificacao,
      );
      await renderizarFormulario();

      fireEvent.click(
        screen.getByRole("button", { name: "Baixar notificações" }),
      );
      fireEvent.click(
        screen.getByRole("button", {
          name: "Cancelar geração das notificações",
        }),
      );

      expect(
        screen.queryByRole("button", {
          name: "Confirmar geração das notificações",
        }),
      ).not.toBeInTheDocument();
      expect(mockCreateRascunhoFormularioSupervisao).not.toHaveBeenCalled();
      expect(mockUpdateRascunhoFormularioSupervisao).not.toHaveBeenCalled();
      expect(mockExportarNotificacoes).not.toHaveBeenCalled();
    });

    it("exibe erro e não abre a Central quando a geração do PDF falha", async () => {
      mockExportarNotificacoes.mockResolvedValueOnce({
        status: HTTP_STATUS.BAD_REQUEST,
        data: { detail: "Não foi possível solicitar o PDF." },
      });

      await solicitarNotificacoes();

      await waitFor(() =>
        expect(mockToastError).toHaveBeenCalledWith(
          "Erro ao solicitar geração de relatório de notificações.",
        ),
      );
      expect(mockExportarNotificacoes).toHaveBeenCalledWith(formularioUuid);
      expect(
        screen.queryByRole("button", { name: "Fechar Central de Downloads" }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", {
          name: "Confirmar geração das notificações",
        }),
      ).not.toBeInTheDocument();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it.each([
      {
        cenario: "criar",
        uuid: undefined,
        servico: mockCreateRascunhoFormularioSupervisao,
      },
      {
        cenario: "atualizar",
        uuid: formularioUuid,
        servico: mockUpdateRascunhoFormularioSupervisao,
      },
    ])(
      "não gera o PDF quando não consegue $cenario o rascunho",
      async ({ cenario, uuid, servico }) => {
        mockFormValues = { ...valoresFormularioPadrao, uuid };
        servico.mockResolvedValueOnce({
          status: HTTP_STATUS.BAD_REQUEST,
          data: { detail: "Não foi possível salvar o rascunho." },
        });

        await solicitarNotificacoes();

        await waitFor(() =>
          expect(mockToastError).toHaveBeenCalledWith(
            `Erro ao ${cenario} rascunho do Relatório de Fiscalização. Tente novamente mais tarde.`,
          ),
        );
        expect(mockExportarNotificacoes).not.toHaveBeenCalled();
        expect(
          screen.queryByRole("button", { name: "Fechar Central de Downloads" }),
        ).not.toBeInTheDocument();
        expect(mockNavigate).not.toHaveBeenCalled();
      },
    );
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

  it("bloqueia o rascunho sem escola mesmo com a data preenchida", () => {
    mockFormValues = { data: "01/07/2026" };

    render(<NovoRelatorioVisitas />);

    fireEvent.click(screen.getByRole("button", { name: "Salvar rascunho" }));

    expect(mockToastError).toHaveBeenCalledWith(
      "Os campos unidade educacional e data da visita são obrigatórios para salvar um rascunho.",
    );
    expect(
      screen.queryByTestId("modal-salvar-rascunho"),
    ).not.toBeInTheDocument();
    expect(mockCreateRascunhoFormularioSupervisao).not.toHaveBeenCalled();
    expect(mockUpdateRascunhoFormularioSupervisao).not.toHaveBeenCalled();
    expect(mockToastSuccess).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("bloqueia o rascunho sem data mesmo com a escola preenchida", () => {
    mockFormValues = { escola: escolaUuid };

    render(<NovoRelatorioVisitas />);

    fireEvent.click(screen.getByRole("button", { name: "Salvar rascunho" }));

    expect(mockToastError).toHaveBeenCalledWith(
      "Os campos unidade educacional e data da visita são obrigatórios para salvar um rascunho.",
    );
    expect(
      screen.queryByTestId("modal-salvar-rascunho"),
    ).not.toBeInTheDocument();
    expect(mockCreateRascunhoFormularioSupervisao).not.toHaveBeenCalled();
    expect(mockUpdateRascunhoFormularioSupervisao).not.toHaveBeenCalled();
    expect(mockToastSuccess).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
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

  it("cria um novo rascunho após confirmar e retorna ao painel", async () => {
    const valoresRascunho = {
      escola: escolaUuid,
      diretoria_regional: "99999999-9999-4999-8999-999999999999",
      data: "01/07/2026",
      lote: "LOTE 01",
      terceirizada: "Empresa de teste",
      total_matriculados_por_data: 100,
      maior_frequencia_no_periodo: 100,
      acompanhou_visita: "nao",
      anexos: [],
      notificacoes_assinadas: [],
    };
    const payloadRascunho = {
      ...valoresRascunho,
      acompanhou_visita: false,
      ocorrencias: [],
      ocorrencias_nao_se_aplica: [],
    };
    mockFormValues = valoresRascunho;
    mockFormataPayload.mockReturnValueOnce(payloadRascunho);
    mockCreateRascunhoFormularioSupervisao.mockResolvedValueOnce({
      status: HTTP_STATUS.CREATED,
      data: { ...payloadRascunho, uuid: formularioUuid },
    });

    await renderizarFormulario();

    fireEvent.click(screen.getByRole("button", { name: "Salvar rascunho" }));

    expect(screen.getByTestId("modal-salvar-rascunho")).toBeInTheDocument();
    expect(mockCreateRascunhoFormularioSupervisao).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Confirmar salvamento do rascunho",
      }),
    );

    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith(
        "/supervisao/terceirizadas/painel-relatorios-fiscalizacao",
      ),
    );

    expect(mockFormataPayload).toHaveBeenCalledWith(
      valoresRascunho,
      expect.objectContaining({ uuid: escolaUuid, edital: editalUuid }),
      [],
      [],
    );
    expect(mockCreateRascunhoFormularioSupervisao).toHaveBeenCalledTimes(1);
    expect(mockCreateRascunhoFormularioSupervisao).toHaveBeenCalledWith(
      payloadRascunho,
    );
    expect(mockUpdateRascunhoFormularioSupervisao).not.toHaveBeenCalled();
    expect(mockToastSuccess).toHaveBeenCalledWith(
      "Rascunho do Relatório de Fiscalização salvo com sucesso!",
    );
    expect(mockToastError).not.toHaveBeenCalled();
  });

  it("exibe erro e permanece na tela quando a criação do rascunho falha", async () => {
    const valoresRascunho = {
      escola: escolaUuid,
      diretoria_regional: "99999999-9999-4999-8999-999999999999",
      data: "01/07/2026",
      lote: "LOTE 01",
      terceirizada: "Empresa de teste",
      total_matriculados_por_data: 100,
      maior_frequencia_no_periodo: 100,
      acompanhou_visita: "nao",
      anexos: [],
      notificacoes_assinadas: [],
    };
    const payloadRascunho = {
      ...valoresRascunho,
      acompanhou_visita: false,
      ocorrencias: [],
      ocorrencias_nao_se_aplica: [],
    };
    mockFormValues = valoresRascunho;
    mockFormataPayload.mockReturnValueOnce(payloadRascunho);
    mockCreateRascunhoFormularioSupervisao.mockResolvedValueOnce({
      status: HTTP_STATUS.BAD_REQUEST,
      data: { detail: "Dados do relatório inválidos." },
    });

    await renderizarFormulario();

    fireEvent.click(screen.getByRole("button", { name: "Salvar rascunho" }));
    fireEvent.click(
      screen.getByRole("button", {
        name: "Confirmar salvamento do rascunho",
      }),
    );

    await waitFor(() =>
      expect(mockToastError).toHaveBeenCalledWith(
        "Erro ao criar rascunho do Relatório de Fiscalização. Tente novamente mais tarde.",
      ),
    );

    expect(mockCreateRascunhoFormularioSupervisao).toHaveBeenCalledTimes(1);
    expect(mockCreateRascunhoFormularioSupervisao).toHaveBeenCalledWith(
      payloadRascunho,
    );
    expect(mockUpdateRascunhoFormularioSupervisao).not.toHaveBeenCalled();
    expect(mockToastSuccess).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("atualiza um rascunho existente após a confirmação", async () => {
    mockFormValues = {
      uuid: formularioUuid,
      escola: escolaUuid,
      data: "2026-07-01",
    };

    mockFormataPayloadUpdate.mockReturnValue(payloadUpdateMock as any);

    mockUpdateRascunhoFormularioSupervisao.mockResolvedValue({
      status: HTTP_STATUS.OK,
      data: {},
    } as any);

    render(<NovoRelatorioVisitas />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Salvar rascunho",
      }),
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Confirmar salvamento do rascunho",
      }),
    );

    await waitFor(() => {
      expect(mockUpdateRascunhoFormularioSupervisao).toHaveBeenCalledWith(
        payloadUpdateMock,
      );
    });

    expect(mockFormataPayloadUpdate).toHaveBeenCalled();

    expect(mockToastSuccess).toHaveBeenCalledWith(
      "Rascunho do Relatório de Fiscalização salvo com sucesso!",
    );

    expect(mockNavigate).toHaveBeenCalled();
  });

  it("exibe erro quando não consegue atualizar o rascunho", async () => {
    mockFormValues = {
      uuid: formularioUuid,
      escola: escolaUuid,
      data: "2026-07-01",
    };

    mockFormataPayloadUpdate.mockReturnValue(payloadUpdateMock as any);

    mockUpdateRascunhoFormularioSupervisao.mockResolvedValue({
      status: HTTP_STATUS.BAD_REQUEST,
      data: {},
    } as any);

    render(<NovoRelatorioVisitas />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Salvar rascunho",
      }),
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Confirmar salvamento do rascunho",
      }),
    );

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith(
        "Erro ao atualizar rascunho do Relatório de Fiscalização. Tente novamente mais tarde.",
      );
    });

    expect(mockToastSuccess).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
