import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import { BlocoOcorrencias } from "..";

const escolaSimples = {
  uuid: "escola-uuid",
  nome: "EMEF Teste",
  codigo_eol: "000546",
  lote: {
    uuid: "lote-uuid",
    nome: "Lote 1",
    contratos_do_lote: [
      {
        uuid: "contrato-uuid",
        encerrado: false,
        edital: "edital-uuid",
      },
    ],
  },
} as any;

const renderizar = (comOcorrencias: string, desabilitarAvaliacao = false) => {
  const setComOcorrencias = jest.fn();
  const setErrosAoSalvar = jest.fn();

  render(
    <MemoryRouter>
      <BlocoOcorrencias
        comOcorrencias={comOcorrencias}
        setComOcorrencias={setComOcorrencias}
        desabilitarAvaliacao={desabilitarAvaliacao}
        errosAoSalvar={[]}
        setErrosAoSalvar={setErrosAoSalvar}
        ano="2026"
        mes="09"
        escolaSimples={escolaSimples}
        solicitacaoMedicaoInicialUuid="solicitacao-uuid"
      />
    </MemoryRouter>,
  );

  return { setComOcorrencias, setErrosAoSalvar };
};

describe("BlocoOcorrencias", () => {
  it("seleciona 'Com ocorrências' quando com_ocorrencias é true", () => {
    renderizar("true");

    expect(
      screen.getByRole("radio", { name: "Com ocorrências" }),
    ).toBeChecked();
    expect(
      screen.getByRole("radio", {
        name: "Serviço prestado sem ocorrências",
      }),
    ).not.toBeChecked();
  });

  it("não seleciona nenhuma opção quando com_ocorrencias é false", () => {
    renderizar("");

    expect(
      screen.getByRole("radio", { name: "Com ocorrências" }),
    ).not.toBeChecked();
    expect(
      screen.getByRole("radio", {
        name: "Serviço prestado sem ocorrências",
      }),
    ).not.toBeChecked();
  });

  it("atualiza a seleção ao escolher uma das opções", () => {
    const { setComOcorrencias } = renderizar("");

    fireEvent.click(
      screen.getByRole("radio", {
        name: "Serviço prestado sem ocorrências",
      }),
    );

    expect(setComOcorrencias).toHaveBeenCalledWith("false");
  });

  it("desabilita os radios quando a avaliação já veio com ocorrências do backend", () => {
    renderizar("true", true);

    expect(
      screen.getByRole("radio", { name: "Com ocorrências" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("radio", {
        name: "Serviço prestado sem ocorrências",
      }),
    ).toBeDisabled();
  });
});
