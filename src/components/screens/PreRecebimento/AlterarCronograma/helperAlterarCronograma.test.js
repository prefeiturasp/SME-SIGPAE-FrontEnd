import { stringDecimalToNumber } from "helpers/parsers";
import {
  prepararPayloadCronograma,
  prepararPayloadAnaliseCronograma,
  prepararPayloadEtapas,
  prepararPayloadRecebimentos,
  calculaRestante,
} from "./helpers";

// Mock para stringDecimalToNumber retornando 100
jest.mock("helpers/parsers", () => ({
  stringDecimalToNumber: jest.fn().mockReturnValue(100),
}));

describe("Funções de Preparação de Payload", () => {
  const mockValues = {
    quantidade_total: "1.000,50",
    justificativa: "Justificativa Teste",
    empenho_0: "12345",
    etapa_0: "Etapa 1",
    parte_0: "Parte A",
    data_programada_0: "25/12/2025",
    quantidade_0: "500",
    total_embalagens_0: "10.000",
    qtd_total_empenho_0: "1.000,00",
    tipo_recebimento_0: "Tipo A",
    data_recebimento_0: "25/12/2025",
  };

  const mockEtapas = [
    {
      uuid: "123",
    },
  ];

  const mockRecebimentos = [
    {
      uuid: "1234",
    },
  ];

  describe("prepararPayloadCronograma", () => {
    it("deve preparar o payload corretamente", () => {
      stringDecimalToNumber.mockReturnValue(100);

      const result = prepararPayloadCronograma(
        { uuid: "1" },
        mockValues,
        mockEtapas,
        mockRecebimentos
      );

      expect(result).toEqual({
        cronograma: "1",
        qtd_total_programada: "1000.50",
        etapas: [
          {
            numero_empenho: "12345",
            etapa: "Etapa 1",
            parte: "Parte A",
            data_programada: "2025-12-25",
            quantidade: "500",
            total_embalagens: 100,
            qtd_total_empenho: 100,
          },
        ],
        programacoes_de_recebimento: [
          {
            data_programada: "25/12/2025",
            tipo_carga: "Tipo A",
          },
        ],
        justificativa: "Justificativa Teste",
      });
    });
  });

  describe("prepararPayloadAnaliseCronograma", () => {
    it("deve preparar o payload para análise de cronograma", () => {
      stringDecimalToNumber.mockReturnValue(100);

      const result = prepararPayloadAnaliseCronograma(
        { justificativa_cronograma: "Justificativa de análise" },
        mockValues,
        mockEtapas,
        mockRecebimentos
      );

      expect(result).toEqual({
        programacoes_de_recebimento: [
          {
            data_programada: "25/12/2025",
            tipo_carga: "Tipo A",
          },
        ],
        etapas: [
          {
            numero_empenho: "12345",
            etapa: "Etapa 1",
            parte: "Parte A",
            data_programada: "2025-12-25",
            quantidade: "500",
            total_embalagens: 100, // Esperado após conversão do stringDecimalToNumber
            qtd_total_empenho: 100, // Esperado após conversão do stringDecimalToNumber
          },
        ],
        justificativa_cronograma: "Justificativa de análise",
      });
    });

    it("deve preparar o payload corretamente com a transformação de quantidade_total", () => {
      const result = prepararPayloadCronograma(
        { uuid: "1" },
        mockValues,
        mockEtapas,
        mockRecebimentos
      );

      expect(result.qtd_total_programada).toBe("1000.50");
    });
  });

  describe("prepararPayloadEtapas", () => {
    it("deve preparar o payload de etapas corretamente", () => {
      stringDecimalToNumber.mockReturnValue(100);

      const result = prepararPayloadEtapas(mockValues, mockEtapas);

      expect(result).toEqual([
        {
          numero_empenho: "12345",
          etapa: "Etapa 1",
          parte: "Parte A",
          data_programada: "2025-12-25",
          quantidade: "500",
          total_embalagens: 100, // Esperado após conversão do stringDecimalToNumber
          qtd_total_empenho: 100, // Esperado após conversão do stringDecimalToNumber
        },
      ]);
    });
  });

  describe("prepararPayloadRecebimentos", () => {
    it("deve preparar o payload de recebimentos corretamente", () => {
      const result = prepararPayloadRecebimentos(mockValues, mockRecebimentos);

      expect(result).toEqual([
        {
          data_programada: "25/12/2025",
          tipo_carga: "Tipo A",
        },
      ]);
    });
  });

  describe("calculaRestante", () => {
    it("deve calcular a quantidade restante corretamente", () => {
      const mockValues = {
        // Adicionando a chave para a etapa com uuid 123
        quantidade_total_123: 500,
      };

      const mockCronograma = {
        qtd_total_programada: 1000,
        etapas: [
          {
            uuid: "123",
            quantidade_total: 500,
          },
        ],
      };

      const result = calculaRestante(mockValues, mockCronograma);

      expect(result).toBe(500);
    });
  });
});
