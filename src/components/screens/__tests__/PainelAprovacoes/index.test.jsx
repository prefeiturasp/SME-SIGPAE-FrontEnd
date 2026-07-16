import "@testing-library/jest-dom";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import React from "react";

import PainelAprovacoes from "../../PreRecebimento/PainelAprovacoes";

import {
  getDashboardCronograma,
  getDashboardCronogramaComFiltros,
  getDashboardSolicitacoesAlteracao,
  getDashboardSolicitacoesAlteracaoComFiltros,
} from "src/services/cronograma.service";

jest.mock("antd", () => ({
  Spin: ({ children }) => <>{children}</>,
}));

jest.mock("src/components/Shareable/CardCronograma/CardCronograma", () => ({
  __esModule: true,
  default: ({ cardTitle, solicitations }) => (
    <div data-testid={`card-${cardTitle}`}>
      <span>{cardTitle}</span>
      {solicitations.map((solicitation) => (
        <div
          key={solicitation.link}
          data-testid="solicitacao-card"
          data-ponto-a-ponto={String(solicitation.ponto_a_ponto)}
          data-programa-leve-leite={String(solicitation.programa_leve_leite)}
          data-link={solicitation.link}
        >
          {solicitation.text}
        </div>
      ))}
    </div>
  ),
}));

jest.mock("src/components/Shareable/Input/InputText", () => {
  return ({ input, placeholder, inputOnChange }) => (
    <input
      placeholder={placeholder}
      value={input?.value || ""}
      onChange={(event) => {
        input?.onChange?.(event);
        inputOnChange?.(event);
      }}
    />
  );
});

jest.mock("src/helpers/utilities", () => ({
  parseDataHoraBrToMoment: jest.fn((data) => data),
  comparaObjetosMoment: jest.fn((dataA, dataB) => dataA.localeCompare(dataB)),
  truncarString: jest.fn((texto) => texto || ""),
}));

jest.mock("src/services/cronograma.service", () => ({
  getDashboardCronograma: jest.fn(),
  getDashboardCronogramaComFiltros: jest.fn(),
  getDashboardSolicitacoesAlteracao: jest.fn(),
  getDashboardSolicitacoesAlteracaoComFiltros: jest.fn(),
}));

const responseCronograma = {
  data: {
    results: [
      {
        status: "ASSINADO_E_ENVIADO_AO_FORNECEDOR",
        dados: [
          {
            uuid: "11111111-1111-4111-8111-111111111111",
            numero: "151/2024A",
            produto: "CAQUI",
            empresa: "Fornecedor Teste",
            log_mais_recente: "06/07/2026",
            status: "Aguardando Assinatura",
            programa_leve_leite: false,
            ponto_a_ponto: true,
          },
        ],
      },
    ],
  },
};

const responseSolicitacaoAlteracao = {
  data: {
    results: [
      {
        status: "EM_ANALISE",
        dados: [
          {
            uuid: "22222222-2222-4222-8222-222222222222",
            cronograma: "072/2023",
            produto: "CAQUI",
            empresa: "Empresa do Luis Zimmermann",
            log_mais_recente: "02/01/2024",
            status: "Em análise",
            programa_leve_leite: false,
            ponto_a_ponto: true,
          },
        ],
      },
    ],
  },
};

beforeEach(() => {
  localStorage.setItem("perfil", JSON.stringify("DILOG_CRONOGRAMA"));

  getDashboardCronograma.mockResolvedValue(responseCronograma);
  getDashboardCronogramaComFiltros.mockResolvedValue(responseCronograma);
  getDashboardSolicitacoesAlteracao.mockResolvedValue(
    responseSolicitacaoAlteracao,
  );
  getDashboardSolicitacoesAlteracaoComFiltros.mockResolvedValue(
    responseSolicitacaoAlteracao,
  );
});

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
  localStorage.clear();
  jest.useRealTimers();
});

describe("PainelAprovacoes", () => {
  test("Deve buscar cronogramas e solicitações de alteração ao carregar a tela", async () => {
    render(<PainelAprovacoes />);

    await waitFor(() => {
      expect(getDashboardCronograma).toHaveBeenCalledTimes(1);
      expect(getDashboardSolicitacoesAlteracao).toHaveBeenCalledTimes(1);
    });
  });

  test("Deve formatar cronograma preservando ponto_a_ponto", async () => {
    render(<PainelAprovacoes />);

    const solicitacao = await screen.findByText(
      "151/2024A / CAQUI / Fornecedor Teste",
    );

    expect(solicitacao).toHaveAttribute("data-ponto-a-ponto", "true");
    expect(solicitacao).toHaveAttribute("data-programa-leve-leite", "false");
    expect(solicitacao).toHaveAttribute(
      "data-link",
      "/pre-recebimento/detalhe-cronograma?uuid=11111111-1111-4111-8111-111111111111",
    );
  });

  test("Deve formatar solicitação de alteração preservando ponto_a_ponto", async () => {
    render(<PainelAprovacoes />);

    const solicitacao = await screen.findByText(
      "072/2023 / CAQUI / Empresa do Luis Zimmermann",
    );

    expect(solicitacao).toHaveAttribute("data-ponto-a-ponto", "true");
    expect(solicitacao).toHaveAttribute("data-programa-leve-leite", "false");
    expect(solicitacao).toHaveAttribute(
      "data-link",
      "/pre-recebimento/detalhe-alteracao-cronograma?uuid=22222222-2222-4222-8222-222222222222",
    );
  });

  test("Deve filtrar cronogramas quando o campo possuir mais de dois caracteres", async () => {
    jest.useFakeTimers();

    render(<PainelAprovacoes />);

    await waitFor(() => {
      expect(getDashboardCronograma).toHaveBeenCalledTimes(1);
    });

    const inputNumeroCronograma =
      screen.getAllByPlaceholderText("N° do Cronograma")[0];

    fireEvent.change(inputNumeroCronograma, {
      target: { value: "151" },
    });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(getDashboardCronogramaComFiltros).toHaveBeenCalledTimes(1);
    });

    expect(getDashboardCronogramaComFiltros).toHaveBeenCalledWith(
      expect.objectContaining({
        numero_cronograma: "151",
      }),
    );
  });

  test("Deve filtrar solicitações de alteração quando o campo possuir mais de dois caracteres", async () => {
    jest.useFakeTimers();

    render(<PainelAprovacoes />);

    await waitFor(() => {
      expect(getDashboardSolicitacoesAlteracao).toHaveBeenCalledTimes(1);
    });

    fireEvent.change(screen.getByPlaceholderText("Nome do Fornecedor"), {
      target: { value: "Luis" },
    });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(getDashboardSolicitacoesAlteracaoComFiltros).toHaveBeenCalledTimes(
        1,
      );
    });

    expect(getDashboardSolicitacoesAlteracaoComFiltros).toHaveBeenCalledWith(
      expect.objectContaining({
        nome_fornecedor: "Luis",
      }),
    );
  });
});
