import React from "react";
import { render } from "@testing-library/react";
import { InputComData } from ".";

const mockDatePicker = jest.fn(() => <div data-testid="datepicker-mock" />);

jest.mock("react-datepicker", () => {
  const React = require("react");

  return {
    __esModule: true,
    default: React.forwardRef((props, ref) => {
      mockDatePicker(props);
      return <div ref={ref} data-testid="datepicker-mock" />;
    }),
    registerLocale: jest.fn(),
  };
});

describe("InputComData", () => {
  beforeEach(() => {
    mockDatePicker.mockClear();
  });

  it("abre no openToDate informado quando nao ha data selecionada", () => {
    const openToDate = new Date(2026, 2, 1);

    render(
      <InputComData
        input={{ name: "data", onChange: jest.fn(), value: "" }}
        openToDate={openToDate}
      />,
    );

    expect(mockDatePicker).toHaveBeenCalled();
    const props = mockDatePicker.mock.calls.at(-1)[0];

    expect(props.selected).toBeNull();
    expect(props.openToDate).toEqual(openToDate);
  });
});
