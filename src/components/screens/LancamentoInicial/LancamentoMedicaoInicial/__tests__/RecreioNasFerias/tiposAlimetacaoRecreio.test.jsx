import { tiposAlimentacaoRecreio } from "src/components/screens/LancamentoInicial/LancamentoMedicaoInicial/components/LancamentoPorPeriodoCEI/helpers";
import {
  recreioNasFeriasDaMedicao,
  ehEscolaTipoCEMEI,
  recreioNasFeriasDaMedicaoEMEIdaCEMEI,
} from "src/helpers/utilities";

jest.mock("src/helpers/utilities");

const recreioCEIMock = {
  unidades_participantes: [
    {
      tipos_alimentacao: {
        colaboradores: [
          { nome: "Refeição" },
          { nome: "Lanche 4h" },
          { nome: "Lanche" },
          { nome: "Sobremesa" },
        ],
        inscritos: [
          { nome: "Lanche" },
          { nome: "Refeição" },
          { nome: "Sobremesa" },
          { nome: "Colação" },
          { nome: "Refeição da tarde" },
          { nome: "Desjejum" },
          { nome: "Almoço" },
        ],
      },
    },
  ],
};
const recreioCEMEIMock = {
  unidades_participantes: [
    {
      cei_ou_emei: "CEI",
      tipos_alimentacao: {
        inscritos: [{ nome: "Refeição" }, { nome: "Lanche" }],
        colaboradores: [{ nome: "Sobremesa" }, { nome: "Lanche" }],
        infantil: [{ nome: "Sobremesa" }, { nome: "Lanche" }],
      },
    },
    {
      cei_ou_emei: "EMEI",
      tipos_alimentacao: {
        infantil: [{ nome: "Sobremesa" }, { nome: "Lanche" }],
      },
    },
  ],
};

describe("tiposAlimentacaoRecreio", () => {
  const solicitacao = {};
  const escola = {};

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Escola CEI", () => {
    beforeEach(() => {
      ehEscolaTipoCEMEI.mockReturnValue(false);
      recreioNasFeriasDaMedicao.mockReturnValue(recreioCEIMock);
    });

    it("retorna inscritos quando colaboradores=false", () => {
      const result = tiposAlimentacaoRecreio(solicitacao, escola);

      expect(result.map((item) => item.nome)).toEqual([
        "Lanche",
        "Refeição",
        "Sobremesa",
        "Colação",
        "Refeição da tarde",
        "Desjejum",
        "Almoço",
      ]);
    });

    it("retorna colaboradores quando colaboradores=true", () => {
      const result = tiposAlimentacaoRecreio(solicitacao, escola, true);

      expect(result.map((item) => item.nome)).toEqual([
        "Lanche",
        "Refeição",
        "Sobremesa",
        "Lanche 4h",
      ]);
    });
  });

  describe("Escola CEMEI", () => {
    beforeEach(() => {
      ehEscolaTipoCEMEI.mockReturnValue(true);
      recreioNasFeriasDaMedicao.mockReturnValue(recreioCEMEIMock);
    });

    it("retorna inscritos quando tipo CEI", () => {
      recreioNasFeriasDaMedicaoEMEIdaCEMEI.mockReturnValue(false);

      const result = tiposAlimentacaoRecreio(solicitacao, escola);

      expect(result.map((item) => item.nome)).toEqual(["Lanche", "Refeição"]);
    });

    it("retorna infantil ordenado quando tipo EMEI", () => {
      recreioNasFeriasDaMedicaoEMEIdaCEMEI.mockReturnValue(true);

      const result = tiposAlimentacaoRecreio(solicitacao, escola);

      expect(result.map((item) => item.nome)).toEqual(["Lanche", "Sobremesa"]);
    });

    it("retorna colaboradores ordenados quando colaboradores=true", () => {
      const result = tiposAlimentacaoRecreio(solicitacao, escola, true);

      expect(result.map((item) => item.nome)).toEqual(["Lanche", "Sobremesa"]);
    });
  });
});
