import React, { Dispatch, SetStateAction } from "react";
import { Field } from "react-final-form";
import { NavLink } from "react-router-dom";

import {
  RECEBIMENTO,
  ATRIBUIR_QUESTOES_CONFERENCIA,
} from "src/configs/constants";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import Botao from "src/components/Shareable/Botao";
import CollapseFiltros from "src/components/Shareable/CollapseFiltros";
import AutoCompleteSelectField from "src/components/Shareable/AutoCompleteSelectField";
import { formatarNumeroEProdutoFichaTecnica } from "src/helpers/preRecebimento";
import { getListaFiltradaAutoCompleteSelect } from "src/helpers/autoCompleteSelect";
import { FichaTecnicaSimples } from "interfaces/pre_recebimento.interface";
import {
  FiltrosQuestoesPorProduto,
  QuestaoConferencia,
  QuestoesPorProduto,
} from "interfaces/recebimento.interface";

interface FiltrosProps {
  fichasTecnicas: FichaTecnicaSimples[];
  questoesConferencia: QuestaoConferencia[];
  setFiltros: Dispatch<SetStateAction<FiltrosQuestoesPorProduto>>;
  setQuestoesPorProduto: Dispatch<SetStateAction<QuestoesPorProduto[]>>;
  setConsultaRealizada: Dispatch<SetStateAction<boolean>>;
}

const Filtros = ({
  fichasTecnicas,
  questoesConferencia,
  setFiltros,
  setQuestoesPorProduto,
  setConsultaRealizada,
}: FiltrosProps) => {
  const onSubmit = (values: FiltrosQuestoesPorProduto) => {
    const filtros = {
      ficha_tecnica:
        fichasTecnicas.find(buscarFichaPeloNumero(values))?.uuid ?? "",
      questao: values.questao ?? "",
    };

    setFiltros(filtros);
  };

  const buscarFichaPeloNumero =
    (values: Record<string, any>) =>
    ({ numero }) =>
      numero === values.ficha_tecnica?.split("-")[0].trim();

  const onClear = () => {
    setFiltros({} as FiltrosQuestoesPorProduto);
    setQuestoesPorProduto([]);
    setConsultaRealizada(false);
  };

  const optionsFichaTecnica = (valueFichaTecnica: string) =>
    getListaFiltradaAutoCompleteSelect(
      fichasTecnicas.map((e) => formatarNumeroEProdutoFichaTecnica(e)),
      valueFichaTecnica,
      true
    );

  const optionsQuestao = (valueQuestao: string) =>
    getListaFiltradaAutoCompleteSelect(
      questoesConferencia.map(({ questao }) => questao),
      valueQuestao,
      true
    );

  return (
    <div className="filtros-documentos-recebimento">
      <CollapseFiltros onSubmit={onSubmit} onClear={onClear}>
        {(values) => (
          <div className="row">
            <div className="col-6">
              <Field
                component={AutoCompleteSelectField}
                options={optionsFichaTecnica(values.ficha_tecnica)}
                label="Filtrar por Ficha Técnica e Produto"
                name="ficha_tecnica"
                placeholder="Digite o nº da ficha ou nome do produto"
              />
            </div>
            <div className="col-6">
              <Field
                component={AutoCompleteSelectField}
                options={optionsQuestao(values.questao)}
                label="Filtrar por Questão"
                name="questao"
                placeholder="Digite o título da questão"
              />
            </div>
          </div>
        )}
      </CollapseFiltros>

      <div className="pt-4 pb-4">
        <NavLink to={`/${RECEBIMENTO}/${ATRIBUIR_QUESTOES_CONFERENCIA}`}>
          <Botao
            texto="Atribuir Questões"
            type={BUTTON_TYPE.BUTTON}
            style={BUTTON_STYLE.GREEN}
          />
        </NavLink>
      </div>
    </div>
  );
};

export default Filtros;
