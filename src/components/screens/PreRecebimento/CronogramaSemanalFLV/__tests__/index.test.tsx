import "@testing-library/jest-dom";
import { render, screen, act, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CronogramaSemanalFLV from "src/components/screens/PreRecebimento/CronogramaSemanalFLV";

const setup = async () => {
  await act(async () => {
    render(
      <MemoryRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <CronogramaSemanalFLV />
      </MemoryRouter>,
    );
  });
};

describe("CronogramaSemanalFLV - Component", () => {
  it("renderiza card de cronograma", async () => {
    await setup();
    await waitFor(() => {
      const card = document.querySelector(".card-cronograma-semanal-flv");
      expect(card).toBeInTheDocument();
    });
  });

  it("exibe botao de cadastrar cronograma", async () => {
    await setup();
    await waitFor(() => {
      expect(screen.getByText("Cadastrar Cronograma")).toBeInTheDocument();
    });
  });

  it("possui estrutura de card-body", async () => {
    await setup();
    await waitFor(() => {
      const cardBody = document.querySelector(".cronograma-semanal-flv");
      expect(cardBody).toBeInTheDocument();
    });
  });
});
