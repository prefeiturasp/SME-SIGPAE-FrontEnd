import React from "react";
import {
  render,
  screen,
  act,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import mock from "src/services/_mock";
import CadastroFichaRecebimentoPage from "src/pages/Recebimento/FichaRecebimento/CadastroFichaRecebimentoPage";
import { mockListaCronogramasRecebimento } from "mocks/cronograma.service/mockGetCronogramasRecebimento";
import { mockCronogramaCadastroRecebimento } from "mocks/cronograma.service/mockGetCronogramaCadastroRecebimento";
import { mockQuestoesPorCronograma } from "mocks/services/questoesConferencia.service/mockDetalharQuestoesPorCronograma";
import moment from "moment";

beforeEach(() => {
  mock
    .onGet("/cronogramas/lista-cronogramas-ficha-recebimento/")
    .reply(200, mockListaCronogramasRecebimento);

  mock
    .onGet(
      `/cronogramas/${mockListaCronogramasRecebimento.results[0].uuid}/dados-cronograma-ficha-recebimento/`
    )
    .reply(200, mockCronogramaCadastroRecebimento);

  mock
    .onGet(`/questoes-por-produto/busca-questoes-cronograma/`)
    .reply(200, mockQuestoesPorCronograma);

  mock.onPost("/rascunho-ficha-de-recebimento/").reply(201);
});

const setup = async () => {
  await act(async () => {
    render(
      <MemoryRouter>
        <CadastroFichaRecebimentoPage />
      </MemoryRouter>
    );
  });
};

const preencheInput = (testId: string, value: string) => {
  let select = screen.getByTestId(testId);
  fireEvent.change(select, {
    target: { value: value },
  });
};

const selecionaOpcao = (testId: string, value: string) => {
  let selectCategoria = screen.getByTestId(testId).querySelector("select");
  fireEvent.change(selectCategoria, {
    target: { value: value },
  });
};

describe("Cadastro de Ficha de Recebimento", () => {
  it("preenche e envia o formulário completo", async () => {
    await setup();

    let cronograma = mockListaCronogramasRecebimento.results[0];
    let cronogramaDetalhado = mockCronogramaCadastroRecebimento.results;

    // Step 1
    preencheInput("cronograma", cronograma.numero);

    await waitFor(() => {
      expect(
        screen.getByDisplayValue(cronogramaDetalhado.fornecedor)
      ).toBeInTheDocument();
    });

    selecionaOpcao("etapa", cronogramaDetalhado.etapas[0].uuid);

    const inputDataEntrega = screen
      .getByTestId("data_entrega")
      .querySelector("input");
    fireEvent.change(inputDataEntrega, {
      target: { value: moment().add(7, "days").format("DD/MM/YYYY") },
    });

    const btnProximo = screen.getByText("Próximo").closest("button");
    expect(btnProximo).not.toBeDisabled();
    fireEvent.click(btnProximo);

    // Submit
    const btnRascunho = screen.getByText("Salvar Rascunho").closest("button");
    expect(btnRascunho).not.toBeDisabled();
    fireEvent.click(btnRascunho);

    const btnSim = screen.getByText("Sim").closest("button");
    fireEvent.click(btnSim);

    await waitFor(() => {
      expect(mock.history.post.length).toBe(1);
      expect(JSON.parse(mock.history.post[0].data)).toMatchObject({
        etapa: cronogramaDetalhado.etapas[0].uuid,
      });
    });
  });
});
