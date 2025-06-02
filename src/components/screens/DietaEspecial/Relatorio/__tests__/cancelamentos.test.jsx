import React from "react";

import { rest } from "msw";
import { setupServer } from "msw/node";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CODAE } from "../../../../../configs/constants";
import { TIPO_PERFIL } from "src/constants/shared";
import Relatorio from "../";
import {
  respostaApiCancelamentoporDataTermino,
  alergiasIntolerantes,
  motivosNegacao,
  classificacoesDieta,
  listaProtocolosLiberados,
  alimentos,
  solicitacoesDietaEspecial,
  solicitacoesDietaEspecialDoAluno,
  protocoloPadraoDietaEspecial,
} from "../dados";
import { API_URL } from "src/constants/config";
import { formataJustificativa } from "../helpers";
import mock from "src/services/_mock";

const cancelamento_data_termino = respostaApiCancelamentoporDataTermino();

const server = setupServer(
  rest.get(
    `${API_URL}/solicitacoes-dieta-especial/${cancelamento_data_termino.uuid}/`,
    (req, res, ctx) => {
      return res(ctx.json(cancelamento_data_termino));
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
    `${API_URL}/solicitacoes-dieta-especial/solicitacoes-aluno/7772877/`,
    (req, res, ctx) => {
      return res(ctx.json(solicitacoesDietaEspecialDoAluno()));
    }
  ),
  rest.get(
    `${API_URL}/protocolo-padrao-dieta-especial/${cancelamento_data_termino.protocolo_padrao}/`,
    (req, res, ctx) => {
      return res(ctx.json(protocoloPadraoDietaEspecial()));
    }
  )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("Relatorio para cancelamento por atingir data termino", async () => {
  const search = `?uuid=${cancelamento_data_termino.uuid}&ehInclusaoContinua=false&card=canceladas:`;
  Object.defineProperty(window, "location", {
    value: {
      search: search,
    },
  });
  render(<Relatorio visao={CODAE} />);

  expect(
    await screen.findByText(
      /dieta especial - cancelamento automático por atingir data de término/i
    )
  ).toBeInTheDocument();
  expect(
    await screen.findByRole("button", { name: /histórico/i })
  ).toBeInTheDocument();
  expect(
    await screen.findByText("Justificativa do Cancelamento")
  ).toBeInTheDocument();
  expect(
    await screen.getByText(/justificativa do cancelamento/i)
  ).toBeInTheDocument();
  const justificativa = formataJustificativa(cancelamento_data_termino);
  expect(await screen.getByText(`${justificativa}`)).toBeInTheDocument();
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

  expect(await screen.queryByText("Laudo")).not.toBeInTheDocument();
  expect(await screen.getByText(/Observações/i)).toBeInTheDocument();
});

test("Relatorio para cancelamento para aluno não matriculado na rede", async () => {
  let cancelamento_rede_municipal = cancelamento_data_termino;
  cancelamento_rede_municipal.status_solicitacao =
    "CANCELADO_ALUNO_NAO_PERTENCE_REDE";

  const search = `?uuid=${cancelamento_rede_municipal.uuid}&ehInclusaoContinua=false&card=canceladas:`;
  Object.defineProperty(window, "location", {
    value: {
      search: search,
    },
  });
  render(<Relatorio visao={CODAE} />);

  expect(
    await screen.findByText(
      /dieta especial - Cancelamento para aluno não matriculado na rede municipal/i
    )
  ).toBeInTheDocument();
  expect(
    await screen.findByRole("button", { name: /histórico/i })
  ).toBeInTheDocument();
  expect(
    await screen.findByText("Justificativa do Cancelamento")
  ).toBeInTheDocument();
  expect(
    await screen.getByText(/justificativa do cancelamento/i)
  ).toBeInTheDocument();
  const justificativa = formataJustificativa(cancelamento_rede_municipal);
  expect(justificativa).toEqual(
    "Cancelamento automático para aluno não matriculado na rede municipal."
  );
  expect(await screen.getByText(`${justificativa}`)).toBeInTheDocument();
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

  expect(await screen.queryByText("Laudo")).not.toBeInTheDocument();
  expect(await screen.getByText(/Observações/i)).toBeInTheDocument();

  expect(
    await screen.queryByText(/Período de Vigência/i)
  ).not.toBeInTheDocument();
  expect(await screen.queryByText(/Início/i)).not.toBeInTheDocument();
  expect(await screen.queryByText(/Fim/i)).not.toBeInTheDocument();
});

test("Relatorio para cancelamento quando a escola cancela antes da aprovação pela nutricodae", async () => {
  let cancelamento_escola_antes_aprovacao = cancelamento_data_termino;
  cancelamento_escola_antes_aprovacao.status_solicitacao = "ESCOLA_CANCELOU";
  cancelamento_escola_antes_aprovacao.logs = [
    {
      status_evento_explicacao: "Solicitação Realizada",
      usuario: {
        uuid: "36750ded-5790-433e-b765-0507303828df",
        cpf: null,
        nome: "SUPER USUARIO ESCOLA EMEF",
        email: "escolaemef@admin.com",
        date_joined: "10/07/2020 13:15:23",
        registro_funcional: "8115257",
        tipo_usuario: "escola",
        cargo: "ANALISTA DE SAUDE NIVEL I",
      },
      criado_em: "20/09/2021 16:16:17",
      descricao: "7691509: BENICIO LOPES SANTOS DE ARAUJO",
      justificativa: "",
      resposta_sim_nao: false,
    },
    {
      status_evento_explicacao: "Escola cancelou",
      usuario: {
        uuid: "36750ded-5790-433e-b765-0507303828df",
        cpf: null,
        nome: "SUPER USUARIO ESCOLA EMEF",
        email: "escolaemef@admin.com",
        date_joined: "10/07/2020 13:15:23",
        registro_funcional: "8115257",
        tipo_usuario: "escola",
        cargo: "ANALISTA DE SAUDE NIVEL I",
      },
      criado_em: "14/10/2021 18:23:07",
      descricao: "7691509: BENICIO LOPES SANTOS DE ARAUJO",
      justificativa: "<p>Cancelei</p>",
      resposta_sim_nao: false,
    },
  ];

  const search = `?uuid=${cancelamento_escola_antes_aprovacao.uuid}&ehInclusaoContinua=false&card=canceladas:`;
  Object.defineProperty(window, "location", {
    value: {
      search: search,
    },
  });
  render(<Relatorio visao={CODAE} />);

  expect(
    await screen.findByText(
      /dieta especial - Cancelada pela Unidade Educacional/i
    )
  ).toBeInTheDocument();
  expect(
    await screen.findByRole("button", { name: /histórico/i })
  ).toBeInTheDocument();
  expect(
    await screen.findByText("Justificativa do Cancelamento")
  ).toBeInTheDocument();
  expect(
    await screen.getByText(/justificativa do cancelamento/i)
  ).toBeInTheDocument();
  const justificativa = formataJustificativa(
    cancelamento_escola_antes_aprovacao
  );
  expect(justificativa).toEqual("<p>Cancelei</p>");
  expect(await screen.getByText(`Cancelei`)).toBeInTheDocument();
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
    await screen.queryByText(/Identificação do Nutricionista/i)
  ).not.toBeInTheDocument();
});

test("Relatorio para cancelamento quando a escola cancela após da aprovação pela nutricodae", async () => {
  let cancelamento_escola_apos_aprovacao = cancelamento_data_termino;
  cancelamento_escola_apos_aprovacao.status_solicitacao = "ESCOLA_CANCELOU";
  cancelamento_escola_apos_aprovacao.logs = [
    {
      status_evento_explicacao: "Solicitação Realizada",
      usuario: {
        uuid: "36750ded-5790-433e-b765-0507303828df",
        cpf: null,
        nome: "SUPER USUARIO ESCOLA EMEF",
        email: "escolaemef@admin.com",
        date_joined: "10/07/2020 13:15:23",
        registro_funcional: "8115257",
        tipo_usuario: "escola",
        cargo: "ANALISTA DE SAUDE NIVEL I",
      },
      criado_em: "15/09/2021 18:28:17",
      descricao: "5126330: RYCHARD GABRYEL AMORIM VIANA CONTARINI",
      justificativa: "",
      resposta_sim_nao: false,
    },
    {
      status_evento_explicacao: "CODAE autorizou",
      usuario: {
        uuid: "e445b556-3174-4231-816e-0edefefcc5ae",
        cpf: null,
        nome: "Dieta Especial",
        email: "nutricodae@admin.com",
        date_joined: "10/07/2020 13:15:16",
        registro_funcional: "8107807",
        tipo_usuario: "dieta_especial",
        cargo: "ANALISTA DE SAUDE NIVEL I",
      },
      criado_em: "14/10/2021 18:43:24",
      descricao: "5126330: RYCHARD GABRYEL AMORIM VIANA CONTARINI",
      justificativa: "",
      resposta_sim_nao: false,
    },
    {
      status_evento_explicacao: "Escola solicitou cancelamento",
      usuario: {
        uuid: "36750ded-5790-433e-b765-0507303828df",
        cpf: null,
        nome: "SUPER USUARIO ESCOLA EMEF",
        email: "escolaemef@admin.com",
        date_joined: "10/07/2020 13:15:23",
        registro_funcional: "8115257",
        tipo_usuario: "escola",
        cargo: "ANALISTA DE SAUDE NIVEL I",
      },
      criado_em: "14/10/2021 18:48:47",
      descricao: "5126330: RYCHARD GABRYEL AMORIM VIANA CONTARINI",
      justificativa: "<p>Escola Cancelou após solicitação aprovada</p>\n",
      resposta_sim_nao: false,
    },
    {
      status_evento_explicacao: "Escola cancelou",
      usuario: {
        uuid: "e445b556-3174-4231-816e-0edefefcc5ae",
        cpf: null,
        nome: "Dieta Especial",
        email: "nutricodae@admin.com",
        date_joined: "10/07/2020 13:15:16",
        registro_funcional: "8107807",
        tipo_usuario: "dieta_especial",
        cargo: "ANALISTA DE SAUDE NIVEL I",
      },
      criado_em: "14/10/2021 18:49:38",
      descricao: "5126330: RYCHARD GABRYEL AMORIM VIANA CONTARINI",
      justificativa: "",
      resposta_sim_nao: false,
    },
  ];

  const search = `?uuid=${cancelamento_escola_apos_aprovacao.uuid}&ehInclusaoContinua=false&card=canceladas:`;
  Object.defineProperty(window, "location", {
    value: {
      search: search,
    },
  });
  render(<Relatorio visao={CODAE} />);

  expect(
    await screen.findByText(
      /dieta especial - Cancelada pela Unidade Educacional/i
    )
  ).toBeInTheDocument();
  expect(
    await screen.findByRole("button", { name: /histórico/i })
  ).toBeInTheDocument();
  expect(
    await screen.findByText("Justificativa do Cancelamento")
  ).toBeInTheDocument();
  expect(
    await screen.getByText(/justificativa do cancelamento/i)
  ).toBeInTheDocument();

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
    await screen.queryByText(/Período de Vigência/i)
  ).not.toBeInTheDocument();
  expect(await screen.queryByText(/Início/i)).not.toBeInTheDocument();
  expect(await screen.queryByText(/Fim/i)).not.toBeInTheDocument();
});

test("Verifica botões de Gerar Protocolo - visão Terceirizada", async () => {
  const search = `?uuid=${cancelamento_data_termino.uuid}&ehInclusaoContinua=false&card=canceladas:`;
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

  render(<Relatorio visao={CODAE} />);

  localStorage.setItem("tipo_perfil", TIPO_PERFIL.NUTRICAO_MANIFESTACAO);

  await waitFor(() =>
    expect(screen.getAllByText("Gerar Protocolo")).toHaveLength(2)
  );
  const buttons = screen.getAllByText("Gerar Protocolo");
  const buttonGerarProtocolo = buttons[0].closest("button");
  expect(buttonGerarProtocolo).toBeInTheDocument();

  fireEvent.click(buttonGerarProtocolo);
});
