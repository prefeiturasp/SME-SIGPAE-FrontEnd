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
