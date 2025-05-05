import React from "react";
import { render, screen, act, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import mock from "services/_mock";
import ReposicaoDeGuia from "..";
import { mockGuiaParaConferencia } from "../../../../../mocks/logistica.service/mockGetGuiaParaConferencia";

beforeEach(() => {
  mock
    .onGet(`/guias-da-requisicao/guia-para-conferencia/`)
    .reply(200, mockGuiaParaConferencia);
});

const setup = async (autofill = false) => {
  const search = `?uuid=${mockGuiaParaConferencia.uuid}${
    autofill ? "&autofill=true" : ""
  }`;
  Object.defineProperty(window, "location", {
    value: {
      search: search,
    },
  });

  await act(async () => {
    render(
      <MemoryRouter>
        <ReposicaoDeGuia />
      </MemoryRouter>
    );
  });
};

const preencheInput = (testId, value) => {
  let select = screen.getByTestId(testId);
  fireEvent.change(select, {
    target: { value: value },
  });
};

describe("Cadastro de Reposição de guia", () => {
  it("preenche e envia o formulário completo", async () => {
    await setup();
    const divDia = screen.getByTestId("data_entrega_real");
    const inputData = divDia.querySelector("input");

    fireEvent.change(inputData, {
      target: { value: "24/04/2025" },
    });

    const inputHora = screen.getByPlaceholderText("Selecione a Hora");

    fireEvent.mouseDown(inputHora);
    fireEvent.change(inputHora, {
      target: { value: "14:16" },
    });
    fireEvent.click(screen.getByText("OK"));

    preencheInput("nome_motorista", "Josenildo");
    preencheInput("placa_veiculo", "ABC1234");

    preencheInput("recebidos_fechada_0", "17");
    preencheInput("recebidos_fracionada_0", "1");
    preencheInput("observacoes_0", "AAAAAAAAA");

    preencheInput("recebidos_fechada_1", "6");
    preencheInput("observacoes_1", "BBBBBBBBBBBBBBBBB");

    const btnFinalizar = screen
      .getByText("Finalizar reposição")
      .closest("button");
    expect(btnFinalizar).not.toBeDisabled();
    fireEvent.click(btnFinalizar);

    expect(typeof localStorage.getItem("valoresReposicao")).toBe("string");
    expect(typeof localStorage.getItem("guiaReposicao")).toBe("string");
  });
});
