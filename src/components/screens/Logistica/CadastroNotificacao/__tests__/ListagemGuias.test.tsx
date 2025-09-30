import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import ListagemSolicitacoes from "../components/ListagemGuias/index";

describe("ListagemSolicitacoes", () => {
  const mockGuias = [
    {
      uuid: "1",
      numero_guia: "G001",
      nome_distribuidor: "Distribuidora A",
      data_entrega: "2025-10-01",
      status: "Pendente",
    },
    {
      uuid: "2",
      numero_guia: "G002",
      nome_distribuidor: "Distribuidora B",
      data_entrega: "2025-10-02",
      status: "Entregue",
    },
  ];

  const vincularGuia = jest.fn();
  const desvincularGuia = jest.fn();
  const buscarDetalheGuia = jest.fn();

  const renderComponent = (guiasVinculadas = []) =>
    render(
      <ListagemSolicitacoes
        guias={mockGuias}
        vincularGuia={vincularGuia}
        guiasVinculadas={guiasVinculadas}
        desvincularGuia={desvincularGuia}
        buscarDetalheGuia={buscarDetalheGuia}
      />
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza header da tabela", () => {
    renderComponent();
    expect(screen.getByText("Nº da Guia")).toBeInTheDocument();
    expect(screen.getByText("Empresa")).toBeInTheDocument();
    expect(screen.getByText("Data Prevista Entrega")).toBeInTheDocument();
    expect(screen.getByText("Status da Guia")).toBeInTheDocument();
    expect(screen.getByText("Ações")).toBeInTheDocument();
  });

  it("renderiza todas as guias", () => {
    renderComponent();
    expect(screen.getByText("G001")).toBeInTheDocument();
    expect(screen.getByText("Distribuidora A")).toBeInTheDocument();
    expect(screen.getByText("G002")).toBeInTheDocument();
    expect(screen.getByText("Distribuidora B")).toBeInTheDocument();
  });

  it("aplica classe 'green-bg' em guia vinculada", () => {
    const { container } = renderComponent([mockGuias[0]]);
    const linhaVinculada = container.querySelector(".green-bg");
    expect(linhaVinculada).toBeInTheDocument();
    expect(linhaVinculada).toHaveTextContent("G001");
  });

  it("não aplica 'green-bg' em guia não vinculada", () => {
    const { container } = renderComponent([]);
    const linhasVinculadas = container.querySelectorAll(".green-bg");
    expect(linhasVinculadas).toHaveLength(0);
  });

  it("clica no ícone de 'olho' chama buscarDetalheGuia", () => {
    const { container } = renderComponent();
    const iconeOlho = container.querySelector(".fa-eye")!;
    fireEvent.click(iconeOlho.closest("span")!);
    expect(buscarDetalheGuia).toHaveBeenCalledWith(mockGuias[0]);
  });

  it("clica no ícone de 'plus' chama vincularGuia", () => {
    const { container } = renderComponent([]);
    const iconePlus = container.querySelector(".fa-plus");
    fireEvent.click(iconePlus.closest("span"));
    expect(vincularGuia).toHaveBeenCalledWith(mockGuias[0]);
  });

  it("clica no ícone de 'lixeira' chama desvincularGuia", () => {
    const { container } = renderComponent([mockGuias[0]]);
    const iconeLixeira = container.querySelector(".fa-trash-alt");
    fireEvent.click(iconeLixeira.closest("span"));
    expect(desvincularGuia).toHaveBeenCalledWith(mockGuias[0]);
  });

  it("mostra ícone 'plus' para guia não vinculada", () => {
    const { container } = renderComponent([]);
    expect(container.querySelector(".fa-plus")).toBeInTheDocument();
    expect(container.querySelector(".fa-trash-alt")).not.toBeInTheDocument();
  });
});
