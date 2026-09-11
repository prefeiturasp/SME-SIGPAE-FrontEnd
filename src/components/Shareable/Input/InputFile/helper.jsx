import axios from "../../../../services/_base";
import { ENVIRONMENT } from "src/constants/config";
import { corrigeLinkAnexo } from "src/helpers/utilities";

const isHttpUrl = (value) =>
  typeof value === "string" &&
  (value.startsWith("http://") || value.startsWith("https://"));

const isDataUrl = (value) =>
  typeof value === "string" && value.startsWith("data:");

const dataUrlToBlobUrl = (dataUrl, nome) => {
  const [header, data] = dataUrl.split(",");
  const mimeMatch = header.match(/:(.*?);/);
  let mime = mimeMatch ? mimeMatch[1] : "application/octet-stream";

  if (
    mime === "application/octet-stream" &&
    nome?.toLowerCase().endsWith(".pdf")
  ) {
    mime = "application/pdf";
  }

  const binary = atob(data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return URL.createObjectURL(new Blob([bytes], { type: mime }));
};

export const openFile = (file) => {
  if (!file) return;

  const nome = file.nome || "";
  const dataUrl = [file.base64, file.arquivo].find(isDataUrl);
  const httpUrl = [file.arquivo, file.base64].find(isHttpUrl);

  if (nome.toLowerCase().includes(".doc")) {
    const href = dataUrl || (httpUrl && corrigeLinkAnexo(httpUrl));
    if (!href) return;

    const link = document.createElement("a");
    link.href = href;
    link.download = nome;
    link.click();
    return;
  }

  if (dataUrl) {
    const blobUrl = dataUrlToBlobUrl(dataUrl, nome);
    window.open(blobUrl, "_blank", "noopener,noreferrer");
    setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
    return;
  }

  if (httpUrl) {
    window.open(corrigeLinkAnexo(httpUrl), "_blank", "noopener,noreferrer");
  }
};

export async function readerFile(file) {
  let result_file = await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split("base64,")[1];
      return resolve({
        arquivo: `data:${file.type};base64,${base64}`,
        nome: file.name,
      });
    };
    reader.readAsDataURL(file);
  });
  return result_file;
}

export async function downloadAndConvertToBase64(fileUrl) {
  let finalFileUrl = fileUrl;
  if (["production", "homolog", "treinamento"].includes(ENVIRONMENT))
    finalFileUrl = finalFileUrl.replace("http://", "https://");

  const response = await axios.get(finalFileUrl, {
    responseType: "arraybuffer",
  });

  if (response.status === 200) {
    const contentType = response.headers["content-type"];
    const blob = new Blob([response.data], { type: contentType });

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result;
        resolve(base64Data);
      };
      reader.readAsDataURL(blob);
    });
  } else {
    throw new Error("Falha ao baixar arquivo.");
  }
}
