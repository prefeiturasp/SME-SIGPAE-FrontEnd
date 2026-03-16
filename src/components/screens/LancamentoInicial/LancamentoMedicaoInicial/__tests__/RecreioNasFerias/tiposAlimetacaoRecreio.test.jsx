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
        colaboradores: [{ nome: "Lanche 4h" }, { nome: "Lanche" }],
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

      expect(result).toEqual(
        recreioCEIMock.unidades_participantes[0].tipos_alimentacao.inscritos,
      );
    });

    it("retorna colaboradores quando colaboradores=true", () => {
      const result = tiposAlimentacaoRecreio(solicitacao, escola, true);

      expect(result).toEqual(
        recreioCEIMock.unidades_participantes[0].tipos_alimentacao
          .colaboradores,
      );
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

      expect(result).toEqual(
        recreioCEMEIMock.unidades_participantes[0].tipos_alimentacao.inscritos,
      );
    });

    it("retorna infantil ordenado quando tipo EMEI", () => {
      recreioNasFeriasDaMedicaoEMEIdaCEMEI.mockReturnValue(true);

      const result = tiposAlimentacaoRecreio(solicitacao, escola);

      const expected = [
        ...recreioCEMEIMock.unidades_participantes[1].tipos_alimentacao
          .infantil,
      ].sort((a, b) => a.nome.localeCompare(b.nome));

      expect(result).toEqual(expected);
    });

    it("retorna colaboradores ordenados quando colaboradores=true", () => {
      const result = tiposAlimentacaoRecreio(solicitacao, escola, true);

      const expected = [
        ...recreioCEMEIMock.unidades_participantes[0].tipos_alimentacao
          .colaboradores,
      ].sort((a, b) => a.nome.localeCompare(b.nome));

      expect(result).toEqual(expected);
    });
  });
});
