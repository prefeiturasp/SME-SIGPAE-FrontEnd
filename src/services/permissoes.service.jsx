import { ErrorHandlerFunction } from "./service-helpers";

import axios from "./_base";

export const getDadosUsuarioEOLCompleto = async (registroFuncional) =>
  axios
    .get(`/dados-usuario-eol-completo/${registroFuncional}/`)
    .catch(ErrorHandlerFunction);
