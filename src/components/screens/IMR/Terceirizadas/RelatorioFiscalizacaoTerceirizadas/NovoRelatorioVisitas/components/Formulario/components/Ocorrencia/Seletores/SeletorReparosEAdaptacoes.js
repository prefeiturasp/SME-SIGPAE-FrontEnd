import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Field } from "react-final-form";
import Select from "src/components/Shareable/Select";
import HTTP_STATUS from "http-status-codes";
import { required } from "src/helpers/fieldValidators";
import { getReparosEAdaptacoes } from "src/services/imr/relatorioFiscalizacaoTerceirizadas";
export const SeletorReparosEAdaptacoes = ({ ...props }) => {
  const { titulo, name, escolaSelecionada, somenteLeitura } = props;
  const [options, setOptions] = useState([]);
  const getOptionsAsync = async (edital_uuid) => {
    const response = await getReparosEAdaptacoes({ edital_uuid: edital_uuid });
    if (response.status === HTTP_STATUS.OK) {
      const itemsMap = new Map();
      response.data.results.forEach((item) => {
        itemsMap.set(item.nome, {
          nome: item.nome,
          uuid: item.uuid,
        });
      });
      setOptions(Array.from(itemsMap.values()));
    }
  };
  useEffect(() => {
    if (escolaSelecionada) {
      getOptionsAsync(escolaSelecionada.edital);
    }
  }, [escolaSelecionada]);
  return _jsx(Field, {
    component: Select,
    naoDesabilitarPrimeiraOpcao: true,
    options: [
      { nome: "Selecione um Reparo e Adaptação", uuid: "" },
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
