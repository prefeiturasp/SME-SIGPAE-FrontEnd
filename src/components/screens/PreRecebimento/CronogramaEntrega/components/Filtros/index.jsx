import React, { useState } from "react";
import moment from "moment";
import { Field } from "react-final-form";
import { NavLink } from "react-router-dom";

import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "components/Shareable/Botao/constants";
import Botao from "components/Shareable/Botao";
import { InputComData } from "components/Shareable/DatePicker";
import CollapseFiltros from "components/Shareable/CollapseFiltros";
import MultiSelect from "components/Shareable/FinalForm/MultiSelect";
import { InputText } from "components/Shareable/Input/InputText";
import { usuarioEhEmpresaFornecedor } from "helpers/utilities";
import { CADASTRO_CRONOGRAMA, PRE_RECEBIMENTO } from "configs/constants.js";

import "./style.scss";
import {
  usuarioEhCodaeDilog,
  usuarioEhCronograma,
} from "../../../../../../helpers/utilities";

import TransferMultiSelect from "components/Shareable/TransferMultiSelect";

export default ({
  setFiltros,
  setCronogramas,
  setTotal,
  inicioResultado,
  armazens,
}) => {
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [targetKeys, setTargetKeys] = useState(["RASCUNHO"]);

  const TransferOptionsStatus = [
    {
      key: "RASCUNHO",
      title: "Rascunho",
      chosen: false,
      disabled: false,
    },
    {
      key: "ASSINADO_E_ENVIADO_AO_FORNECEDOR",
      title: "Assinado e Enviado ao Fornecedor",
      chosen: false,
      disabled: false,
    },
    {
      key: "ASSINADO_FORNECEDOR",
      title: "Assinado Fornecedor",
      chosen: false,
      disabled: false,
    },
    {
      key: "ASSINADO_DINUTRE",
      title: "Assinado DINUTRE",
      chosen: false,
      disabled: false,
    },
    {
      key: "ASSINADO_CODAE",
      title: "Assinado CODAE",
      chosen: false,
      disabled: false,
    },
    {
      key: "ALTERACAO_CODAE",
      title: "Alteração CODAE",
      chosen: false,
      disabled: false,
    },
    {
      key: "SOLICITADO_ALTERACAO",
      title: "Solicitado Alteração",
      chosen: false,
      disabled: false,
    },
  ];

  const filterOption = (inputValue, option) =>
    option.title.toLowerCase().indexOf(inputValue?.toLowerCase()) > -1;

  const handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  const handleChange = (newTargetKeys) => {
    const diff = newTargetKeys.filter((item) => !targetKeys.includes(item));
    setTargetKeys([...targetKeys, ...diff]);
  };

  // function mergeListsPreserveOrder(a, b) {
  //   const diff = b.filter((item) => !a.includes(item));
  //   return [...a, ...diff];
  // }

  const onSubmit = async (values) => {
    const filtros = { ...values };
    if (targetKeys.length) filtros.status = targetKeys;
    if (filtros.motivos) {
      filtros.motivos = filtros.motivos.toString();
    }

    setFiltros({ ...filtros });
  };

  const onClear = () => {
    setCronogramas(undefined);
    setTotal(undefined);

    setSelectedKeys([]);
    setTargetKeys([]);
  };

  return (
    <div className="filtros-cronograma-de-entrega">
      <CollapseFiltros onSubmit={onSubmit} onClear={onClear}>
        {(values) => (
          <>
            <div className="row">
              <div className="col-6">
                <Field
                  component={InputText}
                  label="Filtrar por Nome do Produto"
                  name="nome_produto"
                  placeholder="Digite o produto"
                  className="input-busca-cronograma"
                />
              </div>
              {usuarioEhEmpresaFornecedor() ? (
                <div className="col-6">
                  <Field
                    component={MultiSelect}
                    label="Armazém"
                    disableSearch
                    name="armazem"
                    multiple
                    nomeDoItemNoPlural="armazéns"
                    placeholder="Selecione o Armazém"
                    options={armazens}
                  />
                </div>
              ) : (
                <div className="col-6">
                  <Field
                    component={InputText}
                    label="Filtrar por Nome da Empresa"
                    name="nome_empresa"
                    placeholder="Digite o nome da empresa"
                    className="input-busca-cronograma"
                  />
                </div>
              )}
            </div>
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
            <div className="row">
              <div className="col">
                <Field
                  component={TransferMultiSelect}
                  dataSource={[...TransferOptionsStatus]}
                  showSearch
                  filterOption={filterOption}
                  selectedKeys={selectedKeys}
                  targetKeys={targetKeys}
                  onSelectChange={handleSelectChange}
                  onChange={handleChange}
                  render={(item) => item.title}
                  locale={{
                    itemUnit: "item",
                    itemsUnit: "itens",
                    notFoundContent: null,
                    searchPlaceholder: "Pesquisar",
                  }}
                  showSelectAll
                  label="Status"
                  name="status"
                  required
                />
              </div>
            </div>
          </>
        )}
      </CollapseFiltros>

      <div className="botoes pt-4" ref={inicioResultado}>
        {(usuarioEhCronograma() || usuarioEhCodaeDilog()) && (
          <NavLink to={`/${PRE_RECEBIMENTO}/${CADASTRO_CRONOGRAMA}`}>
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
