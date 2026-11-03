import "@testing-library/jest-dom";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import moment from "moment";
import { MemoryRouter } from "react-router-dom";
import { mockCronogramaCadastroRecebimento } from "src/mocks/cronograma.service/mockGetCronogramaCadastroRecebimento";
import { mockListaCronogramasRecebimento } from "src/mocks/cronograma.service/mockGetCronogramasRecebimento";
import { mockOpcoesReposicaoCronograma } from "src/mocks/services/fichaRecebimento.service/mockOpcoesReposicaoCronograma";
import { mockQuestoesPorCronograma } from "src/mocks/services/questoesConferencia.service/mockDetalharQuestoesPorCronograma";
import CadastroFichaRecebimentoPage from "src/pages/Recebimento/FichaRecebimento/CadastroFichaRecebimentoPage";
import mock from "src/services/_mock";

const EMBALAGEM_PRIMARIA = "Embalagem Primária";
const EMBALAGEM_SECUNDARIA = "Embalagem Secundária";
const CLASSE_ICONE_INFO = "fa-info-circle";

const CAMPOS_COM_TOOLTIP = [
  { label: "Quantidade Nota Fiscal", tooltip: EMBALAGEM_PRIMARIA },
  { label: "Quantidade Recebida", tooltip: EMBALAGEM_PRIMARIA },
  { label: "Embalagens Nota Fiscal", tooltip: EMBALAGEM_SECUNDARIA },
  { label: "Embalagens Recebidas", tooltip: EMBALAGEM_SECUNDARIA },
];

const CAMPOS_SEM_TOOLTIP = ["Nº Nota Fiscal", "Placa do Veículo"];

beforeEach(() => {
  mock
    .onGet("/cronogramas/lista-cronogramas-ficha-recebimento/")
    .reply(200, mockListaCronogramasRecebimento);

  mock
    .onGet(
      `/cronogramas/${mockListaCronogramasRecebimento.results[0].uuid}/dados-cronograma-ficha-recebimento/`,
    )
    .reply(200, mockCronogramaCadastroRecebimento);

  mock
    .onGet(`/questoes-por-produto/busca-questoes-cronograma/`)
    .reply(200, mockQuestoesPorCronograma);

  mock
    .onGet("/reposicao-cronograma-ficha-recebimento/")
    .reply(200, mockOpcoesReposicaoCronograma);
});

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

const setup = async () => {
  await act(async () => {
    render(
      <MemoryRouter>
        <CadastroFichaRecebimentoPage />
      </MemoryRouter>,
    );
  });
};

const avancaParaStepDadosRecebimento = async () => {
  const cronograma = mockListaCronogramasRecebimento.results[0];
  const cronogramaDetalhado = mockCronogramaCadastroRecebimento.results;

  fireEvent.change(screen.getByTestId("cronograma"), {
    target: { value: cronograma.numero },
  });

  await waitFor(() => {
    expect(
      screen.getByDisplayValue(cronogramaDetalhado.fornecedor),
    ).toBeInTheDocument();
  });

  const selectEtapa = screen
    .getByTestId("etapa")
    .querySelector("select") as HTMLSelectElement;
  fireEvent.change(selectEtapa, {
    target: { value: cronogramaDetalhado.etapas[0].uuid },
  });

  const inputDataEntrega = screen
    .getByTestId("data_entrega")
    .querySelector("input") as HTMLInputElement;
  fireEvent.change(inputDataEntrega, {
    target: { value: moment().add(7, "days").format("DD/MM/YYYY") },
  });

  const btnProximo = screen.getByText("Próximo").closest("button");
  expect(btnProximo).not.toBeDisabled();
  fireEvent.click(btnProximo as HTMLButtonElement);

  await screen.findByText("Veículos e Quantidades do Recebimento");
};

const obtemContainerDoCampo = (label: string, indiceVeiculo = 0) => {
  const elementos = screen.getAllByText(label);
  const container = elementos[indiceVeiculo].closest(".input") as HTMLElement;
  expect(container).toBeInTheDocument();
  return container;
};

const obtemIconeDoCampo = (label: string, indiceVeiculo = 0) =>
  obtemContainerDoCampo(label, indiceVeiculo).querySelector(
    `i.${CLASSE_ICONE_INFO}`,
  ) as HTMLElement | null;

describe("Cadastro de Ficha de Recebimento - Tooltips de embalagens", () => {
  beforeEach(async () => {
    await setup();
    await avancaParaStepDadosRecebimento();
  });

  it.each(CAMPOS_COM_TOOLTIP)(
    "exibe o ícone de informação ao lado do campo $label",
    ({ label }) => {
      expect(obtemIconeDoCampo(label)).toBeInTheDocument();
    },
  );

  it.each(CAMPOS_SEM_TOOLTIP)(
    "não exibe o ícone de informação no campo %s",
    (label) => {
      expect(obtemIconeDoCampo(label)).not.toBeInTheDocument();
    },
  );

  it.each(CAMPOS_COM_TOOLTIP)(
    "exibe '$tooltip' ao posicionar o cursor sobre o ícone de $label",
    async ({ label, tooltip }) => {
      expect(screen.queryByText(tooltip)).not.toBeInTheDocument();

      await userEvent.hover(obtemIconeDoCampo(label) as HTMLElement);

      expect(await screen.findByText(tooltip)).toBeInTheDocument();
    },
  );

  it("exibe os ícones e os tooltips corretos no novo veículo ao clicar em '+ Adicionar Veículo'", async () => {
    for (const { label } of CAMPOS_COM_TOOLTIP) {
      expect(screen.getAllByText(label)).toHaveLength(1);
    }

    fireEvent.click(
      screen.getByText("+ Adicionar Veículo").closest("button") as HTMLElement,
    );

    for (const { label } of CAMPOS_COM_TOOLTIP) {
      await waitFor(() => expect(screen.getAllByText(label)).toHaveLength(2));
      expect(obtemIconeDoCampo(label, 0)).toBeInTheDocument();
      expect(obtemIconeDoCampo(label, 1)).toBeInTheDocument();
    }

    const indiceNovoVeiculo = 1;
    for (const { label, tooltip } of CAMPOS_COM_TOOLTIP) {
      await userEvent.hover(
        obtemIconeDoCampo(label, indiceNovoVeiculo) as HTMLElement,
      );

      await waitFor(() => {
        const visiveis = screen
          .getAllByText(tooltip)
          .filter(
            (el) =>
              !el
                .closest(".ant-tooltip")
                ?.classList.contains("ant-tooltip-hidden"),
          );
        expect(visiveis).toHaveLength(1);
      });

      await userEvent.unhover(
        obtemIconeDoCampo(label, indiceNovoVeiculo) as HTMLElement,
      );
    }
  });
});
