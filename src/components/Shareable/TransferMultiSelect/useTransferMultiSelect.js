import { useEffect, useRef } from "react";
import { useState } from "react";
const locale = {
  itemUnit: "item",
  itemsUnit: "itens",
  notFoundContent: null,
  searchPlaceholder: "Pesquisar",
  selectAll: "Selecionar todos",
  selectInvert: "Inverter seleção",
};
const listStyle = {
  width: "100%",
  overflow: "auto",
  minHeight: "300px",
};
export const useTransferMultiSelect = ({ required = false }) => {
  const [dataSource, setDataSource] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [targetKeys, setTargetKeys] = useState([]);
  const [status, setStatus] = useState("");
  const [touched, setTouched] = useState(false);
  const transferContainerRef = useRef();
  const setInicialSelectedKeys = (initialSelectedKeys) =>
    setSelectedKeys(initialSelectedKeys);
  const setInitialTagetKeys = (initialTargetKeys) =>
    setTargetKeys(initialTargetKeys);
  const defaultHandleSelectChange = (sourceSelectedKeys, targetSelectedKeys) =>
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  const defaultHandleChange = (newTargetKeys) => {
    newTargetKeys.length > targetKeys.length
      ? setTargetKeys([
          ...targetKeys,
          ...newTargetKeys.filter((item) => !targetKeys.includes(item)),
        ])
      : setTargetKeys(newTargetKeys);
    newTargetKeys.length ? setStatus("") : setStatus("error");
  };
  const defaultFilterOption = (inputValue, item) =>
    item.title.toLowerCase().indexOf(inputValue?.toLowerCase()) > -1;
  const defaultRender = (item) => item.title;
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
      .forEach((item) => (item.onclick = toggleTouched));
  const toggleTouched = () => !touched && setTouched(true);
  const setTransferValidateRequiredToDocument = () =>
    document.addEventListener("click", handleClickOutsideTransfer);
  const removeTransferValidateRequiredToDocument = () =>
    document.removeEventListener("click", handleClickOutsideTransfer);
  const handleClickOutsideTransfer = (event) => validateRequired(event);
  const validateRequired = (event) => {
    if (!required || !touched) return;
    if (status === "error" && !targetKeys.length) return;
    !transferContainerRef.current?.contains(event.target) && !targetKeys.length
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
