import "@testing-library/jest-dom";
import {
  act,
  screen,
  render,
  fireEvent,
  cleanup,
} from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { CustomToolbar } from "src/components/Shareable/Calendario/componentes/CustomToolbar/index.jsx";

jest.mock("src/components/Shareable/Botao", () => ({
  __esModule: true,
  default: ({ icon, onClick, style, type }) => (
    <button
      onClick={onClick}
      data-icon={icon}
      data-style={style}
      data-type={type}
    >
      {icon === "fas fa-arrow-left" ? "Anterior" : "Próximo"}
    </button>
  ),
}));

jest.mock("moment", () => {
  return () => ({
    format: (formatString) => {
      if (formatString === "MMMM") return "junho";
      if (formatString === "YYYY") return "2023";
      return "";
    },
  });
});

describe("Teste componente CustomToolbar", () => {
  const mockOnNavigate = jest.fn();
  const mockOnView = jest.fn();
  const currentDate = new Date(2023, 5, 15);

  const defaultProps = {
    date: currentDate,
    onNavigate: mockOnNavigate,
    onView: mockOnView,
    view: "month",
  };

  const renderCustomToolbar = (props = {}) => {
    return render(
      <MemoryRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <CustomToolbar {...defaultProps} {...props} />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("deve exibir as informações corretamente", async () => {
    await act(async () => {
      renderCustomToolbar();
    });

    expect(screen.getByText(/Mês/i)).toBeInTheDocument();
    expect(screen.getByText(/junho 2023/i)).toBeInTheDocument();
    expect(screen.getByText(/Anterior/i)).toBeInTheDocument();
    expect(screen.getByText(/Próximo/i)).toBeInTheDocument();
  });

  it("não deve exibir os botões de navegação quando a view não for 'month'", async () => {
    await act(async () => {
      renderCustomToolbar({ view: "week" });
    });

    expect(screen.queryByText("Anterior")).not.toBeInTheDocument();
    expect(screen.queryByText("Próximo")).not.toBeInTheDocument();
  });

  it("deve chamar onNavigate com 'prev' ao clicar no botão Anterior", async () => {
    await act(async () => {
      renderCustomToolbar();
    });

    const botaoAnterior = screen.getByText("Anterior");
    fireEvent.click(botaoAnterior);
    expect(mockOnNavigate).toHaveBeenCalledWith("prev");
  });

  it("deve chamar onNavigate com 'current' ao clicar no botão Próximo", async () => {
    await act(async () => {
      renderCustomToolbar();
    });

    const botaoProximo = screen.getByText("Próximo");
    fireEvent.click(botaoProximo);

    expect(mockOnNavigate).toHaveBeenCalledWith("current");
  });

  it("deve chamar onView com 'month' ao clicar na tab Mês", async () => {
    await act(async () => {
      renderCustomToolbar();
    });

    const tabMes = screen.getByText("Mês");
    fireEvent.click(tabMes);

    expect(mockOnView).toHaveBeenCalledWith("month");
  });

  it("deve ajustar a data para o mês atual no useEffect", async () => {
    const mockDate = new Date(2022, 10, 15);
    const mockSetMonth = jest.fn();
    const mockSetYear = jest.fn();

    mockDate.setMonth = mockSetMonth;
    mockDate.setYear = mockSetYear;

    await act(async () => {
      renderCustomToolbar({ date: mockDate });
    });
    expect(mockSetMonth).toHaveBeenCalled();
    expect(mockSetYear).toHaveBeenCalled();

    expect(mockOnNavigate).toHaveBeenCalledWith("current");
  });
});
