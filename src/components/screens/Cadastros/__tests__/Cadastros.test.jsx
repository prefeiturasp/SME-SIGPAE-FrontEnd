import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Cadastros from "src/components/screens/Cadastros/Cadastros";
import {
  TIPO_PERFIL,
  PERFIL,
  TIPO_SERVICO,
  MODULO_GESTAO,
} from "src/constants/shared";
import { localStorageMock } from "src/mocks/localStorageMock";

const renderComponent = () => {
  return render(
    <MemoryRouter>
      <Cadastros />
    </MemoryRouter>,
  );
};

describe("Componente Cadastros - Controle de Acesso por Perfil", () => {
  beforeEach(() => {
    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    jest.clearAllMocks();
  });

  describe("Usuário CODAE (Gestão de Alimentação ou Dieta Especial)", () => {
    it("deve renderizar todos os cards de gestão para perfil GESTAO_ALIMENTACAO_TERCEIRIZADA", () => {
      localStorage.setItem(
        "tipo_perfil",
        TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
      );
      renderComponent();

      expect(screen.getByText("Cadastro de Lotes")).toBeInTheDocument();
      expect(screen.getByText("Cadastro de Empresas")).toBeInTheDocument();
      expect(
        screen.getByText("Cadastro de Editais e Contratos"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Cadastro de Tipos de Alimentações"),
      ).toBeInTheDocument();
      expect(
        screen.queryByText(/Você não ter permissão/i),
      ).not.toBeInTheDocument();
    });

    it("deve renderizar os cards de gestão para perfil DIETA_ESPECIAL", () => {
      localStorage.setItem("tipo_perfil", TIPO_PERFIL.DIETA_ESPECIAL);

      renderComponent();
      expect(screen.getByText("Cadastro de Lotes")).toBeInTheDocument();
      expect(
        screen.queryByText(/Você não ter permissão/i),
      ).not.toBeInTheDocument();
    });
  });

  describe("Usuário DRE (Diretoria Regional)", () => {
    it("deve exibir mensagem de falta de permissão e não mostrar nenhum card", () => {
      localStorage.setItem("tipo_perfil", TIPO_PERFIL.DIRETORIA_REGIONAL);

      renderComponent();

      expect(
        screen.getByText(
          /Você não ter permissão para acessar nenhum cadastro/i,
        ),
      ).toBeInTheDocument();
      expect(screen.queryByText("Cadastro de Lotes")).not.toBeInTheDocument();
    });
  });

  describe("Usuário Empresa Terceirizada", () => {
    it("deve exibir mensagem de falta de permissão para Administrador de Empresa Terceirizada", () => {
      localStorage.setItem("perfil", PERFIL.ADMINISTRADOR_EMPRESA);
      localStorage.setItem("tipo_servico", TIPO_SERVICO.TERCEIRIZADA);

      renderComponent();

      expect(
        screen.getByText(
          /Você não ter permissão para acessar nenhum cadastro/i,
        ),
      ).toBeInTheDocument();
      const linkLote = screen.queryByRole("link", {
        name: /cadastro de lotes/i,
      });
      expect(linkLote).not.toBeInTheDocument();
    });
  });

  describe("Usuário Escola Terceirizada", () => {
    it("deve exibir apenas o card de Horários de alimentações", () => {
      localStorage.setItem("perfil", PERFIL.ADMINISTRADOR_UE);
      localStorage.setItem("modulo_gestao", MODULO_GESTAO.TERCEIRIZADA);

      renderComponent();
      expect(screen.getByText("Horários de alimentações")).toBeInTheDocument();
      expect(screen.queryByText("Cadastro de Lotes")).not.toBeInTheDocument();
    });

    it("deve exibir apenas o card de Horários de alimentações para Diretor de escola", () => {
      localStorage.setItem("perfil", PERFIL.DIRETOR_UE);
      localStorage.setItem("modulo_gestao", MODULO_GESTAO.TERCEIRIZADA);

      renderComponent();

      expect(screen.getByText("Horários de alimentações")).toBeInTheDocument();
      expect(screen.queryByText("Cadastro de Lotes")).not.toBeInTheDocument();
    });
  });

  describe("Usuário Empresa Terceirizada (Correção do erro de atributo)", () => {
    it("deve exibir mensagem de falta de permissão e não mostrar links", () => {
      localStorage.setItem("perfil", PERFIL.ADMINISTRADOR_EMPRESA);
      localStorage.setItem("tipo_servico", TIPO_SERVICO.TERCEIRIZADA);

      renderComponent();

      expect(
        screen.getByText(
          /Você não ter permissão para acessar nenhum cadastro/i,
        ),
      ).toBeInTheDocument();

      const linkLote = screen.queryByRole("link", {
        name: /cadastro de lotes/i,
      });
      expect(linkLote).not.toBeInTheDocument();
    });
  });

  describe("Cobertura de Interações (Hover)", () => {
    it("deve cobrir os eventos de mouseEnter e mouseLeave dos cards de CODAE", () => {
      localStorage.setItem(
        "tipo_perfil",
        TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
      );
      renderComponent();

      const cardLote = screen
        .getByText("Cadastro de Lotes")
        .closest(".linked-card");
      fireEvent.mouseEnter(cardLote);
      fireEvent.mouseLeave(cardLote);

      const cardEmpresa = screen
        .getByText("Cadastro de Empresas")
        .closest(".linked-card");
      fireEvent.mouseEnter(cardEmpresa);
      fireEvent.mouseLeave(cardEmpresa);

      const cardEdital = screen
        .getByText("Cadastro de Editais e Contratos")
        .closest(".linked-card");
      fireEvent.mouseEnter(cardEdital);
      fireEvent.mouseLeave(cardEdital);

      const cardTipo = screen
        .getByText("Cadastro de Tipos de Alimentações")
        .closest(".linked-card");
      fireEvent.mouseEnter(cardTipo);
      fireEvent.mouseLeave(cardTipo);
    });

    it("deve cobrir o evento de mouseEnter e mouseLeave do card de Horários (Escola)", () => {
      localStorage.setItem("perfil", PERFIL.ADMINISTRADOR_UE);
      localStorage.setItem("modulo_gestao", MODULO_GESTAO.TERCEIRIZADA);
      renderComponent();

      const cardHorarios = screen
        .getByText("Horários de alimentações")
        .closest(".linked-card");

      fireEvent.mouseEnter(cardHorarios);
      fireEvent.mouseLeave(cardHorarios);
    });
  });
});
