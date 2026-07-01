import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { Field } from "react-final-form";

import { Header } from "../Header";

jest.mock("react-final-form", () => ({
  Field: jest.fn(),
}));

jest.mock("src/components/Shareable/Input/InputText", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const fieldMock = Field as unknown as jest.Mock;

describe("Header", () => {
  const getEditaisContratosAsync = jest.fn();
  const setLoading = jest.fn();
  const setPage = jest.fn();

  const renderHeader = (page = 1) =>
    render(
      <Header
        getEditaisContratosAsync={getEditaisContratosAsync}
        setLoading={setLoading}
        page={page}
        setPage={setPage}
      />,
    );

  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();

    getEditaisContratosAsync.mockResolvedValue(undefined);

    fieldMock.mockImplementation(
      ({ name, placeholder, inputOnChange, className, icone }) => (
        <input
          name={name}
          placeholder={placeholder}
          className={className}
          data-icone={icone}
          onChange={inputOnChange}
        />
      ),
    );
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it("renderiza os títulos e o campo de pesquisa", () => {
    renderHeader();
    expect(screen.getByText("Tipos de contratação")).toBeInTheDocument();
    expect(screen.getByText("Nº do edital")).toBeInTheDocument();
    expect(
      screen.getByText("Nº do processo administrativo"),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Pesquisar")).toBeInTheDocument();
  });

  it("busca editais e contratos após um segundo", async () => {
    renderHeader(3);
    fireEvent.change(screen.getByPlaceholderText("Pesquisar"), {
      target: {
        value: "edital teste",
      },
    });
    expect(getEditaisContratosAsync).not.toHaveBeenCalled();
    await act(async () => {
      jest.advanceTimersByTime(1000);
      await Promise.resolve();
    });
    expect(setLoading).toHaveBeenNthCalledWith(1, true);
    expect(getEditaisContratosAsync).toHaveBeenCalledWith({
      busca: "edital teste",
      page: 3,
    });
    expect(setLoading).toHaveBeenNthCalledWith(2, false);
    expect(setPage).toHaveBeenCalledWith(1);
  });
});
