import { validateForm } from "../helper";

describe("validateForm - Regra de num_colaboradores", () => {
  const createUnidade = (overrides = {}) => ({
    id: "ue1",
    num_inscritos: 10,
    num_colaboradores: 0,
    tiposAlimentacaoColaboradoresUuids: [],
    ...overrides,
  });

  const createFormValues = (unidades) => ({
    unidades_participantes: Array.isArray(unidades) ? unidades : [unidades],
  });

  it("deve exigir num_colaboradores quando houver tipos de alimentação para colaboradores", () => {
    const values = createFormValues(
      createUnidade({
        tiposAlimentacaoColaboradoresUuids: ["uuid-1", "uuid-2"],
      }),
    );

    const errors = validateForm(values);

    expect(errors.unidades_participantes[0]).toHaveProperty(
      "num_colaboradores",
      "Informe o nº de colaboradores (maior que 0)",
    );
  });

  it("NÃO deve exigir num_colaboradores quando NÃO houver tipos de alimentação para colaboradores", () => {
    const values = createFormValues(createUnidade());

    const errors = validateForm(values);

    expect(errors).toEqual({});
  });

  it("deve validar num_inscritos independentemente dos tipos de alimentação", () => {
    const values = createFormValues(
      createUnidade({
        num_inscritos: 0,
        num_colaboradores: 5,
      }),
    );

    const errors = validateForm(values);

    expect(errors.unidades_participantes[0]).toHaveProperty(
      "num_inscritos",
      "Informe o nº de inscritos (maior que 0)",
    );
  });

  it("deve aceitar num_colaboradores válido quando houver tipos de alimentação", () => {
    const values = createFormValues(
      createUnidade({
        num_colaboradores: 5,
        tiposAlimentacaoColaboradoresUuids: ["uuid-1"],
      }),
    );

    const errors = validateForm(values);

    expect(errors).toEqual({});
  });

  it("deve validar múltiplas unidades corretamente", () => {
    const values = createFormValues([
      createUnidade({ id: "ue1" }),
      createUnidade({
        id: "ue2",
        num_inscritos: 15,
        tiposAlimentacaoColaboradoresUuids: ["uuid-1"],
      }),
    ]);

    const errors = validateForm(values);

    expect(errors.unidades_participantes[0]).toBeUndefined();
    expect(errors.unidades_participantes[1]).toHaveProperty(
      "num_colaboradores",
    );
  });
});
