import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CorpoRelatorio from "src/components/SuspensaoAlimentacaoDeCEI/Relatorio/components/CorpoRelatorio";

import { imprimeRelatorioSuspensaoAlimentacao } from "src/services/relatorios";

jest.mock("src/services/relatorios", () => ({
  imprimeRelatorioSuspensaoAlimentacao: jest.fn(),
}));

const mockSolicitacao = {
  uuid: "d5db592e-df84-4e06-80f3-9f2964ddc3a1",
  id_externo: "2024.1000",
  data: "20/05/2024",
  observacao: "Texto com <b>negrito</b>",
  outro_motivo: "Reforma urgente da cozinha",
  motivo: { nome: "Outro Motivo" },
  escola: {
    nome: "EMEF Teste",
    codigo_eol: "123456",
    quantidade_alunos: 100,
    diretoria_regional: { nome: "DRE IPIRANGA" },
    lote: { nome: "Lote 05" },
    tipo_gestao: { nome: "Terceirizada" },
    periodos_escolares: [
      {
        nome: "MANHA",
        tipos_alimentacao: [{ nome: "Lanche" }, { nome: "Refeição" }],
      },
    ],
  },
  rastro_terceirizada: { nome_fantasia: "Empresa Alimenta" },
  periodos_escolares: [{ nome: "MANHA" }],
  logs: [],
};

const renderComponent = () => {
  return render(<CorpoRelatorio solicitacaoSuspensao={mockSolicitacao} />);
};

describe("Testa o componente CorpoRelatorio", () => {
  it("deve renderizar os dados principais da escola e solicitação", () => {
    renderComponent();

    expect(screen.getByText("2024.1000")).toBeInTheDocument();
    expect(screen.getByText("EMEF Teste")).toBeInTheDocument();
    expect(screen.getByText("123456")).toBeInTheDocument();
    expect(screen.getByText("DRE IPIRANGA")).toBeInTheDocument();
    expect(screen.getByText("Empresa Alimenta")).toBeInTheDocument();
  });

  it("deve exibir o 'outro_motivo' quando o motivo principal contiver a palavra 'Outro'", () => {
    renderComponent();
    expect(screen.getByText("Reforma urgente da cozinha")).toBeInTheDocument();
  });

  it("deve renderizar a tabela de períodos corretamente", () => {
    renderComponent();

    expect(screen.getByText("MANHA")).toBeInTheDocument();
    expect(screen.getByText(/Lanche, Refeição/i)).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  it("deve renderizar observações processando o HTML (dangerouslySetInnerHTML)", () => {
    renderComponent();

    const obsContainer = screen.getByText("Texto com");
    expect(obsContainer.innerHTML).toContain("<b>negrito</b>");
  });

  it("deve chamar a função de impressão com os parâmetros corretos ao clicar no botão", () => {
    renderComponent();

    const btnPrint = screen.getByRole("button");
    fireEvent.click(btnPrint);

    expect(imprimeRelatorioSuspensaoAlimentacao).toHaveBeenCalledWith(
      "d5db592e-df84-4e06-80f3-9f2964ddc3a1",
      "EMEF Teste",
      true,
    );
  });
});
