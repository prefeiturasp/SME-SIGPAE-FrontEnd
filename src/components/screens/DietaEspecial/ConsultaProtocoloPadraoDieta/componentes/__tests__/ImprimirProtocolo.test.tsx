import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import { CENTRAL_DOWNLOADS } from "src/configs/constants";
import mock from "src/services/_mock";
import TabelaProtocolos from "../Tabela";

jest.mock("src/components/Shareable/Toast/dialogs", () => ({
  toastError: jest.fn(),
}));

const protocolo = {
  uuid: "7c65da52-571c-4764-b79a-657c1333d1be",
  nome_protocolo: "ALERGIA A CAMARÃO",
  status: "Liberado",
  editais: [{ numero: "01/2026" }],
  orientacoes_gerais: "<p>Não servir alimentos com camarão.</p>",
  historico: [],
  substituicoes: [],
};

const outroProtocolo = {
  ...protocolo,
  uuid: "a42ca4fc-850d-4f16-a81b-3a99bdd59d46",
  nome_protocolo: "INTOLERÂNCIA À LACTOSE",
};

const urlImpressao = `/protocolo-padrao-dieta-especial/${protocolo.uuid}/exportar-pdf/`;
const respostaSucesso = {
  detail: "Solicitação de geração de arquivo recebida.",
};
const mensagemErro =
  "Não foi possível solicitar a impressão do protocolo. Tente novamente.";

const renderizarTabela = (protocolos = [protocolo]) =>
  render(
    <MemoryRouter>
      <TabelaProtocolos resultado={{ results: protocolos }} />
    </MemoryRouter>,
  );

const expandirProtocolo = (nome = protocolo.nome_protocolo) => {
  const botaoDetalhes = screen.getByRole("button", {
    name: `Detalhes do protocolo ${nome}`,
  });
  fireEvent.click(botaoDetalhes);
  const linhaAcoes = botaoDetalhes.closest("tr").nextElementSibling;
  return within(linhaAcoes as HTMLElement).getByRole("button", {
    name: "Imprimir",
  });
};

describe("Impressão do Protocolo Padrão", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mock.resetHistory();
  });

  afterEach(() => {
    mock.reset();
  });

  it("apresenta Imprimir junto ao Histórico ao expandir o protocolo", () => {
    renderizarTabela();
    const botaoImprimir = screen.getByRole("button", { name: "Imprimir" });
    const linhaAcoes = botaoImprimir.closest("tr");

    expect(linhaAcoes).toHaveClass("d-none");
    expandirProtocolo();

    expect(linhaAcoes).not.toHaveClass("d-none");
    expect(
      within(linhaAcoes).getByRole("button", { name: "Histórico" }),
    ).toBeInTheDocument();
    expect(botaoImprimir.querySelector("i")).toHaveClass("fa-print");
    expect(botaoImprimir).toBeEnabled();
    expect(mock.history.get).toHaveLength(0);
  });

  it("solicita o PDF da linha selecionada e apresenta o acesso à Central de Downloads", async () => {
    const urlSelecionada = `/protocolo-padrao-dieta-especial/${outroProtocolo.uuid}/exportar-pdf/`;
    mock.onGet(urlSelecionada).reply(200, respostaSucesso);
    renderizarTabela([protocolo, outroProtocolo]);

    fireEvent.click(expandirProtocolo(outroProtocolo.nome_protocolo));

    const modal = await screen.findByRole("dialog");
    expect(
      within(modal).getByText("Geração solicitada com sucesso."),
    ).toBeInTheDocument();
    expect(
      within(modal).getByRole("link", {
        name: "Ir para a Central de Downloads",
      }),
    ).toHaveAttribute("href", `/${CENTRAL_DOWNLOADS}`);
    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].url).toBe(urlSelecionada);
    expect(toastError).not.toHaveBeenCalled();
  });

  it("bloqueia cliques repetidos enquanto aguarda a resposta e libera o botão ao concluir", async () => {
    let concluirRequisicao: () => void;
    const respostaPendente = new Promise<[number, typeof respostaSucesso]>(
      (resolver) => {
        concluirRequisicao = () => resolver([200, respostaSucesso]);
      },
    );
    mock.onGet(urlImpressao).reply(() => respostaPendente);
    renderizarTabela();
    const botaoImprimir = expandirProtocolo();

    fireEvent.click(botaoImprimir);

    expect(botaoImprimir).toBeDisabled();
    expect(botaoImprimir.querySelector("i")).toHaveClass("fa-spinner");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    fireEvent.click(botaoImprimir);
    await waitFor(() => expect(mock.history.get).toHaveLength(1));

    await act(async () => {
      concluirRequisicao();
    });

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(botaoImprimir).toBeEnabled();
    expect(botaoImprimir.querySelector("i")).toHaveClass("fa-print");
    expect(mock.history.get).toHaveLength(1);
  });

  it("permite fechar a confirmação e solicitar novamente a impressão", async () => {
    mock.onGet(urlImpressao).reply(200, respostaSucesso);
    renderizarTabela();
    const botaoImprimir = expandirProtocolo();
    fireEvent.click(botaoImprimir);
    const modal = await screen.findByRole("dialog");

    fireEvent.click(within(modal).getByRole("button", { name: "Fechar" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    fireEvent.click(botaoImprimir);

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(mock.history.get).toHaveLength(2);
  });

  it.each([201, 404, 500])(
    "exibe um único erro e libera o botão quando a API retorna %s",
    async (status) => {
      mock
        .onGet(urlImpressao)
        .reply(status, { detail: "Resposta inesperada." });
      renderizarTabela();
      const botaoImprimir = expandirProtocolo();

      fireEvent.click(botaoImprimir);

      await waitFor(() => {
        expect(toastError).toHaveBeenCalledTimes(1);
      });
      expect(toastError).toHaveBeenCalledWith(mensagemErro);
      expect(botaoImprimir).toBeEnabled();
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    },
  );

  it("exibe erro de rede e permite tentar novamente com sucesso", async () => {
    mock.onGet(urlImpressao).networkErrorOnce();
    mock.onGet(urlImpressao).reply(200, respostaSucesso);
    renderizarTabela();
    const botaoImprimir = expandirProtocolo();

    fireEvent.click(botaoImprimir);

    await waitFor(() => expect(toastError).toHaveBeenCalledWith(mensagemErro));
    expect(botaoImprimir).toBeEnabled();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    fireEvent.click(botaoImprimir);

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(mock.history.get).toHaveLength(2);
    expect(toastError).toHaveBeenCalledTimes(1);
  });
});
