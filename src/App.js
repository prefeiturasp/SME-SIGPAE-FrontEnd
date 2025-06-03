import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { GlobalContext } from "src/context";
import { ToastContainer } from "react-toastify";
import "./App.css";
import Routes from "./routes.jsx";
import { cesInterceptFetch } from "./services/ces.service";
cesInterceptFetch();
export const App = () => {
  return _jsxs(GlobalContext, {
    children: [_jsx(ToastContainer, {}), _jsx(Routes, {})],
  });
};
