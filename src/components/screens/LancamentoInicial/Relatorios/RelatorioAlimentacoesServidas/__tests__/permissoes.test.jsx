import "@testing-library/jest-dom";
import { PERFIL, TIPO_PERFIL, TIPO_SERVICO } from "src/constants/shared";
import { exibirRelatorioAlimentacoesServidas } from "src/helpers/utilities";
import { localStorageMock } from "src/mocks/localStorageMock";

const configuraPerfil = ({ tipo_perfil, perfil, tipo_servico }) => {
  localStorage.clear();
  if (tipo_perfil) localStorage.setItem("tipo_perfil", tipo_perfil);
  if (perfil) localStorage.setItem("perfil", perfil);
  if (tipo_servico) localStorage.setItem("tipo_servico", tipo_servico);
};

describe("Relatório de Alimentações Servidas - permissões", () => {
  beforeAll(() => {
    Object.defineProperty(global, "localStorage", { value: localStorageMock });
  });

  const perfisPermitidos = [
    { nome: "DRE", tipo_perfil: TIPO_PERFIL.DIRETORIA_REGIONAL },
    { nome: "CODAE", tipo_perfil: TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA },
    { nome: "MEDIÇÃO", tipo_perfil: TIPO_PERFIL.MEDICAO },
    {
      nome: "NUTRISUPERVISÃO (Coordenador)",
      perfil: PERFIL.COORDENADOR_SUPERVISAO_NUTRICAO,
    },
    {
      nome: "NUTRISUPERVISÃO (Administrador)",
      perfil: PERFIL.ADMINISTRADOR_SUPERVISAO_NUTRICAO,
    },
    {
      nome: "NUTRIMANIFESTAÇÃO",
      tipo_perfil: TIPO_PERFIL.NUTRICAO_MANIFESTACAO,
    },
    {
      nome: "COORD CODAE GABINETE",
      perfil: PERFIL.ADMINISTRADOR_CODAE_GABINETE,
    },
    { nome: "RELATÓRIOS", perfil: PERFIL.USUARIO_RELATORIOS },
    { nome: "DINUTRE DIRETORIA", perfil: PERFIL.DINUTRE_DIRETORIA },
    {
      nome: "TERCEIRIZADA",
      perfil: PERFIL.ADMINISTRADOR_EMPRESA,
      tipo_servico: TIPO_SERVICO.TERCEIRIZADA,
    },
  ];

  it.each(perfisPermitidos)("permite acesso ao perfil $nome", (perfil) => {
    configuraPerfil(perfil);
    expect(exibirRelatorioAlimentacoesServidas()).toBe(true);
  });

  it("não permite acesso ao perfil Escola", () => {
    configuraPerfil({
      tipo_perfil: TIPO_PERFIL.ESCOLA,
      perfil: PERFIL.DIRETOR_UE,
    });
    expect(exibirRelatorioAlimentacoesServidas()).toBe(false);
  });

  it("não exibe o relatório em produção", () => {
    jest.isolateModules(() => {
      jest.doMock("src/constants/config", () => ({
        ...jest.requireActual("src/constants/config"),
        ENVIRONMENT: "production",
      }));
      const utilities = require("src/helpers/utilities");
      configuraPerfil({ tipo_perfil: TIPO_PERFIL.MEDICAO });
      expect(utilities.exibirRelatorioAlimentacoesServidas()).toBe(false);
    });
  });
});
