import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { CardPorStatus } from "../index";

const cardEmPreenchimento = {
  label: "Em preenchimento",
  status: "EM_PREENCHIMENTO",
  total: 5,
};

const criarProps = (sobrescritas = {}) => ({
  cardStatus: cardEmPreenchimento,
  form: { reset: jest.fn() } as any,
  statusSelecionado: "",
  setStatusSelecionado: jest.fn(),
  setFiltros: jest.fn(),
  setPage: jest.fn(),
  setRelatoriosVisita: jest.fn(),
  setConsultaRealizada: jest.fn(),
  ...sobrescritas,
});

const renderizarCard = (sobrescritas = {}) => {
  const props = criarProps(sobrescritas);
  const { container } = render(<CardPorStatus {...props} />);
  const card = container.querySelector(
    ".card-medicao-por-status",
  ) as HTMLElement;

  return { card, props };
};

const esperarEstadoLimpo = (props) => {
  expect(props.setPage).toHaveBeenCalledWith(1);
  expect(props.setRelatoriosVisita).toHaveBeenCalledWith([]);
  expect(props.setConsultaRealizada).toHaveBeenCalledWith(false);
};

describe("Card por status do painel de relatórios", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza um card clicável não selecionado", () => {
    const { card } = renderizarCard();

    expect(screen.getByText("Em preenchimento")).toBeInTheDocument();
    expect(screen.getByText("0005")).toBeInTheDocument();
    expect(screen.getByText("Conferir lista")).toBeInTheDocument();
    expect(card).toHaveClass("cinza", "cursor-pointer");
    expect(card).toHaveAttribute("role", "button");
    expect(card).toHaveAttribute("tabindex", "0");
    expect(card).toHaveAttribute("aria-pressed", "false");
  });

  it("aplica a cor correspondente quando o card está selecionado", () => {
    const { card } = renderizarCard({
      statusSelecionado: "EM_PREENCHIMENTO",
    });

    expect(card).toHaveClass("verde-claro", "cursor-pointer");
    expect(card).not.toHaveClass("cinza");
    expect(card).toHaveAttribute("aria-pressed", "true");
  });

  it("não permite selecionar um card sem relatórios", () => {
    const form = { reset: jest.fn() };
    const { card, props } = renderizarCard({
      cardStatus: { ...cardEmPreenchimento, total: 0 },
      form,
      statusSelecionado: "EM_PREENCHIMENTO",
    });

    expect(screen.getByText("0000")).toBeInTheDocument();
    expect(card).toHaveClass("cinza");
    expect(card).not.toHaveClass("cursor-pointer");
    expect(card).not.toHaveAttribute("role");
    expect(card).not.toHaveAttribute("tabindex");
    expect(card).not.toHaveAttribute("aria-pressed");

    fireEvent.click(card);
    fireEvent.keyDown(card, { key: "Enter" });

    expect(form.reset).not.toHaveBeenCalled();
    expect(props.setPage).not.toHaveBeenCalled();
    expect(props.setRelatoriosVisita).not.toHaveBeenCalled();
    expect(props.setConsultaRealizada).not.toHaveBeenCalled();
    expect(props.setStatusSelecionado).not.toHaveBeenCalled();
    expect(props.setFiltros).not.toHaveBeenCalled();
  });

  it("limpa a consulta anterior e seleciona o status ao clicar", () => {
    const form = { reset: jest.fn() };
    const { card, props } = renderizarCard({ form });

    fireEvent.click(card);

    expect(form.reset).toHaveBeenCalledTimes(1);
    esperarEstadoLimpo(props);
    expect(props.setStatusSelecionado).toHaveBeenCalledWith("EM_PREENCHIMENTO");
    expect(props.setFiltros).toHaveBeenCalledWith({
      status: "EM_PREENCHIMENTO",
    });
  });

  it("envia o status vazio ao selecionar todos os relatórios", () => {
    const cardTodosOsRelatorios = {
      label: "Todos os relatórios",
      status: "TODOS_OS_RELATORIOS",
      total: 12,
    };
    const { card, props } = renderizarCard({
      cardStatus: cardTodosOsRelatorios,
      statusSelecionado: "TODOS_OS_RELATORIOS",
    });

    fireEvent.click(card);

    expect(card).toHaveClass("vermelho");
    expect(props.setStatusSelecionado).toHaveBeenCalledWith(
      "TODOS_OS_RELATORIOS",
    );
    expect(props.setFiltros).toHaveBeenCalledWith({ status: "" });
  });

  it.each(["Enter", " "])(
    "permite selecionar o card utilizando a tecla %p",
    (tecla) => {
      const { card, props } = renderizarCard({ form: undefined });

      fireEvent.keyDown(card, { key: tecla });

      esperarEstadoLimpo(props);
      expect(props.setStatusSelecionado).toHaveBeenCalledWith(
        "EM_PREENCHIMENTO",
      );
      expect(props.setFiltros).toHaveBeenCalledWith({
        status: "EM_PREENCHIMENTO",
      });
    },
  );

  it("ignora outras teclas", () => {
    const form = { reset: jest.fn() };
    const { card, props } = renderizarCard({ form });

    fireEvent.keyDown(card, { key: "Escape" });

    expect(form.reset).not.toHaveBeenCalled();
    expect(props.setPage).not.toHaveBeenCalled();
    expect(props.setStatusSelecionado).not.toHaveBeenCalled();
    expect(props.setFiltros).not.toHaveBeenCalled();
  });
});
