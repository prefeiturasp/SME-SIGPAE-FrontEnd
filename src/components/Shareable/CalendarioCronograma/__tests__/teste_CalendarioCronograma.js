import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CalendarioCronograma } from "../index.tsx";
// import { momentLocalizer } from "react-big-calendar";
import { mockEtapasCalendario } from "mocks/Shareable/CalendarioCronograma/mockEtapasCalendario";
// import moment from "moment";

jest.mock("react-big-calendar", () => ({
  ...jest.requireActual("react-big-calendar"),
  Calendar: jest.fn(() => <div>Mocked Calendar</div>),
}));

// const localizer = momentLocalizer(moment);

describe("Teste para o componente <CalendarioCronograma>", () => {
  let getObjetosMock;

  beforeEach(() => {
    getObjetosMock = jest.fn().mockResolvedValue({
      status: 200,
      data: { results: mockEtapasCalendario },
    });

    render(
      <CalendarioCronograma
        getObjetos={getObjetosMock}
        nomeObjeto="Cronogramas"
        nomeObjetoMinusculo="cronogramas"
      />
    );
  });

  it("deve chamar getObjetos na montagem do componente", async () => {
    await waitFor(() => expect(getObjetosMock).toHaveBeenCalled());
  });

  it("deve exibir a mensagem de instrução", async () => {
    await waitFor(() =>
      expect(
        screen.getByText(
          "Para visualizar detalhes dos cronogramas, clique sobre o item no dia programado."
        )
      ).toBeInTheDocument()
    );
  });
});
