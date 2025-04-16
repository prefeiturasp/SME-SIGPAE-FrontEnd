export const mockGetSolicitacoesHistoricoDietasCEMEI = {
  next: null,
  previous:
    "http://hom-sigpae.sme.prefeitura.sp.gov.br/solicitacoes-dieta-especial/relatorio-historico-dieta-especial/?data=12%2F02%2F2024&page_size=10",
  count: 13,
  page_size: 10,
  total_dietas: 27,
  data: "12/02/2024",
  results: [
    {
      lote: "LOTE 07 A",
      unidade_educacional: "CEMEI MARCIA KUMBREVICIUS DE MOURA",
      tipo_unidade: "CEMEI",
      classificacao: "Tipo A",
      total: 10,
      "data:": "24/08/2023",
      periodos: {
        por_idade: [
          {
            periodo: "INTEGRAL",
            faixa_etaria: [
              {
                faixa: "01 a 03 meses",
                autorizadas: 1,
              },
            ],
          },
        ],
        turma_infantil: [
          {
            periodo: "INTEGRAL",
            autorizadas: 2,
          },
          {
            periodo: "MANHA",
            autorizadas: 3,
          },
          {
            periodo: "TARDE",
            autorizadas: 4,
          },
        ],
      },
    },
    {
      lote: "LOTE 12",
      unidade_educacional: "CEU CEMEI CORETO DE TAIPAS",
      tipo_unidade: "CEU CEMEI",
      classificacao: "Tipo A",
      total: 2,
      data: "12/02/2024",
      periodos: {
        turma_infantil: [
          {
            periodo: "INTEGRAL",
            autorizadas: 2,
          },
        ],
      },
    },
    {
      lote: "LOTE 12",
      unidade_educacional: "CEU CEMEI CORETO DE TAIPAS",
      tipo_unidade: "CEU CEMEI",
      classificacao: "Tipo A RESTRIÇÃO DE AMINOÁCIDOS",
      total: 2,
      data: "12/02/2024",
      periodos: {
        turma_infantil: [
          {
            periodo: "INTEGRAL",
            autorizadas: 2,
          },
        ],
      },
    },
  ],
};
