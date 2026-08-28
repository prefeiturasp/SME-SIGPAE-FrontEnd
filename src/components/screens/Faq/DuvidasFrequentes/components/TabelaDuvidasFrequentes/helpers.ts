import { DuvidaFrequenteApi, LinhaDuvidaFrequente } from "./interfaces";

const obterCategoria = (duvida: DuvidaFrequenteApi) =>
  typeof duvida.categoria === "string"
    ? duvida.categoria
    : duvida.categoria?.nome || "--";

const obterPerfis = (duvida: DuvidaFrequenteApi) => {
  if (duvida.todos_os_perfis) return "TODOS";

  return (
    duvida.perfis
      ?.map((perfil) => (typeof perfil === "string" ? perfil : perfil.nome))
      .filter(Boolean)
      .join("; ") || "--"
  );
};

export const formatarDuvidasParaTabela = (
  duvidas: DuvidaFrequenteApi[],
): LinhaDuvidaFrequente[] =>
  duvidas.map((duvida) => ({
    categoria: obterCategoria(duvida),
    perfis: obterPerfis(duvida),
    titulo: duvida.pergunta,
    uuid: duvida.uuid,
  }));
