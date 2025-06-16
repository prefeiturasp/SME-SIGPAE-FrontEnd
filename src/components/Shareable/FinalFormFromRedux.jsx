// https://codesandbox.io/s/4xq2qpzw79

import React from "react";
import { connect } from "react-redux";
import { getFormState } from "src/reducers/finalForm";

const FormStateFromRedux = ({ state }) => (
  <pre>{JSON.stringify(state, 0, 2)}</pre>
);

export default connect((state, ownProps) => ({
  state: getFormState(state, ownProps.form),
}))(FormStateFromRedux);
