export const mockTermoRecebimentoDetalhe = {
  uuid: "termo-uuid-1",
  status: "ENVIADO_FISCAIS",
  status_display: "Enviado Fiscais",
  empresa: {
    uuid: "emp-1",
    cnpj: "22460700000100",
    nome_fantasia: "Empresa do Luis Zimmermann",
    razao_social: "Empresa do Luis Zimmermann",
  },
  contrato: {
    uuid: "cont-1",
    numero: "12345/22",
    processo: "123456789012",
    numero_pregao: "",
    numero_chamada_publica: "123456789",
    ata: "",
  },
  valor_contrato: "2000.00",
  cronogramas: [
    {
      cronograma: {
        uuid: "cron-1",
        numero: "135/2024",
        unidade_medida: { uuid: "um-1", nome: "QUILOGRAMA", abreviacao: "kg" },
        ficha_tecnica: {
          uuid: "ft-1",
          numero: "FT001",
          produto: { uuid: "prod-1", nome: "MANGA" },
        },
      },
      quantidade_total_recebida: "17.00",
    },
    {
      cronograma: {
        uuid: "cron-2",
        numero: "142/2024A",
        unidade_medida: { uuid: "um-1", nome: "QUILOGRAMA", abreviacao: "kg" },
        ficha_tecnica: {
          uuid: "ft-2",
          numero: "FT002",
          produto: { uuid: "prod-2", nome: "BANANA NANICA" },
        },
      },
      quantidade_total_recebida: "19.00",
    },
  ],
  fiscal_1: { uuid: "f1", nome: "QUALIDADE" },
  fiscal_2: { uuid: "f2", nome: "MARIANA SANTOS DE LIMA" },
  fiscal_3: { uuid: "f3", nome: "QUALIDADE" },
  texto_termo: "<p>Texto do termo de recebimento definitivo.</p>",
};
