import { jsx as _jsx } from "react/jsx-runtime";
import { Select } from "src/components/Shareable/Select";
import { required } from "src/helpers/fieldValidators";
import { Field } from "react-final-form";
export const SeletorTipoOcorrencia = ({ ...props }) => {
  const {
    setTipoOcorrencia,
    tiposOcorrenciaDaCategoria,
    tiposOcorrencia,
    values,
    form,
  } = props;
  return _jsx(Field, {
    component: Select,
    name: "tipo_ocorrencia",
    label: "Tipos de Ocorr\u00EAncia",
    options: [
      {
        nome: "Selecione um tipo de ocorrência",
        uuid: "",
      },
      ...tiposOcorrenciaDaCategoria,
    ],
    required: true,
    validate: required,
    disabled: !values.categoria,
    naoDesabilitarPrimeiraOpcao: true,
    onChangeEffect: async (e) => {
      const value = e.target.value;
      await setTipoOcorrencia(
        tiposOcorrencia.find((tipoOcorrencia) => tipoOcorrencia.uuid === value)
      );
      await form.change("grupos", [{}]);
    },
  });
};
