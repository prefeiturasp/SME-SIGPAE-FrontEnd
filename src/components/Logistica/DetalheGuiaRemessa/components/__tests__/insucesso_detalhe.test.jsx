import { act, render, screen } from "@testing-library/react";
import InsucessoDetalhe from "../InsucessoDetalhe";

describe("Componente InsucessoDetalhe", () => {
  const mockData = {
    criado_em: "10/12/2025",
    hora_tentativa: "14:30",
    nome_motorista: "Carlos Alberto",
    placa_veiculo: "ABC-1234",
    motivo: "Endereço incorreto",
    justificativa: "Cliente não atendeu ao telefone",
    arquivo: "https://example.com/imagem.jpg",
  };

  const setup = (insucesso = mockData) => {
    act(() => {
      render(<InsucessoDetalhe insucesso={insucesso} />);
    });
  };

  it("renderiza todos os campos corretamente", () => {
    setup();

    expect(
      screen.getByText("Registro de Insucesso de Entrega"),
    ).toBeInTheDocument();

    expect(screen.getByText("Dados do Insucesso")).toBeInTheDocument();

    expect(
      screen.getByText("Data do registro do insucesso:"),
    ).toBeInTheDocument();
    expect(screen.getByText(mockData.criado_em)).toBeInTheDocument();

    expect(screen.getByText("Hora da Entrega:")).toBeInTheDocument();
    expect(screen.getByText(mockData.hora_tentativa)).toBeInTheDocument();

    expect(screen.getByText("Nome do Motorista:")).toBeInTheDocument();
    expect(screen.getByText(mockData.nome_motorista)).toBeInTheDocument();

    expect(screen.getByText("Placa do Veículo:")).toBeInTheDocument();
    expect(screen.getByText(mockData.placa_veiculo)).toBeInTheDocument();

    expect(screen.getByText("Motivo:")).toBeInTheDocument();
    expect(screen.getByText(mockData.motivo)).toBeInTheDocument();

    expect(screen.getByText("Justificativa:")).toBeInTheDocument();
    expect(screen.getByText(mockData.justificativa)).toBeInTheDocument();
  });

  it("renderiza a imagem quando arquivo existe", () => {
    setup();

    const img = screen.getByAltText(
      "Imagem descritiva do Insucesso de Entrega",
    );
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", mockData.arquivo);
  });

  it("não renderiza a imagem quando arquivo é nulo", () => {
    const semImagem = { ...mockData, arquivo: null };
    setup(semImagem);

    const img = screen.queryByAltText(
      "Imagem descritiva do Insucesso de Entrega",
    );
    expect(img).toBeNull();
  });
});
