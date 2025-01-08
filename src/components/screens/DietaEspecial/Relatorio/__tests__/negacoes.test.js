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
import { API_URL } from "constants/config";

const payload = {
  ...respostaApiCancelamentoporDataTermino(),
  status_solicitacao: "CODAE_NEGOU_PEDIDO",
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

test("Relatorio negadas para inclusão", async () => {
  const search = `?uuid=${payload.uuid}&ehInclusaoContinua=false&card=negadas:`;
  Object.defineProperty(window, "location", {
    value: {
      search: search,
    },
  });
  render(<Relatorio visao={CODAE} />);

  expect(
    await screen.findByText(/dieta especial - Negada a Inclusão/i)
  ).toBeInTheDocument();
  expect(
    await screen.findByRole("button", { name: /histórico/i })
  ).toBeInTheDocument();
  expect(await screen.findByText("Motivo")).toBeInTheDocument();
  expect(
    await screen.findByText("Justificativa da Negação")
  ).toBeInTheDocument();

  expect(await screen.getByText(`Foi negada`)).toBeInTheDocument();
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
  expect(
    await screen.queryByText(/Relação por Diagnóstico/i)
  ).not.toBeInTheDocument();
  expect(
    await screen.queryByText(/Classificação da Dieta/i)
  ).not.toBeInTheDocument();
  expect(
    await screen.queryByText(/Nome do Protocolo Padrão de Dieta Especial/i)
  ).not.toBeInTheDocument();
  expect(
    await screen.queryByText(/Orientações Gerais/i)
  ).not.toBeInTheDocument();
  expect(
    await screen.queryByText(/Lista de Substituições/i)
  ).not.toBeInTheDocument();
  expect(
    await screen.queryByText(/Período de Vigência/i)
  ).not.toBeInTheDocument();
  expect(await screen.queryByText(/Início/i)).not.toBeInTheDocument();
  expect(await screen.queryByText(/Fim/i)).not.toBeInTheDocument();
  expect(
    await screen.queryByText(/Informações Adicionais/i)
  ).not.toBeInTheDocument();
  expect(
    await screen.getByText(/Identificação do Nutricionista/i)
  ).toBeInTheDocument();
});

test("Relatorio negadas para solicitação de alteração de U.E.", async () => {
  let payload_alteracao = payload;
  payload_alteracao.tipo_solicitacao = "ALTERACAO_UE";

  const search = `?uuid=${payload_alteracao.uuid}&ehInclusaoContinua=false&card=negadas:`;
  Object.defineProperty(window, "location", {
    value: {
      search: search,
    },
  });
  render(<Relatorio visao={CODAE} />);

  expect(
    await screen.findByText(/dieta especial - Negada Alteração de UE/i)
  ).toBeInTheDocument();
  expect(
    await screen.findByRole("button", { name: /histórico/i })
  ).toBeInTheDocument();
  expect(await screen.findByText("Motivo")).toBeInTheDocument();
  expect(
    await screen.findByText("Justificativa da Negação")
  ).toBeInTheDocument();

  expect(await screen.getByText(`Foi negada`)).toBeInTheDocument();
  expect(await screen.getByText(/dados do aluno/i)).toBeInTheDocument();
  expect(await screen.getByText(/código eol do aluno/i)).toBeInTheDocument();
  expect(await screen.getByText(/data de nascimento/i)).toBeInTheDocument();
  expect(await screen.getByText(/nome completo do aluno/i)).toBeInTheDocument();
  expect(
    await screen.getByText(/dados da escola solicitante/i)
  ).toBeInTheDocument();

  expect(await screen.getByText(/Observações/i)).toBeInTheDocument();
  expect(
    await screen.getByText(/Relação por Diagnóstico/i)
  ).toBeInTheDocument();
  expect(await screen.getByText(/Classificação da Dieta/i)).toBeInTheDocument();
  expect(
    await screen.getByText(/Nome do Protocolo Padrão de Dieta Especial/i)
  ).toBeInTheDocument();
  expect(await screen.getByText(/Orientações Gerais/i)).toBeInTheDocument();
  expect(await screen.getByText(/Lista de Substituições/i)).toBeInTheDocument();
  expect(
    await screen.queryByText(/Informações Adicionais/i)
  ).toBeInTheDocument();
  expect(
    await screen.getByText(/Identificação do Nutricionista/i)
  ).toBeInTheDocument();
});
