import React, { useEffect, useState } from "react";
import moment from "moment";
import { Field } from "react-final-form";
import { NavLink } from "react-router-dom";

import AutoCompleteSelectField from "src/components/Shareable/AutoCompleteSelectField";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import Botao from "src/components/Shareable/Botao";
import { InputComData } from "src/components/Shareable/DatePicker";
import CollapseFiltros from "src/components/Shareable/CollapseFiltros";
import MultiSelect from "src/components/Shareable/FinalForm/MultiSelect";
import { InputText } from "src/components/Shareable/Input/InputText";
import { usuarioEhEmpresaFornecedor } from "src/helpers/utilities";
import { getListaFiltradaAutoCompleteSelect } from "src/helpers/autoCompleteSelect";
import { getCronogramasMensalAssinados } from "src/services/cronogramaSemanal.service";
import { listaSimplesTerceirizadas } from "src/services/terceirizada.service";
import {
  PRE_RECEBIMENTO,
  CADASTRO_CRONOGRAMA_SEMANAL,
} from "src/configs/constants";

import { montarOptionsStatus } from "./utils";
import "./style.scss";
import {
  usuarioEhCodaeDilog,
  usuarioEhCronograma,
} from "../../../../../../helpers/utilities";
import { TerceirizadaSimplesInterface } from "src/interfaces/terceirizada.interface";

type ProdutoSimples = {
  nome: string;
};

export default ({ setFiltros, setCronogramas, setTotal, inicioResultado }) => {
  const [produtos, setProdutos] = useState<ProdutoSimples[]>([]);
  const [empresas, setEmpresas] = useState<TerceirizadaSimplesInterface[]>([]);

  const buscarListaProdutos = async (): Promise<void> => {
    const response = await getCronogramasMensalAssinados();
    const produtosUnicos = response.data
      .map((cronograma) => cronograma.produto_nome)
      .filter((nome, index, self) => nome && self.indexOf(nome) === index)
      .map((nome) => ({ nome }));
    setProdutos(produtosUnicos);
  };

  const buscarListaEmpresas = async (): Promise<void> => {
    const response = await listaSimplesTerceirizadas();
    setEmpresas(response.data.results);
  };

  const onSubmit = async (values) => {
    const filtros = { ...values };
    if (filtros?.status) filtros.status = filtros.status.flat();

    if (!filtros.data_inicial) {
      delete filtros.data_inicial;
    }
    if (!filtros.data_final) {
      delete filtros.data_final;
    }

    setFiltros({ ...filtros });
  };

  const onClear = () => {
    setCronogramas(undefined);
    setTotal(undefined);
  };

  const optionsCampoProdutos = (values) =>
    getListaFiltradaAutoCompleteSelect(
      produtos.map((e) => e.nome),
      values.nome_produto,
      true,
    );

  const optionsCampoEmpresa = (values: Record<string, any>) =>
    getListaFiltradaAutoCompleteSelect(
      empresas.map((e) => e.nome_fantasia),
      values.nome_empresa,
      true,
    );

  useEffect(() => {
    buscarListaProdutos();
    buscarListaEmpresas();
  }, []);

  return (
    <div className="filtros-cronograma-de-entrega">
      <CollapseFiltros onSubmit={onSubmit} onClear={onClear}>
        {(values) => (
          <>
            {usuarioEhEmpresaFornecedor() ? (
              <div className="row">
                <div className="col-6">
                  <Field
                    component={AutoCompleteSelectField}
                    options={optionsCampoProdutos(values)}
                    label="Filtrar por Produto"
                    name="nome_produto"
                    placeholder="Selecione um Produto"
                  />
                </div>
                <div className="col-6">
                  <Field
                    component={InputText}
                    label="Filtrar por N° do Cronograma"
                    name="numero"
                    placeholder="Digite o n° do Cronograma"
                    className="input-busca-cronograma"
                  />
                </div>
              </div>
            ) : (
              <div className="row">
                <div className="col-6">
                  <Field
                    component={AutoCompleteSelectField}
                    options={optionsCampoProdutos(values)}
                    label="Filtrar por Produto"
                    name="nome_produto"
                    placeholder="Selecione um Produto"
                  />
                </div>
                <div className="col-6">
                  <Field
                    component={AutoCompleteSelectField}
                    options={optionsCampoEmpresa(values)}
                    label="Filtrar por Empresa"
                    name="nome_empresa"
                    placeholder="Selecione uma Empresa"
                  />
                </div>
              </div>
            )}
            <div className="row mt-3">
              {!usuarioEhEmpresaFornecedor() && (
                <div className="col-3">
                  <Field
                    component={InputText}
                    label="Filtrar por N° do Cronograma"
                    name="numero"
                    placeholder="Digite o n° do Cronograma"
                    className="input-busca-cronograma"
                  />
                </div>
              )}
              <div
                className={`col-${usuarioEhEmpresaFornecedor() ? "6" : "3"}`}
              >
                <Field
                  component={MultiSelect}
                  label="Filtrar por Status"
                  disableSearch
                  name="status"
                  multiple
                  nomeDoItemNoPlural="status"
                  options={montarOptionsStatus()}
                />
              </div>

              <div className="col-3">
                <Field
                  component={InputComData}
                  label="Filtrar por Período de Recebimento"
                  name="data_inicial"
                  className="data-field-cronograma"
                  placeholder="De"
                  minDate={null}
                  maxDate={
                    values.data_final
                      ? moment(values.data_final, "DD/MM/YYYY")._d
                      : null
                  }
                />
              </div>
              <div className="col-3">
                <Field
                  component={InputComData}
                  label="&nbsp;"
                  name="data_final"
                  className="data-field-cronograma"
                  popperPlacement="bottom-end"
                  placeholder="Até"
                  minDate={
                    values.data_inicial
                      ? moment(values.data_inicial, "DD/MM/YYYY")._d
                      : null
                  }
                  maxDate={null}
                />
              </div>
            </div>
          </>
        )}
      </CollapseFiltros>

      <div className="botoes pt-4" ref={inicioResultado}>
        {(usuarioEhCronograma() || usuarioEhCodaeDilog()) && (
          <NavLink to={`/${PRE_RECEBIMENTO}/${CADASTRO_CRONOGRAMA_SEMANAL}`}>
            <Botao
              texto="Cadastrar Cronograma"
              type={BUTTON_TYPE.BUTTON}
              style={BUTTON_STYLE.GREEN}
              onClick={() => {}}
            />
          </NavLink>
        )}
      </div>
    </div>
  );
};
