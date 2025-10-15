import "@testing-library/jest-dom";
import { PERFIL, TIPO_SERVICO, TIPO_PERFIL } from "src/constants/shared";
import { localStorageMock } from "src/mocks/localStorageMock";
import { usuarioEhEmpresaTerceirizada } from "src/helpers/utilities";

describe("Verifica se tercerizada tem acesso ao módulo de Medição Inicial", () => {
  beforeEach(async () => {
    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.clear();
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.TERCEIRIZADA);
  });

  it("Tem acesso como perfil ADMINISTRADOR_EMPRESA e acesso a medição -> acesso liberado", () => {
    localStorage.setItem("perfil", PERFIL.ADMINISTRADOR_EMPRESA);
    localStorage.setItem("tipo_servico", TIPO_SERVICO.TERCEIRIZADA);
    localStorage.setItem(
      "possui_escolas_com_acesso_ao_medicao_inicial",
      "true",
    );
    const result = usuarioEhEmpresaTerceirizada();
    expect(result).toBe(true);
    const temAcesso =
      result &&
      localStorage.getItem("possui_escolas_com_acesso_ao_medicao_inicial") ===
        "true";
    expect(temAcesso).toBe(true);
  });

  it("Tem acesso como perfil ADMINISTRADOR_EMPRESA e não tem acesso a medição -> acesso negado", () => {
    localStorage.setItem("perfil", PERFIL.ADMINISTRADOR_EMPRESA);
    localStorage.setItem("tipo_servico", TIPO_SERVICO.TERCEIRIZADA);
    localStorage.setItem(
      "possui_escolas_com_acesso_ao_medicao_inicial",
      "false",
    );
    const result = usuarioEhEmpresaTerceirizada();
    expect(result).toBe(true);
    const temAcesso =
      result &&
      localStorage.getItem("possui_escolas_com_acesso_ao_medicao_inicial") ===
        "true";
    expect(temAcesso).toBe(false);
  });

  it("acesso como perfil USUARIO_EMPRESA e acesso a medição -> acesso liberado", () => {
    localStorage.setItem("perfil", PERFIL.USUARIO_EMPRESA);
    localStorage.setItem("tipo_servico", TIPO_SERVICO.TERCEIRIZADA);
    localStorage.setItem(
      "possui_escolas_com_acesso_ao_medicao_inicial",
      "true",
    );
    const result = usuarioEhEmpresaTerceirizada();
    expect(result).toBe(true);
    const temAcesso =
      result &&
      localStorage.getItem("possui_escolas_com_acesso_ao_medicao_inicial") ===
        "true";
    expect(temAcesso).toBe(true);
  });

  it("Tacesso como perfil USUARIO_EMPRESA e não tem acesso a medição -> acesso negado", () => {
    localStorage.setItem("perfil", PERFIL.USUARIO_EMPRESA);
    localStorage.setItem("tipo_servico", TIPO_SERVICO.TERCEIRIZADA);
    localStorage.setItem(
      "possui_escolas_com_acesso_ao_medicao_inicial",
      "false",
    );
    const result = usuarioEhEmpresaTerceirizada();
    expect(result).toBe(true);
    const temAcesso =
      result &&
      localStorage.getItem("possui_escolas_com_acesso_ao_medicao_inicial") ===
        "true";
    expect(temAcesso).toBe(false);
  });

  it("Tem acesso com tipo_servico DISTRIBUIDOR_ARMAZEM e acesso a medição -> acesso negado", () => {
    localStorage.setItem("perfil", PERFIL.USUARIO_EMPRESA);
    localStorage.setItem("tipo_servico", TIPO_SERVICO.DISTRIBUIDOR_ARMAZEM);
    localStorage.setItem(
      "possui_escolas_com_acesso_ao_medicao_inicial",
      "true",
    );
    const result = usuarioEhEmpresaTerceirizada();
    expect(result).toBe(false);
    const temAcesso =
      result &&
      localStorage.getItem("possui_escolas_com_acesso_ao_medicao_inicial") ===
        "true";
    expect(temAcesso).toBe(false);
  });

  it("Tem acesso com perfil ADMINISTRADOR_GESTAO_PRODUTO e acesso a medição -> acesso negado", () => {
    localStorage.setItem("perfil", PERFIL.ADMINISTRADOR_GESTAO_PRODUTO);
    localStorage.setItem("tipo_servico", TIPO_SERVICO.TERCEIRIZADA);
    localStorage.setItem(
      "possui_escolas_com_acesso_ao_medicao_inicial",
      "false",
    );
    const result = usuarioEhEmpresaTerceirizada();
    expect(result).toBe(false);
    const temAcesso =
      result &&
      localStorage.getItem("possui_escolas_com_acesso_ao_medicao_inicial") ===
        "true";
    expect(temAcesso).toBe(false);
  });
});
