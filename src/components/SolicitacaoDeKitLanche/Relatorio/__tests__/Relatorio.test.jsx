import "@testing-library/jest-dom";
import React from "react";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import HTTP_STATUS from "http-status-codes";
import Relatorio from "../index";
import CorpoRelatorio from "../componentes/CorpoRelatorio";
import { getDetalheKitLancheAvulsa } from "src/services/kitLanche";
import { meusDados } from "src/services/perfil.service";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import { TIPO_PERFIL, statusEnum } from "src/constants/shared";
import { CODAE } from "src/configs/constants";
import { visualizaBotoesDoFluxo } from "src/helpers/utilities";

const UUID_SOLICITACAO = "00000000-0000-4000-8000-000000000001";
const TIPO_SOLICITACAO = "solicitacao-normal";
const URL_RELATORIO = `/solicitacao-de-kit-lanche/relatorio?uuid=${UUID_SOLICITACAO}&ehInclusaoContinua=false&tipoSolicitacao=${TIPO_SOLICITACAO}&card=undefined`;

jest.mock("react-final-form", () => ({
  Form: ({ onSubmit, render }) =>
    render({
      handleSubmit: (event) => {
        event?.preventDefault?.();
        return onSubmit();
      },
    }),
}));

jest.mock("src/components/Shareable/Botao", () => ({
  Botao: ({ texto, onClick, type, className }) => (
    <button type={type || "button"} onClick={onClick} className={className}>
      {texto}
    </button>
  ),
}));

jest.mock("src/components/Shareable/Botao/constants", () => ({
  BUTTON_STYLE: {
    GREEN: "green",
    GREEN_OUTLINE: "green-outline",
  },
  BUTTON_TYPE: {
    BUTTON: "button",
  },
}));

jest.mock("src/services/kitLanche", () => ({
  getDetalheKitLancheAvulsa: jest.fn(),
}));

jest.mock("src/services/perfil.service", () => ({
  meusDados: jest.fn(),
}));

jest.mock("src/helpers/utilities", () => ({
  deepCopy: jest.fn((value) => JSON.parse(JSON.stringify(value))),
  visualizaBotoesDoFluxo: jest.fn(() => false),
  prazoDoPedidoMensagem: jest.fn(() => "Prazo calculado"),
  ehUsuarioEmpresa: jest.fn(() => false),
}));

jest.mock("src/components/Shareable/Toast/dialogs", () => ({
  toastSuccess: jest.fn(),
  toastError: jest.fn(),
}));

jest.mock(
  "src/components/SolicitacaoDeKitLanche/Relatorio/componentes/CorpoRelatorio",
  () => ({
    __esModule: true,
    default: jest.fn(({ prazoDoPedidoMensagem }) => (
      <div data-testid="corpo-relatorio">{prazoDoPedidoMensagem}</div>
    )),
  }),
);

jest.mock("src/components/Shareable/RelatorioHistoricoQuestionamento", () => ({
  __esModule: true,
  default: () => <div data-testid="historico-questionamento" />,
}));

jest.mock(
  "src/components/Shareable/RelatorioHistoricoJustificativaEscola",
  () => ({
    __esModule: true,
    default: () => <div data-testid="historico-justificativa" />,
  }),
);

jest.mock("src/components/Shareable/ModalMarcarConferencia", () => ({
  __esModule: true,
  default: ({ showModal, closeModal, onMarcarConferencia, endpoint }) =>
    showModal ? (
      <div data-testid="modal-marcar-conferencia">
        <span>{endpoint}</span>
        <button type="button" onClick={closeModal}>
          Fechar conferência
        </button>
        <button type="button" onClick={onMarcarConferencia}>
          Confirmar conferência
        </button>
      </div>
    ) : null,
}));

jest.mock("src/components/Shareable/ModalAutorizarAposQuestionamento", () => ({
  __esModule: true,
  default: ({ showModal, closeModal }) =>
    showModal ? (
      <div data-testid="modal-autorizar">
        <button type="button" onClick={closeModal}>
          Fechar autorização
        </button>
      </div>
    ) : null,
}));

jest.mock("src/components/Shareable/ModalAprovarGenericoSimOpcional", () => ({
  ModalAprovarGenericoSimOpcional: ({ showModal, closeModal }) =>
    showModal ? (
      <div data-testid="modal-observacao-codae">
        <button type="button" onClick={closeModal}>
          Fechar observação CODAE
        </button>
      </div>
    ) : null,
}));

const ModalNaoAprovaMock = ({
  showModal,
  closeModal,
  resposta_sim_nao,
  uuid,
  tipoSolicitacao,
}) =>
  showModal ? (
    <div data-testid="modal-nao-aprova">
      <span>{resposta_sim_nao}</span>
      <span>{uuid}</span>
      <span>{tipoSolicitacao}</span>
      <button type="button" onClick={closeModal}>
        Fechar não aprova
      </button>
    </div>
  ) : null;

const ModalQuestionamentoMock = ({
  showModal,
  closeModal,
  resposta_sim_nao,
  uuid,
  tipoSolicitacao,
}) =>
  showModal ? (
    <div data-testid="modal-questionamento">
      <span>{resposta_sim_nao}</span>
      <span>{uuid}</span>
      <span>{tipoSolicitacao}</span>
      <button type="button" onClick={closeModal}>
        Fechar questionamento
      </button>
    </div>
  ) : null;

const makeSolicitacao = (overrides = {}) => ({
  uuid: UUID_SOLICITACAO,
  id_externo: "12345",
  prioridade: "REGULAR",
  status: statusEnum.DRE_VALIDADO,
  terceirizada_conferiu_gestao: false,
  solicitacoes_similares: [{ uuid: "similar-1" }],
  logs: [
    {
      status_evento_explicacao: "Outro status",
      resposta_sim_nao: true,
    },
  ],
  ...overrides,
});

const makeProps = (overrides = {}) => ({
  visao: CODAE,
  motivo_cancelamento: "Motivo cancelamento",
  endpointAprovaSolicitacao: jest.fn().mockResolvedValue({
    status: HTTP_STATUS.OK,
  }),
  motivosDREnaoValida: [],
  justificativa: "Justificativa teste",
  textoBotaoNaoAprova: "Não aprovar",
  textoBotaoAprova: "Aprovar",
  endpointNaoAprovaSolicitacao: "endpoint-nao-aprova",
  endpointQuestionamento: "endpoint-questionamento",
  ModalNaoAprova: ModalNaoAprovaMock,
  ModalQuestionamento: ModalQuestionamentoMock,
  handleSubmit: jest.fn(),
  toastAprovaMensagem: "Solicitação aprovada com sucesso",
  toastAprovaMensagemErro: "Erro ao aprovar solicitação",
  ...overrides,
});

const renderRelatorio = (props = {}) => {
  return render(<Relatorio {...makeProps(props)} />);
};

describe("Relatorio", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    localStorage.setItem("tipo_perfil", TIPO_PERFIL.CODAE);

    window.history.pushState({}, "", URL_RELATORIO);

    visualizaBotoesDoFluxo.mockReturnValue(false);
    meusDados.mockResolvedValue({ nome: "Usuário teste" });
    getDetalheKitLancheAvulsa.mockResolvedValue(makeSolicitacao());
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("renderiza o estado de carregamento inicial", () => {
    meusDados.mockReturnValue(new Promise(() => {}));
    getDetalheKitLancheAvulsa.mockReturnValue(new Promise(() => {}));

    renderRelatorio();

    expect(screen.getByText("Carregando...")).toBeInTheDocument();
  });

  it("busca os dados do usuário e o detalhe da solicitação usando os parâmetros da URL", async () => {
    renderRelatorio();

    await screen.findByText("Kit Lanche Passeio - Solicitação # 12345");

    expect(meusDados).toHaveBeenCalledTimes(1);
    expect(getDetalheKitLancheAvulsa).toHaveBeenCalledWith(
      UUID_SOLICITACAO,
      TIPO_SOLICITACAO,
    );
  });

  it("formata as solicitações similares com collapsed true e envia para o CorpoRelatorio", async () => {
    renderRelatorio();

    await screen.findByText("Kit Lanche Passeio - Solicitação # 12345");

    expect(CorpoRelatorio).toHaveBeenCalled();

    const corpoRelatorioProps = CorpoRelatorio.mock.calls[0][0];

    expect(corpoRelatorioProps.prazoDoPedidoMensagem).toBe("Prazo calculado");
    expect(corpoRelatorioProps.tipoSolicitacao).toBe(TIPO_SOLICITACAO);
    expect(corpoRelatorioProps.solicitacoesSimilares).toEqual([
      expect.objectContaining({
        uuid: "similar-1",
        collapsed: true,
      }),
    ]);
  });

  it("exibe toast de erro quando não consegue carregar os dados do usuário", async () => {
    meusDados.mockResolvedValue(null);

    renderRelatorio();

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith(
        "Erro ao carregar dados do usuário",
      );
    });
  });

  it("não busca o detalhe da solicitação quando uuid e tipoSolicitacao não existem na URL", async () => {
    window.history.pushState({}, "", "/solicitacao-de-kit-lanche/relatorio");

    renderRelatorio();

    await waitFor(() => {
      expect(meusDados).toHaveBeenCalledTimes(1);
    });

    expect(getDetalheKitLancheAvulsa).not.toHaveBeenCalled();
    expect(screen.getByText("Carregando...")).toBeInTheDocument();
  });

  it("abre e fecha o modal de questionamento", async () => {
    visualizaBotoesDoFluxo.mockReturnValue(true);
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.TERCEIRIZADA);

    getDetalheKitLancheAvulsa.mockResolvedValue(
      makeSolicitacao({
        prioridade: "ALTA",
        status: statusEnum.DRE_VALIDADO,
      }),
    );

    renderRelatorio();

    await screen.findByText("Kit Lanche Passeio - Solicitação # 12345");

    fireEvent.click(screen.getByRole("button", { name: "Sim" }));

    const modalQuestionamento = screen.getByTestId("modal-questionamento");

    expect(modalQuestionamento).toBeInTheDocument();
    expect(within(modalQuestionamento).getByText("Sim")).toBeInTheDocument();
    expect(
      within(modalQuestionamento).getByText(UUID_SOLICITACAO),
    ).toBeInTheDocument();
    expect(
      within(modalQuestionamento).getByText(TIPO_SOLICITACAO),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Fechar questionamento" }),
    );

    await waitFor(() => {
      expect(
        screen.queryByTestId("modal-questionamento"),
      ).not.toBeInTheDocument();
    });
  });

  it("abre e fecha o modal de não aprovação", async () => {
    visualizaBotoesDoFluxo.mockReturnValue(true);
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.CODAE);

    renderRelatorio();

    await screen.findByText("Kit Lanche Passeio - Solicitação # 12345");

    fireEvent.click(screen.getByRole("button", { name: "Não aprovar" }));

    const modalNaoAprova = screen.getByTestId("modal-nao-aprova");

    expect(modalNaoAprova).toBeInTheDocument();
    expect(within(modalNaoAprova).getByText("Não")).toBeInTheDocument();
    expect(
      within(modalNaoAprova).getByText(UUID_SOLICITACAO),
    ).toBeInTheDocument();
    expect(
      within(modalNaoAprova).getByText(TIPO_SOLICITACAO),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Fechar não aprova" }));

    await waitFor(() => {
      expect(screen.queryByTestId("modal-nao-aprova")).not.toBeInTheDocument();
    });
  });

  it("abre e fecha o modal de autorização após questionamento", async () => {
    visualizaBotoesDoFluxo.mockReturnValue(true);
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.CODAE);

    getDetalheKitLancheAvulsa.mockResolvedValue(
      makeSolicitacao({
        prioridade: "ALTA",
        status: statusEnum.CODAE_QUESTIONADO,
        logs: [
          {
            status_evento_explicacao: "Outro status",
            resposta_sim_nao: false,
          },
        ],
      }),
    );

    renderRelatorio();

    await screen.findByText("Kit Lanche Passeio - Solicitação # 12345");

    fireEvent.click(screen.getByRole("button", { name: "Aprovar" }));

    expect(screen.getByTestId("modal-autorizar")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Fechar autorização" }));

    await waitFor(() => {
      expect(screen.queryByTestId("modal-autorizar")).not.toBeInTheDocument();
    });
  });

  it("abre e fecha o modal de observação CODAE para gestão alimentação terceirizada", async () => {
    visualizaBotoesDoFluxo.mockReturnValue(true);
    localStorage.setItem(
      "tipo_perfil",
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
    );

    getDetalheKitLancheAvulsa.mockResolvedValue(
      makeSolicitacao({
        prioridade: "REGULAR",
        status: statusEnum.CODAE_AUTORIZADO,
      }),
    );

    renderRelatorio();

    await screen.findByText("Kit Lanche Passeio - Solicitação # 12345");

    fireEvent.click(screen.getByRole("button", { name: "Aprovar" }));

    expect(screen.getByTestId("modal-observacao-codae")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Fechar observação CODAE" }),
    );

    await waitFor(() => {
      expect(
        screen.queryByTestId("modal-observacao-codae"),
      ).not.toBeInTheDocument();
    });
  });

  it("aprova a solicitação e recarrega os dados quando a API retorna sucesso", async () => {
    visualizaBotoesDoFluxo.mockReturnValue(true);

    const endpointAprovaSolicitacao = jest.fn().mockResolvedValue({
      status: HTTP_STATUS.OK,
    });

    renderRelatorio({ endpointAprovaSolicitacao });

    await screen.findByText("Kit Lanche Passeio - Solicitação # 12345");

    fireEvent.click(screen.getByRole("button", { name: "Aprovar" }));

    await waitFor(() => {
      expect(endpointAprovaSolicitacao).toHaveBeenCalledWith(
        UUID_SOLICITACAO,
        "Justificativa teste",
        TIPO_SOLICITACAO,
      );
    });

    expect(toastSuccess).toHaveBeenCalledWith(
      "Solicitação aprovada com sucesso",
    );

    expect(getDetalheKitLancheAvulsa).toHaveBeenCalledTimes(2);
  });

  it("exibe erro ao tentar aprovar quando a API retorna bad request", async () => {
    visualizaBotoesDoFluxo.mockReturnValue(true);

    const endpointAprovaSolicitacao = jest.fn().mockResolvedValue({
      status: HTTP_STATUS.BAD_REQUEST,
    });

    renderRelatorio({ endpointAprovaSolicitacao });

    await screen.findByText("Kit Lanche Passeio - Solicitação # 12345");

    fireEvent.click(screen.getByRole("button", { name: "Aprovar" }));

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith("Erro ao aprovar solicitação");
    });
  });

  it("exibe erro ao tentar aprovar quando a chamada da API falha", async () => {
    visualizaBotoesDoFluxo.mockReturnValue(true);

    const endpointAprovaSolicitacao = jest.fn().mockRejectedValue();

    renderRelatorio({ endpointAprovaSolicitacao });

    await screen.findByText("Kit Lanche Passeio - Solicitação # 12345");

    fireEvent.click(screen.getByRole("button", { name: "Aprovar" }));

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith("Erro ao aprovar solicitação");
    });
  });
});
