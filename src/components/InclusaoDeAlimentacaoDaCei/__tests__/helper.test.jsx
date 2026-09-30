import { backgroundLabelPeriodo, formataPayload } from "../helper";

describe("helper - backgroundLabelPeriodo", () => {
  it("aplica estilo para período NOITE", () => {
    const resultado = backgroundLabelPeriodo([{ nome: "NOITE" }]);
    expect(resultado).toEqual([
      {
        nome: "NOITE",
        background: "#e4f1ff",
        borderColor: "#82b7e8",
      },
    ]);
  });

  it("aplica estilo padrão para período desconhecido", () => {
    const resultado = backgroundLabelPeriodo([{ nome: "OUTRO_PERIODO" }]);
    expect(resultado[0].background).toBe("#eaffe3");
    expect(resultado[0].borderColor).toBe("#79cf91");
  });
});

describe("helper - formataPayload", () => {
  it("considera apenas faixas com quantidade em período não INTEGRAL", () => {
    const values = {
      escola: "escola-uuid",
      dias_motivos_da_inclusao_cei: [],
      periodos_e_faixas: [
        {
          checked: true,
          nome: "MANHA",
          uuid: "periodo-uuid",
          faixas_etarias: [
            {
              quantidade_alunos: 10,
              count: 1,
              faixa_etaria: { uuid: "faixa-uuid-1" },
            },
            {
              count: 1,
              faixa_etaria: { uuid: "faixa-uuid-2" },
            },
          ],
        },
      ],
    };

    const payload = formataPayload(values);

    expect(payload.quantidade_alunos_por_faixas_etarias).toHaveLength(1);
    expect(payload.quantidade_alunos_por_faixas_etarias[0]).toEqual({
      periodo: "periodo-uuid",
      periodo_externo: "periodo-uuid",
      quantidade_alunos: 10,
      faixa_etaria: "faixa-uuid-1",
      matriculados_quando_criado: 1,
    });
  });
});
