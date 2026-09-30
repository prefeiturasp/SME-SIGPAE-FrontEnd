import "@testing-library/jest-dom";
import { act, render, screen, waitFor } from "@testing-library/react";
import HTTP_STATUS from "http-status-codes";

import { Container } from "../Container";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import { getNumerosEditais } from "src/services/edital.service";
import {
  getHomologacaoProduto,
  getNomesTerceirizadas,
  getNumeroProtocoloAnaliseSensorial,
} from "src/services/produto.service";

const mockHomologacao = jest.fn(() => <div data-testid="homologacao" />);

jest.mock("../../index", () => ({
  Homologacao: (props) => mockHomologacao(props),
}));

jest.mock("src/components/Shareable/Toast/dialogs", () => ({
  toastError: jest.fn(),
}));

jest.mock("src/services/edital.service", () => ({
  getNumerosEditais: jest.fn(),
}));

jest.mock("src/services/produto.service", () => ({
  getHomologacaoProduto: jest.fn(),
  getNomesTerceirizadas: jest.fn(),
  getNumeroProtocoloAnaliseSensorial: jest.fn(),
}));

describe("Container da homologação de produto", () => {
  const uuidHomologacao = "201394ff-8d24-4fc6-b7b7-e02d85603f54";
  const uuidProduto = "9edfa308-544b-4d73-a306-08da15f98581";
  const uuidEditalAtivo = "68e5082c-fe84-47d8-8711-aca39aa09eaf";
  const uuidEditalSuspenso = "5ea8b93d-3143-4a55-a14a-cf3c12564cc0";
  const uuidEditalInvalido = "90b043aa-ab98-4467-95f8-f9ca864b3652";

  const terceirizadas = [
    {
      uuid: "c75052c2-b435-49ca-a72f-3a40541653c5",
      nome_fantasia: "Empresa terceirizada",
    },
  ];

  const editais = [
    {
      uuid: uuidEditalAtivo,
      numero: "Edital 01/2026",
    },
    {
      uuid: uuidEditalSuspenso,
      numero: "Edital 02/2026",
    },
    {
      uuid: uuidEditalInvalido,
      numero: "78/sme/2016",
    },
  ];

  const produto = {
    uuid: uuidProduto,
    nome: "Arroz integral",
    eh_para_alunos_com_dieta: true,
    tem_aditivos_alergenicos: false,
    tem_gluten: true,
    vinculos_produto_edital: [
      {
        suspenso: false,
        edital: {
          uuid: uuidEditalAtivo,
          numero: "Edital 01/2026",
        },
      },
      {
        suspenso: true,
        edital: {
          uuid: uuidEditalSuspenso,
          numero: "Edital 02/2026",
        },
      },
    ],
  };

  const homologacao = {
    uuid: uuidHomologacao,
    status: "CODAE_PENDENTE_HOMOLOGACAO",
    produto,
  };

  const protocoloAnalise = {
    numero_protocolo: "AS-2026-001",
  };

  const configurarRespostasComSucesso = () => {
    getNomesTerceirizadas.mockResolvedValue({
      status: HTTP_STATUS.OK,
      data: { results: terceirizadas },
    });
    getNumerosEditais.mockResolvedValue({
      status: HTTP_STATUS.OK,
      data: { results: editais },
    });
    getHomologacaoProduto.mockResolvedValue({
      status: HTTP_STATUS.OK,
      data: homologacao,
    });
    getNumeroProtocoloAnaliseSensorial.mockResolvedValue({
      status: HTTP_STATUS.OK,
      data: protocoloAnalise,
    });
  };

  const obterUltimasPropsHomologacao = () =>
    mockHomologacao.mock.calls[mockHomologacao.mock.calls.length - 1][0];

  beforeEach(() => {
    jest.clearAllMocks();
    window.history.replaceState(
      null,
      "",
      `/produto/homologacao?uuid=${uuidHomologacao}`,
    );
    configurarRespostasComSucesso();
  });

  it("exibe o carregamento enquanto as requisições estão pendentes", () => {
    const requisicaoPendente = new Promise(() => {});
    getNomesTerceirizadas.mockReturnValue(requisicaoPendente);
    getNumerosEditais.mockReturnValue(requisicaoPendente);
    getHomologacaoProduto.mockReturnValue(requisicaoPendente);
    getNumeroProtocoloAnaliseSensorial.mockReturnValue(requisicaoPendente);

    render(<Container />);

    expect(screen.getByText("Carregando...")).toBeInTheDocument();
    expect(screen.queryByTestId("homologacao")).not.toBeInTheDocument();
  });

  it("carrega as informações e monta os valores iniciais da homologação", async () => {
    render(<Container />);

    await waitFor(() => {
      expect(screen.getByTestId("homologacao")).toBeInTheDocument();
    });

    expect(getNomesTerceirizadas).toHaveBeenCalledTimes(1);
    expect(getNumerosEditais).toHaveBeenCalledWith({
      excluir_encerrados: true,
      excluir_parceira: true,
    });
    expect(getHomologacaoProduto).toHaveBeenCalledWith(uuidHomologacao);
    expect(getNumeroProtocoloAnaliseSensorial).toHaveBeenCalledTimes(1);

    expect(obterUltimasPropsHomologacao()).toEqual(
      expect.objectContaining({
        terceirizadas,
        editaisOptions: [editais[0], editais[1]],
        homologacao,
        produto,
        protocoloAnalise,
        formValues: {
          ...homologacao,
          produto: {
            ...produto,
            editais_homologados: "Edital 01/2026",
            editais_suspensos: "Edital 02/2026",
            dieta_especial: "SIM",
            aditivos_alergicos: "NÃO",
            tem_gluten: "SIM",
          },
          necessita_analise_sensorial: "1",
        },
      }),
    );
    expect(screen.queryByText("Carregando...")).not.toBeInTheDocument();
  });

  it("recarrega a homologação pelo callback enviado ao componente", async () => {
    render(<Container />);

    await waitFor(() => {
      expect(mockHomologacao).toHaveBeenCalled();
    });

    const homologacaoAtualizada = {
      ...homologacao,
      status: "CODAE_HOMOLOGADO",
      produto: {
        ...produto,
        nome: "Arroz integral atualizado",
      },
    };
    getHomologacaoProduto.mockResolvedValueOnce({
      status: HTTP_STATUS.OK,
      data: homologacaoAtualizada,
    });

    await act(async () => {
      await obterUltimasPropsHomologacao().getHomologacaoProdutoAsync();
    });

    expect(getHomologacaoProduto).toHaveBeenCalledTimes(2);
    expect(obterUltimasPropsHomologacao()).toEqual(
      expect.objectContaining({
        homologacao: homologacaoAtualizada,
        produto: homologacaoAtualizada.produto,
      }),
    );
  });

  it.each([
    [getNomesTerceirizadas, "Erro ao carregar terceirizadas"],
    [getNumerosEditais, "Erro ao carregar editais"],
    [
      getNumeroProtocoloAnaliseSensorial,
      "Erro ao carregar numero de protocolo da análise sensorial",
    ],
    [getHomologacaoProduto, "Erro ao carregar homologação do produto"],
  ])(
    "exibe o estado de erro quando uma requisição falha",
    async (servico, mensagem) => {
      servico.mockResolvedValueOnce({
        status: HTTP_STATUS.BAD_REQUEST,
        data: {},
      });

      render(<Container />);

      expect(
        await screen.findByText(
          "Erro ao carregar informações. Tente novamente mais tarde.",
        ),
      ).toBeInTheDocument();
      expect(toastError).toHaveBeenCalledWith(mensagem);
      expect(screen.queryByTestId("homologacao")).not.toBeInTheDocument();
    },
  );
});
