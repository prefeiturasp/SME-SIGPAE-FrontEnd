import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Skeleton } from "antd";
import { Field } from "react-final-form";
import { required } from "src/helpers/fieldValidators";
import { Select } from "src/components/Shareable/Select";
import useView from "./view";
export default ({ ...props }) => {
  const ehCadastro = props.ehCadastro;
  const setTiposAlimentacao = props.ehCadastro && props.setTiposAlimentacao;
  const setGrupoSelecionado = props.ehCadastro && props.setGrupoSelecionado;
  const setFaixasEtarias = props.ehCadastro && props.setFaixasEtarias;
  const setParametrizacao = props.ehCadastro && props.setParametrizacao;
  const form = props.ehCadastro && props.form;
  const uuidParametrizacao = props.ehCadastro && props.uuidParametrizacao;
  const view = useView({
    setTiposAlimentacao,
    setGrupoSelecionado,
    setFaixasEtarias,
    setParametrizacao,
    uuidParametrizacao,
    form,
  });
  return _jsxs("div", {
    className: "row",
    children: [
      _jsx("div", {
        className: "col-4",
        children: view.carregando
          ? _jsx(Skeleton, { paragraph: false, active: true })
          : _jsx(Field, {
              component: Select,
              name: "edital",
              label: "N\u00BA do Edital",
              naoDesabilitarPrimeiraOpcao: true,
              options: view.editais,
              validate: ehCadastro && required,
              required: ehCadastro,
              disabled: uuidParametrizacao,
            }),
      }),
      _jsx("div", {
        className: "col-8",
        children: view.carregando
          ? _jsx(Skeleton, { paragraph: false, active: true })
          : _jsx(Field, {
              component: Select,
              name: "lote",
              label: "Lote e DRE",
              naoDesabilitarPrimeiraOpcao: true,
              options: view.lotes,
              validate: ehCadastro && required,
              required: ehCadastro,
              disabled: uuidParametrizacao,
            }),
      }),
      _jsx("div", {
        className: "col-4",
        children: view.carregando
          ? _jsx(Skeleton, { paragraph: false, active: true })
          : _jsx(Field, {
              component: Select,
              name: "tipos_unidades",
              label: "Tipo de Unidade",
              naoDesabilitarPrimeiraOpcao: true,
              options: view.tiposUnidadesOpcoes,
              validate: ehCadastro && required,
              required: ehCadastro,
              onChangeEffect: (e) =>
                ehCadastro && view.onChangeTiposUnidades(e.target.value),
              disabled: uuidParametrizacao,
            }),
      }),
    ],
  });
};
