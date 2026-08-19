import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import BotaoCadastrarDuvidasFrequentes from "../DuvidasFrequentes/components/BotaoCadastroDuvidasFrequentes";
import CamposAcesso from "../DuvidasFrequentes/components/CamposAcesso";
import SeletorCategorias from "../DuvidasFrequentes/components/SeletorCategorias";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

jest.mock("src/components/Shareable/Botao", () => ({
  __esModule: true,
  default: ({ onClick, texto }) => (
    <button type="button" onClick={onClick}>
      {texto}
    </button>
  ),
}));

jest.mock("src/components/Shareable/MultiSelect", () => ({
  MultiSelect: (props) => (
    <button
      type="button"
      data-testid="multiselect-perfis"
      data-disabled={String(props.disabled)}
      onClick={() => props.onSelectedChange([props.options[0].value])}
    >
      {props.label}
    </button>
  ),
}));

const UUID_CATEGORIA = "389e0274-9adf-45c6-bdb0-c249bfb08bfa";
const UUID_PERFIL = "d3de8a14-ac78-4ed4-a4bc-97b9266a8461";

describe("Componentes de dúvidas frequentes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("navega para a tela de cadastro ao acionar o botão", () => {
    const navegar = jest.fn();
    useNavigate.mockReturnValue(navegar);

    render(<BotaoCadastrarDuvidasFrequentes />);
    fireEvent.click(
      screen.getByRole("button", { name: "Cadastrar Dúvidas Frequentes" }),
    );

    expect(navegar).toHaveBeenCalledWith(
      "/ajuda/cadastro-duvidas-frequentes/cadastro-duvidas-frequentes",
    );
  });

  it("desabilita a seleção de perfis sem uma categoria selecionada", () => {
    render(
      <CamposAcesso
        categoriaSelecionada={false}
        carregandoPerfis={false}
        onPerfisChange={jest.fn()}
        opcoesPerfisAcesso={[{ label: "Escola", value: UUID_PERFIL }]}
        perfisAcesso={[]}
      />,
    );

    expect(screen.getByTestId("multiselect-perfis")).toHaveAttribute(
      "data-disabled",
      "true",
    );
  });

  it("propaga os perfis selecionados para o formulário", () => {
    const aoAlterarPerfis = jest.fn();

    render(
      <CamposAcesso
        categoriaSelecionada
        carregandoPerfis={false}
        onPerfisChange={aoAlterarPerfis}
        opcoesPerfisAcesso={[{ label: "Escola", value: UUID_PERFIL }]}
        perfisAcesso={[]}
      />,
    );

    fireEvent.click(screen.getByTestId("multiselect-perfis"));

    expect(aoAlterarPerfis).toHaveBeenCalledWith([UUID_PERFIL]);
  });

  it("permite buscar e selecionar uma categoria", () => {
    const aoAlterarBusca = jest.fn();
    const aoSelecionarCategoria = jest.fn();

    render(
      <SeletorCategorias
        buscaCategoria=""
        categorias={[{ nome: "Gestão de Alimentação", uuid: UUID_CATEGORIA }]}
        carregandoCategorias={false}
        onBuscaCategoriaChange={aoAlterarBusca}
        onCategoriaSelect={aoSelecionarCategoria}
      />,
    );

    const campoCategoria = screen.getByPlaceholderText(
      "Digite ou selecione a Categoria",
    );

    fireEvent.change(campoCategoria, { target: { value: "gestão" } });
    expect(aoAlterarBusca).toHaveBeenCalledWith("gestão", expect.any(Object));

    fireEvent.mouseDown(campoCategoria);
    fireEvent.click(screen.getByTitle("Gestão de Alimentação"));

    expect(aoSelecionarCategoria).toHaveBeenCalledWith(
      "Gestão de Alimentação",
      expect.objectContaining({
        label: "Gestão de Alimentação",
        uuid: UUID_CATEGORIA,
        value: "Gestão de Alimentação",
      }),
    );
  });
});
