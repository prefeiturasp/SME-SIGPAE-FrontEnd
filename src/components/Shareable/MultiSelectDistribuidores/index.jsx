import React, { useState, useEffect } from "react";
import { Field } from "react-final-form";
import { getNomesDistribuidores } from "services/logistica.service.js";
import MultiSelect from "components/Shareable/FinalForm/MultiSelect";

const MultiSelectDistribuidores = ({ name, label, className }) => {
  const [distribuidoresSelecionados, setDistribuidoresSelecionados] = useState(
    []
  );
  const [distribuidores, setDistribuidores] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const listaDistribuidores = await getNomesDistribuidores();
        let listaRsultados = listaDistribuidores.data.results;
        let listaFormatada = listaRsultados.map(element => {
          return { value: element.uuid, label: element.razao_social };
        });
        setDistribuidores(listaFormatada);
      } catch (erro) {
        throw erro;
      }
    })();
  }, []);

  const onDistribuidoresSelected = values => {
    let distribuidoresSelecionadosNomes = [];
    values.forEach(value => {
      const indice = distribuidores.findIndex(
        distribuidor => distribuidor.value === value
      );
      distribuidoresSelecionadosNomes.push(distribuidores[indice].label);
    });
    setDistribuidoresSelecionados(values);
  };

  return (
    <Field
      className={className}
      label={label}
      component={MultiSelect}
      name={name}
      nomeDoItemNoPlural="distribuidores"
      selected={distribuidoresSelecionados}
      options={distribuidores}
      onSelectedChanged={value => onDistribuidoresSelected(value)}
    />
  );
};
export default MultiSelectDistribuidores;
