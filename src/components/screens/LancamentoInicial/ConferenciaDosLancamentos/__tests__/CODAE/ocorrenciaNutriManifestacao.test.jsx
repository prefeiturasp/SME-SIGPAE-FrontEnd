import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { TIPO_PERFIL } from "src/constants/shared";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockVinculosTipoAlimentacaoPeriodoEscolarEMEF } from "src/mocks/services/cadastroTipoAlimentacao.service/EMEF/vinculosTipoAlimentacaoPeriodoEscolar";
import { mockSolicitacaoMedicaoInicialSemLancamentoEMEFJunho2025 } from "src/mocks/services/medicaoInicial/solicitacaoMedicaoinicial.service/EMEF/Junho2025/solicitacaoMedicaoInicialSemLancamento";
import { ConferenciaDosLancamentosPage } from "src/pages/LancamentoMedicaoInicial/ConferenciaDosLancamentosPage";
import mock from "src/services/_mock";
import preview from "jest-preview";

jest.mock("src/components/Shareable/CKEditorField", () => ({
  __esModule: true,
  default: () => (
    <textarea
      data-testid="ckeditor-mock"
      name="justificativa"
      required={false}
    />
  ),
}));

const meusDados = {
  uuid: "aeecdcd7-db7e-4a01-b00d-6153ef9c8830",
  cpf: "89237238002",
  nome: "NUTRI MANIFESTACAO ADMIN",
  email: "nutricionistamanifestacao@admin.com",
  tipo_email: null,
  registro_funcional: "6348945",
  tipo_usuario: "nutricao_manifestacao",
  date_joined: "03/02/2022 13:00:59",
  vinculo_atual: {
    uuid: "a6ab266d-96c2-4236-8962-e35fcf861c07",
    instituicao: {
      nome: "CODAE - NUTRIMANIFESTAÇÃO",
      uuid: "6bbd867a-d741-4745-91c2-39658e5b00c0",
      codigo_eol: null,
      quantidade_alunos: 971330,
      lotes: [],
      periodos_escolares: null,
      diretoria_regional: null,
      tipo_unidade_escolar: null,
      tipo_unidade_escolar_iniciais: null,
      tipo_gestao: null,
      tipo_gestao_uuid: null,
      tipos_contagem: null,
      endereco: null,
      contato: null,
      acesso_modulo_medicao_inicial: false,
      quantidade_alunos_terceirizada: 427870,
      quantidade_alunos_parceira: 243202,
    },
    perfil: {
      nome: "COORDENADOR_SUPERVISAO_NUTRICAO_MANIFESTACAO",
      visao: "CODAE",
      uuid: "3b3d3a2d-82cb-4a27-8a0f-83aaf5999e31",
    },
    ativo: true,
  },
  crn_numero: null,
  cargo: "COORDENADOR",
  aceitou_termos: true,
};

const periodosGruposMedicao = [
  {
    uuid_medicao_periodo_grupo: "4be0b916-679b-4a05-8f3d-d0da42bd2ad5",
    nome_periodo_grupo: "MANHA",
    periodo_escolar: "MANHA",
    grupo: null,
    status: "MEDICAO_APROVADA_PELA_DRE",
    logs: [
      {
        status_evento_explicacao: "Enviado pela UE",
        usuario: {
          uuid: "36750ded-5790-433e-b765-0507303828df",
          cpf: null,
          nome: "ESCOLA EMEF ADMIN",
          email: "escolaemef@admin.com",
          date_joined: "10/07/2020 13:15:23",
          registro_funcional: "8115257",
          tipo_usuario: "escola",
          cargo: "ANALISTA DE SAUDE NIVEL II",
          crn_numero: null,
          nome_fantasia: null,
        },
        criado_em: "03/02/2026 20:02:24",
        descricao: "Medição #4BE0B -- MANHA -- 09/2025",
        justificativa: "",
        resposta_sim_nao: false,
      },
      {
        status_evento_explicacao: "Aprovado pela DRE",
        usuario: {
          uuid: "a4f08910-44e1-4828-99f4-d008cb79753c",
          cpf: null,
          nome: "DRE ADMIN",
          email: "dre@admin.com",
          date_joined: "10/07/2020 13:15:12",
          registro_funcional: "0000010",
          tipo_usuario: "diretoriaregional",
          cargo: "COGESTOR",
          crn_numero: null,
          nome_fantasia: null,
        },
        criado_em: "04/02/2026 10:55:46",
        descricao: "Medição #4BE0B -- MANHA -- 09/2025",
        justificativa: "",
        resposta_sim_nao: false,
      },
    ],
  },
  {
    uuid_medicao_periodo_grupo: "dbbb5e2f-2f23-4a11-8f93-e9033f6519b3",
    nome_periodo_grupo: "TARDE",
    periodo_escolar: "TARDE",
    grupo: null,
    status: "MEDICAO_APROVADA_PELA_DRE",
    logs: [
      {
        status_evento_explicacao: "Enviado pela UE",
        usuario: {
          uuid: "36750ded-5790-433e-b765-0507303828df",
          cpf: null,
          nome: "ESCOLA EMEF ADMIN",
          email: "escolaemef@admin.com",
          date_joined: "10/07/2020 13:15:23",
          registro_funcional: "8115257",
          tipo_usuario: "escola",
          cargo: "ANALISTA DE SAUDE NIVEL II",
          crn_numero: null,
          nome_fantasia: null,
        },
        criado_em: "03/02/2026 20:02:25",
        descricao: "Medição #DBBB5 -- TARDE -- 09/2025",
        justificativa: "",
        resposta_sim_nao: false,
      },
      {
        status_evento_explicacao: "Aprovado pela DRE",
        usuario: {
          uuid: "a4f08910-44e1-4828-99f4-d008cb79753c",
          cpf: null,
          nome: "DRE ADMIN",
          email: "dre@admin.com",
          date_joined: "10/07/2020 13:15:12",
          registro_funcional: "0000010",
          tipo_usuario: "diretoriaregional",
          cargo: "COGESTOR",
          crn_numero: null,
          nome_fantasia: null,
        },
        criado_em: "04/02/2026 10:55:43",
        descricao: "Medição #DBBB5 -- TARDE -- 09/2025",
        justificativa: "",
        resposta_sim_nao: false,
      },
    ],
  },
  {
    uuid_medicao_periodo_grupo: "0c6bfbff-97bd-4046-ac93-527e3467b785",
    nome_periodo_grupo: "INTEGRAL",
    periodo_escolar: "INTEGRAL",
    grupo: null,
    status: "MEDICAO_APROVADA_PELA_DRE",
    logs: [
      {
        status_evento_explicacao: "Enviado pela UE",
        usuario: {
          uuid: "36750ded-5790-433e-b765-0507303828df",
          cpf: null,
          nome: "ESCOLA EMEF ADMIN",
          email: "escolaemef@admin.com",
          date_joined: "10/07/2020 13:15:23",
          registro_funcional: "8115257",
          tipo_usuario: "escola",
          cargo: "ANALISTA DE SAUDE NIVEL II",
          crn_numero: null,
          nome_fantasia: null,
        },
        criado_em: "03/02/2026 20:02:25",
        descricao: "Medição #0C6BF -- INTEGRAL -- 09/2025",
        justificativa: "",
        resposta_sim_nao: false,
      },
      {
        status_evento_explicacao: "Aprovado pela DRE",
        usuario: {
          uuid: "a4f08910-44e1-4828-99f4-d008cb79753c",
          cpf: null,
          nome: "DRE ADMIN",
          email: "dre@admin.com",
          date_joined: "10/07/2020 13:15:12",
          registro_funcional: "0000010",
          tipo_usuario: "diretoriaregional",
          cargo: "COGESTOR",
          crn_numero: null,
          nome_fantasia: null,
        },
        criado_em: "04/02/2026 10:55:40",
        descricao: "Medição #0C6BF -- INTEGRAL -- 09/2025",
        justificativa: "",
        resposta_sim_nao: false,
      },
    ],
  },
  {
    uuid_medicao_periodo_grupo: "601bb140-8520-4f96-9487-a898c25a7d08",
    nome_periodo_grupo: "NOITE",
    periodo_escolar: "NOITE",
    grupo: null,
    status: "MEDICAO_APROVADA_PELA_DRE",
    logs: [
      {
        status_evento_explicacao: "Enviado pela UE",
        usuario: {
          uuid: "36750ded-5790-433e-b765-0507303828df",
          cpf: null,
          nome: "ESCOLA EMEF ADMIN",
          email: "escolaemef@admin.com",
          date_joined: "10/07/2020 13:15:23",
          registro_funcional: "8115257",
          tipo_usuario: "escola",
          cargo: "ANALISTA DE SAUDE NIVEL II",
          crn_numero: null,
          nome_fantasia: null,
        },
        criado_em: "03/02/2026 20:02:25",
        descricao: "Medição #601BB -- NOITE -- 09/2025",
        justificativa: "",
        resposta_sim_nao: false,
      },
      {
        status_evento_explicacao: "Aprovado pela DRE",
        usuario: {
          uuid: "a4f08910-44e1-4828-99f4-d008cb79753c",
          cpf: null,
          nome: "DRE ADMIN",
          email: "dre@admin.com",
          date_joined: "10/07/2020 13:15:12",
          registro_funcional: "0000010",
          tipo_usuario: "diretoriaregional",
          cargo: "COGESTOR",
          crn_numero: null,
          nome_fantasia: null,
        },
        criado_em: "04/02/2026 10:58:13",
        descricao: "Medição #601BB -- NOITE -- 09/2025",
        justificativa: "",
        resposta_sim_nao: false,
      },
    ],
  },
];

const medicao = {
  escola: "EMEF PERICLES EUGENIO DA SILVA RAMOS",
  escola_uuid: "3c32be8e-f191-468d-a4e2-3dd8751e5e7a",
  tipos_contagem_alimentacao: [],
  responsaveis: [
    {
      nome: "Responsavel AAAA",
      rf: "1111111",
    },
  ],
  ocorrencia: {
    logs: [
      {
        anexos: [
          {
            nome: "arquivo_adesao.xlsx",
            arquivo: "/media/d40a8a38-b8fb-44af-b3bf-8a977f84ea8b.xlsx",
            arquivo_url:
              "http://localhost:8000/media/d40a8a38-b8fb-44af-b3bf-8a977f84ea8b.xlsx",
          },
          {
            nome: "Protocolo FERNANDA PALHA SANTOS RODRIGUES.pdf",
            arquivo: "/media/0ef8a250-586b-41dc-beb7-660e0fbbaee9.pdf",
            arquivo_url:
              "http://localhost:8000/media/0ef8a250-586b-41dc-beb7-660e0fbbaee9.pdf",
          },
        ],
        status_evento_explicacao: "Enviado pela UE",
        usuario: {
          uuid: "36750ded-5790-433e-b765-0507303828df",
          cpf: null,
          nome: "ESCOLA EMEF ADMIN",
          email: "escolaemef@admin.com",
          date_joined: "10/07/2020 13:15:23",
          registro_funcional: "8115257",
          tipo_usuario: "escola",
          cargo: "ANALISTA DE SAUDE NIVEL II",
          crn_numero: null,
          nome_fantasia: null,
        },
        criado_em: "03/02/2026 20:02:24",
        descricao:
          "Ocorrência cf9da872-77ee-4125-b8e4-2c2aed96dd84 da Solicitação de Medição Inicial aad6565e-0a08-482b-8a74-2aeba0c03110",
        justificativa: "",
        resposta_sim_nao: false,
        tipo_solicitacao_explicacao: "Solicitação de medição inicial",
      },
      {
        anexos: [],
        status_evento_explicacao: "Aprovado pela DRE",
        usuario: {
          uuid: "a4f08910-44e1-4828-99f4-d008cb79753c",
          cpf: null,
          nome: "DRE ADMIN",
          email: "dre@admin.com",
          date_joined: "10/07/2020 13:15:12",
          registro_funcional: "0000010",
          tipo_usuario: "diretoriaregional",
          cargo: "COGESTOR",
          crn_numero: null,
          nome_fantasia: null,
        },
        criado_em: "04/02/2026 10:55:28",
        descricao:
          "Ocorrência cf9da872-77ee-4125-b8e4-2c2aed96dd84 da Solicitação de Medição Inicial aad6565e-0a08-482b-8a74-2aeba0c03110",
        justificativa: "",
        resposta_sim_nao: false,
        tipo_solicitacao_explicacao: "Solicitação de medição inicial",
      },
    ],
    ultimo_arquivo:
      "http://localhost:8000/media/679bf5ad-a9db-4c47-91f2-976b044ebff2.pdf",
    ultimo_arquivo_excel:
      "http://localhost:8000/media/d40a8a38-b8fb-44af-b3bf-8a977f84ea8b.xlsx",
    status: "MEDICAO_APROVADA_PELA_DRE",
    uuid: "cf9da872-77ee-4125-b8e4-2c2aed96dd84",
    nome_ultimo_arquivo: "Protocolo FERNANDA PALHA SANTOS RODRIGUES.pdf",
    rastro_lote: null,
    rastro_terceirizada: null,
    solicitacao_medicao_inicial: 533,
  },
  logs: [
    {
      status_evento_explicacao: "Em aberto para preenchimento pela UE",
      usuario: {
        uuid: "36750ded-5790-433e-b765-0507303828df",
        cpf: null,
        nome: "ESCOLA EMEF ADMIN",
        email: "escolaemef@admin.com",
        date_joined: "10/07/2020 13:15:23",
        registro_funcional: "8115257",
        tipo_usuario: "escola",
        cargo: "ANALISTA DE SAUDE NIVEL II",
        crn_numero: null,
        nome_fantasia: null,
      },
      criado_em: "06/10/2025 11:39:50",
      descricao:
        "Solicitação #AAD65 -- Escola EMEF PERICLES EUGENIO DA SILVA RAMOS -- 09/2025",
      justificativa: "",
      resposta_sim_nao: false,
    },
    {
      status_evento_explicacao: "Enviado pela UE",
      usuario: {
        uuid: "36750ded-5790-433e-b765-0507303828df",
        cpf: null,
        nome: "ESCOLA EMEF ADMIN",
        email: "escolaemef@admin.com",
        date_joined: "10/07/2020 13:15:23",
        registro_funcional: "8115257",
        tipo_usuario: "escola",
        cargo: "ANALISTA DE SAUDE NIVEL II",
        crn_numero: null,
        nome_fantasia: null,
      },
      criado_em: "03/02/2026 20:02:20",
      descricao:
        "Solicitação #AAD65 -- Escola EMEF PERICLES EUGENIO DA SILVA RAMOS -- 09/2025",
      justificativa: "",
      resposta_sim_nao: false,
    },
    {
      status_evento_explicacao: "Aprovado pela DRE",
      usuario: {
        uuid: "a4f08910-44e1-4828-99f4-d008cb79753c",
        cpf: null,
        nome: "DRE ADMIN",
        email: "dre@admin.com",
        date_joined: "10/07/2020 13:15:12",
        registro_funcional: "0000010",
        tipo_usuario: "diretoriaregional",
        cargo: "COGESTOR",
        crn_numero: null,
        nome_fantasia: null,
      },
      criado_em: "04/02/2026 10:55:50",
      descricao:
        "Solicitação #AAD65 -- Escola EMEF PERICLES EUGENIO DA SILVA RAMOS -- 09/2025",
      justificativa: "",
      resposta_sim_nao: false,
    },
  ],
  alunos_periodo_parcial: [],
  historico: null,
  escola_eh_emebs: false,
  escola_cei_com_inclusao_parcial_autorizada: false,
  escola_possui_alunos_regulares: true,
  sem_lancamentos: false,
  justificativa_sem_lancamentos: null,
  justificativa_codae_correcao_sem_lancamentos: null,
  recreio_nas_ferias: null,
  criado_em: "06/10/2025 11:39:49",
  uuid: "aad6565e-0a08-482b-8a74-2aeba0c03110",
  ano: "2025",
  mes: "09",
  status: "MEDICAO_APROVADA_PELA_DRE",
  com_ocorrencias: true,
  ue_possui_alunos_periodo_parcial: false,
  logs_salvos: true,
  dre_ciencia_correcao_data: null,
  rastro_lote: 21,
  rastro_terceirizada: 5,
  dre_ciencia_correcao_usuario: null,
  relatorio_financeiro: null,
};

const diasCalendario = [
  {
    escola: "EMEF PERICLES EUGENIO DA SILVA RAMOS",
    dia: "01",
    periodo_escolar: null,
    criado_em: "06/10/2025 09:27:13",
    alterado_em: "03/02/2026 18:08:56",
    data: "01/09/2025",
    dia_letivo: true,
  },
  {
    escola: "EMEF PERICLES EUGENIO DA SILVA RAMOS",
    dia: "02",
    periodo_escolar: null,
    criado_em: "03/02/2026 18:07:28",
    alterado_em: "03/02/2026 18:08:57",
    data: "02/09/2025",
    dia_letivo: true,
  },
  {
    escola: "EMEF PERICLES EUGENIO DA SILVA RAMOS",
    dia: "03",
    periodo_escolar: null,
    criado_em: "03/02/2026 18:07:28",
    alterado_em: "03/02/2026 18:08:57",
    data: "03/09/2025",
    dia_letivo: true,
  },
  {
    escola: "EMEF PERICLES EUGENIO DA SILVA RAMOS",
    dia: "04",
    periodo_escolar: null,
    criado_em: "03/02/2026 18:07:28",
    alterado_em: "03/02/2026 18:08:57",
    data: "04/09/2025",
    dia_letivo: true,
  },
  {
    escola: "EMEF PERICLES EUGENIO DA SILVA RAMOS",
    dia: "05",
    periodo_escolar: null,
    criado_em: "03/02/2026 18:07:28",
    alterado_em: "03/02/2026 18:08:57",
    data: "05/09/2025",
    dia_letivo: true,
  },
  {
    escola: "EMEF PERICLES EUGENIO DA SILVA RAMOS",
    dia: "06",
    periodo_escolar: null,
    criado_em: "03/02/2026 18:07:28",
    alterado_em: "03/02/2026 18:08:57",
    data: "06/09/2025",
    dia_letivo: false,
  },
  {
    escola: "EMEF PERICLES EUGENIO DA SILVA RAMOS",
    dia: "07",
    periodo_escolar: null,
    criado_em: "03/02/2026 18:07:29",
    alterado_em: "03/02/2026 18:08:57",
    data: "07/09/2025",
    dia_letivo: false,
  },
  {
    escola: "EMEF PERICLES EUGENIO DA SILVA RAMOS",
    dia: "08",
    periodo_escolar: null,
    criado_em: "03/02/2026 18:07:29",
    alterado_em: "03/02/2026 18:08:57",
    data: "08/09/2025",
    dia_letivo: true,
  },
  {
    escola: "EMEF PERICLES EUGENIO DA SILVA RAMOS",
    dia: "09",
    periodo_escolar: null,
    criado_em: "03/02/2026 18:07:29",
    alterado_em: "03/02/2026 18:08:57",
    data: "09/09/2025",
    dia_letivo: true,
  },
  {
    escola: "EMEF PERICLES EUGENIO DA SILVA RAMOS",
    dia: "10",
    periodo_escolar: null,
    criado_em: "03/02/2026 18:07:29",
    alterado_em: "03/02/2026 18:08:57",
    data: "10/09/2025",
    dia_letivo: true,
  },
  {
    escola: "EMEF PERICLES EUGENIO DA SILVA RAMOS",
    dia: "11",
    periodo_escolar: null,
    criado_em: "03/02/2026 18:07:29",
    alterado_em: "03/02/2026 18:11:33",
    data: "11/09/2025",
    dia_letivo: true,
  },
  {
    escola: "EMEF PERICLES EUGENIO DA SILVA RAMOS",
    dia: "12",
    periodo_escolar: null,
    criado_em: "03/02/2026 18:07:29",
    alterado_em: "03/02/2026 18:11:33",
    data: "12/09/2025",
    dia_letivo: true,
  },
  {
    escola: "EMEF PERICLES EUGENIO DA SILVA RAMOS",
    dia: "13",
    periodo_escolar: null,
    criado_em: "03/02/2026 18:07:29",
    alterado_em: "03/02/2026 18:08:58",
    data: "13/09/2025",
    dia_letivo: false,
  },
  {
    escola: "EMEF PERICLES EUGENIO DA SILVA RAMOS",
    dia: "14",
    periodo_escolar: null,
    criado_em: "03/02/2026 18:07:29",
    alterado_em: "03/02/2026 18:08:58",
    data: "14/09/2025",
    dia_letivo: false,
  },
  {
    escola: "EMEF PERICLES EUGENIO DA SILVA RAMOS",
    dia: "15",
    periodo_escolar: null,
    criado_em: "03/02/2026 18:07:29",
    alterado_em: "03/02/2026 18:08:58",
    data: "15/09/2025",
    dia_letivo: true,
  },
  {
    escola: "EMEF PERICLES EUGENIO DA SILVA RAMOS",
    dia: "16",
    periodo_escolar: null,
    criado_em: "03/02/2026 18:07:29",
    alterado_em: "03/02/2026 18:08:58",
    data: "16/09/2025",
    dia_letivo: true,
  },
  {
    escola: "EMEF PERICLES EUGENIO DA SILVA RAMOS",
    dia: "17",
    periodo_escolar: null,
    criado_em: "03/02/2026 18:07:29",
    alterado_em: "03/02/2026 18:08:58",
    data: "17/09/2025",
    dia_letivo: true,
  },
  {
    escola: "EMEF PERICLES EUGENIO DA SILVA RAMOS",
    dia: "18",
    periodo_escolar: null,
    criado_em: "03/02/2026 18:07:30",
    alterado_em: "03/02/2026 18:08:58",
    data: "18/09/2025",
    dia_letivo: true,
  },
  {
    escola: "EMEF PERICLES EUGENIO DA SILVA RAMOS",
    dia: "19",
    periodo_escolar: null,
    criado_em: "03/02/2026 18:07:30",
    alterado_em: "03/02/2026 18:08:58",
    data: "19/09/2025",
    dia_letivo: true,
  },
  {
    escola: "EMEF PERICLES EUGENIO DA SILVA RAMOS",
    dia: "20",
    periodo_escolar: null,
    criado_em: "03/02/2026 18:07:30",
    alterado_em: "03/02/2026 18:08:58",
    data: "20/09/2025",
    dia_letivo: false,
  },
  {
    escola: "EMEF PERICLES EUGENIO DA SILVA RAMOS",
    dia: "21",
    periodo_escolar: null,
    criado_em: "03/02/2026 18:07:30",
    alterado_em: "03/02/2026 18:08:58",
    data: "21/09/2025",
    dia_letivo: false,
  },
  {
    escola: "EMEF PERICLES EUGENIO DA SILVA RAMOS",
    dia: "22",
    periodo_escolar: null,
    criado_em: "03/02/2026 18:07:30",
    alterado_em: "03/02/2026 18:08:58",
    data: "22/09/2025",
    dia_letivo: true,
  },
  {
    escola: "EMEF PERICLES EUGENIO DA SILVA RAMOS",
    dia: "23",
    periodo_escolar: null,
    criado_em: "03/02/2026 18:07:30",
    alterado_em: "03/02/2026 18:08:59",
    data: "23/09/2025",
    dia_letivo: true,
  },
  {
    escola: "EMEF PERICLES EUGENIO DA SILVA RAMOS",
    dia: "24",
    periodo_escolar: null,
    criado_em: "03/02/2026 18:07:30",
    alterado_em: "03/02/2026 18:08:59",
    data: "24/09/2025",
    dia_letivo: true,
  },
  {
    escola: "EMEF PERICLES EUGENIO DA SILVA RAMOS",
    dia: "25",
    periodo_escolar: null,
    criado_em: "03/02/2026 18:07:30",
    alterado_em: "03/02/2026 18:08:59",
    data: "25/09/2025",
    dia_letivo: true,
  },
  {
    escola: "EMEF PERICLES EUGENIO DA SILVA RAMOS",
    dia: "26",
    periodo_escolar: null,
    criado_em: "03/02/2026 18:07:30",
    alterado_em: "03/02/2026 18:08:59",
    data: "26/09/2025",
    dia_letivo: true,
  },
  {
    escola: "EMEF PERICLES EUGENIO DA SILVA RAMOS",
    dia: "27",
    periodo_escolar: null,
    criado_em: "03/02/2026 18:07:30",
    alterado_em: "03/02/2026 18:08:59",
    data: "27/09/2025",
    dia_letivo: false,
  },
  {
    escola: "EMEF PERICLES EUGENIO DA SILVA RAMOS",
    dia: "28",
    periodo_escolar: null,
    criado_em: "03/02/2026 18:07:31",
    alterado_em: "03/02/2026 18:08:59",
    data: "28/09/2025",
    dia_letivo: false,
  },
  {
    escola: "EMEF PERICLES EUGENIO DA SILVA RAMOS",
    dia: "29",
    periodo_escolar: null,
    criado_em: "03/02/2026 18:07:31",
    alterado_em: "03/02/2026 18:08:59",
    data: "29/09/2025",
    dia_letivo: true,
  },
  {
    escola: "EMEF PERICLES EUGENIO DA SILVA RAMOS",
    dia: "30",
    periodo_escolar: null,
    criado_em: "03/02/2026 18:07:31",
    alterado_em: "03/02/2026 18:08:59",
    data: "30/09/2025",
    dia_letivo: true,
  },
];

describe("Teste Conferência de Lançamentos - Testes de Acesso CODAE/Nutri", () => {
  const escolaUuid =
    mockSolicitacaoMedicaoInicialSemLancamentoEMEFJunho2025.escola_uuid;
  const solicitacaoUuid = medicao.uuid;

  beforeEach(async () => {
    process.env.IS_TEST = true;
    mock.onGet("/usuarios/meus-dados/").reply(200, meusDados);
    mock
      .onGet(
        "/medicao-inicial/solicitacao-medicao-inicial/periodos-grupos-medicao/",
      )
      .reply(200, periodosGruposMedicao);
    mock
      .onGet(`/medicao-inicial/solicitacao-medicao-inicial/${solicitacaoUuid}/`)
      .reply(200, medicao);
    mock
      .onGet("/medicao-inicial/medicao/feriados-no-mes-com-nome/")
      .reply(200, {
        results: [
          {
            dia: "07",
            feriado: "Dia da Independência do Brasil",
          },
        ],
      });
    mock.onGet("/dias-calendario/").reply(200, diasCalendario);
    mock
      .onGet("/medicao-inicial/dias-sobremesa-doce/lista-dias/")
      .reply(200, []);
    mock
      .onGet(
        `/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/${escolaUuid}/`,
      )
      .reply(200, mockVinculosTipoAlimentacaoPeriodoEscolarEMEF);
    mock
      .onGet(
        "/vinculos-tipo-alimentacao-u-e-periodo-escolar/vinculos-inclusoes-evento-especifico-autorizadas/",
      )
      .reply(200, []);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.NUTRICAO_MANIFESTACAO);

    const search = `?uuid=${solicitacaoUuid}`;
    Object.defineProperty(window, "location", {
      value: {
        search: search,
      },
    });

    await act(async () => {
      render(
        <MemoryRouter
          initialEntries={[
            {
              //   pathname: "/medicao-inicial/conferencia-dos-lancamentos",
              pathname: "/",
              state: {
                ano: "2025",
                escolaUuid: escolaUuid,
                mes: "09",
              },
            },
          ]}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <ConferenciaDosLancamentosPage />
          <ToastContainer />
        </MemoryRouter>,
      );
    });
  });

  it("Renderiza título da página `Conferência dos Lançamentos`", async () => {
    preview.debug();
    expect(screen.getAllByText("Conferência dos Lançamentos").length).toBe(2);
    expect(screen.getByText("Mês do Lançamento")).toBeInTheDocument();
  });
});
