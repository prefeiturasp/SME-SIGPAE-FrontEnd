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
import { mockMeusDadosEscolaEMEFPericles } from "src/mocks/meusDados/escolaEMEFPericles";
import { mockMotivosDRENaoValida } from "src/mocks/services/relatorios.service/mockMotivosDRENaoValida";

import preview from "jest-preview";

describe("Teste Relatorio - Visão ESCOLA", () => {
  const solicitacaoUuid = mockKitLancheAvulsa.uuid;
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
    mock
      .onGet("/usuarios/meus-dados/")
      .reply(200, mockMeusDadosEscolaEMEFPericles);

    mock.onGet("/motivos-dre-nao-valida/").reply(200, mockMotivosDRENaoValida);
    mock
      .onGet("/downloads/quantidade-nao-vistos/")
      .reply(200, { quantidade_nao_lidos: 0 });

    window.localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);

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
            solicitacoesSimilares={mockKitLancheAvulsa.solicitacoes_similares}
            prazoDoPedidoMensagem={""}
            tipoSolicitacao={TIPO_SOLICITACAO.SOLICITACAO_NORMAL}
            meusDados={mockMeusDadosEscolaEMEFPericles}
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

  it("Verifica as informações de solicitaçoes similares", async () => {
    expect(screen.getByText(/Solicitação Similar:/i)).toBeInTheDocument();
  });

  it("Verifica as informações do passeio", async () => {
    preview.debug();
    expect(screen.getByText(/Data do evento/i)).toBeInTheDocument();
    expect(
      screen.getByText(`${mockKitLancheAvulsa.solicitacao_kit_lanche.data}`)
    ).toBeInTheDocument();
    expect(screen.getByText(/Local do passeio/i)).toBeInTheDocument();
    expect(
      screen.getByText(`${mockKitLancheAvulsa.local}`)
    ).toBeInTheDocument();
    expect(screen.getByText("Evento/Atividade")).toBeInTheDocument();
    expect(
      screen.getByText(`${mockKitLancheAvulsa.evento}`)
    ).toBeInTheDocument();
    expect(screen.getByText(/Nº de Alunos/i)).toBeInTheDocument();
    expect(
      screen.getAllByText(`${mockKitLancheAvulsa.quantidade_alunos}`)
    ).toHaveLength(2);
    expect(screen.getByText(/Tempo Previsto de Passeio/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        `${mockKitLancheAvulsa.solicitacao_kit_lanche.tempo_passeio_explicacao}`
      )
    ).toBeInTheDocument();
    expect(screen.getByText(/Opção Desejada/i)).toBeInTheDocument();
    expect(screen.getByText(/KIT 1/)).toBeInTheDocument();
    expect(screen.getByText(/Nº Total de Kits/i)).toBeInTheDocument();
  });

  it("Verifica as informações adicionais", async () => {
    preview.debug();
    expect(screen.getByText(/Observações/i)).toBeInTheDocument();
    expect(screen.getByText(/teste/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Autorizou/i)).toHaveLength(2);
    expect(
      screen.getByText("29/09/2023 14:17:07 - Informações da CODAE")
    ).toBeInTheDocument();
    expect(screen.getByText(/aprovado/i)).toBeInTheDocument();
  });
});
