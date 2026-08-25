import "@testing-library/jest-dom";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PERFIL, TIPO_PERFIL, TIPO_SERVICO } from "src/constants/shared";
import { localStorageMock } from "src/mocks/localStorageMock";
import { SidebarContent } from "../SidebarContent";

const perfisComAcessoAoPainel = [
  {
    nome: "Administrador de Supervisão",
    dados: {
      perfil: PERFIL.ADMINISTRADOR_SUPERVISAO_NUTRICAO,
      tipo_perfil: TIPO_PERFIL.SUPERVISAO_NUTRICAO,
    },
  },
  {
    nome: "Coordenador de Supervisão",
    dados: {
      perfil: PERFIL.COORDENADOR_SUPERVISAO_NUTRICAO,
      tipo_perfil: TIPO_PERFIL.SUPERVISAO_NUTRICAO,
    },
  },
  {
    nome: "CODAE",
    dados: {
      tipo_perfil: TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
    },
  },
  {
    nome: "Medição",
    dados: { tipo_perfil: TIPO_PERFIL.MEDICAO },
  },
  {
    nome: "Gabinete CODAE",
    dados: { perfil: PERFIL.ADMINISTRADOR_CODAE_GABINETE },
  },
  {
    nome: "DINUTRE",
    dados: { perfil: PERFIL.DINUTRE_DIRETORIA },
  },
  {
    nome: "Nutri Manifestação",
    dados: { tipo_perfil: TIPO_PERFIL.NUTRICAO_MANIFESTACAO },
  },
  {
    nome: "COGESTOR DRE",
    dados: {
      perfil: PERFIL.COGESTOR_DRE,
      tipo_perfil: TIPO_PERFIL.DIRETORIA_REGIONAL,
    },
  },
  {
    nome: "Terceirizada",
    dados: {
      perfil: PERFIL.ADMINISTRADOR_EMPRESA,
      tipo_perfil: TIPO_PERFIL.TERCEIRIZADA,
      tipo_servico: TIPO_SERVICO.TERCEIRIZADA,
    },
  },
];

describe("Menu lateral de Supervisão", () => {
  beforeEach(() => {
    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it.each(perfisComAcessoAoPainel)(
    "exibe o Painel de Acompanhamento para $nome",
    ({ dados }) => {
      Object.entries(dados).forEach(([chave, valor]) => {
        localStorage.setItem(chave, valor);
      });

      render(
        <MemoryRouter>
          <SidebarContent />
        </MemoryRouter>,
      );

      expect(screen.getByText("Supervisão")).toBeInTheDocument();
      fireEvent.click(screen.getByText("Terceirizadas"));
      expect(screen.getByText("Painel de Acompanhamento")).toBeInTheDocument();
    },
  );
});
