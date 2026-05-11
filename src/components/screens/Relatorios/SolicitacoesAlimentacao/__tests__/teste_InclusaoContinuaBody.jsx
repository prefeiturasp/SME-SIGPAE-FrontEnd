import React from "react";
import { render, act, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { InclusaoContinuaBody } from "../componentes/InclusaoContinuaBody";

import { mockItemInclusaoContinua } from "src/mocks/Relatorios/SolicitacoesAlimentacao/mockItens/mockItemInclusaoContinua";
import { mockFiltrosInclusao } from "src/mocks/Relatorios/SolicitacoesAlimentacao/mockFiltrosSuspensao";
import { mockSolicitacaoInclusaoContinua } from "src/mocks/Relatorios/SolicitacoesAlimentacao/mockSolicitacoes/mockSolicitacaoInclusaoContinua";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
}));

describe("Teste <InclusaoContinuaBody>", () => {
  const index = 1;
  const renderComponent = async ({
    solicitacao = mockSolicitacaoInclusaoContinua,
    item = mockItemInclusaoContinua,
  } = {}) => {
    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <table>
            <tbody>
              <InclusaoContinuaBody
                solicitacao={solicitacao}
                item={item}
                index={index}
                filtros={mockFiltrosInclusao}
                key={index}
                labelData="Data de Autorização"
              />
            </tbody>
          </table>
        </MemoryRouter>,
      );
    });
  };

  const expandirDetalhes = () => {
    const botaoExpandir = document.querySelector(".fas.fa-angle-down");
    fireEvent.click(botaoExpandir);
  };

  const quantidadeBase = mockSolicitacaoInclusaoContinua.quantidades_periodo[0];

  it("Testa a renderização dos elementos da Tabela", async () => {
    await renderComponent();
    expandirDetalhes();

    const observacao = screen.getByText("TESTE REVIEW");
    expect(observacao).toBeInTheDocument();
  });

  it("exibe a coluna de encerramento e o histórico de alteração quando o encerramento é parcial", async () => {
    const solicitacaoComEncerramentoParcial = {
      ...mockSolicitacaoInclusaoContinua,
      motivo: {
        ...mockSolicitacaoInclusaoContinua.motivo,
        nome: "Programas/Projetos Contínuos",
      },
      quantidades_periodo: [
        {
          ...quantidadeBase,
          encerrado_a_partir_de: "31/10/2025",
          cancelado_justificativa:
            "Encerramento do projeto no período noturno.",
        },
        {
          ...quantidadeBase,
          uuid: "segunda-quantidade",
          periodo_escolar: {
            ...quantidadeBase.periodo_escolar,
            nome: "INTEGRAL",
          },
          numero_alunos: 21,
          observacao: "<p>SEM ENCERRAMENTO</p>",
          encerrado_a_partir_de: null,
        },
      ],
      logs: [
        ...mockSolicitacaoInclusaoContinua.logs,
        {
          status_evento_explicacao: "Escola alterou",
          criado_em: "07/10/2025 15:00:18",
          justificativa: "Encerramento do projeto no período noturno.",
        },
      ],
    };

    await renderComponent({ solicitacao: solicitacaoComEncerramentoParcial });
    expandirDetalhes();

    const dataEncerramento = screen.getByText("31/10/2025", { selector: "b" });

    expect(screen.getByText("Encerrado a partir de:")).toBeInTheDocument();
    expect(dataEncerramento).toHaveClass("color-red");
    expect(dataEncerramento.closest("div")).toHaveClass(
      "encerrado-a-partir-relatorio-sol-alim",
    );
    expect(dataEncerramento.closest("div")).not.toHaveClass(
      "numero-alunos-relatorio-sol-alim",
    );
    expect(screen.getByText("Histórico de alteração")).toBeInTheDocument();
    expect(
      screen.getByText(
        /NOITE - Refeição, Sobremesa - 10 - Encerramento previsto para: 31\/10\/2025/,
      ),
    ).toBeInTheDocument();
  });

  it("não exibe a coluna de encerramento quando todas as quantidades encerram na mesma data", async () => {
    const solicitacaoComMesmaDataEncerramento = {
      ...mockSolicitacaoInclusaoContinua,
      data_inicial: "12/05/2026",
      data_final: "31/12/2026",
      motivo: {
        ...mockSolicitacaoInclusaoContinua.motivo,
        nome: "Programas/Projetos Contínuos",
      },
      quantidades_periodo: [
        {
          ...quantidadeBase,
          encerrado_a_partir_de: "21/05/2026",
        },
        {
          ...quantidadeBase,
          uuid: "segunda-quantidade-mesma-data",
          periodo_escolar: {
            ...quantidadeBase.periodo_escolar,
            nome: "INTEGRAL",
          },
          numero_alunos: 21,
          encerrado_a_partir_de: "21/05/2026",
        },
      ],
    };

    await renderComponent({ solicitacao: solicitacaoComMesmaDataEncerramento });
    expandirDetalhes();

    expect(
      screen.queryByText("Encerrado a partir de:"),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText("31/12/2026", { selector: "s" }),
    ).toBeInTheDocument();
    expect(screen.getByText("21/05/2026", { selector: "span" })).toHaveClass(
      "color-red",
    );
  });

  it("exibe o histórico de cancelamento quando há quantidade cancelada mesmo sem justificativa", async () => {
    const solicitacaoComCancelamento = {
      ...mockSolicitacaoInclusaoContinua,
      quantidades_periodo: [
        {
          ...quantidadeBase,
          cancelado: true,
          cancelado_justificativa: "",
        },
      ],
    };

    await renderComponent({ solicitacao: solicitacaoComCancelamento });
    expandirDetalhes();

    expect(screen.getByText("Histórico de cancelamento")).toBeInTheDocument();
    expect(
      screen.getByText(/NOITE - Refeição, Sobremesa - 10 - justificativa:/),
    ).toBeInTheDocument();
  });
});
