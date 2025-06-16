import React, { useEffect, useState } from "react";
import { Field } from "react-final-form";
import { NavLink } from "react-router-dom";

import {
  CADASTRO_LAYOUT_EMBALAGEM,
  PRE_RECEBIMENTO,
} from "src/configs/constants";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import Botao from "src/components/Shareable/Botao";
import MultiSelect from "src/components/Shareable/FinalForm/MultiSelect";
import CollapseFiltros from "src/components/Shareable/CollapseFiltros";
import AutoCompleteSelectField from "src/components/Shareable/AutoCompleteSelectField";
import { getListaFiltradaAutoCompleteSelect } from "src/helpers/autoCompleteSelect";
import { getListaFichasTecnicasSimples } from "src/services/fichaTecnica.service";

import "./style.scss";

const OPCOES_STATUS = [
  {
    label: "Enviado para Análise",
    value: "ENVIADO_PARA_ANALISE",
  },
  {
    label: "Aprovado",
    value: "APROVADO",
  },
  {
    label: "Pendente de Correção",
    value: "SOLICITADO_CORRECAO",
  },
];

export default ({ setFiltros, setLayoutsEmbalagens, setConsultaRealizada }) => {
  const [fichasTecnicas, setFichasTecnicas] = useState([]);

  const buscarFichasTecnicas = async () => {
    const response = await getListaFichasTecnicasSimples();
    setFichasTecnicas(response.data.results);
  };

  const onSubmit = async (values) => {
    setFiltros({ ...values });
  };

  const onClear = () => {
    setLayoutsEmbalagens([]);
    setConsultaRealizada(false);
    setFiltros({});
  };

  useEffect(() => {
    buscarFichasTecnicas();
  }, []);

  return (
    <div className="filtros-layouts-embalagens">
      <CollapseFiltros onSubmit={onSubmit} onClear={onClear}>
        {(values) => (
          <div className="row">
            <div className="col-6 mt-2">
              <Field
                component={AutoCompleteSelectField}
                options={getListaFiltradaAutoCompleteSelect(
                  fichasTecnicas.map((e) => e.numero),
                  values.numero_ficha_tecnica
                )}
                label="Filtrar Ficha Técnica"
                name="numero_ficha_tecnica"
                placeholder="Digite o Nº da Ficha Técnica"
              />
            </div>

            <div className="col-6 mt-2">
              <Field
                component={AutoCompleteSelectField}
                options={getListaFiltradaAutoCompleteSelect(
                  fichasTecnicas.map((e) => e.produto.nome),
                  values.nome_produto
                )}
                label="Filtrar por Nome do Produto"
                name="nome_produto"
                placeholder="Selecione um Produto"
              />
            </div>

            <div className="col-6 mt-2">
              <Field
                component={AutoCompleteSelectField}
                options={getListaFiltradaAutoCompleteSelect(
                  fichasTecnicas.map((e) => e.pregao_chamada_publica),
                  values.pregao_chamada_publica
                )}
                label="Filtrar por Nº do Pregão/Chamada Pública"
                name="pregao_chamada_publica"
                placeholder="Digite o Nº do Pregão/Chamada Pública"
              />
            </div>

            <div className="col-6 mt-2">
              <Field
                component={MultiSelect}
                disableSearch
                options={OPCOES_STATUS}
                label="Filtrar por Status"
                name="status"
                nomeDoItemNoPlural="Status"
                placeholder="Selecione os Status"
              />
            </div>
          </div>
        )}
      </CollapseFiltros>

      <div className="pt-4 pb-4">
        <NavLink to={`/${PRE_RECEBIMENTO}/${CADASTRO_LAYOUT_EMBALAGEM}`}>
          <Botao
            texto="Cadastrar Layout de Embalagem"
            type={BUTTON_TYPE.BUTTON}
            style={BUTTON_STYLE.GREEN}
          />
        </NavLink>
      </div>
    </div>
  );
};
