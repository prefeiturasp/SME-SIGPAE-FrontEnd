import "@testing-library/jest-dom";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import * as utilities from "src/helpers/utilities";
import { mockMeusDadosCODAEGA } from "src/mocks/meusDados/CODAE-GA";
import { CardMedicaoPorStatus } from "../../components/CardMedicaoPorStatus";

describe("Testes de comportamento para componente - CardMedicaoPorStatus", () => {
  const mockSetResultados = jest.fn();
  const mockSetStatusSelecionado = jest.fn();
  const mockOnPageChanged = jest.fn();
  const mockResetForm = jest.fn();
  const mockGetDashboardMedicaoInicialAsync = jest.fn();

  const baseProps = {
    children: (
      <div>
        Corrigido para <br /> CODAE
      </div>
    ),
    classeCor: "cinza cursor-pointer",
    dados: {
      status: "MEDICAO_CORRIGIDA_PARA_CODAE",
      total: 1,
      dados: [
        {
          uuid: "b64d0b52-616f-45d3-b8db-1621e89cba3c",
          escola: "EMEF PERICLES EUGENIO DA SILVA RAMOS",
          escola_uuid: "3c32be8e-f191-468d-a4e2-3dd8751e5e7a",
          mes: "09",
          ano: "2025",
          mes_ano: "Setembro 2025",
          tipo_unidade: "EMEF",
          status: "Corrigido para CODAE",
          log_mais_recente: "29/09/2025 10:58",
          dre_ciencia_correcao_data: "18/09/2025 14:57:10",
          todas_medicoes_e_ocorrencia_aprovados_por_medicao: true,
          escola_cei_com_inclusao_parcial_autorizada: false,
          sem_lancamentos: false,
        },
      ],
    },
    form: { destroyOnUnregister: false, mutators: {} },
    page: 1,
    statusSelecionado: "MEDICAO_CORRECAO_SOLICITADA_CODAE",
    total: 1,
    dataTestId: "MEDICAO_CORRIGIDA_PARA_CODAE",
    setResultados: mockSetResultados,
    setStatusSelecionado: mockSetStatusSelecionado,
    onPageChanged: mockOnPageChanged,
    resetForm: mockResetForm,
    getDashboardMedicaoInicialAsync: mockGetDashboardMedicaoInicialAsync,
  };

  const renderizarComponente = async (props = baseProps) => {
    let resultado;
    await act(async () => {
      resultado = render(
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
            <CardMedicaoPorStatus {...props} />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });
    return resultado;
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    jest
      .spyOn(utilities, "usuarioEhEscolaTerceirizadaQualquerPerfil")
      .mockReturnValue(false);

    await renderizarComponente();
  });

  it("renderiza corretamente o título e o total formatado", () => {
    expect(screen.getByText(/Corrigido para/i)).toBeInTheDocument();
    expect(screen.getByText("0001")).toBeInTheDocument();
    expect(screen.getByText(/Conferir lista/i)).toBeInTheDocument();
  });

  it("não exibe sinalização quando não há pendência de ação da DRE", () => {
    expect(
      screen.queryByText("Existem itens pendentes de ação"),
    ).not.toBeInTheDocument();
  });

  it("exibe sinalização quando há pendência de ação da DRE", async () => {
    cleanup();
    const { container } = await renderizarComponente({
      ...baseProps,
      exibirSinalizacaoPendencia: true,
    });

    expect(
      screen.getByText("Existem itens pendentes de ação"),
    ).toBeInTheDocument();
    expect(
      container.querySelector(".icone-warning-pendencia"),
    ).toBeInTheDocument();
  });

  it("ao clicar chama setResultados alternando dados se não for terceirizada", () => {
    const card = screen.getByTestId("MEDICAO_CORRIGIDA_PARA_CODAE");

    act(() => {
      fireEvent.click(card);
    });

    expect(mockSetResultados).toHaveBeenCalledWith(baseProps.dados);
    expect(mockResetForm).toHaveBeenCalledWith(baseProps.form);
    expect(mockSetStatusSelecionado).toHaveBeenCalledWith(
      baseProps.dados.status,
    );
  });

  it("busca o status do card para usuário escola ou terceirizada", async () => {
    utilities.usuarioEhEscolaTerceirizadaQualquerPerfil.mockReturnValue(true);
    cleanup();
    await renderizarComponente({
      ...baseProps,
      statusSelecionado: "MEDICAO_APROVADA_PELA_DRE",
    });

    fireEvent.click(screen.getByTestId("MEDICAO_CORRIGIDA_PARA_CODAE"));

    expect(mockGetDashboardMedicaoInicialAsync).toHaveBeenCalledWith({
      status: "MEDICAO_CORRIGIDA_PARA_CODAE",
    });
  });

  it("remove o filtro ao selecionar novamente o mesmo card para escola ou terceirizada", async () => {
    utilities.usuarioEhEscolaTerceirizadaQualquerPerfil.mockReturnValue(true);
    cleanup();
    await renderizarComponente({
      ...baseProps,
      statusSelecionado: "MEDICAO_CORRIGIDA_PARA_CODAE",
    });

    fireEvent.click(screen.getByTestId("MEDICAO_CORRIGIDA_PARA_CODAE"));

    expect(mockGetDashboardMedicaoInicialAsync).toHaveBeenCalledWith({
      status: null,
    });
  });

  it("aciona o card ao pressionar Enter", () => {
    fireEvent.keyDown(screen.getByTestId("MEDICAO_CORRIGIDA_PARA_CODAE"), {
      key: "Enter",
      code: "Enter",
    });

    expect(mockSetResultados).toHaveBeenCalledWith(baseProps.dados);
    expect(mockSetStatusSelecionado).toHaveBeenCalledWith(
      baseProps.dados.status,
    );
  });

  it("se statusSelecionado for igual ao clicado, limpa os resultados", async () => {
    cleanup();
    await renderizarComponente({
      ...baseProps,
      statusSelecionado: "MEDICAO_CORRIGIDA_PARA_CODAE",
    });

    const card = screen.getByTestId("MEDICAO_CORRIGIDA_PARA_CODAE");

    act(() => {
      fireEvent.click(card);
    });

    expect(mockSetResultados).toHaveBeenCalledWith(null);
    expect(mockSetStatusSelecionado).toHaveBeenCalledWith(null);
  });
});
