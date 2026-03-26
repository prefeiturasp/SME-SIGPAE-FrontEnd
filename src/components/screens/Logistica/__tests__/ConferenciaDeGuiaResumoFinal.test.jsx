import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ConferenciaDeGuiaResumoFinal from "src/components/screens/Logistica/ConferenciaDeGuiaResumoFinal";
import * as logisticaService from "src/services/logistica.service";
import {
  toastSuccess,
  toastError,
} from "src/components/Shareable/Toast/dialogs";
import { localStorageMock } from "src/mocks/localStorageMock";

const mockNavigate = jest.fn();
const mockUseLocation = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useLocation: () => mockUseLocation(),
}));

jest.mock("src/services/logistica.service");
jest.mock("src/components/Shareable/Toast/dialogs");

const mockGuia = {
  uuid: "5eff7507-aeb1-4275-9239-a198e0563538",
  numero_guia: "455",
  alimentos: [
    {
      nome_alimento: "ARROZ",
      embalagens: [
        {
          tipo_embalagem: "FECHADA",
          qtd_volume: 10,
          capacidade_completa: "5kg",
        },
      ],
    },
    {
      nome_alimento: "FEIJÃO",
      embalagens: [
        {
          tipo_embalagem: "FRACIONADA",
          qtd_volume: 20,
          capacidade_completa: "1kg",
        },
      ],
    },
  ],
};

const mockGuiaComTotalEmbalagens = {
  uuid: "5eff7507-aeb1-4275-9239-a198e0563538",
  numero_guia: "456",
  alimentos: [
    {
      nome_alimento: "ARROZ",
      total_embalagens: [
        {
          tipo_embalagem: "FECHADA",
          qtd_volume: 10,
          capacidade_completa: "5kg",
          qtd_a_receber: 5,
        },
      ],
    },
  ],
};

const mockValores = [
  {
    status: "Recebido",
    recebidos_fechada: 10,
    recebidos_fracionada: 20,
    nome_motorista: "Joao",
    placa_veiculo: "ABC-1234",
    data_entrega_real: "20/10/2023",
    hora_recebimento: "10:00",
    observacoes: "Teste observação",
    ocorrencias: "Ocorrência teste",
    arquivo: [{ arquivo: "arquivo_base64" }],
    uuid_conferencia: "uuid-conferencia-123",
  },
  {
    status: "Recebido",
    recebidos_fechada: null,
    recebidos_fracionada: 20,
    nome_motorista: "Joao",
    placa_veiculo: "ABC-1234",
    data_entrega_real: "20/10/2023",
    hora_recebimento: "10:00",
  },
];

const mockValoresComOcorrencia = [
  {
    status: "Parcial",
    recebidos_fechada: 5,
    nome_motorista: "Joao",
    placa_veiculo: "ABC-1234",
    data_entrega_real: "20/10/2023",
    hora_recebimento: "10:00",
    ocorrencias: "Produto danificado",
    observacoes: "Observação teste",
  },
  {
    status: "Não Recebido",
    recebidos_fechada: null,
    recebidos_fracionada: null,
    nome_motorista: "Joao",
    placa_veiculo: "ABC-1234",
    data_entrega_real: "20/10/2023",
    hora_recebimento: "10:00",
  },
];

const mockValoresReposicao = [
  {
    status: "Recebido",
    recebidos_fechada: 10,
    recebidos_fracionada: 20,
    nome_motorista: "Joao",
    placa_veiculo: "ABC-1234",
    data_entrega_real: "20/10/2023",
    hora_recebimento: "10:00",
    arquivo: { arquivo: "arquivo_base64" },
    uuid_conferencia: "uuid-conferencia-123",
  },
  {
    status: "Recebido",
    recebidos_fechada: null,
    recebidos_fracionada: 20,
    nome_motorista: "Joao",
    placa_veiculo: "ABC-1234",
    data_entrega_real: "20/10/2023",
    hora_recebimento: "10:00",
  },
];

const mockValoresReposicaoMultiplos = [
  {
    status: "Recebido",
    recebidos_fechada: 10,
    recebidos_fracionada: 20,
    nome_motorista: "Joao",
    placa_veiculo: "ABC-1234",
    data_entrega_real: "20/10/2023",
    hora_recebimento: "10:00",
  },
];

const valoresInvalidos = [
  { ...mockValores[0], status: "Não Recebido" },
  { ...mockValores[1], status: "Não Recebido" },
];

const mockValoresStatusInvalido = [
  {
    status: "STATUS_DESCONHECIDO",
    recebidos_fechada: 10,
    recebidos_fracionada: 20,
    nome_motorista: "Joao",
    placa_veiculo: "ABC-1234",
    data_entrega_real: "20/10/2023",
    hora_recebimento: "10:00",
    arquivo: [],
  },
  {
    status: "STATUS_DESCONHECIDO",
    recebidos_fechada: null,
    recebidos_fracionada: 20,
    nome_motorista: "Joao",
    placa_veiculo: "ABC-1234",
    data_entrega_real: "20/10/2023",
    hora_recebimento: "10:00",
    arquivo: [],
  },
];

const mockValoresMultiplos = [
  {
    status: "Recebido",
    recebidos_fechada: 10,
    recebidos_fracionada: 20,
    nome_motorista: "Joao",
    placa_veiculo: "ABC-1234",
    data_entrega_real: "20/10/2023",
    hora_recebimento: "10:00",
  },
  {
    status: "Recebido",
    recebidos_fechada: 5,
    recebidos_fracionada: 15,
    nome_motorista: "Joao",
    placa_veiculo: "ABC-1234",
    data_entrega_real: "20/10/2023",
    hora_recebimento: "10:00",
  },
];

const renderComponent = (reposicao) => {
  return render(
    <MemoryRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <ConferenciaDeGuiaResumoFinal reposicao={reposicao} />
    </MemoryRouter>,
  );
};

describe("ConferenciaDeGuiaResumoFinal", () => {
  beforeEach(() => {
    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("guiaConferencia", JSON.stringify(mockGuia));
    localStorage.setItem("valoresConferencia", JSON.stringify(mockValores));
    localStorage.setItem("valoresReposicao", JSON.stringify(valoresInvalidos));
    localStorage.setItem("guiaReposicao", JSON.stringify(mockGuia));
    jest.clearAllMocks();
  });

  afterEach(() => {
    window.history.pushState({}, "", "/");
  });

  it("deve exibir mensagem de erro se não houver dados no localStorage", () => {
    localStorage.clear();
    renderComponent(false);
    expect(
      screen.getByText(/Não há processo de conferência em andamento/i),
    ).toBeInTheDocument();
  });

  it("deve renderizar a tabela com os dados da guia corretamente", () => {
    renderComponent(false);
    expect(screen.getByText("ARROZ")).toBeInTheDocument();
    expect(screen.getByText("FEIJÃO")).toBeInTheDocument();
    expect(screen.getByText(/Guia número:/i)).toBeInTheDocument();
    expect(screen.getByText(/455/i)).toBeInTheDocument();
  });

  it("deve chamar recebeGuiaComOcorrencia e redirecionar ao finalizar conferência normal", async () => {
    logisticaService.recebeGuiaComOcorrencia.mockResolvedValue({});
    renderComponent(false);
    const btnRegistrar = screen.getByText("Registrar Conferência");
    fireEvent.click(btnRegistrar);
    await waitFor(() => {
      expect(logisticaService.recebeGuiaComOcorrencia).toHaveBeenCalled();
      expect(toastSuccess).toHaveBeenCalledWith(
        "Guia de Remessa recebida com sucesso",
      );
      expect(mockNavigate).toHaveBeenCalledWith("/logistica/conferir-entrega");
    });
  });

  it("deve validar reposição inválida (quando nenhum item é recebido na reposição)", () => {
    renderComponent(true);
    expect(
      screen.getByText(/nenhum alimento faltante foi reposto/i),
    ).toBeInTheDocument();
    const btn = screen.getByRole("button", { name: /registrar reposição/i });
    expect(btn).toBeDisabled();
  });

  it("deve lidar com erro na API e mostrar ToastError", async () => {
    const erroMsg = "Erro na API";
    logisticaService.recebeGuiaComOcorrencia.mockRejectedValue({
      response: { data: { detail: erroMsg } },
    });
    renderComponent(false);
    fireEvent.click(screen.getByText("Registrar Conferência"));
    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith(erroMsg);
    });
  });

  it("deve navegar de volta ao cancelar a conferência", () => {
    renderComponent(false);
    fireEvent.click(screen.getByText("Cancelar"));
    expect(mockNavigate).toHaveBeenCalledWith(
      expect.stringContaining("conferencia-guia-com-ocorrencia"),
    );
  });

  it("deve renderizar ícone de arquivo quando existe anexo", () => {
    renderComponent(false);
    const iconArquivo = document.querySelector(".icon-arquivo");
    expect(iconArquivo).toBeInTheDocument();
  });

  it("deve exibir dados de embalagem fracionada quando disponível", () => {
    renderComponent(false);
    expect(screen.getByText("FEIJÃO")).toBeInTheDocument();
    const cells = screen.getAllByText("20");
    expect(cells.length).toBeGreaterThan(0);
    expect(screen.getByText("1kg")).toBeInTheDocument();
  });

  it("deve registrar reposição com sucesso", async () => {
    localStorage.setItem(
      "valoresReposicao",
      JSON.stringify(mockValoresReposicao),
    );
    logisticaService.recebeGuiaComOcorrencia.mockResolvedValue({});
    renderComponent(true);
    const btnRegistrar = screen.getByText("Registrar Reposição");
    fireEvent.click(btnRegistrar);
    await waitFor(() => {
      expect(logisticaService.recebeGuiaComOcorrencia).toHaveBeenCalledWith(
        expect.objectContaining({ eh_reposicao: true }),
      );
      expect(toastSuccess).toHaveBeenCalledWith(
        "Reposição de alimentos faltantes registrada com sucesso",
      );
    });
  });

  it("deve exibir status com classe green quando Recebido", () => {
    renderComponent(false);
    const statusCells = document.querySelectorAll(".recebimento.green");
    expect(statusCells.length).toBeGreaterThan(0);
  });

  it("deve exibir status com classe red quando Parcial ou Não Recebido", () => {
    localStorage.setItem(
      "valoresConferencia",
      JSON.stringify(mockValoresComOcorrencia),
    );
    renderComponent(false);
    const statusCells = document.querySelectorAll(".recebimento.red");
    expect(statusCells.length).toBeGreaterThan(0);
  });

  it("deve processar corretamente o payload com arquivo em modo reposição", async () => {
    localStorage.setItem(
      "valoresReposicao",
      JSON.stringify(mockValoresReposicao),
    );
    logisticaService.recebeGuiaComOcorrencia.mockResolvedValue({});
    renderComponent(true);
    const btnRegistrar = screen.getByText("Registrar Reposição");
    fireEvent.click(btnRegistrar);
    await waitFor(() => {
      const callArgs =
        logisticaService.recebeGuiaComOcorrencia.mock.calls[0][0];
      expect(callArgs.conferencia_dos_alimentos[0].arquivo).toBe(
        "arquivo_base64",
      );
    });
  });

  it("deve processar corretamente o payload com múltiplos tipos de embalagem", async () => {
    localStorage.setItem(
      "valoresConferencia",
      JSON.stringify(mockValoresMultiplos),
    );
    logisticaService.recebeGuiaComOcorrencia.mockResolvedValue({});
    renderComponent(false);
    const btnRegistrar = screen.getByText("Registrar Conferência");
    fireEvent.click(btnRegistrar);
    await waitFor(() => {
      const callArgs =
        logisticaService.recebeGuiaComOcorrencia.mock.calls[0][0];
      expect(callArgs.conferencia_dos_alimentos).toHaveLength(4);
      expect(callArgs.conferencia_dos_alimentos[0].tipo_embalagem).toBe(
        "FECHADA",
      );
      expect(callArgs.conferencia_dos_alimentos[1].tipo_embalagem).toBe(
        "FRACIONADA",
      );
    });
  });

  it("deve incluir ocorrência e observação no payload quando disponíveis", async () => {
    localStorage.setItem(
      "valoresConferencia",
      JSON.stringify(mockValoresComOcorrencia),
    );
    logisticaService.recebeGuiaComOcorrencia.mockResolvedValue({});
    renderComponent(false);
    const btnRegistrar = screen.getByText("Registrar Conferência");
    fireEvent.click(btnRegistrar);
    await waitFor(() => {
      const callArgs =
        logisticaService.recebeGuiaComOcorrencia.mock.calls[0][0];
      expect(callArgs.conferencia_dos_alimentos[0].ocorrencia).toBe(
        "Produto danificado",
      );
      expect(callArgs.conferencia_dos_alimentos[0].observacao).toBe(
        "Observação teste",
      );
    });
  });

  it("deve processar dados com total_embalagens ao invés de embalagens", () => {
    localStorage.setItem(
      "guiaConferencia",
      JSON.stringify(mockGuiaComTotalEmbalagens),
    );
    localStorage.setItem(
      "valoresConferencia",
      JSON.stringify([{ status: "Recebido", recebidos_fechada: 10 }]),
    );
    renderComponent(false);
    expect(screen.getByText("ARROZ")).toBeInTheDocument();
  });

  it("deve navegar de volta ao cancelar a reposição", () => {
    renderComponent(true);
    fireEvent.click(screen.getByText("Cancelar"));
    expect(mockNavigate).toHaveBeenCalledWith(
      expect.stringContaining("reposicao-guia"),
    );
  });

  it("deve exibir '--' quando não houver dados de embalagem", () => {
    const mockGuiaSemEmbalagem = {
      uuid: "teste",
      numero_guia: "457",
      alimentos: [
        {
          nome_alimento: "SAL",
          embalagens: [],
        },
      ],
    };
    localStorage.setItem(
      "guiaConferencia",
      JSON.stringify(mockGuiaSemEmbalagem),
    );
    localStorage.setItem(
      "valoresConferencia",
      JSON.stringify([{ status: "Recebido" }]),
    );
    renderComponent(false);
    const cells = screen.getAllByText("--");
    expect(cells.length).toBeGreaterThan(0);
  });

  it("deve registrar conferência com ocorrência quando status for diferente de Recebido", async () => {
    localStorage.setItem(
      "valoresConferencia",
      JSON.stringify(mockValoresComOcorrencia),
    );
    logisticaService.recebeGuiaComOcorrencia.mockResolvedValue({});
    renderComponent(false);
    const btnRegistrar = screen.getByText("Registrar Conferência");
    fireEvent.click(btnRegistrar);
    await waitFor(() => {
      expect(logisticaService.recebeGuiaComOcorrencia).toHaveBeenCalled();
      expect(toastSuccess).toHaveBeenCalledWith(
        "Guia de Remessa registrada com ocorrência",
      );
    });
  });

  it("deve exibir dados de qtd_a_receber quando em modo reposição", () => {
    localStorage.setItem(
      "valoresReposicao",
      JSON.stringify(mockValoresReposicaoMultiplos),
    );
    localStorage.setItem(
      "guiaReposicao",
      JSON.stringify(mockGuiaComTotalEmbalagens),
    );
    renderComponent(true);
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("deve exibir data de conferência formatada corretamente", () => {
    renderComponent(false);
    const dataAtual = new Date().toLocaleDateString("pt-BR");
    expect(screen.getByText(new RegExp(dataAtual))).toBeInTheDocument();
  });

  it("deve exibir subtítulo correto para conferência", () => {
    renderComponent(false);
    expect(screen.getByText("Resumo da conferência")).toBeInTheDocument();
  });

  it("deve exibir subtítulo correto para reposição", () => {
    localStorage.setItem(
      "valoresReposicao",
      JSON.stringify(mockValoresReposicao),
    );
    renderComponent(true);
    expect(
      screen.getByText("Resumo da reposição de alimentos faltantes"),
    ).toBeInTheDocument();
  });

  it("deve exibir pergunta correta para conferência", () => {
    renderComponent(false);
    expect(
      screen.getByText(/Deseja realizar o registro de conferência/i),
    ).toBeInTheDocument();
  });

  it("deve exibir pergunta correta para reposição", () => {
    localStorage.setItem(
      "valoresReposicao",
      JSON.stringify(mockValoresReposicao),
    );
    renderComponent(true);
    expect(
      screen.getByText(/Deseja realizar o registro da reposição/i),
    ).toBeInTheDocument();
  });

  it("deve exibir label de data correta para conferência", () => {
    renderComponent(false);
    expect(screen.getByText(/Data de conferência:/i)).toBeInTheDocument();
  });

  it("deve exibir label de data correta para reposição", () => {
    localStorage.setItem(
      "valoresReposicao",
      JSON.stringify(mockValoresReposicao),
    );
    renderComponent(true);
    expect(
      screen.getByText(/Data de registro da reposição:/i),
    ).toBeInTheDocument();
  });

  it("deve processar corretamente quando arquivo existe em modo conferência", async () => {
    logisticaService.recebeGuiaComOcorrencia.mockResolvedValue({});
    renderComponent(false);
    const btnRegistrar = screen.getByText("Registrar Conferência");
    fireEvent.click(btnRegistrar);
    await waitFor(() => {
      const callArgs =
        logisticaService.recebeGuiaComOcorrencia.mock.calls[0][0];
      expect(callArgs.conferencia_dos_alimentos[0].arquivo).toBe(
        "arquivo_base64",
      );
    });
  });

  it("deve processar corretamente quando arquivo é um objeto em modo reposição", async () => {
    localStorage.setItem(
      "valoresReposicao",
      JSON.stringify(mockValoresReposicao),
    );
    logisticaService.recebeGuiaComOcorrencia.mockResolvedValue({});
    renderComponent(true);
    const btnRegistrar = screen.getByText("Registrar Reposição");
    fireEvent.click(btnRegistrar);
    await waitFor(() => {
      const callArgs =
        logisticaService.recebeGuiaComOcorrencia.mock.calls[0][0];
      expect(callArgs.conferencia_dos_alimentos[0].arquivo).toBe(
        "arquivo_base64",
      );
    });
  });

  it("deve lidar com edição de conferência quando parâmetro editar=true", async () => {
    window.history.pushState({}, "", "?editar=true");

    logisticaService.editaGuiaComOcorrencia = jest.fn().mockResolvedValue({});

    renderComponent(false);

    await waitFor(() => {
      expect(screen.getByText("Registrar Edição")).toBeInTheDocument();
    });

    const btnRegistrar = screen.getByText("Registrar Edição");
    fireEvent.click(btnRegistrar);

    await waitFor(() => {
      expect(logisticaService.editaGuiaComOcorrencia).toHaveBeenCalled();
      expect(toastSuccess).toHaveBeenCalledWith(
        "Conferência editada com sucesso. O respectivo registro de reposição foi apagado.",
      );
      expect(mockNavigate).toHaveBeenCalledWith("/logistica/conferir-entrega");
    });
  });

  it("deve lidar com edição de reposição quando parâmetro editar=true", async () => {
    window.history.pushState({}, "", "?editar=true");

    localStorage.setItem(
      "valoresReposicao",
      JSON.stringify(mockValoresReposicao),
    );
    logisticaService.editaGuiaComOcorrencia = jest.fn().mockResolvedValue({});

    renderComponent(true);

    await waitFor(() => {
      expect(screen.getByText("Registrar Edição")).toBeInTheDocument();
    });

    const btnRegistrar = screen.getByText("Registrar Edição");
    fireEvent.click(btnRegistrar);

    await waitFor(() => {
      expect(logisticaService.editaGuiaComOcorrencia).toHaveBeenCalled();
      expect(toastSuccess).toHaveBeenCalledWith(
        "Reposição editada com sucesso.",
      );
      expect(mockNavigate).toHaveBeenCalledWith("/logistica/conferir-entrega");
    });
  });

  it("deve lidar com erro na edição", async () => {
    window.history.pushState({}, "", "?editar=true");

    const erroMsg = "Erro ao editar";
    logisticaService.editaGuiaComOcorrencia = jest.fn().mockRejectedValue({
      response: { data: { detail: erroMsg } },
    });

    renderComponent(false);

    await waitFor(() => {
      expect(screen.getByText("Registrar Edição")).toBeInTheDocument();
    });

    const btnRegistrar = screen.getByText("Registrar Edição");
    fireEvent.click(btnRegistrar);

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith(erroMsg);
    });
  });

  it("deve aplicar classe vazia quando status for desconhecido", async () => {
    localStorage.setItem(
      "valoresConferencia",
      JSON.stringify(mockValoresStatusInvalido),
    );

    renderComponent(false);
    const statusElements = await screen.findAllByText("STATUS_DESCONHECIDO");

    statusElements.forEach((el) => {
      expect(el).not.toHaveClass("green");
      expect(el).not.toHaveClass("red");
    });
  });
});
