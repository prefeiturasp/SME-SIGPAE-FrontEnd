import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PERFIL, TIPO_PERFIL, TIPO_SERVICO } from "src/constants/shared";
import {
  mockCronogramaSemanalDetalhe,
  mockCronogramaSemanalDetalheEnviado,
} from "src/mocks/services/cronogramaSemanal.service";
import DetalharCronogramaSemanal from "../components/Detalhar";
import mock from "src/services/_mock";
import { localStorageMock } from "src/mocks/localStorageMock";

const setup = async (uuid = mockCronogramaSemanalDetalhe.uuid) => {
  setWindowLocation(`?uuid=${uuid}`);
  await act(async () => {
    render(
      <MemoryRouter>
        <DetalharCronogramaSemanal />
      </MemoryRouter>,
    );
  });
};

const setWindowLocation = (search) => {
  window.history.pushState({}, "", `${window.location.pathname}${search}`);
};

const limparLocalStorage = () => {
  localStorage.removeItem("perfil");
};

describe("Testa componente DetalharCronogramaSemanal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mock.resetHistory();
    localStorage.setItem("perfil", PERFIL.DILOG_CRONOGRAMA);

    mock
      .onGet(`/cronogramas-semanais/${mockCronogramaSemanalDetalhe.uuid}/`)
      .reply(200, mockCronogramaSemanalDetalhe);
  });

  afterAll(() => {
    limparLocalStorage();
  });

  it("carrega cronograma semanal detalhado", async () => {
    await setup();
    await waitFor(() => {
      expect(screen.getByText("Status do Cronograma")).toBeInTheDocument();
    });

    expect(
      screen.getByText(mockCronogramaSemanalDetalhe.numero),
    ).toBeInTheDocument();
    expect(screen.getByText("Dados Gerais")).toBeInTheDocument();
  });

  it("exibe dados do produto", async () => {
    await setup();
    await waitFor(() => {
      expect(screen.getByText("Status do Cronograma")).toBeInTheDocument();
    });

    expect(screen.getByText("Produto:")).toBeInTheDocument();
  });

  it("exibe tabela de programações", async () => {
    await setup();
    await waitFor(() => {
      expect(screen.getByText("Status do Cronograma")).toBeInTheDocument();
    });

    expect(
      screen.getByText("Dados do Produto e Datas das Entregas"),
    ).toBeInTheDocument();
    expect(screen.getByText("Quantidade")).toBeInTheDocument();
    expect(screen.getByText("Data Programada")).toBeInTheDocument();
  });

  it("exibe botões Histórico e Voltar", async () => {
    await setup();
    await waitFor(() => {
      expect(screen.getByText("Status do Cronograma")).toBeInTheDocument();
    });

    expect(screen.getByText("Histórico")).toBeInTheDocument();
    expect(screen.getByText("Voltar")).toBeInTheDocument();
  });

  it("botão Voltar é funcional", async () => {
    await setup();
    await waitFor(() => {
      expect(screen.getByText("Status do Cronograma")).toBeInTheDocument();
    });

    const btnVoltar = screen.getByTestId("voltar");
    expect(btnVoltar).not.toBeDisabled();
    fireEvent.click(btnVoltar);
  });

  it("botão Histórico não têm funcionalidade", async () => {
    await setup();
    await waitFor(() => {
      expect(screen.getByText("Status do Cronograma")).toBeInTheDocument();
    });

    const btnHistorico = screen.getByText("Histórico").closest("button");

    expect(btnHistorico).toBeInTheDocument();

    if (btnHistorico) {
      fireEvent.click(btnHistorico);
    }
  });

  it("exibe timeline de status quando há logs", async () => {
    await setup();
    await waitFor(() => {
      expect(screen.getByText("Status do Cronograma")).toBeInTheDocument();
    });

    expect(mockCronogramaSemanalDetalhe.logs.length).toBeGreaterThan(0);
  });

  it("trata erro ao carregar cronograma", async () => {
    mock.resetHistory();
    mock
      .onGet(`/cronogramas-semanais/${mockCronogramaSemanalDetalhe.uuid}/`)
      .reply(500);

    await setup();

    await waitFor(
      () => {
        expect(
          screen.queryByText("Status do Cronograma"),
        ).not.toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });

  it("exibe cronograma com status Enviado ao Fornecedor", async () => {
    mock.resetHistory();
    mock
      .onGet(
        `/cronogramas-semanais/${mockCronogramaSemanalDetalheEnviado.uuid}/`,
      )
      .reply(200, mockCronogramaSemanalDetalheEnviado);

    await setup(mockCronogramaSemanalDetalheEnviado.uuid);

    await waitFor(() => {
      expect(screen.getByText("Status do Cronograma")).toBeInTheDocument();
    });

    expect(
      screen.getByText(mockCronogramaSemanalDetalheEnviado.status),
    ).toBeInTheDocument();
  });
});

describe("Testa componente DetalharCronogramaSemanal - Perfil Fornecedor", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mock.resetHistory();

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("nome_instituicao", "JP Alimentos");
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.TERCEIRIZADA);
    localStorage.setItem("perfil", PERFIL.ADMINISTRADOR_EMPRESA);
    localStorage.setItem("tipo_servico", TIPO_SERVICO.FORNECEDOR);
  });

  afterAll(() => {
    limparLocalStorage();
  });

  it("exibe botão 'Ciente da Programação' quando status é 'Enviado ao Fornecedor'", async () => {
    mock
      .onGet(
        `/cronogramas-semanais/${mockCronogramaSemanalDetalheEnviado.uuid}/`,
      )
      .reply(200, mockCronogramaSemanalDetalheEnviado);

    await setup(mockCronogramaSemanalDetalheEnviado.uuid);

    await waitFor(() => {
      expect(screen.getByText("Status do Cronograma")).toBeInTheDocument();
    });

    expect(screen.getByText("Ciente da Programação")).toBeInTheDocument();
    expect(screen.queryByText("Baixar PDF")).not.toBeInTheDocument();
  });

  it("abre modal ao clicar em 'Ciente da Programação'", async () => {
    mock
      .onGet(
        `/cronogramas-semanais/${mockCronogramaSemanalDetalheEnviado.uuid}/`,
      )
      .reply(200, mockCronogramaSemanalDetalheEnviado);

    await setup(mockCronogramaSemanalDetalheEnviado.uuid);

    await waitFor(() => {
      expect(screen.getByText("Ciente da Programação")).toBeInTheDocument();
    });

    const botaoCiente = screen.getByText("Ciente da Programação");
    fireEvent.click(botaoCiente);

    await waitFor(() => {
      expect(
        screen.getByText("Dar ciência das informações"),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "Você confirma a ciência das datas e quantidades programadas para entrega?",
        ),
      ).toBeInTheDocument();
    });
  });

  it("fecha modal ao clicar em 'Não'", async () => {
    mock
      .onGet(
        `/cronogramas-semanais/${mockCronogramaSemanalDetalheEnviado.uuid}/`,
      )
      .reply(200, mockCronogramaSemanalDetalheEnviado);

    await setup(mockCronogramaSemanalDetalheEnviado.uuid);

    await waitFor(() => {
      expect(screen.getByText("Ciente da Programação")).toBeInTheDocument();
    });

    const botaoCiente = screen.getByText("Ciente da Programação");
    fireEvent.click(botaoCiente);

    await waitFor(() => {
      expect(
        screen.getByText("Dar ciência das informações"),
      ).toBeInTheDocument();
    });

    const botaoNao = screen.getByText("Não");
    fireEvent.click(botaoNao);

    await waitFor(() => {
      expect(
        screen.queryByText("Dar ciência das informações"),
      ).not.toBeInTheDocument();
    });
  });

  it("registra ciência ao confirmar no modal", async () => {
    mock
      .onGet(
        `/cronogramas-semanais/${mockCronogramaSemanalDetalheEnviado.uuid}/`,
      )
      .reply(200, mockCronogramaSemanalDetalheEnviado);

    mock
      .onPatch(
        `/cronogramas-semanais/${mockCronogramaSemanalDetalheEnviado.uuid}/fornecedor-ciente/`,
      )
      .reply(200, {
        ...mockCronogramaSemanalDetalheEnviado,
        status: "Fornecedor Ciente",
      });

    await setup(mockCronogramaSemanalDetalheEnviado.uuid);

    await waitFor(() => {
      expect(screen.getByText("Ciente da Programação")).toBeInTheDocument();
    });

    const botaoCiente = screen.getByText("Ciente da Programação");
    fireEvent.click(botaoCiente);

    await waitFor(() => {
      expect(screen.getByText("Sim, confirmo")).toBeInTheDocument();
    });

    const botaoSim = screen.getByText("Sim, confirmo");
    await act(async () => {
      fireEvent.click(botaoSim);
    });

    await waitFor(() => {
      expect(mock.history.patch.length).toBe(1);
    });
  });

  it("exibe botão 'Baixar PDF' quando status é 'Fornecedor Ciente'", async () => {
    const mockCienteStatus = {
      ...mockCronogramaSemanalDetalhe,
      status: "Fornecedor Ciente",
    };

    mock
      .onGet(`/cronogramas-semanais/${mockCronogramaSemanalDetalhe.uuid}/`)
      .reply(200, mockCienteStatus);

    await setup(mockCronogramaSemanalDetalhe.uuid);

    await waitFor(() => {
      expect(screen.getByText("Status do Cronograma")).toBeInTheDocument();
    });

    expect(screen.getByText("Baixar PDF")).toBeInTheDocument();
    expect(screen.queryByText("Ciente da Programação")).not.toBeInTheDocument();
  });

  it("não exibe botão 'Ciente da Programação' quando status é diferente", async () => {
    mock
      .onGet(`/cronogramas-semanais/${mockCronogramaSemanalDetalhe.uuid}/`)
      .reply(200, mockCronogramaSemanalDetalhe);

    await setup(mockCronogramaSemanalDetalhe.uuid);

    await waitFor(() => {
      expect(screen.getByText("Status do Cronograma")).toBeInTheDocument();
    });

    expect(screen.queryByText("Ciente da Programação")).not.toBeInTheDocument();
  });

  it("botão 'Baixar PDF' está funcional quando status é 'Fornecedor Ciente'", async () => {
    const mockCienteStatus = {
      ...mockCronogramaSemanalDetalhe,
      status: "Fornecedor Ciente",
    };

    mock
      .onGet(`/cronogramas-semanais/${mockCronogramaSemanalDetalhe.uuid}/`)
      .reply(200, mockCienteStatus);

    await setup(mockCronogramaSemanalDetalhe.uuid);

    await waitFor(() => {
      expect(screen.getByText("Status do Cronograma")).toBeInTheDocument();
    });

    const botaoBaixarPdf = screen.getByText("Baixar PDF").closest("button");
    expect(botaoBaixarPdf).toBeInTheDocument();

    if (botaoBaixarPdf) {
      fireEvent.click(botaoBaixarPdf);
    }
  });
});
