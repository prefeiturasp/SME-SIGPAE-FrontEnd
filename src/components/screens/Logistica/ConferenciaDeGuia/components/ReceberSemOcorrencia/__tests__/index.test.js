import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import ReceberSemOcorrencia from "../index";
import {
  recebeGuiaSemOcorrencia,
  editaGuiaComOcorrencia,
} from "src/services/logistica.service";
import {
  toastSuccess,
  toastError,
} from "src/components/Shareable/Toast/dialogs";

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

jest.mock("src/services/logistica.service", () => ({
  recebeGuiaSemOcorrencia: jest.fn(),
  editaGuiaComOcorrencia: jest.fn(),
}));

jest.mock("src/components/Shareable/Toast/dialogs", () => ({
  toastSuccess: jest.fn(),
  toastError: jest.fn(),
}));

describe("Componente ReceberSemOcorrencia", () => {
  const mockNavigate = jest.fn();
  const mockValues = {
    numero_guia: "12345",
    data_entrega: "2023-01-01",
    data_entrega_real: "2023-01-02",
    outros_dados: "valor-teste",
  };

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    jest.clearAllMocks();
  });

  it("deve renderizar o botão principal corretamente e abrir o modal ao clicar", () => {
    render(<ReceberSemOcorrencia values={mockValues} disabled={false} />);

    const botaoPrincipal = screen.getByRole("button", {
      name: /Salvar e Continuar/i,
    });
    expect(botaoPrincipal).toBeInTheDocument();

    fireEvent.click(botaoPrincipal);
    expect(screen.getByText("Registro de conferência")).toBeInTheDocument();
  });

  it("deve desabilitar o botão principal quando disabled=true", () => {
    render(<ReceberSemOcorrencia values={mockValues} disabled={true} />);
    const botao = screen.getByRole("button", { name: /Salvar e Continuar/i });
    expect(botao).toBeDisabled();
  });

  it("deve exibir o conteúdo correto no modal", () => {
    render(<ReceberSemOcorrencia values={mockValues} disabled={false} />);
    fireEvent.click(
      screen.getByRole("button", { name: /Salvar e Continuar/i })
    );

    expect(
      screen.getByText(
        /Você está finalizando o registro de conferência da Guia 12345/i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText("Deseja prosseguir com o registro?")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        new RegExp(
          `Data de conferência: ${moment(new Date()).format("DD/MM/YYYY")}`
        )
      )
    ).toBeInTheDocument();
  });

  it("deve fechar o modal ao clicar no botão Cancelar ou no X", async () => {
    render(<ReceberSemOcorrencia values={mockValues} disabled={false} />);
    const botaoPrincipal = screen.getByRole("button", {
      name: /Salvar e Continuar/i,
    });

    fireEvent.click(botaoPrincipal);
    expect(screen.getByText("Registro de conferência")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Cancelar/i }));
    await waitFor(() => {
      expect(
        screen.queryByText("Registro de conferência")
      ).not.toBeInTheDocument();
    });

    fireEvent.click(botaoPrincipal);
    expect(screen.getByText("Registro de conferência")).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Close"));
    await waitFor(() => {
      expect(
        screen.queryByText("Registro de conferência")
      ).not.toBeInTheDocument();
    });
  });

  it("deve lidar com o fluxo de sucesso para nova conferência", async () => {
    recebeGuiaSemOcorrencia.mockResolvedValueOnce({});

    render(<ReceberSemOcorrencia values={mockValues} disabled={false} />);
    fireEvent.click(
      screen.getByRole("button", { name: /Salvar e Continuar/i })
    );
    fireEvent.click(
      screen.getByRole("button", { name: /Registrar Conferência/i })
    );

    await waitFor(() => {
      expect(recebeGuiaSemOcorrencia).toHaveBeenCalledWith({
        outros_dados: "valor-teste",
      });
      expect(toastSuccess).toHaveBeenCalledWith(
        "Guia de remessa recebida com sucesso"
      );
      expect(mockNavigate).toHaveBeenCalledWith("/logistica/conferir-entrega");
    });
  });

  it("deve lidar com o fluxo de sucesso para edição de conferência", async () => {
    editaGuiaComOcorrencia.mockResolvedValueOnce({});
    const uuidEdicao = "uuid-teste";

    render(
      <ReceberSemOcorrencia
        values={mockValues}
        disabled={false}
        uuidEdicao={uuidEdicao}
      />
    );
    fireEvent.click(
      screen.getByRole("button", { name: /Salvar e Continuar/i })
    );
    fireEvent.click(
      screen.getByRole("button", { name: /Editar Conferência/i })
    );

    await waitFor(() => {
      expect(editaGuiaComOcorrencia).toHaveBeenCalledWith({
        uuid_conferencia: uuidEdicao,
        outros_dados: "valor-teste",
        conferencia_dos_alimentos: [],
      });
      expect(toastSuccess).toHaveBeenCalledWith(
        "Conferência editada com sucesso. O respectivo registro de reposição foi apagado."
      );
      expect(mockNavigate).toHaveBeenCalledWith("/logistica/conferir-entrega");
    });
  });

  it("deve lidar com o fluxo de erro para nova conferência", async () => {
    recebeGuiaSemOcorrencia.mockRejectedValueOnce({});

    render(<ReceberSemOcorrencia values={mockValues} disabled={false} />);
    fireEvent.click(
      screen.getByRole("button", { name: /Salvar e Continuar/i })
    );
    fireEvent.click(
      screen.getByRole("button", { name: /Registrar Conferência/i })
    );

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith(
        "Erro ao registrar Guia de Remessa, procure o administrador do SIGPAE na sua Unidade!"
      );
    });
  });

  it("deve lidar com o fluxo de erro para edição de conferência", async () => {
    const errorResponse = { response: { data: { detail: "Erro detalhado" } } };
    editaGuiaComOcorrencia.mockRejectedValueOnce(errorResponse);
    const uuidEdicao = "uuid-teste";

    render(
      <ReceberSemOcorrencia
        values={mockValues}
        disabled={false}
        uuidEdicao={uuidEdicao}
      />
    );
    fireEvent.click(
      screen.getByRole("button", { name: /Salvar e Continuar/i })
    );
    fireEvent.click(
      screen.getByRole("button", { name: /Editar Conferência/i })
    );

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith("Erro detalhado");
    });
  });
});
