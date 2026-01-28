import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { ModalCadastrarInterrupcao } from "../index";
import mock from "../../../../../../services/_mock";

const mockCloseModal = jest.fn();
const mockOnSave = jest.fn();

const defaultProps = {
  showModal: true,
  closeModal: mockCloseModal,
  dataSelecionada: new Date(2026, 0, 25),
  onSave: mockOnSave,
};

const mockMotivos = [
  { value: "EMENDA", label: "Emenda" },
  { value: "REUNIAO", label: "Reunião" },
  { value: "INVENTARIO", label: "Inventário" },
  { value: "OUTROS", label: "Outros" },
];

describe("ModalCadastrarInterrupcao", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mock
      .onGet(/\/interrupcao-programada-entrega\/motivos\/?/)
      .reply(200, mockMotivos);
    mock
      .onPost(/\/interrupcao-programada-entrega\/?/)
      .reply(201, { uuid: "test-uuid", motivo: "REUNIAO" });
  });

  afterEach(() => {
    mock.reset();
  });

  describe("Renderização", () => {
    it("deve renderizar o modal quando showModal é true", async () => {
      render(<ModalCadastrarInterrupcao {...defaultProps} />);

      await waitFor(() => {
        expect(
          screen.getByText("Interrupção Programada de Entregas"),
        ).toBeInTheDocument();
      });
    });

    it("deve exibir a data selecionada no subtítulo", async () => {
      render(<ModalCadastrarInterrupcao {...defaultProps} />);

      await waitFor(() => {
        expect(
          screen.getByText(/Cadastro de interrupção de entregas para o dia/i),
        ).toBeInTheDocument();
        expect(screen.getByText("25/01/2026")).toBeInTheDocument();
      });
    });

    it("deve renderizar os campos do formulário", async () => {
      render(<ModalCadastrarInterrupcao {...defaultProps} />);

      await waitFor(() => {
        expect(
          screen.getByRole("combobox", { name: /Motivo da Interrupção/i }),
        ).toBeInTheDocument();
        expect(
          screen.getByRole("combobox", { name: /Tipo de Calendário/i }),
        ).toBeInTheDocument();
        // Garante que as opções carregaram
        expect(
          screen.getByRole("option", { name: /Reunião/i }),
        ).toBeInTheDocument();
      });
    });

    it("deve renderizar os botões Cancelar e Cadastrar", async () => {
      render(<ModalCadastrarInterrupcao {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText("Cancelar")).toBeInTheDocument();
        expect(screen.getByText("Cadastrar")).toBeInTheDocument();
      });
    });
  });

  describe("Campo descrição condicional", () => {
    it("não deve exibir campo descrição inicialmente", async () => {
      render(<ModalCadastrarInterrupcao {...defaultProps} />);

      await waitFor(() => {
        expect(
          screen.queryByLabelText(/Descrição do Motivo/i),
        ).not.toBeInTheDocument();
      });
    });

    it("deve exibir campo descrição quando motivo é OUTROS", async () => {
      const user = userEvent.setup();
      render(<ModalCadastrarInterrupcao {...defaultProps} />);

      const motivoSelect = await screen.findByRole("combobox", {
        name: /Motivo da Interrupção/i,
      });

      // Espera as opções carregarem
      await waitFor(() =>
        expect(
          screen.getByRole("option", { name: /Outros/i }),
        ).toBeInTheDocument(),
      );

      await user.selectOptions(motivoSelect, "OUTROS");

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText(/Descreva o motivo/i),
        ).toBeInTheDocument();
      });
    });

    it("deve ocultar campo descrição quando motivo muda de OUTROS para outro valor", async () => {
      const user = userEvent.setup();
      render(<ModalCadastrarInterrupcao {...defaultProps} />);

      const motivoSelect = await screen.findByRole("combobox", {
        name: /Motivo da Interrupção/i,
      });

      // Espera as opções carregarem
      await waitFor(() =>
        expect(
          screen.getByRole("option", { name: /Outros/i }),
        ).toBeInTheDocument(),
      );

      await user.selectOptions(motivoSelect, "OUTROS");

      const descricaoInput =
        await screen.findByPlaceholderText(/Descreva o motivo/i);
      expect(descricaoInput).toBeInTheDocument();

      await user.selectOptions(motivoSelect, "REUNIAO");

      await waitFor(() => {
        expect(
          screen.queryByPlaceholderText(/Descreva o motivo/i),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Validação", () => {
    it("deve validar que motivo é obrigatório", async () => {
      const user = userEvent.setup();
      render(<ModalCadastrarInterrupcao {...defaultProps} />);

      // Aguarda carregar
      await screen.findByRole("option", { name: /Reunião/i });

      const cadastrarBtn = screen.getByText("Cadastrar").closest("button");
      await user.click(cadastrarBtn!);

      expect(mock.history.post.length).toBe(0);
    });

    it("deve validar que descrição é obrigatória quando motivo é OUTROS", async () => {
      const user = userEvent.setup();
      render(<ModalCadastrarInterrupcao {...defaultProps} />);

      const motivoSelect = await screen.findByRole("combobox", {
        name: /Motivo da Interrupção/i,
      });

      // Aguarda carregar
      await waitFor(() =>
        expect(
          screen.getByRole("option", { name: /Outros/i }),
        ).toBeInTheDocument(),
      );

      await user.selectOptions(motivoSelect, "OUTROS");

      const cadastrarBtn = screen.getByText("Cadastrar").closest("button");
      await user.click(cadastrarBtn!);

      expect(mock.history.post.length).toBe(0);
    });
  });

  describe("Submit", () => {
    it("deve submeter com sucesso quando dados são válidos", async () => {
      const user = userEvent.setup();
      render(<ModalCadastrarInterrupcao {...defaultProps} />);

      const motivoSelect = await screen.findByRole("combobox", {
        name: /Motivo da Interrupção/i,
      });

      // Aguarda carregar
      await waitFor(() =>
        expect(
          screen.getByRole("option", { name: /Reunião/i }),
        ).toBeInTheDocument(),
      );

      await user.selectOptions(motivoSelect, "REUNIAO");

      const tipoSelect = screen.getByRole("combobox", {
        name: /Tipo de Calendário/i,
      });
      await user.selectOptions(tipoSelect, "ARMAZENAVEL");

      const cadastrarBtn = screen.getByText("Cadastrar").closest("button");
      await waitFor(() => expect(cadastrarBtn).not.toBeDisabled());

      await user.click(cadastrarBtn!);

      await waitFor(() => {
        expect(mock.history.post.length).toBe(1);
        const requestData = JSON.parse(mock.history.post[0].data);
        expect(requestData).toEqual({
          data: "2026-01-25",
          motivo: "REUNIAO",
          descricao_motivo: "",
          tipo_calendario: "ARMAZENAVEL",
        });
      });

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalled();
        expect(mockCloseModal).toHaveBeenCalled();
      });
    });

    it("deve submeter com descrição quando motivo é OUTROS", async () => {
      const user = userEvent.setup();
      render(<ModalCadastrarInterrupcao {...defaultProps} />);

      const motivoSelect = await screen.findByRole("combobox", {
        name: /Motivo da Interrupção/i,
      });

      // Aguarda carregar
      await waitFor(() =>
        expect(
          screen.getByRole("option", { name: /Outros/i }),
        ).toBeInTheDocument(),
      );

      await user.selectOptions(motivoSelect, "OUTROS");

      const descricaoInput =
        await screen.findByPlaceholderText(/Descreva o motivo/i);
      await user.type(descricaoInput, "Motivo específico");

      const tipoSelect = screen.getByRole("combobox", {
        name: /Tipo de Calendário/i,
      });
      await user.selectOptions(tipoSelect, "ARMAZENAVEL");

      const cadastrarBtn = screen.getByText("Cadastrar").closest("button");
      await waitFor(() => expect(cadastrarBtn).not.toBeDisabled());

      await user.click(cadastrarBtn!);

      await waitFor(() => {
        expect(mock.history.post.length).toBe(1);
        const requestData = JSON.parse(mock.history.post[0].data);
        expect(requestData).toEqual({
          data: "2026-01-25",
          motivo: "OUTROS",
          descricao_motivo: "Motivo específico",
          tipo_calendario: "ARMAZENAVEL",
        });
      });
    });

    it("deve fechar modal ao clicar em Cancelar", async () => {
      const user = userEvent.setup();
      render(<ModalCadastrarInterrupcao {...defaultProps} />);

      const cancelarBtn = await screen.findByText("Cancelar");
      await user.click(cancelarBtn);

      expect(mockCloseModal).toHaveBeenCalled();
      expect(mock.history.post.length).toBe(0);
    });
  });

  describe("Carregamento de dados", () => {
    it("deve carregar motivos ao abrir o modal", async () => {
      render(<ModalCadastrarInterrupcao {...defaultProps} />);

      await waitFor(() => {
        expect(
          mock.history.get.some((req: any) => req.url.includes("/motivos")),
        ).toBe(true);
      });
    });

    it("deve exibir loading enquanto carrega motivos", async () => {
      // Simula delay na resposta
      mock.reset();
      mock.onGet(/\/interrupcao-programada-entrega\/motivos\/?/).reply(() => {
        return new Promise(() => {});
      });

      render(<ModalCadastrarInterrupcao {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText(/Carregando/i)).toBeInTheDocument();
      });
    });
  });
});
