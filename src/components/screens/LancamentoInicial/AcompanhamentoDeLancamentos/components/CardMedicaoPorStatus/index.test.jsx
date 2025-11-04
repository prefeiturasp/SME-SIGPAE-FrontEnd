import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import * as utilities from "src/helpers/utilities";
import { mockMeusDadosCODAEGA } from "src/mocks/meusDados/CODAE-GA";
import { CardMedicaoPorStatus } from "./index";

describe("Testes de comportamento para componente - CardMedicaoPorStatus", () => {
  const mockSetResultados = jest.fn();
  const mockSetStatusSelecionado = jest.fn();
  const mockOnPageChanged = jest.fn();
  const mockResetForm = jest.fn();

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
  };

  beforeEach(async () => {
    jest
      .spyOn(utilities, "usuarioEhEscolaTerceirizadaQualquerPerfil")
      .mockReturnValue(false);

    await act(async () => {
      render(
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
            <CardMedicaoPorStatus {...baseProps} />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });
  });

  it("renderiza corretamente o título e o total formatado", () => {
    expect(screen.getByText(/Corrigido para/i)).toBeInTheDocument();
    expect(screen.getByText("0001")).toBeInTheDocument();
    expect(screen.getByText(/Conferir lista/i)).toBeInTheDocument();
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

  it("se statusSelecionado for igual ao clicado, limpa os resultados", () => {
    const card = screen.getByTestId("MEDICAO_CORRIGIDA_PARA_CODAE");

    baseProps.statusSelecionado = "MEDICAO_CORRIGIDA_PARA_CODAE";

    act(() => {
      fireEvent.click(card);
    });

    expect(mockSetResultados).toHaveBeenCalled();
    expect(mockSetStatusSelecionado).toHaveBeenCalled();
  });
});
