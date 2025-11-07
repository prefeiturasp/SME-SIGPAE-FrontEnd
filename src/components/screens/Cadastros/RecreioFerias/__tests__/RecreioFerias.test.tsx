import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RecreioFerias } from "../index";

jest.mock("../components/ModalAdicionarUnidadeEducacional", () => ({
  ModalAdicionarUnidadeEducacional: ({
    showModal,
    setUnidadesParticipantes,
    unidadesParticipantes,
  }) =>
    showModal ? (
      <div data-testid="modal-adicionar">
        <button
          onClick={() =>
            setUnidadesParticipantes([
              ...unidadesParticipantes,
              {
                id: "u1",
                dreLote: "DRE-01",
                unidadeEducacional: "UE Exemplo",
                numero_inscritos: 10,
                numero_colaboradores: 2,
                liberarMedicao: false,
                alimentacaoInscritos: ["A", "B"],
                alimentacaoInscritosInfantil: ["C"],
                alimentacaoColaboradores: ["D"],
              },
            ])
          }
        >
          mock-add
        </button>
      </div>
    ) : null,
}));

jest.mock("../components/ModalRemoverUnidadeEducacional", () => ({
  ModalRemoverUnidadeEducacional: ({
    showModal,
    closeModal,
    handleRemoverUnidade,
  }) =>
    showModal ? (
      <div data-testid="modal-remover">
        <button onClick={handleRemoverUnidade}>mock-confirm-remove</button>
        <button onClick={closeModal}>mock-close</button>
      </div>
    ) : null,
}));

describe("RecreioFerias component", () => {
  test("renderiza título e botão de adicionar", () => {
    render(<RecreioFerias />);

    expect(
      screen.getByText(/Informe o Período do Recreio nas Férias/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "+ Adicionar Unidades" })
    ).toBeInTheDocument();
  });

  test("abre modal de adicionar e adiciona uma unidade (renderiza linha)", async () => {
    render(<RecreioFerias />);

    userEvent.click(
      screen.getByRole("button", { name: "+ Adicionar Unidades" })
    );

    expect(await screen.findByTestId("modal-adicionar")).toBeInTheDocument();

    userEvent.click(screen.getByText("mock-add"));

    await waitFor(() => {
      expect(screen.getByText("UE Exemplo")).toBeInTheDocument();
      expect(screen.getByText("DRE-01")).toBeInTheDocument();
    });
  });

  test("toggle liberarMedicao via Switch altera estado (aria-checked)", async () => {
    render(<RecreioFerias />);

    userEvent.click(
      screen.getByRole("button", { name: "+ Adicionar Unidades" })
    );
    await screen.findByTestId("modal-adicionar");
    userEvent.click(screen.getByText("mock-add"));

    await waitFor(() =>
      expect(screen.getByText("UE Exemplo")).toBeInTheDocument()
    );

    const switchEl = screen.getByRole("switch");
    expect(switchEl).toHaveAttribute("aria-checked", "false");

    userEvent.click(switchEl);
    await waitFor(() =>
      expect(switchEl).toHaveAttribute("aria-checked", "true")
    );

    userEvent.click(switchEl);
    await waitFor(() =>
      expect(switchEl).toHaveAttribute("aria-checked", "false")
    );
  });

  test("adiciona unidade e mostra texto de Tipos de Alimentação Inscritos e os alimentos", async () => {
    render(<RecreioFerias />);

    userEvent.click(
      screen.getByRole("button", { name: "+ Adicionar Unidades" })
    );
    await screen.findByTestId("modal-adicionar");
    userEvent.click(screen.getByText("mock-add"));

    await waitFor(() =>
      expect(screen.getByText("UE Exemplo")).toBeInTheDocument()
    );

    const titulos = await screen.findAllByText(
      /Tipos de Alimentação Inscritos/i
    );
    expect(titulos.length).toBeGreaterThanOrEqual(1);

    expect(await screen.findByText(/A, B/i)).toBeInTheDocument();
  });

  test("remover unidade via modal remover", async () => {
    render(<RecreioFerias />);

    userEvent.click(
      screen.getByRole("button", { name: "+ Adicionar Unidades" })
    );
    await screen.findByTestId("modal-adicionar");
    userEvent.click(screen.getByText("mock-add"));

    await waitFor(() =>
      expect(screen.getByText("UE Exemplo")).toBeInTheDocument()
    );

    const removerButton = screen.getByTestId("remover-unidade-botao");

    const btnToUse = removerButton;
    expect(btnToUse).toBeDefined();

    userEvent.click(btnToUse);

    await screen.findByTestId("modal-remover");

    userEvent.click(screen.getByText("mock-confirm-remove"));

    await waitFor(() => {
      expect(screen.queryByText("UE Exemplo")).not.toBeInTheDocument();
    });
  });
});
