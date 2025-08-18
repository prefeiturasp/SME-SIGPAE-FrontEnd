import { http, HttpResponse } from "msw";
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
  solicitacoesDietaEspecialDoAluno,
} from "../dados";
import { API_URL } from "src/constants/config";
import mock from "src/services/_mock";
import { VISAO, PERFIL, TIPO_PERFIL } from "src/constants/shared";

const payload = {
  ...respostaApiCancelamentoporDataTermino(),
  status_solicitacao: "CODAE_AUTORIZADO",
  ativo: false,
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
    }
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
    }
  ),
  http.get(
    `${API_URL}/solicitacoes-dieta-especial/solicitacoes-aluno/7772877/`,
    () => {
      return HttpResponse.json(solicitacoesDietaEspecialDoAluno());
    }
  ),
  http.get(`${API_URL}/alunos/7772877/ver-foto/`, () => {
    return HttpResponse(status(204));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => {
  server.close();
  return new Promise((resolve) => setTimeout(resolve, 0));
});

test("Relatório Inativas - visão CODAE NUTRI MANIFESTAÇÃO", async () => {
  const search = `?uuid=${payload.uuid}&ehInclusaoContinua=false&card=inativas`;
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
    expect(screen.getByText(/Dieta especial - Inativa/i)).toBeInTheDocument();
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
    expect(
      screen.getByText(/dados da escola solicitante/i)
    ).toBeInTheDocument();
    expect(screen.getByText("Nome")).toBeInTheDocument();
    expect(screen.getByText("Telefone")).toBeInTheDocument();
    expect(screen.getByText("E-mail")).toBeInTheDocument();
    expect(screen.getByText("DRE")).toBeInTheDocument();
    expect(screen.getByText("Lote")).toBeInTheDocument();
    expect(screen.getByText("Tipo de Gestão")).toBeInTheDocument();

    const textoProtocolo = screen.getAllByText("Gerar Protocolo");
    const buttonGerarProtocolo = textoProtocolo[0].closest("button");
    expect(textoProtocolo).toHaveLength(1);
    expect(buttonGerarProtocolo).toBeInTheDocument();
    fireEvent.click(buttonGerarProtocolo);

    const textoConferencia = screen.queryAllByText("Marcar Conferência");
    expect(textoConferencia).toHaveLength(0);

    const textoEditar = screen.queryAllByText("Editar");
    expect(textoEditar).toHaveLength(0);
  });
});

test("Relatório Inativas - visão TERCEIRIZADA ADMINISTRADOR EMPRESA", async () => {
  const search = `?uuid=${payload.uuid}&ehInclusaoContinua=false&card=inativas`;
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
    expect(screen.getByText(/Dieta especial - Inativa/i)).toBeInTheDocument();
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
    expect(
      screen.getByText(/dados da escola solicitante/i)
    ).toBeInTheDocument();
    expect(screen.getByText("Nome")).toBeInTheDocument();
    expect(screen.getByText("Telefone")).toBeInTheDocument();
    expect(screen.getByText("E-mail")).toBeInTheDocument();
    expect(screen.getByText("DRE")).toBeInTheDocument();
    expect(screen.getByText("Lote")).toBeInTheDocument();
    expect(screen.getByText("Tipo de Gestão")).toBeInTheDocument();

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

    const textoEditar = screen.queryAllByText("Editar");
    expect(textoEditar).toHaveLength(0);
  });
});

test("Relatório Inativas - visão ESCOLA DIRETOR_UE", async () => {
  const search = `?uuid=${payload.uuid}&ehInclusaoContinua=false&card=inativas`;
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

  render(<Relatorio visao={VISAO.ESCOLA} />);
  localStorage.setItem("tipo_perfil", PERFIL.DIRETOR_UE);

  await waitFor(() => {
    expect(screen.getByText(/Dieta especial - Inativa/i)).toBeInTheDocument();
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
    expect(
      screen.getByText(/dados da escola solicitante/i)
    ).toBeInTheDocument();
    expect(screen.getByText("Nome")).toBeInTheDocument();
    expect(screen.getByText("Telefone")).toBeInTheDocument();
    expect(screen.getByText("E-mail")).toBeInTheDocument();
    expect(screen.getByText("DRE")).toBeInTheDocument();
    expect(screen.getByText("Lote")).toBeInTheDocument();
    expect(screen.getByText("Tipo de Gestão")).toBeInTheDocument();

    const textoProtocolo = screen.queryAllByText("Gerar Protocolo");
    expect(textoProtocolo).toHaveLength(0);

    const textoConferencia = screen.queryAllByText("Marcar Conferência");
    expect(textoConferencia).toHaveLength(0);

    const textoEditar = screen.queryAllByText("Editar");
    expect(textoEditar).toHaveLength(0);
  });
});
