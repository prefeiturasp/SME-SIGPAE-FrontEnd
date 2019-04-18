import PropTypes from "prop-types";
import React, { Component } from "react";
import { Field } from "redux-form";
import { ErrorAlert } from "./Alert";
import { Grid } from "./responsiveBs4";

export class Cards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedList: [],
      unCheckedList: [],
      all: this.props.options.map(({ value }) => {
        return value;
      })
    };
  }

  render() {
    const { input, meta, options, choicesNumberLimit, checkAll } = this.props;
    const { name, onChange, onBlur, onFocus } = input;
    const inputValue = input.value;
    const checkboxes = options.map(({ label, value, foodList }, index) => {
      let borderSucess = "";
      if (checkAll) {
        onBlur(this.state.all);
        onChange(this.state.all);
        borderSucess = " border-success";
      }

      const handleChange = event => {
        const arr = [...inputValue];
        if (event.target.checked) {
          arr.push(value);
        } else {
          arr.splice(arr.indexOf(value), 1);
        }
        this.setState({
          ...this.state,
          checkedList: arr,
          unCheckedList: this.state.all.filter(val => !arr.includes(val))
        });
        onBlur(arr);
        return onChange(arr);
      };
      const checked = inputValue.includes(value);
      const checkStyle = {
        width: "1em",
        height: "1em"
      };
      const headerStyle = {
        fontStyle: "normal",
        fontWeight: "bold",
        fontSize: "18px",
        lineHeight: "normal",
        color: "#035D96"
      };

      if (this.state.checkedList.includes(value)) {
        borderSucess = " border-success";
      }

      let disabled = false;
      let opacity = 1;
      if (this.state.checkedList.length >= choicesNumberLimit) {
        if (this.state.unCheckedList.includes(value)) {
          disabled = true;
          opacity = 0.3;
        }
      }

      return (
        <Grid cols="4 4 4 4">
          <div
            className={`card ${borderSucess}`}
            style={{
              width: "22rem",
              height: "16rem",
              border: "solid",
              opacity: opacity
            }}
          >
            <div class="card-header" style={headerStyle}>
              {label}
              <div className="form-check float-right">
                <input
                  className="compare_items form-check-input"
                  type="checkbox"
                  value={value}
                  style={checkStyle}
                  name={`${name}[${index}]`}
                  id={`checkbox-${index}`}
                  index={index}
                  disabled={disabled}
                  checked={checked}
                  onChange={handleChange}
                  onFocus={onFocus}
                />
              </div>
            </div>
            <ul class="list-group list-group-flush">
              {foodList.map((e, key) => {
                return <li className="list-group-item">{e}</li>;
              })}
            </ul>
          </div>
        </Grid>
      );
    });

    return (
      <div>
        <div className="form-group row">{checkboxes}</div>
        <ErrorAlert meta={meta} />
      </div>
    );
  }
}

//Thanks community: https://github.com/erikras/redux-form/issues/1037
export default class CheckboxWithCards extends Component {
  static propTypes = {
    options: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        foodList: PropTypes.array.isRequired
      })
    ).isRequired
  };

  render() {
    return <Field {...this.props} component={Cards} />;
  }
}
