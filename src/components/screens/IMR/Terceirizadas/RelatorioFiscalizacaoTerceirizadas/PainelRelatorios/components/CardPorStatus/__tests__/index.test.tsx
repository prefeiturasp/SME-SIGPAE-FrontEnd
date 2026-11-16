import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { CardPorStatus } from "../index";

const cardEmPreenchimento = {
  label: "Em preenchimento",
  status: "EM_PREENCHIMENTO",
  total: 5,
};

const filtrosIniciais = Object.freeze({
  diretoria_regional: "8f1da4a7-11b6-4a09-9eaa-6633d066f26b",
  mes: 9,
  ano: 2026,
});

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
  const { container, rerender } = render(<CardPorStatus {...props} />);
  const card = container.querySelector(
    ".card-medicao-por-status",
  ) as HTMLElement;

  return { card, props, rerender };
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

  it("renderiza um card clicável não selecionado no novo painel", () => {
    const { card } = renderizarCard({ exibirNovoPainel: true });

    expect(screen.getByText("Em preenchimento")).toBeInTheDocument();
    expect(screen.getByText("0005")).toBeInTheDocument();
    expect(screen.getByText("Conferir lista")).toBeInTheDocument();
    expect(card).toHaveClass("verde-claro", "cursor-pointer");
    expect(card).not.toHaveClass("cinza");
    expect(card).toHaveAttribute("role", "button");
    expect(card).toHaveAttribute("tabindex", "0");
    expect(card).toHaveAttribute("aria-pressed", "false");
  });

  it.each([
    {
      status: "EM_PREENCHIMENTO",
      rotulo: "Em preenchimento pela Supervisão",
      cor: "verde-claro",
    },
    {
      status: "NUTRIMANIFESTACAO_A_VALIDAR",
      rotulo: "Enviados pela Supervisão",
      cor: "azul-claro",
    },
    {
      status: "COM_COMENTARIOS_DE_CODAE",
      rotulo: "Devolvidos com comentários",
      cor: "laranja",
    },
    {
      status: "CORRIGIDO_PELA_SUPERVISAO",
      rotulo: "Corrigidos pela Supervisão",
      cor: "azul-escuro",
    },
    {
      status: "VALIDADO_POR_CODAE",
      rotulo: "Validados pela CODAE",
      cor: "verde-escuro",
    },
  ])(
    "aplica a cor $cor de $rotulo sem seleção ou quando selecionado no novo painel",
    ({ status, rotulo, cor }) => {
      const { card, props, rerender } = renderizarCard({
        cardStatus: { label: rotulo, status, total: 2 },
        exibirNovoPainel: true,
      });

      expect(screen.getByText(rotulo)).toBeInTheDocument();
      expect(card).toHaveClass(cor, "cursor-pointer");
      expect(card).not.toHaveClass("cinza");
      expect(card).toHaveAttribute("aria-pressed", "false");

      rerender(<CardPorStatus {...props} statusSelecionado={status} />);

      expect(card).toHaveClass(cor);
      expect(card).not.toHaveClass("cinza");
      expect(card).toHaveAttribute("aria-pressed", "true");

      const outroStatus =
        status === "EM_PREENCHIMENTO"
          ? "NUTRIMANIFESTACAO_A_VALIDAR"
          : "EM_PREENCHIMENTO";
      rerender(<CardPorStatus {...props} statusSelecionado={outroStatus} />);

      expect(card).toHaveClass("cinza", "cursor-pointer");
      expect(card).not.toHaveClass(cor);
      expect(card).toHaveAttribute("aria-pressed", "false");

      rerender(<CardPorStatus {...props} statusSelecionado="" />);

      expect(card).toHaveClass(cor, "cursor-pointer");
      expect(card).not.toHaveClass("cinza");
      expect(card).toHaveAttribute("aria-pressed", "false");
    },
  );

  it.each([false, undefined])(
    "preserva as cores anteriores com a feature flag %p",
    (exibirNovoPainel) => {
      const { card, props, rerender } = renderizarCard({ exibirNovoPainel });

      expect(card).toHaveClass("cinza", "cursor-pointer");
      expect(card).not.toHaveClass("verde-claro");
      expect(card).toHaveAttribute("aria-pressed", "false");

      rerender(
        <CardPorStatus {...props} statusSelecionado="EM_PREENCHIMENTO" />,
      );

      expect(card).toHaveClass("verde-claro", "cursor-pointer");
      expect(card).not.toHaveClass("cinza");
      expect(card).toHaveAttribute("aria-pressed", "true");

      rerender(
        <CardPorStatus
          {...props}
          statusSelecionado="NUTRIMANIFESTACAO_A_VALIDAR"
        />,
      );

      expect(card).toHaveClass("cinza", "cursor-pointer");
      expect(card).not.toHaveClass("verde-claro");
      expect(card).toHaveAttribute("aria-pressed", "false");

      rerender(<CardPorStatus {...props} statusSelecionado="" />);

      expect(card).toHaveClass("cinza", "cursor-pointer");
      expect(card).not.toHaveClass("verde-claro");
    },
  );

  it.each([true, false, undefined])(
    "não permite selecionar um card sem relatórios com a feature flag %p",
    (exibirNovoPainel) => {
      const form = { reset: jest.fn() };
      const { card, props } = renderizarCard({
        cardStatus: { ...cardEmPreenchimento, total: 0 },
        exibirNovoPainel,
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
      fireEvent.keyDown(card, { key: " " });

      expect(form.reset).not.toHaveBeenCalled();
      expect(props.setPage).not.toHaveBeenCalled();
      expect(props.setRelatoriosVisita).not.toHaveBeenCalled();
      expect(props.setConsultaRealizada).not.toHaveBeenCalled();
      expect(props.setStatusSelecionado).not.toHaveBeenCalled();
      expect(props.setFiltros).not.toHaveBeenCalled();
    },
  );

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

  it("preserva DRE, mês e ano ao selecionar um status sem alterar os filtros iniciais", () => {
    const { card, props } = renderizarCard({ filtrosIniciais });

    fireEvent.click(card);

    esperarEstadoLimpo(props);
    expect(props.setFiltros).toHaveBeenCalledTimes(1);
    expect(props.setFiltros).toHaveBeenCalledWith({
      ...filtrosIniciais,
      status: "EM_PREENCHIMENTO",
    });
    expect(filtrosIniciais).not.toHaveProperty("status");
  });

  it.each([true, false])(
    "permite selecionar um card com dados que ficou cinza após outra seleção com a feature flag %p",
    (exibirNovoPainel) => {
      const { card, props } = renderizarCard({
        filtrosIniciais,
        exibirNovoPainel,
        statusSelecionado: "NUTRIMANIFESTACAO_A_VALIDAR",
      });

      expect(card).toHaveClass("cinza", "cursor-pointer");
      expect(card).not.toHaveClass("verde-claro");
      expect(card).toHaveAttribute("aria-pressed", "false");

      fireEvent.click(card);

      esperarEstadoLimpo(props);
      expect(props.setStatusSelecionado).toHaveBeenCalledWith(
        "EM_PREENCHIMENTO",
      );
      expect(props.setFiltros).toHaveBeenCalledWith({
        ...filtrosIniciais,
        status: "EM_PREENCHIMENTO",
      });
    },
  );

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
