import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { ModalDetalheInterrupcao } from "../index";
import mock from "../../../../../../services/_mock";
import { usuarioEhCronogramaOuCodae } from "../../../../../../helpers/utilities";

// Mock das utilidades de permissão
jest.mock("../../../../../../helpers/utilities", () => ({
  usuarioEhCronogramaOuCodae: jest.fn(),
}));

const mockCloseModal = jest.fn();
const mockOnDelete = jest.fn();

const mockEvento = {
  uuid: "test-uuid-123",
  title: "INTERRUPÇÃO DE ENTREGA",
  start: new Date(2026, 1, 17), // 17/02/2026
  end: new Date(2026, 1, 17, 1),
  allDay: true,
  isInterrupcao: true as const,
  motivo_display: "Feriado",
  descricao_motivo: "Carnaval",
  tipo_calendario: "ARMAZENAVEL",
  tipo_calendario_display: "Armazenável",
};

const defaultProps = {
  evento: mockEvento,
  showModal: true,
  closeModal: mockCloseModal,
  onDelete: mockOnDelete,
};

describe("ModalDetalheInterrupcao", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (usuarioEhCronogramaOuCodae as jest.Mock).mockReturnValue(true);
    mock
      .onDelete(/\/interrupcao-programada-entrega\/test-uuid-123\/?/)
      .reply(204);
  });

  afterEach(() => {
    mock.reset();
  });

  describe("Renderização", () => {
    it("deve renderizar o modal com as informações da interrupção", async () => {
      render(<ModalDetalheInterrupcao {...defaultProps} />);

      expect(screen.getByText("Interrupção de Entrega")).toBeInTheDocument();
      expect(screen.getByText("17/02/2026")).toBeInTheDocument();
      expect(screen.getByText(/Feriado - Carnaval/i)).toBeInTheDocument();
      expect(screen.getByText("Armazenável")).toBeInTheDocument();
    });

    it("deve renderizar os botões Excluir e Fechar para usuários com permissão", () => {
      render(<ModalDetalheInterrupcao {...defaultProps} />);
      expect(screen.getByText("Excluir")).toBeInTheDocument();
      expect(screen.getByText("Fechar")).toBeInTheDocument();
    });

    it("não deve renderizar o botão Excluir para usuários sem permissão", () => {
      (usuarioEhCronogramaOuCodae as jest.Mock).mockReturnValue(false);
      render(<ModalDetalheInterrupcao {...defaultProps} />);
      expect(screen.queryByText("Excluir")).not.toBeInTheDocument();
      expect(screen.getByText("Fechar")).toBeInTheDocument();
    });
  });

  describe("Ações", () => {
    it("deve chamar closeModal ao clicar em Fechar", async () => {
      const user = userEvent.setup();
      render(<ModalDetalheInterrupcao {...defaultProps} />);

      const fecharBtn = screen.getByText("Fechar");
      await user.click(fecharBtn);

      expect(mockCloseModal).toHaveBeenCalled();
    });

    it("deve chamar o serviço de exclusão e as callbacks ao clicar em Excluir", async () => {
      const user = userEvent.setup();
      render(<ModalDetalheInterrupcao {...defaultProps} />);

      const excluirBtn = screen.getByText("Excluir");
      await user.click(excluirBtn);

      await waitFor(() => {
        expect(mock.history.delete.length).toBe(1);
        expect(mock.history.delete[0].url).toContain(
          "/interrupcao-programada-entrega/test-uuid-123/",
        );
      });

      await waitFor(() => {
        expect(mockOnDelete).toHaveBeenCalled();
        expect(mockCloseModal).toHaveBeenCalled();
      });
    });

    it("deve exibir mensagem de erro se a exclusão falhar", async () => {
      mock
        .onDelete(/\/interrupcao-programada-entrega\/test-uuid-123\/?/)
        .reply(500);
      const user = userEvent.setup();
      render(<ModalDetalheInterrupcao {...defaultProps} />);

      const excluirBtn = screen.getByText("Excluir");
      await user.click(excluirBtn);

      await waitFor(() => {
        expect(mock.history.delete.length).toBe(1);
      });

      // Não deve fechar o modal nem chamar onDelete em caso de erro
      expect(mockOnDelete).not.toHaveBeenCalled();
      expect(mockCloseModal).not.toHaveBeenCalled();
    });
  });
});
