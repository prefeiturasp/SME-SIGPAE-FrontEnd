export const mockGetHistoricoDietasEMEBSeCEUGESTAO = {
  next: "http://hom-sigpae.sme.prefeitura.sp.gov.br/solicitacoes-dieta-especial/relatorio-historico-dieta-especial/?data=24%2F08%2F2023&page=4&page_size=2&unidades_educacionais_selecionadas%5B%5D=3c32be8e-f191-468d-a4e2-3dd8751e5e7a&unidades_educacionais_selecionadas%5B%5D=e675739f-534c-4bdf-8bbd-3fb037e98d73&unidades_educacionais_selecionadas%5B%5D=dfba8f77-712b-4197-9dc3-9248f7237bed&unidades_educacionais_selecionadas%5B%5D=01954441-c64e-4c53-987a-ad1b97450eae&unidades_educacionais_selecionadas%5B%5D=49e6bf7f-36ad-418b-a5ec-2b03442aba22&unidades_educacionais_selecionadas%5B%5D=e02c0499-62e1-4115-a4eb-3c4fb108ac84&unidades_educacionais_selecionadas%5B%5D=61c4812e-82ae-4387-aa33-e1f0f42d6163",
  previous:
    "http://hom-sigpae.sme.prefeitura.sp.gov.br/solicitacoes-dieta-especial/relatorio-historico-dieta-especial/?data=24%2F08%2F2023&page=2&page_size=2&unidades_educacionais_selecionadas%5B%5D=3c32be8e-f191-468d-a4e2-3dd8751e5e7a&unidades_educacionais_selecionadas%5B%5D=e675739f-534c-4bdf-8bbd-3fb037e98d73&unidades_educacionais_selecionadas%5B%5D=dfba8f77-712b-4197-9dc3-9248f7237bed&unidades_educacionais_selecionadas%5B%5D=01954441-c64e-4c53-987a-ad1b97450eae&unidades_educacionais_selecionadas%5B%5D=49e6bf7f-36ad-418b-a5ec-2b03442aba22&unidades_educacionais_selecionadas%5B%5D=e02c0499-62e1-4115-a4eb-3c4fb108ac84&unidades_educacionais_selecionadas%5B%5D=61c4812e-82ae-4387-aa33-e1f0f42d6163",
  count: 7,
  page_size: 2,
  results: [
    {
      total_dietas: 198,
      data: "24/08/2023",
      resultado: [
        {
          lote: "3567-3",
          unidade_educacional:
            "CEU GESTAO MENINOS - ARTUR ALBERTO DE MOTA GONCALVES, PROF. PR.",
          tipo_unidade: "CEU GESTAO",
          classificacao_dieta: [
            {
              tipo: "Tipo A",
              total: 10,
            },
            {
              tipo: "Tipo B",
              total: 10,
            },
            {
              tipo: "Tipo C",
              total: 10,
            },
            {
              tipo: "Tipo A RESTRIÇÃO DE AMINOÁCIDOS",
              total: 10,
            },
            {
              tipo: "Tipo A ENTERAL",
              total: 10,
            },
          ],
        },
        {
          lote: "LOTE 12",
          unidade_educacional: "EMEBS VERA LUCIA APARECIDA RIBEIRO, PROFA.",
          tipo_unidade: "EMEBS",
          classificacao_dieta: [
            {
              tipo: "Tipo A",
              total: 3,
              periodos: {
                infantil: [
                  {
                    periodo: "MANHA",
                    autorizadas: 3,
                  },
                ],
              },
            },
          ],
        },
      ],
    },
  ],
};
