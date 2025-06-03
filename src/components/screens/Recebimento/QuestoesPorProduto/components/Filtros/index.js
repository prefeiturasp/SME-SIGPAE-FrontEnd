import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
const Filtros = ({
  fichasTecnicas,
  questoesConferencia,
  setFiltros,
  setQuestoesPorProduto,
  setConsultaRealizada,
}) => {
  const onSubmit = (values) => {
    const filtros = {
      ficha_tecnica:
        fichasTecnicas.find(buscarFichaPeloNumero(values))?.uuid ?? "",
      questao: values.questao ?? "",
    };
    setFiltros(filtros);
  };
  const buscarFichaPeloNumero =
    (values) =>
    ({ numero }) =>
      numero === values.ficha_tecnica?.split("-")[0].trim();
  const onClear = () => {
    setFiltros({});
    setQuestoesPorProduto([]);
    setConsultaRealizada(false);
  };
  const optionsFichaTecnica = (valueFichaTecnica) =>
    getListaFiltradaAutoCompleteSelect(
      fichasTecnicas.map((e) => formatarNumeroEProdutoFichaTecnica(e)),
      valueFichaTecnica,
      true
    );
  const optionsQuestao = (valueQuestao) =>
    getListaFiltradaAutoCompleteSelect(
      questoesConferencia.map(({ questao }) => questao),
      valueQuestao,
      true
    );
  return _jsxs("div", {
    className: "filtros-documentos-recebimento",
    children: [
      _jsx(CollapseFiltros, {
        onSubmit: onSubmit,
        onClear: onClear,
        children: (values) =>
          _jsxs("div", {
            className: "row",
            children: [
              _jsx("div", {
                className: "col-6",
                children: _jsx(Field, {
                  component: AutoCompleteSelectField,
                  options: optionsFichaTecnica(values.ficha_tecnica),
                  label: "Filtrar por Ficha T\u00E9cnica e Produto",
                  name: "ficha_tecnica",
                  placeholder: "Digite o n\u00BA da ficha ou nome do produto",
                }),
              }),
              _jsx("div", {
                className: "col-6",
                children: _jsx(Field, {
                  component: AutoCompleteSelectField,
                  options: optionsQuestao(values.questao),
                  label: "Filtrar por Quest\u00E3o",
                  name: "questao",
                  placeholder: "Digite o t\u00EDtulo da quest\u00E3o",
                }),
              }),
            ],
          }),
      }),
      _jsx("div", {
        className: "pt-4 pb-4",
        children: _jsx(NavLink, {
          to: `/${RECEBIMENTO}/${ATRIBUIR_QUESTOES_CONFERENCIA}`,
          children: _jsx(Botao, {
            texto: "Atribuir Quest\u00F5es",
            type: BUTTON_TYPE.BUTTON,
            style: BUTTON_STYLE.GREEN,
          }),
        }),
      }),
    ],
  });
};
export default Filtros;
