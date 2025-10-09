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
import { mockListaCronogramasRecebimento } from "src/mocks/cronograma.service/mockGetCronogramasRecebimento";
import { mockCronogramaCadastroRecebimento } from "src/mocks/cronograma.service/mockGetCronogramaCadastroRecebimento";
import { mockCadastroFichaRecebimento } from "src/mocks/services/fichaRecebimento.service/mockCadastroFichaRecebimento";
import { mockOpcoesReposicaoCronograma } from "src/mocks/services/fichaRecebimento.service/mockOpcoesReposicaoCronograma";
import { mockQuestoesPorCronograma } from "src/mocks/services/questoesConferencia.service/mockDetalharQuestoesPorCronograma";
import moment from "moment";
import { ToastContainer } from "react-toastify";
import { mockGetFichaRecebimentoDetalhada } from "src/mocks/services/fichaRecebimento.service/mockGetFichaRecebimentoDetalhada";

describe("Cadastro de Ficha de Recebimento - Reposição Etapa Cronograma", () => {
  beforeEach(async () => {
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

    mock
      .onGet(`/fichas-de-recebimento/${mockGetFichaRecebimentoDetalhada.uuid}/`)
      .reply(200, mockGetFichaRecebimentoDetalhada);
    mock.onPut("/rascunho-ficha-de-recebimento/").reply(200);
    mock.onPut("/fichas-de-recebimento/").reply(200);
    mock
      .onGet("/reposicao-cronograma-ficha-recebimento/")
      .reply(200, mockOpcoesReposicaoCronograma);

    await act(async () => {
      render(
        <MemoryRouter>
          <CadastroFichaRecebimentoPage />
          <ToastContainer />
        </MemoryRouter>
      );
    });
  });

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

  it("deve exibir campos de reposição quando houve_ocorrencia for true na etapa selecionada", async () => {
    const cronograma = mockListaCronogramasRecebimento.results[0];
    const cronogramaDetalhado = mockCronogramaCadastroRecebimento.results;

    // Preenche cronograma, etapa e data entrega
    preencheInput("cronograma", cronograma.numero);

    await waitFor(() => {
      expect(
        screen.getByDisplayValue(cronogramaDetalhado.fornecedor)
      ).toBeInTheDocument();
    });

    selecionaOpcao("etapa", cronogramaDetalhado.etapas[2].uuid);

    const inputDataEntrega = screen
      .getByTestId("data_entrega")
      .querySelector("input");
    fireEvent.change(inputDataEntrega, {
      target: { value: moment().add(7, "days").format("DD/MM/YYYY") },
    });

    // Verifica campo de reposição
    await waitFor(() => {
      expect(
        screen.getByText(
          "Referente à ocorrência registrada nesta etapa, o Fornecedor optou por:"
        )
      ).toBeInTheDocument();
    });

    // Seleção de opção de Carta de Crédito
    const radioCredito = screen.getByLabelText(/Crédito/i);
    fireEvent.click(radioCredito);
    expect(radioCredito).toBeChecked();

    // Verifica que aparecem os campos adicionais
    await waitFor(() => {
      expect(
        screen.getByText(
          /Anexe os documentos relacionados a reposição \/ pagamento da notificação/i
        )
      ).toBeInTheDocument();
      expect(screen.getByText(/observações/i)).toBeInTheDocument();
      expect(
        screen.getByText("Salvar e Assinar").closest("button")
      ).toBeInTheDocument();
    });
  });
});
