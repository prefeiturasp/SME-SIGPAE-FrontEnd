import axios from "../../../../services/_base";
import { ENVIRONMENT } from "src/constants/config";

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
