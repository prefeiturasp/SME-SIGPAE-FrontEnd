import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";

import { BotoesGPCODAE } from "../BotoesGPCODAE";
import {
  CODAECancelaSoliticaoCorrecao,
  CODAENaoHomologaProduto,
  CODAEPedeAnaliseSensorialProduto,
  CODAEPedeCorrecao,
} from "src/services/produto.service";

const mockModalPadrao = jest.fn(() => <div data-testid="modal-padrao" />);
const mockModalVincularEditais = jest.fn(() => (
  <div data-testid="modal-vincular-editais" />
));
const mockModalAtivacaoSuspensaoProduto = jest.fn(() => (
  <div data-testid="modal-ativacao-suspensao" />
));

jest.mock("src/components/Shareable/Botao", () => ({
  __esModule: true,
  default: ({ disabled, onClick, texto }) => (
    <button type="button" disabled={disabled} onClick={onClick}>
      {texto}
    </button>
  ),
}));

jest.mock("src/components/Shareable/ModalPadrao", () => ({
  ModalPadrao: (props) => mockModalPadrao(props),
}));

jest.mock("../ModelVincularEditais", () => ({
  ModalVincularEditais: (props) => mockModalVincularEditais(props),
}));

jest.mock(
  "src/components/screens/Produto/AtivacaoSuspensao/ModalAtivacaoSuspensaoProduto",
  () => ({
    __esModule: true,
    default: (props) => mockModalAtivacaoSuspensaoProduto(props),
  }),
);

jest.mock("src/services/produto.service", () => ({
  CODAECancelaSoliticaoCorrecao: jest.fn(),
  CODAENaoHomologaProduto: jest.fn(),
  CODAEPedeAnaliseSensorialProduto: jest.fn(),
  CODAEPedeCorrecao: jest.fn(),
}));

describe("BotoesGPCODAE", () => {
  const uuidHomologacao = "7b539b9a-b9f5-485f-85d3-fce356cd8960";
  const uuidProduto = "36b34a8b-6635-4d30-b67d-bd2b90930231";
  const uuidEdital = "5e35a995-31e7-4410-9690-2fc2f7bc4156";
  const uuidOutroEdital = "7a1b50e9-f02d-421f-89bf-57f32e42b2d3";

  const usuarioPrimeiraSolicitacao = {
    uuid: "3f43549e-f080-4680-bca5-4fa82e1165ef",
    nome: "Primeira terceirizada",
  };
  const usuarioUltimaSolicitacao = {
    uuid: "f40be870-d16d-4bff-ae5d-3ab056a129c4",
    nome: "Última terceirizada",
  };

  const produto = {
    uuid: uuidProduto,
    nome: "Arroz integral",
    vinculos_produto_edital: [
      {
        suspenso: false,
        edital: {
          uuid: uuidEdital,
          numero: "Edital 01/2026",
        },
      },
    ],
  };

  const homologacaoPadrao = {
    uuid: uuidHomologacao,
    status: "CODAE_PENDENTE_HOMOLOGACAO",
    esta_homologado: false,
    justificativa: "Justificativa cadastrada",
    produto,
    logs: [
      {
        status_evento_explicacao: "Solicitação Realizada",
        usuario: usuarioPrimeiraSolicitacao,
      },
      {
        status_evento_explicacao: "CODAE pediu correção",
        usuario: {
          uuid: "22a7d655-9970-4470-bad7-f144a6eb8b38",
          nome: "Usuário CODAE",
        },
      },
      {
        status_evento_explicacao: "Solicitação Realizada",
        usuario: usuarioUltimaSolicitacao,
      },
    ],
  };

  const editaisOptions = [
    { uuid: uuidEdital, numero: "Edital 01/2026" },
    { uuid: uuidOutroEdital, numero: "Edital 02/2026" },
  ];
  const setEditais = jest.fn();
  const getHomologacaoProdutoAsync = jest.fn();

  const propsPadrao = {
    homologacao: homologacaoPadrao,
    terceirizadas: [{ uuid: usuarioUltimaSolicitacao.uuid }],
    protocoloAnalise: "PA-2026-001",
    getHomologacaoProdutoAsync,
    editaisOptions,
    setEditais,
    editais: [uuidEdital],
    tipoModal: "homologacao",
    values: { necessita_analise_sensorial: null },
  };

  const renderizarComponente = (props = {}) =>
    render(<BotoesGPCODAE {...propsPadrao} {...props} />);

  const obterUltimasProps = (mockComponente) =>
    mockComponente.mock.calls[mockComponente.mock.calls.length - 1][0];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza as ações iniciais e configura os componentes filhos", () => {
    renderizarComponente();

    expect(screen.getByRole("button", { name: "Homologar" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Não homologar" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Corrigir" })).toBeEnabled();
    expect(
      screen.getByRole("button", { name: "Solicitar análise sensorial" }),
    ).toBeEnabled();

    const propsModalVincular = obterUltimasProps(mockModalVincularEditais);
    expect(propsModalVincular).toEqual(
      expect.objectContaining({
        showModal: false,
        editaisOptions,
        editais: [uuidEdital],
        uuid: uuidHomologacao,
        produto,
        tituloModal: "Homologação do Produto",
        ehSuspensaoFluxoAlteracaoDados: true,
      }),
    );

    const propsModalPadrao = obterUltimasProps(mockModalPadrao);
    expect(propsModalPadrao).toEqual(
      expect.objectContaining({
        showModal: false,
        uuid: uuidHomologacao,
        protocoloAnalise: "PA-2026-001",
        justificativa: "Justificativa cadastrada",
        terceirizada: usuarioUltimaSolicitacao,
        status: "CODAE_PENDENTE_HOMOLOGACAO",
        tipoModal: "homologacao",
      }),
    );

    const propsModalSuspensao = obterUltimasProps(
      mockModalAtivacaoSuspensaoProduto,
    );
    expect(propsModalSuspensao).toEqual(
      expect.objectContaining({
        showModal: false,
        acao: "suspensão",
        produto,
        idHomologacao: uuidHomologacao,
        manterSuspenso: false,
        ehSuspensaoFluxoAlteracaoDados: true,
      }),
    );
  });

  it("repassa a seleção de editais e o recarregamento da homologação", () => {
    renderizarComponente();
    const propsModalVincular = obterUltimasProps(mockModalVincularEditais);
    const propsModalPadrao = obterUltimasProps(mockModalPadrao);

    propsModalVincular.onChangeEditais([uuidOutroEdital]);
    propsModalVincular.loadSolicitacao();
    propsModalPadrao.loadSolicitacao();

    expect(setEditais).toHaveBeenCalledWith([uuidOutroEdital]);
    expect(getHomologacaoProdutoAsync).toHaveBeenCalledTimes(2);
  });

  it("abre e fecha o modal de homologação", () => {
    renderizarComponente();

    fireEvent.click(screen.getByRole("button", { name: "Homologar" }));
    let propsModalVincular = obterUltimasProps(mockModalVincularEditais);
    expect(propsModalVincular.showModal).toBe(true);

    act(() => propsModalVincular.closeModal());
    propsModalVincular = obterUltimasProps(mockModalVincularEditais);
    expect(propsModalVincular.showModal).toBe(false);
  });

  it("configura o modal de solicitação de análise sensorial", () => {
    renderizarComponente();

    fireEvent.click(
      screen.getByRole("button", { name: "Solicitar análise sensorial" }),
    );

    let propsModal = obterUltimasProps(mockModalPadrao);
    expect(propsModal).toEqual(
      expect.objectContaining({
        showModal: true,
        toastSuccessMessage:
          "Solicitação de análise sensorial enviada com sucesso",
        modalTitle: "Deseja solicitar a análise sensorial do produto?",
        endpoint: CODAEPedeAnaliseSensorialProduto,
        labelJustificativa: "Informações Adicionais",
        helpText:
          "Solicitamos que seja informado a quantidade e descrição para análise sensorial",
        eAnalise: true,
      }),
    );

    act(() => propsModal.closeModal());
    propsModal = obterUltimasProps(mockModalPadrao);
    expect(propsModal.showModal).toBe(false);
  });

  it("configura o modal de solicitação de correção", () => {
    renderizarComponente();

    fireEvent.click(screen.getByRole("button", { name: "Corrigir" }));

    expect(obterUltimasProps(mockModalPadrao)).toEqual(
      expect.objectContaining({
        showModal: true,
        toastSuccessMessage: "Solicitação de correção enviada com sucesso",
        modalTitle: "Deseja solicitar correção do cadastro do produto?",
        endpoint: CODAEPedeCorrecao,
        labelJustificativa: "Justificativa",
        helpText: undefined,
        eAnalise: false,
      }),
    );
  });

  it("configura o modal para não homologar o produto", () => {
    renderizarComponente();

    fireEvent.click(screen.getByRole("button", { name: "Não homologar" }));

    expect(obterUltimasProps(mockModalPadrao)).toEqual(
      expect.objectContaining({
        showModal: true,
        toastSuccessMessage:
          "Solicitação de não homologado enviada com sucesso",
        modalTitle: "Deseja não homologar (indeferir) este produto?",
        endpoint: CODAENaoHomologaProduto,
        labelJustificativa: "Justificativa",
        eAnalise: false,
      }),
    );
  });

  it("exibe somente o cancelamento quando a CODAE já solicitou correção", () => {
    const homologacao = {
      ...homologacaoPadrao,
      status: "CODAE_QUESTIONADO",
    };
    renderizarComponente({ homologacao });

    expect(
      screen.getByRole("button", { name: "Cancelar Solicitação" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Homologar" }),
    ).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Cancelar Solicitação" }),
    );

    expect(obterUltimasProps(mockModalPadrao)).toEqual(
      expect.objectContaining({
        showModal: true,
        toastSuccessMessage: "Cancelamento enviado com sucesso.",
        modalTitle: "Envio de Cancelamento da Solicitação de Correção",
        endpoint: CODAECancelaSoliticaoCorrecao,
        labelJustificativa: "Justificativa",
        eAnalise: false,
        cancelaAnaliseSensorial: homologacao,
      }),
    );
  });

  it("permite aceitar alterações e suspender um produto com edital ativo", () => {
    const homologacao = {
      ...homologacaoPadrao,
      esta_homologado: true,
    };
    renderizarComponente({ homologacao });

    expect(
      screen.getByRole("button", { name: "Aceitar alterações" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Suspender" }),
    ).toBeInTheDocument();
    expect(obterUltimasProps(mockModalVincularEditais).tituloModal).toBe(
      "Aceitar alterações",
    );

    fireEvent.click(screen.getByRole("button", { name: "Suspender" }));
    let propsModalSuspensao = obterUltimasProps(
      mockModalAtivacaoSuspensaoProduto,
    );
    expect(propsModalSuspensao.showModal).toBe(true);
    expect(propsModalSuspensao.manterSuspenso).toBe(false);

    propsModalSuspensao.atualizarDados();
    expect(getHomologacaoProdutoAsync).toHaveBeenCalledTimes(1);

    act(() => propsModalSuspensao.closeModal());
    propsModalSuspensao = obterUltimasProps(mockModalAtivacaoSuspensaoProduto);
    expect(propsModalSuspensao.showModal).toBe(false);
  });

  it("permite manter suspenso quando todos os editais válidos estão suspensos", () => {
    const homologacao = {
      ...homologacaoPadrao,
      esta_homologado: true,
      produto: {
        ...produto,
        vinculos_produto_edital: [
          {
            suspenso: true,
            edital: {
              uuid: uuidEdital,
              numero: "Edital 01/2026",
            },
          },
          {
            suspenso: false,
            edital: {
              uuid: uuidOutroEdital,
              numero: "78/sme/2016",
            },
          },
        ],
      },
    };
    renderizarComponente({ homologacao });

    expect(screen.getByRole("button", { name: "Homologar" })).toBeEnabled();
    expect(
      screen.getByRole("button", { name: "Manter suspenso" }),
    ).toBeEnabled();
    expect(
      obterUltimasProps(mockModalAtivacaoSuspensaoProduto).manterSuspenso,
    ).toBe(true);

    fireEvent.click(screen.getByRole("button", { name: "Manter suspenso" }));
    expect(obterUltimasProps(mockModalAtivacaoSuspensaoProduto).showModal).toBe(
      true,
    );
  });

  it("ignora editais inválidos ao verificar se o produto está suspenso", () => {
    const homologacao = {
      ...homologacaoPadrao,
      esta_homologado: true,
      produto: {
        ...produto,
        vinculos_produto_edital: [
          {
            suspenso: false,
            edital: {
              uuid: uuidEdital,
              numero: "41/SME/2017",
            },
          },
        ],
      },
    };
    renderizarComponente({ homologacao });

    expect(
      screen.getByRole("button", { name: "Aceitar alterações" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Suspender" }),
    ).toBeInTheDocument();
    expect(
      obterUltimasProps(mockModalAtivacaoSuspensaoProduto).manterSuspenso,
    ).toBe(false);
  });

  it("trata produto sem vínculos de edital", () => {
    const homologacao = {
      ...homologacaoPadrao,
      esta_homologado: true,
      produto: {
        ...produto,
        vinculos_produto_edital: undefined,
      },
    };
    renderizarComponente({ homologacao });

    expect(
      obterUltimasProps(mockModalAtivacaoSuspensaoProduto).manterSuspenso,
    ).toBe(false);
    expect(
      screen.getByRole("button", { name: "Aceitar alterações" }),
    ).toBeInTheDocument();
  });

  it("desabilita as ações conforme a necessidade de análise sensorial", () => {
    const { rerender } = renderizarComponente({
      values: { necessita_analise_sensorial: "1" },
    });

    expect(screen.getByRole("button", { name: "Homologar" })).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Não homologar" }),
    ).toBeDisabled();
    expect(screen.getByRole("button", { name: "Corrigir" })).toBeEnabled();
    expect(
      screen.getByRole("button", { name: "Solicitar análise sensorial" }),
    ).toBeEnabled();

    rerender(
      <BotoesGPCODAE
        {...propsPadrao}
        values={{ necessita_analise_sensorial: "0" }}
      />,
    );

    expect(screen.getByRole("button", { name: "Homologar" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Não homologar" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Corrigir" })).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Solicitar análise sensorial" }),
    ).toBeDisabled();
  });
});
