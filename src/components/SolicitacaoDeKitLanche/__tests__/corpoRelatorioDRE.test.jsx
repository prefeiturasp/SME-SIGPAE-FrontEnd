import "@testing-library/jest-dom";
import React from "react";
import mock from "src/services/_mock";
import { act, render, fireEvent, screen } from "@testing-library/react";
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

  it("Verifica as informações de solicitaçoes similares ao clicar no toggle", async () => {
    expect(screen.getByText(/Solicitação Similar:/i)).toBeInTheDocument();
    const spanToggleExpandirSolicitacaoSimilar = screen.getByTestId(
      "colapse-solicitacao-similares"
    );
    fireEvent.click(spanToggleExpandirSolicitacaoSimilar);

    expect(screen.getAllByText("#E209F")).toHaveLength(2);
    expect(screen.getByText(/Solicitação Número:/i)).toBeInTheDocument();
    expect(screen.getByText(/Data da Inclusão:/i)).toBeInTheDocument();
    expect(screen.getByText("01/08/2023")).toBeInTheDocument();
    expect(screen.getByText(/Status da Solicitação:/i)).toBeInTheDocument();
    expect(screen.getByText(/CODAE negou/i)).toBeInTheDocument();

    expect(screen.getAllByText(/Data do evento/i)).toHaveLength(2);
    expect(
      screen.getByText(
        `${mockComSolicitacoesimilares[0].solicitacao_kit_lanche.data}`
      )
    ).toBeInTheDocument();
    expect(screen.getAllByText(/Local do passeio/i)).toHaveLength(2);
    expect(
      screen.getAllByText(`${mockComSolicitacoesimilares[0].local}`)
    ).toHaveLength(2);
    expect(screen.getAllByText("Evento/Atividade")).toHaveLength(1);
    expect(
      screen.getAllByText(`${mockComSolicitacoesimilares[0].evento}`)
    ).toHaveLength(1);
    expect(screen.getAllByText(/Nº de Alunos/i)).toHaveLength(2);
    expect(
      screen.getAllByText(`${mockComSolicitacoesimilares[0].quantidade_alunos}`)
    ).toHaveLength(2);
    expect(screen.getAllByText(/Tempo Previsto de Passeio/i)).toHaveLength(2);
    expect(
      screen.getAllByText(
        `${mockComSolicitacoesimilares[0].solicitacao_kit_lanche.tempo_passeio_explicacao}`
      )
    ).toHaveLength(2);
    expect(screen.getAllByText(/Opção Desejada/i)).toHaveLength(2);
    expect(screen.getAllByText(/KIT 1/)).toHaveLength(2);
    expect(screen.getAllByText(/Nº Total de Kits/i)).toHaveLength(2);

    fireEvent.click(spanToggleExpandirSolicitacaoSimilar);
  });

  it("Verifica as informações do passeio", async () => {
    expect(screen.getAllByText(/Data do evento/i)).toHaveLength(2);
    expect(
      screen.getByText(`${mockKitLancheAvulsa.solicitacao_kit_lanche.data}`)
    ).toBeInTheDocument();
    expect(screen.getAllByText(/Local do passeio/i)).toHaveLength(2);
    expect(
      screen.getByText(`${mockKitLancheAvulsa.local}`)
    ).toBeInTheDocument();
    expect(screen.getAllByText("Evento/Atividade")).toHaveLength(1);
    expect(screen.getAllByText(`${mockKitLancheAvulsa.evento}`)).toHaveLength(
      1
    );
    expect(screen.getAllByText(/Nº de Alunos/i)).toHaveLength(2);
    expect(
      screen.getAllByText(`${mockKitLancheAvulsa.quantidade_alunos}`)
    ).toHaveLength(2);
    expect(screen.getAllByText(/Tempo Previsto de Passeio/i)).toHaveLength(2);
    expect(
      screen.getAllByText(
        `${mockKitLancheAvulsa.solicitacao_kit_lanche.tempo_passeio_explicacao}`
      )
    ).toHaveLength(2);
    expect(screen.getAllByText(/Opção Desejada/i)).toHaveLength(2);
    expect(screen.getAllByText(/KIT 1/)).toHaveLength(2);
    expect(screen.getAllByText(/Nº Total de Kits/i)).toHaveLength(2);
  });

  it("Verifica as informações adicionais", async () => {
    expect(screen.getAllByText(/Observações/i)).toHaveLength(2);
    expect(screen.getByText(/teste/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Autorizou/i)).toHaveLength(2);
    expect(
      screen.getByText("29/09/2023 14:17:07 - Informações da CODAE")
    ).toBeInTheDocument();
    expect(screen.getByText(/aprovado/i)).toBeInTheDocument();
  });

  it("Deve renderizar justificativa de negação quando existir", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <CorpoRelatorio
            solicitacaoKitLanche={mockComNegacao}
            solicitacoesSimilares={mockComNegacao.solicitacoes_similares}
            prazoDoPedidoMensagem={""}
            tipoSolicitacao={TIPO_SOLICITACAO.SOLICITACAO_NORMAL}
          />
        </MemoryRouter>
      );
    });

    expect(screen.getByText("Justificativa da negação")).toBeInTheDocument();
    expect(
      screen.getByText(/Justificativa de negação teste/)
    ).toBeInTheDocument();
  });

  it("Deve renderizar faixas etárias quando for inclusão CEI", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <CorpoRelatorio
            solicitacaoKitLanche={mockKitLancheAvulsa}
            solicitacoesSimilares={mockKitLancheAvulsa.solicitacoes_similares}
            prazoDoPedidoMensagem={""}
            tipoSolicitacao={TIPO_SOLICITACAO.SOLICITACAO_CEI}
          />
        </MemoryRouter>
      );
    });

    expect(screen.getByText("Faixa Etária")).toBeInTheDocument();
    expect(screen.getByText("Alunos Matriculados")).toBeInTheDocument();
    expect(screen.getByText("Quantidade")).toBeInTheDocument();
    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByText("N/A")).toBeInTheDocument();
  });

  it("Deve renderizar alunos com dieta especial quando existirem", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <CorpoRelatorio
            solicitacaoKitLanche={mockComDietaEspecial}
            solicitacoesSimilares={mockComDietaEspecial.solicitacoes_similares}
            prazoDoPedidoMensagem={""}
            tipoSolicitacao={TIPO_SOLICITACAO.SOLICITACAO_NORMAL}
          />
        </MemoryRouter>
      );
    });

    expect(screen.getByText("Alunos com dieta especial")).toBeInTheDocument();
    expect(screen.getAllByText("Código EOL")).toHaveLength(3);
    expect(screen.getByText("Nome")).toBeInTheDocument();
    expect(screen.getByText("123456")).toBeInTheDocument();
    expect(screen.getByText("Aluno Teste 1")).toBeInTheDocument();
    expect(screen.getByText("789012")).toBeInTheDocument();
    expect(screen.getByText("Aluno Teste 2")).toBeInTheDocument();
  });

  it("", async () => {
    preview.debug();
    mockGetDetalheKitLancheAvulso;
  });
});
