import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { mockDietasAtivasInativas } from "src/mocks/DietaEspecial/mockAtivasInativasEMEFPericles";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockMeusDadosCODAEGA } from "src/mocks/meusDados/CODAE-GA";
import TabelaResultados from "..";

describe("Tabela de Resultados - Consulta de Dietas Alunos", () => {
  beforeEach(async () => {
    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <MeusDadosContext.Provider
            value={{
              meusDados: mockMeusDadosCODAEGA,
              setMeusDados: jest.fn(),
            }}
          >
            <TabelaResultados dadosDietaPorAluno={mockDietasAtivasInativas} />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      );
    });
  });

  it("Renderiza o cabeçalho com totais corretos", () => {
    expect(screen.getByText(/Total de Dietas Ativas/i)).toHaveTextContent(
      "Total de Dietas Ativas: 28"
    );
    expect(screen.getByText(/Total de Dietas Inativas/i)).toHaveTextContent(
      "Total de Dietas Inativas: 0"
    );
  });

  it("Renderiza corretamente o primeiro aluno do mock", () => {
    const aluno = mockDietasAtivasInativas.solicitacoes[0];

    expect(screen.getByDisplayValue(aluno.codigo_eol)).toBeInTheDocument();
    expect(screen.getByDisplayValue(aluno.nome)).toBeInTheDocument();

    const ativasElement = screen.getAllByText(aluno.ativas.toString())[0];
    expect(ativasElement).toBeInTheDocument();

    const inativasElement = screen.getAllByText(aluno.inativas.toString())[0];
    expect(inativasElement).toBeInTheDocument();

    const classificacaoElement = screen.getAllByText(
      aluno.classificacao_dieta_ativa
    )[0];
    expect(classificacaoElement).toBeInTheDocument();
  });

  it("Renderiza link correto no botão 'Visualizar'", () => {
    mockDietasAtivasInativas.solicitacoes.forEach((aluno) => {
      const link = screen.getAllByText("Visualizar").find((btn) =>
        btn
          .closest("a")
          .getAttribute("href")
          .includes(aluno.codigo_eol || "")
      );
      expect(link).toBeInTheDocument();
    });
  });
});
