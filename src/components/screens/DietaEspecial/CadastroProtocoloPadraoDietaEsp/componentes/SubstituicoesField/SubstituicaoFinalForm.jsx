import React, { useState } from "react";
import { Field } from "react-final-form";
import { required } from "src/helpers/fieldValidators";
import Select from "../../../../../Shareable/Select";
import { CaretDownOutlined } from "@ant-design/icons";
import { Select as SelectAntd } from "antd";
import Botao from "../../../../../Shareable/Botao";
import { ASelect } from "src/components/Shareable/MakeField";
import {
  BUTTON_STYLE,
  BUTTON_ICON,
} from "../../../../../Shareable/Botao/constants";
import { Tooltip } from "antd";

import "./style.scss";
import StatefulMultiSelect from "@khanacademy/react-multi-select";

const { Option } = SelectAntd;

const SelectSelecione = (props) => {
  const {
    input: { onChange, value },
    options,
    ...rest
  } = props;
  return (
    <Select
      naoDesabilitarPrimeiraOpcao={value !== undefined}
      options={
        value === ""
          ? [{ uuid: "0", nome: "Selecione..." }].concat(options)
          : options
      }
      input={{ value: value || "0", onChange }}
      {...rest}
    />
  );
};

const SubstituicoesField = ({
  chave,
  alimentos,
  produtos,
  removeOption,
  input: { name },
  form,
  values,
  deveHabilitarApagar,
}) => {
  const [valoresSelecionados, setValoresSelecionados] = useState([]);
  const [open, setOpen] = useState(false);

  const produtosSelecionados = (values) => {
    let listaSelecionados = [];
    values &&
      values.forEach((value) => {
        const produtoSelecionado = produtos.find(
          (al) => String(al.uuid) === value
        );
        listaSelecionados.push(`${produtoSelecionado.nome}, `);
        setValoresSelecionados(listaSelecionados);
      });
  };

  return (
    <>
      <div className="row">
        <div className="col-4 select-produto">
          <Field
            component={ASelect}
            className={"select-form-produto"}
            suffixIcon={<CaretDownOutlined onClick={() => setOpen(!open)} />}
            open={open}
            onClick={() => setOpen(!open)}
            onBlur={() => setOpen(false)}
            showSearch
            name={`${name}.alimento`}
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
          >
            {alimentos.map((a) => {
              return <Option key={a.id.toString()}>{a.nome}</Option>;
            })}
          </Field>
        </div>
        <div className="col-3">
          <Field
            component={SelectSelecione}
            options={[
              { uuid: "I", nome: "Isento" },
              { uuid: "S", nome: "Substituir" },
            ]}
            name={`${name}.tipo`}
            validate={required}
          />
        </div>
        <div className="col-4">
          <Tooltip
            title={
              valoresSelecionados && valoresSelecionados.length > 0
                ? valoresSelecionados
                : values.substituicoes &&
                  produtosSelecionados(values.substituicoes[chave].substitutos)
            }
          >
            <span>
              <Field
                component={StatefulMultiSelect}
                name={`${name}.substitutos`}
                selected={
                  (values.substituicoes &&
                    values.substituicoes[chave].substitutos) ||
                  []
                }
                options={produtos.map((produto) => ({
                  value: produto.uuid,
                  label: produto.nome,
                }))}
                onSelectedChanged={(values_) => {
                  form.change(`substituicoes[${chave}].substitutos`, values_);
                  produtosSelecionados(values_);
                }}
                validate={required}
                disableSearch={false}
                overrideStrings={{
                  selectSomeItems: "Selecione",
                  allItemsAreSelected: "Todos os itens estão selecionados",
                  selectAll: "Todos",
                  Search: "Buscar",
                }}
              />
            </span>
          </Tooltip>
        </div>
        {deveHabilitarApagar && chave > 0 && (
          <div className="col-1">
            <Botao
              icon={BUTTON_ICON.TRASH}
              onClick={() => deveHabilitarApagar && removeOption()}
              style={BUTTON_STYLE.GREEN_OUTLINE}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default SubstituicoesField;
