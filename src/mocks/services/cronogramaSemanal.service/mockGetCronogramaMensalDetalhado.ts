import { CronogramaMensalDetalhado } from "src/interfaces/cronograma_semanal.interface";

export const mockCronogramaMensalDetalhado: CronogramaMensalDetalhado = {
  uuid: "cronograma-uuid-1",
  numero: "CR-001/2024",
  empresa: {
    uuid: "empresa-uuid-1",
    nome_fantasia: "Hortifruti São Paulo LTDA",
  },
  contrato: {
    uuid: "contrato-uuid-1",
    numero: "0001/2024",
    processo: "2024/00001",
    numero_pregao: "Pregão 001/2024",
    ata: "Ata 001/2024",
    numero_chamada_publica: "",
  },
  ficha_tecnica: {
    uuid: "ficha-uuid-1",
    produto: {
      uuid: "produto-uuid-1",
      nome: "Alface Crespa",
    },
  },
  numero_empenho: "EMP-001/2024",
  qtd_total_empenho: 1000.0,
  custo_unitario_produto: 5.5,
  etapas: [
    {
      uuid: "etapa-uuid-1",
      data_programada: "03/2026",
      quantidade: 500.0,
    },
    {
      uuid: "etapa-uuid-2",
      data_programada: "04/2026",
      quantidade: 500.0,
    },
  ],
};

export const mockCronogramaMensalDetalhadoComEtapasMultiplas: CronogramaMensalDetalhado =
  {
    uuid: "cronograma-uuid-2",
    numero: "CR-002/2024",
    empresa: {
      uuid: "empresa-uuid-2",
      nome_fantasia: "Hortifruti Minas Gerais",
    },
    contrato: {
      uuid: "contrato-uuid-2",
      numero: "0002/2024",
      processo: "2024/00002",
      numero_pregao: "",
      ata: "",
      numero_chamada_publica: "CP-001/2024",
    },
    ficha_tecnica: {
      uuid: "ficha-uuid-2",
      produto: {
        uuid: "produto-uuid-2",
        nome: "Tomate Italiano",
      },
    },
    numero_empenho: "EMP-002/2024",
    qtd_total_empenho: 2000.0,
    custo_unitario_produto: 8.75,
    etapas: [
      {
        uuid: "etapa-uuid-3",
        data_programada: "01/2026",
        quantidade: 400.0,
      },
      {
        uuid: "etapa-uuid-4",
        data_programada: "02/2026",
        quantidade: 600.0,
      },
      {
        uuid: "etapa-uuid-5",
        data_programada: "03/2026",
        quantidade: 500.0,
      },
      {
        uuid: "etapa-uuid-6",
        data_programada: "04/2026",
        quantidade: 500.0,
      },
    ],
  };
