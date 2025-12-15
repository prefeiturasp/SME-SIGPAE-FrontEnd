import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import ConferenciaDetalhe from "../ConferenciaDetalhe";

describe("Componente Conferência Detalhe", () => {
  const mockConferencia = {
    data_recebimento: "10/09/2025",
    hora_recebimento: "14:30",
    criado_por: { nome: "João da Silva" },
    nome_motorista: "Carlos Motorista",
    placa_veiculo: "ABC-1234",
    conferencia_dos_alimentos: [
      {
        nome_alimento: "Arroz Tipo 1",
        embalagens: [
          {
            tipo_embalagem: "FECHADA",
            qtd_volume: 10,
            capacidade_completa: "5kg",
            qtd_recebido: 10,
            status_alimento: "Recebido",
            ocorrencia: null,
          },
          {
            tipo_embalagem: "FRACIONADA",
            qtd_volume: 5,
            capacidade_completa: "1kg",
            qtd_recebido: 5,
            status_alimento: "Recebido",
            ocorrencia: null,
          },
        ],
      },
      {
        nome_alimento: "Feijão Carioca",
        embalagens: [
          {
            tipo_embalagem: "FECHADA",
            qtd_volume: 8,
            capacidade_completa: "2kg",
            qtd_recebido: 4,
            status_alimento: "Parcial",
            ocorrencia: "Pacote rasgado",
            observacao: "Produto chegou aberto",
            nome_alimento: "Feijão Carioca",
            arquivo: "https://exemplo.com/img.jpg",
          },
          {
            tipo_embalagem: "FRACIONADA",
            qtd_volume: 4,
            capacidade_completa: "1kg",
            qtd_recebido: 0,
            status_alimento: "Parcial",
            ocorrencia: "Pacote rasgado",
          },
        ],
      },
    ],
  };

  const mockGuia = { nome_unidade: "EMEF José Bonifácio" };

  const setup = ({ conferencia, reposicaoFlag = false, guia }) => {
    act(() => {
      render(
        <ConferenciaDetalhe
          conferencia={conferencia}
          reposicaoFlag={reposicaoFlag}
          guia={guia}
        />,
      );
    });
  };

  it("renderiza título correto quando reposicaoFlag = false", () => {
    setup({
      conferencia: mockConferencia,
      reposicaoFlag: false,
      guia: mockGuia,
    });
    expect(
      screen.getByText("1ª Conferência da guia de remessa"),
    ).toBeInTheDocument();
  });

  it("renderiza título de reposição quando reposicaoFlag = true", () => {
    setup({
      conferencia: mockConferencia,
      reposicaoFlag: true,
      guia: mockGuia,
    });
    expect(
      screen.getByText("Reposição de itens faltantes"),
    ).toBeInTheDocument();
  });

  it("renderiza dados principais da tabela e informações do recebimento", () => {
    setup({
      conferencia: mockConferencia,
      reposicaoFlag: false,
      guia: mockGuia,
    });
    expect(screen.getByText("Arroz Tipo 1")).toBeInTheDocument();
    expect(screen.getByText("Feijão Carioca")).toBeInTheDocument();
    expect(screen.getAllByText("10")[0]).toBeInTheDocument();
    expect(screen.getAllByText("5kg")[0]).toBeInTheDocument();
    const recebidos = screen.getAllByText("Recebido", { selector: "strong" });
    expect(recebidos.length).toBeGreaterThan(0);
    const parciais = screen.getAllByText("Parcial", { selector: "strong" });
    expect(parciais.length).toBeGreaterThan(0);
    expect(screen.getByText("Parcial")).toBeInTheDocument();
    expect(screen.getByText("João da Silva")).toBeInTheDocument();
    expect(screen.getByText("14:30")).toBeInTheDocument();
    expect(screen.getByText("Carlos Motorista")).toBeInTheDocument();
    expect(screen.getByText("ABC-1234")).toBeInTheDocument();
    expect(screen.getByText("EMEF José Bonifácio")).toBeInTheDocument();
  });

  it("renderiza ocorrência quando existir", () => {
    setup({
      conferencia: mockConferencia,
      reposicaoFlag: false,
      guia: mockGuia,
    });
    expect(screen.getByText("Ocorrência:")).toBeInTheDocument();
    expect(screen.getByText("Produto: Feijão Carioca")).toBeInTheDocument();
    expect(screen.getByText("Pacote rasgado")).toBeInTheDocument();
    expect(screen.getByText("Produto chegou aberto")).toBeInTheDocument();
    const img = screen.getByAltText("Imagem descritiva da Ocorrência");
    expect(img).toBeInTheDocument();
    expect(img.src).toContain("https://exemplo.com/img.jpg");
  });
});
