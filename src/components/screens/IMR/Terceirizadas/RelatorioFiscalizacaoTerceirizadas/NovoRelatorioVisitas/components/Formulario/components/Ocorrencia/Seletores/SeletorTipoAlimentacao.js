import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Field } from "react-final-form";
import Select from "src/components/Shareable/Select";
import HTTP_STATUS from "http-status-codes";
import { required } from "src/helpers/fieldValidators";
import { getVinculosTipoAlimentacaoPorEscola } from "src/services/cadastroTipoAlimentacao.service";
export const SeletorTipoAlimentacao = ({ ...props }) => {
  const { titulo, name, escolaSelecionada, somenteLeitura } = props;
  const [options, setOptions] = useState([]);
  const getOptionsAsync = async (escola_uuid) => {
    const response = await getVinculosTipoAlimentacaoPorEscola(escola_uuid);
    if (response.status === HTTP_STATUS.OK) {
      const itemsMap = new Map();
      response.data.results.forEach((item) => {
        item.tipos_alimentacao.forEach((tipo) => {
          itemsMap.set(tipo.nome, {
            nome: tipo.nome,
            uuid: tipo.uuid,
          });
        });
      });
      setOptions(Array.from(itemsMap.values()));
    }
  };
  useEffect(() => {
    getOptionsAsync(escolaSelecionada.uuid);
  }, [escolaSelecionada]);
  return _jsx(Field, {
    component: Select,
    naoDesabilitarPrimeiraOpcao: true,
    options: [
      { nome: "Selecione um Tipo de Alimentação", uuid: "" },
      ...options,
    ],
    label: titulo,
    name: name,
    className: "seletor-imr",
    required: true,
    validate: required,
    disabled: somenteLeitura,
  });
};
