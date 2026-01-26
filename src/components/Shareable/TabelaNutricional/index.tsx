import React, { useEffect, useState } from "react";
import "./styles.scss";
import { InformacaoNutricional } from "src/interfaces/produto.interface";
import { Field } from "react-final-form";
import {
  required,
  composeValidators,
  inteiroOuDecimalComVirgula,
} from "src/helpers/fieldValidators";
import InputText from "src/components/Shareable/Input/InputText";
import { OptionsGenerico } from "src/interfaces/pre_recebimento.interface";
import SelectSelecione from "src/components/Shareable/SelectSelecione";

const TAXA_CONVERSAO_KCAL_KJ = 4.2;

interface Props {
  values: object;
  listaCompletaInformacoesNutricionais: InformacaoNutricional[];
  informacoesNutricionaisCarregadas: InformacaoNutricional[];
  desabilitar?: boolean;
}

const TabelaNutricional: React.FC<Props> = ({
  values,
  listaCompletaInformacoesNutricionais,
  informacoesNutricionaisCarregadas,
  desabilitar,
}) => {
  const [
    informacoesNutricionaisAdicionais,
    setInformacoesNutricionaisAdicionais,
  ] = useState<InformacaoNutricional[]>(
    informacoesNutricionaisCarregadas.filter(({ eh_fixo }) => !eh_fixo),
  );

  useEffect(() => {
    const informacoesAdicionaisDoForm: InformacaoNutricional[] = [];
    let index = 0;

    while (values[`informacao_adicional_${index}`]) {
      const uuidSelecionado = values[`informacao_adicional_${index}`];
      const informacao = listaCompletaInformacoesNutricionais.find(
        (info) => info.uuid === uuidSelecionado,
      );

      if (informacao) {
        informacoesAdicionaisDoForm.push(informacao);
      }
      index++;
    }

    if (informacoesAdicionaisDoForm.length > 0) {
      setInformacoesNutricionaisAdicionais(informacoesAdicionaisDoForm);
    } else {
      setInformacoesNutricionaisAdicionais(
        informacoesNutricionaisCarregadas.filter(({ eh_fixo }) => !eh_fixo),
      );
    }
  }, [informacoesNutricionaisCarregadas]);

  const adicionarInformacaoNutricional = () => {
    const informacoesAtualizadas = [...informacoesNutricionaisAdicionais];
    informacoesAtualizadas.push({
      uuid: "",
      nome: "",
      medida: "",
      eh_fixo: false,
      eh_dependente: false,
      tipo_nutricional: { uuid: "", nome: "" },
    });

    setInformacoesNutricionaisAdicionais(informacoesAtualizadas);
  };

  const removerInformacaoNutricional = (index: number) => {
    const uuid_deletado = informacoesNutricionaisAdicionais[index].uuid;
    for (let i = index; i < informacoesNutricionaisAdicionais.length; i++) {
      values[`informacao_adicional_${i}`] =
        values[`informacao_adicional_${i + 1}`];
    }

    delete values[`quantidade_por_100g_${uuid_deletado}`];
    delete values[`quantidade_porcao_${uuid_deletado}`];
    delete values[`valor_diario_${uuid_deletado}`];

    const informacoesAtualizadas = [...informacoesNutricionaisAdicionais];
    informacoesAtualizadas.splice(index, 1);

    setInformacoesNutricionaisAdicionais(informacoesAtualizadas);
  };

  const gerarOptionsInformacoes = (
    informacao: InformacaoNutricional,
  ): OptionsGenerico[] => {
    const removeFixos = ({ eh_fixo }) => !eh_fixo;

    const removeJaSelecionados = ({ uuid }) =>
      !informacoesNutricionaisAdicionais.map(({ uuid }) => uuid).includes(uuid);

    const transformaEmOption = ({ nome, uuid }): OptionsGenerico => {
      return { nome, uuid };
    };

    const options = listaCompletaInformacoesNutricionais
      .filter(removeFixos)
      .filter(removeJaSelecionados)
      .map(transformaEmOption);

    informacao.uuid &&
      options.push({ uuid: informacao.uuid, nome: informacao.nome });

    options.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));

    return options;
  };

  const converterDeKcalParaKj = (valor: string) =>
    ((Number(valor?.replace(",", ".")) || 0) * TAXA_CONVERSAO_KCAL_KJ)
      .toFixed(2)
      .replace(".", ",");

  return (
    <div className="tabela-nutricional">
      <article>
        <div className="grid-table header-table">
          <div>Informação Nutricional</div>
          <div>Quantidade por 100g ou 100 ml</div>
          <div>Quantidade por porção</div>
          <div>% VD(*)</div>
        </div>

        {listaCompletaInformacoesNutricionais
          ?.filter(({ eh_fixo }) => eh_fixo)
          .map((informacao) => (
            <div key={informacao.uuid} className="grid-table body-table">
              <div className="table-cell">
                <span
                  className={`${
                    informacao.nome === "AÇÚCARES ADICIONADOS"
                      ? "informacao-recuada-2x"
                      : informacao.eh_dependente
                        ? "informacao-recuada"
                        : ""
                  }`}
                >
                  {informacao.nome}
                </span>
              </div>
              <div className="table-cell">
                <Field
                  component={InputText}
                  proibeLetras
                  name={`quantidade_por_100g_${informacao.uuid}`}
                  className="input-tabela-nutricional"
                  required
                  validate={composeValidators(
                    required,
                    inteiroOuDecimalComVirgula,
                  )}
                  disabled={desabilitar}
                />
                <span>{informacao.medida}</span>
              </div>
              <div className="table-cell">
                <Field
                  component={InputText}
                  proibeLetras
                  name={`quantidade_porcao_${informacao.uuid}`}
                  className="input-tabela-nutricional"
                  required
                  validate={composeValidators(
                    required,
                    inteiroOuDecimalComVirgula,
                  )}
                  disabled={desabilitar}
                />
                <span>{informacao.medida}</span>
                {informacao.nome.toUpperCase() === "VALOR ENERGÉTICO" && (
                  <>
                    <span>=</span>
                    <InputText
                      className="input-tabela-nutricional"
                      valorInicial={converterDeKcalParaKj(
                        values[`quantidade_porcao_${informacao.uuid}`],
                      )}
                      disabled
                    />
                    <span>KJ</span>
                  </>
                )}
              </div>
              <div className="table-cell">
                <Field
                  component={InputText}
                  proibeLetras
                  name={`valor_diario_${informacao.uuid}`}
                  className="input-tabela-nutricional"
                  required
                  validate={composeValidators(
                    required,
                    inteiroOuDecimalComVirgula,
                  )}
                  disabled={desabilitar}
                />
                <span>%</span>
              </div>
            </div>
          ))}

        {informacoesNutricionaisAdicionais?.map((informacao, index) => (
          <div key={informacao.uuid} className="grid-table body-table">
            <div className="table-cell">
              <Field
                component={SelectSelecione}
                options={gerarOptionsInformacoes(informacao)}
                name={`informacao_adicional_${index}`}
                placeholder="Selecione uma informação"
                className="input-tabela-nutricional"
                disabled={desabilitar}
                onChangeEffect={(e) => {
                  const dadosInformacao = listaCompletaInformacoesNutricionais
                    .filter(({ uuid }) => uuid === e.target.value)
                    .pop();

                  const informacoesAtualizadas = [
                    ...informacoesNutricionaisAdicionais,
                  ];
                  informacoesAtualizadas[index] = dadosInformacao;
                  setInformacoesNutricionaisAdicionais(informacoesAtualizadas);
                }}
              />
            </div>
            {informacao.uuid ? (
              <>
                <div className="table-cell">
                  <Field
                    component={InputText}
                    proibeLetras
                    name={`quantidade_por_100g_${informacao.uuid}`}
                    className="input-tabela-nutricional"
                    required
                    validate={composeValidators(
                      required,
                      inteiroOuDecimalComVirgula,
                    )}
                    disabled={desabilitar}
                  />
                  <span>{informacao.medida}</span>
                </div>
                <div className="table-cell">
                  <Field
                    component={InputText}
                    proibeLetras
                    name={`quantidade_porcao_${informacao.uuid}`}
                    className="input-tabela-nutricional"
                    required
                    validate={composeValidators(
                      required,
                      inteiroOuDecimalComVirgula,
                    )}
                    disabled={desabilitar}
                  />
                  <span>{informacao.medida}</span>
                  {informacao.nome.toUpperCase() === "VALOR ENERGÉTICO" && (
                    <>
                      <span>=</span>
                      <Field
                        component={InputText}
                        proibeLetras
                        name={`quantidade_porcao_kj_${informacao.uuid}`}
                        className="input-tabela-nutricional"
                        valorInicial={converterDeKcalParaKj(
                          values[`quantidade_porcao_${informacao.uuid}`],
                        )}
                        disabled
                      />
                      <span>KJ</span>
                    </>
                  )}
                </div>
                <div className="table-cell">
                  <Field
                    component={InputText}
                    proibeLetras
                    name={`valor_diario_${informacao.uuid}`}
                    className="input-tabela-nutricional"
                    required
                    validate={composeValidators(
                      required,
                      inteiroOuDecimalComVirgula,
                    )}
                    disabled={desabilitar}
                  />
                  <span>%</span>
                  {!desabilitar && (
                    <span className="botao-remover-informacao">
                      <button
                        onClick={() => removerInformacaoNutricional(index)}
                      >
                        <i title="Remover" className="fas fa-times" />
                      </button>
                    </span>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="table-cell"></div>
                <div className="table-cell"></div>
                <div className="table-cell">
                  <span className="botao-remover-informacao">
                    <button onClick={() => removerInformacaoNutricional(index)}>
                      <i title="Remover" className="fas fa-times" />
                    </button>
                  </span>
                </div>
              </>
            )}
          </div>
        ))}

        {!desabilitar && (
          <div className="grid-table body-table">
            <div className="table-cell">
              <button onClick={adicionarInformacaoNutricional}>
                + Adicionar Outra Informação Nutricional
              </button>
            </div>
          </div>
        )}
      </article>

      <p className="obs-tabela-nutricional">
        * Percentual de valores diários fornecidos pela porção.
        <br />
        ** VD não estabelecidos (valores com a informação &quot;0&quot; na
        tabela nutricional).
      </p>
    </div>
  );
};

export default TabelaNutricional;
