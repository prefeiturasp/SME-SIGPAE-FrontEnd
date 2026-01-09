import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { API_URL } from "src/constants/config";
import { PERFIL, TIPO_PERFIL, VISAO } from "src/constants/shared";
import mock from "src/services/_mock";
import Relatorio from "../";
import {
  alergiasIntolerantes,
  alimentos,
  classificacoesDieta,
  listaProtocolosLiberados,
  motivosNegacao,
  protocoloPadraoDietaEspecial,
  respostaApiCancelamentoporDataTermino,
  solicitacoesDietaEspecial,
  solicitacoesDietaEspecialDoAluno,
} from "../dados";
import { formataJustificativa } from "../helpers";

const cancelamento_data_termino = respostaApiCancelamentoporDataTermino();
const logsAposAprovacao = [
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

const logsAntesAprovacao = [
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

const server = setupServer(
  http.get(
    `${API_URL}/solicitacoes-dieta-especial/${cancelamento_data_termino.uuid}/`,
    () => {
      return HttpResponse.json(cancelamento_data_termino);
    },
  ),
  http.get(`${API_URL}/motivos-negacao/`, () => {
    return HttpResponse.json(motivosNegacao());
  }),
  http.get(`${API_URL}/alergias-intolerancias/`, () => {
    return HttpResponse.json(alergiasIntolerantes());
  }),
  http.get(`${API_URL}/classificacoes-dieta/`, () => {
    return HttpResponse.json(classificacoesDieta());
  }),
  http.get(
    `${API_URL}/protocolo-padrao-dieta-especial/lista-protocolos-liberados/`,
    () => {
      return HttpResponse.json(listaProtocolosLiberados());
    },
  ),
  http.get(`${API_URL}/alimentos/`, () => {
    return HttpResponse.json(alimentos());
  }),
  http.get(`${API_URL}/solicitacoes-dieta-especial/`, () => {
    return HttpResponse.json(solicitacoesDietaEspecial());
  }),
  http.get(
    `${API_URL}/solicitacoes-dieta-especial/solicitacoes-aluno/7772877/`,
    () => {
      return HttpResponse.json(solicitacoesDietaEspecialDoAluno());
    },
  ),
  http.get(
    `${API_URL}/protocolo-padrao-dieta-especial/${cancelamento_data_termino.protocolo_padrao}/`,
    () => {
      return HttpResponse.json(protocoloPadraoDietaEspecial());
    },
  ),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => {
  server.close();
  return new Promise((resolve) => setTimeout(resolve, 0));
});

test("Relatorio para cancelamento por atingir data termino - visão CODAE", async () => {
  const search = `?uuid=${cancelamento_data_termino.uuid}&ehInclusaoContinua=false&card=canceladas`;
  Object.defineProperty(window, "location", {
    value: {
      search: search,
    },
  });
  render(<Relatorio visao={VISAO.CODAE} />);

  await waitFor(() => {
    expect(
      screen.getByText(
        /dieta especial - cancelamento automático por atingir data de término/i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /histórico/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Justificativa do Cancelamento"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/justificativa do cancelamento/i),
    ).toBeInTheDocument();
    const justificativa = formataJustificativa(cancelamento_data_termino);
    expect(screen.getByText(`${justificativa}`)).toBeInTheDocument();
    expect(screen.getByText(/dados do aluno/i)).toBeInTheDocument();
    expect(screen.getByText(/código eol do aluno/i)).toBeInTheDocument();

    expect(screen.getByText(/data de nascimento/i)).toBeInTheDocument();
    expect(screen.getByText(/nome completo do aluno/i)).toBeInTheDocument();
    expect(
      screen.getByText(/dados da escola solicitante/i),
    ).toBeInTheDocument();
    expect(screen.getByText("Nome")).toBeInTheDocument();
    expect(screen.getByText("Telefone")).toBeInTheDocument();
    expect(screen.getByText("E-mail")).toBeInTheDocument();
    expect(screen.getByText("DRE")).toBeInTheDocument();
    expect(screen.getByText("Lote")).toBeInTheDocument();
    expect(screen.getByText("Tipo de Gestão")).toBeInTheDocument();

    expect(screen.queryByText("Laudo")).not.toBeInTheDocument();
    expect(screen.getByText(/Observações/i)).toBeInTheDocument();

    const textoProtocolo = screen.queryAllByText("Gerar Protocolo");
    expect(textoProtocolo).toHaveLength(0);

    const textoConferencia = screen.queryAllByText("Marcar Conferência");
    expect(textoConferencia).toHaveLength(0);

    const textoEditar = screen.queryAllByText("Editar");
    expect(textoEditar).toHaveLength(0);
  });
});

test("Relatorio para cancelamento para aluno não matriculado na rede - visão CODAE", async () => {
  let cancelamento_rede_municipal = cancelamento_data_termino;
  cancelamento_rede_municipal.status_solicitacao =
    "CANCELADO_ALUNO_NAO_PERTENCE_REDE";

  const search = `?uuid=${cancelamento_rede_municipal.uuid}&ehInclusaoContinua=false&card=canceladas`;
  Object.defineProperty(window, "location", {
    value: {
      search: search,
    },
  });
  render(<Relatorio visao={VISAO.CODAE} />);

  await waitFor(() => {
    expect(
      screen.getByText(
        /dieta especial - Cancelamento para aluno não matriculado na rede municipal/i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /histórico/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Justificativa do Cancelamento"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/justificativa do cancelamento/i),
    ).toBeInTheDocument();
    const justificativa = formataJustificativa(cancelamento_rede_municipal);
    expect(justificativa).toEqual(
      "Cancelamento automático para aluno não matriculado na rede municipal.",
    );
    expect(screen.getByText(`${justificativa}`)).toBeInTheDocument();
    expect(screen.getByText(/dados do aluno/i)).toBeInTheDocument();
    expect(screen.getByText(/código eol do aluno/i)).toBeInTheDocument();

    expect(screen.getByText(/data de nascimento/i)).toBeInTheDocument();
    expect(screen.getByText(/nome completo do aluno/i)).toBeInTheDocument();
    expect(
      screen.getByText(/dados da escola solicitante/i),
    ).toBeInTheDocument();
    expect(screen.getByText("Nome")).toBeInTheDocument();
    expect(screen.getByText("Telefone")).toBeInTheDocument();
    expect(screen.getByText("E-mail")).toBeInTheDocument();
    expect(screen.getByText("DRE")).toBeInTheDocument();
    expect(screen.getByText("Lote")).toBeInTheDocument();
    expect(screen.getByText("Tipo de Gestão")).toBeInTheDocument();

    expect(screen.queryByText("Laudo")).not.toBeInTheDocument();
    expect(screen.getByText(/Observações/i)).toBeInTheDocument();

    expect(screen.queryByText(/Período de Vigência/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Início/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Fim/i)).not.toBeInTheDocument();

    const textoProtocolo = screen.queryAllByText("Gerar Protocolo");
    expect(textoProtocolo).toHaveLength(0);

    const textoConferencia = screen.queryAllByText("Marcar Conferência");
    expect(textoConferencia).toHaveLength(0);

    const textoEditar = screen.queryAllByText("Editar");
    expect(textoEditar).toHaveLength(0);
  });
});

test("Relatorio para cancelamento quando a escola cancela antes da aprovação pela nutricodae - visão CODAE", async () => {
  let cancelamentoEscolaAntesAprovacao = cancelamento_data_termino;
  cancelamentoEscolaAntesAprovacao.status_solicitacao = "ESCOLA_CANCELOU";
  cancelamentoEscolaAntesAprovacao.logs = logsAntesAprovacao;

  const search = `?uuid=${cancelamentoEscolaAntesAprovacao.uuid}&ehInclusaoContinua=false&card=canceladas`;
  Object.defineProperty(window, "location", {
    value: {
      search: search,
    },
  });
  render(<Relatorio visao={VISAO.CODAE} />);

  await waitFor(() => {
    expect(
      screen.getByText(/dieta especial - Cancelada pela Unidade Educacional/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /histórico/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Justificativa do Cancelamento"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/justificativa do cancelamento/i),
    ).toBeInTheDocument();
    const justificativa = formataJustificativa(
      cancelamentoEscolaAntesAprovacao,
    );
    expect(justificativa).toEqual("<p>Cancelei</p>");
    expect(screen.getByText(`Cancelei`)).toBeInTheDocument();
    expect(screen.getByText(/dados do aluno/i)).toBeInTheDocument();
    expect(screen.getByText(/código eol do aluno/i)).toBeInTheDocument();

    expect(screen.getByText(/data de nascimento/i)).toBeInTheDocument();
    expect(screen.getByText(/nome completo do aluno/i)).toBeInTheDocument();
    expect(
      screen.getByText(/dados da escola solicitante/i),
    ).toBeInTheDocument();
    expect(screen.getByText("Nome")).toBeInTheDocument();
    expect(screen.getByText("Telefone")).toBeInTheDocument();
    expect(screen.getByText("E-mail")).toBeInTheDocument();
    expect(screen.getByText("DRE")).toBeInTheDocument();
    expect(screen.getByText("Lote")).toBeInTheDocument();
    expect(screen.getByText("Tipo de Gestão")).toBeInTheDocument();

    expect(screen.getByText(/Observações/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/Relação por Diagnóstico/i),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Classificação da Dieta/i),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Nome do Protocolo Padrão de Dieta Especial/i),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/Orientações Gerais/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Lista de Substituições/i),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/Período de Vigência/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Início/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Fim/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Informações Adicionais/i),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Identificação do Nutricionista/i),
    ).not.toBeInTheDocument();

    const textoProtocolo = screen.queryAllByText("Gerar Protocolo");
    expect(textoProtocolo).toHaveLength(0);

    const textoConferencia = screen.queryAllByText("Marcar Conferência");
    expect(textoConferencia).toHaveLength(0);

    const textoEditar = screen.queryAllByText("Editar");
    expect(textoEditar).toHaveLength(0);
  });
});

test("Relatorio para cancelamento quando a escola cancela após da aprovação pela nutricodae - visão CODAE COORDENADOR DIETA ESPECIAL", async () => {
  let cancelamento_escola_apos_aprovacao = cancelamento_data_termino;
  cancelamento_escola_apos_aprovacao.status_solicitacao = "ESCOLA_CANCELOU";
  cancelamento_escola_apos_aprovacao.logs = logsAposAprovacao;

  const search = `?uuid=${cancelamento_escola_apos_aprovacao.uuid}&ehInclusaoContinua=false&card=canceladas`;
  Object.defineProperty(window, "location", {
    value: {
      search: search,
    },
  });
  render(<Relatorio visao={VISAO.CODAE} />);
  localStorage.setItem("perfil", PERFIL.COORDENADOR_DIETA_ESPECIAL);

  await waitFor(() => {
    expect(
      screen.getByText(/dieta especial - Cancelada pela Unidade Educacional/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /histórico/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Justificativa do Cancelamento"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/justificativa do cancelamento/i),
    ).toBeInTheDocument();

    expect(screen.getByText(/dados do aluno/i)).toBeInTheDocument();
    expect(screen.getByText(/código eol do aluno/i)).toBeInTheDocument();

    expect(screen.getByText(/data de nascimento/i)).toBeInTheDocument();
    expect(screen.getByText(/nome completo do aluno/i)).toBeInTheDocument();
    expect(
      screen.getByText(/dados da escola solicitante/i),
    ).toBeInTheDocument();
    expect(screen.getByText("Nome")).toBeInTheDocument();
    expect(screen.getByText("Telefone")).toBeInTheDocument();
    expect(screen.getByText("E-mail")).toBeInTheDocument();
    expect(screen.getByText("DRE")).toBeInTheDocument();
    expect(screen.getByText("Lote")).toBeInTheDocument();
    expect(screen.getByText("Tipo de Gestão")).toBeInTheDocument();

    expect(screen.getByText(/Observações/i)).toBeInTheDocument();
    expect(screen.queryByText(/Período de Vigência/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Início/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Fim/i)).not.toBeInTheDocument();

    const textoProtocolo = screen.queryAllByText("Gerar Protocolo");
    expect(textoProtocolo).toHaveLength(2);

    const textoConferencia = screen.queryAllByText("Marcar Conferência");
    expect(textoConferencia).toHaveLength(0);

    const textoEditar = screen.queryAllByText("Editar");
    expect(textoEditar).toHaveLength(0);
  });
});

test("Relatorio para cancelamento quando a escola cancela após da aprovação pela nutricodae - visão CODAE NUTRI MANIFESTAÇÃO", async () => {
  let cancelamento_escola_apos_aprovacao = cancelamento_data_termino;
  cancelamento_escola_apos_aprovacao.status_solicitacao = "ESCOLA_CANCELOU";
  cancelamento_escola_apos_aprovacao.logs = logsAposAprovacao;

  const search = `?uuid=${cancelamento_escola_apos_aprovacao.uuid}&ehInclusaoContinua=false&card=canceladas`;
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

  render(<Relatorio visao={VISAO.CODAE} />);
  localStorage.setItem("tipo_perfil", TIPO_PERFIL.NUTRICAO_MANIFESTACAO);

  await waitFor(() => {
    expect(
      screen.getByText(/dieta especial - Cancelada pela Unidade Educacional/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /histórico/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Justificativa do Cancelamento"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/justificativa do cancelamento/i),
    ).toBeInTheDocument();

    expect(screen.getByText(/dados do aluno/i)).toBeInTheDocument();
    expect(screen.getByText(/código eol do aluno/i)).toBeInTheDocument();

    expect(screen.getByText(/data de nascimento/i)).toBeInTheDocument();
    expect(screen.getByText(/nome completo do aluno/i)).toBeInTheDocument();
    expect(
      screen.getByText(/dados da escola solicitante/i),
    ).toBeInTheDocument();
    expect(screen.getByText("Nome")).toBeInTheDocument();
    expect(screen.getByText("Telefone")).toBeInTheDocument();
    expect(screen.getByText("E-mail")).toBeInTheDocument();
    expect(screen.getByText("DRE")).toBeInTheDocument();
    expect(screen.getByText("Lote")).toBeInTheDocument();
    expect(screen.getByText("Tipo de Gestão")).toBeInTheDocument();

    expect(screen.getByText(/Observações/i)).toBeInTheDocument();
    expect(screen.queryByText(/Período de Vigência/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Início/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Fim/i)).not.toBeInTheDocument();

    const textoProtocolo = screen.getAllByText("Gerar Protocolo");
    const buttonGerarProtocolo = textoProtocolo[0].closest("button");
    expect(textoProtocolo).toHaveLength(2);
    expect(buttonGerarProtocolo).toBeInTheDocument();
    fireEvent.click(buttonGerarProtocolo);

    const textoConferencia = screen.queryAllByText("Marcar Conferência");
    expect(textoConferencia).toHaveLength(0);

    const textoEditar = screen.queryAllByText("Editar");
    expect(textoEditar).toHaveLength(0);
  });
});

test("Relatorio para cancelamento quando a escola cancela após da aprovação pela nutricodae - visão TERCEIRIZADA", async () => {
  let cancelamento_escola_apos_aprovacao = cancelamento_data_termino;
  cancelamento_escola_apos_aprovacao.status_solicitacao = "ESCOLA_CANCELOU";
  cancelamento_escola_apos_aprovacao.logs = logsAposAprovacao;

  const search = `?uuid=${cancelamento_escola_apos_aprovacao.uuid}&ehInclusaoContinua=false&card=canceladas`;
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
  localStorage.setItem("perfil", PERFIL.ADMINISTRADOR_EMPRESA);

  await waitFor(() => {
    expect(
      screen.getByText(/dieta especial - Cancelada pela Unidade Educacional/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /histórico/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Justificativa do Cancelamento"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/justificativa do cancelamento/i),
    ).toBeInTheDocument();

    expect(screen.getByText(/dados do aluno/i)).toBeInTheDocument();
    expect(screen.getByText(/código eol do aluno/i)).toBeInTheDocument();

    expect(screen.getByText(/data de nascimento/i)).toBeInTheDocument();
    expect(screen.getByText(/nome completo do aluno/i)).toBeInTheDocument();
    expect(
      screen.getByText(/dados da escola solicitante/i),
    ).toBeInTheDocument();
    expect(screen.getByText("Nome")).toBeInTheDocument();
    expect(screen.getByText("Telefone")).toBeInTheDocument();
    expect(screen.getByText("E-mail")).toBeInTheDocument();
    expect(screen.getByText("DRE")).toBeInTheDocument();
    expect(screen.getByText("Lote")).toBeInTheDocument();
    expect(screen.getByText("Tipo de Gestão")).toBeInTheDocument();

    expect(screen.getByText(/Observações/i)).toBeInTheDocument();
    expect(screen.queryByText(/Período de Vigência/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Início/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Fim/i)).not.toBeInTheDocument();

    const textoProtocolo = screen.getAllByText("Gerar Protocolo");
    const buttonGerarProtocolo = textoProtocolo[0].closest("button");
    expect(textoProtocolo).toHaveLength(2);
    expect(buttonGerarProtocolo).toBeInTheDocument();
    fireEvent.click(buttonGerarProtocolo);

    const textoConferencia = screen.getAllByText("Marcar Conferência");
    const buttonMarcarConferencia = textoConferencia[0].closest("button");
    expect(textoConferencia).toHaveLength(1);
    expect(buttonMarcarConferencia).toBeInTheDocument();
    fireEvent.click(buttonMarcarConferencia);

    const textoEditar = screen.queryAllByText("Editar");
    expect(textoEditar).toHaveLength(0);
  });
});
