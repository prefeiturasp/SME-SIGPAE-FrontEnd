import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useOpcoesCadastroDuvida } from "src/components/screens/Faq/DuvidasFrequentes/hooks/useOpcoesCadastroDuvida";
import Filtros from "..";

jest.mock(
  "src/components/screens/Faq/DuvidasFrequentes/hooks/useOpcoesCadastroDuvida",
  () => ({
    useOpcoesCadastroDuvida: jest.fn(),
  }),
);

jest.mock("src/components/Shareable/Input/InputText", () => ({
  InputText: ({ input, label, placeholder }: any) => (
    <label>
      {label}
      <input {...input} placeholder={placeholder} />
    </label>
  ),
}));

jest.mock("src/components/Shareable/SelectSelecione", () => ({
  __esModule: true,
  default: ({ input, label, options, placeholder }: any) => (
    <label>
      {label}
      <select {...input} aria-label={label}>
        <option value="">{placeholder}</option>
        {options.map((opcao: any) => (
          <option key={opcao.uuid} value={opcao.uuid}>
            {opcao.nome}
          </option>
        ))}
      </select>
    </label>
  ),
}));

jest.mock("src/components/Shareable/FinalForm/MultiSelect", () => ({
  __esModule: true,
  default: ({ input, label, options, placeholder }: any) => (
    <div>
      <span>{label}</span>
      <span>{placeholder}</span>
      <button type="button" onClick={() => input.onChange([options[0].value])}>
        Selecionar um perfil
      </button>
      <button
        type="button"
        onClick={() => input.onChange(options.map((opcao: any) => opcao.value))}
      >
        Selecionar todos os perfis
      </button>
    </div>
  ),
}));

const UUID_CATEGORIA = "96da837c-009f-41f2-ae46-d4a7fa52aa30";
const UUID_PERFIL = "996c50ce-ea3c-450f-8af0-f19940de223e";
const UUID_SEGUNDO_PERFIL = "5fa61f05-e894-44f3-a98b-18cc8e718386";

const retornoOpcoes = {
  categorias: [
    {
      nome: "Gestão de Alimentação",
      uuid: UUID_CATEGORIA,
    },
  ],
  carregandoCategorias: false,
  opcoesPerfisAcesso: [
    {
      label: "QUALIDADE",
      value: UUID_PERFIL,
    },
    {
      label: "ORGAO_FISCALIZADOR",
      value: UUID_SEGUNDO_PERFIL,
    },
  ],
  carregandoPerfis: false,
};

describe("Filtros de dúvidas frequentes", () => {
  const aoFiltrar = jest.fn();
  const aoLimpar = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useOpcoesCadastroDuvida as jest.Mock).mockReturnValue(retornoOpcoes);
  });

  const renderizarFiltros = () =>
    render(<Filtros aoFiltrar={aoFiltrar} aoLimpar={aoLimpar} />);

  it("exibe os campos e ações da seção de filtros", () => {
    renderizarFiltros();

    expect(screen.getByText("Filtrar Cadastros")).toBeInTheDocument();
    expect(screen.getByText("Filtrar por Título")).toBeInTheDocument();
    expect(screen.getByText("Filtrar por Categoria")).toBeInTheDocument();
    expect(
      screen.getByText("Filtrar por Perfis de Acesso"),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Digite o Título")).toBeInTheDocument();
    expect(screen.getByText("Selecione a Categoria")).toBeInTheDocument();
    expect(
      screen.getByText("Selecione os perfis de acesso"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Filtrar" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Limpar Filtros" }),
    ).toBeInTheDocument();
  });

  it("envia os filtros preenchidos com um perfil selecionado", async () => {
    renderizarFiltros();

    fireEvent.change(screen.getByPlaceholderText("Digite o Título"), {
      target: { value: "Dieta" },
    });
    fireEvent.change(
      screen.getByRole("combobox", { name: "Filtrar por Categoria" }),
      { target: { value: UUID_CATEGORIA } },
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Selecionar um perfil" }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Filtrar" }));

    await waitFor(() => {
      expect(aoFiltrar).toHaveBeenCalledWith({
        categoria: UUID_CATEGORIA,
        perfil: [UUID_PERFIL],
        titulo: "Dieta",
      });
    });
  });

  it("converte a seleção de todos os perfis para o valor todos", async () => {
    renderizarFiltros();

    fireEvent.click(
      screen.getByRole("button", { name: "Selecionar todos os perfis" }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Filtrar" }));

    await waitFor(() => {
      expect(aoFiltrar).toHaveBeenCalledWith({ perfil: "todos" });
    });
  });

  it("permite filtrar sem preencher nenhum campo", async () => {
    renderizarFiltros();

    fireEvent.click(screen.getByRole("button", { name: "Filtrar" }));

    await waitFor(() => {
      expect(aoFiltrar).toHaveBeenCalledWith({ perfil: undefined });
    });
  });

  it("limpa os campos preenchidos e chama a ação de limpeza", async () => {
    renderizarFiltros();

    const campoTitulo = screen.getByPlaceholderText("Digite o Título");
    fireEvent.change(campoTitulo, { target: { value: "Dieta" } });
    fireEvent.click(screen.getByRole("button", { name: "Limpar Filtros" }));

    await waitFor(() => {
      expect(campoTitulo).toHaveValue("");
      expect(aoLimpar).toHaveBeenCalledTimes(1);
    });
  });

  it("desabilita as ações enquanto as opções estão carregando", () => {
    (useOpcoesCadastroDuvida as jest.Mock).mockReturnValue({
      ...retornoOpcoes,
      carregandoPerfis: true,
    });

    renderizarFiltros();

    expect(screen.getByRole("button", { name: "Filtrar" })).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Limpar Filtros" }),
    ).toBeDisabled();
  });
});
