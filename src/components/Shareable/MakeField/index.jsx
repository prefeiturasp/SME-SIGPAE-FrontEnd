import React, { useState } from "react";
import {
  Form,
  Select,
  AutoComplete,
  TimePicker,
  DatePicker,
  Input,
  InputNumber,
} from "antd";

import "./styles.scss";

const FormItem = Form.Item;

const MyPicker = (props) => {
  const [val, setVal] = useState(undefined);
  const { form, name, value } = props;
  const onBlur = () => {
    props.onChange(val);
    form.change(name, value);
  };
  return (
    <TimePicker
      showSecond={false}
      {...props}
      format="HH:mm"
      onPanelChange={setVal}
      onBlur={onBlur}
    />
  );
};

export const makeField =
  (Component) =>
  ({ input, meta, children, hasFeedback, label, dataTestId, ...rest }) => {
    const hasError = meta.touched && meta.invalid;
    return (
      <FormItem
        label={label}
        data-testid={dataTestId}
        validateStatus={hasError ? "error" : "success"}
        hasFeedback={hasFeedback && hasError}
        help={hasError && meta.error}
        rules={[
          {
            required: true,
            message: "Please select your favourite colors!",
            type: "array",
          },
        ]}
      >
        <Component
          className="input-make-field"
          {...input}
          {...rest}
          children={children}
        />
      </FormItem>
    );
  };

export const ASelect = makeField(Select);
export const AAutoComplete = makeField(AutoComplete);
export const AInput = makeField(Input);
export const AInputNumber = makeField(InputNumber);
export const ATimePicker = makeField(MyPicker);
export const ADatePicker = makeField(DatePicker);
