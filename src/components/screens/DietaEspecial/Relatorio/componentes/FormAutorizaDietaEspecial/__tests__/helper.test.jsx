import { validateSubstituicao } from "../helper";

describe("test validateSubstituicao", () => {
  test("substituição vazia", () => {
    let resultadoValidacao = validateSubstituicao({});
    expect(resultadoValidacao).toEqual(
      "Falta preencher alimento, tipo, substitutos"
    );
    resultadoValidacao = validateSubstituicao({ substitutos: [] });
    expect(resultadoValidacao).toEqual(
      "Falta preencher alimento, tipo, substitutos"
    );
  });
  test("substituição não preenchida tem mensagem de erro", () => {
    let resultadoValidacao = validateSubstituicao({ alimento: "9" });
    expect(resultadoValidacao).toEqual("Falta preencher tipo, substitutos");

    resultadoValidacao = validateSubstituicao({
      alimento: "9",
      substitutos: ["12", "14"],
    });
    expect(resultadoValidacao).toEqual("Falta preencher tipo");

    resultadoValidacao = validateSubstituicao({ tipo: "isento" });
    expect(resultadoValidacao).toEqual("Falta preencher alimento, substitutos");

    resultadoValidacao = validateSubstituicao({
      substitutos: [],
      tipo: "isento",
      alimento: "9",
    });
    expect(resultadoValidacao).toEqual("Falta preencher substitutos");
  });
  test("substituição preenchida retorna undefined", () => {
    expect(
      validateSubstituicao({
        substitutos: ["1", "7"],
        tipo: "isento",
        alimento: "9",
      })
    ).toEqual(undefined);
  });
});
