import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import ModalCancelar from "../../components/ModalCancelar";

const mockNavigate = jest.fn();
const mockUseSearchParams = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useSearchParams: () => mockUseSearchParams(),
}));

describe("Testes comportamento ModalCancelar - Parametrização Financeira", () => {
  const mockSetShowModal = jest.fn();
  const mockOnCancelar = jest.fn();

  const setup = async ({
    showModal = true,
    uuidParametrizacao = null,
    searchParams = {},
  } = {}) => {
    mockUseSearchParams.mockReturnValue([
      {
        get: (key) => searchParams[key] ?? null,
      },
    ]);

    await act(async () => {
      render(
        <ModalCancelar
          showModal={showModal}
          setShowModal={mockSetShowModal}
          uuidParametrizacao={uuidParametrizacao}
          onCancelar={mockOnCancelar}
        />,
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
    await setup({ uuidParametrizacao: "uuid-123" });

    expect(
      screen.getByText("Deseja cancelar a edição dessa parametrização?"),
    ).toBeInTheDocument();
  });

  it('deve chamar setShowModal(false) ao clicar em "Não"', async () => {
    await setup();

    fireEvent.click(screen.getByText("Não"));
    expect(mockSetShowModal).toHaveBeenCalledWith(false);
  });

  it('deve chamar apenas navigate(-1) ao clicar em "Sim" sem nova_uuid', async () => {
    await setup({
      searchParams: {},
    });

    fireEvent.click(screen.getByText("Sim"));

    expect(mockOnCancelar).not.toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('deve chamar onCancelar e navigate(-1) ao clicar em "Sim" com nova_uuid', async () => {
    await setup({
      searchParams: { nova_uuid: "uuid-conflito" },
    });

    fireEvent.click(screen.getByText("Sim"));

    expect(mockOnCancelar).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it("deve exibir aviso adicional quando fluxo existir", async () => {
    await setup({
      searchParams: { fluxo: "true" },
    });

    expect(
      screen.getByText(/Ao cancelar não haverá nenhuma parametrização ativa/i),
    ).toBeInTheDocument();
  });

  it("não deve renderizar conteúdo quando showModal = false", async () => {
    await setup({ showModal: false });

    expect(
      screen.queryByText("Cancelar Parametrização Financeira"),
    ).not.toBeInTheDocument();
  });
});
