import axios from "axios";

export const httpTohttps = (url) => {
  if (url.startsWith("http://")) {
    return url.replace(/^http:\/\//, "https://");
  }
  return url;
};

export const obtemBase64DaUrl = async (url) => {
  // ATENÇÃO! Ao rodar localmente, não transforme http em https!
  const resposta = await axios.get(httpTohttps(url), {
    responseType: "arraybuffer",
  });
  // eslint-disable-next-line no-undef
  const base64 = Buffer.from(resposta.data, "binary").toString("base64");
  return `data:${resposta.headers["content-type"]};base64,${base64}`;
};
