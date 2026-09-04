import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";

import { getRelatorioProdutoHistorico } from "src/services/relatorios";

import { BotoesCabecalho } from "../BotoesCabecalho";

const mockModalHistorico = jest.fn(() => <div data-testid="modal-historico" />);

jest.mock("src/components/Shareable/ModalHistorico", () => ({
  __esModule: true,
  default: (props) => mockModalHistorico(props),
}));

jest.mock("src/components/Shareable/Botao", () => ({
  __esModule: true,
  default: ({ texto = "botão", onClick }) => (
    <button onClick={onClick}>{texto}</button>
  ),
}));

jest.mock("src/components/Shareable/ModalPadrao", () => ({
  ModalPadrao: () => null,
}));

jest.mock(
  "src/components/screens/Produto/AtivacaoSuspensao/ModalAtivacaoSuspensaoProduto",
  () => ({
    __esModule: true,
    default: () => null,
  }),
);

jest.mock("src/helpers/utilities", () => ({
  usuarioEhEmpresaTerceirizada: () => false,
  usuarioPodeVisualizarDownloadsHistoricoReclamacaoProduto: () => true,
}));

jest.mock("src/services/produto.service", () => ({
  CODAEPedeAnaliseSensorialProduto: jest.fn(),
  imprimeFichaIdentificacaoProduto: jest.fn(),
}));

jest.mock("src/services/relatorios", () => ({
  getRelatorioProdutoHistorico: jest.fn(),
}));

jest.mock(
  "src/components/screens/Produto/BuscaAvancada/components/RelatorioProduto/components/AcoesDownloadHistoricoReclamacao",
  () => ({
    __esModule: true,
    default: ({ uuidReclamacao, logSelecionado }) => (
      <div data-testid="acoes-reclamacao">
        {uuidReclamacao}-{logSelecionado.uuid}
      </div>
    ),
  }),
);

const logHomologacao = {
  uuid: "a1336a19-87b6-4b29-af08-bf2913858a27",
  criado_em: "01/09/2026 08:00:00",
  status_evento_explicacao: "CODAE homologou",
};

const logReclamacao = {
  uuid: "f420b79c-4488-45c0-994f-ff6d26bd5378",
  criado_em: "03/09/2026 09:00:00",
  status_evento_explicacao: "Escola/Nutricionista reclamou do produto",
  arquivos_disponiveis: {
    possui_pdf: true,
    quantidade_imagens: 1,
  },
};

const homologacao = {
  uuid: "80a0f3b7-1699-4de9-bb01-375bc5605d32",
  status: "CODAE_HOMOLOGADO",
  tem_copia: false,
  logs: [logHomologacao],
  produto: {
    uuid: "29a57b68-cfcd-47ff-ba52-316d501cf17a",
    ultima_homologacao: {
      reclamacoes: [
        {
          uuid: "7b3d9bd5-cfee-4e1a-b5c6-86af3f7ada24",
          logs: [logReclamacao],
        },
      ],
    },
  },
};

describe("BotoesCabecalho - histórico da reclamação", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("combina e ordena os históricos do produto e da reclamação", () => {
    render(
      <BotoesCabecalho
        homologacao={homologacao}
        getHomologacaoProdutoAsync={jest.fn()}
        terceirizadas={[]}
        ehCardSuspensos={false}
      />,
    );

    const propriedadesModal = mockModalHistorico.mock.calls[0][0];

    expect(propriedadesModal.logs).toHaveLength(2);
    expect(propriedadesModal.logs[0]).toEqual({
      ...logReclamacao,
      uuid_reclamacao: "7b3d9bd5-cfee-4e1a-b5c6-86af3f7ada24",
    });
    expect(propriedadesModal.logs[1]).toEqual(logHomologacao);
  });

  it("disponibiliza ações somente para logs vinculados à reclamação", () => {
    render(
      <BotoesCabecalho
        homologacao={homologacao}
        getHomologacaoProdutoAsync={jest.fn()}
        terceirizadas={[]}
        ehCardSuspensos={false}
      />,
    );

    const propriedadesModal = mockModalHistorico.mock.calls[0][0];
    const logComReclamacao = propriedadesModal.logs[0];
    const { rerender } = render(
      propriedadesModal.renderizarAcoesLog(logComReclamacao),
    );

    expect(screen.getByTestId("acoes-reclamacao")).toHaveTextContent(
      `7b3d9bd5-cfee-4e1a-b5c6-86af3f7ada24-${logReclamacao.uuid}`,
    );

    rerender(propriedadesModal.renderizarAcoesLog(logHomologacao));
    expect(screen.queryByTestId("acoes-reclamacao")).not.toBeInTheDocument();
  });

  it("mantém a geração do relatório ao imprimir o histórico", () => {
    render(
      <BotoesCabecalho
        homologacao={homologacao}
        getHomologacaoProdutoAsync={jest.fn()}
        terceirizadas={[]}
        ehCardSuspensos={false}
      />,
    );

    const propriedadesModal = mockModalHistorico.mock.calls[0][0];
    propriedadesModal.printHistorico();

    expect(getRelatorioProdutoHistorico).toHaveBeenCalledWith({
      uuid: homologacao.produto.uuid,
    });
  });
});
