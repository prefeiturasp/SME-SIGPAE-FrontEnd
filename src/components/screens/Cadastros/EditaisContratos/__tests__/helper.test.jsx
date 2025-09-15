import {
  normalizaLabelValueDRE,
  normalizaLabelValueLote,
  normalizaLabelValueEmpresa,
  normalizaLabelValueEmpresaSocial,
  renderizarLabelLote,
  renderizarLabelDiretoria,
  renderizarLabelEmpresa,
  montaEstadoEditais,
} from "../helper";

describe("Funções utilitárias de normalização e renderização", () => {
  it("deve normalizar corretamente uma lista de DREs", () => {
    const response = { results: [{ nome: "DRE 1", uuid: "123" }] };

    expect(normalizaLabelValueDRE(response)).toEqual([
      { label: "DRE 1", value: "123", uuid: "123" },
    ]);
  });

  it("deve normalizar corretamente uma lista de lotes", () => {
    const response = [{ nome: "Lote A", uuid: "abc" }];

    expect(normalizaLabelValueLote(response)).toEqual([
      { label: "Lote A", value: "abc", uuid: "abc" },
    ]);
  });

  it("deve normalizar corretamente uma lista de empresas pelo nome fantasia", () => {
    const response = [{ nome_fantasia: "Empresa X", uuid: "321" }];

    expect(normalizaLabelValueEmpresa(response)).toEqual([
      { label: "Empresa X", value: "321", uuid: "321" },
    ]);
  });

  it("deve normalizar corretamente uma lista de empresas pela razão social", () => {
    const response = [{ razao_social: "Empresa Y Ltda", uuid: "999" }];

    expect(normalizaLabelValueEmpresaSocial(response)).toEqual([
      { label: "Empresa Y Ltda", value: "999", uuid: "999" },
    ]);
  });

  it("deve renderizar corretamente o label de seleção de lotes em diferentes cenários", () => {
    const options = [{}, {}, {}];

    expect(renderizarLabelLote([], options)).toBe(
      "Selecione um ou mais lotes..."
    );
    expect(renderizarLabelLote([1, 2, 3], options)).toBe(
      "Todos os lotes foram selecionados"
    );
    expect(renderizarLabelLote([1], options)).toBe("1 lote selecionado");
    expect(renderizarLabelLote([1, 2], options)).toBe("2 lotes selecionados");
  });

  it("deve renderizar corretamente o label de seleção de diretorias em diferentes cenários", () => {
    const options = [{}, {}];

    expect(renderizarLabelDiretoria([], options)).toBe(
      "Selecione uma ou mais diretorias ..."
    );
    expect(renderizarLabelDiretoria([1, 2], options)).toBe(
      "Todas as diretorias foram selecionadas"
    );
    expect(renderizarLabelDiretoria([1], options)).toBe(
      "1 diretoria selecionada"
    );
    expect(renderizarLabelDiretoria([1, 2, 3], [{}, {}])).toBe(
      "3 diretorias selecionadas"
    );
  });

  it("deve renderizar corretamente o label de seleção de empresas em diferentes cenários", () => {
    const options = [{}, {}, {}];

    expect(renderizarLabelEmpresa([], options)).toBe(
      "Selecione uma ou mais empresas ..."
    );
    expect(renderizarLabelEmpresa([1, 2, 3], options)).toBe(
      "Todas as empresas foram selecionadas"
    );
    expect(renderizarLabelEmpresa([1], options)).toBe("1 empresa selecionada");
    expect(renderizarLabelEmpresa([1, 2], options)).toBe(
      "2 empresas selecionadas"
    );
  });

  it("deve normalizar corretamente os dados de editais recebidos da API", () => {
    const response = {
      data: {
        results: [
          {
            uuid: "ed1",
            tipo_contratacao: "Pregão",
            numero: "123/2025",
            processo: "456/2025",
            objeto: "Aquisição de materiais",
            contratos: ["c1", "c2"],
          },
        ],
      },
    };

    expect(montaEstadoEditais(response)).toEqual([
      {
        ativo: false,
        uuid: "ed1",
        tipo_contratacao: "Pregão",
        edital_numero: "123/2025",
        processo_administrativo: "456/2025",
        resumo: "Aquisição de materiais",
        contratos: ["c1", "c2"],
      },
    ]);
  });
});
