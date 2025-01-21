import {
  mockContatos,
  mockContratos,
  mockLotes,
  mockNutricionistas,
} from "./mocksHelper";

export const mockEmpresa = {
  tipo_alimento_display: "FLVO",
  tipo_empresa_display: "Convencional",
  tipo_servico_display: "Fornecedor e Distribuidor",
  nutricionistas: mockNutricionistas,
  contatos: mockContatos,
  contratos: mockContratos,
  lotes: mockLotes,
  quantidade_alunos: 0,
  id_externo: "4A206",
  ativo: true,
  uuid: "4a206eed-42f5-4b7f-9a91-404df255f337",
  nome_fantasia: "Agroporto",
  razao_social: "Agro Comercial Porto S.A.",
  cnpj: "10558126000130",
  representante_legal: "",
  representante_telefone: "",
  representante_email: "",
  endereco: "Avenida Engenheiro Roberto Zuccolo",
  cep: "05307190",
  bairro: "Jardim Humaitá",
  cidade: "São Paulo",
  estado: "SP",
  numero: "",
  complemento: "",
  responsavel_nome: "Bruno",
  responsavel_email: "agroporto@admin.com",
  responsavel_cpf: "02434368077",
  responsavel_telefone: "0000000000000",
  responsavel_cargo: "asdfd",
  tipo_empresa: "CONVENCIONAL",
  tipo_servico: "FORNECEDOR_E_DISTRIBUIDOR",
  tipo_alimento: "FLVO",
  criado_em: "18/05/2022 1:3:34",
};

export const mockEmpresaSemNutri = { ...mockEmpresa, nutricionistas: [] };

export const mockContratosCadastrados = {
  numeros_contratos_cadastrados: [
    "12345/22",
    "21/SME/CODAE/2023",
    "18/SME/CODAE/2023",
  ],
};

export const mockListaModalidades = [
  {
    nome: "Pregão Eletrônico",
    uuid: "af1db044-4asd-4e42-beed-a85a06ea7a26",
  },
  {
    nome: "Chamada Pública",
    uuid: "79a36cbf-111b-406c-d8ug-02d3aa2356b0",
  },
  {
    nome: "Emergencial",
    uuid: "318e02ae-92e4-4fb1-ad73-0eef4ac8bc06",
  },
  {
    nome: "Contratação Direta",
    uuid: "926d6e74-80fd-49d6-dfbg-5a1574f3843e",
  },
  {
    nome: "Carona de ATA",
    uuid: "e95ed025-f9ca-462e-a449-f56cc520431b",
  },
];
