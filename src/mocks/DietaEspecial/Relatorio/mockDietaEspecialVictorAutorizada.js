export const mockDietaEspecialVictorAutorizada = {
  id: 37971,
  uuid: "073b72aa-c997-489e-a1f9-5f40fbbe5ec7",
  id_externo: "073B7",
  criado_em: "19/11/2024 14:06:14",
  status_solicitacao: "CODAE_AUTORIZADO",
  aluno: {
    uuid: "22916807-e6bb-473f-bf4b-8b0f0672cf6d",
    nome: "VICTOR ALUNO TESTE",
    data_nascimento: "09/02/2018",
    codigo_eol: "7777777",
    escola: null,
    nome_escola: null,
    nome_dre: null,
    responsaveis: [],
    cpf: null,
    possui_dieta_especial: true,
    serie: "1B",
  },
  escola: {
    uuid: "9ec63e30-3355-46d5-b843-348af71c3034",
    nome: "EMEF FRANCISCO MEIRELLES, DES.",
    diretoria_regional: {
      nome: "IPIRANGA",
      codigo_eol: "108600",
    },
    tipo_gestao: {
      nome: "TERC TOTAL",
      ativo: true,
      uuid: "acd89733-6110-4b38-beef-0baf377b9574",
    },
    lote: {
      uuid: "87f3e59d-f45f-4dc2-bfb1-0ff6c54d899c",
      nome: "LOTE 07",
      tipo_gestao: "TERC TOTAL",
      diretoria_regional: {
        uuid: "680b362b-8f4c-4932-9fd2-6b0aa122fc43",
        nome: "IPIRANGA",
        codigo_eol: "108600",
        iniciais: "IP",
        acesso_modulo_medicao_inicial: false,
      },
      terceirizada: {
        uuid: "6eb2aa7b-5387-4e7c-833b-fb09b1f119ee",
        cnpj: "03706826000169",
        nome_fantasia: "PRM",
      },
    },
  },
  escola_destino: {
    uuid: "9ec63e30-3355-46d5-b843-348af71c3034",
    nome: "EMEF FRANCISCO MEIRELLES, DES.",
    diretoria_regional: {
      nome: "IPIRANGA",
      codigo_eol: "108600",
    },
    tipo_gestao: {
      nome: "TERC TOTAL",
      ativo: true,
      uuid: "acd89733-6110-4b38-beef-0baf377b9574",
    },
    lote: {
      uuid: "87f3e59d-f45f-4dc2-bfb1-0ff6c54d899c",
      nome: "LOTE 07",
      tipo_gestao: "TERC TOTAL",
      diretoria_regional: {
        uuid: "680b362b-8f4c-4932-9fd2-6b0aa122fc43",
        nome: "IPIRANGA",
        codigo_eol: "108600",
        iniciais: "IP",
        acesso_modulo_medicao_inicial: false,
      },
      terceirizada: {
        uuid: "6eb2aa7b-5387-4e7c-833b-fb09b1f119ee",
        cnpj: "03706826000169",
        nome_fantasia: "PRM",
      },
    },
  },
  anexos: [
    {
      arquivo_url:
        "http://localhost:8000/media/ebe45c8c-38dd-4f7c-ae11-22e883a73eea.jpg",
      arquivo:
        "http://localhost:8002/media/ebe45c8c-38dd-4f7c-ae11-22e883a73eea.jpg",
      nome: "ORIENTAÇÃO FONOAUDIOLÓGICA 1.jpeg",
      eh_laudo_alta: false,
    },
    {
      arquivo_url:
        "http://localhost:8000/media/20caaea5-2fa6-46dd-8b76-b084dcf51347.jpg",
      arquivo:
        "http://localhost:8002/media/20caaea5-2fa6-46dd-8b76-b084dcf51347.jpg",
      nome: "ORIENTAÇÃO FONOAUDIOLÓGICA 2.jpeg",
      eh_laudo_alta: false,
    },
  ],
  nome_completo_pescritor: "FULANA DA SILVA",
  registro_funcional_pescritor: "1234",
  observacoes: "",
  alergias_intolerancias: [
    {
      id: 885,
      descricao: " DIETA PASTOSA",
    },
  ],
  classificacao: {
    id: 3,
    descricao: "Classificação da dieta tipo C deve vir aqui.",
    nome: "Tipo C",
  },
  protocolo_padrao: "5ab3357c-0110-4377-baf6-2df06ad5b97f",
  nome_protocolo: "DIETA PASTOSA LIQUIDIFICADA",
  orientacoes_gerais:
    '<ul><li>A alimentação deve ser pastosa liquidificada, porém os alimentos devem ser batidos separadamente para proporcionar reconhecimento dos diversos sabores.</li><li>Não há necessidade de coar, porém não deve ter pedaços.</li><li>Ofertar os líquidos em pequenos goles e pequenas pausas.</li><li>Colocar gotinhas de limão ou laranja na água para dar mais sabor e ele perceber a água na boca. Ofertar a água em temperatura mais fresca.</li></ul><p><strong>Relação de Alimentos para Substituição</strong></p><p>A empresa deverá compor o cardápio de acordo com a relação de alimentos substitutos.</p><figure class="table"><table><thead><tr><th><strong>Alimento</strong></th><th><strong>Substituto</strong></th></tr></thead><tbody><tr><td>Arroz</td><td>Arroz bem cozido, liquidificado&nbsp;</td></tr><tr><td>Carne Bovina, Suína, Frango ou Peixe</td><td>Carnes bem cozidas, liquidificadas</td></tr><tr><td>Feijão</td><td>Feijão bem cozido, liquidificado</td></tr><tr><td>Flocos de milho</td><td>Pães, bolos ou biscoitos umedecidos no leite e liquidificados, formando uma papa homogênea</td></tr><tr><td>Frutas</td><td><p>Frutas macias (banana, mamão, abacate...) liquidificadas</p><p>Frutas duras (maçã) cozidas e liquidificadas</p><p>Frutas suculentas liquidificadas em forma de suco</p></td></tr><tr><td>Legumes</td><td>Legumes bem cozidos e liquidificados</td></tr><tr><td>Macarrão</td><td>Macarrão bem cozido e liquidificado</td></tr><tr><td>Ovo</td><td>Ovo cozido e liquidificado</td></tr><tr><td>Pães, biscoitos e bolos</td><td>Pães, bolos ou biscoitos umedecidos no leite e liquidificados, formando uma papa homogênea</td></tr><tr><td>Verdura</td><td>Verduras cozidas e liquidificadas</td></tr></tbody></table></figure>',
  substituicoes: [
    {
      id: 174228,
      alimento: {
        id: 299,
        marca: null,
        nome: "DIETA GERAL",
        ativo: true,
        uuid: "ac3d3ab1-574a-4c35-bb8a-6db0c8c67aff",
        tipo: "E",
        outras_informacoes: "",
        tipo_listagem_protocolo: "SO_ALIMENTOS",
      },
      substitutos: [],
      alimentos_substitutos: [
        {
          id: 301,
          marca: null,
          nome: "DIETA PASTOSA HOMOGÊNEA LIQUIDIFICADA",
          ativo: true,
          uuid: "b83736f6-cfa2-4243-b7c3-211f837c7d84",
          tipo: "E",
          outras_informacoes: "",
          tipo_listagem_protocolo: "SO_SUBSTITUTOS",
        },
      ],
      tipo: "S",
      solicitacao_dieta_especial: 37971,
    },
  ],
  informacoes_adicionais:
    "<p>NOTA: A Empresa tem prazo máximo de 3 dias úteis para o atendimento da alimentação específica.</p>",
  caracteristicas_do_alimento: "",
  motivo_negacao: null,
  justificativa_negacao: "",
  registro_funcional_nutricionista: "Elaborado por Nutri SME - RF 1111111",
  logs: [
    {
      status_evento_explicacao: "Solicitação Realizada",
      usuario: {
        uuid: "c8294a59-4583-40d4-b92b-ba815f3ad985",
        cpf: null,
        nome: "DIRETORA ANA",
        email: "diretora@ana.com",
        date_joined: "01/11/2022 08:03:05",
        registro_funcional: "1234567",
        tipo_usuario: "escola",
        cargo: "ASSISTENTE DE DIRETOR DE ESCOLA",
        crn_numero: null,
        nome_fantasia: null,
      },
      criado_em: "19/11/2024 14:06:14",
      descricao: "7777777: VICTOR ALUNO TESTE",
      justificativa: "",
      resposta_sim_nao: false,
    },
    {
      status_evento_explicacao: "CODAE autorizou",
      usuario: {
        uuid: "5011fa24-82dc-42d7-b9a9-e534128f6756",
        cpf: null,
        nome: "Nutri SME",
        email: "nutri@sme.prefeitura.sp.gov.br",
        date_joined: "22/10/2020 14:03:54",
        registro_funcional: "8117063",
        tipo_usuario: "dieta_especial",
        cargo: "ANALISTA DE SAUDE NIVEL I",
        crn_numero: "12345",
        nome_fantasia: null,
      },
      criado_em: "19/11/2024 14:38:33",
      descricao: "7777777: VICTOR ALUNO TESTE",
      justificativa: "",
      resposta_sim_nao: false,
    },
  ],
  ativo: true,
  data_termino: null,
  data_inicio: "19/11/2024",
  tem_solicitacao_cadastro_produto: false,
  tipo_solicitacao: "COMUM",
  observacoes_alteracao: "",
  motivo_alteracao_ue: null,
  conferido: true,
  eh_importado: false,
  dieta_alterada: null,
};
