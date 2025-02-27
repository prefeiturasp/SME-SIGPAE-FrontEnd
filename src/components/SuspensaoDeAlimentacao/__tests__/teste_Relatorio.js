import React from "react";
import { act, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import RelatorioForm from "../Relatorio";
import { renderWithProvider } from "utils/test-utils";

import { getSuspensaoDeAlimentacaoUUID } from "services/suspensaoDeAlimentacao.service";

import { mockCancelaParcialSuspensao } from "mocks/SuspensaoDeAlimentacao/mockCancelaParcialSuspensao";
import { TIPO_PERFIL } from "../../../constants/shared";
import mock from "services/_mock";

jest.mock("services/suspensaoDeAlimentacao.service");

describe("Teste Relatorio de Suspensão de Alimentação", () => {
  beforeEach(async () => {
    window.history.pushState(
      {},
      "Test page",
      "/?uuid=7ca6fa60-a886-467b-818f-ced16544f0a5"
    );

    getSuspensaoDeAlimentacaoUUID.mockResolvedValue({
      data: mockCancelaParcialSuspensao,
      status: 200,
    });
    mock
      .onPatch(
        "/grupos-suspensoes-alimentacao/7ca6fa60-a886-467b-818f-ced16544f0a5/marcar-conferida/"
      )
      .reply(200, {});

    await act(async () => {
      renderWithProvider(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <RelatorioForm />
        </MemoryRouter>
      );
    });
  });

  it("Testa se renderizou alguns elementos essenciais da tela", async () => {
    await waitFor(() => {
      expect(getSuspensaoDeAlimentacaoUUID).toHaveBeenCalledTimes(1);
    });

    expect(
      screen.getByText("EMEF PERICLES EUGENIO DA SILVA RAMOS")
    ).toBeInTheDocument();

    // Verifica se a informação da coluna Justificativa está renderizada
    expect(screen.getByText("É inevitável")).toBeInTheDocument();
  });
});

describe("RelatorioForm - Exibição do Botão Marcar Conferência", () => {
  beforeEach(async () => {
    window.history.pushState(
      {},
      "Test page",
      "/?uuid=7ca6fa60-a886-467b-818f-ced16544f0a5"
    );

    getSuspensaoDeAlimentacaoUUID.mockResolvedValue({
      data: mockCancelaParcialSuspensao,
      status: 200,
    });

    window.localStorage.setItem("tipo_perfil", TIPO_PERFIL.TERCEIRIZADA);

    await act(async () => {
      renderWithProvider(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <RelatorioForm />
        </MemoryRouter>
      );
    });
  });

  it("Testa a exibição do Modal de Marcar Conferência'", async () => {
    window.localStorage.setItem("tipo_perfil", TIPO_PERFIL.TERCEIRIZADA);

    await waitFor(() => {
      expect(getSuspensaoDeAlimentacaoUUID).toHaveBeenCalledTimes(1);
    });

    const botaoMarcarConferencia = screen
      .getByText("Marcar Conferência")
      .closest("button");
    expect(botaoMarcarConferencia).toBeInTheDocument();

    fireEvent.click(botaoMarcarConferencia);

    await waitFor(() => {
      expect(
        screen.getByText("Marcar Conferência da Solicitação")
      ).toBeInTheDocument();
    });

    const botaoConfirmar = screen.getByText("Confirmar").closest("button");
    expect(botaoConfirmar).toBeInTheDocument();

    fireEvent.click(botaoConfirmar);

    const botaoCancelar = screen.getByText("Cancelar").closest("button");
    expect(botaoCancelar).toBeInTheDocument();

    fireEvent.click(botaoCancelar);
  });
});
