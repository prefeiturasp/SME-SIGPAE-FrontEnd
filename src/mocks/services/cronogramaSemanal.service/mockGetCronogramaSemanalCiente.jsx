export const mockGetCronogramaSemanalCiente = {
  uuid: "1ee7d12a-af69-481c-8486-c67a22d10b09",
  numero: "009/2026",
  status: "Fornecedor Ciente",
  observacoes: "",
  cronograma_mensal: {
    uuid: "e10b7e33-7763-42da-8071-d9a06ec04849",
    numero: "001/2026P",
    empresa: {
      uuid: "d0630b2b-8e45-472c-b9c6-90451b60b081",
      nome_fantasia: "JP Alimentos",
      razao_social: "JP Alimentos LTDA",
    },
    contrato: {
      edital: {
        uuid: "8b12fb07-ede8-4765-a5f7-56201a723e7a",
        numero: "78/SME/2016",
        tipo_contratacao: "Pregão eletrônico",
        processo: "6016.2016/0003098-3",
        objeto:
          "Contratação de empresa especializada para a prestação de serviço de nutrição e alimentação escolar, visando ao preparo e à distribuição de alimentação balanceada e em condições higiênico-sanitárias adequadas, que atendam aos padrões nutricionais e dispositivos legais vigentes, aos alunos regularmente matriculados e demais beneficiários de programas/projetos da Secretaria Municipal de Educação, em Unidades Educacionais da rede municipal de ensino, mediante o fornecimento de todos os gêneros alimentícios e demais insumos necessários, dos serviços de logística, supervisão e manutenção preventiva e corretiva dos equipamentos utilizados, fornecimento de mão de obra treinada para a preparação dos alimentos, distribuição, controle, limpeza e higienização de cozinhas, despensas e lactários das unidades educacionais.\n \nContratos relacionados\nContrato n°:\nTC Nº 38/SME/CODAE/2017\nvigência:\n11/11/2020 até 11/12/2020\nProcesso administrativo do contrato:",
        eh_imr: false,
      },
      vigencias: [
        {
          uuid: "6712195f-2a97-4ba0-a6e9-1236cc595908",
          data_inicial: "17/02/2023",
          data_final: "15/12/2023",
          status: "vencido",
        },
      ],
      modalidade: {
        nome: "Pregão Eletrônico",
        uuid: "215dc344-8411-4c9d-afdf-c80112a30399",
      },
      programa_display: "Alimentação Escolar",
      uuid: "387121e0-f887-4ecf-9521-00c519e9830d",
      numero: "837834",
      processo: "834783478",
      data_proposta: null,
      encerrado: false,
      data_hora_encerramento: "25/09/2023 18:01:47",
      ata: "54321",
      numero_pregao: "12345",
      numero_chamada_publica: "",
      programa: "ALIMENTACAO_ESCOLAR",
    },
    numero_empenho: "12345",
    qtd_total_empenho: 1200.0,
    custo_unitario_produto: 20.0,
    unidade_medida: {
      uuid: "9fec9127-c22f-49c5-b8f4-633039bc6b7f",
      nome: "QUILOGRAMA",
      abreviacao: "kg",
      criado_em: "26/07/2023 15:46:06",
    },
    produto: {
      uuid: "4a5906f5-200a-4d3c-ab8a-1518f3bd14ee",
      nome: "DOCE DE BANANA",
    },
  },
  programacoes: [
    {
      mes_programado: "05/2026",
      data_inicio: "12/05/2026",
      data_fim: "14/05/2026",
      quantidade: 1200.0,
    },
  ],
  logs: [
    {
      status_evento_explicacao: "Fornecedor Ciente",
      usuario: {
        uuid: "9f34bc68-ae58-41b1-a605-189824c9f7ef",
        nome: "FORNECEDOR ADMIN",
      },
      criado_em: "29/04/2026 09:35:10",
      justificativa: "",
    },
  ],
};
