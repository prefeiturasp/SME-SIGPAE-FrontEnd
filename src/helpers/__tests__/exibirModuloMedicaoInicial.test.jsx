import "@testing-library/jest-dom";
import { localStorageMock } from "src/mocks/localStorageMock";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import {
  exibirModuloMedicaoInicial,
  usuarioEhDinutreDiretoria,
  acessoModuloMedicaoInicialEscola,
  acessoModuloMedicaoInicialDRE,
  acessoModuloMedicaoInicialCODAE,
} from "../utilities";

describe("usuarioEhDinutreDiretoria()", () => {
  beforeEach(() => {
    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.clear();
  });

  it("retorna true quando perfil DINUTRE_DIRETORIA", () => {
    localStorage.setItem("perfil", PERFIL.DINUTRE_DIRETORIA);
    expect(usuarioEhDinutreDiretoria()).toBe(true);
  });

  it("retorna false quando perfil nao eh DINUTRE_DIRETORIA", () => {
    localStorage.setItem("perfil", PERFIL.ADMINISTRADOR_UE);
    expect(usuarioEhDinutreDiretoria()).toBe(false);
  });

  it("retorna false quando perfil nao configurado", () => {
    expect(usuarioEhDinutreDiretoria()).toBe(false);
  });
});

describe("acessoModuloMedicaoInicialEscola()", () => {
  beforeEach(() => {
    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.clear();
  });

  it("retorna true quando acesso_modulo_medicao_inicial", () => {
    localStorage.setItem("acesso_modulo_medicao_inicial", "true");
    expect(acessoModuloMedicaoInicialEscola()).toBe(true);
  });

  it("retorna false sem acesso", () => {
    localStorage.setItem("acesso_modulo_medicao_inicial", "false");
    expect(acessoModuloMedicaoInicialEscola()).toBe(false);
  });

  it("retorna true quando dre_acesso_modulo_medicao_inicial", () => {
    localStorage.setItem("dre_acesso_modulo_medicao_inicial", "true");
    expect(acessoModuloMedicaoInicialEscola()).toBe(true);
  });
});

describe("acessoModuloMedicaoInicialDRE()", () => {
  beforeEach(() => {
    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.clear();
  });

  it("retorna true quando possui_escolas_com_acesso_ao_medicao_inicial", () => {
    localStorage.setItem(
      "possui_escolas_com_acesso_ao_medicao_inicial",
      "true",
    );
    expect(acessoModuloMedicaoInicialDRE()).toBe(true);
  });

  it("retorna false quando nao possui escolas com acesso", () => {
    localStorage.setItem(
      "possui_escolas_com_acesso_ao_medicao_inicial",
      "false",
    );
    expect(acessoModuloMedicaoInicialDRE()).toBe(false);
  });
});

describe("acessoModuloMedicaoInicialCODAE()", () => {
  beforeEach(() => {
    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.clear();
  });

  it("retorna true para gestao_alimentacao_terceirizada com acesso", () => {
    localStorage.setItem(
      "tipo_perfil",
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
    );
    localStorage.setItem("acesso_modulo_medicao_inicial", "true");
    expect(acessoModuloMedicaoInicialCODAE()).toBe(true);
  });

  it("retorna true para nutricao_manifestacao com acesso", () => {
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.NUTRICAO_MANIFESTACAO);
    localStorage.setItem("acesso_modulo_medicao_inicial", "true");
    expect(acessoModuloMedicaoInicialCODAE()).toBe(true);
  });

  it("retorna true para codae_gabinete com acesso e perfil correto", () => {
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.CODAE_GABINETE);
    localStorage.setItem("perfil", PERFIL.ADMINISTRADOR_CODAE_GABINETE);
    localStorage.setItem("acesso_modulo_medicao_inicial", "true");
    expect(acessoModuloMedicaoInicialCODAE()).toBe(true);
  });

  it("retorna false quando acesso_modulo_medicao_inicial false", () => {
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.NUTRICAO_MANIFESTACAO);
    localStorage.setItem("acesso_modulo_medicao_inicial", "false");
    expect(acessoModuloMedicaoInicialCODAE()).toBe(false);
  });
});

describe("exibirModuloMedicaoInicial()", () => {
  beforeEach(() => {
    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.clear();
  });

  describe("perfil dinutre (mudanca implementada - aplica em qualquer ambiente)", () => {
    it("retorna true com perfil DINUTRE_DIRETORIA", () => {
      localStorage.setItem("tipo_perfil", TIPO_PERFIL.DINUTRE);
      localStorage.setItem("perfil", PERFIL.DINUTRE_DIRETORIA);

      expect(exibirModuloMedicaoInicial()).toBe(true);
    });

    it("retorna false com perfil nao DINUTRE_DIRETORIA", () => {
      localStorage.setItem("tipo_perfil", TIPO_PERFIL.DINUTRE);
      localStorage.setItem("perfil", PERFIL.ADMINISTRADOR_UE);

      expect(exibirModuloMedicaoInicial()).toBe(false);
    });
  });

  describe("perfil pre_recebimento (antiga rota removida)", () => {
    it("retorna false pois o caso nao existe mais no switch", () => {
      localStorage.setItem("tipo_perfil", TIPO_PERFIL.PRE_RECEBIMENTO);

      const result = exibirModuloMedicaoInicial();

      // Em ambiente nao-producao, pre_recebimento nao corresponde a nenhum
      // perfil que retorne true no OR chain
      expect(result).toBe(false);
    });
  });

  describe("perfil medicao", () => {
    it("retorna true", () => {
      localStorage.setItem("tipo_perfil", TIPO_PERFIL.MEDICAO);
      expect(exibirModuloMedicaoInicial()).toBe(true);
    });
  });

  describe("perfil supervisao_nutricao", () => {
    it("retorna true para coordenador", () => {
      localStorage.setItem("tipo_perfil", TIPO_PERFIL.SUPERVISAO_NUTRICAO);
      localStorage.setItem("perfil", PERFIL.COORDENADOR_SUPERVISAO_NUTRICAO);
      expect(exibirModuloMedicaoInicial()).toBe(true);
    });

    it("retorna true para administrador", () => {
      localStorage.setItem("tipo_perfil", TIPO_PERFIL.SUPERVISAO_NUTRICAO);
      localStorage.setItem("perfil", PERFIL.ADMINISTRADOR_SUPERVISAO_NUTRICAO);
      expect(exibirModuloMedicaoInicial()).toBe(true);
    });
  });

  describe("perfil terceirizada", () => {
    it("retorna true para admin empresa com acesso", () => {
      localStorage.setItem("tipo_perfil", TIPO_PERFIL.TERCEIRIZADA);
      localStorage.setItem("perfil", PERFIL.ADMINISTRADOR_EMPRESA);
      localStorage.setItem("tipo_servico", `"TERCEIRIZADA"`);
      localStorage.setItem(
        "possui_escolas_com_acesso_ao_medicao_inicial",
        "true",
      );
      expect(exibirModuloMedicaoInicial()).toBe(true);
    });
  });
});
