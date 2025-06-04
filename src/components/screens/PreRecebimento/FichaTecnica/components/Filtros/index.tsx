import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Form, Field } from "react-final-form";
import moment from "moment";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import "./styles.scss";
import { NavLink } from "react-router-dom";
import {
  CADASTRAR_FICHA_TECNICA,
  PRE_RECEBIMENTO,
} from "../../../../../../configs/constants";
import AutoCompleteSelectField from "src/components/Shareable/AutoCompleteSelectField";
import MultiSelect from "src/components/Shareable/FinalForm/MultiSelect";
import { InputComData } from "src/components/Shareable/DatePicker";
import { InputText } from "src/components/Shareable/Input/InputText";
import { getListaCompletaProdutosLogistica } from "../../../../../../services/produto.service";
import { getListaFiltradaAutoCompleteSelect } from "../../../../../../helpers/autoCompleteSelect";
import { FiltrosFichaTecnica } from "../../interfaces";
import { ProdutoLogistica } from "interfaces/produto.interface";
import { FichaTecnica } from "interfaces/pre_recebimento.interface";

interface Props {
  setFiltros: Dispatch<SetStateAction<FiltrosFichaTecnica>>;
  setFichas: Dispatch<SetStateAction<FichaTecnica[]>>;
  setConsultaRealizada: Dispatch<SetStateAction<boolean>>;
}

const Filtros: React.FC<Props> = ({
  setFiltros,
  setFichas,
  setConsultaRealizada,
}) => {
  const [listaProdutos, setListaProdutos] = useState<Array<ProdutoLogistica>>(
    []
  );

  const buscarListaProdutos = async (): Promise<void> => {
    const response = await getListaCompletaProdutosLogistica();
    setListaProdutos(response.data.results);
  };

  const opcoesStatus = [
    {
      label: "Rascunho",
      value: "RASCUNHO",
    },
    {
      label: "Aprovada",
      value: "APROVADA",
    },
    {
      label: "Enviada para Análise",
      value: "ENVIADA_PARA_ANALISE",
    },
    {
      label: "Solicitação de Alteração",
      value: "ENVIADA_PARA_CORRECAO",
    },
  ];

  const onSubmit = async (values: Record<string, any>): Promise<void> => {
    let filtros = { ...values };
    if (values.data_criacao) {
      delete filtros.data_criacao;
      filtros.data_cadastro = moment(values.data_criacao, "DD/MM/YYYY").format(
        "YYYY-MM-DD"
      );
    }
    setFiltros(filtros);
  };

  useEffect(() => {
    buscarListaProdutos();
  }, []);

  return (
    <div className="filtros-fichas-tecnicas">
      <Form
        onSubmit={onSubmit}
        initialValues={{}}
        render={({ form, handleSubmit, values }) => (
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-6 mt-2">
                <Field
                  component={InputText}
                  label="Filtrar por N° da Ficha"
                  dataTestId="numero_ficha"
                  name="numero_ficha"
                  placeholder="Digite o Nº da Ficha"
                  className="input-busca-ficha"
                  toUppercaseActive
                />
              </div>

              <div className="col-6 mt-2">
                <Field
                  component={AutoCompleteSelectField}
                  options={getListaFiltradaAutoCompleteSelect(
                    listaProdutos.map((e) => e.nome),
                    values.nome_produto,
                    true
                  )}
                  label="Filtrar por Produto"
                  name="nome_produto"
                  placeholder="Selecione um Produto"
                />
              </div>

              <div className="col-4 mt-2">
                <Field
                  component={InputText}
                  label="Filtrar por Pregão/Chamada Pública"
                  name="pregao_chamada_publica"
                  placeholder="Digite o Nº do Pregão/Chamada Pública"
                  className="input-busca-ficha"
                />
              </div>

              <div className="col-4 mt-2">
                <Field
                  component={MultiSelect}
                  disableSearch
                  options={opcoesStatus}
                  label="Filtrar por Status"
                  name="status"
                  nomeDoItemNoPlural="Status"
                  placeholder="Selecione os Status"
                />
              </div>

              <div className="col-4 mt-2">
                <Field
                  component={InputComData}
                  className="input-data"
                  label="Filtrar por Data do Cadastro"
                  name="data_criacao"
                  placeholder="Selecione a Data do Cadastro"
                  writable={false}
                  minDate={null}
                  maxDate={null}
                />
              </div>
            </div>

            <div className="pt-4 pb-4">
              <NavLink to={`/${PRE_RECEBIMENTO}/${CADASTRAR_FICHA_TECNICA}`}>
                <Botao
                  texto="Cadastrar Ficha Técnica"
                  type={BUTTON_TYPE.BUTTON}
                  style={BUTTON_STYLE.GREEN}
                />
              </NavLink>

              <Botao
                texto="Filtrar"
                type={BUTTON_TYPE.SUBMIT}
                style={BUTTON_STYLE.GREEN}
                className="float-end ms-3"
              />

              <Botao
                texto="Limpar Filtros"
                type={BUTTON_TYPE.BUTTON}
                style={BUTTON_STYLE.GREEN_OUTLINE}
                className="float-end ms-3"
                onClick={() => {
                  form.reset({});
                  setFichas([]);
                  setConsultaRealizada(false);
                  setFiltros({});
                }}
              />
            </div>
          </form>
        )}
      />
    </div>
  );
};

export default Filtros;
