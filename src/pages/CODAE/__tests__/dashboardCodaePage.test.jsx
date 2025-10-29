// tests/pages/CODAE/DashboardCODAEPage.test.jsx
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DashboardCODAEPage from "src/pages/CODAE/DashboardCODAEPage";

const HOME = "/";

jest.mock("src/components/Shareable/Breadcrumb", () => ({
  __esModule: true,
  default: ({ home }) => (
    <div data-testid="breadcrumb">Breadcrumb - {home}</div>
  ),
}));

jest.mock("src/components/Shareable/Page/Page", () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="page">{children}</div>,
}));

jest.mock("src/components/screens/DashboardCODAE/Container", () => ({
  __esModule: true,
  Container: () => (
    <div data-testid="dashboard-container">Container de Alimentação</div>
  ),
}));

jest.mock("src/pages/CODAE/constants", () => ({ HOME }));

// Função auxiliar para evitar duplicação
const setup = () => {
  render(
    <MemoryRouter>
      <DashboardCODAEPage />
    </MemoryRouter>,
  );
};

describe("DashboardCODAEPage", () => {
  it("renderiza todos os componentes principais e passa props corretamente", () => {
    setup();

    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();
    expect(screen.getByText(`Breadcrumb - ${HOME}`)).toBeInTheDocument();
    expect(screen.getByTestId("page")).toBeInTheDocument();
    expect(screen.getByTestId("dashboard-container")).toBeInTheDocument();
    expect(screen.getByText("Container de Alimentação")).toBeInTheDocument();
  });
});
