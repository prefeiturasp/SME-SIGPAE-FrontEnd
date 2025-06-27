import React from "react";

import { rest } from "msw";
import { setupServer } from "msw/node";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Relatorio from "../";
import {
  respostaApiCancelamentoporDataTermino,
  alergiasIntolerantes,
  motivosNegacao,
  classificacoesDieta,
  listaProtocolosLiberados,
  alimentos,
  solicitacoesDietaEspecial,
  protocoloPadraoDietaEspecial,
} from "../dados";
import { API_URL } from "src/constants/config";
import mock from "src/services/_mock";
import { VISAO, PERFIL } from "src/constants/shared";

const payload = {
  ...respostaApiCancelamentoporDataTermino(),
  status_solicitacao: "CODAE_AUTORIZADO",
  tipo_solicitacao: "ALTERACAO_UE",
};

const server = setupServer(
  rest.get(
    `${API_URL}/solicitacoes-dieta-especial/${payload.uuid}/`,
    (req, res, ctx) => {
      return res(ctx.json(payload));
    }
  ),
  rest.get(`${API_URL}/motivos-negacao/`, (req, res, ctx) => {
    return res(ctx.json(motivosNegacao()));
  }),
  rest.get(`${API_URL}/alergias-intolerancias/`, (req, res, ctx) => {
    return res(ctx.json(alergiasIntolerantes()));
  }),
  rest.get(`${API_URL}/classificacoes-dieta/`, (req, res, ctx) => {
    return res(ctx.json(classificacoesDieta()));
  }),
  rest.get(
    `${API_URL}/protocolo-padrao-dieta-especial/lista-protocolos-liberados/`,
    (req, res, ctx) => {
      return res(ctx.json(listaProtocolosLiberados()));
    }
  ),
  rest.get(`${API_URL}/alimentos/`, (req, res, ctx) => {
    return res(ctx.json(alimentos()));
  }),
  rest.get(`${API_URL}/solicitacoes-dieta-especial/`, (req, res, ctx) => {
    return res(ctx.json(solicitacoesDietaEspecial()));
  }),
  rest.get(
    `${API_URL}/protocolo-padrao-dieta-especial/${payload.protocolo_padrao}/`,
    (req, res, ctx) => {
      return res(ctx.json(protocoloPadraoDietaEspecial()));
    }
  )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("Relatório Aguardando Vigência -  visão Terceirizada", async () => {
  const search = `?uuid=${payload.uuid}&ehInclusaoContinua=false&card=aguardando-inicio-vigencia`;
  Object.defineProperty(window, "location", {
    value: {
      search: search,
    },
  });

  const mockPdfBlob = new Blob(["mocked PDF content"], {
    type: "application/pdf",
  });
  global.URL.createObjectURL = jest.fn(() => "mock-url");
  mock
    .onGet(/\/solicitacoes-dieta-especial\/[^/]+\/protocolo\//)
    .reply(200, mockPdfBlob);

  render(<Relatorio visao={VISAO.TERCEIRIZADA} />);
  localStorage.setItem("tipo_perfil", PERFIL.ADMINISTRADOR_EMPRESA);
  await waitFor(() => {
    expect(
      screen.getByText(/dieta especial - Autorizada/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /histórico/i })
    ).toBeInTheDocument();
    expect(screen.queryByText("Motivo")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Justificativa da Negação")
    ).not.toBeInTheDocument();

    expect(screen.getByText(/dados do aluno/i)).toBeInTheDocument();
    expect(screen.getByText(/código eol do aluno/i)).toBeInTheDocument();
    expect(screen.getByText(/data de nascimento/i)).toBeInTheDocument();
    expect(screen.getByText(/nome completo do aluno/i)).toBeInTheDocument();
    expect(screen.getByText(/Dados da Escola de Destino/i)).toBeInTheDocument();
    expect(
      screen.getByText(/dados da escola solicitante/i)
    ).toBeInTheDocument();

    expect(screen.getAllByText("Nome")).toHaveLength(2);
    expect(screen.getAllByText("Telefone")).toHaveLength(2);
    expect(screen.getAllByText("E-mail")).toHaveLength(2);
    expect(screen.getAllByText("DRE")).toHaveLength(2);
    expect(screen.getAllByText("Lote")).toHaveLength(2);
    expect(screen.getAllByText("Tipo de Gestão")).toHaveLength(2);

    expect(screen.getByText(/Observações/i)).toBeInTheDocument();

    const textoProtocolo = screen.getAllByText("Gerar Protocolo");
    const buttonGerarProtocolo = textoProtocolo[0].closest("button");
    expect(textoProtocolo).toHaveLength(1);
    expect(buttonGerarProtocolo).toBeInTheDocument();
    fireEvent.click(buttonGerarProtocolo);

    const textoConferencia = screen.getAllByText("Marcar Conferência");
    const buttonMarcarConferencia = textoConferencia[0].closest("button");
    expect(textoConferencia).toHaveLength(1);
    expect(buttonMarcarConferencia).toBeInTheDocument();
    fireEvent.click(buttonMarcarConferencia);
  });
});
