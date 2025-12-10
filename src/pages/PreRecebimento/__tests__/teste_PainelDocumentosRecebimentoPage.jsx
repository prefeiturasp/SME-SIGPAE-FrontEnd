import React from "react";
import { render, act, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import mock from "src/services/_mock";
import { MemoryRouter } from "react-router-dom";
import PainelDocumentosRecebimentoPage from "src/pages/PreRecebimento/PainelDocumentosRecebimentoPage";
import { MeusDadosContext } from "src/context/MeusDadosContext";

import { mockGetDashboardDocumentosRecebimento } from "src/mocks/services/documentosRecebimento.service/mockGetDashboardDocumentosRecebimento";
import { mockMeusDadosDilogQualidade } from "src/mocks/meusDados/dilog-qualidade";

import { PERFIL, TIPO_PERFIL } from "src/constants/shared";

describe("Teste da página de Painel de Documentos de Recebimento", () => {
  beforeEach(async () => {
    localStorage.setItem("perfil", PERFIL.DILOG_QUALIDADE);
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.PRE_RECEBIMENTO);

    mock
      .onGet(`/documentos-de-recebimento/dashboard/`)
      .reply(200, mockGetDashboardDocumentosRecebimento);

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
              meusDados: mockMeusDadosDilogQualidade,
              setMeusDados: jest.fn(),
            }}
          >
            <PainelDocumentosRecebimentoPage />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });
  });

  it("Testa a renderização dos elementos básicos do Painel", async () => {
    expect(screen.getByText("Aprovação de Documentos")).toBeInTheDocument();

    // Verifica se os cards corretos estão sendo carregados
    expect(screen.getByText("Pendentes de Aprovação")).toBeInTheDocument();
    expect(screen.getByText("Aprovados")).toBeInTheDocument();
    expect(screen.getByText("Enviados para Correção")).toBeInTheDocument();
  });

  it("Deve renderizar ao menos um item do programa leve leite com a classe correta", async () => {
    await screen.findByText("Pendentes de Aprovação");

    const elementosP = document.querySelectorAll("p");
    expect(elementosP.length).toBeGreaterThan(0);

    let elementosProgramaLeveLeite = [];
    elementosP.forEach((elemento) => {
      if (elemento.classList.contains("programa-leve-leite")) {
        elementosProgramaLeveLeite.push(elemento);
      }
    });

    expect(elementosProgramaLeveLeite.length).toBeGreaterThan(0);
  });
});
