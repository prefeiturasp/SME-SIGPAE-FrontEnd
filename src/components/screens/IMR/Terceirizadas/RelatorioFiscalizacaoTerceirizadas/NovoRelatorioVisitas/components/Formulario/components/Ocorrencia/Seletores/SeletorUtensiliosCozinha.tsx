import React, { useEffect, useState } from "react";
import { Field } from "react-final-form";
import Select from "src/components/Shareable/Select";
import HTTP_STATUS from "http-status-codes";
import { required } from "src/helpers/fieldValidators";
import { getUtensiliosCozinha } from "src/services/imr/relatorioFiscalizacaoTerceirizadas";
import { SelectOption } from "interfaces/option.interface";
import { EscolaLabelInterface } from "interfaces/imr.interface";

type SeletorUtensiliosCozinhaType = {
  titulo: string;
  name: string;
  escolaSelecionada: EscolaLabelInterface;
  somenteLeitura: boolean;
};

export const SeletorUtensiliosCozinha = ({
  ...props
}: SeletorUtensiliosCozinhaType) => {
  const { titulo, name, escolaSelecionada, somenteLeitura } = props;
  const [options, setOptions] = useState<Array<SelectOption>>([]);

  const getOptionsAsync = async (edital_uuid) => {
    const response = await getUtensiliosCozinha({ edital_uuid: edital_uuid });
    if (response.status === HTTP_STATUS.OK) {
      const itemsMap: Map<string, SelectOption> = new Map();

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

  return (
    <Field
      component={Select}
      naoDesabilitarPrimeiraOpcao
      options={[
        { nome: "Selecione um Utensílio de Cozinha", uuid: "" },
        ...options,
      ]}
      label={titulo}
      name={name}
      className="seletor-imr"
      required
      validate={required}
      disabled={somenteLeitura}
    />
  );
};
