import { jsx as _jsx } from "react/jsx-runtime";
import { Select } from "src/components/Shareable/Select";
import { required } from "src/helpers/fieldValidators";
import { Field } from "react-final-form";
export const SeletorCategoria = ({ ...props }) => {
  const { categorias, setTiposOcorrenciaDaCategoria, tiposOcorrencia } = props;
  return _jsx(Field, {
    component: Select,
    name: "categoria",
    label: "Categoria da Ocorr\u00EAncia",
    options: [{ nome: "Selecione uma categoria", uuid: "" }, ...categorias],
    onChangeEffect: (e) => {
      const value = e.target.value;
      setTiposOcorrenciaDaCategoria(
        tiposOcorrencia
          .filter((tipoOcorrencia) => tipoOcorrencia.categoria.uuid === value)
          .map((tipoOcorrencia) => {
            return {
              nome: tipoOcorrencia.titulo,
              ...tipoOcorrencia,
            };
          })
      );
    },
    required: true,
    validate: required,
  });
};
