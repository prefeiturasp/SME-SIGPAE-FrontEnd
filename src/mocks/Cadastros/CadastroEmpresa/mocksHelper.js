export const mockCEP = {
  cep: "00000-000",
  logradouro: "Rua Falsa",
  complemento: "",
  unidade: "",
  bairro: "Sumaré",
  localidade: "São Paulo",
  uf: "SP",
  estado: "São Paulo",
  regiao: "Sudeste",
  ibge: "4814",
  gia: "6551",
  ddd: "11",
  siafi: "8771",
};

export const mockContatos = [
  {
    nome: "email@email.com",
    telefone: "0000000000000",
    telefone2: "",
    celular: "",
    email: "email@email.com",
    eh_nutricionista: false,
    crn_numero: "",
  },
  {
    nome: "agroporto@admin.com",
    telefone: "11 9523 1130",
    telefone2: "",
    celular: "",
    email: "agroporto@admin.com",
    eh_nutricionista: true,
    crn_numero: "",
  },
  {
    nome: "fake_email@email.com",
    telefone: "0000000000000",
    telefone2: "",
    celular: "",
    email: "fake_email@email.com",
    eh_nutricionista: false,
    crn_numero: "",
  },
  {
    telefone: "0000000000000",
    telefone2: "",
    celular: "",
    email: "email@email.com",
    eh_nutricionista: false,
    crn_numero: "",
  },
];

export const mockContratos = [
  {
    edital: {
      uuid: "fbe7a546-fba5-497b-b12e-160311f46222",
      numero: "202020",
      tipo_contratacao: "202020",
      processo: "202020",
      objeto: "teste",
      eh_imr: true,
    },
    vigencias: [
      {
        uuid: "4546f904-4a24-4e2e-a3dd-d23f731a66ed",
        data_inicial: "04/12/2023",
        data_final: "28/03/2025",
        status: "ativo",
      },
    ],
    modalidade: {
      nome: "Pregão Eletrônico",
      uuid: "af1db044-4bc4-4e42-beed-a85a06ea7a26",
    },
    uuid: "79966033-3226-403e-9617-aa7e4c638c3a",
    numero: "54165871",
    processo: "71671365716",
    data_proposta: "04/12/2023",
    encerrado: false,
    data_hora_encerramento: "24/05/2024 10:23:32",
    ata: "12365",
    numero_pregao: "123655",
    numero_chamada_publica: "",
  },
  {
    edital: null,
    vigencias: [
      {
        uuid: "1c5d7450-e910-4c0d-98a3-ee3dbd452573",
        data_inicial: "07/01/2025",
        data_final: "16/01/2025",
        status: "proximo_ao_vencimento",
      },
    ],
    modalidade: {
      nome: "Carona de ATA",
      uuid: "e95ed025-f4cd-462e-a449-f56cc520431b",
    },
    uuid: "408cec65-fda4-44cb-b647-f4f3f6e18052",
    numero: "5656",
    processo: "8945.9849/8484848-4",
    data_proposta: null,
    encerrado: false,
    data_hora_encerramento: null,
    ata: "",
    numero_pregao: "",
    numero_chamada_publica: "",
  },
];

export const mockLotes = [
  {
    nome: "Lote 1",
    uuid: "1",
  },
];

export const mockNutricionistas = [
  {
    nome: "Nutri 1",
    crn_numero: "123",
    super_admin_terceirizadas: false,
    contatos: [],
  },
  {
    nome: "Nutri 2",
    crn_numero: "456",
    super_admin_terceirizadas: true,
    contatos: [
      {
        telefone: "(11) 11111-1111",
        email: "email@email.com",
      },
    ],
  },
];
