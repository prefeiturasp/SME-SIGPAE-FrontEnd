import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import HTTP_STATUS from "http-status-codes";
import { MemoryRouter } from "react-router-dom";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import {
  deleteFormularioSupervisao,
  exportarPDFRelatorioFiscalizacao,
} from "src/services/imr/relatorioFiscalizacaoTerceirizadas";
import { Listagem } from "../index";

jest.mock("antd", () => {
  const React = require("react");

  return {
    Tooltip: ({ children, title }) =>
      React.isValidElement(children)
        ? React.cloneElement(children, { "aria-label": title })
        : React.createElement("span", { title }, children),
  };
});

jest.mock("src/components/Shareable/ModalSolicitacaoDownload", () => {
  const React = require("react");

  return {
    __esModule: true,
    default: ({ show, setShow }) =>
      show
        ? React.createElement(
            "div",
            { role: "dialog", "aria-label": "Central de Downloads" },
            React.createElement(
              "button",
              { type: "button", onClick: () => setShow(false) },
              "Fechar modal de download",
            ),
          )
        : null,
  };
});

jest.mock("src/components/Shareable/Toast/dialogs", () => ({
  toastError: jest.fn(),
  toastSuccess: jest.fn(),
}));

jest.mock("src/services/imr/relatorioFiscalizacaoTerceirizadas", () => ({
  deleteFormularioSupervisao: jest.fn(),
  exportarPDFRelatorioFiscalizacao: jest.fn(),
}));

const UUID_RELATORIO = "6af4139c-b02d-46f4-9b6e-bb73e7b58623";
const UNIDADE_EDUCACIONAL_LONGA =
  "EMEF Professora Maria de Lourdes da Silva Santos";

const relatorioEnviado = {
  uuid: UUID_RELATORIO,
  diretoria_regional: "DRE Butantã",
  unidade_educacional: UNIDADE_EDUCACIONAL_LONGA,
  data: "25/08/2026",
  status: "Enviado para CODAE",
};

const relatorioEmPreenchimento = {
  ...relatorioEnviado,
  status: "Em Preenchimento",
};

const relatorioFinalizado = {
  ...relatorioEnviado,
  status: "Finalizado",
};

const filtros = {
  diretoria_regional: "1b7f3f52-7f27-4872-91e5-24b8e44fe092",
  status: "FINALIZADO",
};

const mockDeleteFormularioSupervisao = jest.mocked(deleteFormularioSupervisao);
const mockExportarPDFRelatorioFiscalizacao = jest.mocked(
  exportarPDFRelatorioFiscalizacao,
);

const criarProps = (sobrescritas = {}) => ({
  objetos: [relatorioEnviado],
  perfilNutriSupervisao: false,
  podeVisualizarRelatorio: false,
  getDashboardPainelGerencialSupervisaoAsync: jest.fn(),
  buscarResultados: jest.fn(),
  filtros,
  pagina: 2,
  ...sobrescritas,
});

const renderizarListagem = (sobrescritas = {}) => {
  const props = criarProps(sobrescritas);

  render(
    <MemoryRouter>
      <Listagem {...props} />
    </MemoryRouter>,
  );

  return props;
};

const criarPromessaControlada = () => {
  let resolver;
  const promise = new Promise((resolve) => {
    resolver = resolve;
  });

  return { promise, resolver };
};

describe("Listagem de relatórios de fiscalização", () => {
  const confirmarExclusao = jest.spyOn(window, "confirm");

  beforeEach(() => {
    jest.clearAllMocks();
    confirmarExclusao.mockReturnValue(true);
  });

  afterAll(() => {
    confirmarExclusao.mockRestore();
  });

  it("renderiza os dados e traduz o status para usuário sem perfil de supervisão", () => {
    renderizarListagem();

    expect(
      screen.getByText("Relatórios das Visitas as Unidades Cadastrados"),
    ).toBeInTheDocument();
    expect(screen.getByText("Diretoria Regional")).toBeInTheDocument();
    expect(screen.getByText("DRE Butantã")).toBeInTheDocument();
    expect(screen.getByText("25/08/2026")).toBeInTheDocument();
    expect(screen.getByText("Enviado pela Supervisão")).toBeInTheDocument();
    expect(
      screen.getByText(`${UNIDADE_EDUCACIONAL_LONGA.slice(0, 40)}...`),
    ).toBeInTheDocument();
  });

  it("mantém o status original e exibe as ações permitidas para supervisão", () => {
    renderizarListagem({
      perfilNutriSupervisao: true,
      podeVisualizarRelatorio: true,
    });

    expect(screen.getByText("Enviado para CODAE")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Visualizar Relatório" }),
    ).toHaveAttribute(
      "href",
      `/supervisao/terceirizadas/relatorio-fiscalizacao-terceirizadas/detalhar-relatorio-fiscalizacao?uuid=${UUID_RELATORIO}`,
    );
    expect(
      screen.getByRole("button", { name: "Relatório em PDF" }),
    ).toBeInTheDocument();
  });

  it("não exibe a visualização quando o usuário não possui permissão", () => {
    renderizarListagem({ podeVisualizarRelatorio: false });

    expect(
      screen.queryByRole("link", { name: "Visualizar Relatório" }),
    ).not.toBeInTheDocument();
  });

  it("exibe edição e exclusão para relatório em preenchimento da supervisão", () => {
    renderizarListagem({
      objetos: [relatorioEmPreenchimento],
      perfilNutriSupervisao: true,
    });

    expect(
      screen.getByRole("link", { name: "Editar relatório" }),
    ).toHaveAttribute(
      "href",
      `/supervisao/terceirizadas/relatorio-fiscalizacao-terceirizadas/editar-relatorio-fiscalizacao?uuid=${UUID_RELATORIO}`,
    );
    expect(
      screen.getByRole("button", { name: "Excluir relatório" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Relatório em PDF" }),
    ).not.toBeInTheDocument();
  });

  it("cancela a exclusão quando o usuário não confirma", () => {
    confirmarExclusao.mockReturnValue(false);
    renderizarListagem({
      objetos: [relatorioEmPreenchimento],
      perfilNutriSupervisao: true,
    });

    fireEvent.click(screen.getByRole("button", { name: "Excluir relatório" }));

    expect(confirmarExclusao).toHaveBeenCalledWith(
      "Deseja realmente excluir este relatório?",
    );
    expect(mockDeleteFormularioSupervisao).not.toHaveBeenCalled();
  });

  it("exclui o relatório e atualiza os dados após confirmação", async () => {
    const requisicao = criarPromessaControlada();
    mockDeleteFormularioSupervisao.mockReturnValue(requisicao.promise);
    const props = renderizarListagem({
      objetos: [relatorioEmPreenchimento],
      perfilNutriSupervisao: true,
    });

    const botaoExcluir = screen.getByRole("button", {
      name: "Excluir relatório",
    });
    fireEvent.click(botaoExcluir);

    expect(mockDeleteFormularioSupervisao).toHaveBeenCalledWith({
      uuid: UUID_RELATORIO,
    });
    expect(botaoExcluir).toBeDisabled();
    expect(await screen.findByAltText("ajax-loader")).toBeInTheDocument();

    await act(async () => {
      requisicao.resolver({ status: HTTP_STATUS.NO_CONTENT });
    });

    await waitFor(() => {
      expect(toastSuccess).toHaveBeenCalledWith(
        "Relatório excluído com sucesso!",
      );
      expect(
        props.getDashboardPainelGerencialSupervisaoAsync,
      ).toHaveBeenCalledTimes(1);
      expect(props.buscarResultados).toHaveBeenCalledWith(filtros, 2);
      expect(botaoExcluir).toBeEnabled();
    });
  });

  it("apresenta erro quando não consegue excluir o relatório", async () => {
    mockDeleteFormularioSupervisao.mockResolvedValue({
      status: HTTP_STATUS.BAD_REQUEST,
    });
    const props = renderizarListagem({
      objetos: [relatorioEmPreenchimento],
      perfilNutriSupervisao: true,
    });

    fireEvent.click(screen.getByRole("button", { name: "Excluir relatório" }));

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith(
        "Erro ao excluir relatório. Tente novamente mais tarde",
      );
    });
    expect(toastSuccess).not.toHaveBeenCalled();
    expect(
      props.getDashboardPainelGerencialSupervisaoAsync,
    ).not.toHaveBeenCalled();
    expect(props.buscarResultados).not.toHaveBeenCalled();
  });

  it("exporta o PDF, exibe o loader e abre a Central de Downloads", async () => {
    const requisicao = criarPromessaControlada();
    mockExportarPDFRelatorioFiscalizacao.mockReturnValue(requisicao.promise);
    renderizarListagem({
      objetos: [relatorioFinalizado],
      perfilNutriSupervisao: true,
    });

    const botaoExportar = screen.getByRole("button", {
      name: "Relatório em PDF",
    });
    fireEvent.click(botaoExportar);

    expect(mockExportarPDFRelatorioFiscalizacao).toHaveBeenCalledWith({
      uuid: UUID_RELATORIO,
    });
    expect(botaoExportar).toBeDisabled();
    expect(await screen.findByAltText("ajax-loader")).toBeInTheDocument();

    await act(async () => {
      requisicao.resolver({ status: HTTP_STATUS.OK });
    });

    expect(
      await screen.findByRole("dialog", { name: "Central de Downloads" }),
    ).toBeInTheDocument();
    expect(botaoExportar).toBeEnabled();

    fireEvent.click(
      screen.getByRole("button", { name: "Fechar modal de download" }),
    );
    expect(
      screen.queryByRole("dialog", { name: "Central de Downloads" }),
    ).not.toBeInTheDocument();
  });

  it("apresenta erro quando não consegue exportar o PDF", async () => {
    mockExportarPDFRelatorioFiscalizacao.mockResolvedValue({
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    });
    renderizarListagem({
      objetos: [relatorioFinalizado],
      perfilNutriSupervisao: true,
    });

    fireEvent.click(screen.getByRole("button", { name: "Relatório em PDF" }));

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith(
        "Erro ao baixar PDF. Tente novamente mais tarde",
      );
    });
    expect(
      screen.queryByRole("dialog", { name: "Central de Downloads" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Relatório em PDF" }),
    ).toBeEnabled();
  });
});
