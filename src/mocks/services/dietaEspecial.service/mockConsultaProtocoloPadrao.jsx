export const mockNomesProtocolos = {
  results: [
    "ALERGIA A CAMARÃO",
    "ALERGIA A OVO",
    "INTOLERÂNCIA À LACTOSE",
    "DIABETES MELLITUS",
  ],
};

export const mockConsultaProtocoloPadrao = {
  count: 12,
  next: "http://localhost:8000/protocolo-padrao-dieta-especial/?page=2",
  previous: null,
  results: [
    {
      uuid: "7c65da52-571c-4764-b79a-657c1333d1be",
      nome_protocolo: "ALERGIA A CAMARÃO",
      status: "Liberado",
      editais: [
        { uuid: "752c11a3-b4fe-4f1c-b9af-61d42f0a6b56", numero: "1" },
        {
          uuid: "0563c540-a7c4-48fa-9cb6-e81c2c43cccb",
          numero: "456/SME2024",
        },
      ],
      orientacoes_gerais: "<p>Não servir alimentos com camarão.</p>",
      outras_informacoes: "<p>Atenção a molhos industrializados.</p>",
      historico: [],
      substituicoes: [
        {
          alimento: { nome: "CAMARÃO" },
          tipo: "Substituir",
          alimentos_substitutos: [{ nome: "FRANGO" }],
          substitutos: [{ nome: "PEIXE" }],
        },
      ],
    },
    {
      uuid: "a42ca4fc-850d-4f16-a81b-3a99bdd59d46",
      nome_protocolo: "INTOLERÂNCIA À LACTOSE",
      status: "Não liberado",
      editais: [{ uuid: "752c11a3-b4fe-4f1c-b9af-61d42f0a6b56", numero: "1" }],
      orientacoes_gerais: "<p>Evitar leite e derivados.</p>",
      outras_informacoes: "",
      historico: [],
      substituicoes: [],
    },
  ],
};

export const mockConsultaProtocoloPadraoPagina2 = {
  count: 12,
  next: null,
  previous: "http://localhost:8000/protocolo-padrao-dieta-especial/?page=1",
  results: [
    {
      uuid: "e0b2f9b4-4c1e-4f39-9c7f-3d1c8a7a5b21",
      nome_protocolo: "DIABETES MELLITUS",
      status: "Liberado",
      editais: [
        {
          uuid: "176294b8-7ac3-46a1-ae57-67da66d4fb4a",
          numero: "PARCEIRA",
        },
      ],
      orientacoes_gerais: "<p>Controlar a oferta de açúcares.</p>",
      outras_informacoes: "",
      historico: [],
      substituicoes: [],
    },
  ],
};
