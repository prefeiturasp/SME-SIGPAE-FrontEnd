import "@testing-library/jest-dom";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { mockMeusDadosCODAEGA } from "src/mocks/meusDados/CODAE-GA";
import { ToastContainer } from "react-toastify";
import { MemoryRouter } from "react-router-dom";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockGetGrupoUnidadeEscolar } from "src/mocks/services/escola.service/mockGetGrupoUnidadeEscolar";
import ModalRelatorio from "../index";
import mock from "src/services/_mock";

describe("Testes de comportamento para componente - ModalRelatorio", () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();

  beforeEach(async () => {
    const gruposHabilitadosDRE = {
      "Grupo 1": false,
      "Grupo 2": true,
      "Grupo 3": true,
      "Grupo 4": true,
      "Grupo 5": true,
      "Grupo 6": true,
    };
    mock
      .onGet("/grupos-unidade-escolar/")
      .reply(200, mockGetGrupoUnidadeEscolar);

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
            <ModalRelatorio
              show={true}
              onClose={mockOnClose}
              onSubmit={mockOnSubmit}
              nomeRelatorio="Relatório Unificado"
              gruposHabilitadosPorDre={gruposHabilitadosDRE}
            />
            <ToastContainer />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });

    await screen.findByText("Grupo 1 (CCI, CEI, CEI CEU)");
  });

  it("renderiza o título e a descrição inicial", () => {
    expect(
      screen.getByText("Impressão de Relatório Unificado"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Selecione o grupo de Unidade/),
    ).toBeInTheDocument();
  });

  it("lista todos os grupos retornados pela API", () => {
    expect(screen.getByText("Grupo 1 (CCI, CEI, CEI CEU)")).toBeInTheDocument();
    expect(screen.getByText("Grupo 2 (CEMEI, CEU CEMEI)")).toBeInTheDocument();
    expect(screen.getByText("Grupo 3 (CEU EMEI, EMEI)")).toBeInTheDocument();
    expect(
      screen.getByText("Grupo 4 (CEU EMEF, CEU GESTAO, EMEF, EMEFM)"),
    ).toBeInTheDocument();
    expect(screen.getByText("Grupo 5 (EMEBS)")).toBeInTheDocument();
    expect(screen.getByText("Grupo 6 (CIEJA, CMCT)")).toBeInTheDocument();
  });

  it("permite selecionar um grupo habilitado 3 e habilita o botão de gerar relatório", () => {
    const radio = screen.getByLabelText("Grupo 3 (CEU EMEI, EMEI)");
    fireEvent.click(radio);

    const botaoGerar = screen.getByText("Gerar Relatório");
    expect(botaoGerar).not.toBeDisabled();
  });

  it("não permite selecionar um grupo 1 e não habilita o botão de gerar relatório", () => {
    const radio = screen.getByLabelText("Grupo 1 (CCI, CEI, CEI CEU)");
    expect(radio).toBeDisabled();

    const botaoGerar = screen.getByRole("button", { name: "Gerar Relatório" });
    expect(botaoGerar).toBeDisabled();
  });

  it("permite selecionar um grupo 2 habilita o botão de gerar relatório", () => {
    const radio = screen.getByLabelText("Grupo 2 (CEMEI, CEU CEMEI)");
    fireEvent.click(radio);

    const botaoGerar = screen.getByRole("button", { name: "Gerar Relatório" });
    expect(botaoGerar).not.toBeDisabled();
  });

  it("permite selecionar um grupo 5 habilita o botão de gerar relatório", () => {
    const radio = screen.getByLabelText("Grupo 5 (EMEBS)");
    fireEvent.click(radio);

    const botaoGerar = screen.getByRole("button", { name: "Gerar Relatório" });
    expect(botaoGerar).not.toBeDisabled();
  });

  it("permite selecionar um grupo 6 habilita o botão de gerar relatório", () => {
    const radio = screen.getByLabelText("Grupo 6 (CIEJA, CMCT)");
    fireEvent.click(radio);

    const botaoGerar = screen.getByRole("button", { name: "Gerar Relatório" });
    expect(botaoGerar).not.toBeDisabled();
  });

  it("chama onSubmit com o grupo selecionado ao gerar relatório", () => {
    const radio = screen.getByLabelText("Grupo 3 (CEU EMEI, EMEI)");
    fireEvent.click(radio);

    const botaoGerar = screen.getByText("Gerar Relatório");
    fireEvent.click(botaoGerar);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      grupoSelecionado: "743ed59c-9861-4230-860e-e01e2e080327",
    });
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("chama onClose ao clicar em Cancelar", () => {
    const botaoCancelar = screen.getByText("Cancelar");
    fireEvent.click(botaoCancelar);

    expect(mockOnClose).toHaveBeenCalled();
  });
});
