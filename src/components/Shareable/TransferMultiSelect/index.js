import {
  jsx as _jsx,
  jsxs as _jsxs,
  Fragment as _Fragment,
} from "react/jsx-runtime";
import { Transfer } from "antd";
import Label from "src/components/Shareable/Label";
import TooltipIcone from "src/components/Shareable/TooltipIcone";
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
}) => {
  return _jsxs(_Fragment, {
    children: [
      labels?.length &&
        _jsxs("div", {
          className: "row",
          children: [
            _jsxs("div", {
              className: "col ps-0",
              children: [
                _jsx(Label, { content: labels[0], required: required }),
                tooltipTexts &&
                  _jsx(TooltipIcone, { tooltipText: tooltipTexts[0] }),
              ],
            }),
            _jsxs("div", {
              className: "col ps-5",
              children: [
                _jsx(Label, { content: labels[1], required: required }),
                tooltipTexts &&
                  _jsx(TooltipIcone, { tooltipText: tooltipTexts[1] }),
              ],
            }),
          ],
        }),
      _jsxs("div", {
        ref: transferContainerRef,
        className: "transfer-multiselect-container",
        children: [
          _jsx(Transfer, {
            dataSource: dataSource,
            showSearch: showSearch || true,
            filterOption: filterOption,
            selectedKeys: selectedKeys,
            targetKeys: targetKeys,
            onSelectChange: onSelectChange,
            onChange: onChange,
            onSearch: onSearch,
            render: render,
            locale: locale,
            listStyle: listStyle,
            showSelectAll: showSelectAll || true,
            status: status,
            oneWay: oneWay,
          }),
          status === "error" &&
            _jsx("div", {
              className: "error-or-warning-message",
              children: _jsx("div", {
                className: "error-message",
                children: "Campo obrigat\u00F3rio",
              }),
            }),
        ],
      }),
    ],
  });
};
