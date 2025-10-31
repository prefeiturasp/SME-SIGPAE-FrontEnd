export const mockAnaliseLayoutEmbalagem = {
  uuid: "uuid-analise-teste",
  numero_ficha_tecnica: "12345",
  nome_produto: "Produto Teste",
  pregao_chamada_publica: "Pregão 001/2024",
  criado_em: "2024-01-01 10:00:00",
  nome_empresa: "Empresa Teste Ltda",
  observacoes: "Observações do fornecedor",
  primeira_analise: true,
  status: "Solicitado Correção",
  logs: [
    { status: "CRIADO", criado_em: "2024-01-01 10:00:00" },
    { status: "SOLICITADO_CORRECAO", criado_em: "2024-01-02 10:00:00" },
  ],
  tipos_de_embalagens: [
    {
      uuid: "uuid-primaria",
      tipo_embalagem: "PRIMARIA",
      status: "REPROVADO",
      complemento_do_status: "Correções necessárias na embalagem primária",
      imagens: [
        {
          arquivo: "/arquivos/primaria.jpg",
          nome: "primaria.jpg",
        },
      ],
    },
    {
      uuid: "uuid-secundaria",
      tipo_embalagem: "SECUNDARIA",
      status: "APROVADO",
      complemento_do_status:
        "Aprovado em 01/01/2024 - 10:00|Por: Analista CODAE",
      imagens: [
        {
          arquivo: "/arquivos/secundaria.pdf",
          nome: "secundaria.pdf",
        },
      ],
    },
  ],
};

export const mockTodasEmbalagensLayout = {
  ...mockAnaliseLayoutEmbalagem,
  tipos_de_embalagens: [
    {
      uuid: "uuid-primaria",
      tipo_embalagem: "PRIMARIA",
      status: "REPROVADO",
      complemento_do_status: "Correções necessárias na embalagem primária",
      imagens: [{ arquivo: "/arquivos/primaria.jpg", nome: "primaria.jpg" }],
    },
    {
      uuid: "uuid-secundaria",
      tipo_embalagem: "SECUNDARIA",
      status: "REPROVADO",
      complemento_do_status: "Correções necessárias na embalagem secundária",
      imagens: [
        { arquivo: "/arquivos/secundaria.pdf", nome: "secundaria.pdf" },
      ],
    },
    {
      uuid: "uuid-terciaria",
      tipo_embalagem: "TERCIARIA",
      status: "REPROVADO",
      complemento_do_status: "Correções necessárias na embalagem terciária",
      imagens: [
        {
          arquivo: "/arquivos/terciaria.png",
          nome: "terciaria.png",
        },
      ],
    },
  ],
};
