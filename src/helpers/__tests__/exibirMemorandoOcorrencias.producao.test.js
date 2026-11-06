import { PERFIL } from "src/constants/shared";

describe("exibirMemorandoOcorrencias em produção", () => {
  afterEach(() => {
    localStorage.clear();
    jest.resetModules();
    jest.dontMock("src/constants/config");
  });

  const exibirEmProducao = () => {
    jest.resetModules();
    jest.doMock("src/constants/config", () => ({
      ENVIRONMENT: "production",
      HOME: "/",
    }));

    return require("src/helpers/utilities").exibirMemorandoOcorrencias();
  };

  it("mantém o fluxo oculto para DIRETOR_UE em produção", () => {
    localStorage.setItem("perfil", PERFIL.DIRETOR_UE);

    expect(exibirEmProducao()).toBe(false);
  });

  it("mantém o fluxo oculto para ADMINISTRADOR_UE em produção", () => {
    localStorage.setItem("perfil", PERFIL.ADMINISTRADOR_UE);

    expect(exibirEmProducao()).toBe(false);
  });
});
