/*
  Wrapper para o componente Transfer da biblioteca Ant Design.

  Documentação: https://ant.design/components/transfer
  Versão base: 5.15.x
*/

import React from "react";
import { Transfer } from "antd";

import Label from "src/components/Shareable/Label";
import TooltipIcone from "src/components/Shareable/TooltipIcone";

import { TransferMultiSelectProps } from "./interfaces";

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
  status,
  oneWay,
  labels,
  required,
  tooltipTexts,
  transferContainerRef,
}: TransferMultiSelectProps) => {
  return (
    <>
      {labels?.length > 0 && (
        <div className="row">
          <div className="col ps-0">
            <Label content={labels[0]} required={required} />
            {tooltipTexts && <TooltipIcone tooltipText={tooltipTexts[0]} />}
          </div>
          <div className="col ps-5">
            <Label content={labels[1]} required={required} />
            {tooltipTexts && <TooltipIcone tooltipText={tooltipTexts[1]} />}
          </div>
        </div>
      )}

      <div
        ref={transferContainerRef}
        className="transfer-multiselect-container"
      >
        <Transfer
          dataSource={dataSource}
          showSearch={showSearch || true}
          filterOption={filterOption}
          selectedKeys={selectedKeys}
          targetKeys={targetKeys}
          onSelectChange={onSelectChange}
          onChange={onChange}
          onSearch={onSearch}
          render={render}
          locale={locale}
          listStyle={listStyle}
          showSelectAll={showSelectAll || true}
          status={status}
          oneWay={oneWay}
        />

        {status === "error" && (
          <div className="error-or-warning-message">
            <div className="error-message">Campo obrigatório</div>
          </div>
        )}
      </div>
    </>
  );
};
