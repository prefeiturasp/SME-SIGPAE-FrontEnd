import React, { useState } from "react";
import { Field } from "react-final-form";
import { ASelect } from "src/components/Shareable/MakeField";
import { Select as SelectAntd } from "antd";
import { CaretDownOutlined } from "@ant-design/icons";
import { selectValidate } from "src/helpers/fieldValidators";

const ClassificacaoDaDieta = ({ classificacoesDieta }) => {
  const [open, setOpen] = useState(false);

  const { Option } = SelectAntd;

  const opcoes = classificacoesDieta.map((classificacao) => {
    return <Option key={classificacao.uuid}>{classificacao.nome}</Option>;
  });

  return (
    <div className="row mt-3">
      <div className="col-12 input title">
        <span className="required-asterisk">*</span>
        <label>Classificação da Dieta</label>
      </div>
      <div className="col-4">
        <Field
          component={ASelect}
          className={"select-form-produto"}
          suffixIcon={<CaretDownOutlined onClick={() => setOpen(!open)} />}
          open={open}
          onClick={() => setOpen(!open)}
          onBlur={() => setOpen(false)}
          showSearch
          required
          validate={selectValidate}
          name="classificacao"
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0
          }
        >
          {opcoes}
        </Field>
      </div>
    </div>
  );
};

export default ClassificacaoDaDieta;
