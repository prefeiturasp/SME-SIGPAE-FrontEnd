import {
  render,
  act,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import mock from "src/services/_mock";
import { MemoryRouter } from "react-router-dom";
import EditarAjusteSaldoPage from "src/pages/Recebimento/AjusteSaldoLaudo/EditarAjusteSaldoPage";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockMeusDadosDilogQualidade } from "src/mocks/meusDados/dilog-qualidade";

import { agruparMilharDecimalModificado } from "src/components/Shareable/Input/InputText/helpers";

import { mockGetCronogramasComDocs } from "src/mocks/services/ajusteSaldo.service/mockGetCronogramasComDocs";
import { mockGetDocumentosCronograma } from "src/mocks/services/ajusteSaldo.service/mockGetDocumentosCronograma";
import { mockGetAjusteSaldoDetalhar } from "src/mocks/services/ajusteSaldo.service/mockGetAjusteSaldoDetalhar";

import { PERFIL, TIPO_PERFIL } from "src/constants/shared";

describe("Testar Edição de Ajustes de Saldo do Laudo", () => {
  beforeEach(async () => {
    localStorage.setItem("perfil", PERFIL.DILOG_QUALIDADE);
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.PRE_RECEBIMENTO);

    const search = `?uuid=${mockGetAjusteSaldoDetalhar.uuid}`;
    window.history.pushState({}, "", search);

    mock
      .onGet(`/ajuste-saldo-laudo/${mockGetAjusteSaldoDetalhar.uuid}/`)
      .reply(200, mockGetAjusteSaldoDetalhar);

    mock
      .onGet(`/ajuste-saldo-laudo/cronogramas-mensal-com-documentos/`)
      .reply(200, mockGetCronogramasComDocs);

    mock
      .onGet(`ajuste-saldo-laudo/documentos-do-cronograma/`)
      .reply(200, mockGetDocumentosCronograma);

    mock
      .onPatch(`/ajuste-saldo-laudo/${mockGetAjusteSaldoDetalhar.uuid}/`)
      .reply(200);
  });

  const setup = async () => {
    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <MeusDadosContext.Provider
            value={{
              meusDados: mockMeusDadosDilogQualidade,
              setMeusDados: jest.fn(),
            }}
          >
            <EditarAjusteSaldoPage />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });
  };

  it("Preenche o formulário automaticamente com os dados do ajuste", async () => {
    await setup();

    const cronograma = mockGetCronogramasComDocs.find(
      (c) => c.numero === mockGetAjusteSaldoDetalhar.numero_cronograma,
    );
    const documento = mockGetDocumentosCronograma[0];

    await waitFor(() => {
      expect(
        screen.getByDisplayValue(mockGetAjusteSaldoDetalhar.numero_cronograma),
      ).toBeInTheDocument();
    });

    expect(
      screen.getByDisplayValue(cronograma.produto_nome),
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(cronograma.fornecedor_nome),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByDisplayValue(mockGetAjusteSaldoDetalhar.numero_laudo),
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByDisplayValue(
          `${agruparMilharDecimalModificado(
            mockGetAjusteSaldoDetalhar.quantidade_descontada,
          )}`,
        ),
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      const camposComSaldo = screen.getAllByDisplayValue(
        `${agruparMilharDecimalModificado(documento.saldo_atual)} ${documento.unidade_medida}`,
      );
      expect(camposComSaldo).toHaveLength(2);
    });
  });

  it("Mantém desabilitados os campos de cronograma e nº do laudo, deixando a quantidade descontada editável", async () => {
    await setup();

    await waitFor(() => {
      expect(
        screen.getByDisplayValue(mockGetAjusteSaldoDetalhar.numero_cronograma),
      ).toBeInTheDocument();
    });

    const cronogramaInput = screen.getByTestId("cronograma");
    expect(cronogramaInput).toHaveAttribute("disabled");

    const numeroLaudoInput = screen.getByTestId("numero-laudo");
    expect(numeroLaudoInput).toHaveAttribute("disabled");

    const inputQuantidade = screen.getByPlaceholderText("Digite a Quantidade");
    expect(inputQuantidade).not.toHaveAttribute("disabled");
  });

  it("Exibe o botão Salvar em vez de Cadastrar no modo de edição", async () => {
    await setup();

    await waitFor(() => {
      expect(screen.getByText("Salvar")).toBeInTheDocument();
    });

    expect(screen.queryByText("Cadastrar")).not.toBeInTheDocument();
  });

  it("Envia apenas uuid e quantidade_descontada ao salvar a edição", async () => {
    await setup();

    const inputQuantidade = await screen.findByPlaceholderText(
      "Digite a Quantidade",
    );

    await waitFor(() =>
      expect(inputQuantidade).not.toHaveAttribute("disabled"),
    );

    fireEvent.change(inputQuantidade, { target: { value: "10,00" } });
    fireEvent.blur(inputQuantidade);

    const btnSalvar = screen.getByText("Salvar").closest("button");
    await act(async () => {
      fireEvent.click(btnSalvar);
    });

    await waitFor(() => {
      expect(
        mock.history.patch.some((call) =>
          call.url.includes(
            `/ajuste-saldo-laudo/${mockGetAjusteSaldoDetalhar.uuid}/`,
          ),
        ),
      ).toBe(true);
    });

    const chamadaPatch = mock.history.patch.find((call) =>
      call.url.includes(
        `/ajuste-saldo-laudo/${mockGetAjusteSaldoDetalhar.uuid}/`,
      ),
    );
    const payloadEnviado = JSON.parse(chamadaPatch.data);

    expect(payloadEnviado).toEqual({
      quantidade_descontada: 10,
    });
  });
});
