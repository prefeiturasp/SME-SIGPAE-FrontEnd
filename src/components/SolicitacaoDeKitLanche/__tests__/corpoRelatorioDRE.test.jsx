import "@testing-library/jest-dom";
import React from "react";
import mock from "src/services/_mock";
import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { TIPO_SOLICITACAO } from "src/services/constants";
import { TIPO_PERFIL } from "../../../constants/shared";
import { CorpoRelatorio } from "src/components/SolicitacaoDeKitLanche/Relatorio/componentes/CorpoRelatorio";
import { mockKitLancheAvulsa } from "src/mocks/SolicitacaokitLanche/mockKitLancheAvulsa";
import { APIMockVersion } from "src/mocks/apiVersionMock";
import { mockMeusDadosDRE } from "src/mocks/meusDados/diretoria_regional";
import { mockMotivosDRENaoValida } from "src/mocks/services/relatorios.service/mockMotivosDRENaoValida";
import * as detalheKitLanche from "src/services/relatorios";
import preview from "jest-preview";

const mockComNegacao = {
  ...mockKitLancheAvulsa,
  logs: [
    ...mockKitLancheAvulsa.logs,
    {
      status_evento_explicacao: "DRE não validou",
      justificativa: "Justificativa de negação teste",
      criado_em: "29/09/2023 14:18:00",
      usuario: {
        registro_funcional: "0000012",
        nome: "Usuário DRE que negou",
      },
    },
  ],
};

const mockComDietaEspecial = {
  ...mockKitLancheAvulsa,
  alunos_com_dieta_especial_participantes: [
    { codigo_eol: "123456", nome: "Aluno Teste 1" },
    { codigo_eol: "789012", nome: "Aluno Teste 2" },
  ],
};

const mockComSolicitacoesimilares = [
  {
    solicitacao_kit_lanche: {
      kits: [
        {
          nome: "KIT 1",
          status: "ATIVO",
        },
      ],
      tempo_passeio_explicacao: "Quatro horas",
      descricao: "<p>LOCAL 3</p>",
      criado_em: "01/08/2023 09:49:54",
      data: "29/08/2023",
    },
    id_externo: "E209F",
    logs: [
      {
        criado_em: "01/08/2023 09:49:54",
      },
      {
        criado_em: "01/08/2023 09:55:48",
      },
      {
        status_evento_explicacao: "CODAE negou",
      },
    ],
    data: "29/08/2023",
    status: "CODAE_NEGOU_PEDIDO",
    local: "LOCAL 3",
    evento: "Evento 4",
    quantidade_alunos: 23,
  },
];

describe("Teste Corpo Relatorio Kit Lanche Passeio - Visão DRE", () => {
  const solicitacaoUuid = mockKitLancheAvulsa.uuid;

  const mockGetDetalheKitLancheAvulso = jest
    .spyOn(detalheKitLanche, "getDetalheKitLancheAvulso")
    .mockImplementation(jest.fn());

  beforeEach(async () => {
    mock
      .onGet(`/solicitacoes-kit-lanche-avulsa/${solicitacaoUuid}/`)
      .reply(200, mockKitLancheAvulsa);

    mock
      .onGet("/downloads/quantidade-nao-vistos/")
      .reply(200, { quantidade_nao_vistos: 170 });

    mock.onGet("/notificacoes/").reply(200, {
      next: null,
      previous: null,
      count: 0,
      page_size: 4,
      results: [],
    });
    mock.onGet("/api-version/").reply(200, APIMockVersion);
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosDRE);

    mock.onGet("/motivos-dre-nao-valida/").reply(200, mockMotivosDRENaoValida);
    mock
      .onGet("/downloads/quantidade-nao-vistos/")
      .reply(200, { quantidade_nao_lidos: 0 });

    window.localStorage.setItem("tipo_perfil", TIPO_PERFIL.DIRETORIA_REGIONAL);

    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <CorpoRelatorio
            solicitacaoKitLanche={mockKitLancheAvulsa}
            solicitacoesSimilares={mockComSolicitacoesimilares}
            prazoDoPedidoMensagem={""}
            tipoSolicitacao={TIPO_SOLICITACAO.SOLICITACAO_NORMAL}
            meusDados={mockMeusDadosDRE}
          />
        </MemoryRouter>
      );
    });
  });

  it("Verifica as informações da Escola", async () => {
    expect(
      screen.getByText(`# ${mockKitLancheAvulsa.id_externo}`)
    ).toBeInTheDocument();
    expect(screen.getByText(/Nº DA SOLICITAÇÃO/i)).toBeInTheDocument();
    expect(screen.getByText(/Escola Solicitante/i)).toBeInTheDocument();
    expect(
      screen.getByText(`${mockKitLancheAvulsa.escola.nome}`)
    ).toBeInTheDocument();
    expect(screen.getByText(/Código EOL/i)).toBeInTheDocument();
    expect(
      screen.getByText(`${mockKitLancheAvulsa.escola.codigo_eol}`)
    ).toBeInTheDocument();
    expect(screen.getAllByText(/DRE/i)).toHaveLength(3);
    expect(
      screen.getByText(`${mockKitLancheAvulsa.escola.diretoria_regional.nome}`)
    ).toBeInTheDocument();
    expect(screen.getByText(/Lote/i)).toBeInTheDocument();
    expect(
      screen.getByText(`${mockKitLancheAvulsa.escola.lote.nome}`)
    ).toBeInTheDocument();
    expect(screen.getByText(/Tipo de Gestão/i)).toBeInTheDocument();
    expect(
      screen.getByText(`${mockKitLancheAvulsa.escola.tipo_gestao.nome}`)
    ).toBeInTheDocument();
    expect(screen.getByText(/Empresa/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        `${mockKitLancheAvulsa.rastro_terceirizada.nome_fantasia}`
      )
    ).toBeInTheDocument();
  });

  it("Verifica as informações da linha do tempo", async () => {
    preview.debug();
    expect(screen.getByText(/Solicitação Realizada/i)).toBeInTheDocument();
    expect(screen.getByText("29/09/2023 11:34:26")).toBeInTheDocument();
    expect(screen.getByText(/RF: 8115257/i)).toBeInTheDocument();
    expect(screen.getByText(/SUPER USUARIO ESCOLA EMEF/i)).toBeInTheDocument();

    expect(screen.getByText(/DRE validou/i)).toBeInTheDocument();
    expect(screen.getByText("29/09/2023 14:16:17")).toBeInTheDocument();
    expect(screen.getByText(/RF: 0000010/i)).toBeInTheDocument();
    expect(screen.getByText(/SUPER USUARIO DRE/i)).toBeInTheDocument();

    expect(screen.getByText(/CODAE autorizou/i)).toBeInTheDocument();
    expect(screen.getByText("29/09/2023 14:17:07")).toBeInTheDocument();
    expect(screen.getByText(/RF: 0000011/i)).toBeInTheDocument();
    expect(
      screen.getByText(/CODAE Gestão de Terceirizadas/i)
    ).toBeInTheDocument();
  });

  it("", async () => {
    mockGetDetalheKitLancheAvulso;
    mockComDietaEspecial;
    mockComNegacao;
  });
});
