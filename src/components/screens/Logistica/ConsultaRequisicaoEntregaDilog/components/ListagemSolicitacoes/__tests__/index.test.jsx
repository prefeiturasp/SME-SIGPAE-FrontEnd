import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ListagemSolicitacoes from "..";
import mock from "src/services/_mock";

const mockSetShowDownload = jest.fn();
const mockArquivaDesarquivaGuias = jest.fn();
const mockSetSelecionados = jest.fn();
const mockSetAtivos = jest.fn();

const solicitacao1 = {
  uuid: "sol-1",
  numero_solicitacao: "123456",
  status: "Aguardando envio",
  distribuidor_nome: "Distribuidor A",
  checked: false,
  guias: [
    {
      numero_guia: "G001",
      situacao: "ATIVA",
      status: "Confirmada",
      nome_unidade: "UE 1",
      data_entrega: "01/01/2024",
    },
  ],
};

const solicitacao2 = {
  uuid: "sol-2",
  numero_solicitacao: "789012",
  status: "Enviada",
  distribuidor_nome: "Distribuidor B",
  checked: false,
  guias: [
    {
      numero_guia: "G002",
      situacao: "ATIVA",
      status: "Confirmada",
      nome_unidade: "UE 2",
      data_entrega: "05/01/2024",
    },
  ],
};

const defaultProps = {
  solicitacoes: [solicitacao1, solicitacao2],
  ativos: [],
  setAtivos: mockSetAtivos,
  selecionados: [],
  setSelecionados: mockSetSelecionados,
  arquivaDesarquivaGuias: mockArquivaDesarquivaGuias,
  setShowDownload: mockSetShowDownload,
  somenteLeitura: false,
};

const renderComponent = (props = {}) => {
  jest.clearAllMocks();
  return render(<ListagemSolicitacoes {...defaultProps} {...props} />);
};

describe("ListagemSolicitacoes", () => {
  describe("Renderizacao", () => {
    it("renderiza o cabecalho da tabela", () => {
      renderComponent();
      expect(
        screen.getByText(/Requisi.*es Disponibilizadas/),
      ).toBeInTheDocument();
      expect(screen.getByText("Distribuidor")).toBeInTheDocument();
      expect(screen.getByText("Status")).toBeInTheDocument();
      expect(screen.getByText("Data de Entrega")).toBeInTheDocument();
      expect(screen.getByText("Exportar Relat\u00f3rio")).toBeInTheDocument();
      expect(
        screen.getByText("Exportar Requisi\u00e7\u00e3o"),
      ).toBeInTheDocument();
    });

    it("renderiza dados das solicitacoes", () => {
      renderComponent();
      expect(screen.getByText("123456")).toBeInTheDocument();
      expect(screen.getByText("789012")).toBeInTheDocument();
      expect(screen.getByText("Distribuidor A")).toBeInTheDocument();
      expect(screen.getByText("Distribuidor B")).toBeInTheDocument();
      expect(screen.getByText("Aguardando envio")).toBeInTheDocument();
      expect(screen.getByText("Enviada")).toBeInTheDocument();
    });
  });

  describe("Checkboxes", () => {
    it("renderiza checkboxes para cada solicitacao", () => {
      renderComponent();
      const wrappers = document.querySelectorAll(".ant-checkbox-input");
      expect(wrappers).toHaveLength(3);
    });

    it("checkSolicitacao marca uma solicitacao individualmente", () => {
      renderComponent();
      const checkbox = document.querySelectorAll(".ant-checkbox-input")[1];
      fireEvent.click(checkbox);
      expect(mockSetSelecionados).toHaveBeenCalled();
    });

    it("checkSolicitacao desmarca solicitacao ja marcada", () => {
      renderComponent({
        solicitacoes: [{ ...solicitacao1, checked: true }, solicitacao2],
      });
      const checkbox = document.querySelectorAll(".ant-checkbox-input")[1];
      fireEvent.click(checkbox);
      expect(mockSetSelecionados).toHaveBeenCalled();
    });

    it("checkAll marca todas as solicitacoes", () => {
      renderComponent();
      const checkAllCheckbox = document.querySelectorAll(
        ".ant-checkbox-input",
      )[0];
      fireEvent.click(checkAllCheckbox);
      expect(mockSetSelecionados).toHaveBeenCalled();
    });
  });

  describe("Expandir/Recolher", () => {
    it("expande solicitacao ao clicar no icone plus", () => {
      renderComponent();
      const plusIcon = document.querySelector(".fa-plus");
      fireEvent.click(plusIcon);
      expect(mockSetAtivos).toHaveBeenCalledWith(["sol-1"]);
    });

    it("recolhe solicitacao ao clicar no icone minus", () => {
      renderComponent({ ativos: ["sol-1"] });
      const minusIcon = document.querySelector(".fa-minus");
      fireEvent.click(minusIcon);
      expect(mockSetAtivos).toHaveBeenCalledWith([]);
    });
  });

  describe("Acoes de download", () => {
    it("chama gerarExcelSolicitacoes ao clicar em Planilha", async () => {
      mock.onGet(/solicitacao-remessa\/.*exporta-excel/).reply(200, {});
      renderComponent();
      const botoesPlanilha = screen.getAllByText("Planilha");
      fireEvent.click(botoesPlanilha[0]);
      await waitFor(() => {
        expect(mockSetShowDownload).toHaveBeenCalledWith(true);
      });
    });

    it("chama imprimirGuiasDaSolicitacao ao clicar em PDF", async () => {
      mock.onGet(/solicitacao-remessa\/.*relatorio-guias/).reply(200, {});
      renderComponent();
      const botoesPDF = screen.getAllByText("PDF");
      fireEvent.click(botoesPDF[0]);
      await waitFor(() => {
        expect(mockSetShowDownload).toHaveBeenCalledWith(true);
      });
    });
  });

  describe("useEffect", () => {
    it("reseta selecao quando solicitacoes muda", () => {
      const { rerender } = renderComponent({
        selecionados: [solicitacao1],
        ativos: ["sol-1"],
        solicitacoes: [{ ...solicitacao1, checked: true }, solicitacao2],
      });
      rerender(
        <ListagemSolicitacoes
          {...defaultProps}
          solicitacoes={[solicitacao2]}
        />,
      );
      expect(mockSetSelecionados).toHaveBeenCalledWith([]);
    });
  });

  describe("Prop somenteLeitura", () => {
    it("renderiza ListagemGuias quando expandido", () => {
      renderComponent({ ativos: ["sol-1"] });
      expect(screen.getByText("Guia(s) Ativa(s)")).toBeInTheDocument();
    });
  });
});
