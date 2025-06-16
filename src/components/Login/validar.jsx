import { validarCPF } from "../../helpers/utilities";
import { TABS } from "./constans";

export const validarForm = (values, state) => {
  let erro = false;
  /*if (values.email.includes("@")) {
    erro = "Campo e-mail não deve conter @";
  } else*/
  if (values.registro_funcional && values.registro_funcional.length !== 7)
    erro = "Campo registro funcional deve conter 7 números";
  else if (state.tab === TABS.TERCEIRIZADAS) {
    delete values.registro_funcional;
  } else if (!validarCPF(values.cpf)) {
    erro = "CPF inválido";
  } else if (values.password !== values.confirmar_password) {
    erro = "Campos senha e confirmar senha divergem";
  }
  return erro;
};
