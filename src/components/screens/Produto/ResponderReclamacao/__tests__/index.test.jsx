import React from "react";
import { act, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import mock from "src/services/_mock";
import { renderWithProvider } from "src/utils/test-utils";
import { ConsultaResponderReclamacaoPage } from "../../../../../pages/Produto";
import { mockGetReclamacaoUnica } from "../../../../../mocks/produto.service/mockGetReclamacoesTerceirizadaPorFiltro";
import {
  PERFIL,
  TIPO_PERFIL,
  TIPO_SERVICO,
} from "../../../../../constants/shared";
import { mockGetNomesProdutosReclamacao } from "../../../../../mocks/produto.service/mockGetResponderReclamacaoNomesProdutos";
import { mockGetNomesMarcasReclamacao } from "../../../../../mocks/produto.service/mockGetResponderReclamacaoNomesMarcas";
import { mockGetNomesFabricantesReclamacao } from "../../../../../mocks/produto.service/mockGetResponderReclamacaoNomesFabricantes";
import { STATUS_RECLAMACAO } from "src/configs/constants";
import Reclamacao from "../Reclamacao";

const setup = async (uuid = null) => {
  if (uuid) {
    const search = `?uuid=${uuid}`;
    window.history.pushState({}, "", search);
  }

  await act(async () => {
    renderWithProvider(
      <MemoryRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <ConsultaResponderReclamacaoPage />
      </MemoryRouter>,
      {
        responderReclamacaoProduto: {},
        finalForm: {},
      },
    );
  });
};

describe("Teste <ResponderReclamacao>", () => {
  beforeEach(async () => {
    localStorage.setItem("perfil", PERFIL.ADMINISTRADOR_EMPRESA);
    localStorage.setItem("tipo_servico", TIPO_SERVICO.TERCEIRIZADA);
    localStorage.setItem("nome_instituicao", "ALIMENTAR");

    mock
      .onGet(`/produtos/filtro-reclamacoes-terceirizada/`)
      .reply(200, mockGetReclamacaoUnica);
    mock
      .onGet(`/produtos/lista-nomes-responder-reclamacao/`)
      .reply(200, mockGetNomesProdutosReclamacao);
    mock
      .onGet(`/marcas/lista-nomes-responder-reclamacao/`)
      .reply(200, mockGetNomesMarcasReclamacao);
    mock
      .onGet(`/fabricantes/lista-nomes-responder-reclamacao/`)
      .reply(200, mockGetNomesFabricantesReclamacao);
  });

  it("Carrega no modo busca", async () => {
    await setup();

    const btnConsultar = screen.getByText("Consultar").closest("button");
    fireEvent.click(btnConsultar);

    await waitFor(() =>
      expect(
        screen.getByText("Veja os resultados para a busca:"),
      ).toBeInTheDocument(),
    );

    const nextButton = screen.getByLabelText("right");
    fireEvent.click(nextButton);

    const btnLimpar = screen.getByText("Limpar Filtro").closest("button");
    fireEvent.click(btnLimpar);

    await waitFor(() =>
      expect(
        screen.getByText("Veja os resultados para a busca:"),
      ).toBeInTheDocument(),
    );
  });

  it("Carrega com parametro de uuid como Terceirizada", async () => {
    await setup(mockGetReclamacaoUnica.results[0].uuid);

    await waitFor(() =>
      expect(
        screen.getByText("Veja os resultados para a busca:"),
      ).toBeInTheDocument(),
    );
    expect(screen.queryByText("Fabricante do Produto")).not.toBeInTheDocument();
    expect(screen.queryByText("Marca do Produto")).not.toBeInTheDocument();
  });

  it("Carrega com parametro de uuid como CODAE", async () => {
    localStorage.setItem(
      "tipo_perfil",
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
    );

    await setup(mockGetReclamacaoUnica.results[0].uuid);

    await waitFor(() =>
      expect(
        screen.getByText("Veja os resultados para a busca:"),
      ).toBeInTheDocument(),
    );
    expect(screen.queryByText("Fabricante do Produto")).not.toBeInTheDocument();
    expect(screen.queryByText("Marca do Produto")).not.toBeInTheDocument();
  });

  describe("Botão Responder", () => {
    const NOME_FANTASIA = "ALIMENTAR";

    const buildReclamacao = (nomeFantasia, status) => ({
      uuid: "test-uuid",
      id_externo: "TESTE",
      status,
      status_titulo: "Aguardando resposta terceirizada",
      reclamante_nome: "Usuário Teste",
      reclamante_registro_funcional: "123456",
      criado_em: "01/01/2024 12:00:00",
      reclamacao: "<p>Reclamação teste</p>",
      logs: [],
      escola: {
        nome: "Escola Teste",
        codigo_eol: "12345",
        lote: {
          terceirizada: {
            nome_fantasia: nomeFantasia,
          },
        },
      },
    });

    const renderReclamacao = (reclamacao) => {
      const props = {
        reclamacao,
        indexProduto: 0,
        setAtivos: jest.fn(),
        produtos: [{}],
        produto: { ultima_homologacao: { uuid: "uuid-mock" } },
        setProdutos: jest.fn(),
        setCarregando: jest.fn(),
      };

      return renderWithProvider(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Reclamacao {...props} />
        </MemoryRouter>,
      );
    };

    it("exibe o botão quando logado como a mesma terceirizada e status Aguardando Resposta", () => {
      localStorage.setItem("nome_instituicao", `"${NOME_FANTASIA}"`);
      localStorage.setItem("tipo_servico", TIPO_SERVICO.TERCEIRIZADA);

      const reclamacao = buildReclamacao(
        NOME_FANTASIA,
        STATUS_RECLAMACAO.AGUARDANDO_RESPOSTA_TERCEIRIZADA,
      );

      renderReclamacao(reclamacao);

      expect(screen.getByText("Responder")).toBeInTheDocument();
    });

    it("não exibe o botão quando logado como terceirizada diferente da reclamação", () => {
      localStorage.setItem("nome_instituicao", '"OUTRA_EMPRESA"');
      localStorage.setItem("tipo_servico", TIPO_SERVICO.TERCEIRIZADA);

      const reclamacao = buildReclamacao(
        NOME_FANTASIA,
        STATUS_RECLAMACAO.AGUARDANDO_RESPOSTA_TERCEIRIZADA,
      );

      renderReclamacao(reclamacao);

      expect(screen.queryByText("Responder")).not.toBeInTheDocument();
    });
  });
});
