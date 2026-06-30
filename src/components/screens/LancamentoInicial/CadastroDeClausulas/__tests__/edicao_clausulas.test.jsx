import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { ToastContainer } from "react-toastify";
import { CadastroDeClausulas } from "../index";
import { mockClausulaParaDesconto } from "src/mocks/LancamentoInicial/CadastroDeClausulas/clausulasParaDescontos";
import { mockListaNumeros } from "src/mocks/LancamentoInicial/CadastroDeClausulas/listaDeNumeros";
import { mockClausulasDeDesconto } from "src/mocks/LancamentoInicial/CadastroDeClausulas/clausulasDeDescontos";
import userEvent from "@testing-library/user-event";
import mock from "src/services/_mock";

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

describe("Testes de edição do formulário Cadastro de Cláusulas", () => {
  const mockNavigate = jest.fn();
  let mockSearchParams;

  beforeEach(() => {
    mockSearchParams = new URLSearchParams({
      uuid: mockClausulaParaDesconto.uuid,
    });

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
    mock
      .onGet(
        `/medicao-inicial/clausulas-de-descontos/${mockClausulaParaDesconto.uuid}/`,
      )
      .reply(200, mockClausulaParaDesconto);
    mock
      .onPatch(
        `/medicao-inicial/clausulas-de-descontos/${mockClausulaParaDesconto.uuid}/`,
      )
      .reply(200, {});
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

  it("deve carregar os dados no modo edição", async () => {
    await setup();

    await waitFor(() => {
      expect(screen.getByDisplayValue("2.5")).toBeInTheDocument();
    });

    expect(screen.getByDisplayValue("A")).toBeInTheDocument();
    expect(screen.getByDisplayValue("22")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("RSHH RHRHKTYLUL EHSGSRGS"),
    ).toBeInTheDocument();
  });

  it("deve editar uma cláusula com sucesso", async () => {
    const user = userEvent.setup();

    await setup();

    await waitFor(() => {
      expect(screen.getByDisplayValue("2.5")).toBeInTheDocument();
    });

    await user.clear(screen.getByDisplayValue("2.5"));
    await user.type(screen.getByTestId("edital").querySelector("input"), "3.1");

    await user.clear(screen.getByDisplayValue("A"));
    await user.type(
      screen.getByTestId("item_clausula").querySelector("input"),
      "B",
    );

    const porcentagem = screen.getAllByRole("spinbutton")[0];
    await user.clear(porcentagem);
    await user.type(porcentagem, "30");

    const descricao = screen.getByTestId("descricao").querySelector("textarea");

    await user.clear(descricao);
    await user.type(descricao, "Descrição editada");

    await user.click(screen.getByRole("button", { name: "Salvar" }));

    await waitFor(() => {
      expect(
        screen.getByText("Cláusula atualizada com sucesso!"),
      ).toBeInTheDocument();

      expect(mockNavigate).toHaveBeenCalled();
    });
  });
});
