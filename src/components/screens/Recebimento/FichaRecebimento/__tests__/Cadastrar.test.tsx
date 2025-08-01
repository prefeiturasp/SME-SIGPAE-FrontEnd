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
import { mockQuestoesPorCronograma } from "src/mocks/services/questoesConferencia.service/mockDetalharQuestoesPorCronograma";
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

    const inputLoteArmazenagem = screen.getByPlaceholderText(
      "Digite o número do lote de armazenagem"
    );
    fireEvent.change(inputLoteArmazenagem, {
      target: { value: "123456" },
    });

    const inputPaletes = screen.getByPlaceholderText(
      "Digite o número de paletes"
    );
    fireEvent.change(inputPaletes, {
      target: { value: "30" },
    });

    const inputsPeso = screen.getAllByPlaceholderText("Digite o peso");
    for (const input of inputsPeso) {
      fireEvent.change(input, {
        target: { value: "2" },
      });
    }

    const temperaturaArea = screen.getByPlaceholderText("T °C da área");
    fireEvent.change(temperaturaArea, {
      target: { value: "10" },
    });

    const temperaturaProduto = screen.getByPlaceholderText("T °C do produto");
    fireEvent.change(temperaturaProduto, {
      target: { value: "10" },
    });

    const numeroLacre = screen.getByPlaceholderText("Digite o número do lacre");
    fireEvent.change(numeroLacre, {
      target: { value: "12345" },
    });

    const numeroSif = screen.getByPlaceholderText("Digite o número");
    fireEvent.change(numeroSif, {
      target: { value: "2149" },
    });

    const inputPlaca = screen.getByPlaceholderText("Digite a placa do veículo");
    fireEvent.change(inputPlaca, {
      target: { value: "ABC1345" },
    });

    const inputNotaFiscal = screen.getByPlaceholderText(
      "Digite o número da nota"
    );
    fireEvent.change(inputNotaFiscal, {
      target: { value: "8647" },
    });

    const inputQtdNota = screen.getByPlaceholderText("Digite a qtde da nota");
    fireEvent.change(inputQtdNota, {
      target: { value: "1" },
    });

    const inputQtdEmbalagens = screen.getByPlaceholderText(
      "Digite a qtde de embalagens"
    );
    fireEvent.change(inputQtdEmbalagens, {
      target: { value: "1" },
    });

    const inputQtdRecebida = screen.getByPlaceholderText(
      "Digite a qtde recebida"
    );
    fireEvent.change(inputQtdRecebida, {
      target: { value: "1" },
    });

    const inputEmbalagensRecebidas = screen.getByPlaceholderText(
      "Digite qtde recebida"
    );
    fireEvent.change(inputEmbalagensRecebidas, {
      target: { value: "1" },
    });

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

    const grupoOcorrencias = screen
      .getByText("Houve Ocorrência(s) no Recebimento?")
      .closest(".radio-button-sigpae") as HTMLElement;
    const radioSim = within(grupoOcorrencias).getByRole("radio", {
      name: "SIM",
    });
    await fireEvent.click(radioSim);
    expect(radioSim).toBeChecked();

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

    const numeroNotaFiscal = screen.getByPlaceholderText(
      "Digite o número da nota fiscal"
    );
    fireEvent.change(numeroNotaFiscal, {
      target: { value: "4321" },
    });

    const qtdRecusada = screen.getByPlaceholderText(
      "Digite a quantidade recusada"
    );
    fireEvent.change(qtdRecusada, {
      target: { value: "12" },
    });

    const descricaoOcorrencia = screen.getByPlaceholderText(
      "Descreva a ocorrência"
    );
    fireEvent.change(descricaoOcorrencia, {
      target: { value: "Teste - Descrição" },
    });

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
