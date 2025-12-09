import {
  CardItem,
  FichaTecnicaDashboard,
  VerMaisItem,
} from "src/interfaces/pre_recebimento.interface";
import {
  ANALISAR_FICHA_TECNICA,
  PRE_RECEBIMENTO,
  DETALHAR_FICHA_TECNICA,
} from "src/configs/constants";
import {
  ordenarPorLogMaisRecente,
  truncarString,
  usuarioEhDilogAbastecimento,
  usuarioEhCronograma,
} from "src/helpers/utilities";

export const formatarCards = (items: FichaTecnicaDashboard[]): CardItem[] => {
  return items.sort(ordenarPorLogMaisRecente).map((item) => ({
    text: gerarTextoTruncado(item, 20),
    date: item.log_mais_recente.slice(0, 10),
    link: `${gerarLinkItemFichaTecnica(item)}?uuid=${item.uuid}`,
    status: item.status,
    fullText: gerarTextoCompleto(item),
    programa_leve_leite: item.programa_leve_leite,
  }));
};

export const gerarLinkItemFichaTecnica = (
  item: FichaTecnicaDashboard,
): string => {
  const urlDetalhar = `/${PRE_RECEBIMENTO}/${DETALHAR_FICHA_TECNICA}`;
  const urlAnalisar = `/${PRE_RECEBIMENTO}/${ANALISAR_FICHA_TECNICA}`;

  if (usuarioEhDilogAbastecimento() || usuarioEhCronograma()) {
    return urlDetalhar;
  }

  switch (item.status) {
    case "Aprovada":
    case "Enviada para Correção":
      return urlDetalhar;
    case "Enviada para Análise":
    default:
      return urlAnalisar;
  }
};

export const formataItensVerMais = (
  itens: FichaTecnicaDashboard[],
  urlBaseItem: string,
): VerMaisItem[] => {
  return itens.sort(ordenarPorLogMaisRecente).map((item) => ({
    texto: gerarTextoTruncado(item, 50),
    textoCompleto: gerarTextoCompleto(item),
    data: item.log_mais_recente.slice(0, 10),
    link: `${urlBaseItem}?uuid=${item.uuid}`,
    programa_leve_leite: item.programa_leve_leite,
  }));
};

export const gerarTextoTruncado = (
  item: FichaTecnicaDashboard,
  tamanhoMaximo: number,
) => {
  return `${item.numero_ficha} - ${truncarString(
    item.nome_produto,
    tamanhoMaximo,
  )} - ${truncarString(item.nome_empresa, tamanhoMaximo)}`;
};

export const gerarTextoCompleto = (item: FichaTecnicaDashboard) => {
  return `${item.numero_ficha} - ${item.nome_produto} - ${item.nome_empresa}`;
};
