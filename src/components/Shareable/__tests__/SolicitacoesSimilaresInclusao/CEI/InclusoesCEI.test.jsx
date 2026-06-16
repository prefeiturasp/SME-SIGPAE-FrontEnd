import "@testing-library/jest-dom";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import InclusoesCEI from "../../../SolicitacoesSimilaresInclusao/CEI/InclusoesCEI";
import { getVinculosTipoAlimentacaoPorEscola } from "src/services/cadastroTipoAlimentacao.service";

jest.mock("src/components/Shareable/TabelaFaixaEtaria", () =>
  jest.fn(({ faixas }) => (
    <div data-testid="tabela-faixa-etaria">
      Total de faixas: {faixas.length}
    </div>
  )),
);

jest.mock("src/services/cadastroTipoAlimentacao.service", () => ({
  getVinculosTipoAlimentacaoPorEscola: jest.fn(),
}));

const escolaUuid = "00000000-0000-4000-8000-000000000001";

const vinculosAlimentacao = [
  {
    periodo_escolar: {
      nome: "MANHA",
    },
    tipos_alimentacao: [
      {
        nome: "Lanche",
      },
      {
        nome: "Refeição",
      },
    ],
  },
  {
    periodo_escolar: {
      nome: "TARDE",
    },
    tipos_alimentacao: [
      {
        nome: "Jantar",
      },
    ],
  },
];

const inclusaoDeAlimentacao = {
  escola: {
    uuid: escolaUuid,
  },
  quantidade_alunos_por_faixas_etarias: [
    {
      periodo: {
        nome: "MANHA",
      },
      periodo_externo: {
        nome: "MANHA",
      },
      quantidade_alunos: 10,
    },
    {
      periodo: {
        nome: "TARDE",
      },
      periodo_externo: {
        nome: "INTEGRAL",
      },
      quantidade_alunos: 20,
    },
  ],
};

const renderInclusoesCEI = () => {
  return render(<InclusoesCEI inclusaoDeAlimentacao={inclusaoDeAlimentacao} />);
};

describe("InclusoesCEI", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    getVinculosTipoAlimentacaoPorEscola.mockResolvedValue({
      status: 200,
      data: {
        results: vinculosAlimentacao,
      },
    });
  });

  it("não renderiza conteúdo antes de carregar os vínculos de alimentação", () => {
    getVinculosTipoAlimentacaoPorEscola.mockReturnValue(new Promise(() => {}));

    renderInclusoesCEI();

    expect(screen.queryByText("MANHA")).not.toBeInTheDocument();
    expect(screen.queryByTestId("tabela-faixa-etaria")).not.toBeInTheDocument();
  });

  it("busca os vínculos de alimentação usando o uuid da escola", async () => {
    renderInclusoesCEI();

    await waitFor(() => {
      expect(getVinculosTipoAlimentacaoPorEscola).toHaveBeenCalledWith(
        escolaUuid,
      );
    });
  });

  it("renderiza períodos, vínculos de alimentação e tabelas de faixas etárias", async () => {
    renderInclusoesCEI();

    await waitFor(() => {
      expect(screen.getByText("MANHA")).toBeInTheDocument();
    });

    expect(screen.getByText("INTEGRAL")).toBeInTheDocument();
    expect(screen.getByText("TARDE")).toBeInTheDocument();

    expect(screen.getByText("Lanche, Refeição")).toBeInTheDocument();
    expect(screen.getByText("Jantar")).toBeInTheDocument();

    expect(screen.getAllByTestId("tabela-faixa-etaria")).toHaveLength(2);
  });
});
