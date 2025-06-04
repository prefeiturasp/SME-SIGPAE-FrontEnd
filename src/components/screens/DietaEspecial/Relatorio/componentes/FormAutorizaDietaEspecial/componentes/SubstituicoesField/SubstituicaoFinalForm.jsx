import React, { Component } from "react";
import StatefulMultiSelect from "@khanacademy/react-multi-select";
import { Field } from "react-final-form";
import { required } from "src/helpers/fieldValidators";
import Select from "src/components/Shareable/Select";
import { Select as SelectAntd } from "antd";
import { CaretDownOutlined } from "@ant-design/icons";
import Botao from "src/components/Shareable/Botao";
import { ASelect } from "src/components/Shareable/MakeField";
import {
  BUTTON_STYLE,
  BUTTON_ICON,
} from "src/components/Shareable/Botao/constants";

import "./style.scss";

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

export default class SubstituicoesField extends Component {
  state = { valorSelecionado: undefined };

  render() {
    const {
      alimentos,
      produtos,
      removeOption,
      input: { name },
      form,
      values,
      index,
      deveHabilitarApagar,
    } = this.props;

    return (
      <>
        <div className="row">
          <div className="col-4 select-produto">
            <Field
              component={ASelect}
              className={"select-form-produto"}
              suffixIcon={<CaretDownOutlined />}
              showSearch
              validate={required}
              name={`${name}.alimento`}
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
              onChange={(value) => {
                this.setState({
                  valorSelecionado: alimentos.find(
                    (al) => String(al.id) === value
                  ),
                });
                form.change(`${name}.alimento`, value);
              }}
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
            <Field
              component={StatefulMultiSelect}
              name={`${name}.substitutos`}
              selected={
                (values.substituicoes &&
                  values.substituicoes[index].substitutos) ||
                []
              }
              options={produtos.map((produto) => ({
                value: produto.uuid,
                label: produto.nome,
              }))}
              onSelectedChanged={(values_) =>
                form.change(
                  `substituicoes[
                ${index}].substitutos`,
                  values_
                )
              }
              disableSearch={false}
              hasSelectAll={false}
              overrideStrings={{
                selectSomeItems: "Selecione",
                allItemsAreSelected: "Todos os itens estão selecionados",
                selectAll: "Todos",
              }}
              validate={required}
            />
          </div>
          {deveHabilitarApagar && (
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
  }
}
