import { PERFIL, TIPO_PERFIL, TIPO_SERVICO } from "src/constants/shared";
import { usuarioPodeVisualizarRelatorioIMR } from "src/helpers/utilities";
import { localStorageMock } from "src/mocks/localStorageMock";

const perfisComPermissao = [
  {
    nome: "Administrador de Supervisão",
    dados: {
      perfil: PERFIL.ADMINISTRADOR_SUPERVISAO_NUTRICAO,
      tipo_perfil: TIPO_PERFIL.SUPERVISAO_NUTRICAO,
    },
  },
  {
    nome: "Coordenador de Supervisão",
    dados: {
      perfil: PERFIL.COORDENADOR_SUPERVISAO_NUTRICAO,
      tipo_perfil: TIPO_PERFIL.SUPERVISAO_NUTRICAO,
    },
  },
  {
    nome: "CODAE",
    dados: {
      tipo_perfil: TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
    },
  },
  {
    nome: "Medição",
    dados: { tipo_perfil: TIPO_PERFIL.MEDICAO },
  },
  {
    nome: "Gabinete CODAE",
    dados: { perfil: PERFIL.ADMINISTRADOR_CODAE_GABINETE },
  },
  {
    nome: "DINUTRE",
    dados: { perfil: PERFIL.DINUTRE_DIRETORIA },
  },
  {
    nome: "Nutri Manifestação",
    dados: { tipo_perfil: TIPO_PERFIL.NUTRICAO_MANIFESTACAO },
  },
  {
    nome: "COGESTOR DRE",
    dados: {
      perfil: PERFIL.COGESTOR_DRE,
      tipo_perfil: TIPO_PERFIL.DIRETORIA_REGIONAL,
    },
  },
  {
    nome: "Terceirizada",
    dados: {
      perfil: PERFIL.ADMINISTRADOR_EMPRESA,
      tipo_perfil: TIPO_PERFIL.TERCEIRIZADA,
      tipo_servico: TIPO_SERVICO.TERCEIRIZADA,
    },
  },
];

describe("Permissão para visualizar relatório de supervisão", () => {
  beforeEach(() => {
    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.clear();
  });

  it.each(perfisComPermissao)(
    "permite a visualização para $nome",
    ({ dados }) => {
      Object.entries(dados).forEach(([chave, valor]) => {
        localStorage.setItem(chave, valor);
      });

      expect(usuarioPodeVisualizarRelatorioIMR()).toBe(true);
    },
  );

  it("não permite a visualização para perfil sem autorização", () => {
    localStorage.setItem("perfil", '"PERFIL_SEM_AUTORIZACAO"');
    localStorage.setItem("tipo_perfil", '"perfil_sem_autorizacao"');

    expect(usuarioPodeVisualizarRelatorioIMR()).toBe(false);
  });
});
