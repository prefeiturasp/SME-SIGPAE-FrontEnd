import { LogFichaTecnica } from "src/interfaces/pre_recebimento.interface";

import { montarLinhaDoTempoFichaTecnica } from "../helpers";

const criarLog = (
  statusEventoExplicacao: string,
  criadoEm: string,
  nomeUsuario?: string,
): LogFichaTecnica =>
  ({
    status_evento_explicacao: statusEventoExplicacao,
    criado_em: criadoEm,
    usuario: nomeUsuario
      ? {
          nome: nomeUsuario,
        }
      : null,
  }) as LogFichaTecnica;

describe("montarLinhaDoTempoFichaTecnica", () => {
  it("formata os status percorridos pela Ficha Técnica", () => {
    const logs = [
      criarLog(
        "Ficha Técnica cadastrada",
        "27/07/2026 10:00",
        "Usuário da Empresa",
      ),
      criarLog(
        "Ficha Técnica enviada para análise",
        "27/07/2026 11:00",
        "Usuário da Empresa",
      ),
      criarLog(
        "Ficha Técnica enviada para correção",
        "27/07/2026 12:00",
        "Usuário da Gestão de Produto",
      ),
      criarLog(
        "Ficha Técnica enviada para análise",
        "27/07/2026 13:00",
        "Usuário da Empresa",
      ),
      criarLog(
        "Ficha Técnica aprovada",
        "27/07/2026 14:00",
        "Usuário da Gestão de Produto",
      ),
    ];

    expect(montarLinhaDoTempoFichaTecnica(logs)).toEqual([
      {
        titulo: "Ficha Técnica Cadastrada",
        criadoEm: "27/07/2026 10:00",
        nomeUsuario: "Usuário da Empresa",
        tipo: "concluida",
      },
      {
        titulo: "Envio da Ficha Técnica",
        criadoEm: "27/07/2026 11:00",
        nomeUsuario: "Usuário da Empresa",
        tipo: "concluida",
      },
      {
        titulo: "Correção Solicitada",
        criadoEm: "27/07/2026 12:00",
        nomeUsuario: "Usuário da Gestão de Produto",
        tipo: "alerta",
      },
      {
        titulo: "Correção Realizada",
        criadoEm: "27/07/2026 13:00",
        nomeUsuario: "Usuário da Empresa",
        tipo: "concluida",
      },
      {
        titulo: "Ficha Técnica Aprovada",
        criadoEm: "27/07/2026 14:00",
        nomeUsuario: "Usuário da Gestão de Produto",
        tipo: "concluida",
      },
    ]);
  });

  it("mantém status desconhecido e utiliza hífen quando não existe usuário", () => {
    const logs = [criarLog("Status não mapeado", "27/07/2026 10:00")];

    expect(montarLinhaDoTempoFichaTecnica(logs)).toEqual([
      {
        titulo: "Status não mapeado",
        criadoEm: "27/07/2026 10:00",
        nomeUsuario: "-",
        tipo: "concluida",
      },
    ]);
  });
});
