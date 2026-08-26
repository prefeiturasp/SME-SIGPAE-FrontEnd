import { PERFIL, TIPO_PERFIL, TIPO_SERVICO } from "src/constants/shared";
import { localStorageMock } from "src/mocks/localStorageMock";

const perfisComAcessoAosRelatorios = [
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

const carregarRotasSupervisao = () => {
  let rotasSupervisao;
  jest.isolateModules(() => {
    rotasSupervisao = require("../index").rotasSupervisao;
  });
  return rotasSupervisao;
};

describe("Rotas de Supervisão", () => {
  beforeEach(() => {
    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.clear();
  });

  it.each(perfisComAcessoAosRelatorios)(
    "libera painel e detalhamento para $nome",
    ({ dados }) => {
      Object.entries(dados).forEach(([chave, valor]) => {
        localStorage.setItem(chave, valor);
      });

      const rotas = carregarRotasSupervisao();
      const rotaPainel = rotas.find((rota) =>
        rota.path.endsWith("/painel-relatorios-fiscalizacao"),
      );
      const rotaDetalhamento = rotas.find((rota) =>
        rota.path.endsWith("/detalhar-relatorio-fiscalizacao"),
      );

      expect(rotaPainel.tipoUsuario).toBe(true);
      expect(rotaDetalhamento.tipoUsuario).toBe(true);
    },
  );
});
