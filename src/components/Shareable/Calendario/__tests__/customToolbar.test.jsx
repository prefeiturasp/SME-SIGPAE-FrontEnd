import "@testing-library/jest-dom";
import { act, render, cleanup } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { CustomToolbar } from "src/components/Shareable/Calendario/componentes/CustomToolbar/index.jsx";
import preview from "jest-preview";

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

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useEffect: (effect) => effect(),
}));

describe("Teste componente CustomToolbar", () => {
  const mockOnNavigate = jest.fn();
  const mockOnView = jest.fn();
  const currentDate = new Date(2023, 5, 15); // 15 de junho de 2023

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

  it("", async () => {
    await act(async () => {
      renderCustomToolbar();
    });
    preview.debug();
  });
});
