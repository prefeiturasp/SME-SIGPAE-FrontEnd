import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import { CADASTRO_SALDO_LAUDO, RECEBIMENTO } from "src/configs/constants";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import { Field } from "react-final-form";
import Botao from "src/components/Shareable/Botao";
import CollapseFiltros from "src/components/Shareable/CollapseFiltros";
import InputText from "src/components/Shareable/Input/InputText";
import AutoCompleteSelectField from "src/components/Shareable/AutoCompleteSelectField";

import { getListaCompletaProdutosLogistica } from "src/services/produto.service";
import { listaSimplesTerceirizadas } from "src/services/terceirizada.service";
import { getListaFiltradaAutoCompleteSelect } from "src/helpers/autoCompleteSelect";

import { ProdutoLogistica } from "src/interfaces/produto.interface";
import { TerceirizadaSimplesInterface } from "src/interfaces/terceirizada.interface";
import { AjusteSaldoLaudoListagem } from "../../interfaces";

import "./style.scss";

interface FiltrosProps {
  setFiltros: Dispatch<SetStateAction<Record<string, any>>>;
  setAjustes: Dispatch<SetStateAction<AjusteSaldoLaudoListagem[]>>;
}

const Filtros = ({ setFiltros, setAjustes }: FiltrosProps) => {
  const [produtos, setProdutos] = useState<ProdutoLogistica[]>([]);
  const [empresas, setEmpresas] = useState<TerceirizadaSimplesInterface[]>([]);

  const buscarListaProdutos = async (): Promise<void> => {
    const response = await getListaCompletaProdutosLogistica();
    setProdutos(response.data.results);
  };

  const buscarListaEmpresas = async (): Promise<void> => {
    const response = await listaSimplesTerceirizadas();
    setEmpresas(response.data.results);
  };

  const optionsCampoProdutos = (values: Record<string, any>) =>
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

  const onSubmit = (values: Record<string, any>): void => {
    let filtros = { ...values };
    setFiltros(filtros);
  };

  const onClear = () => {
    setAjustes([]);
    setFiltros({});
  };

  useEffect(() => {
    buscarListaProdutos();
    buscarListaEmpresas();
  }, []);

  return (
    <div className="filtros-ajustes-saldo">
      <CollapseFiltros onSubmit={onSubmit} onClear={onClear}>
        {(values) => (
          <>
            <div className="row">
              <div className={"col-4"}>
                <Field
                  component={InputText}
                  label="Filtrar por Nº do Cronograma"
                  name="numero_cronograma"
                  placeholder="Digite o Nº do Cronograma"
                />
              </div>
              <div className={"col-4"}>
                <Field
                  component={AutoCompleteSelectField}
                  options={optionsCampoProdutos(values)}
                  label="Filtrar por Produto"
                  name="nome_produto"
                  placeholder="Selecione um Produto"
                />
              </div>
              <div className="col-4">
                <Field
                  component={AutoCompleteSelectField}
                  options={optionsCampoEmpresa(values)}
                  label="Filtrar por Empresa"
                  name="nome_empresa"
                  placeholder="Selecione uma Empresa"
                />
              </div>
            </div>
          </>
        )}
      </CollapseFiltros>
      <div className="pt-4 pb-4">
        <NavLink to={`/${RECEBIMENTO}/${CADASTRO_SALDO_LAUDO}`}>
          <Botao
            texto="Cadastrar Saldo do Laudo"
            type={BUTTON_TYPE.BUTTON}
            style={BUTTON_STYLE.GREEN}
          />
        </NavLink>
      </div>
    </div>
  );
};

export default Filtros;
