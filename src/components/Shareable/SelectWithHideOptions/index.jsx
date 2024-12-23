import React from "react";

import { Select } from "antd";
import "./styles.css";
const { Option } = Select;

export class SelectWithHideOptions extends React.Component {
  state = {};

  render() {
    const {
      input,
      options,
      placeholder,
      handleChange,
      selectedItems,
      onSelect,
      onDeselect,
      mode,
    } = this.props;
    const filteredOptions = options.filter((o) => !selectedItems.includes(o));
    return (
      <Select
        mode={mode || "multiple"}
        placeholder={placeholder}
        value={selectedItems}
        onChange={handleChange}
        onSelect={onSelect}
        onDeselect={onDeselect}
        style={{
          width: "100%",
        }}
        optionLabelProp="label"
        {...input}
        data-testid={input.name}
      >
        {filteredOptions.map((item) => (
          <Option key={item} label={item} value={item}>
            {item}
          </Option>
        ))}
      </Select>
    );
  }
}
