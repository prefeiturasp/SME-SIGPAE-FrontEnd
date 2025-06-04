import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
// Redux
import { applyMiddleware, createStore } from "redux";
import multi from "redux-multi";
// Middleware
import promise from "redux-promise";
import thunk from "redux-thunk";
import { App } from "./App";
import { ENVIRONMENT } from "src/constants/config";
import reducers from "./reducers";
import * as serviceWorker from "./serviceWorker";
import "./styles/custom.css";
import "./styles/sb-admin-2.css";
import "./styles/_overrides.scss";
import * as Sentry from "@sentry/browser";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

//eslint-disable-next-line
if (["development", "homolog", "treinamento"].includes(ENVIRONMENT)) {
  document.addEventListener("keydown", async function (event) {
    if (event.key === "PrintScreen") {
      document.body.style.display = "none";
      await sleep(3000);
      document.body.style.display = "block";
      alert("Não é permitido capturar tela neste ambiente");
    }
  });
}

/* eslint-disable-next-line */
if (process.env.IS_DOCKER_ENVIRONMENT === true) {
  // This way we can pass params to static files. see Dockerfile.
  // when build default env is production
  const SENTRY_URL = "SENTRY_URL_REPLACE_ME";
  Sentry.init({ dsn: SENTRY_URL });
}

// see https://github.com/zalmoxisus/redux-devtools-extension
let devTools = undefined;
//eslint-disable-next-line
if (process.env.NODE_ENV === "development") {
  devTools =
    window.__REDUX_DEVTOOLS_EXTENSION__ &&
    window.__REDUX_DEVTOOLS_EXTENSION__();
}

// foram aplicados 3 middlewares no createstore.
// thunk: para que os actionCreators poderem chamar metodos (ideal para usar promises)
// multi: para retornar uma lista de ações em vez de 1
// promise: para poder usar o UNSAFE_componentWillMount no componente

const store = applyMiddleware(thunk, multi, promise)(createStore)(
  reducers,
  devTools
);

// store é o carinha que recebe todos os estados
ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
