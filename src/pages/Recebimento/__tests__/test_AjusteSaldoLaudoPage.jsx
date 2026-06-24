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
import CadastroAjusteSaldoPage from "src/pages/Recebimento/AjusteSaldoLaudo/CadastroAjusteSaldoPage";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockMeusDadosDilogQualidade } from "src/mocks/meusDados/dilog-qualidade";

import { mockGetCronogramasComDocs } from "src/mocks/services/ajusteSaldo.service/mockGetCronogramasComDocs";
import { mockGetDocumentosCronograma } from "src/mocks/services/ajusteSaldo.service/mockGetDocumentosCronograma";

import { PERFIL, TIPO_PERFIL } from "src/constants/shared";

describe("Testar Listagem de Fichas de Recebimento", () => {
  beforeEach(async () => {
    localStorage.setItem("perfil", PERFIL.DILOG_QUALIDADE);
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.PRE_RECEBIMENTO);

    mock
      .onGet(`/ajuste-saldo-laudo/cronogramas-mensal-com-documentos/`)
      .reply(200, mockGetCronogramasComDocs);

    mock
      .onGet(`ajuste-saldo-laudo/documentos-do-cronograma/`)
      .reply(200, mockGetDocumentosCronograma);

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
            <CadastroAjusteSaldoPage />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });
  });

  it("Testa o preenchimento do formulário", async () => {
    const cronogramaNumero = "156/2024A";
    const cronograma = mockGetCronogramasComDocs.find(
      (c) => c.numero === cronogramaNumero,
    );
    const documento = mockGetDocumentosCronograma[0];

    const inputCronograma = screen.getByTestId("cronograma");
    await act(async () => {
      fireEvent.mouseDown(inputCronograma);
    });

    await waitFor(() => screen.getByText("156/2024A"));
    await act(async () => {
      fireEvent.click(screen.getByText("156/2024A"));
    });

    const produtoInput = await screen.findByDisplayValue(
      cronograma.produto_nome,
    );
    expect(produtoInput).toBeInTheDocument();

    const fornecedorInput = await screen.findByDisplayValue(
      cronograma.fornecedor_nome,
    );
    expect(fornecedorInput).toBeInTheDocument();

    const inputLaudo = screen.getByTestId("numero-laudo");
    await act(async () => {
      fireEvent.mouseDown(inputLaudo);
    });

    await waitFor(() => screen.getAllByText("12345").length > 0);
    await act(async () => {
      fireEvent.click(screen.getAllByText("12345")[1]);
    });

    const inputQuantidade = screen.getByPlaceholderText("Digite a Quantidade");
    fireEvent.change(inputQuantidade, { target: { value: "10,00" } });
    fireEvent.blur(inputQuantidade);

    const expectedSaldo = (parseFloat(documento.saldo_atual) - 10).toFixed(2);
    const saldoAtualInput = await screen.findByDisplayValue(expectedSaldo);
    expect(saldoAtualInput).toBeInTheDocument();
  });
});
