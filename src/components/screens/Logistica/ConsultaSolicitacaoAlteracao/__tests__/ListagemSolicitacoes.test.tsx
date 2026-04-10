import { act, fireEvent, render, screen } from "@testing-library/react";
import ListagemSolicitacoes from "../components/ListagemSolicitacoes";

jest.mock("../components/AlimentosConsolidado", () => ({
  __esModule: true,
  default: () => <div data-testid="alimentos-consolidado" />,
}));

const mockSolicitacao = {
  uuid: "uuid-1",
  numero_solicitacao: "SOL-001",
  requisicao: { numero_solicitacao: "REQ-001" },
  qtd_guias: 3,
  nome_distribuidor: "Distribuidor A",
  status: "PENDENTE",
  data_entrega: "01/01/2025",
  criado_em: "15/12/2024",
  motivo: "MOTIVO_A,MOTIVO_B",
  justificativa: "Justificativa teste",
  justificativa_aceite: null,
  justificativa_negacao: null,
};

const renderComponent = (props) => render(<ListagemSolicitacoes {...props} />);

describe("ListagemSolicitacoes", () => {
  it("deve renderizar o cabeçalho e os dados da solicitação", () => {
    renderComponent({
      solicitacoes: [mockSolicitacao],
      ativos: [],
      setAtivos: jest.fn(),
    });

    expect(
      screen.getByText("Solicitações Disponibilizadas"),
    ).toBeInTheDocument();
    expect(screen.getByText("SOL-001")).toBeInTheDocument();
    expect(screen.getByText("REQ-001")).toBeInTheDocument();
    expect(screen.getByText("Distribuidor A")).toBeInTheDocument();
    expect(screen.getByText("PENDENTE")).toBeInTheDocument();
    expect(screen.getByText("01/01/2025")).toBeInTheDocument();
  });

  it("deve expandir detalhes ao clicar no ícone plus", async () => {
    const setAtivos = jest.fn();
    renderComponent({ solicitacoes: [mockSolicitacao], ativos: [], setAtivos });

    await act(async () => {
      fireEvent.click(document.querySelector(".fa-plus"));
    });

    expect(setAtivos).toHaveBeenCalledWith(["uuid-1"]);
  });

  it("deve recolher ao clicar no ícone minus", async () => {
    const setAtivos = jest.fn();
    renderComponent({
      solicitacoes: [mockSolicitacao],
      ativos: ["uuid-1"],
      setAtivos,
    });

    await act(async () => {
      fireEvent.click(document.querySelector(".fa-minus"));
    });

    expect(setAtivos).toHaveBeenCalledWith([]);
  });

  it("deve exibir justificativa_aceite quando presente", () => {
    const solicitacao = {
      ...mockSolicitacao,
      justificativa_aceite: "Aceito por X",
    };
    renderComponent({
      solicitacoes: [solicitacao],
      ativos: ["uuid-1"],
      setAtivos: jest.fn(),
    });

    expect(screen.getByText("Aceito por X")).toBeInTheDocument();
  });

  it("deve exibir justificativa_negacao quando presente", () => {
    const solicitacao = {
      ...mockSolicitacao,
      justificativa_negacao: "Negado por Y",
    };
    renderComponent({
      solicitacoes: [solicitacao],
      ativos: ["uuid-1"],
      setAtivos: jest.fn(),
    });

    expect(screen.getByText("Negado por Y")).toBeInTheDocument();
  });

  it("deve adicionar uuid ao array existente ao expandir", async () => {
    const setAtivos = jest.fn();
    const solicitacao2 = {
      ...mockSolicitacao,
      uuid: "uuid-2",
      numero_solicitacao: "SOL-002",
    };
    renderComponent({
      solicitacoes: [mockSolicitacao, solicitacao2],
      ativos: ["uuid-1"],
      setAtivos,
    });

    await act(async () => {
      fireEvent.click(document.querySelectorAll(".fa-plus")[0]);
    });

    expect(setAtivos).toHaveBeenCalledWith(["uuid-1", "uuid-2"]);
  });
});
