import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { mockInclusaoAlimentacaoAutorizada } from "src/mocks/InclusaoAlimentacao/mockInclusaoAlimentacaoAutorizada";
import { mockInclusaoAlimentacaoConferida } from "src/mocks/InclusaoAlimentacao/mockInclusaoAlimentacaoConferida";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosTerceirizada } from "src/mocks/meusDados/terceirizada";
import { mockMotivosDRENaoValida } from "src/mocks/services/relatorios.service/mockMotivosDRENaoValida";
import * as RelatoriosInclusaoDeAlimentacao from "src/pages/InclusaoDeAlimentacao/RelatorioPage";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import mock from "src/services/_mock";

describe("Relatório Inclusão de Alimentação - Visão CODAE", () => {
  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosTerceirizada);
    mock.onGet("/motivos-dre-nao-valida/").reply(200, mockMotivosDRENaoValida);
    mock
      .onGet(
        "/grupos-inclusao-alimentacao-normal/d0f4faf0-519b-4a1a-a1bf-ae39c45d1f64/"
      )
      .replyOnce(200, mockInclusaoAlimentacaoAutorizada);
    mock
      .onPatch(
        "/grupos-inclusao-alimentacao-normal/d0f4faf0-519b-4a1a-a1bf-ae39c45d1f64/marcar-conferida/"
      )
      .reply(200, {});

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.TERCEIRIZADA);
    localStorage.setItem("perfil", PERFIL.ADMINISTRADOR_EMPRESA);

    const search = `?uuid=d0f4faf0-519b-4a1a-a1bf-ae39c45d1f64&ehInclusaoContinua=false&tipoSolicitacao=solicitacao-normal`;
    Object.defineProperty(window, "location", {
      value: {
        search: search,
      },
    });

    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <RelatoriosInclusaoDeAlimentacao.RelatorioTerceirizada />
        </MemoryRouter>
      );
    });
  });

  it("renderiza título da página `Inclusão de Alimentação - Solicitação # D0F4F`", async () => {
    expect(
      screen.getByText("Inclusão de Alimentação - Solicitação # D0F4F")
    ).toBeInTheDocument();
  });

  it("renderiza label `Solicitação no prazo regular`", async () => {
    expect(
      screen.getByText("Solicitação no prazo regular")
    ).toBeInTheDocument();
  });

  it("renderiza motivo e data", async () => {
    expect(screen.getByText("Motivo")).toBeInTheDocument();
    expect(screen.getByText("Reposição de aula")).toBeInTheDocument();

    expect(screen.getByText("Dia(s) de inclusão")).toBeInTheDocument();
    expect(screen.getByText("02/04/2025")).toBeInTheDocument();
  });

  it("renderiza tabela com período, tipos de alimentação e nº de alunos", async () => {
    expect(screen.getByText("Período")).toBeInTheDocument();
    expect(screen.getByText("MANHA")).toBeInTheDocument();

    expect(screen.getByText("Tipos de Alimentação")).toBeInTheDocument();
    expect(screen.getByText("Lanche")).toBeInTheDocument();

    expect(screen.getByText("Nº de Alunos")).toBeInTheDocument();
    expect(screen.getByText("123")).toBeInTheDocument();
  });

  it("exibe modal marcar conferência", async () => {
    const botaoMarcarConferencia = screen
      .getByText("Marcar Conferência")
      .closest("button");
    fireEvent.click(botaoMarcarConferencia);

    await waitFor(() => {
      expect(
        screen.getByText("Marcar Conferência da Solicitação")
      ).toBeInTheDocument();
    });
  });

  it("fecha modal marcar conferência", async () => {
    const botaoMarcarConferencia = screen
      .getByText("Marcar Conferência")
      .closest("button");
    fireEvent.click(botaoMarcarConferencia);

    await waitFor(() => {
      expect(
        screen.getByText("Marcar Conferência da Solicitação")
      ).toBeInTheDocument();
    });

    const botaoCancelar = screen.getByText("Cancelar").closest("button");
    fireEvent.click(botaoCancelar);

    await waitFor(() => {
      expect(
        screen.queryByText("Marcar Conferência da Solicitação")
      ).not.toBeInTheDocument();
    });
  });

  it("marca conferência", async () => {
    const botaoMarcarConferencia = screen
      .getByText("Marcar Conferência")
      .closest("button");
    fireEvent.click(botaoMarcarConferencia);

    await waitFor(() => {
      expect(
        screen.getByText("Marcar Conferência da Solicitação")
      ).toBeInTheDocument();
    });

    const botaoConfirmar = screen.getByText("Confirmar").closest("button");
    fireEvent.click(botaoConfirmar);

    mock
      .onGet(
        "/grupos-inclusao-alimentacao-normal/d0f4faf0-519b-4a1a-a1bf-ae39c45d1f64/"
      )
      .replyOnce(200, mockInclusaoAlimentacaoConferida);

    await waitFor(() => {
      expect(
        screen.queryByText("Marcar Conferência da Solicitação")
      ).not.toBeInTheDocument();
    });

    expect(screen.queryByText("Marcar Conferência")).not.toBeInTheDocument();

    expect(screen.getByText("Solicitação Conferida")).toBeInTheDocument();
  });
});
