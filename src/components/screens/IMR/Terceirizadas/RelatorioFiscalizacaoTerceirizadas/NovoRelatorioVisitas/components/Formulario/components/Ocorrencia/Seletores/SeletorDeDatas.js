import {
  jsx as _jsx,
  Fragment as _Fragment,
  jsxs as _jsxs,
} from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Field } from "react-final-form";
import { InputComData } from "src/components/Shareable/DatePicker";
import { InputText } from "src/components/Shareable/Input/InputText";
import { required } from "src/helpers/fieldValidators";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
  BUTTON_ICON,
} from "src/components/Shareable/Botao/constants";
export const SeletorDeDatas = ({ ...props }) => {
  const { titulo, name, name_grupos, form, ehDataOcorrencia, somenteLeitura } =
    props;
  const [dates, setDates] = useState([""]);
  const setInitialDates = () => {
    const fieldState = form.getFieldState(name);
    if (fieldState && fieldState.value && fieldState.value.length) {
      setDates(fieldState.value);
      fieldState.value.forEach((_value, _dateinputIndex) => {
        form.change(`${name}_${_dateinputIndex}_${titulo}`, _value);
      });
    }
  };
  useEffect(() => {
    setInitialDates();
  }, [form]);
  const handleDateChange = (index, value) => {
    const newDates = [...dates];
    newDates[index] = value;
    setDates(newDates);
    form.change(name, newDates);
  };
  const onClickTrash = (index, form) => {
    if (ehDataOcorrencia) {
      for (let i = index; i < dates.length - 1; i += 1) {
        form.change(
          `${name}_${i}_${titulo}`,
          form.getState().values[`${name}_${i + 1}_${titulo}`]
        );
      }
      form.change(`${name}_${dates.length - 1}_${titulo}`, undefined);
    } else {
      const key_name_grupos = name_grupos.split("[")[0];
      const index_name_grupos = name_grupos.split("[")[1][0];
      const key_data = name.split(".")[1];
      for (let i = index; i < dates.length; i += 1) {
        form.change(
          `${key_name_grupos}[${index_name_grupos}].${key_data}_${i}_${titulo}`,
          form.getState().values[key_name_grupos][index_name_grupos][
            `${key_data}_${i + 1}_${titulo}`
          ]
        );
      }
      form.change(
        `${key_name_grupos}[${index_name_grupos}].${key_data}_${
          dates.length - 1
        }_${titulo}`,
        undefined
      );
    }
    let newDates = [...dates];
    newDates.splice(index, 1);
    setDates(newDates);
    form.change(name, newDates);
  };
  const adicionarData = () => {
    const newDates = [...dates];
    newDates.push("");
    setDates(newDates);
    form.change(name, newDates);
  };
  return _jsxs(_Fragment, {
    children: [
      Array.from({ length: dates.length }, (_, index) => index).map(
        (_dateinput, _dateinputIndex) => {
          return _jsx(
            "div",
            {
              className: "col-3",
              children: _jsx(Field, {
                component: InputComData,
                label: titulo,
                name: `${name}_${_dateinputIndex}_${titulo}`,
                showMonthDropdown: true,
                showYearDropdown: true,
                tabindex: "-1",
                minDate: null,
                required: true,
                disabled: somenteLeitura,
                validate: required,
                onClickTrash: onClickTrash,
                indexTrash: _dateinputIndex,
                form: form,
                labelClassName: !_dateinputIndex ? "pb-3" : "",
                inputOnChange: (value) => {
                  handleDateChange(_dateinputIndex, value);
                },
              }),
            },
            _dateinputIndex
          );
        }
      ),
      !somenteLeitura &&
        _jsx("div", {
          className: "col-2 my-auto",
          children: _jsx(Botao, {
            className: "mt-4",
            icon: BUTTON_ICON.PLUS,
            style: BUTTON_STYLE.GREEN_OUTLINE,
            type: BUTTON_TYPE.BUTTON,
            onClick: () => adicionarData(),
          }),
        }),
      _jsx(Field, { className: "d-none", component: InputText, name: name }),
    ],
  });
};
