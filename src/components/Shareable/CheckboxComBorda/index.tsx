import React from "react";

import "./styles.scss";

interface CheckboxComBordaProps {
  input: any;
  meta: any;
  label: string;
  disabled?: boolean;
  dataTestId?: string;
}

const CheckboxComBorda = ({
  label,
  input,
  meta,
  disabled,
  dataTestId,
}: CheckboxComBordaProps) => {
  const estiloDaBorda = input.value ? "marcado" : "desmarcado";

  return (
    <div className={`checkbox-com-borda ${estiloDaBorda}`}>
      <input
        type="checkbox"
        className="checkbox-input"
        {...input}
        {...meta}
        id={input.name}
        checked={input.value}
        disabled={disabled}
        data-testid={dataTestId}
      />
      <label htmlFor={input.name} className="checkbox-label">
        {label}
      </label>
    </div>
  );
};

export default CheckboxComBorda;
