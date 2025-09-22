import { useEffect, useRef } from "react";
import { useState } from "react";
import { TransferProps } from "antd";

import { TransferMultiSelectProps, TransferOptions } from "./interfaces";

const locale: TransferProps["locale"] = {
  itemUnit: "item",
  itemsUnit: "itens",
  notFoundContent: null,
  searchPlaceholder: "Pesquisar",
  selectAll: "Selecionar todos",
  selectInvert: "Inverter seleção",
};

const listStyle: TransferProps["listStyle"] = {
  width: "100%",
  overflow: "auto",
  minHeight: "300px",
};

interface useTransferMultiSelectParams {
  required?: boolean;
}

export const useTransferMultiSelect = ({
  required = false,
}: useTransferMultiSelectParams) => {
  const [dataSource, setDataSource] = useState<TransferOptions[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  const [status, setStatus] = useState<TransferMultiSelectProps["status"]>("");

  const [touched, setTouched] = useState<boolean>(false);
  const transferContainerRef = useRef<HTMLDivElement>();

  const setInicialSelectedKeys = (initialSelectedKeys: string[]) =>
    setSelectedKeys(initialSelectedKeys);

  const setInitialTagetKeys = (initialTargetKeys: string[]) =>
    setTargetKeys(initialTargetKeys);

  const defaultHandleSelectChange = (
    sourceSelectedKeys: string[],
    targetSelectedKeys: string[]
  ) => setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);

  const defaultHandleChange = (newTargetKeys: string[]) => {
    newTargetKeys.length > targetKeys.length
      ? setTargetKeys([
          ...targetKeys,
          ...newTargetKeys.filter((item) => !targetKeys.includes(item)),
        ])
      : setTargetKeys(newTargetKeys);

    if (!required) {
      setStatus("");
      return;
    }

    newTargetKeys.length ? setStatus("") : setStatus("error");
  };

  const defaultFilterOption = (inputValue: string, item: TransferOptions) =>
    item.title.toLowerCase().indexOf(inputValue?.toLowerCase()) > -1;

  const defaultRender = (item: TransferOptions) => item.title;

  const clearTransfer = () => {
    setSelectedKeys([]);
    setTargetKeys([]);
    setStatus("");
    setTouched(false);
  };

  const setToggleTouchedToTransferContainerClick = () =>
    transferContainerRef.current &&
    (transferContainerRef.current.onclick = toggleTouched);

  const setToggleTouchedToItemsClick = () =>
    transferContainerRef.current &&
    transferContainerRef.current
      .querySelectorAll(".ant-transfer-list-content-item")
      .forEach((item: HTMLLIElement) => (item.onclick = toggleTouched));

  const toggleTouched = () => !touched && setTouched(true);

  const setTransferValidateRequiredToDocument = () =>
    document.addEventListener("click", handleClickOutsideTransfer);

  const removeTransferValidateRequiredToDocument = () =>
    document.removeEventListener("click", handleClickOutsideTransfer);

  const handleClickOutsideTransfer = (event: PointerEvent) =>
    validateRequired(event);

  const validateRequired = (event: PointerEvent) => {
    if (!required || !touched) return;

    if (status === "error" && !targetKeys.length) return;

    !transferContainerRef.current?.contains(event.target as Element) &&
    !targetKeys.length
      ? setStatus("error")
      : setStatus("");
  };

  useEffect(() => {
    setToggleTouchedToTransferContainerClick();
    setToggleTouchedToItemsClick();
    setTransferValidateRequiredToDocument();

    return () => removeTransferValidateRequiredToDocument();
  }, [transferContainerRef, dataSource, touched, status, targetKeys]);

  return {
    dataSource,
    setDataSource,
    selectedKeys,
    setInicialSelectedKeys,
    targetKeys,
    setInitialTagetKeys,
    status,
    locale,
    listStyle,
    setStatus,
    clearTransfer,
    toggleTouched,
    onSelectChange: defaultHandleSelectChange,
    onChange: defaultHandleChange,
    filterOption: defaultFilterOption,
    render: defaultRender,
    transferContainerRef,
  };
};
