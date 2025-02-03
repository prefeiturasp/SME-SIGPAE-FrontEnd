import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

const mockStore = configureStore([]);

export const renderWithProvider = (children, initialState = {}) => {
  const store = mockStore(initialState);

  return {
    ...render(<Provider store={store}>{children}</Provider>),
    store,
  };
};
