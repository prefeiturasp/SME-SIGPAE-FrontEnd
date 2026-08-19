import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CadastroDuvidasFrequentes from "../DuvidasFrequentes/Cadastro";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import { getError } from "src/helpers/utilities";
import { criarPerguntaFrequente } from "src/services/faq.service";
import { useOpcoesCadastroDuvida } from "../DuvidasFrequentes/hooks/useOpcoesCadastroDuvida";

jest.mock("src/services/faq.service", () => ({
  criarPerguntaFrequente: jest.fn(),
}));

jest.mock("src/components/Shareable/Toast/dialogs", () => ({
  toastError: jest.fn(),
  toastSuccess: jest.fn(),
}));

jest.mock("src/helpers/utilities", () => ({
  getError: jest.fn(),
}));

jest.mock("../DuvidasFrequentes/hooks/useOpcoesCadastroDuvida", () => ({
  useOpcoesCadastroDuvida: jest.fn(),
}));

jest.mock("src/components/Shareable/Botao", () => ({
  __esModule: true,
  default: ({ disabled, onClick, texto, type }) => (
    <button
      type={type === "submit" ? "submit" : "button"}
      disabled={disabled}
      onClick={onClick}
    >
      {texto}
    </button>
  ),
}));

jest.mock("src/components/Shareable/Input/InputText", () => ({
  __esModule: true,
  default: ({ input, label, placeholder, required }) => (
    <label>
      {label}
      <input
        aria-label={label}
        name={input.name}
        value={input.value}
        onChange={input.onChange}
        placeholder={placeholder}
        required={required}
      />
    </label>
  ),
}));

jest.mock("src/components/Shareable/CKEditorField", () => ({
  __esModule: true,
  default: ({ input, label }) => (
    <label>
      {label}
      <textarea
        aria-label={label}
        value={input.value}
        onChange={(evento) => input.onChange(evento.target.value)}
      />
    </label>
  ),
}));

jest.mock("../DuvidasFrequentes/components/SeletorCategorias", () => ({
  __esModule: true,
  default: ({
    buscaCategoria,
    categorias,
    onBuscaCategoriaChange,
    onCategoriaSelect,
  }) => (
    <label>
      Categoria
      <input
        aria-label="Categoria"
        value={buscaCategoria}
        onChange={(evento) => onBuscaCategoriaChange(evento.target.value)}
      />
      {categorias.map((categoria) => (
        <button
          key={categoria.uuid}
          type="button"
          onClick={() =>
            onCategoriaSelect(categoria.nome, {
              label: categoria.nome,
              uuid: categoria.uuid,
              value: categoria.nome,
            })
          }
        >
          Selecionar {categoria.nome}
        </button>
      ))}
    </label>
  ),
}));

jest.mock("../DuvidasFrequentes/components/CamposAcesso", () => ({
  __esModule: true,
  default: ({
    categoriaSelecionada,
    onPerfisChange,
    opcoesPerfisAcesso,
    perfisAcesso,
  }) => (
    <fieldset disabled={!categoriaSelecionada}>
      <legend>Perfis de Acesso</legend>
      {opcoesPerfisAcesso.map((perfil) => (
        <label key={perfil.value}>
          <input
            type="checkbox"
            checked={perfisAcesso.includes(perfil.value)}
            onChange={() => {
              const perfisAtualizados = perfisAcesso.includes(perfil.value)
                ? perfisAcesso.filter((uuid) => uuid !== perfil.value)
                : [...perfisAcesso, perfil.value];

              onPerfisChange(perfisAtualizados);
            }}
          />
          {perfil.label}
        </label>
      ))}
    </fieldset>
  ),
}));

jest.mock("src/components/Shareable/ModalPadraoSimNao", () => ({
  ModalPadraoSimNao: ({
    closeModal,
    descricaoModal,
    funcaoSim,
    showModal,
    tituloModal,
  }) =>
    showModal ? (
      <div role="dialog" aria-label={tituloModal}>
        {descricaoModal}
        <button type="button" onClick={closeModal}>
          Não
        </button>
        <button type="button" onClick={funcaoSim}>
          Sim
        </button>
      </div>
    ) : null,
}));

const UUID_CATEGORIA = "389e0274-9adf-45c6-bdb0-c249bfb08bfa";
const UUID_PERFIL_ESCOLA = "d3de8a14-ac78-4ed4-a4bc-97b9266a8461";
const UUID_PERFIL_CODAE = "930bda7c-c025-417d-8810-e35e288e5e4f";

const opcoesCadastro = {
  categorias: [{ uuid: UUID_CATEGORIA, nome: "Gestão de Alimentação" }],
  carregandoCategorias: false,
  opcoesPerfisAcesso: [
    { value: UUID_PERFIL_ESCOLA, label: "Escola" },
    { value: UUID_PERFIL_CODAE, label: "CODAE" },
  ],
  carregandoPerfis: false,
};

const preencherFormulario = async ({ selecionarTodosPerfis = false } = {}) => {
  const usuario = userEvent.setup();

  await usuario.click(
    screen.getByRole("button", { name: "Selecionar Gestão de Alimentação" }),
  );
  await usuario.click(screen.getByLabelText("Escola"));

  if (selecionarTodosPerfis) {
    await usuario.click(screen.getByLabelText("CODAE"));
  }

  await usuario.type(screen.getByLabelText("Título"), "  Como solicitar?  ");
  await usuario.type(
    screen.getByLabelText("Descrição Detalhada"),
    "  Consulte o manual.  ",
  );

  return usuario;
};

describe("Cadastro de dúvidas frequentes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useOpcoesCadastroDuvida.mockReturnValue(opcoesCadastro);
  });

  it("não envia um formulário inválido mesmo com a submissão direta", () => {
    render(<CadastroDuvidasFrequentes />);

    const formulario = screen.getByLabelText("Título").closest("form");
    fireEvent.submit(formulario);

    expect(criarPerguntaFrequente).not.toHaveBeenCalled();
  });

  it("impede uma nova submissão enquanto o cadastro está em andamento", async () => {
    criarPerguntaFrequente.mockReturnValue(new Promise(() => {}));

    render(<CadastroDuvidasFrequentes />);
    await preencherFormulario();

    const formulario = screen.getByLabelText("Título").closest("form");
    fireEvent.submit(formulario);
    fireEvent.submit(formulario);

    expect(criarPerguntaFrequente).toHaveBeenCalledTimes(1);
  });

  it("cadastra a dúvida para os perfis selecionados e limpa o formulário", async () => {
    criarPerguntaFrequente.mockResolvedValue({ status: 201 });
    const usuario = userEvent.setup();

    render(<CadastroDuvidasFrequentes />);
    await preencherFormulario();
    await usuario.click(
      screen.getByRole("button", { name: "Cadastrar Dúvida" }),
    );

    await waitFor(() => {
      expect(criarPerguntaFrequente).toHaveBeenCalledWith({
        categoria: UUID_CATEGORIA,
        perfis: [UUID_PERFIL_ESCOLA],
        todos_os_perfis: false,
        pergunta: "Como solicitar?",
        resposta: "Consulte o manual.",
      });
    });

    expect(toastSuccess).toHaveBeenCalledWith(
      "Dúvida frequente cadastrada com sucesso!",
    );
    expect(screen.getByLabelText("Título")).toHaveValue("");
    expect(screen.getByLabelText("Descrição Detalhada")).toHaveValue("");
  });

  it("envia a lista de perfis vazia quando todos estão selecionados", async () => {
    criarPerguntaFrequente.mockResolvedValue({ status: 201 });
    const usuario = userEvent.setup();

    render(<CadastroDuvidasFrequentes />);
    await preencherFormulario({ selecionarTodosPerfis: true });
    await usuario.click(
      screen.getByRole("button", { name: "Cadastrar Dúvida" }),
    );

    await waitFor(() => {
      expect(criarPerguntaFrequente).toHaveBeenCalledWith(
        expect.objectContaining({
          perfis: [],
          todos_os_perfis: true,
        }),
      );
    });
  });

  it("exibe o erro retornado pela API e preserva os dados preenchidos", async () => {
    const dadosErro = { pergunta: ["Já existe uma dúvida com esse título."] };
    getError.mockReturnValue("Já existe uma dúvida com esse título.");
    criarPerguntaFrequente.mockRejectedValue({ response: { data: dadosErro } });
    const usuario = userEvent.setup();

    render(<CadastroDuvidasFrequentes />);
    await preencherFormulario();
    await usuario.click(
      screen.getByRole("button", { name: "Cadastrar Dúvida" }),
    );

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith(
        "Já existe uma dúvida com esse título.",
      );
    });

    expect(getError).toHaveBeenCalledWith(dadosErro);
    expect(screen.getByLabelText("Título")).toHaveValue("  Como solicitar?  ");
  });

  it("exibe uma mensagem padrão quando o erro não possui resposta da API", async () => {
    criarPerguntaFrequente.mockRejectedValue(new Error("Falha de rede"));
    const usuario = userEvent.setup();

    render(<CadastroDuvidasFrequentes />);
    await preencherFormulario();
    await usuario.click(
      screen.getByRole("button", { name: "Cadastrar Dúvida" }),
    );

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith(
        "Não foi possível cadastrar a dúvida frequente.",
      );
    });
  });

  it("confirma o cancelamento de um formulário preenchido", async () => {
    const usuario = userEvent.setup();

    render(<CadastroDuvidasFrequentes />);
    await preencherFormulario();
    await usuario.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(
      screen.getByRole("dialog", { name: "Cancelar Cadastro" }),
    ).toBeInTheDocument();

    await usuario.click(screen.getByRole("button", { name: "Sim" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Título")).toHaveValue("");
    expect(criarPerguntaFrequente).not.toHaveBeenCalled();
  });

  it("não exibe confirmação ao cancelar um formulário vazio", async () => {
    const usuario = userEvent.setup();

    render(<CadastroDuvidasFrequentes />);
    await usuario.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Categoria")).toHaveValue("");
    expect(screen.getByLabelText("Título")).toHaveValue("");
    expect(criarPerguntaFrequente).not.toHaveBeenCalled();
  });

  it("fecha a confirmação de cancelamento e preserva o formulário", async () => {
    const usuario = userEvent.setup();

    render(<CadastroDuvidasFrequentes />);
    await preencherFormulario();
    await usuario.click(screen.getByRole("button", { name: "Cancelar" }));
    await usuario.click(screen.getByRole("button", { name: "Não" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Categoria")).toHaveValue(
      "Gestão de Alimentação",
    );
    expect(screen.getByLabelText("Escola")).toBeChecked();
    expect(screen.getByLabelText("Título")).toHaveValue("  Como solicitar?  ");
  });

  it("limpa os perfis ao alterar a busca da categoria", async () => {
    render(<CadastroDuvidasFrequentes />);
    await preencherFormulario();

    fireEvent.change(screen.getByLabelText("Categoria"), {
      target: { value: "Outra categoria" },
    });

    expect(screen.getByLabelText("Escola")).not.toBeChecked();
    expect(
      screen.getByRole("group", { name: "Perfis de Acesso" }),
    ).toBeDisabled();
  });
});
