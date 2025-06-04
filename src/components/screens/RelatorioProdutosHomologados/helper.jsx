import { deepCopy } from "src/helpers/utilities";

export const formataParams = (params) => {
  const filtros__ = deepCopy(params);
  if (filtros__.data_homologacao && filtros__.data_homologacao.includes("Z")) {
    filtros__.data_homologacao = filtros__.data_homologacao
      .split("T")[0]
      .split("-")
      .reverse()
      .join("/");
  }
  return filtros__;
};
