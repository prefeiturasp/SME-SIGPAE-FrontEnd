import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import ModalCancelar from "../../components/ModalCancelar";
import {
  MEDICAO_INICIAL,
  PARAMETRIZACAO_FINANCEIRA,
} from "src/configs/constants";
import { mockGetDadosParametrizacaoFinanceira } from "src/mocks/services/parametrizacao_financeira.service/mockGetDadosParametrizacaoFinanceira";
import { mockParametrizacoesFinanceiras } from "src/mocks/services/parametrizacao_financeira.service/mockGetParametrizacoesFinanceiras";

function Rota() {
  const location = useLocation();
  return <div data-testid="rota">{location.pathname}</div>;
}

describe("Testes comportamento ModalCancelar - Parametrização Financeira", () => {
  const mockSetShowModal = jest.fn();
  const mockOnCancelar = jest.fn();
  const urlVolta = `/${MEDICAO_INICIAL}/${PARAMETRIZACAO_FINANCEIRA}/`;

  const setup = async ({
    showModal = true,
    uuidParametrizacao = null,
    busca = "",
  } = {}) => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={[`/editar${busca}`]}>
          <ModalCancelar
            showModal={showModal}
            setShowModal={mockSetShowModal}
            uuidParametrizacao={uuidParametrizacao}
            onCancelar={mockOnCancelar}
          />
          <Rota />
        </MemoryRouter>,
      );
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar título e mensagem de cadastro quando uuidParametrizacao = null", async () => {
    await setup({ uuidParametrizacao: null });

    expect(
      screen.getByText("Cancelar Parametrização Financeira"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Deseja cancelar o cadastro dessa parametrização?"),
    ).toBeInTheDocument();

    expect(screen.getByText("Não")).toBeInTheDocument();
    expect(screen.getByText("Sim")).toBeInTheDocument();
  });

  it("deve renderizar mensagem de edição quando uuidParametrizacao existe", async () => {
    await setup({
      uuidParametrizacao: mockGetDadosParametrizacaoFinanceira.uuid,
    });

    expect(
      screen.getByText("Deseja cancelar a edição dessa parametrização?"),
    ).toBeInTheDocument();
  });

  it('deve chamar setShowModal(false) ao clicar em "Não"', async () => {
    await setup();

    fireEvent.click(screen.getByText("Não"));
    expect(mockSetShowModal).toHaveBeenCalledWith(false);
  });

  it('deve navegar para a listagem ao clicar em "Sim" sem nova_uuid', async () => {
    await setup();

    fireEvent.click(screen.getByText("Sim"));

    expect(mockOnCancelar).not.toHaveBeenCalled();
    expect(screen.getByTestId("rota")).toHaveTextContent(urlVolta);
  });

  it('deve chamar onCancelar e navegar ao clicar em "Sim" com nova_uuid', async () => {
    await setup({
      busca: `?nova_uuid=${mockParametrizacoesFinanceiras.results[0].uuid}`,
    });

    fireEvent.click(screen.getByText("Sim"));

    expect(mockOnCancelar).toHaveBeenCalled();
    expect(screen.getByTestId("rota")).toHaveTextContent(urlVolta);
  });

  it("deve exibir aviso adicional quando fluxo existir", async () => {
    await setup({
      busca: "?fluxo=true",
    });

    expect(
      screen.getByText(/Ao cancelar não haverá nenhuma parametrização ativa/i),
    ).toBeInTheDocument();
  });

  it("fecha o modal pelo botão de fechar", async () => {
    await setup();

    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(mockSetShowModal).toHaveBeenCalledWith(false);
  });

  it("não deve renderizar conteúdo quando showModal = false", async () => {
    await setup({ showModal: false });

    expect(
      screen.queryByText("Cancelar Parametrização Financeira"),
    ).not.toBeInTheDocument();
  });
});
