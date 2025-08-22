import React from "react";
import {
  render,
  screen,
  act,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import mock from "src/services/_mock";
import CadastroFichaRecebimentoPage from "src/pages/Recebimento/FichaRecebimento/CadastroFichaRecebimentoPage";
import { mockListaCronogramasRecebimento } from "src/mocks/cronograma.service/mockGetCronogramasRecebimento";
import { mockCronogramaCadastroRecebimento } from "src/mocks/cronograma.service/mockGetCronogramaCadastroRecebimento";
import { mockCadastroFichaRecebimento } from "src/mocks/services/fichaRecebimento.service/mockCadastroFichaRecebimento";
import { mockQuestoesPorCronograma } from "src/mocks/services/questoesConferencia.service/mockDetalharQuestoesPorCronograma";
import moment from "moment";
import { ToastContainer } from "react-toastify";

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

  mock
    .onPost("/fichas-de-recebimento/")
    .reply(201, mockCadastroFichaRecebimento);
});

const setup = async () => {
  await act(async () => {
    render(
      <MemoryRouter>
        <CadastroFichaRecebimentoPage />
        <ToastContainer />
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

const preencheInputByPlaceholder = (placeholder: string, value: string) => {
  const element = screen.getByPlaceholderText(placeholder);
  fireEvent.change(element, {
    target: { value: value },
  });
};

const selecionaRadioButton = async (text: string, name: string) => {
  const element = screen
    .getByText(text)
    .closest(".radio-button-sigpae") as HTMLElement;
  const radio1 = within(element).getByRole("radio", {
    name: name,
  });
  await fireEvent.click(radio1);
  expect(radio1).toBeChecked();
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

    // Step 2
    const dropdown = screen.getByText("Selecione os Laudos");
    await fireEvent.click(dropdown);

    const opcaoTodos = await screen.findByText("Todos");
    await fireEvent.click(opcaoTodos);

    const radios = screen.getAllByLabelText("De acordo com o Laudo");
    for (const radio of radios) {
      fireEvent.click(radio);
      expect(radio).toBeChecked();
    }

    preencheInputByPlaceholder(
      "Digite o número do lote de armazenagem",
      "123456"
    );
    preencheInputByPlaceholder("Digite o número de paletes", "30");

    const inputsPeso = screen.getAllByPlaceholderText("Digite o peso");
    for (const input of inputsPeso) {
      fireEvent.change(input, {
        target: { value: "2" },
      });
    }

    preencheInputByPlaceholder("T °C da área", "10");
    preencheInputByPlaceholder("T °C do produto", "10");
    preencheInputByPlaceholder("Digite o número do lacre", "12345");
    preencheInputByPlaceholder("Digite o número", "2149");
    preencheInputByPlaceholder("Digite a placa do veículo", "ABC1345");
    preencheInputByPlaceholder("Digite o número da nota", "8647");
    preencheInputByPlaceholder("Digite a qtde da nota", "1");
    preencheInputByPlaceholder("Digite a qtde de embalagens", "1");
    preencheInputByPlaceholder("Digite a qtde recebida", "1");
    preencheInputByPlaceholder("Digite qtde recebida", "1");

    const radioButtonAdequado = screen.getByLabelText("ADEQUADO");
    fireEvent.click(radioButtonAdequado);
    expect(radioButtonAdequado).toBeChecked();

    const radioButtonNao = screen.getByLabelText("NÃO");
    fireEvent.click(radioButtonNao);

    expect(btnProximo).not.toBeDisabled();
    fireEvent.click(btnProximo);

    // Step 3
    const geladoButton = screen.getByLabelText("gelado");
    fireEvent.click(geladoButton);
    expect(geladoButton).toBeChecked();

    selecionaRadioButton("IDENTIFICAÇÃO DO PRODUTO", "SIM");
    selecionaRadioButton("IDENTIFICAÇÃO DO FABRICANTE", "SIM");
    selecionaRadioButton("DATA DE FABRICAÇÃO", "NÃO");
    selecionaRadioButton("INFORMAÇÃO NUTRICIONAL", "SIM");
    selecionaRadioButton("PESO LÍQUIDO (EXCETO SUCO)", "SIM");

    selecionaRadioButton("Houve Ocorrência(s) no Recebimento?", "SIM");

    const label = screen.getByText("Tipo de Ocorrência");
    const select = label.parentElement?.querySelector(
      "select"
    ) as HTMLSelectElement;
    fireEvent.change(select, { target: { value: "RECUSA" } });

    const botaoTotal = screen.getByLabelText("TOTAL");
    fireEvent.click(botaoTotal);

    expect(
      screen.getByText("Nº das Notas Fiscais Sujeitas a Pagamento Parcial")
    ).toBeInTheDocument();
    expect(screen.getByText("Quantidade Recusada")).toBeInTheDocument();

    preencheInputByPlaceholder("Digite o número da nota fiscal", "4321");
    preencheInputByPlaceholder("Digite a quantidade recusada", "12");
    preencheInputByPlaceholder("Descreva a ocorrência", "Teste - Descrição");

    // Submit
    const btnSalvar = screen.getByText("Salvar e Assinar").closest("button");
    expect(btnSalvar).not.toBeDisabled();
    fireEvent.click(btnSalvar);

    expect(
      screen.getByText(
        "Você confirma o preenchimento correto de todas as informações solicitadas na ficha de recebimento?"
      )
    ).toBeInTheDocument();

    const btnAssinar = screen.getByText("Sim, Assinar Ficha").closest("button");
    fireEvent.click(btnAssinar);

    expect(
      screen.getByText("Assinatura do Responsável pelo Recebimento")
    ).toBeInTheDocument();

    preencheInputByPlaceholder("Digite sua senha", "teste");

    const btnConfirmar = screen.getByText("Confirmar").closest("button");
    expect(btnConfirmar).not.toBeDisabled();
    fireEvent.click(btnConfirmar);

    await waitFor(() => {
      expect(
        screen.getByText("Ficha de recebimento Assinada com sucesso!")
      ).toBeInTheDocument();
    });
  });
});
