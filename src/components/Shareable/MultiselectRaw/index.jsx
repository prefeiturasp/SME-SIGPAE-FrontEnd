import { useEffect, useMemo, useRef, useState } from "react";
import ReactSelect from "react-select";
import TooltipIcone from "src/components/Shareable/TooltipIcone";
import { HelpText } from "../HelpText";
import InputErroMensagem from "../Input/InputErroMensagem";
import { CustomValueContainer } from "./components/CustomValueContainer";
import { Option } from "./components/Option";

export const MultiselectRaw = (props) => {
  const {
    allowSelectAll = true,
    closeMenuOnSelect = false,
    disabled,
    helpText,
    hideSelectedOptions = false,
    input,
    isMulti = true,
    label,
    labelClassName,
    meta,
    onSelectedChanged,
    options,
    placeholder = "Selecione",
    required,
    selected,
    tooltipText,
    usarDirty,
    dataTestId,
    labelAllOption = "Todos",
    naoExibirValidacao,
  } = props;
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const selectRef = useRef(null);
  const optionsComTodos = useMemo(
    () => [{ label: labelAllOption, value: "*" }, ...options],
    [options],
  );

  const [opcoesSelecionadas, setOpcoesSelecionadas] = useState(
    optionsComTodos.filter((option) => selected.includes(option.value)),
  );

  useEffect(() => {
    setOpcoesSelecionadas(
      optionsComTodos.filter((option) => selected.includes(option.value)),
    );
  }, [selected]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setMenuIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="select" data-testid={dataTestId} ref={selectRef}>
      {label && [
        required && !disabled && (
          <span key={0} className="required-asterisk">
            *
          </span>
        ),
        <label
          key={1}
          htmlFor={input?.name}
          className={`${labelClassName || "col-form-label"}`}
        >
          {label}
        </label>,
        tooltipText && <TooltipIcone key={2} tooltipText={tooltipText} />,
      ]}
      <ReactSelect
        {...input}
        menuIsOpen={menuIsOpen}
        onMenuOpen={() => setMenuIsOpen(true)}
        onMenuClose={() => setMenuIsOpen(false)}
        classNamePrefix={dataTestId}
        options={optionsComTodos}
        isDisabled={disabled}
        isMulti={isMulti}
        closeMenuOnSelect={closeMenuOnSelect}
        hideSelectedOptions={hideSelectedOptions}
        components={{
          Option,
          ValueContainer: CustomValueContainer,
        }}
        onChange={(values) => {
          if (!Array.isArray(values)) return;

          const isSelectAllSelected = values.some((v) => v.value === "*");
          const allValues = options.map((o) => o.value);
          const selectedValues = values.map((v) => v.value);
          const isAllSelected = allValues.every((val) =>
            selectedValues.includes(val),
          );

          if (isSelectAllSelected && isAllSelected) {
            onSelectedChanged([]);
            setMenuIsOpen(false);
            return;
          }

          if (isSelectAllSelected) {
            const todasOpcoes = [...optionsComTodos];
            setOpcoesSelecionadas(todasOpcoes);
            onSelectedChanged(todasOpcoes.filter((v) => v.value !== "*"));
            setMenuIsOpen(false);
            return;
          }
          const semSelectAll = values.filter((v) => v.value !== "*");
          const isNowAllSelected = allValues.every((val) =>
            semSelectAll.some((v) => v.value === val),
          );

          const novaSelecao = isNowAllSelected
            ? [...semSelectAll, { label: labelAllOption, value: "*" }]
            : semSelectAll;

          setOpcoesSelecionadas(novaSelecao);
          onSelectedChanged(novaSelecao.filter((v) => v.value !== "*"));
        }}
        allowSelectAll={allowSelectAll}
        value={opcoesSelecionadas}
        required={required}
        placeholder={placeholder}
      />
      <HelpText helpText={helpText} />
      {!naoExibirValidacao && (
        <InputErroMensagem meta={meta} dirtyValidation={usarDirty} />
      )}
    </div>
  );
};
