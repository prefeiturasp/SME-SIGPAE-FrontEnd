import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import { SolicitacoesSimilaresInclusaoNormal } from "../../../SolicitacoesSimilaresInclusao/Normal";

jest.mock("react-collapse", () => ({
  Collapse: ({ isOpened, children }) =>
    isOpened ? <tbody data-testid="collapse-aberto">{children}</tbody> : null,
}));

const logs = [
  {
    criado_em: "20/05/2026 10:00:00",
    status_evento_explicacao: "CODAE autorizou",
  },
];

const solicitacaoNormal = {
  collapsed: true,
  id_externo: "ABC123",
  motivo: { nome: "Reposição de aula" },
  inclusoes: [
    {
      data: "01/06/2026",
      cancelado: false,
      cancelado_justificativa: "",
    },
    {
      data: "02/06/2026",
      cancelado: true,
      cancelado_justificativa: "Não haverá aula",
    },
  ],
  quantidades_periodo: [
    {
      periodo_escolar: { nome: "MANHA" },
      tipos_alimentacao: [{ nome: "Lanche" }],
      dias_semana: [],
      numero_alunos: 10,
      observacao: "",
      cancelado: false,
      cancelado_justificativa: "",
      inclusao_alimentacao_continua: null,
    },
  ],
  logs,
};

const solicitacaoContinuaCancelada = {
  collapsed: true,
  id_externo: "CONT1",
  motivo: { nome: "Programas/Projetos Contínuos" },
  data_inicial: "01/06/2026",
  data_final: "30/06/2026",
  quantidades_periodo: [
    {
      periodo_escolar: { nome: "MANHA" },
      tipos_alimentacao: [{ nome: "Lanche" }],
      dias_semana: [1, 2],
      numero_alunos: 10,
      observacao: "",
      cancelado: true,
      cancelado_justificativa: "Cancelado pela escola",
      inclusao_alimentacao_continua: 10,
    },
  ],
  logs,
};

const renderNormal = (solicitacao, index = 0) => {
  return render(
    <table>
      <SolicitacoesSimilaresInclusaoNormal
        solicitacao={solicitacao}
        index={index}
      />
    </table>,
  );
};

describe("SolicitacoesSimilaresInclusaoNormal", () => {
  it("renderiza as datas de inclusão", () => {
    renderNormal(solicitacaoNormal);

    expect(screen.getByText("Dia(s) de inclusão:")).toBeInTheDocument();
    expect(screen.getByText("01/06/2026")).toBeInTheDocument();
    expect(screen.getByText("02/06/2026")).toBeInTheDocument();
  });

  it("risca a data cancelada e exibe a justificativa abaixo", () => {
    renderNormal(solicitacaoNormal);

    const dataCancelada = screen
      .getByText("02/06/2026")
      .closest(".data-inclusao");
    expect(dataCancelada).toHaveClass("cancelado");

    const justificativa = screen.getByText("justificativa:");
    expect(justificativa.parentElement).toHaveTextContent("Não haverá aula");
  });

  it("não aplica o estilo de cancelamento em datas não canceladas", () => {
    renderNormal(solicitacaoNormal);

    const dataNormal = screen.getByText("01/06/2026").closest(".data-inclusao");
    expect(dataNormal).not.toHaveClass("cancelado");
  });

  it("risca as datas DE/ATÉ quando todas as quantidades do período estão canceladas", () => {
    renderNormal(solicitacaoContinuaCancelada);

    expect(screen.getByText("01/06/2026").closest("p")).toHaveClass(
      "data-periodo-cancelado",
    );
    expect(screen.getByText("30/06/2026").closest("p")).toHaveClass(
      "data-periodo-cancelado",
    );

    const justificativas = screen.getAllByText("justificativa:");
    expect(
      justificativas.some((element) =>
        element.parentElement.textContent.includes("Cancelado pela escola"),
      ),
    ).toBe(true);
  });

  it("marca a linha do período cancelado e exibe a justificativa", () => {
    renderNormal(solicitacaoContinuaCancelada);

    const linhaCancelada = screen.getByText("MANHA").closest("tr.cancelado");
    expect(linhaCancelada).toBeInTheDocument();
    expect(linhaCancelada).toHaveClass("cancelado");
  });

  it("não risca as datas DE/ATÉ quando o período não está cancelado", () => {
    renderNormal(solicitacaoNormal);

    expect(screen.queryByText("DE:")).not.toBeInTheDocument();
    expect(screen.queryByText("ATÉ:")).not.toBeInTheDocument();
  });
});
