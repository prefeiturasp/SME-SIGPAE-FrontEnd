import { fireEvent, render, screen } from "@testing-library/react";
import useSomenteLeitura from "src/hooks/useSomenteLeitura";
import ListagemSolicitacoes from "../components/ListagemSolicitacoes";
import { BOTAO_ACEITAR, BOTAO_NEGAR } from "../constans";

jest.mock("../components/AlimentosConsolidado", () => ({
  __esModule: true,
  default: () => <div data-testid="alimentos-consolidado" />,
}));

jest.mock("../components/Alterar", () => ({
  __esModule: true,
  default: ({ acao }: { acao: string }) => (
    <button data-testid={`alterar-${acao}`}>{acao}</button>
  ),
}));

jest.mock("src/hooks/useSomenteLeitura", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const solicitacaoBase = {
  uuid: "uuid-1",
  numero_solicitacao: "SOL-001",
  requisicao: { numero_solicitacao: "REQ-001" },
  qtd_guias: 3,
  nome_distribuidor: "D",
  status: "Em análise",
  data_entrega: "01/01",
  criado_em: "10/12",
  motivo: "MOTIVO_A,MOTIVO_B",
  justificativa: "J",
};

describe("ListagemSolicitacoes", () => {
  const mockSetAtivos = jest.fn();
  const mockUpdatePage = jest.fn();

  const setup = (props = {}) => {
    const defaultProps = {
      solicitacoes: [solicitacaoBase],
      ativos: [],
      setAtivos: mockSetAtivos,
      updatePage: mockUpdatePage,
    };
    return render(<ListagemSolicitacoes {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useSomenteLeitura as jest.Mock).mockReturnValue(false);
  });

  it("deve exibir botão 'Analisar' quando status for 'Em análise' e não for somente leitura", () => {
    setup();
    expect(screen.getByText("Analisar")).toBeInTheDocument();
  });

  it("deve exibir botão 'Visualizar' quando o hook 'useSomenteLeitura' retornar true", () => {
    (useSomenteLeitura as jest.Mock).mockReturnValue(true);
    setup();
    expect(screen.getByText("Visualizar")).toBeInTheDocument();
  });

  it("deve exibir botão 'Visualizar' quando o status da solicitação não for 'Em análise'", () => {
    setup({ solicitacoes: [{ ...solicitacaoBase, status: "Finalizado" }] });
    expect(screen.getByText("Visualizar")).toBeInTheDocument();
  });

  it("deve criar um novo array de ativos se o valor inicial for nulo ao clicar em Analisar", () => {
    setup({ ativos: null });
    fireEvent.click(screen.getByText("Analisar"));
    expect(mockSetAtivos).toHaveBeenCalledWith(["uuid-1"]);
  });

  it("deve adicionar o uuid ao array de ativos existentes ao clicar em Analisar", () => {
    setup({ ativos: ["uuid-existente"] });
    fireEvent.click(screen.getByText("Analisar"));
    expect(mockSetAtivos).toHaveBeenCalledWith(["uuid-existente", "uuid-1"]);
  });

  it("deve remover o uuid do array de ativos se ele já estiver presente", () => {
    setup({ ativos: ["uuid-1"] });
    fireEvent.click(screen.getByText("Analisar"));
    expect(mockSetAtivos).toHaveBeenCalledWith([]);
  });

  it("deve formatar a string de motivo substituindo vírgula por barra quando expandido", () => {
    setup({ ativos: ["uuid-1"] });
    expect(screen.getByText("MOTIVO_A /MOTIVO_B")).toBeInTheDocument();
  });

  it("deve exibir as justificativas de aceite e negação se estiverem presentes nos dados", () => {
    setup({
      ativos: ["uuid-1"],
      solicitacoes: [
        {
          ...solicitacaoBase,
          justificativa_aceite: "Sim",
          justificativa_negacao: "Não",
        },
      ],
    });
    expect(screen.getByText("Sim")).toBeInTheDocument();
    expect(screen.getByText("Não")).toBeInTheDocument();
  });

  it("deve renderizar os componentes de Alimentos e Ações de Alterar apenas nas condições de edição", () => {
    setup({ ativos: ["uuid-1"] });
    expect(screen.getByTestId("alimentos-consolidado")).toBeInTheDocument();
    expect(screen.getByTestId(`alterar-${BOTAO_ACEITAR}`)).toBeInTheDocument();
    expect(screen.getByTestId(`alterar-${BOTAO_NEGAR}`)).toBeInTheDocument();
  });

  it("não deve renderizar os botões de Aceitar/Negar se o status não permitir", () => {
    setup({
      ativos: ["uuid-1"],
      solicitacoes: [{ ...solicitacaoBase, status: "Aceito" }],
    });
    expect(
      screen.queryByTestId(`alterar-${BOTAO_ACEITAR}`),
    ).not.toBeInTheDocument();
  });

  it("deve lidar corretamente com uma lista de solicitações vazia", () => {
    setup({ solicitacoes: [] });
    expect(
      screen.getByText("Solicitações Disponibilizadas"),
    ).toBeInTheDocument();
  });
});
