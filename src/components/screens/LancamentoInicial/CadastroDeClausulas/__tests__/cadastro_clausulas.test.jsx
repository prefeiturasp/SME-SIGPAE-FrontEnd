import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { ToastContainer } from "react-toastify";
import { CadastroDeClausulas } from "../index";
import { mockListaNumeros } from "src/mocks/LancamentoInicial/CadastroDeClausulas/listaDeNumeros";
import { mockClausulasDeDesconto } from "src/mocks/LancamentoInicial/CadastroDeClausulas/clausulasDeDescontos";
import userEvent from "@testing-library/user-event";
import mock from "src/services/_mock";
import { act } from "react";

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock("src/components/Shareable/TextArea/TextArea", () => ({
  __esModule: true,
  TextArea: ({ input, label, placeholder }) => (
    <div data-testid="descricao">
      <label>{label}</label>
      <textarea {...input} placeholder={placeholder} />
    </div>
  ),
}));

describe("Testes de cadastro do formulário Cadastro de Cláusulas", () => {
  const mockNavigate = jest.fn();
  const mockSearchParams = new URLSearchParams();

  beforeEach(() => {
    jest
      .spyOn(require("react-router-dom"), "useNavigate")
      .mockReturnValue(mockNavigate);
    jest
      .spyOn(require("react-router-dom"), "useSearchParams")
      .mockReturnValue([mockSearchParams]);
    mock
      .onGet("/medicao-inicial/clausulas-de-descontos/")
      .reply(200, mockClausulasDeDesconto);
    mock.onGet("/editais/lista-numeros/").reply(200, mockListaNumeros);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const setup = async () => {
    render(
      <>
        <CadastroDeClausulas />
        <ToastContainer />
      </>,
    );

    await screen.findByText("Nº do Edital");
  };

  it("deve renderizar corretamente no modo de cadastro", async () => {
    await setup();

    expect(screen.getByText("Nº do Edital")).toBeInTheDocument();
    expect(screen.getByText("Nº da Cláusula")).toBeInTheDocument();
    expect(screen.getByText("Item da Cláusula")).toBeInTheDocument();
    expect(screen.getByText("% de Desconto")).toBeInTheDocument();
    expect(screen.getByText("Descrição")).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Salvar" })).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Cancelar" }),
    ).toBeInTheDocument();
  });

  it("deve preencher os campos e cadastrar uma cláusula com sucesso", async () => {
    const user = userEvent.setup();

    mock.onPost("/medicao-inicial/clausulas-de-descontos/").reply(201, {});

    await setup();

    await act(async () => {
      user.click(
        screen
          .getByTestId("select-edital")
          .querySelector(".ant-select-selection-search-input"),
      );
    });

    await waitFor(() => screen.getByText("PARCEIRA"));
    await act(async () => {
      user.click(screen.getByText("PARCEIRA"));
    });

    await user.type(
      screen.getByTestId("edital").querySelector("input"),
      "7.1.1",
    );

    await user.type(
      screen.getByTestId("item_clausula").querySelector("input"),
      "a",
    );

    const porcentagem = screen.getAllByRole("spinbutton")[0];
    await user.clear(porcentagem);
    await user.type(porcentagem, "15");

    await user.type(
      screen.getByTestId("descricao").querySelector("textarea"),
      "Descrição de teste",
    );

    await user.click(screen.getByRole("button", { name: "Salvar" }));

    await waitFor(() => {
      expect(
        screen.getByText("Cláusula cadastrada com sucesso!"),
      ).toBeInTheDocument();

      expect(mockNavigate).toHaveBeenCalled();
    });
  });

  it("deve voltar para a listagem ao clicar em Cancelar", async () => {
    const user = userEvent.setup();

    await setup();

    await user.click(
      screen.getByRole("button", {
        name: "Cancelar",
      }),
    );

    expect(mockNavigate).toHaveBeenCalled();
  });
});
