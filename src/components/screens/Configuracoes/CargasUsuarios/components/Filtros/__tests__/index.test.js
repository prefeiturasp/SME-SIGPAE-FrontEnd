import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import Filtros from "../index";
import {
  baixarExcelModeloServidor,
  baixarExcelModeloNaoServidor,
  baixarExcelModeloUEParceira,
} from "src/services/cargaUsuario.service";

jest.mock("src/services/cargaUsuario.service", () => ({
  baixarExcelModeloServidor: jest.fn(),
  baixarExcelModeloNaoServidor: jest.fn(),
  baixarExcelModeloUEParceira: jest.fn(),
}));

const mockSetFiltros = jest.fn();
const mockSetPlanilhas = jest.fn();
const mockSetShowCadastro = jest.fn();

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const store = mockStore({});

const ReduxProvider = ({ children, store }) => (
  <Provider store={store}>{children}</Provider>
);

describe("Componente Filtros", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithRedux = (component, options = {}) => {
    return render(component, {
      wrapper: ({ children }) => (
        <ReduxProvider store={store}>{children}</ReduxProvider>
      ),
      ...options,
    });
  };

  it("deve renderizar corretamente com servidores", () => {
    renderWithRedux(
      <Filtros
        setFiltros={mockSetFiltros}
        setPlanilhas={mockSetPlanilhas}
        setShowCadastro={mockSetShowCadastro}
        servidores={true}
      />
    );

    expect(screen.getByText("Modelo Planilha Servidores")).toBeInTheDocument();
    expect(
      screen.getByText("Modelo Planilha UEs Parceiras")
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Modelo Planilha Não Servidores")
    ).not.toBeInTheDocument();
  });

  it("deve renderizar corretamente sem servidores", () => {
    renderWithRedux(
      <Filtros
        setFiltros={mockSetFiltros}
        setPlanilhas={mockSetPlanilhas}
        setShowCadastro={mockSetShowCadastro}
        servidores={false}
      />
    );

    expect(screen.getByText("Modelo Planilha Servidores")).toBeInTheDocument();
    expect(
      screen.getByText("Modelo Planilha Não Servidores")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Modelo Planilha UEs Parceiras")
    ).toBeInTheDocument();
  });

  it("deve chamar as funções corretas ao clicar nos botões de download", () => {
    renderWithRedux(
      <Filtros
        setFiltros={mockSetFiltros}
        setPlanilhas={mockSetPlanilhas}
        setShowCadastro={mockSetShowCadastro}
        servidores={false}
      />
    );

    fireEvent.click(screen.getByText("Modelo Planilha Servidores"));
    expect(baixarExcelModeloServidor).toHaveBeenCalled();

    fireEvent.click(screen.getByText("Modelo Planilha Não Servidores"));
    expect(baixarExcelModeloNaoServidor).toHaveBeenCalled();

    fireEvent.click(screen.getByText("Modelo Planilha UEs Parceiras"));
    expect(baixarExcelModeloUEParceira).toHaveBeenCalled();
  });

  it("deve chamar setShowCadastro ao clicar no botão de Inserir Carga", () => {
    renderWithRedux(
      <Filtros
        setFiltros={mockSetFiltros}
        setPlanilhas={mockSetPlanilhas}
        setShowCadastro={mockSetShowCadastro}
        servidores={false}
      />
    );

    fireEvent.click(screen.getByText("Inserir Carga de Usuários"));
    expect(mockSetShowCadastro).toHaveBeenCalledWith(true);
  });

  it("deve validar corretamente o intervalo entre datas", () => {
    renderWithRedux(
      <Filtros
        setFiltros={mockSetFiltros}
        setPlanilhas={mockSetPlanilhas}
        setShowCadastro={mockSetShowCadastro}
        servidores={false}
      />
    );

    const dataInicialInput = screen.getByPlaceholderText("De");
    fireEvent.change(dataInicialInput, { target: { value: "01/01/2023" } });
    fireEvent.blur(dataInicialInput);

    const dataFinalInput = screen.getByPlaceholderText("Até");
    fireEvent.change(dataFinalInput, { target: { value: "31/12/2022" } });
    fireEvent.blur(dataFinalInput);

    expect(dataFinalInput.value).not.toBe("31/12/2022");
  });
});
