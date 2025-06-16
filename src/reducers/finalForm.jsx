// https://codesandbox.io/s/4xq2qpzw79

// Actions
const UPDATE_FORM_STATE = "SME-SIGPAE-Frontend/finalForm/UPDATE_FORM_STATE";

// Reducer
export default function reducer(state = {}, action = {}) {
  switch (action.type) {
    case UPDATE_FORM_STATE:
      return {
        ...state,
        [action.form]: action.payload,
      };
    default:
      return state;
  }
}

// Action Creators
export const updateFormState = (form, state) => ({
  type: UPDATE_FORM_STATE,
  form,
  payload: state,
});

// Selectors
export const getFormState = (state, form) =>
  (state && state.finalForm && state.finalForm[form]) || {};
