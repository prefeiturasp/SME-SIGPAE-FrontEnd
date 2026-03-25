import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { MemoryRouter } from "react-router-dom";
import { CODAE } from "src/configs/constants";
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
} from "../dados";

const payload = {
  ...respostaApiCancelamentoporDataTermino(),
  status_solicitacao: "CODAE_NEGOU_PEDIDO",
};

const server = setupServer(
  http.get(`${API_URL}/solicitacoes-dieta-especial/${payload.uuid}/`, () => {
    return HttpResponse.json(payload);
  }),
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
    `${API_URL}/protocolo-padrao-dieta-especial/${payload.protocolo_padrao}/`,
    () => {
      return HttpResponse.json(protocoloPadraoDietaEspecial());
    },
  ),
);

beforeAll(() => server.listen());
beforeEach(() => {
  mock
    .onGet(`/protocolo-padrao-dieta-especial/${payload.protocolo_padrao}/`)
    .reply(200, protocoloPadraoDietaEspecial());
  // Para os testes de ALTERACAO_UE:
  mock
    .onGet(
      `/protocolo-padrao-dieta-especial/e2612937-bbbb-bbbb-bbbb-0f2d85794b50/`,
    )
    .reply(200, protocoloPadraoDietaEspecial());
});
afterEach(() => server.resetHandlers());
afterAll(() => {
  server.close();
  return new Promise((resolve) => setTimeout(resolve, 0));
});

test("Relatorio negadas para inclusão - visão CODADE NUTRI MANIFESTAÇÃO", async () => {
  const search = `?uuid=${payload.uuid}&ehInclusaoContinua=false&card=negadas`;
  window.history.pushState({}, "", search);
  render(
    <MemoryRouter
      initialEntries={[{ pathname: "/", search: search }]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Relatorio visao={CODAE} />
    </MemoryRouter>,
  );
  localStorage.setItem("tipo_perfil", TIPO_PERFIL.NUTRICAO_MANIFESTACAO);

  await waitFor(() => {
    expect(
      screen.getByText(/dieta especial - Negada a Inclusão/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /histórico/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Motivo")).toBeInTheDocument();
    expect(screen.getByText("Justificativa da Negação")).toBeInTheDocument();

    expect(screen.getByText(`Foi negada`)).toBeInTheDocument();
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
    expect(screen.queryByText(/Protocolo Padrão/i)).not.toBeInTheDocument();
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
      screen.getByText(/Identificação do Nutricionista/i),
    ).toBeInTheDocument();

    const textoProtocolo = screen.queryAllByText("Gerar Protocolo");
    expect(textoProtocolo).toHaveLength(0);

    const textoConferencia = screen.queryAllByText("Marcar Conferência");
    expect(textoConferencia).toHaveLength(0);

    const textoEditar = screen.queryAllByText("Editar");
    expect(textoEditar).toHaveLength(0);
  });
});

test("Relatorio negadas para inclusão - visão TERCEIRIZADA ADMINISTRADOR EMPRESA", async () => {
  const search = `?uuid=${payload.uuid}&ehInclusaoContinua=false&card=negadas`;
  window.history.pushState({}, "", search);
  const mockPdfBlob = new Blob(["mocked PDF content"], {
    type: "application/pdf",
  });

  global.URL.createObjectURL = jest.fn(() => "mock-url");

  mock
    .onGet(/\/solicitacoes-dieta-especial\/[^/]+\/protocolo\//)
    .reply(200, mockPdfBlob);

  render(
    <MemoryRouter
      initialEntries={[{ pathname: "/", search: search }]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Relatorio visao={VISAO.TERCEIRIZADA} />
    </MemoryRouter>,
  );
  localStorage.setItem("perfil", PERFIL.ADMINISTRADOR_EMPRESA);

  await waitFor(() => {
    expect(
      screen.getByText(/dieta especial - Negada a Inclusão/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /histórico/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Motivo")).toBeInTheDocument();
    expect(screen.getByText("Justificativa da Negação")).toBeInTheDocument();

    expect(screen.getByText(`Foi negada`)).toBeInTheDocument();
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
    expect(screen.queryByText(/Protocolo Padrão/i)).not.toBeInTheDocument();
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
      screen.getByText(/Identificação do Nutricionista/i),
    ).toBeInTheDocument();

    const textoProtocolo = screen.queryAllByText("Gerar Protocolo");
    expect(textoProtocolo).toHaveLength(0);

    const textoConferencia = screen.getAllByText("Marcar Conferência");
    const buttonMarcarConferencia = textoConferencia[0].closest("button");
    expect(textoConferencia).toHaveLength(1);
    expect(buttonMarcarConferencia).toBeInTheDocument();
    fireEvent.click(buttonMarcarConferencia);

    const textoEditar = screen.queryAllByText("Editar");
    expect(textoEditar).toHaveLength(0);
  });
});

test("Relatorio negadas para inclusão - visão ESCOLA DIRETOR_UE", async () => {
  const search = `?uuid=${payload.uuid}&ehInclusaoContinua=false&card=negadas`;
  window.history.pushState({}, "", search);
  const mockPdfBlob = new Blob(["mocked PDF content"], {
    type: "application/pdf",
  });

  global.URL.createObjectURL = jest.fn(() => "mock-url");

  mock
    .onGet(/\/solicitacoes-dieta-especial\/[^/]+\/protocolo\//)
    .reply(200, mockPdfBlob);

  render(
    <MemoryRouter
      initialEntries={[{ pathname: "/", search: search }]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Relatorio visao={VISAO.ESCOLA} />
    </MemoryRouter>,
  );
  localStorage.setItem("tipo_perfil", PERFIL.DIRETOR_UE);

  await waitFor(() => {
    expect(
      screen.getByText(/dieta especial - Negada a Inclusão/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /histórico/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Motivo")).toBeInTheDocument();
    expect(screen.getByText("Justificativa da Negação")).toBeInTheDocument();

    expect(screen.getByText(`Foi negada`)).toBeInTheDocument();
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
    expect(screen.queryByText(/Protocolo Padrão/i)).not.toBeInTheDocument();
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
      screen.getByText(/Identificação do Nutricionista/i),
    ).toBeInTheDocument();

    const textoProtocolo = screen.queryAllByText("Gerar Protocolo");
    expect(textoProtocolo).toHaveLength(0);

    const textoConferencia = screen.queryAllByText("Marcar Conferência");
    expect(textoConferencia).toHaveLength(0);

    const textoEditar = screen.queryAllByText("Editar");
    expect(textoEditar).toHaveLength(0);
  });
});

test("Relatorio negadas para solicitação de alteração de U.E. - visão CODADE NUTRI MANIFESTAÇÃO", async () => {
  let payload_alteracao = {
    ...payload,
    tipo_solicitacao: "ALTERACAO_UE",
  };
  server.use(
    http.get(`${API_URL}/solicitacoes-dieta-especial/${payload.uuid}/`, () => {
      return HttpResponse.json(payload_alteracao);
    }),
  );

  const search = `?uuid=${payload_alteracao.uuid}&ehInclusaoContinua=false&card=negadas`;
  window.history.pushState({}, "", search);
  render(
    <MemoryRouter
      initialEntries={[{ pathname: "/", search: search }]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Relatorio visao={CODAE} />
    </MemoryRouter>,
  );
  localStorage.setItem("tipo_perfil", TIPO_PERFIL.NUTRICAO_MANIFESTACAO);

  await waitFor(() => {
    expect(
      screen.getByText(/dieta especial - Negada Alteração de UE/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /histórico/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Motivo")).toBeInTheDocument();
    expect(screen.getByText("Justificativa da Negação")).toBeInTheDocument();

    expect(screen.getByText(`Foi negada`)).toBeInTheDocument();
    expect(screen.getByText(/dados do aluno/i)).toBeInTheDocument();
    expect(screen.getByText(/código eol do aluno/i)).toBeInTheDocument();
    expect(screen.getByText(/data de nascimento/i)).toBeInTheDocument();
    expect(screen.getByText(/nome completo do aluno/i)).toBeInTheDocument();
    expect(
      screen.getByText(/dados da escola solicitante/i),
    ).toBeInTheDocument();

    expect(screen.getByText(/Observações/i)).toBeInTheDocument();
    expect(screen.getByText(/Relação por Diagnóstico/i)).toBeInTheDocument();
    expect(screen.getByText(/Classificação da Dieta/i)).toBeInTheDocument();
    expect(screen.getByText(/Protocolo Padrão/i)).toBeInTheDocument();
    expect(screen.getByText(/Orientações Gerais/i)).toBeInTheDocument();
    expect(screen.getByText(/Lista de Substituições/i)).toBeInTheDocument();
    expect(screen.queryByText(/Informações Adicionais/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Identificação do Nutricionista/i),
    ).toBeInTheDocument();

    const textoProtocolo = screen.queryAllByText("Gerar Protocolo");
    expect(textoProtocolo).toHaveLength(0);

    const textoConferencia = screen.queryAllByText("Marcar Conferência");
    expect(textoConferencia).toHaveLength(0);

    const textoEditar = screen.queryAllByText("Editar");
    expect(textoEditar).toHaveLength(0);
  });
});

test("Relatorio negadas para solicitação de alteração de U.E. - visão TERCEIRIZADA ADMINISTRADOR EMPRESA", async () => {
  let payload_alteracao = {
    ...payload,
    tipo_solicitacao: "ALTERACAO_UE",
  };
  server.use(
    http.get(`${API_URL}/solicitacoes-dieta-especial/${payload.uuid}/`, () => {
      return HttpResponse.json(payload_alteracao);
    }),
  );

  const search = `?uuid=${payload_alteracao.uuid}&ehInclusaoContinua=false&card=negadas`;
  window.history.pushState({}, "", search);

  const mockPdfBlob = new Blob(["mocked PDF content"], {
    type: "application/pdf",
  });

  global.URL.createObjectURL = jest.fn(() => "mock-url");

  mock
    .onGet(/\/solicitacoes-dieta-especial\/[^/]+\/protocolo\//)
    .reply(200, mockPdfBlob);

  render(
    <MemoryRouter
      initialEntries={[{ pathname: "/", search: search }]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Relatorio visao={VISAO.TERCEIRIZADA} />
    </MemoryRouter>,
  );
  localStorage.setItem("perfil", PERFIL.ADMINISTRADOR_EMPRESA);

  await waitFor(() => {
    expect(
      screen.getByText(/dieta especial - Negada Alteração de UE/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /histórico/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Motivo")).toBeInTheDocument();
    expect(screen.getByText("Justificativa da Negação")).toBeInTheDocument();

    expect(screen.getByText(`Foi negada`)).toBeInTheDocument();
    expect(screen.getByText(/dados do aluno/i)).toBeInTheDocument();
    expect(screen.getByText(/código eol do aluno/i)).toBeInTheDocument();
    expect(screen.getByText(/data de nascimento/i)).toBeInTheDocument();
    expect(screen.getByText(/nome completo do aluno/i)).toBeInTheDocument();
    expect(
      screen.getByText(/dados da escola solicitante/i),
    ).toBeInTheDocument();

    expect(screen.getByText(/Observações/i)).toBeInTheDocument();
    expect(screen.getByText(/Relação por Diagnóstico/i)).toBeInTheDocument();
    expect(screen.getByText(/Classificação da Dieta/i)).toBeInTheDocument();
    expect(screen.getByText(/Protocolo Padrão/i)).toBeInTheDocument();
    expect(screen.getByText(/Orientações Gerais/i)).toBeInTheDocument();
    expect(screen.getByText(/Lista de Substituições/i)).toBeInTheDocument();
    expect(screen.queryByText(/Informações Adicionais/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Identificação do Nutricionista/i),
    ).toBeInTheDocument();

    const textoProtocolo = screen.queryAllByText("Gerar Protocolo");
    expect(textoProtocolo).toHaveLength(0);

    const textoConferencia = screen.getAllByText("Marcar Conferência");
    const buttonMarcarConferencia = textoConferencia[0].closest("button");
    expect(textoConferencia).toHaveLength(1);
    expect(buttonMarcarConferencia).toBeInTheDocument();
    fireEvent.click(buttonMarcarConferencia);

    const textoEditar = screen.queryAllByText("Editar");
    expect(textoEditar).toHaveLength(0);
  });
});

test("Relatorio negadas para solicitação de alteração de U.E. - visão ESCOLA DIRETOR_UE", async () => {
  let payload_alteracao = {
    ...payload,
    tipo_solicitacao: "ALTERACAO_UE",
  };
  server.use(
    http.get(`${API_URL}/solicitacoes-dieta-especial/${payload.uuid}/`, () => {
      return HttpResponse.json(payload_alteracao);
    }),
  );

  const search = `?uuid=${payload_alteracao.uuid}&ehInclusaoContinua=false&card=negadas`;
  window.history.pushState({}, "", search);

  const mockPdfBlob = new Blob(["mocked PDF content"], {
    type: "application/pdf",
  });

  global.URL.createObjectURL = jest.fn(() => "mock-url");

  mock
    .onGet(/\/solicitacoes-dieta-especial\/[^/]+\/protocolo\//)
    .reply(200, mockPdfBlob);

  render(
    <MemoryRouter
      initialEntries={[{ pathname: "/", search: search }]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Relatorio visao={VISAO.ESCOLA} />
    </MemoryRouter>,
  );
  localStorage.setItem("tipo_perfil", PERFIL.DIRETOR_UE);

  await waitFor(() => {
    expect(screen.getByText(/Protocolo Padrão/i)).toBeInTheDocument();
  });

  await waitFor(() => {
    expect(
      screen.getByText(/dieta especial - Negada Alteração de UE/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /histórico/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Motivo")).toBeInTheDocument();
    expect(screen.getByText("Justificativa da Negação")).toBeInTheDocument();

    expect(screen.getByText(`Foi negada`)).toBeInTheDocument();
    expect(screen.getByText(/dados do aluno/i)).toBeInTheDocument();
    expect(screen.getByText(/código eol do aluno/i)).toBeInTheDocument();
    expect(screen.getByText(/data de nascimento/i)).toBeInTheDocument();
    expect(screen.getByText(/nome completo do aluno/i)).toBeInTheDocument();
    expect(
      screen.getByText(/dados da escola solicitante/i),
    ).toBeInTheDocument();

    expect(screen.getByText(/Observações/i)).toBeInTheDocument();
    expect(screen.getByText(/Relação por Diagnóstico/i)).toBeInTheDocument();
    expect(screen.getByText(/Classificação da Dieta/i)).toBeInTheDocument();
    expect(screen.getByText(/Protocolo Padrão/i)).toBeInTheDocument();
    expect(screen.getByText(/Orientações Gerais/i)).toBeInTheDocument();
    expect(screen.getByText(/Lista de Substituições/i)).toBeInTheDocument();
    expect(screen.queryByText(/Informações Adicionais/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Identificação do Nutricionista/i),
    ).toBeInTheDocument();

    const textoProtocolo = screen.queryAllByText("Gerar Protocolo");
    expect(textoProtocolo).toHaveLength(0);

    const textoConferencia = screen.queryAllByText("Marcar Conferência");
    expect(textoConferencia).toHaveLength(0);

    const textoEditar = screen.queryAllByText("Editar");
    expect(textoEditar).toHaveLength(0);
  });
});
