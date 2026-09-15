import "@testing-library/jest-dom";

import { fireEvent, render, screen } from "@testing-library/react";

import FormularioDuvidaFrequente from "../index";

jest.mock("src/components/Shareable/Botao", () => ({
  __esModule: true,
  default: ({ disabled, onClick, texto, type }: any) => (
    <button disabled={disabled} onClick={onClick} type={type}>
      {texto}
    </button>
  ),
}));

jest.mock("src/components/Shareable/Input/InputText", () => ({
  __esModule: true,
  default: ({ input, label, placeholder }: any) => (
    <input
      aria-label={label}
      onBlur={input.onBlur}
      onChange={input.onChange}
      placeholder={placeholder}
      value={input.value}
    />
  ),
}));

jest.mock("src/components/Shareable/CKEditorField", () => ({
  __esModule: true,
  default: ({ input, label, placeholder }: any) => (
    <textarea
      aria-label={label}
      onChange={(evento) => input.onChange(evento.target.value)}
      placeholder={placeholder}
      value={input.value}
    />
  ),
}));

jest.mock(
  "src/components/screens/Faq/DuvidasFrequentes/components/SeletorCategorias",
  () => ({
    __esModule: true,
    default: ({
      buscaCategoria,
      carregandoCategorias,
      onBuscaCategoriaChange,
      onCategoriaSelect,
    }: any) => (
      <div
        data-busca={buscaCategoria}
        data-carregando={String(carregandoCategorias)}
        data-testid="seletor-categorias"
      >
        <button
          onClick={() => onBuscaCategoriaChange("Dieta Especial")}
          type="button"
        >
          Alterar busca da categoria
        </button>
        <button
          onClick={() =>
            onCategoriaSelect("Dieta Especial", {
              label: "Dieta Especial",
              uuid: "22c97f47-d49c-4c9e-9d0f-f5969430e833",
              value: "Dieta Especial",
            })
          }
          type="button"
        >
          Selecionar categoria
        </button>
      </div>
    ),
  }),
);

jest.mock(
  "src/components/screens/Faq/DuvidasFrequentes/components/CamposAcesso",
  () => ({
    __esModule: true,
    default: ({
      carregandoPerfis,
      categoriaSelecionada,
      onPerfisChange,
      perfisAcesso,
    }: any) => (
      <div
        data-carregando={String(carregandoPerfis)}
        data-categoria-selecionada={String(categoriaSelecionada)}
        data-perfis={perfisAcesso.join(";")}
        data-testid="campos-acesso"
      >
        <button
          onClick={() =>
            onPerfisChange(["62b9d5b6-c613-4bc2-83b5-c684da3dc382"])
          }
          type="button"
        >
          Alterar perfis
        </button>
      </div>
    ),
  }),
);

const UUID_CATEGORIA = "22c97f47-d49c-4c9e-9d0f-f5969430e833";
const UUID_PERFIL = "62b9d5b6-c613-4bc2-83b5-c684da3dc382";

const criarPropriedades = () => ({
  categorias: [{ nome: "Gestão de Alimentação", uuid: UUID_CATEGORIA }],
  carregandoCategorias: false,
  carregandoPerfis: false,
  desabilitarSalvar: false,
  onAlterarBuscaCategoria: jest.fn(),
  onAlterarDescricao: jest.fn(),
  onAlterarPerfis: jest.fn(),
  onAlterarTitulo: jest.fn(),
  onCancelar: jest.fn(),
  onSalvar: jest.fn(),
  onSelecionarCategoria: jest.fn(),
  opcoesPerfisAcesso: [{ label: "QUALIDADE", value: UUID_PERFIL }],
  textoBotaoSalvar: "Salvar Alterações",
  valores: {
    buscaCategoria: "Gestão de Alimentação",
    categoria: {
      nome: "Gestão de Alimentação",
      uuid: UUID_CATEGORIA,
    },
    descricaoDetalhada: "Descrição da dúvida",
    perfisAcesso: [UUID_PERFIL],
    titulo: "Título da dúvida",
  },
});

describe("FormularioDuvidaFrequente", () => {
  it("exibe os valores e propaga as alterações do formulário", () => {
    const propriedades = criarPropriedades();
    render(<FormularioDuvidaFrequente {...propriedades} />);

    expect(screen.getByLabelText("Título")).toHaveValue("Título da dúvida");
    expect(screen.getByLabelText("Descrição Detalhada")).toHaveValue(
      "Descrição da dúvida",
    );
    expect(screen.getByTestId("seletor-categorias")).toHaveAttribute(
      "data-busca",
      "Gestão de Alimentação",
    );
    expect(screen.getByTestId("campos-acesso")).toHaveAttribute(
      "data-categoria-selecionada",
      "true",
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Alterar busca da categoria" }),
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Selecionar categoria" }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Alterar perfis" }));
    fireEvent.change(screen.getByLabelText("Título"), {
      target: { value: "Título alterado" },
    });
    fireEvent.blur(screen.getByLabelText("Título"));
    fireEvent.change(screen.getByLabelText("Descrição Detalhada"), {
      target: { value: "Descrição alterada" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    fireEvent.submit(
      screen
        .getByRole("button", { name: "Salvar Alterações" })
        .closest("form") as HTMLFormElement,
    );

    expect(propriedades.onAlterarBuscaCategoria).toHaveBeenCalledWith(
      "Dieta Especial",
    );
    expect(propriedades.onSelecionarCategoria).toHaveBeenCalledWith(
      "Dieta Especial",
      {
        label: "Dieta Especial",
        uuid: UUID_CATEGORIA,
        value: "Dieta Especial",
      },
    );
    expect(propriedades.onAlterarPerfis).toHaveBeenCalledWith([UUID_PERFIL]);
    expect(propriedades.onAlterarTitulo).toHaveBeenCalledWith(
      "Título alterado",
    );
    expect(propriedades.onAlterarDescricao).toHaveBeenCalledWith(
      "Descrição alterada",
    );
    expect(propriedades.onCancelar).toHaveBeenCalledTimes(1);
    expect(propriedades.onSalvar).toHaveBeenCalledTimes(1);
  });

  it("desabilita o salvamento e os perfis quando não há categoria", () => {
    const propriedades = criarPropriedades();
    const propriedadesSemCategoria = {
      ...propriedades,
      carregandoCategorias: true,
      carregandoPerfis: true,
      desabilitarSalvar: true,
      valores: {
        ...propriedades.valores,
        categoria: null,
      },
    };

    render(<FormularioDuvidaFrequente {...propriedadesSemCategoria} />);

    expect(screen.getByTestId("seletor-categorias")).toHaveAttribute(
      "data-carregando",
      "true",
    );
    expect(screen.getByTestId("campos-acesso")).toHaveAttribute(
      "data-carregando",
      "true",
    );
    expect(screen.getByTestId("campos-acesso")).toHaveAttribute(
      "data-categoria-selecionada",
      "false",
    );
    expect(
      screen.getByRole("button", { name: "Salvar Alterações" }),
    ).toBeDisabled();
  });
});
