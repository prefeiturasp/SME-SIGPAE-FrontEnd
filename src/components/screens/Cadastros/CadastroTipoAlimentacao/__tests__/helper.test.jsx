import {
  montaTipoUnidadeEscolar,
  adicionarComboVazio,
  podeAdicionarElementoSubstituicao,
  podeAdicionarElemento,
  montaLabelCombo,
  estruturarDadosTiposDeAlimentacao,
  verificaSeFormularioOuRelatorioEhApresentado,
} from "../helper";

describe("Teste de funções Helpers", () => {
  describe("montaTipoUnidadeEscolar", () => {
    it("deve retornar a opção padrão e os tipos de unidade escolar", () => {
      const tiposUnidades = [
        {
          iniciais: "EMEF",
          uuid: "uuid-1",
        },
        {
          iniciais: "EMEI",
          uuid: "uuid-2",
        },
      ];

      expect(montaTipoUnidadeEscolar(tiposUnidades)).toEqual([
        {
          nome: "Selecione a unidade",
          uuid: "",
        },
        {
          nome: "EMEF",
          uuid: "uuid-1",
        },
        {
          nome: "EMEI",
          uuid: "uuid-2",
        },
      ]);
    });

    it("deve retornar apenas a opção padrão quando tiposUnidades não for informado", () => {
      expect(montaTipoUnidadeEscolar()).toEqual([
        {
          nome: "Selecione a unidade",
          uuid: "",
        },
      ]);
    });

    it("deve retornar apenas a opção padrão quando tiposUnidades for vazio", () => {
      expect(montaTipoUnidadeEscolar([])).toEqual([
        {
          nome: "Selecione a unidade",
          uuid: "",
        },
      ]);
    });
  });

  describe("adicionarComboVazio", () => {
    it("deve adicionar um combo vazio quando não houver combos", () => {
      const combosAtuais = [];
      const uuidVinculo = "uuid-vinculo";

      expect(adicionarComboVazio(combosAtuais, uuidVinculo)).toEqual([
        {
          label: "",
          tipos_alimentacao: [],
          vinculo: uuidVinculo,
          adicionar: true,
        },
      ]);
    });

    it("deve retornar os combos atuais quando já existirem combos", () => {
      const combosAtuais = [
        {
          label: "Combo 1",
          tipos_alimentacao: ["tipo-1"],
          vinculo: "uuid-vinculo",
          adicionar: false,
        },
      ];

      expect(adicionarComboVazio(combosAtuais, "outro-uuid")).toBe(
        combosAtuais,
      );
    });
  });

  describe("podeAdicionarElementoSubstituicao", () => {
    it("deve retornar true quando a alimentação ainda não estiver no combo", () => {
      const combo = {
        tipos_alimentacao: [
          {
            uuid: "uuid-1",
          },
        ],
      };

      const alimentacao = {
        uuid: "uuid-2",
      };

      expect(podeAdicionarElementoSubstituicao(combo, alimentacao)).toBe(true);
    });

    it("deve retornar false quando a alimentação já estiver no combo", () => {
      const combo = {
        tipos_alimentacao: [
          {
            uuid: "uuid-1",
          },
        ],
      };

      const alimentacao = {
        uuid: "uuid-1",
      };

      expect(podeAdicionarElementoSubstituicao(combo, alimentacao)).toBe(false);
    });

    it("deve retornar true quando o combo não possuir tipos de alimentação", () => {
      const combo = {
        tipos_alimentacao: [],
      };

      const alimentacao = {
        uuid: "uuid-1",
      };

      expect(podeAdicionarElementoSubstituicao(combo, alimentacao)).toBe(true);
    });
  });

  describe("podeAdicionarElemento", () => {
    it("deve retornar true quando a alimentação ainda não estiver no combo", () => {
      const combo = {
        tipos_alimentacao: ["uuid-1"],
      };

      const alimentacao = {
        uuid: "uuid-2",
      };

      expect(podeAdicionarElemento(combo, alimentacao)).toBe(true);
    });

    it("deve retornar false quando a alimentação já estiver no combo", () => {
      const combo = {
        tipos_alimentacao: ["uuid-1"],
      };

      const alimentacao = {
        uuid: "uuid-1",
      };

      expect(podeAdicionarElemento(combo, alimentacao)).toBe(false);
    });

    it("deve retornar true quando o combo não possuir tipos de alimentação", () => {
      const combo = {
        tipos_alimentacao: [],
      };

      const alimentacao = {
        uuid: "uuid-1",
      };

      expect(podeAdicionarElemento(combo, alimentacao)).toBe(true);
    });
  });

  describe("montaLabelCombo", () => {
    it("deve adicionar o nome diretamente quando o label estiver vazio", () => {
      const combo = {
        label: "",
      };

      montaLabelCombo(combo, "Arroz");

      expect(combo.label).toBe("Arroz");
    });

    it("deve adicionar o nome com 'e' quando o label já possuir conteúdo", () => {
      const combo = {
        label: "Arroz",
      };

      montaLabelCombo(combo, "Feijão");

      expect(combo.label).toBe("Arroz e Feijão");
    });

    it("deve adicionar múltiplos nomes utilizando 'e'", () => {
      const combo = {
        label: "Arroz",
      };

      montaLabelCombo(combo, "Feijão");
      montaLabelCombo(combo, "Salada");

      expect(combo.label).toBe("Arroz e Feijão e Salada");
    });
  });

  describe("estruturarDadosTiposDeAlimentacao", () => {
    it("deve marcar o período escolar como inativo", () => {
      const vinculosTiposAlimentacao = [
        {
          uuid: "vinculo-1",
          periodo_escolar: {
            ativo: true,
            editado: true,
          },
          combos: [],
        },
      ];

      estruturarDadosTiposDeAlimentacao(vinculosTiposAlimentacao);

      expect(vinculosTiposAlimentacao[0].periodo_escolar.ativo).toBe(false);
    });

    it("deve criar um combo quando o vínculo não possuir combos", () => {
      const vinculosTiposAlimentacao = [
        {
          uuid: "vinculo-1",
          periodo_escolar: {
            ativo: true,
            editado: true,
          },
          combos: [],
        },
      ];

      estruturarDadosTiposDeAlimentacao(vinculosTiposAlimentacao);

      expect(vinculosTiposAlimentacao[0].combos).toEqual([
        {
          uuid: null,
          tipos_alimentacao: [],
          vinculo: "vinculo-1",
          substituicoes: [
            {
              uuid: null,
              tipos_alimentacao: [],
              combo: "vinculo-1",
              label: "",
              adicionar: true,
            },
          ],
          label: "",
          adicionar: true,
        },
      ]);

      expect(vinculosTiposAlimentacao[0].periodo_escolar.editado).toBe(false);
    });

    it("deve marcar o combo como não adicionável e incompleto quando já existir", () => {
      const vinculosTiposAlimentacao = [
        {
          uuid: "vinculo-1",
          periodo_escolar: {
            ativo: true,
            editado: true,
          },
          combos: [
            {
              uuid: "combo-1",
              tipos_alimentacao: [],
              adicionar: true,
              completo: true,
              substituicoes: [],
            },
          ],
        },
      ];

      estruturarDadosTiposDeAlimentacao(vinculosTiposAlimentacao);

      expect(vinculosTiposAlimentacao[0].combos[0].adicionar).toBe(false);

      expect(vinculosTiposAlimentacao[0].combos[0].completo).toBe(false);

      expect(vinculosTiposAlimentacao[0].periodo_escolar.editado).toBe(false);
    });

    it("deve adicionar uma substituição quando o combo possuir tipos de alimentação", () => {
      const vinculosTiposAlimentacao = [
        {
          uuid: "vinculo-1",
          periodo_escolar: {
            ativo: true,
            editado: false,
          },
          combos: [
            {
              uuid: "combo-1",
              tipos_alimentacao: ["tipo-1"],
              substituicoes: [],
              adicionar: true,
              completo: true,
            },
          ],
        },
      ];

      estruturarDadosTiposDeAlimentacao(vinculosTiposAlimentacao);

      expect(vinculosTiposAlimentacao[0].combos[0].substituicoes).toEqual([
        {
          uuid: null,
          tipos_alimentacao: [],
          combo: "combo-1",
          label: "",
          adicionar: true,
        },
      ]);

      expect(vinculosTiposAlimentacao[0].periodo_escolar.editado).toBe(true);
    });

    it("deve marcar substituições existentes como não adicionáveis", () => {
      const vinculosTiposAlimentacao = [
        {
          uuid: "vinculo-1",
          periodo_escolar: {
            ativo: true,
            editado: false,
          },
          combos: [
            {
              uuid: "combo-1",
              tipos_alimentacao: ["tipo-1"],
              substituicoes: [
                {
                  uuid: "substituicao-1",
                  tipos_alimentacao: ["tipo-2"],
                  adicionar: true,
                },
              ],
              adicionar: true,
              completo: true,
            },
          ],
        },
      ];

      estruturarDadosTiposDeAlimentacao(vinculosTiposAlimentacao);

      expect(
        vinculosTiposAlimentacao[0].combos[0].substituicoes[0].adicionar,
      ).toBe(false);

      expect(vinculosTiposAlimentacao[0].periodo_escolar.editado).toBe(true);
    });
  });

  describe("verificaSeFormularioOuRelatorioEhApresentado", () => {
    it("deve retornar true quando todos os vínculos estiverem editados", () => {
      const vinculosTiposAlimentacao = [
        {
          periodo_escolar: {
            editado: true,
          },
        },
        {
          periodo_escolar: {
            editado: true,
          },
        },
      ];

      expect(
        verificaSeFormularioOuRelatorioEhApresentado(vinculosTiposAlimentacao),
      ).toBe(true);
    });

    it("deve retornar false quando algum vínculo não estiver editado", () => {
      const vinculosTiposAlimentacao = [
        {
          periodo_escolar: {
            editado: true,
          },
        },
        {
          periodo_escolar: {
            editado: false,
          },
        },
      ];

      expect(
        verificaSeFormularioOuRelatorioEhApresentado(vinculosTiposAlimentacao),
      ).toBe(false);
    });

    it("deve retornar false quando nenhum vínculo estiver editado", () => {
      const vinculosTiposAlimentacao = [
        {
          periodo_escolar: {
            editado: false,
          },
        },
        {
          periodo_escolar: {
            editado: false,
          },
        },
      ];

      expect(
        verificaSeFormularioOuRelatorioEhApresentado(vinculosTiposAlimentacao),
      ).toBe(false);
    });
  });
});
