import React from "react";
import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import mock from "src/services/_mock";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockMeusDadosEscolaEMEFPericles } from "src/mocks/meusDados/escolaEMEFPericles";
import MemorandoOcorrenciasPage from "src/pages/PosRecebimento/MemorandoOcorrenciasPage";
import {
  MEMORANDO_OCORRENCIAS,
  POS_RECEBIMENTO,
  REGISTRAR_MEMORANDO_OCORRENCIA,
} from "src/configs/constants";
import { PERFIL } from "src/constants/shared";
import {
  getNotificacoes,
  getQtdNaoLidas,
} from "src/services/notificacoes.service";
import { mockGetNotificacoes } from "src/mocks/services/notificacoes.service/mockGetNotificacoes";
import { mockGetQtdNaoLidas } from "src/mocks/services/notificacoes.service/mockGetQtdNaoLidas";

jest.mock("src/services/notificacoes.service");

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const setup = async () => {
  await act(async () => {
    render(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <MeusDadosContext.Provider
          value={{
            meusDados: mockMeusDadosEscolaEMEFPericles,
            setMeusDados: jest.fn(),
          }}
        >
          <MemorandoOcorrenciasPage />
        </MeusDadosContext.Provider>
      </MemoryRouter>,
    );
  });
};

describe("MemorandoOcorrenciasPage", () => {
  beforeEach(() => {
    mock.reset();
    jest.clearAllMocks();

    localStorage.setItem("perfil", PERFIL.DIRETOR_UE);
    localStorage.setItem(
      "meusDados",
      JSON.stringify(mockMeusDadosEscolaEMEFPericles),
    );

    getNotificacoes.mockResolvedValue({
      data: mockGetNotificacoes,
      status: 200,
    });
    getQtdNaoLidas.mockResolvedValue({
      data: mockGetQtdNaoLidas,
      status: 200,
    });
  });

  afterEach(() => localStorage.clear());

  it("exibe título, breadcrumb e o botão de registrar ocorrência", async () => {
    await setup();

    expect(
      screen.getAllByText("Memorando de Ocorrências").length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText("Pós-Recebimento").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Início").length).toBeGreaterThan(0);
    expect(screen.getByText("Registrar Ocorrência")).toBeInTheDocument();
  });

  it("navega para o cadastro ao acionar o botão Registrar Ocorrência", async () => {
    await setup();

    fireEvent.click(screen.getByText("Registrar Ocorrência").closest("button"));

    expect(mockNavigate).toHaveBeenCalledWith(
      `/${POS_RECEBIMENTO}/${MEMORANDO_OCORRENCIAS}/${REGISTRAR_MEMORANDO_OCORRENCIA}`,
    );
  });
});
