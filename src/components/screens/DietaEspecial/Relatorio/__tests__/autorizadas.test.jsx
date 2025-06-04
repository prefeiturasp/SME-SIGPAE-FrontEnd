import React from "react";

import { rest } from "msw";
import { setupServer } from "msw/node";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CODAE } from "../../../../../configs/constants";
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

const payload = {
  ...respostaApiCancelamentoporDataTermino(),
  status_solicitacao: "CODAE_AUTORIZADO",
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

test("Relatorio autorizadas temporariamente", async () => {
  const search = `?uuid=${payload.uuid}&ehInclusaoContinua=false&card=autorizadas-temp`;
  Object.defineProperty(window, "location", {
    value: {
      search: search,
    },
  });
  render(<Relatorio visao={CODAE} />);

  expect(
    await screen.findByText(/dieta especial - Autorizada Temporariamente/i)
  ).toBeInTheDocument();
  expect(
    await screen.findByRole("button", { name: /histórico/i })
  ).toBeInTheDocument();
  expect(await screen.queryByText("Motivo")).not.toBeInTheDocument();
  expect(
    await screen.queryByText("Justificativa da Negação")
  ).not.toBeInTheDocument();

  expect(await screen.getByText(/dados do aluno/i)).toBeInTheDocument();
  expect(await screen.getByText(/código eol do aluno/i)).toBeInTheDocument();
  expect(await screen.getByText(/data de nascimento/i)).toBeInTheDocument();
  expect(await screen.getByText(/nome completo do aluno/i)).toBeInTheDocument();
  expect(
    await screen.getByText(/dados da escola solicitante/i)
  ).toBeInTheDocument();
  expect(await screen.getByText("Nome")).toBeInTheDocument();
  expect(await screen.getByText("Telefone")).toBeInTheDocument();
  expect(await screen.getByText("E-mail")).toBeInTheDocument();
  expect(await screen.getByText("DRE")).toBeInTheDocument();
  expect(await screen.getByText("Lote")).toBeInTheDocument();
  expect(await screen.getByText("Tipo de Gestão")).toBeInTheDocument();

  expect(await screen.getByText(/Observações/i)).toBeInTheDocument();
});
