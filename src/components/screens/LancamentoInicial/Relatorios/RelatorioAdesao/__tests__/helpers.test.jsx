import { getMesAno } from "../components/FormFiltro/helpers";
import {
  devePaginarRelatorioAdesao,
  montaIdentificacaoResultadoIndividual,
  montaParamsRelatorioAdesao,
} from "../helpers";

describe("getMesAno", () => {
  it('deve lançar um erro se "values_mes" não for informado', () => {
    expect(() => {
      getMesAno();
    }).toThrow("Parâmetro 'values_mes' é obrigatório.");
  });

  it("deve retornar o mês e ano corretamente se informado corretamente", () => {
    expect(getMesAno("05_2025")).toEqual({ mes: 5, ano: 2025 });
  });
});

describe("helpers do Relatório de Adesão", () => {
  it("monta os params com resultado_individual_por_data e page", () => {
    expect(
      montaParamsRelatorioAdesao(
        {
          mes: "12_2023",
          resultado_individual_por_data: true,
        },
        2,
      ),
    ).toEqual({
      mes_ano: "12_2023",
      lotes: undefined,
      tipos_unidades: undefined,
      escola__uuid: undefined,
      periodos_escolares: undefined,
      tipos_alimentacao: undefined,
      periodo_lancamento_de: undefined,
      periodo_lancamento_ate: undefined,
      resultado_individual_por_data: true,
      page: 2,
    });
  });

  it("não envia resultado_individual_por_data quando o seletor está desmarcado", () => {
    expect(montaParamsRelatorioAdesao({ mes: "12_2023" })).not.toHaveProperty(
      "resultado_individual_por_data",
    );
  });

  it("pagina quando o resultado é individual por data ou há escolas selecionadas", () => {
    expect(
      devePaginarRelatorioAdesao({ resultado_individual_por_data: true }),
    ).toBe(true);
    expect(
      devePaginarRelatorioAdesao({ unidade_educacional: ["uuid-escola"] }),
    ).toBe(true);
    expect(devePaginarRelatorioAdesao({})).toBe(false);
  });

  it("monta a identificação do resultado individual por data e tipo de unidade", () => {
    expect(
      montaIdentificacaoResultadoIndividual({
        data: "01/08/2026",
        tipo_unidade: "Grupo 3 - EMEI, CEU EMEI",
        resultados: {},
      }),
    ).toEqual({
      data: "01/08/2026",
      tipo_unidade: "Grupo 3 - EMEI, CEU EMEI",
    });

    expect(
      montaIdentificacaoResultadoIndividual({
        data: "02/08/2026",
        grupo_unidade: "Grupo 3",
        tipos_unidades: [{ iniciais: "EMEI" }, { iniciais: "CEU EMEI" }],
        resultados: {},
      }),
    ).toEqual({
      data: "02/08/2026",
      tipo_unidade: "Grupo 3 - EMEI, CEU EMEI",
    });
  });
});
