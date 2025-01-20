import "@testing-library/jest-dom";
import {
  render,
  waitFor,
  act,
  screen,
  fireEvent,
} from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { CorpoRelatorio } from "../Relatorio/components/CorpoRelatorio";
import { CODAE, ESCOLA } from "configs/constants";
import { ModalCancelarKitLancheCEMEI } from "components/SolicitacaoKitLancheCEMEI/Relatorio/components/ModalCancelarKitLancheCEMEI";
import { ModalNegarFinalForm } from "components/Shareable/ModalNegarFinalForm";
import { ModalCODAEQuestionaFinalForm } from "components/Shareable/ModalCODAEQuestionaFinalForm";
import { TIPO_PERFIL } from "../../../constants/shared";

import {
  getSolicitacaoKitLancheCEMEI,
  cancelaFluxoSolicitacaoKitLancheCEMEI,
  CODAEAutorizaKitLancheCEMEI,
  CODAENegaKitLancheCEMEI,
  CODAEquestionaKitLancheCEMEI,
} from "services/kitLanche";
// import { getRelatorioKitLancheCEMEI } from "services/relatorios";

import { mockGetSolicitacaoKitLancheCEMEI } from "mocks/SolicitacaoKitLancheCEMEI/mockGetSolicitacaoKitLancheCEMEI";
import { mockCODAEQuestionaSolicitacao } from "mocks/SolicitacaoKitLancheCEMEI/mockCODAEQuestionaSolicitacao";
import { mockSolicitacaoKitLancheCODAE } from "mocks/SolicitacaoKitLancheCEMEI/mockSolicitacaoKitLancheCODAE";
import { mockGetSolicitacaoPosQuestionamento } from "mocks/SolicitacaoKitLancheCEMEI/mockGetSolicitacaoPosQuestionamento";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
}));

jest.mock("services/kitLanche");

const props1 = {
  visao: { ESCOLA },
  ModalNaoAprova: ModalCancelarKitLancheCEMEI,
  toastNaoAprovaMensagem: "Kit Lanche Passeio cancelado com sucesso!",
  endpointNaoAprovaSolicitacao: { cancelaFluxoSolicitacaoKitLancheCEMEI },
  textoBotaoNaoAprova: "Cancelar",
  solicitacaoKitLancheCEMEI: mockGetSolicitacaoKitLancheCEMEI,
};

const props2 = {
  visao: { CODAE },
  ModalNaoAprova: ModalNegarFinalForm,
  ModalQuestionamento: ModalCODAEQuestionaFinalForm,
  toastAprovaMensagem: "Kit Lanche Passeio autorizado com sucesso!",
  toastAprovaMensagemErro: "Houve um erro ao autorizar o Kit Lanche Passeio",
  endpointNaoAprovaSolicitacao: { CODAENegaKitLancheCEMEI },
  endpointAprovaSolicitacao: { CODAEAutorizaKitLancheCEMEI },
  endpointQuestionamento: CODAEquestionaKitLancheCEMEI,
  textoBotaoNaoAprova: "Negar",
  textoBotaoAprova: "Autorizar",
  solicitacaoKitLancheCEMEI: mockSolicitacaoKitLancheCODAE,
};

describe("Teste <CorpoRelatorio> - Visão ESCOLA", () => {
  beforeEach(async () => {
    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <CorpoRelatorio {...props1} />
        </MemoryRouter>
      );
    });
  });

  it("Testa se elementos da tabela estão aparecendo corretamente.", async () => {
    expect(screen.getByText("MEL DONOLA VAZ")).toBeInTheDocument();
    expect(screen.getByText("ISABELLA TORRES SILVA")).toBeInTheDocument();
  });
});

describe("Teste <CorpoRelatorio> - Visão CODAE", () => {
  beforeEach(async () => {
    getSolicitacaoKitLancheCEMEI.mockResolvedValue({
      data: mockGetSolicitacaoPosQuestionamento,
      status: 200,
    });

    CODAEquestionaKitLancheCEMEI.mockResolvedValue({
      data: mockCODAEQuestionaSolicitacao,
      status: 200,
    });

    window.localStorage.setItem(
      "tipo_perfil",
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA
    );

    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <CorpoRelatorio {...props2} />
        </MemoryRouter>
      );
    });
  });

  it("testa se o botão de Questionar está presente", async () => {
    const botaoQuestionar = screen.getByText("Questionar").closest("button");
    expect(botaoQuestionar).toBeInTheDocument();

    fireEvent.click(botaoQuestionar);

    const botaoEnviar = screen.getByText("Enviar").closest("button");
    expect(botaoEnviar).toBeInTheDocument();

    const formulario = screen.getByTestId("formulario-questionamento");
    fireEvent.submit(formulario);

    await waitFor(() =>
      expect(CODAEquestionaKitLancheCEMEI).toHaveBeenCalled()
    );
    expect(CODAEquestionaKitLancheCEMEI).toHaveReturnedWith(
      Promise.resolve(mockCODAEQuestionaSolicitacao)
    );
  });
});
