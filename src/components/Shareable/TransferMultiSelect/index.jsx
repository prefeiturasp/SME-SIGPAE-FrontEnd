import React, { useEffect, useState } from "react";
import { Transfer } from "antd";

import Label from "components/Shareable/Label";
import TooltipIcone from "components/Shareable/TooltipIcone";

export default ({
  dataSource,
  showSearch,
  filterOption,
  selectedKeys,
  targetKeys,
  onSelectChange,
  onChange,
  onSearch,
  render,
  locale,
  listStyle,
  showSelectAll,
  label,
  name,
  input,
  required,
  tooltipText,
  ...props
}) => {
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    required && touched && !targetKeys?.length
      ? setStatus("error")
      : setStatus("");
  }, [touched, targetKeys]);

  return (
    <div
      className="input transfer-multi-select"
      onBlur={() => {
        !touched && setTouched(true);
      }}
    >
      <Label content={label} required={required} htmlFor={name} />

      {tooltipText && <TooltipIcone tooltipText={tooltipText} />}

      <Transfer
        {...props}
        {...input}
        dataSource={dataSource}
        showSearch={showSearch}
        filterOption={filterOption}
        selectedKeys={selectedKeys}
        targetKeys={targetKeys}
        onSelectChange={onSelectChange}
        onChange={onChange}
        onSearch={onSearch}
        render={render}
        locale={locale}
        listStyle={{ width: "100%", minHeight: "300px", ...listStyle }}
        showSelectAll={showSelectAll || false}
        status={status}
        // oneWay
      />

      {status === "error" && (
        <div className="error-or-warning-message">
          <div className="error-message">Campo obrigatório</div>
        </div>
      )}
    </div>
  );
};
