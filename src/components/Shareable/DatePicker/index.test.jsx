import { render, fireEvent } from "@testing-library/react";
import { InputComData } from ".";

const mockDatePicker = jest.fn();
const mockSetOpen = jest.fn();
const mockSetFocus = jest.fn();

jest.mock("react-datepicker", () => {
  const React = require("react");

  return {
    __esModule: true,
    default: React.forwardRef((props, ref) => {
      mockDatePicker(props);

      React.useImperativeHandle(ref, () => ({
        setOpen: mockSetOpen,
        setFocus: mockSetFocus,
      }));

      return <div data-testid="datepicker-mock" />;
    }),
    registerLocale: jest.fn(),
  };
});

jest.mock("src/components/Shareable/Botao", () => {
  return {
    __esModule: true,
    default: ({ onClick }) => (
      <button data-testid="trash-button" type="button" onClick={onClick}>
        Remover
      </button>
    ),
  };
});

describe("InputComData", () => {
  beforeEach(() => {
    mockDatePicker.mockClear();
    mockSetOpen.mockClear();
    mockSetFocus.mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
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

  it("abre no mes atual quando nao ha data selecionada e maxDate esta no futuro", () => {
    const today = new Date(2026, 2, 31);
    jest.useFakeTimers().setSystemTime(today);

    render(
      <InputComData
        input={{ name: "data", onChange: jest.fn(), value: "" }}
        minDate={null}
        maxDate={new Date(2027, 2, 26)}
      />,
    );

    const props = mockDatePicker.mock.calls.at(-1)[0];

    expect(props.selected).toBeNull();
    expect(props.openToDate).toEqual(today);
  });

  it("repassa os dropdowns de mes e ano para o DatePicker", () => {
    render(
      <InputComData
        input={{ name: "data", onChange: jest.fn(), value: "" }}
        showMonthDropdown={true}
        showYearDropdown={true}
      />,
    );

    const props = mockDatePicker.mock.calls.at(-1)[0];

    expect(props.showMonthDropdown).toBe(true);
    expect(props.showYearDropdown).toBe(true);
  });

  it("chama onChange e inputOnChange com data formatada quando writable for false", () => {
    const onChange = jest.fn();
    const inputOnChange = jest.fn();

    render(
      <InputComData
        input={{ name: "data", onChange, value: "" }}
        inputOnChange={inputOnChange}
      />,
    );

    const props = mockDatePicker.mock.calls.at(-1)[0];

    props.onChange(new Date(2026, 2, 15));

    expect(onChange).toHaveBeenCalledWith("15/03/2026");
    expect(inputOnChange).toHaveBeenCalledWith("15/03/2026");
  });

  it("usa a propria data selecionada quando input.value for uma Date valida", () => {
    const selectedDate = new Date(2026, 2, 15);

    render(
      <InputComData
        input={{ name: "data", onChange: jest.fn(), value: selectedDate }}
        minDate={null}
        maxDate={null}
      />,
    );

    const props = mockDatePicker.mock.calls.at(-1)[0];

    expect(props.selected).toBe(selectedDate);
    expect(props.openToDate).toBe(selectedDate);
  });

  it("converte string de data valida para Date", () => {
    render(
      <InputComData
        input={{ name: "data", onChange: jest.fn(), value: "15/03/2026" }}
      />,
    );

    const props = mockDatePicker.mock.calls.at(-1)[0];

    expect(props.selected).toEqual(new Date(2026, 2, 15));
  });

  it("retorna null quando a string de data for invalida", () => {
    render(
      <InputComData
        input={{ name: "data", onChange: jest.fn(), value: "data invalida" }}
      />,
    );

    const props = mockDatePicker.mock.calls.at(-1)[0];

    expect(props.selected).toBeNull();
  });

  it("abre no minDate quando hoje for menor que a data minima", () => {
    const today = new Date(2026, 2, 31);
    const minDate = new Date(2026, 3, 10);

    jest.useFakeTimers().setSystemTime(today);

    render(
      <InputComData
        input={{ name: "data", onChange: jest.fn(), value: "" }}
        minDate={minDate}
        maxDate={null}
      />,
    );

    const props = mockDatePicker.mock.calls.at(-1)[0];

    expect(props.openToDate).toEqual(minDate);
  });

  it("abre no maxDate quando hoje for maior que a data maxima", () => {
    const today = new Date(2026, 2, 31);
    const maxDate = new Date(2026, 2, 10);

    jest.useFakeTimers().setSystemTime(today);

    render(
      <InputComData
        input={{ name: "data", onChange: jest.fn(), value: "" }}
        minDate={null}
        maxDate={maxDate}
      />,
    );

    const props = mockDatePicker.mock.calls.at(-1)[0];

    expect(props.openToDate).toEqual(maxDate);
  });

  it("abre o calendario ao clicar no icone", () => {
    const { container } = render(
      <InputComData input={{ name: "data", onChange: jest.fn(), value: "" }} />,
    );

    const calendarIcon = container.querySelector(".fa-calendar-alt");

    expect(calendarIcon).toBeTruthy();

    fireEvent.click(calendarIcon);

    expect(mockSetOpen).toHaveBeenCalledWith(true);
    expect(mockSetFocus).toHaveBeenCalled();
  });

  it("chama onClickTrash com indexTrash e form ao clicar no botao de lixeira", () => {
    const onClickTrash = jest.fn();
    const form = { name: "formulario" };

    const { getByTestId } = render(
      <InputComData
        input={{ name: "data", onChange: jest.fn(), value: "" }}
        onClickTrash={onClickTrash}
        indexTrash={1}
        form={form}
      />,
    );

    fireEvent.click(getByTestId("trash-button"));

    expect(onClickTrash).toHaveBeenCalledWith(1, form);
  });
});
