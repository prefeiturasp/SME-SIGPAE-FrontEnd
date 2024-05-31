import React, { useEffect, useState } from "react";
import { Field } from "react-final-form";
import Select from "components/Shareable/Select";
import HTTP_STATUS from "http-status-codes";
import { required } from "helpers/fieldValidators";
import { getVinculosTipoAlimentacaoPorEscola } from "services/cadastroTipoAlimentacao.service";
import { SelectOption } from "interfaces/option.interface";
import { EscolaLabelInterface } from "interfaces/imr.interface";

type SeletorTipoAlimentacaoType = {
  titulo: string;
  name: string;
  escolaSelecionada: EscolaLabelInterface;
};

export const SeletorTipoAlimentacao = ({
  ...props
}: SeletorTipoAlimentacaoType) => {
  const { titulo, name, escolaSelecionada } = props;
  const [options, setOptions] = useState<Array<SelectOption>>([]);

  const getOptionsAsync = async (escola_uuid) => {
    const response = await getVinculosTipoAlimentacaoPorEscola(escola_uuid);
    if (response.status === HTTP_STATUS.OK) {
      const itemsMap: Map<string, SelectOption> = new Map();

      response.data.results.forEach((item) => {
        item.tipos_alimentacao.forEach((tipo: SelectOption) => {
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

  return (
    <Field
      component={Select}
      naoDesabilitarPrimeiraOpcao
      options={[
        { nome: "Selecione um Tipo de Alimentação", uuid: "" },
        ...options,
      ]}
      label={titulo}
      name={name}
      className="seletor-imr"
      required
      validate={required}
    />
  );
};
