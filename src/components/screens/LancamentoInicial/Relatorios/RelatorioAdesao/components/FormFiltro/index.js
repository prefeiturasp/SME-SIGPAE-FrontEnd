import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Field } from "react-final-form";
import { Skeleton } from "antd";
import Select from "src/components/Shareable/Select";
import MultiSelect from "src/components/Shareable/FinalForm/MultiSelect";
import AutoCompleteSelectField from "src/components/Shareable/AutoCompleteSelectField";
import {
  usuarioEhDRE,
  usuarioEhEscolaTerceirizadaQualquerPerfil,
} from "src/helpers/utilities";
import useView from "./view";
export default (props) => {
  const { form, onChange } = props;
  const view = useView({ form, onChange });
  return _jsxs("div", {
    className: "row",
    children: [
      _jsx("div", {
        className: "col-4",
        children: view.buscandoOpcoes.buscandoMesesAnos
          ? _jsx(Skeleton, { paragraph: false, active: true })
          : _jsx(Field, {
              component: Select,
              label: "M\u00EAs de Refer\u00EAncia",
              name: "mes",
              placeholder: "Selecione o m\u00EAs de refer\u00EAncia",
              options: view.mesesAnosOpcoes,
              required: true,
              naoDesabilitarPrimeiraOpcao: true,
              validate: view.validaMesAno,
              onChangeEffect: view.onChangeMesAno,
            }),
      }),
      _jsx("div", {
        className: "col-8",
        children: view.buscandoOpcoes.buscandoDiretoriasRegionais
          ? _jsx(Skeleton, { paragraph: false, active: true })
          : _jsx(Field, {
              component: Select,
              label: "DRE",
              name: "dre",
              placeholder: "Selecione uma DRE",
              options: view.diretoriasRegionaisOpcoes,
              naoDesabilitarPrimeiraOpcao: true,
              onChangeEffect: view.onChangeDRE,
              disabled:
                usuarioEhDRE() || usuarioEhEscolaTerceirizadaQualquerPerfil(),
            }),
      }),
      _jsx("div", {
        className: "col-4",
        children: view.buscandoOpcoes.buscandoLotes
          ? _jsx(Skeleton, { paragraph: false, active: true })
          : _jsx(Field, {
              component: MultiSelect,
              disableSearch: true,
              label: "Lotes",
              name: "lotes",
              placeholder: "Selecione os lotes",
              options: view.lotesOpcoes,
              nomeDoItemNoPlural: "lotes",
              onChangeEffect: view.onChangeLotes,
            }),
      }),
      _jsx("div", {
        className: "col-8",
        children: view.buscandoOpcoes.buscandoUnidadesEducacionais
          ? _jsx(Skeleton, { paragraph: false, active: true })
          : _jsx(Field, {
              component: AutoCompleteSelectField,
              label: "Unidade Educacional",
              name: "unidade_educacional",
              placeholder: "Selecione uma Unidade Educacional",
              options: view.unidadesEducacionaisOpcoes,
              filterOption: view.filtraUnidadesEducacionaisOpcoes,
              onSelect: view.onChangeUnidadeEducacional,
              disabled: usuarioEhEscolaTerceirizadaQualquerPerfil(),
            }),
      }),
      _jsx("div", {
        className: "col-4",
        children: view.buscandoOpcoes.buscandoPeriodosEscolares
          ? _jsx(Skeleton, { paragraph: false, active: true })
          : _jsx(Field, {
              component: MultiSelect,
              disableSearch: true,
              label: "Per\u00EDodo",
              name: "periodos",
              nomeDoItemNoPlural: "per\u00EDodos",
              placeholder: "Selecione os per\u00EDodos",
              options: view.periodosEscolaresOpcoes,
            }),
      }),
      _jsx("div", {
        className: "col-4",
        children: view.buscandoOpcoes.buscandoTiposAlimentacao
          ? _jsx(Skeleton, { paragraph: false, active: true })
          : _jsx(Field, {
              component: MultiSelect,
              disableSearch: true,
              label: "Tipo de Alimenta\u00E7\u00E3o",
              name: "tipos_alimentacao",
              nomeDoItemNoPlural: "alimenta\u00E7\u00F5es",
              placeholder: "Selecione os tipos de alimenta\u00E7\u00E3o",
              options: view.tiposAlimentacaoOpcoes,
            }),
      }),
    ],
  });
};
