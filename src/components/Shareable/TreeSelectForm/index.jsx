import { TreeSelect } from "antd";
import React from "react";
import { InputErroMensagem } from "components/Shareable/Input/InputErroMensagem";
import "./style.scss";

const TreeSelectForm = props => {
  const { label, meta, treeData, input, name, required } = props;

  return (
    <div className="input">
      {label && [
        required && (
          <span key={0} className="required-asterisk">
            *
          </span>
        ),
        <label key={1} htmlFor={name} className="col-form-label">
          {label}
        </label>
      ]}
      <TreeSelect
        {...props}
        {...input}
        treeData={treeData}
        style={{ width: "100%" }}
      />

      <InputErroMensagem meta={meta} />
    </div>
  );
};
export default TreeSelectForm;
