import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";

import { MeusDadosContext } from "../../../../../context/MeusDadosContext";
import { RegistrarNovaOcorrencia } from "../index";

const mockNavigate = jest.fn();
const mockGetTiposOcorrencia = jest.fn();
const mockBuscarOcorrencia = jest.fn();
const mockAtualizarOcorrencia = jest.fn();
const mockExcluirOcorrencia = jest.fn();
const mockCreateFormularioDiretor = jest.fn();
const mockFormataPayload = jest.fn();
const mockFormataPayloadEdicao = jest.fn();
const mockGetUrlListaOcorrencias = jest.fn();
const mockToastSuccess = jest.fn();
const mockToastError = jest.fn();

const mockBotao = jest.fn();
const mockSpin = jest.fn();
const mockForm = jest.fn();
const mockFieldArray = jest.fn();
const mockSeletorCategoria = jest.fn();
const mockSeletorTipoOcorrencia = jest.fn();
const mockSeletorDeDatas = jest.fn();
const mockRenderParametrizacao = jest.fn();
const mockAdicionarResposta = jest.fn();
const mockModalCancelar = jest.fn();
const mockModalSalvar = jest.fn();
const mockModalCancelarEdicao = jest.fn();
const mockModalExcluirEdicao = jest.fn();
const mockModalSalvarEdicao = jest.fn();

const mockPush = jest.fn();
const mockFormChange = jest.fn();
const mockFormGetState = jest.fn();
const mockFormReset = jest.fn();

const EDITAL_UUID = "11111111-1111-4111-8111-111111111111";

const SOLICITACAO_UUID = "22222222-2222-4222-8222-222222222222";

const ESCOLA_UUID = "33333333-3333-4333-8333-333333333333";

const CATEGORIA_UUID = "44444444-4444-4444-8444-444444444444";

const TIPO_OCORRENCIA_UUID = "55555555-5555-4555-8555-555555555555";

const OCORRENCIA_UUID = "88888888-8888-4888-8888-888888888888";

const PARAMETRIZACAO_UUID = "66666666-6666-4666-8666-666666666666";

const mockLocation = {
  state: {
    editalUuid: EDITAL_UUID,
    solicitacaoMedicaoInicialUuid: SOLICITACAO_UUID,
    mes: "6",
    ano: "2024",
  },
};

let mockFormValues: Record<string, any>;

const mockFormApi = {
  getState: mockFormGetState,
  change: mockFormChange,
  reset: mockFormReset,
  mutators: {
    push: mockPush,
  },
};

const categoria = {
  nome: "Higiene e organização",
  uuid: CATEGORIA_UUID,
};

const tipoOcorrenciaSelecionado = {
  uuid: TIPO_OCORRENCIA_UUID,
  titulo: "Falha na higienização",
  descricao: "Ambiente sem a higienização adequada.",
  categoria,
  aceita_multiplas_respostas: true,
  penalidade: {
    numero_clausula: "1.2",
    obrigacoes: [10, 20],
  },
  parametrizacoes: [
    {
      uuid: PARAMETRIZACAO_UUID,
      nome: "Descrição da ocorrência",
    },
  ],
};

const segundoTipoOcorrencia = {
  ...tipoOcorrenciaSelecionado,
  uuid: "77777777-7777-4777-8777-777777777777",
  titulo: "Falha no armazenamento",
};

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
}));

jest.mock("src/services/imr/relatorioFiscalizacaoTerceirizadas", () => ({
  getTiposOcorrenciaPorEditalDiretor: (params: Record<string, any>) =>
    mockGetTiposOcorrencia(params),

  buscarOcorrenciaDiretor: (params: Record<string, any>) =>
    mockBuscarOcorrencia(params),

  atualizarOcorrenciaDiretor: (params: Record<string, any>) =>
    mockAtualizarOcorrencia(params),

  excluirOcorrenciaDiretor: (params: Record<string, any>) =>
    mockExcluirOcorrencia(params),

  createFormularioDiretor: (payload: Record<string, any>) =>
    mockCreateFormularioDiretor(payload),
}));

jest.mock("src/components/Shareable/Toast/dialogs", () => ({
  toastSuccess: (mensagem: string) => mockToastSuccess(mensagem),

  toastError: (mensagem: string) => mockToastError(mensagem),
}));

jest.mock("src/components/Shareable/Botao", () => ({
  __esModule: true,
  default: (props: any) => mockBotao(props),
}));

jest.mock("src/components/Shareable/Botao/constants", () => ({
  BUTTON_ICON: {
    TRASH: "trash",
  },
  BUTTON_STYLE: {
    GREEN_OUTLINE: "green-outline",
  },
  BUTTON_TYPE: {
    BUTTON: "button",
    SUBMIT: "submit",
  },
}));

jest.mock("antd", () => ({
  Spin: (props: any) => mockSpin(props),
}));

jest.mock("final-form-arrays", () => ({
  __esModule: true,
  default: {},
}));

jest.mock("react-final-form", () => ({
  Form: (props: any) => mockForm(props),
}));

jest.mock("react-final-form-arrays", () => ({
  FieldArray: (props: any) => mockFieldArray(props),
}));

jest.mock("../components/SeletorCategoria", () => ({
  SeletorCategoria: (props: any) => mockSeletorCategoria(props),
}));

jest.mock("../components/SeletorTipoOcorrencia", () => ({
  SeletorTipoOcorrencia: (props: any) => mockSeletorTipoOcorrencia(props),
}));

jest.mock(
  "../../Terceirizadas/RelatorioFiscalizacaoTerceirizadas/NovoRelatorioVisitas/components/Formulario/components/Ocorrencia/Seletores/SeletorDeDatas",
  () => ({
    SeletorDeDatas: (props: any) => mockSeletorDeDatas(props),
  }),
);

jest.mock(
  "../../Terceirizadas/RelatorioFiscalizacaoTerceirizadas/NovoRelatorioVisitas/components/Formulario/components/Ocorrencia/RenderComponentByParametrizacao",
  () => ({
    __esModule: true,
    default: (props: any) => mockRenderParametrizacao(props),
  }),
);

jest.mock(
  "../../Terceirizadas/RelatorioFiscalizacaoTerceirizadas/NovoRelatorioVisitas/components/Formulario/components/BotaoAdicionar",
  () => ({
    AdicionarResposta: (props: any) => mockAdicionarResposta(props),
  }),
);

jest.mock("../components/ModalCancelaPreenchimento", () => ({
  ModalCancelaPreenchimento: (props: any) => mockModalCancelar(props),
}));

jest.mock("../components/ModalSalvar", () => ({
  ModalSalvar: (props: any) => mockModalSalvar(props),
}));

jest.mock("../components/ModalCancelarEdicao", () => ({
  ModalCancelarEdicao: (props: any) => mockModalCancelarEdicao(props),
}));

jest.mock("../components/ModalExcluirEdicao", () => ({
  ModalExcluirEdicao: (props: any) => mockModalExcluirEdicao(props),
}));

jest.mock("../components/ModalSalvarEdicao", () => ({
  ModalSalvarEdicao: (props: any) => mockModalSalvarEdicao(props),
}));

jest.mock("../helpers", () => ({
  ...jest.requireActual("../helpers"),
  formataPayload: (values: Record<string, any>, solicitacaoUuid: string) =>
    mockFormataPayload(values, solicitacaoUuid),
  formataPayloadEdicao: (
    values: Record<string, any>,
    tipoOcorrenciaUuid: string,
    grupo: number,
  ) => mockFormataPayloadEdicao(values, tipoOcorrenciaUuid, grupo),
  getUrlListaOcorrencias: (parametros: Record<string, any>) =>
    mockGetUrlListaOcorrencias(parametros),
}));

const meusDadosMock = {
  vinculo_atual: {
    instituicao: {
      uuid: ESCOLA_UUID,
    },
  },
};

const renderizarComponente = (props: Record<string, any> = {}) =>
  render(
    <MeusDadosContext.Provider
      value={
        {
          meusDados: meusDadosMock,
        } as any
      }
    >
      <RegistrarNovaOcorrencia {...props} />
    </MeusDadosContext.Provider>,
  );

const selecionarTipoOcorrencia = async () => {
  const botaoSelecionar = await screen.findByRole("button", {
    name: "Selecionar tipo de ocorrência",
  });

  fireEvent.click(botaoSelecionar);
};

describe("RegistrarNovaOcorrencia", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockFormValues = {
      grupos: [{}],
      observacao: "Ocorrência de teste",
    };

    mockFormGetState.mockImplementation(() => ({
      values: mockFormValues,
    }));

    mockFormChange.mockImplementation((campo: string, valor: any) => {
      mockFormValues[campo] = valor;
    });

    mockGetTiposOcorrencia.mockResolvedValue({
      status: 200,
      data: [tipoOcorrenciaSelecionado, segundoTipoOcorrencia],
    });

    mockBuscarOcorrencia.mockResolvedValue({
      status: 200,
      data: {
        uuid: OCORRENCIA_UUID,
        solicitacao_medicao_inicial: SOLICITACAO_UUID,
        data: "10/06/2024",
        categoria,
        tipo_ocorrencia: TIPO_OCORRENCIA_UUID,
        titulo: tipoOcorrenciaSelecionado.titulo,
        descricao: tipoOcorrenciaSelecionado.descricao,
        grupo: 1,
        respostas: [
          {
            uuid: "99999999-9999-4999-8999-999999999999",
            parametrizacao: PARAMETRIZACAO_UUID,
            titulo: "Descrição da ocorrência",
            posicao: 1,
            resposta: "Resposta carregada",
          },
        ],
      },
    });

    mockCreateFormularioDiretor.mockResolvedValue({
      status: 201,
      data: {},
    });

    mockAtualizarOcorrencia.mockResolvedValue({
      status: 200,
      data: {},
    });

    mockExcluirOcorrencia.mockResolvedValue({
      status: 204,
      data: "",
    });

    mockFormataPayload.mockReturnValue({
      ocorrencia: "payload formatado",
    });

    mockFormataPayloadEdicao.mockReturnValue({
      ocorrencia: "payload de edição formatado",
    });

    mockGetUrlListaOcorrencias.mockReturnValue(
      "/lancamento-inicial/lancamento-medicao-inicial/registrar-ocorrencias?ano=2024&mes=6",
    );

    mockSpin.mockImplementation(({ children, spinning }: any) => (
      <div data-testid="carregamento" data-spinning={String(spinning)}>
        {children}
      </div>
    ));

    mockForm.mockImplementation(({ children, onSubmit }: any) =>
      children({
        handleSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event?.preventDefault();

          return onSubmit(mockFormValues);
        },
        form: mockFormApi,
        submitting: false,
      }),
    );

    mockFieldArray.mockImplementation(({ children }: any) =>
      children({
        fields: {
          map: (callback: any) =>
            mockFormValues.grupos.map((_grupo: any, index: number) =>
              callback(`grupos[${index}]`, index),
            ),
        },
      }),
    );

    mockBotao.mockImplementation(
      ({ texto, titulo, type, onClick, disabled }: any) => (
        <button
          type={type || "button"}
          aria-label={texto || titulo}
          disabled={disabled}
          onClick={onClick}
        >
          {texto || titulo}
        </button>
      ),
    );

    mockSeletorCategoria.mockImplementation(
      ({ setTiposOcorrenciaDaCategoria }: any) => (
        <div>
          <span>Seletor de categoria</span>

          <button
            type="button"
            onClick={() =>
              setTiposOcorrenciaDaCategoria([tipoOcorrenciaSelecionado])
            }
          >
            Selecionar categoria
          </button>
        </div>
      ),
    );

    mockSeletorTipoOcorrencia.mockImplementation(
      ({ setTipoOcorrencia, tiposOcorrenciaDaCategoria }: any) => (
        <div>
          <span data-testid="quantidade-tipos-categoria">
            {tiposOcorrenciaDaCategoria.length}
          </span>

          <button
            type="button"
            onClick={() => setTipoOcorrencia(tipoOcorrenciaSelecionado)}
          >
            Selecionar tipo de ocorrência
          </button>
        </div>
      ),
    );

    mockSeletorDeDatas.mockImplementation(({ titulo }: any) => (
      <div data-testid="seletor-datas">{titulo}</div>
    ));

    mockRenderParametrizacao.mockImplementation(({ parametrizacao }: any) => (
      <div data-testid="parametrizacao">{parametrizacao.nome}</div>
    ));

    mockAdicionarResposta.mockImplementation(
      ({ push, nameFieldArray }: any) => (
        <button type="button" onClick={() => push(nameFieldArray, {})}>
          Adicionar resposta
        </button>
      ),
    );

    mockModalCancelar.mockImplementation(({ show, handleClose }: any) =>
      show ? (
        <div data-testid="modal-cancelar">
          <span>Modal de cancelamento aberto</span>

          <button type="button" onClick={handleClose}>
            Fechar cancelamento
          </button>
        </div>
      ) : null,
    );

    mockModalSalvar.mockImplementation(
      ({ show, salvar, values, handleClose }: any) =>
        show ? (
          <div data-testid="modal-salvar">
            <button type="button" onClick={() => salvar(values)}>
              Confirmar salvamento
            </button>

            <button type="button" onClick={handleClose}>
              Fechar salvamento
            </button>
          </div>
        ) : null,
    );

    mockModalCancelarEdicao.mockImplementation(
      ({ show, confirmar, handleClose }: any) =>
        show ? (
          <div data-testid="modal-cancelar-edicao">
            <button type="button" onClick={confirmar}>
              Confirmar cancelamento
            </button>

            <button type="button" onClick={handleClose}>
              Fechar cancelamento
            </button>
          </div>
        ) : null,
    );

    mockModalSalvarEdicao.mockImplementation(
      ({ show, salvar, values, handleClose }: any) =>
        show ? (
          <div data-testid="modal-salvar-edicao">
            <button type="button" onClick={() => salvar(values)}>
              Confirmar edição
            </button>

            <button type="button" onClick={handleClose}>
              Fechar edição
            </button>
          </div>
        ) : null,
    );

    mockModalExcluirEdicao.mockImplementation(
      ({ show, excluir, handleClose }: any) =>
        show ? (
          <div data-testid="modal-excluir-edicao">
            <button type="button" onClick={excluir}>
              Confirmar exclusão
            </button>

            <button type="button" onClick={handleClose}>
              Fechar exclusão
            </button>
          </div>
        ) : null,
    );
  });

  it("carrega os tipos de ocorrência e remove categorias duplicadas", async () => {
    renderizarComponente();

    await waitFor(() => {
      expect(mockGetTiposOcorrencia).toHaveBeenCalledWith({
        edital_uuid: EDITAL_UUID,
      });
    });

    expect(await screen.findByText("Seletor de categoria")).toBeInTheDocument();

    const ultimaChamada =
      mockSeletorCategoria.mock.calls[
        mockSeletorCategoria.mock.calls.length - 1
      ][0];

    expect(ultimaChamada.categorias).toEqual([
      {
        nome: "Higiene e organização",
        uuid: CATEGORIA_UUID,
      },
    ]);
  });

  it("atualiza os tipos de ocorrência ao selecionar uma categoria", async () => {
    renderizarComponente();

    expect(
      await screen.findByTestId("quantidade-tipos-categoria"),
    ).toHaveTextContent("0");

    fireEvent.click(
      screen.getByRole("button", {
        name: "Selecionar categoria",
      }),
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("quantidade-tipos-categoria"),
      ).toHaveTextContent("1");
    });

    const ultimaChamada =
      mockSeletorTipoOcorrencia.mock.calls[
        mockSeletorTipoOcorrencia.mock.calls.length - 1
      ][0];

    expect(ultimaChamada.tiposOcorrenciaDaCategoria).toEqual([
      tipoOcorrenciaSelecionado,
    ]);
  });

  it("define e exibe o tipo de ocorrência selecionado", async () => {
    renderizarComponente();

    await selecionarTipoOcorrencia();

    expect(screen.getByText("Falha na higienização:")).toBeInTheDocument();

    expect(
      screen.getByText("Ambiente sem a higienização adequada."),
    ).toBeInTheDocument();

    expect(screen.getByText(/Penalidade:\s*1\.2/i)).toBeInTheDocument();

    expect(screen.getByTestId("seletor-datas")).toHaveTextContent(
      "Data da Ocorrência",
    );

    expect(screen.getByTestId("parametrizacao")).toHaveTextContent(
      "Descrição da ocorrência",
    );

    expect(
      screen.getByRole("button", {
        name: "Adicionar resposta",
      }),
    ).toBeInTheDocument();
  });

  it("limita a data da ocorrência ao mês e ano da medição", async () => {
    renderizarComponente();

    await selecionarTipoOcorrencia();

    await waitFor(() => {
      expect(mockSeletorDeDatas).toHaveBeenCalled();
    });

    const ultimaChamada =
      mockSeletorDeDatas.mock.calls[
        mockSeletorDeDatas.mock.calls.length - 1
      ][0];

    const hoje = new Date();
    const ontem = new Date(
      hoje.getFullYear(),
      hoje.getMonth(),
      hoje.getDate() - 1,
    );
    const ultimoDiaMes = new Date(2024, 5, 30);

    expect(ultimaChamada.minDate).toEqual(new Date(2024, 5, 1));
    expect(ultimaChamada.maxDate).toEqual(
      ontem < ultimoDiaMes ? ontem : ultimoDiaMes,
    );
  });

  it("monta a escola selecionada com os dados do contexto e do edital", async () => {
    renderizarComponente();

    await selecionarTipoOcorrencia();

    await waitFor(() => {
      expect(mockRenderParametrizacao).toHaveBeenCalled();
    });

    const ultimaChamada =
      mockRenderParametrizacao.mock.calls[
        mockRenderParametrizacao.mock.calls.length - 1
      ][0];

    expect(ultimaChamada.escolaSelecionada).toEqual({
      label: "",
      value: "",
      lote_nome: "",
      terceirizada: "",
      edital: EDITAL_UUID,
      uuid: ESCOLA_UUID,
    });
  });

  it("remove um grupo de resposta pelo índice", async () => {
    const primeiroGrupo = {
      identificador: "grupo-1",
    };

    const segundoGrupo = {
      identificador: "grupo-2",
    };

    mockFormValues = {
      grupos: [primeiroGrupo, segundoGrupo],
      observacao: "Ocorrência de teste",
    };

    renderizarComponente();

    await selecionarTipoOcorrencia();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Excluir",
      }),
    );

    expect(mockFormChange).toHaveBeenCalledWith("grupos", [primeiroGrupo]);

    expect(mockFormValues.grupos).toEqual([primeiroGrupo]);
  });

  it("abre e fecha o modal de cancelamento", async () => {
    renderizarComponente();

    await selecionarTipoOcorrencia();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Cancelar",
      }),
    );

    expect(screen.getByTestId("modal-cancelar")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Fechar cancelamento",
      }),
    );

    expect(screen.queryByTestId("modal-cancelar")).not.toBeInTheDocument();
  });

  it("abre e fecha o modal de salvamento sem enviar a ocorrência", async () => {
    renderizarComponente();

    await selecionarTipoOcorrencia();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Salvar",
      }),
    );

    expect(screen.getByTestId("modal-salvar")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Fechar salvamento",
      }),
    );

    expect(screen.queryByTestId("modal-salvar")).not.toBeInTheDocument();

    expect(mockCreateFormularioDiretor).not.toHaveBeenCalled();
  });

  it("salva a ocorrência após a confirmação do modal", async () => {
    renderizarComponente();

    await selecionarTipoOcorrencia();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Salvar",
      }),
    );

    expect(screen.getByTestId("modal-salvar")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Confirmar salvamento",
      }),
    );

    await waitFor(() => {
      expect(mockFormataPayload).toHaveBeenCalledWith(
        mockFormValues,
        SOLICITACAO_UUID,
      );

      expect(mockCreateFormularioDiretor).toHaveBeenCalledWith({
        ocorrencia: "payload formatado",
      });
    });

    expect(mockToastSuccess).toHaveBeenCalledWith(
      "Registro de Ocorrência realizado com sucesso!",
    );

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it("exibe mensagem de erro quando não consegue salvar", async () => {
    mockCreateFormularioDiretor.mockResolvedValue({
      status: 400,
      data: { detail: "Mensagem retornada pelo back" },
    });

    renderizarComponente();

    await selecionarTipoOcorrencia();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Salvar",
      }),
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Confirmar salvamento",
      }),
    );

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith(
        "Mensagem retornada pelo back",
      );
    });

    expect(mockToastSuccess).not.toHaveBeenCalled();

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("oculta o formulário quando ocorre erro ao carregar os tipos de ocorrência", async () => {
    mockGetTiposOcorrencia.mockResolvedValue({
      status: 500,
      data: [],
    });

    renderizarComponente();

    await waitFor(() => {
      expect(screen.queryByTestId("carregamento")).not.toBeInTheDocument();
    });

    expect(screen.queryByText("Seletor de categoria")).not.toBeInTheDocument();

    expect(
      screen.queryByRole("button", {
        name: "Selecionar tipo de ocorrência",
      }),
    ).not.toBeInTheDocument();
  });

  it("carrega a ocorrência e preenche os valores iniciais na edição", async () => {
    renderizarComponente({
      modoEdicao: true,
      ocorrenciaUuid: OCORRENCIA_UUID,
      tipoOcorrenciaUuid: TIPO_OCORRENCIA_UUID,
      grupo: 1,
      editalUuid: EDITAL_UUID,
      solicitacaoMedicaoInicialUuid: SOLICITACAO_UUID,
      mes: "6",
      ano: "2024",
    });

    await waitFor(() => {
      expect(mockBuscarOcorrencia).toHaveBeenCalledWith({
        uuid: OCORRENCIA_UUID,
        tipo_ocorrencia: TIPO_OCORRENCIA_UUID,
        grupo: 1,
      });
    });

    await waitFor(() => {
      expect(mockForm).toHaveBeenCalled();
    });

    const ultimaChamada =
      mockForm.mock.calls[mockForm.mock.calls.length - 1][0];

    expect(ultimaChamada.initialValues).toEqual({
      categoria: CATEGORIA_UUID,
      tipo_ocorrencia: TIPO_OCORRENCIA_UUID,
      datas: ["10/06/2024"],
      grupos: [
        {
          [`tipoocorrencia_${TIPO_OCORRENCIA_UUID}_parametrizacao_${PARAMETRIZACAO_UUID}_uuid_undefined`]:
            "Resposta carregada",
        },
      ],
    });

    expect(screen.getByText("Falha na higienização:")).toBeInTheDocument();

    const seletorCategoria =
      mockSeletorCategoria.mock.calls[
        mockSeletorCategoria.mock.calls.length - 1
      ][0];
    const seletorTipo =
      mockSeletorTipoOcorrencia.mock.calls[
        mockSeletorTipoOcorrencia.mock.calls.length - 1
      ][0];

    expect(seletorCategoria.disabled).toBe(true);
    expect(seletorTipo.disabled).toBe(true);
  });

  it("exibe carregamento enquanto os dados da ocorrência não são retornados", async () => {
    mockBuscarOcorrencia.mockReturnValue(new Promise(() => {}));

    renderizarComponente({
      modoEdicao: true,
      ocorrenciaUuid: OCORRENCIA_UUID,
      tipoOcorrenciaUuid: TIPO_OCORRENCIA_UUID,
      grupo: 1,
      editalUuid: EDITAL_UUID,
      solicitacaoMedicaoInicialUuid: SOLICITACAO_UUID,
      mes: "6",
      ano: "2024",
    });

    await waitFor(() => {
      const ultimaChamada =
        mockSpin.mock.calls[mockSpin.mock.calls.length - 1][0];
      expect(ultimaChamada.spinning).toBe(true);
    });
  });

  it("exibe os botões de cancelar e salvar na edição", async () => {
    renderizarComponente({
      modoEdicao: true,
      ocorrenciaUuid: OCORRENCIA_UUID,
      tipoOcorrenciaUuid: TIPO_OCORRENCIA_UUID,
      grupo: 1,
      editalUuid: EDITAL_UUID,
      solicitacaoMedicaoInicialUuid: SOLICITACAO_UUID,
      mes: "6",
      ano: "2024",
    });

    await screen.findByText("Seletor de categoria");

    expect(
      screen.getByRole("button", { name: "Cancelar" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Excluir Registro" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Salvar" })).toBeInTheDocument();
  });

  it("informa erro ao tentar carregar ocorrência de outra escola", async () => {
    mockBuscarOcorrencia.mockResolvedValue({
      status: 403,
      data: {},
    });

    renderizarComponente({
      modoEdicao: true,
      ocorrenciaUuid: OCORRENCIA_UUID,
      tipoOcorrenciaUuid: TIPO_OCORRENCIA_UUID,
      grupo: 1,
      editalUuid: EDITAL_UUID,
      solicitacaoMedicaoInicialUuid: SOLICITACAO_UUID,
      mes: "6",
      ano: "2024",
    });

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith(
        "Você não tem permissão para editar a ocorrência desta unidade educacional.",
      );
    });
  });

  const propsEdicao = {
    modoEdicao: true,
    ocorrenciaUuid: OCORRENCIA_UUID,
    tipoOcorrenciaUuid: TIPO_OCORRENCIA_UUID,
    grupo: 1,
    editalUuid: EDITAL_UUID,
    solicitacaoMedicaoInicialUuid: SOLICITACAO_UUID,
    mes: "6",
    ano: "2024",
  };

  const URL_LISTA_OCORRENCIAS =
    "/lancamento-inicial/lancamento-medicao-inicial/registrar-ocorrencias?ano=2024&mes=6";

  it("abre o modal de cancelamento e retorna à listagem somente ao confirmar", async () => {
    renderizarComponente(propsEdicao);

    await screen.findByText("Seletor de categoria");

    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(screen.getByTestId("modal-cancelar-edicao")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Fechar cancelamento" }),
    );

    expect(
      screen.queryByTestId("modal-cancelar-edicao"),
    ).not.toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    fireEvent.click(
      screen.getByRole("button", { name: "Confirmar cancelamento" }),
    );

    expect(mockFormReset).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith(URL_LISTA_OCORRENCIAS);
  });

  it("abre o modal de salvar e atualiza a ocorrência ao confirmar", async () => {
    renderizarComponente(propsEdicao);

    await screen.findByText("Seletor de categoria");

    fireEvent.click(screen.getByRole("button", { name: "Salvar" }));

    expect(screen.getByTestId("modal-salvar-edicao")).toBeInTheDocument();
    expect(mockAtualizarOcorrencia).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Confirmar edição" }));

    await waitFor(() => {
      expect(mockFormataPayloadEdicao).toHaveBeenCalledWith(
        mockFormValues,
        TIPO_OCORRENCIA_UUID,
        1,
      );
      expect(mockAtualizarOcorrencia).toHaveBeenCalledWith({
        uuid: OCORRENCIA_UUID,
        ocorrencia: "payload de edição formatado",
      });
    });

    expect(mockToastSuccess).toHaveBeenCalledWith(
      "Edição da Ocorrência realizada com sucesso!",
    );
    expect(mockNavigate).toHaveBeenCalledWith(URL_LISTA_OCORRENCIAS);
  });

  it("não atualiza a ocorrência quando o modal de salvar é fechado", async () => {
    renderizarComponente(propsEdicao);

    await screen.findByText("Seletor de categoria");

    fireEvent.click(screen.getByRole("button", { name: "Salvar" }));
    fireEvent.click(screen.getByRole("button", { name: "Fechar edição" }));

    expect(mockAtualizarOcorrencia).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(mockToastSuccess).not.toHaveBeenCalled();
  });

  it("informa erro quando não consegue salvar a edição", async () => {
    mockAtualizarOcorrencia.mockResolvedValue({
      status: 400,
      data: { detail: "Mensagem retornada pelo back" },
    });

    renderizarComponente(propsEdicao);

    await screen.findByText("Seletor de categoria");

    fireEvent.click(screen.getByRole("button", { name: "Salvar" }));
    fireEvent.click(screen.getByRole("button", { name: "Confirmar edição" }));

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith(
        "Mensagem retornada pelo back",
      );
    });

    expect(mockToastSuccess).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("abre o modal de exclusão e exclui a ocorrência somente ao confirmar", async () => {
    renderizarComponente(propsEdicao);

    await screen.findByText("Seletor de categoria");

    fireEvent.click(screen.getByRole("button", { name: "Excluir Registro" }));

    expect(screen.getByTestId("modal-excluir-edicao")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Fechar exclusão" }));

    expect(
      screen.queryByTestId("modal-excluir-edicao"),
    ).not.toBeInTheDocument();
    expect(mockExcluirOcorrencia).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Excluir Registro" }));
    fireEvent.click(screen.getByRole("button", { name: "Confirmar exclusão" }));

    await waitFor(() => {
      expect(mockExcluirOcorrencia).toHaveBeenCalledWith({
        uuid: OCORRENCIA_UUID,
        tipo_ocorrencia: TIPO_OCORRENCIA_UUID,
        grupo: 1,
      });
    });

    expect(mockToastSuccess).toHaveBeenCalledWith(
      "Registro de Ocorrência excluído com sucesso!",
    );
    expect(mockNavigate).toHaveBeenCalledWith(URL_LISTA_OCORRENCIAS);
  });

  it("informa erro quando não consegue excluir a ocorrência", async () => {
    mockExcluirOcorrencia.mockResolvedValue({
      status: 400,
      data: { detail: "Mensagem retornada pelo back" },
    });

    renderizarComponente(propsEdicao);

    await screen.findByText("Seletor de categoria");

    fireEvent.click(screen.getByRole("button", { name: "Excluir Registro" }));
    fireEvent.click(screen.getByRole("button", { name: "Confirmar exclusão" }));

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith(
        "Mensagem retornada pelo back",
      );
    });

    expect(mockToastSuccess).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
