import React from "react";

import { act, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { getSolicitacaoUnificada } from "src/services/solicitacaoUnificada.service";
import { mockKitLanche } from "../../../../mocks/SolicitacaoUnificada/Relatorio/mockSolicitacaoKitLancheUnificado";
import Relatorio from "..";
import { renderWithProvider } from "../../../../utils/test-utils";
import { CODAE, ESCOLA, TERCEIRIZADA } from "src/configs/constants";
import { TIPO_PERFIL } from "../../../../constants/shared";
import { terceirizadaMarcaConferencia } from "src/services/dietaEspecial.service";

jest.mock("src/services/solicitacaoUnificada.service");
jest.mock("src/services/dietaEspecial.service");

beforeEach(() => {
  getSolicitacaoUnificada.mockResolvedValue({
    data: mockKitLanche,
    status: 200,
  });
});

const setup = async (visao) => {
  await act(async () => {
    renderWithProvider(
      <MemoryRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Relatorio visao={visao} />
      </MemoryRouter>,
      {}
    );
  });
};

describe("Carrega Relatório na visao CODAE", () => {
  it("carrega Kit Aprovado", async () => {
    const search = `?uuid=${mockKitLanche.uuid}`;
    Object.defineProperty(window, "location", {
      value: {
        search: search,
      },
    });

    window.localStorage.setItem(
      "tipo_perfil",
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA
    );

    await setup(CODAE);
    expect(
      screen.getAllByText(new RegExp(mockKitLanche.id_externo))[0]
    ).toBeInTheDocument();
  });
});

describe("Carrega Relatório na visão TERCEIRIZADA", () => {
  const carregaPagina = async () => {
    const search = `?uuid=${mockKitLanche.uuid}`;
    Object.defineProperty(window, "location", {
      value: {
        search: search,
      },
    });
    window.localStorage.setItem("tipo_perfil", TIPO_PERFIL.TERCEIRIZADA);
    await setup(TERCEIRIZADA);
  };

  const marcaConferencia = () => {
    const botaoMarcarConferencia = screen
      .getByText("Marcar Conferência")
      .closest("button");
    fireEvent.click(botaoMarcarConferencia);

    expect(
      screen.getByText(/Marcar Conferência da Solicitação/i)
    ).toBeInTheDocument();

    const botaoConfirmar = screen.getByText("Confirmar").closest("button");
    fireEvent.click(botaoConfirmar);
  };

  it("carrega Kit Aprovado e marca conferência", async () => {
    await carregaPagina();

    expect(
      screen.getAllByText(new RegExp(mockKitLanche.id_externo))[0]
    ).toBeInTheDocument();

    terceirizadaMarcaConferencia.mockResolvedValue({
      data: {},
      status: 200,
    });

    marcaConferencia();
  });

  it("retorna erro ao marcar conferencia", async () => {
    await carregaPagina();

    expect(
      screen.getAllByText(new RegExp(mockKitLanche.id_externo))[0]
    ).toBeInTheDocument();

    terceirizadaMarcaConferencia.mockResolvedValue({
      data: {},
      status: 500,
    });

    marcaConferencia();

    expect(
      screen.getByText(/Marcar Conferência da Solicitação/i)
    ).toBeInTheDocument();
  });
});

describe("Carrega Relatório na visao ESCOLA", () => {
  it("carrega Kit Aprovado", async () => {
    const search = `?uuid=${mockKitLanche.uuid}`;
    Object.defineProperty(window, "location", {
      value: {
        search: search,
      },
    });

    window.localStorage.setItem(
      "nome_instituicao",
      `"${mockKitLanche.escolas_quantidades[0]?.escola.nome}"`
    );
    window.localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);

    await setup(ESCOLA);

    expect(
      screen.getAllByText(new RegExp(mockKitLanche.id_externo))[0]
    ).toBeInTheDocument();
  });
});
