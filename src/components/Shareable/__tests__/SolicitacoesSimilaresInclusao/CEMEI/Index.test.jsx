import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import { SolicitacoesSimilaresInclusaoCEMEI } from "../../../SolicitacoesSimilaresInclusao/CEMEI";

jest.mock("react-collapse", () => ({
  Collapse: ({ isOpened, children }) =>
    isOpened ? <tbody data-testid="collapse-aberto">{children}</tbody> : null,
}));

jest.mock(
  "src/components/Shareable/SolicitacoesSimilaresInclusao/CEMEI/InclusoesCEMEI",
  () => ({
    InclusoesCEMEI: jest.fn(() => (
      <tr data-testid="inclusoes-cemei">
        <td>Inclusões CEMEI</td>
      </tr>
    )),
  }),
);

const solicitacaoCEMEI = {
  collapsed: true,
  id_externo: "ABC123",
  motivo: null,
  dias_motivos_da_inclusao_cemei: [
    {
      data: "01/06/2026",
      cancelado: false,
      cancelado_justificativa: "",
      motivo: { nome: "Motivo do dia" },
    },
    {
      data: "02/06/2026",
      cancelado: true,
      cancelado_justificativa: "Evento cancelado",
      motivo: { nome: "Dia da família" },
    },
  ],
  logs: [
    {
      criado_em: "20/05/2026 10:00:00",
      status_evento_explicacao: "CODAE autorizou",
    },
  ],
};

const renderCEMEI = (solicitacao, index = 0) => {
  return render(
    <table>
      <SolicitacoesSimilaresInclusaoCEMEI
        solicitacao={solicitacao}
        index={index}
      />
    </table>,
  );
};

describe("SolicitacoesSimilaresInclusaoCEMEI", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza os dias de inclusão", () => {
    renderCEMEI(solicitacaoCEMEI);

    expect(screen.getByText("Dia(s) de inclusão:")).toBeInTheDocument();
    expect(screen.getByText("01/06/2026")).toBeInTheDocument();
    expect(screen.getByText("02/06/2026")).toBeInTheDocument();
  });

  it("risca a data cancelada e exibe a justificativa abaixo", () => {
    renderCEMEI(solicitacaoCEMEI);

    const dataCancelada = screen
      .getByText("02/06/2026")
      .closest(".data-inclusao");
    expect(dataCancelada).toHaveClass("cancelado");

    const justificativa = screen.getByText("justificativa:");
    expect(justificativa.parentElement).toHaveTextContent("Evento cancelado");
  });

  it("não aplica o estilo de cancelamento em datas não canceladas", () => {
    renderCEMEI(solicitacaoCEMEI);

    const dataNormal = screen.getByText("01/06/2026").closest(".data-inclusao");
    expect(dataNormal).not.toHaveClass("cancelado");
  });

  it("renderiza o componente InclusoesCEMEI com a solicitação recebida", () => {
    renderCEMEI(solicitacaoCEMEI);

    expect(screen.getByTestId("inclusoes-cemei")).toBeInTheDocument();
  });
});
