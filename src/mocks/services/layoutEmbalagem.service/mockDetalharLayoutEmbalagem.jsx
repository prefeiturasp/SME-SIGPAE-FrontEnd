export const mockLayoutEmbalagemReprovado = {
  uuid: "mock-uuid-123",
  numero_ficha_tecnica: "12345",
  nome_produto: "Produto Teste",
  pregao_chamada_publica: "Pregão 001/2024",
  observacoes: "Observações iniciais",
  logs: [
    {
      status: "CRIADO",
      data: "2024-01-01",
      usuario: "Usuário Teste",
    },
  ],
  tipos_de_embalagens: [
    {
      uuid: "primaria-uuid",
      tipo_embalagem: "PRIMARIA",
      status: "REPROVADO",
      complemento_do_status: "Correções necessárias na embalagem primária",
      imagens: [
        {
          nome: "primaria-antiga.jpg",
          arquivo: "/api/arquivos/primaria.jpg/",
        },
      ],
    },
    {
      uuid: "secundaria-uuid",
      tipo_embalagem: "SECUNDARIA",
      status: "REPROVADO",
      complemento_do_status: "Correções necessárias na embalagem secundária",
      imagens: [
        {
          nome: "secundaria-antiga.pdf",
          arquivo: "/api/arquivos/secundaria.pdf/",
        },
      ],
    },
  ],
  log_mais_recente: "01/01/2024 10:00:00",
};

export const mockLayoutEmbalagemAprovado = {
  ...mockLayoutEmbalagemReprovado,
  tipos_de_embalagens: [
    {
      uuid: "primaria-uuid",
      tipo_embalagem: "PRIMARIA",
      status: "APROVADO",
      complemento_do_status: "2024-01-01 10:00:00|Usuário Aprovador",
      imagens: [
        {
          nome: "primaria-aprovada.jpg",
          arquivo: "/api/arquivos/primaria.jpg/",
        },
      ],
    },
    {
      uuid: "secundaria-uuid",
      tipo_embalagem: "SECUNDARIA",
      status: "APROVADO",
      complemento_do_status: "2024-01-01 10:00:00|Usuário Aprovador",
      imagens: [
        {
          nome: "secundaria-aprovada.pdf",
          arquivo: "/api/arquivos/secundaria.pdf/",
        },
      ],
    },
  ],
};

export const mockLayoutComTerciaria = {
  ...mockLayoutEmbalagemReprovado,
  tipos_de_embalagens: [
    ...mockLayoutEmbalagemReprovado.tipos_de_embalagens,
    {
      uuid: "terciaria-uuid",
      tipo_embalagem: "TERCIARIA",
      status: "REPROVADO",
      complemento_do_status: "Correções necessárias na embalagem terciária",
      imagens: [
        {
          nome: "terciaria-antiga.jpg",
          arquivo: "/api/arquivos/terciaria.jpg",
        },
      ],
    },
  ],
};

export const mockLayoutEmbalagemReprovadoSomenteEmbalagemPrimeria = {
  uuid: "91d0c67e-37f4-4ac3-ad7c-818467ba45ac",
  observacoes: "",
  criado_em: "14/10/2025 16:23:06",
  status: "Solicitado Correção",
  tipos_de_embalagens: [
    {
      imagens: [
        {
          arquivo:
            "http://localhost:8000/media/layouts_de_embalagens/86feb18f-5c44-4890-a1d9-dad9e5bf1d2d.jpg",
          nome: "embalagem.jpg",
        },
      ],
      uuid: "a16ef71b-52ef-4aa9-85e1-e0411f3a962f",
      tipo_embalagem: "PRIMARIA",
      status: "REPROVADO",
      complemento_do_status: "Imagem escura",
    },
    null,
    null,
  ],
  numero_ficha_tecnica: "FT027",
  pregao_chamada_publica: "fdsfdsfsdf",
  nome_produto: "MACA",
  nome_empresa: "JP Alimentos / JP Alimentos LTDA",
  log_mais_recente: "14/10/2025 - 16:30",
  primeira_analise: true,
  logs: [
    {
      status_evento_explicacao: "Enviado para Análise",
      usuario: {
        uuid: "9f34bc68-ae58-41b1-a605-189824c9f7ef",
        nome: "FORNECEDOR ADMIN",
      },
      criado_em: "14/10/2025 16:23:06",
      justificativa: "",
    },
    {
      status_evento_explicacao: "Solicitado Correção",
      usuario: {
        uuid: "4d1d0941-f02f-4a07-8dbb-5a57dfffd1fa",
        nome: "GPCODAE ADMIN",
      },
      criado_em: "14/10/2025 16:30:42",
      justificativa: "",
    },
  ],
};
