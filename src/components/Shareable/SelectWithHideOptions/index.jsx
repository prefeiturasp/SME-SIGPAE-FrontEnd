import React from "react";

import { Select } from "antd";
import "./styles.css";
const { Option } = Select;

export class SelectWithHideOptions extends React.Component {
  state = {};

  handleChange = (value) => {
    const { input, handleChange } = this.props;
    if (handleChange) handleChange(value);
    input.onChange(value);
  };

  render() {
    const {
      input,
      options,
      placeholder,
      selectedItems,
      onSelect,
      onDeselect,
      mode,
    } = this.props;
    const filteredOptions = options.filter((o) => !selectedItems.includes(o));
    return (
      <Select
        {...input}
        value={selectedItems}
        mode={mode || "multiple"}
        placeholder={placeholder}
        onChange={this.handleChange}
        onSelect={onSelect}
        onDeselect={onDeselect}
        style={{
          width: "100%",
        }}
        optionLabelProp="label"
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
