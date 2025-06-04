import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import rootReducer from "../reducers";

const createTestStore = (initialState = {}) => {
  return createStore(rootReducer, initialState, applyMiddleware(thunk));
};

// Função para renderizar componentes com o Provider do Redux
export const renderWithProvider = (children, initialState = {}) => {
  const store = createTestStore(initialState);

  return {
    ...render(<Provider store={store}>{children}</Provider>),
    store,
  };
};
