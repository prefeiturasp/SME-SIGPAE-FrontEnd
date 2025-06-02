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
import { DRE } from "src/configs/constants";
import { TIPO_PERFIL } from "../../../constants/shared";

import { ModalNaoValidarFinalForm } from "src/components/Shareable/ModalNaoValidarFinalForm";

import {
  getSolicitacaoKitLancheCEMEI,
  DREValidaKitLancheCEMEI,
  DRENaoValidaKitLancheCEMEI,
} from "src/services/kitLanche";

import { mockDREValidaKitLanche } from "mocks/SolicitacaoKitLancheCEMEI/mockDREValidaKitLanche";
import { mockGetSolicitacaoPosValidacaoDRE } from "mocks/SolicitacaoKitLancheCEMEI/mockGetSolicitacaoPosValidacaoDRE";
import { mockGetSolicitacaoKitLancheRegular } from "mocks/SolicitacaoKitLancheCEMEI/mockGetSolicitacaoKitLancheRegular";
import { mockMotivosDRENaoValida } from "mocks/SolicitacaoKitLancheCEMEI/mockMotivosDRENaoValida";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
}));

jest.mock("services/kitLanche");

const propsDRE = {
  visao: DRE,
  ModalNaoAprova: ModalNaoValidarFinalForm,
  toastAprovaMensagem: "Kit Lanche Passeio validado com sucesso!",
  toastAprovaMensagemErro: "Houve um erro ao validar o Kit Lanche Passeio",
  endpointNaoAprovaSolicitacao: DRENaoValidaKitLancheCEMEI,
  endpointAprovaSolicitacao: DREValidaKitLancheCEMEI,
  textoBotaoNaoAprova: "Não Validar",
  textoBotaoAprova: "Validar",
  solicitacaoKitLancheCEMEI: mockGetSolicitacaoKitLancheRegular,
  motivosDREnaoValida: mockMotivosDRENaoValida,
};

describe("Teste <CorpoRelatorio> - Visão DRE", () => {
  beforeEach(async () => {
    getSolicitacaoKitLancheCEMEI.mockResolvedValue({
      data: mockGetSolicitacaoPosValidacaoDRE,
      status: 200,
    });

    DREValidaKitLancheCEMEI.mockResolvedValue({
      data: mockDREValidaKitLanche,
      status: 200,
    });

    window.localStorage.setItem("tipo_perfil", TIPO_PERFIL.DIRETORIA_REGIONAL);

    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <CorpoRelatorio {...propsDRE} />
        </MemoryRouter>
      );
    });
  });

  it("testa se o botão de Validar está presente e funcionando", async () => {
    const botaoValidar = screen.getByText("Validar").closest("button");
    expect(botaoValidar).toBeInTheDocument();

    fireEvent.click(botaoValidar);

    await waitFor(() => expect(DREValidaKitLancheCEMEI).toHaveBeenCalled());
    expect(DREValidaKitLancheCEMEI).toHaveReturnedWith(
      Promise.resolve(mockDREValidaKitLanche)
    );
  });

  it("testa se o botão de 'Não Validar' está presente e funcionando", async () => {
    const botaoNaoValidar = screen.getByText("Não Validar").closest("button");
    expect(botaoNaoValidar).toBeInTheDocument();

    fireEvent.click(botaoNaoValidar);

    expect(
      screen.getByText("Deseja não validar solicitação?")
    ).toBeInTheDocument();

    const botaoNao = screen.getByText("Não").closest("button");
    expect(botaoNao).toBeInTheDocument();

    fireEvent.click(botaoNao);
  });
});
