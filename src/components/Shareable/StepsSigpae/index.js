import { jsx as _jsx } from "react/jsx-runtime";
import { Steps } from "antd";
import "./styles.scss";
const StepsSigpae = ({ items, current }) => {
  return _jsx("div", {
    className: "steps",
    children: _jsx(Steps, { size: "small", current: current, items: items }),
  });
};
export default StepsSigpae;
