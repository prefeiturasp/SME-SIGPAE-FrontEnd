import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import { SolicitacoesSimilaresInclusaoCEI } from "../../../SolicitacoesSimilaresInclusao/CEI";
import { InclusoesCEI } from "src/components/Shareable/SolicitacoesSimilaresInclusao/CEI/InclusoesCEI";

jest.mock("react-collapse", () => ({
  Collapse: ({ isOpened, children }) =>
    isOpened ? <tbody data-testid="collapse-aberto">{children}</tbody> : null,
}));

jest.mock(
  "src/components/Shareable/SolicitacoesSimilaresInclusao/CEI/InclusoesCEI",
  () => ({
    InclusoesCEI: jest.fn(() => (
      <tr data-testid="inclusoes-cei">
        <td>Inclusões CEI</td>
      </tr>
    )),
  }),
);

const solicitacaoComPeriodo = {
  collapsed: true,
  id_externo: "ABC123",
  data_inicial: "01/06/2026",
  data_final: "05/06/2026",
  motivo: {
    nome: "Motivo da solicitação",
  },
  dias_motivos_da_inclusao_cei: [
    {
      data: "01/06/2026",
      motivo: {
        nome: "Motivo fallback",
      },
    },
  ],
  logs: [
    {
      criado_em: "10/06/2026 14:30:00",
      status_evento_explicacao: "CODAE autorizou",
    },
  ],
};

const solicitacaoComDiasInclusao = {
  collapsed: true,
  id_externo: "XYZ789",
  motivo: null,
  dias_motivos_da_inclusao_cei: [
    {
      data: "12/06/2026",
      motivo: {
        nome: "Motivo do dia",
      },
    },
    {
      data: "13/06/2026",
      motivo: {
        nome: "Outro motivo",
      },
    },
  ],
  logs: [
    {
      criado_em: "11/06/2026 09:15:00",
      status_evento_explicacao: "DRE validou",
    },
    {
      criado_em: "12/06/2026 10:20:00",
      status_evento_explicacao: "CODAE questionou",
    },
  ],
};

const renderSolicitacoesSimilaresInclusaoCEI = (solicitacao, index = 0) => {
  return render(
    <table>
      <SolicitacoesSimilaresInclusaoCEI
        solicitacao={solicitacao}
        index={index}
      />
    </table>,
  );
};

describe("SolicitacoesSimilaresInclusaoCEI", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza os dados principais da solicitação similar", () => {
    renderSolicitacoesSimilaresInclusaoCEI(solicitacaoComPeriodo);

    expect(screen.getByTestId("collapse-aberto")).toBeInTheDocument();
    expect(screen.getByText("Solicitação Número:")).toBeInTheDocument();
    expect(screen.getByText("#ABC123")).toBeInTheDocument();
    expect(screen.getByText("Data da Inclusão:")).toBeInTheDocument();
    expect(screen.getByText("10/06/2026")).toBeInTheDocument();
    expect(screen.getByText("Status da Solicitação:")).toBeInTheDocument();
    expect(screen.getByText("CODAE autorizou")).toBeInTheDocument();
    expect(screen.getByText("Motivo da solicitação")).toBeInTheDocument();
  });

  it("renderiza data inicial e data final quando existirem na solicitação", () => {
    renderSolicitacoesSimilaresInclusaoCEI(solicitacaoComPeriodo);

    expect(screen.getByText("DE:")).toBeInTheDocument();
    expect(screen.getByText("ATÉ:")).toBeInTheDocument();
    expect(screen.getByText("01/06/2026")).toBeInTheDocument();
    expect(screen.getByText("05/06/2026")).toBeInTheDocument();
    expect(screen.queryByText("Dia(s) de inclusão:")).not.toBeInTheDocument();
  });

  it("renderiza os dias de inclusão quando não existe período inicial e final", () => {
    renderSolicitacoesSimilaresInclusaoCEI(solicitacaoComDiasInclusao);

    expect(screen.getByText("Dia(s) de inclusão:")).toBeInTheDocument();
    expect(screen.getByText("12/06/2026")).toBeInTheDocument();
    expect(screen.getByText("13/06/2026")).toBeInTheDocument();
    expect(screen.queryByText("DE:")).not.toBeInTheDocument();
    expect(screen.queryByText("ATÉ:")).not.toBeInTheDocument();
  });

  it("usa o motivo do primeiro dia de inclusão quando não existe motivo direto na solicitação", () => {
    renderSolicitacoesSimilaresInclusaoCEI(solicitacaoComDiasInclusao);

    expect(screen.getByText("Motivo do dia")).toBeInTheDocument();
  });

  it("usa o último log para exibir o status da solicitação", () => {
    renderSolicitacoesSimilaresInclusaoCEI(solicitacaoComDiasInclusao);

    expect(screen.getByText("CODAE questionou")).toBeInTheDocument();
    expect(screen.queryByText("DRE validou")).not.toBeInTheDocument();
  });

  it("renderiza o componente InclusoesCEI com a solicitação recebida", () => {
    renderSolicitacoesSimilaresInclusaoCEI(solicitacaoComPeriodo);

    expect(screen.getByTestId("inclusoes-cei")).toBeInTheDocument();

    expect(InclusoesCEI).toHaveBeenCalledWith(
      expect.objectContaining({
        inclusaoDeAlimentacao: solicitacaoComPeriodo,
      }),
      {},
    );
  });

  it("não renderiza o conteúdo quando a solicitação está recolhida", () => {
    renderSolicitacoesSimilaresInclusaoCEI({
      ...solicitacaoComPeriodo,
      collapsed: false,
    });

    expect(screen.queryByTestId("collapse-aberto")).not.toBeInTheDocument();
    expect(screen.queryByText("#ABC123")).not.toBeInTheDocument();
  });
});
