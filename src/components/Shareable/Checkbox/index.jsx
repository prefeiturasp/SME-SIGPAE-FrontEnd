import React from "react";
import { Field } from "redux-form";
import "./style.scss";

export const Checkbox = (props) => {
  const { className, classNameTexto, input, onClick, texto } = props;
  return (
    <div className="checkbox-component">
      <label htmlFor="check" className={`checkbox-label ${className}`}>
        <Field
          {...input}
          component={"input"}
          type="checkbox"
          name={input.name}
          data-cy={input.name}
        />
        <span
          onClick={onClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onClick?.(e);
            }
          }}
          role="checkbox"
          tabIndex={0}
          aria-checked={Boolean(input?.checked)}
          className={`checkbox-custom ${className}`}
          data-testid="checkbox-custom"
        />{" "}
        {texto ? (
          <span className={classNameTexto}>{texto}</span>
        ) : (
          props.children
        )}
      </label>
    </div>
  );
};
