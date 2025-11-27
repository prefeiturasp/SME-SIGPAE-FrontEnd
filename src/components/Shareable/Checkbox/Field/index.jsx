import React, { Component } from "react";
import "./style.scss";

export default class CheckboxField extends Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }
  onClick() {
    this.props.input.onChange(this.props.input.checked ? "" : true);
  }
  render() {
    const {
      name,
      texto,
      children,
      input: { checked },
      check,
      nomeInput,
      dataTestId,
    } = this.props;
    return (
      <div className="checkbox-field-component">
        <label htmlFor="check" className="checkbox-label">
          <input type="checkbox" name={name} checked={check || checked} />
          <span
            onClick={() => this.onClick()}
            data-testid={dataTestId}
            className="checkbox-field-span"
          />{" "}
          {nomeInput ? <div>{nomeInput}</div> : texto || children}
        </label>
      </div>
    );
  }
}
