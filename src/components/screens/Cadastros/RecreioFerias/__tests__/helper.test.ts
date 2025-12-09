import { validateForm } from "../helper";

describe("validateForm - Regra de num_colaboradores", () => {
  it("deve exigir num_colaboradores quando houver tipos de alimentação para colaboradores", () => {
    const values = {
      unidades_participantes: [
        {
          id: "ue1",
          num_inscritos: 10,
          num_colaboradores: 0,
          tiposAlimentacaoColaboradoresUuids: ["uuid-1", "uuid-2"],
        },
      ],
    };

    const errors = validateForm(values);

    expect(errors.unidades_participantes).toBeDefined();
    expect(errors.unidades_participantes[0]).toHaveProperty(
      "num_colaboradores",
    );
    expect(errors.unidades_participantes[0].num_colaboradores).toBe(
      "Informe o nº de colaboradores (maior que 0)",
    );
  });

  it("NÃO deve exigir num_colaboradores quando NÃO houver tipos de alimentação para colaboradores", () => {
    const values = {
      unidades_participantes: [
        {
          id: "ue1",
          num_inscritos: 10,
          num_colaboradores: 0,
          tiposAlimentacaoColaboradoresUuids: [],
        },
      ],
    };

    const errors = validateForm(values);

    expect(errors).toEqual({});
  });

  it("deve validar num_inscritos independentemente dos tipos de alimentação", () => {
    const values = {
      unidades_participantes: [
        {
          id: "ue1",
          num_inscritos: 0,
          num_colaboradores: 5,
          tiposAlimentacaoColaboradoresUuids: [],
        },
      ],
    };

    const errors = validateForm(values);

    expect(errors.unidades_participantes).toBeDefined();
    expect(errors.unidades_participantes[0]).toHaveProperty("num_inscritos");
    expect(errors.unidades_participantes[0].num_inscritos).toBe(
      "Informe o nº de inscritos (maior que 0)",
    );
  });

  it("deve aceitar num_colaboradores válido quando houver tipos de alimentação", () => {
    const values = {
      unidades_participantes: [
        {
          id: "ue1",
          num_inscritos: 10,
          num_colaboradores: 5,
          tiposAlimentacaoColaboradoresUuids: ["uuid-1"],
        },
      ],
    };

    const errors = validateForm(values);

    expect(errors).toEqual({});
  });

  it("deve validar múltiplas unidades corretamente", () => {
    const values = {
      unidades_participantes: [
        {
          id: "ue1",
          num_inscritos: 10,
          num_colaboradores: 0,
          tiposAlimentacaoColaboradoresUuids: [],
        },
        {
          id: "ue2",
          num_inscritos: 15,
          num_colaboradores: 0,
          tiposAlimentacaoColaboradoresUuids: ["uuid-1"],
        },
      ],
    };

    const errors = validateForm(values);

    expect(errors.unidades_participantes).toBeDefined();
    expect(errors.unidades_participantes[0]).toBeUndefined();
    expect(errors.unidades_participantes[1]).toHaveProperty(
      "num_colaboradores",
    );
  });
});
