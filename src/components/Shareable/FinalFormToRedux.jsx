// https://codesandbox.io/s/4xq2qpzw79

import React from "react";
import { connect } from "react-redux";
import { FormSpy } from "react-final-form";
import { updateFormState } from "src/reducers/finalForm";

const FormStateToRedux = ({ form, updateFormState }) => (
  <FormSpy onChange={(state) => updateFormState(form, state.values)} />
);

export default connect(undefined, { updateFormState })(FormStateToRedux);
