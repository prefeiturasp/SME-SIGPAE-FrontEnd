import { render, fireEvent, screen } from "@testing-library/react";
import ModalReabrirLancamentos from "../../components/ModalReabrirLancamentos";

describe("Teste de comportamentos Modal Reabrir Lancamentos", () => {
  const unidadesEducacionais = [
    {
      label: "Unidade Educacional 1",
      value: "1",
    },
    {
      label: "Unidade Educacional 2",
      value: "2",
    },
  ];

  const setMultiSelect = async (testId, label) => {
    const container = screen.getByTestId(testId);
    const input = container.querySelector("input");

    if (!input) throw new Error("Input do react-select não encontrado");

    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: "ArrowDown" });

    const option = await screen.findByText(label);
    fireEvent.click(option);
  };

  const setup = (props = {}) => {
    const defaultProps = {
      showModal: true,
      setShowModal: jest.fn(),
      onReabrir: jest.fn(),
      unidadesEducacionais,
    };

    return render(<ModalReabrirLancamentos {...defaultProps} {...props} />);
  };

  it("deve renderizar o modal quando showModal for true", () => {
    setup();

    expect(
      screen.getByText("Reabrir Lançamentos do Grupo"),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/As medições deste grupo já foram aprovadas/i),
    ).toBeInTheDocument();
  });

  it("não deve renderizar o modal quando showModal for false", () => {
    setup({
      showModal: false,
    });

    expect(
      screen.queryByText("Reabrir Lançamentos do Grupo"),
    ).not.toBeInTheDocument();
  });

  it("deve renderizar as unidades educacionais", () => {
    setup();

    const container = screen.getByTestId("unidades_educacionais");
    const input = container.querySelector("input");

    expect(input).toBeInTheDocument();
  });

  it("deve permitir selecionar uma unidade educacional", async () => {
    setup();

    await setMultiSelect("unidades_educacionais", "Unidade Educacional 1");

    expect(screen.getByText("Unidade Educacional 1")).toBeInTheDocument();
  });

  it("deve permitir selecionar mais de uma unidade educacional", async () => {
    setup();

    await setMultiSelect("unidades_educacionais", "Unidade Educacional 1");

    await setMultiSelect("unidades_educacionais", "Unidade Educacional 2");

    expect(screen.getByText("Unidade Educacional 1")).toBeInTheDocument();

    expect(screen.getByText("Unidade Educacional 2")).toBeInTheDocument();
  });

  it("deve fechar o modal ao clicar em Cancelar", () => {
    const setShowModal = jest.fn();

    setup({
      setShowModal,
    });

    fireEvent.click(screen.getByTestId("botao-nao"));

    expect(setShowModal).toHaveBeenCalledTimes(1);
    expect(setShowModal).toHaveBeenCalledWith(false);
  });

  it("deve fechar o modal ao clicar no botão de fechar", () => {
    const setShowModal = jest.fn();

    setup({
      setShowModal,
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /close/i,
      }),
    );

    expect(setShowModal).toHaveBeenCalledTimes(1);
    expect(setShowModal).toHaveBeenCalledWith(false);
  });

  it("deve chamar onReabrir ao clicar em Reabrir", () => {
    const onReabrir = jest.fn();

    setup({
      onReabrir,
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Reabrir",
      }),
    );

    expect(onReabrir).toHaveBeenCalledTimes(1);
  });

  it("deve renderizar o backdrop quando o modal estiver aberto", () => {
    const { container } = setup();

    expect(container.querySelector(".modal-backdrop.show")).toBeInTheDocument();
  });

  it("não deve renderizar o backdrop quando o modal estiver fechado", () => {
    const { container } = setup({
      showModal: false,
    });

    expect(
      container.querySelector(".modal-backdrop.show"),
    ).not.toBeInTheDocument();
  });
});
