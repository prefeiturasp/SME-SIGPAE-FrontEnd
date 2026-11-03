import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { mockRelatorioGestaoDietasEspeciais } from "src/mocks/services/dietaEspecial.service/relatorioGestaoDietaEspecial";
import mock from "src/services/_mock";
import ModalRelatorioDietaEspecial from "../../components/ModalRelatorioDietaEspecial";

const URL_LISTAGEM = "/solicitacoes-dieta-especial/relatorio-dieta-especial/";
const URL_IMPRIME =
  "solicitacoes-dieta-especial/imprime-relatorio-dieta-especial/";

const [dietaBase] = mockRelatorioGestaoDietasEspeciais.results;

const dietaNegada = {
  ...dietaBase,
  uuid: "dieta-negada",
  id_externo: "NEGADA",
  criado_em: "10/01/2024 08:00:00",
  status_solicitacao: "CODAE_NEGOU_PEDIDO",
  status_titulo: "CODAE negou a solicitação",
  ativo: false,
  motivo_negacao: { descricao: "Motivo da negação teste" },
  justificativa_negacao: "<p>Justificativa da negação teste</p>",
  logs: [
    {
      ...dietaBase.logs[0],
      criado_em: "09/01/2024 07:00:00",
    },
    {
      ...dietaBase.logs[0],
      criado_em: "12/01/2024 15:30:00",
      usuario: {
        ...dietaBase.logs[0].usuario,
        nome: "USUARIO NEGOU",
        registro_funcional: "RF-NEGOU",
      },
    },
  ],
};

const dietaAutorizada = {
  ...dietaBase,
  uuid: "dieta-autorizada",
  id_externo: "AUTORIZADA",
  criado_em: "11/01/2024 09:00:00",
  status_solicitacao: "CODAE_AUTORIZADO",
  status_titulo: "CODAE autorizou",
  ativo: true,
  classificacao: { nome: "Classificação teste" },
  nome_protocolo: "Protocolo teste",
  data_termino: "31/12/2030",
  alergias_intolerancias: [
    { descricao: "Alergia teste 1" },
    { descricao: "Alergia teste 2" },
  ],
  observacoes: "<p>Observação teste</p>",
  informacoes_adicionais: "<p>Informação adicional teste</p>",
  logs: [
    {
      ...dietaBase.logs[0],
      usuario: {
        ...dietaBase.logs[0].usuario,
        nome: "USUARIO AUTORIZOU",
        registro_funcional: "RF-AUTORIZOU",
      },
    },
  ],
};

const dietaCancelada = {
  ...dietaBase,
  uuid: "dieta-cancelada",
  id_externo: "CANCELADA",
  status_solicitacao: "ESCOLA_CANCELOU",
  status_titulo: "Escola cancelou",
  rastro_escola: {
    ...dietaBase.rastro_escola,
    diretoria_regional: null,
    lote: null,
    tipo_gestao: null,
  },
};

const filtros = {
  dre: "8f1da4a7-11b6-4a09-9eaa-6633d066f26b",
  escola: "escola-uuid",
  diagnostico: ["diagnostico-uuid"],
  status: ["CODAE_AUTORIZADO", "CODAE_NEGOU_PEDIDO"],
};

describe("Interações do modal de relatório - Relatório Gestão de Dietas Especiais", () => {
  const closeModal = jest.fn();
  const setExibirModalCentralDownloads = jest.fn();
  const setDadosRelatorio = jest.fn();

  const renderModal = async (props = {}) => {
    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <ToastContainer />
          <ModalRelatorioDietaEspecial
            showModal={true}
            closeModal={closeModal}
            setExibirModalCentralDownloads={setExibirModalCentralDownloads}
            dadosRelatorio={[dietaBase]}
            setDadosRelatorio={setDadosRelatorio}
            filtros={filtros}
            totalResultados={25}
            {...props}
          />
        </MemoryRouter>,
      );
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mock.reset();
  });

  describe("Cabeçalho", () => {
    it("exibe cabeçalho com data inicial e final", async () => {
      await renderModal({
        filtros: {
          ...filtros,
          data_inicial: "01/01/2024",
          data_final: "31/01/2024",
        },
      });
      expect(
        screen.getByText("Veja os resultados para a busca"),
      ).toBeInTheDocument();
    });

    it("exibe cabeçalho apenas com data inicial", async () => {
      await renderModal({
        filtros: { ...filtros, data_inicial: "01/01/2024" },
      });
      expect(
        screen.getByText('Veja os resultados a partir de "01/01/2024":'),
      ).toBeInTheDocument();
    });

    it("exibe cabeçalho apenas com data final", async () => {
      await renderModal({
        filtros: { ...filtros, data_final: "31/01/2024" },
      });
      expect(
        screen.getByText('Veja os resultados até "31/01/2024":'),
      ).toBeInTheDocument();
    });

    it("exibe cabeçalho padrão quando não há datas", async () => {
      await renderModal();
      expect(
        screen.getByText("Veja os resultados para a busca:"),
      ).toBeInTheDocument();
    });

    it("não exibe cabeçalho quando filtros não são informados", async () => {
      await renderModal({ filtros: undefined });
      expect(screen.queryByText(/Veja os resultados/)).not.toBeInTheDocument();
    });
  });

  describe("Listagem de dietas", () => {
    it("exibe os dados de uma dieta autorizada", async () => {
      await renderModal({ dadosRelatorio: [dietaAutorizada] });

      expect(screen.getByText("Solicitação #AUTORIZADA")).toBeInTheDocument();
      expect(screen.getByText("Autorizada")).toBeInTheDocument();
      expect(screen.getByText("Ativa")).toBeInTheDocument();
      expect(screen.getByText("11/01/2024")).toBeInTheDocument();
      expect(screen.getByText("Classificação teste")).toBeInTheDocument();
      expect(screen.getByText("Protocolo teste")).toBeInTheDocument();
      expect(screen.getByText("31/12/2030")).toBeInTheDocument();
      expect(screen.getByText("Alergia teste 1")).toBeInTheDocument();
      expect(screen.getByText("Alergia teste 2")).toBeInTheDocument();
      expect(screen.getByText("Observação teste")).toBeInTheDocument();
      expect(
        screen.getByText("Informação adicional teste"),
      ).toBeInTheDocument();
      expect(screen.getByText("USUARIO AUTORIZOU")).toBeInTheDocument();
      expect(screen.getByText("RF-AUTORIZOU")).toBeInTheDocument();
      expect(screen.queryByText("Sem data de término")).not.toBeInTheDocument();
    });

    it("exibe os dados de uma dieta negada com o último log", async () => {
      await renderModal({ dadosRelatorio: [dietaNegada] });

      expect(screen.getByText("Solicitação #NEGADA")).toBeInTheDocument();
      expect(screen.getByText("Negada")).toBeInTheDocument();
      expect(screen.getByText("Inativa")).toBeInTheDocument();
      expect(screen.getByText("Motivo da negação teste")).toBeInTheDocument();
      expect(
        screen.getByText("Justificativa da negação teste"),
      ).toBeInTheDocument();
      expect(screen.getByText("12/01/2024")).toBeInTheDocument();
      expect(screen.getByText("USUARIO NEGOU")).toBeInTheDocument();
      expect(screen.getByText("RF-NEGOU")).toBeInTheDocument();
      expect(screen.getByText("Sem data de término")).toBeInTheDocument();
    });

    it("não exibe usuário nem data de negação para dieta aguardando autorização", async () => {
      await renderModal({ dadosRelatorio: [dietaBase] });

      expect(screen.getByText("Aguardando Autorização")).toBeInTheDocument();
      expect(screen.queryByText("UE DIRETA")).not.toBeInTheDocument();
      expect(screen.queryByText("1236000")).not.toBeInTheDocument();
    });

    it("exibe dieta cancelada sem DRE, lote e tipo de gestão", async () => {
      await renderModal({ dadosRelatorio: [dietaCancelada] });

      expect(screen.getByText("Solicitação #CANCELADA")).toBeInTheDocument();
      expect(screen.getByText("Cancelada")).toBeInTheDocument();
      expect(
        screen.queryByText("DIRETORIA REGIONAL DE EDUCACAO BUTANTA"),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText("DIRETORIA REGIONAL - DIRETA"),
      ).not.toBeInTheDocument();
    });

    it("renderiza várias dietas na listagem", async () => {
      await renderModal({
        dadosRelatorio: [dietaBase, dietaNegada, dietaAutorizada],
      });

      expect(screen.getAllByText(/^Solicitação #/)).toHaveLength(3);
    });

    it("não renderiza o modal quando showModal é falso", async () => {
      await renderModal({ showModal: false });

      expect(
        screen.queryByText("Relatório de dieta especial"),
      ).not.toBeInTheDocument();
    });
  });

  describe("Fechar modal", () => {
    it("chama closeModal ao clicar em Voltar", async () => {
      await renderModal();

      fireEvent.click(screen.getByText("Voltar").closest("button"));

      expect(closeModal).toHaveBeenCalledTimes(1);
    });
  });

  describe("Paginação", () => {
    it("busca a nova página, atualiza os dados e remove diagnostico e escola dos parâmetros", async () => {
      const novosResultados = [dietaAutorizada];
      mock.onPost(URL_LISTAGEM).reply(200, {
        ...mockRelatorioGestaoDietasEspeciais,
        results: novosResultados,
      });
      await renderModal();

      await act(async () => {
        fireEvent.click(screen.getByText("2"));
      });

      expect(mock.history.post).toHaveLength(1);
      const { data, params } = mock.history.post[0];
      expect(JSON.parse(data)).toEqual(filtros);
      expect(params.get("page")).toBe("2");
      expect(params.has("diagnostico")).toBe(false);
      expect(params.has("escola")).toBe(false);
      expect(params.get("dre")).toBe(filtros.dre);
      expect(params.getAll("status")).toEqual(filtros.status);
      expect(setDadosRelatorio).toHaveBeenCalledWith(novosResultados);
    });
  });

  describe("Exportar relatório", () => {
    it("exporta com sucesso, fecha o modal e abre a central de downloads", async () => {
      mock.onPost(URL_IMPRIME).reply(200, {});
      await renderModal();

      await act(async () => {
        fireEvent.click(screen.getByText("Exportar").closest("button"));
      });

      expect(mock.history.post).toHaveLength(1);
      const { data, params } = mock.history.post[0];
      expect(JSON.parse(data)).toEqual(filtros);
      expect(params.has("diagnostico")).toBe(false);
      expect(params.has("escola")).toBe(false);
      expect(params.get("dre")).toBe(filtros.dre);
      expect(closeModal).toHaveBeenCalledTimes(1);
      expect(setExibirModalCentralDownloads).toHaveBeenCalledWith(true);
      expect(
        screen.queryByText(
          "Erro ao solicitar o download do arquivo. Tente novamente mais tarde.",
        ),
      ).not.toBeInTheDocument();
      expect(screen.getByText("Exportar").closest("button")).not.toBeDisabled();
    });

    it("exibe mensagem de erro em tela quando a exportação falha", async () => {
      mock.onPost(URL_IMPRIME).reply(500, {});
      await renderModal();

      await act(async () => {
        fireEvent.click(screen.getByText("Exportar").closest("button"));
      });

      expect(
        screen.getByText(
          "Erro ao solicitar o download do arquivo. Tente novamente mais tarde.",
        ),
      ).toBeInTheDocument();
      expect(closeModal).not.toHaveBeenCalled();
      expect(setExibirModalCentralDownloads).not.toHaveBeenCalled();
      expect(screen.getByText("Exportar").closest("button")).not.toBeDisabled();
    });

    it("desabilita o botão Exportar enquanto a exportação está em andamento", async () => {
      let finalizarExportacao;
      mock.onPost(URL_IMPRIME).reply(
        () =>
          new Promise((resolve) => {
            finalizarExportacao = () => resolve([200, {}]);
          }),
      );
      await renderModal();

      await act(async () => {
        fireEvent.click(screen.getByText("Exportar").closest("button"));
      });

      expect(screen.getByText("Exportar").closest("button")).toBeDisabled();

      await act(async () => {
        finalizarExportacao();
      });

      expect(screen.getByText("Exportar").closest("button")).not.toBeDisabled();
    });
  });
});
