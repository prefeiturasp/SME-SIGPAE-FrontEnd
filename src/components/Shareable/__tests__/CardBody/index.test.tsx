import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { usuarioEhEmpresaTerceirizada } from "src/helpers/utilities";
import { getNomesUnicosEditais } from "src/services/produto.service";
import CardBody from "../../CardBody";

jest.mock("react-redux", () => ({
  connect: () => (componente) => componente,
}));

jest.mock("src/helpers/utilities", () => ({
  usuarioEhEmpresaTerceirizada: jest.fn(),
}));

jest.mock("src/services/produto.service", () => ({
  getNomesUnicosEditais: jest.fn(),
}));

jest.mock("antd", () => {
  const React = require("react");

  return {
    Spin: ({ tip }) => React.createElement("div", { role: "status" }, tip),
  };
});

jest.mock("src/components/Shareable/Input/InputText", () => {
  const React = require("react");

  return {
    __esModule: true,
    default: ({ input, inputOnChange, placeholder, disabled }) =>
      React.createElement("input", {
        ...input,
        "aria-label": placeholder || input.name,
        disabled,
        placeholder,
        onChange: (evento) => {
          input.onChange(evento);
          inputOnChange(evento);
        },
      }),
  };
});

jest.mock("src/components/Shareable/Select", () => {
  const React = require("react");

  return {
    Select: ({ input, onChangeEffect, options = [], placeholder, disabled }) =>
      React.createElement(
        "select",
        {
          ...input,
          "aria-label": placeholder || input.name,
          disabled,
          onChange: (evento) => {
            input.onChange(evento);
            onChangeEffect(evento);
          },
        },
        options.map((opcao) =>
          React.createElement(
            "option",
            {
              key: opcao.uuid || opcao.value,
              value: opcao.uuid || opcao.value,
            },
            opcao.nome || opcao.label,
          ),
        ),
      ),
  };
});

jest.mock("src/components/Shareable/DatePicker", () => {
  const React = require("react");

  return {
    InputComData: ({ input, inputOnChange, placeholder, disabled }) =>
      React.createElement("input", {
        ...input,
        "aria-label": placeholder || input.name,
        disabled,
        placeholder,
        onChange: (evento) => {
          input.onChange(evento);
          inputOnChange(evento.target.value);
        },
      }),
  };
});

jest.mock("src/components/Shareable/MakeField", () => {
  const React = require("react");

  return {
    ASelect: ({ input, onChange, options = [], placeholder, disabled }) =>
      React.createElement(
        "select",
        {
          ...input,
          "aria-label": placeholder || input.name,
          disabled,
          onChange: (evento) => {
            input.onChange(evento.target.value);
            onChange(evento.target.value);
          },
        },
        options.map((opcao) =>
          React.createElement(
            "option",
            { key: opcao.value, value: opcao.value },
            opcao.label,
          ),
        ),
      ),
  };
});

const mockUsuarioEhEmpresaTerceirizada = jest.mocked(
  usuarioEhEmpresaTerceirizada,
);
const mockGetNomesUnicosEditais = jest.mocked(getNomesUnicosEditais);

const criarProps = (sobrescritas = {}) => ({
  titulo: "Solicitações",
  dataAtual: "11/09/2026",
  onChange: jest.fn(),
  updateStatusDieta: jest.fn(),
  updateTituloDieta: jest.fn(),
  updateLoteDieta: jest.fn(),
  updateMarcaProduto: jest.fn(),
  updateNomeProduto: jest.fn(),
  updateEditalProduto: jest.fn(),
  updateTituloAlimentacao: jest.fn(),
  updateLoteAlimentacao: jest.fn(),
  updateStatusAlimentacao: jest.fn(),
  updateTipoSolicitacaoAlimentacao: jest.fn(),
  updateDataEventoAlimentacao: jest.fn(),
  ...sobrescritas,
});

describe("CardBody", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.history.pushState({}, "", "/");
    mockUsuarioEhEmpresaTerceirizada.mockReturnValue(false);
    mockGetNomesUnicosEditais.mockImplementation(
      () => new Promise(() => undefined),
    );
  });

  it("exibe o título, a data, a pesquisa e o conteúdo recebido", () => {
    const props = criarProps();

    render(
      <CardBody {...props}>
        <div>Conteúdo do card</div>
      </CardBody>,
    );

    expect(screen.getByText("Solicitações")).toBeInTheDocument();
    expect(screen.getByText("11/09/2026")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Pesquisar" })).toBeEnabled();
    expect(screen.getByText("* mínimo de 3 caracteres")).toBeInTheDocument();
    expect(screen.getByText("Conteúdo do card")).toBeInTheDocument();
  });

  it.each([
    ["/painel-dieta-especial", "updateTituloDieta"],
    ["/painel-gestao-produto", "updateNomeProduto"],
    ["/painel-gestao-alimentacao", "updateTituloAlimentacao"],
  ])(
    "atualiza a pesquisa correspondente à rota %s",
    async (rota, atualizador) => {
      const usuario = userEvent.setup();
      const props = criarProps();
      window.history.pushState({}, "", rota);

      render(<CardBody {...props} />);

      await usuario.type(
        screen.getByRole("textbox", { name: "Pesquisar" }),
        "Arroz",
      );

      expect(props[atualizador]).toHaveBeenLastCalledWith("Arroz");
      expect(props.onChange).toHaveBeenCalled();
    },
  );

  it("atualiza o tipo de solicitação e a data do evento", async () => {
    const usuario = userEvent.setup();
    const props = criarProps({
      exibirFiltrosDataEventoETipoSolicitacao: true,
    });

    render(<CardBody {...props} />);

    await usuario.selectOptions(
      screen.getByRole("combobox", { name: "Tipo de Solicitação" }),
      "KIT_LANCHE",
    );
    await usuario.type(
      screen.getByRole("textbox", { name: "Data do evento" }),
      "11/09/2026",
    );

    expect(props.updateTipoSolicitacaoAlimentacao).toHaveBeenCalledWith(
      "KIT_LANCHE",
    );
    expect(props.updateDataEventoAlimentacao).toHaveBeenLastCalledWith(
      "11/09/2026",
    );
    expect(props.onChange).toHaveBeenCalled();
  });

  it("carrega e atualiza os filtros da Gestão de Produtos", async () => {
    const usuario = userEvent.setup();
    const props = criarProps({ ehDashboardGestaoProduto: true });
    mockGetNomesUnicosEditais.mockResolvedValue({
      data: { results: ["Edital 01", "Edital 02"] },
    });

    render(<CardBody {...props} />);

    await screen.findByRole("option", { name: "Edital 02" });
    const campoEdital = screen.getByRole("combobox", {
      name: "Número do Edital",
    });
    await usuario.selectOptions(campoEdital, "Edital 02");
    await usuario.type(
      screen.getByRole("textbox", { name: "Busca da Marca" }),
      "Marca",
    );

    expect(mockGetNomesUnicosEditais).toHaveBeenCalledTimes(1);
    expect(props.updateEditalProduto).toHaveBeenCalledWith("Edital 02");
    expect(props.updateMarcaProduto).toHaveBeenLastCalledWith("Marca");
    expect(props.onChange).toHaveBeenCalled();
  });

  it("exibe o carregamento e desabilita os filtros vinculados a ele", () => {
    const props = criarProps({
      ehDashboardGestaoProduto: true,
      loadingDietas: true,
    });

    render(<CardBody {...props} />);

    expect(screen.getAllByRole("status")).toHaveLength(2);
    expect(screen.getByRole("combobox", { name: "edital" })).toBeDisabled();
    expect(screen.getByRole("textbox", { name: "titulo" })).toBeDisabled();
  });

  it("atualiza os filtros de status e lote da empresa terceirizada", async () => {
    const usuario = userEvent.setup();
    const props = criarProps({
      listaStatus: [
        { nome: "Conferido", uuid: "CONFERIDO" },
        { nome: "Não conferido", uuid: "NAO_CONFERIDO" },
      ],
      listaLotes: [
        {
          nome: "Lote 01",
          uuid: "33cdd755-61cb-4fe5-b2f8-e3e4bbd39d19",
        },
      ],
    });
    mockUsuarioEhEmpresaTerceirizada.mockReturnValue(true);

    render(<CardBody {...props} />);

    await usuario.selectOptions(
      screen.getByRole("combobox", { name: "Conferência Status" }),
      "CONFERIDO",
    );
    await usuario.selectOptions(
      screen.getByRole("combobox", { name: "Selecione um Lote" }),
      "33cdd755-61cb-4fe5-b2f8-e3e4bbd39d19",
    );

    expect(props.updateStatusAlimentacao).toHaveBeenCalledWith("CONFERIDO");
    expect(props.updateStatusDieta).toHaveBeenCalledWith("CONFERIDO");
    expect(props.updateLoteAlimentacao).toHaveBeenCalledWith(
      "33cdd755-61cb-4fe5-b2f8-e3e4bbd39d19",
    );
    expect(props.updateLoteDieta).toHaveBeenCalledWith(
      "33cdd755-61cb-4fe5-b2f8-e3e4bbd39d19",
    );
  });

  it("exibe e atualiza os filtros adicionais da terceirizada em alimentação", async () => {
    const usuario = userEvent.setup();
    const props = criarProps();
    window.history.pushState({}, "", "/painel-gestao-alimentacao");
    mockUsuarioEhEmpresaTerceirizada.mockReturnValue(true);

    render(<CardBody {...props} />);

    await usuario.selectOptions(
      screen.getByRole("combobox", { name: "tipo_solicitacao" }),
      "Inversão",
    );
    await usuario.type(
      screen.getByRole("textbox", { name: "Data do evento" }),
      "12/09/2026",
    );

    expect(props.updateTipoSolicitacaoAlimentacao).toHaveBeenCalledWith(
      "Inversão",
    );
    expect(props.updateDataEventoAlimentacao).toHaveBeenLastCalledWith(
      "12/09/2026",
    );
  });

  it("desabilita os filtros quando essa configuração é informada", () => {
    const props = criarProps({
      exibirFiltrosDataEventoETipoSolicitacao: true,
      filtrosDesabilitados: true,
    });

    render(<CardBody {...props} />);

    expect(screen.getByRole("textbox", { name: "Pesquisar" })).toBeDisabled();
    expect(
      screen.getByRole("combobox", { name: "Tipo de Solicitação" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("textbox", { name: "Data do evento" }),
    ).toBeDisabled();
  });
});
