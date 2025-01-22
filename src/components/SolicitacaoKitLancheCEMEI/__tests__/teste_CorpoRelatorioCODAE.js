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
import { CODAE } from "configs/constants";
import { TIPO_PERFIL } from "../../../constants/shared";

import { ModalNegarFinalForm } from "components/Shareable/ModalNegarFinalForm";
import { ModalCODAEQuestionaFinalForm } from "components/Shareable/ModalCODAEQuestionaFinalForm";

import {
  getSolicitacaoKitLancheCEMEI,
  CODAEAutorizaKitLancheCEMEI,
  CODAENegaKitLancheCEMEI,
  CODAEquestionaKitLancheCEMEI,
} from "services/kitLanche";

import { mockCODAEQuestionaSolicitacao } from "mocks/SolicitacaoKitLancheCEMEI/mockCODAEQuestionaSolicitacao";
import { mockSolicitacaoKitLancheCODAE } from "mocks/SolicitacaoKitLancheCEMEI/mockSolicitacaoKitLancheCODAE";
import { mockGetSolicitacaoPosQuestionamento } from "mocks/SolicitacaoKitLancheCEMEI/mockGetSolicitacaoPosQuestionamento";
import { mockGetSolicitacaoKitLancheRegular2 } from "mocks/SolicitacaoKitLancheCEMEI/mockGetSolicitacaoKitLancheRegular2";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
}));

jest.mock("services/kitLanche");

const propsCODAE = {
  visao: { CODAE },
  ModalNaoAprova: ModalNegarFinalForm,
  ModalQuestionamento: ModalCODAEQuestionaFinalForm,
  toastAprovaMensagem: "Kit Lanche Passeio autorizado com sucesso!",
  toastAprovaMensagemErro: "Houve um erro ao autorizar o Kit Lanche Passeio",
  endpointNaoAprovaSolicitacao: CODAENegaKitLancheCEMEI,
  endpointAprovaSolicitacao: CODAEAutorizaKitLancheCEMEI,
  endpointQuestionamento: CODAEquestionaKitLancheCEMEI,
  textoBotaoNaoAprova: "Negar",
  textoBotaoAprova: "Autorizar",
  solicitacaoKitLancheCEMEI: mockSolicitacaoKitLancheCODAE,
};

const propsCODAERegular = {
  visao: { CODAE },
  ModalNaoAprova: ModalNegarFinalForm,
  ModalQuestionamento: ModalCODAEQuestionaFinalForm,
  toastAprovaMensagem: "Kit Lanche Passeio autorizado com sucesso!",
  toastAprovaMensagemErro: "Houve um erro ao autorizar o Kit Lanche Passeio",
  endpointNaoAprovaSolicitacao: CODAENegaKitLancheCEMEI,
  endpointAprovaSolicitacao: CODAEAutorizaKitLancheCEMEI,
  endpointQuestionamento: CODAEquestionaKitLancheCEMEI,
  textoBotaoNaoAprova: "Negar",
  textoBotaoAprova: "Autorizar",
  solicitacaoKitLancheCEMEI: mockGetSolicitacaoKitLancheRegular2,
};

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
          <CorpoRelatorio {...propsCODAE} />
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

describe("Teste <CorpoRelatorio> Solicitação Regular - Visão CODAE", () => {
  beforeEach(async () => {
    CODAEAutorizaKitLancheCEMEI.mockResolvedValue({
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
          <CorpoRelatorio {...propsCODAERegular} />
        </MemoryRouter>
      );
    });
  });

  it("Testa a abertura e fechamento do Modal de Autorização da CODAE", async () => {
    const botaoAutorizar = screen.getByText("Autorizar").closest("button");
    expect(botaoAutorizar).toBeInTheDocument();

    fireEvent.click(botaoAutorizar);

    expect(
      screen.getByText("Deseja autorizar a solicitação?")
    ).toBeInTheDocument();

    const botaoNao = screen.getByText("Não").closest("button");
    expect(botaoNao).toBeInTheDocument();

    fireEvent.click(botaoNao);
  });
});
