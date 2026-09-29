import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import Especificacoes from "../index";

jest.mock("redux-form", () => ({
  Field: ({ component: Componente, ...props }) => <Componente {...props} />,
}));

jest.mock("src/components/Shareable/Input/InputText", () => ({
  __esModule: true,
  default: ({ label, name }) => (
    <input aria-label={label || name} name={name} />
  ),
}));

jest.mock("src/components/Shareable/Select", () => ({
  __esModule: true,
  default: ({ label, name, options = [] }) => (
    <select aria-label={label || name} name={name} defaultValue="">
      {options.map((opcao, indice) => (
        <option key={`${opcao.uuid}-${indice}`} value={opcao.uuid || ""}>
          {opcao.nome}
        </option>
      ))}
    </select>
  ),
}));

jest.mock("src/components/Shareable/Botao", () => ({
  __esModule: true,
  default: ({ icon, onClick, texto }) => (
    <button aria-label={texto || icon} type="button" onClick={onClick}>
      {texto}
    </button>
  ),
}));

const UUID_UNIDADE = "11111111-1111-4111-8111-111111111111";
const UUID_EMBALAGEM = "22222222-2222-4222-8222-222222222222";

const criarCampos = (nomes = []) => ({
  length: nomes.length,
  map: (funcao) => nomes.map(funcao),
  push: jest.fn(),
  remove: jest.fn(),
});

const criarProps = (sobrescritas = {}) => ({
  fields: criarCampos(),
  meta: { error: undefined, submitFailed: false },
  unidades_de_medida: [{ uuid: UUID_UNIDADE, nome: "QUILOGRAMA" }],
  embalagens: [{ uuid: UUID_EMBALAGEM, nome: "PACOTE" }],
  especificacoesIniciais: null,
  ...sobrescritas,
});

describe("Especificações do cadastro de produto", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.each([null, []])(
    "adiciona a primeira especificação quando não houver valores iniciais",
    async (especificacoesIniciais) => {
      const props = criarProps({ especificacoesIniciais });

      render(<Especificacoes {...props} />);

      await waitFor(() => {
        expect(props.fields.push).toHaveBeenCalledWith({});
      });
    },
  );

  it.each([
    { unidades_de_medida: null },
    { embalagens: null },
    { especificacoesIniciais: [{ volume: "1" }] },
  ])(
    "não adiciona automaticamente quando faltarem opções ou existirem valores iniciais",
    async (sobrescritas) => {
      const props = criarProps(sobrescritas);

      render(<Especificacoes {...props} />);

      await waitFor(() => {
        expect(props.fields.push).not.toHaveBeenCalled();
      });
    },
  );

  it("apresenta os campos e opções das especificações", () => {
    const props = criarProps({
      fields: criarCampos(["especificacoes[0]"]),
      especificacoesIniciais: [],
    });

    render(<Especificacoes {...props} />);

    expect(screen.getByLabelText("Volume")).toBeInTheDocument();
    expect(screen.getByLabelText("Unidade de Medida")).toBeInTheDocument();
    expect(screen.getByLabelText("Embalagem")).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Selecione a Unidade de Medida" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "QUILOGRAMA" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Selecione a Embalagem" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "PACOTE" })).toBeInTheDocument();
  });

  it("adiciona e remove especificações", () => {
    const fields = criarCampos(["especificacoes[0]", "especificacoes[1]"]);
    const props = criarProps({ fields, especificacoesIniciais: [{}] });

    render(<Especificacoes {...props} />);

    expect(screen.getAllByLabelText("Volume")).toHaveLength(2);
    expect(screen.getAllByLabelText("fas fa-trash-alt")).toHaveLength(1);

    fireEvent.click(screen.getByLabelText("fas fa-trash-alt"));
    fireEvent.click(screen.getByRole("button", { name: "Adicionar" }));

    expect(fields.remove).toHaveBeenCalledWith(1);
    expect(fields.push).toHaveBeenCalledWith({});
  });

  it("não permite remover a primeira especificação", () => {
    const props = criarProps({
      fields: criarCampos(["especificacoes[0]"]),
      especificacoesIniciais: [{}],
    });

    render(<Especificacoes {...props} />);

    expect(screen.queryByLabelText("fas fa-trash-alt")).not.toBeInTheDocument();
  });

  it("apresenta o erro das especificações após a tentativa de envio", () => {
    const props = criarProps({
      fields: criarCampos(["especificacoes[0]"]),
      meta: {
        error: "Informe pelo menos uma especificação",
        submitFailed: true,
      },
    });

    render(<Especificacoes {...props} />);

    expect(
      screen.getByText("Informe pelo menos uma especificação"),
    ).toBeInTheDocument();
  });

  it.each([
    { error: undefined, submitFailed: true },
    { error: "Erro", submitFailed: false },
  ])("não apresenta erro antes do envio inválido", (meta) => {
    const props = criarProps({
      fields: criarCampos(["especificacoes[0]"]),
      meta,
    });

    render(<Especificacoes {...props} />);

    expect(screen.queryByText("Erro")).not.toBeInTheDocument();
  });
});
