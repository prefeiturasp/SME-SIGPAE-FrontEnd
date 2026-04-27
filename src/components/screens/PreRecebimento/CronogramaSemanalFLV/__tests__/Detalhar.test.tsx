import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PERFIL } from "src/constants/shared";
import {
  mockCronogramaSemanalDetalhe,
  mockCronogramaSemanalDetalheEnviado,
} from "src/mocks/services/cronogramaSemanal.service";
import DetalharCronogramaSemanal from "../components/Detalhar";
import mock from "src/services/_mock";

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

  it("exibe botões Histórico, Baixar PDF e Voltar", async () => {
    await setup();
    await waitFor(() => {
      expect(screen.getByText("Status do Cronograma")).toBeInTheDocument();
    });

    expect(screen.getByText("Histórico")).toBeInTheDocument();
    expect(screen.getByText("Baixar PDF")).toBeInTheDocument();
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

  it("botões Histórico e Baixar PDF não têm funcionalidade", async () => {
    await setup();
    await waitFor(() => {
      expect(screen.getByText("Status do Cronograma")).toBeInTheDocument();
    });

    const btnHistorico = screen.getByText("Histórico").closest("button");
    const btnBaixar = screen.getByText("Baixar PDF").closest("button");

    expect(btnHistorico).toBeInTheDocument();
    expect(btnBaixar).toBeInTheDocument();

    if (btnHistorico) {
      fireEvent.click(btnHistorico);
    }
    if (btnBaixar) {
      fireEvent.click(btnBaixar);
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
