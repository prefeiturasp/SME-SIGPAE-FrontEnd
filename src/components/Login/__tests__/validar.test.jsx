import "@testing-library/jest-dom";
import { validarForm } from "../validar";
import { TABS } from "../constans";

jest.mock("../../../helpers/utilities", () => ({
  validarCPF: jest.fn(),
}));

import { validarCPF } from "../../../helpers/utilities";

describe("validarForm", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar erro se registro funcional tiver menos de 7 dígitos", () => {
    const values = {
      registro_funcional: "123456",
      cpf: "12345678900",
      password: "12345678",
      confirmar_password: "12345678",
    };
    const state = { tab: TABS.ESCOLA };

    validarCPF.mockReturnValue(true);

    const erro = validarForm(values, state);
    expect(erro).toBe("Campo registro funcional deve conter 7 números");
  });

  it("deve deletar registro_funcional se for da aba TERCEIRIZADAS e retornar false (sem erro)", () => {
    const values = {
      registro_funcional: "1234567",
      cpf: "12345678900",
      password: "senha123",
      confirmar_password: "senha123",
    };
    const state = { tab: TABS.TERCEIRIZADAS };

    validarCPF.mockReturnValue(true);

    const erro = validarForm(values, state);
    expect(values.registro_funcional).toBeUndefined();
    expect(erro).toBe(false);
  });

  it("deve retornar erro se CPF for inválido", () => {
    const values = {
      registro_funcional: "1234567",
      cpf: "cpf_invalido",
      password: "senha123",
      confirmar_password: "senha123",
    };
    const state = { tab: TABS.ESCOLA };

    validarCPF.mockReturnValue(false);

    const erro = validarForm(values, state);
    expect(erro).toBe("CPF inválido");
  });

  it("deve retornar erro se senha e confirmação forem diferentes", () => {
    const values = {
      registro_funcional: "1234567",
      cpf: "12345678900",
      password: "senha123",
      confirmar_password: "outraSenha",
    };
    const state = { tab: TABS.ESCOLA };

    validarCPF.mockReturnValue(true);

    const erro = validarForm(values, state);
    expect(erro).toBe("Campos senha e confirmar senha divergem");
  });

  it("deve retornar false (sem erro) se tudo estiver válido", () => {
    const values = {
      registro_funcional: "1234567",
      cpf: "12345678900",
      password: "senha123",
      confirmar_password: "senha123",
    };
    const state = { tab: TABS.ESCOLA };

    validarCPF.mockReturnValue(true);

    const erro = validarForm(values, state);
    expect(erro).toBe(false);
  });
});
