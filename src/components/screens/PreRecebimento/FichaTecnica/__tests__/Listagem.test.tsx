import "@testing-library/jest-dom";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Listagem from "../components/Listagem";
import { mockListaFichaTecnica } from "src/mocks/services/fichaTecnica.service/mockListarFichasTecnicas";
import {
  CRIAR_COPIA_FICHA_TECNICA,
  PRE_RECEBIMENTO,
} from "src/configs/constants";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const fichaAprovada = mockListaFichaTecnica.results.find(
  (ficha) => ficha.status === "Aprovada",
);

const setup = () => {
  render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Listagem
        objetos={mockListaFichaTecnica.results}
        setCarregando={jest.fn()}
      />
    </MemoryRouter>,
  );
};

describe("Listagem de Fichas Técnicas - Criar Cópia", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("exibe o ícone Criar Cópia somente para fichas aprovadas", () => {
    setup();

    expect(screen.getAllByTestId("btnCriarCopia")).toHaveLength(1);

    const linhaAprovada = screen.getByText("FT036").closest(".grid-table");
    expect(
      within(linhaAprovada as HTMLElement).getByTitle("Criar Cópia"),
    ).toBeInTheDocument();
  });

  it("abre a modal de confirmação ao clicar no ícone", () => {
    setup();

    fireEvent.click(screen.getByTestId("btnCriarCopia"));

    expect(screen.getByText("Copiar Ficha Técnica")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Você realmente deseja criar uma Cópia da Ficha Técnica?",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Não")).toBeInTheDocument();
    expect(screen.getByText("Sim, Criar Cópia")).toBeInTheDocument();
  });

  it("não cria a cópia ao clicar em Não", () => {
    setup();

    fireEvent.click(screen.getByTestId("btnCriarCopia"));
    fireEvent.click(screen.getByText("Não").closest("button") as HTMLElement);

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("navega para a tela de cópia ao confirmar", () => {
    setup();

    fireEvent.click(screen.getByTestId("btnCriarCopia"));
    fireEvent.click(
      screen.getByText("Sim, Criar Cópia").closest("button") as HTMLElement,
    );

    expect(mockNavigate).toHaveBeenCalledWith(
      `/${PRE_RECEBIMENTO}/${CRIAR_COPIA_FICHA_TECNICA}?uuid=${fichaAprovada?.uuid}`,
    );
  });

  it("abre a modal de confirmação por teclado", () => {
    setup();

    fireEvent.keyDown(screen.getByTestId("btnCriarCopia"), {
      key: "Enter",
      code: "Enter",
    });

    expect(screen.getByText("Copiar Ficha Técnica")).toBeInTheDocument();
  });
});
