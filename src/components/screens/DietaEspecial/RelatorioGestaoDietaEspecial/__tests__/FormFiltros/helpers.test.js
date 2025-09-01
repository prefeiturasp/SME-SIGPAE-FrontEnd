import { getStatus } from "../../components/FormFiltros/helpers";

describe("Função helpers.jsx", () => {
  test("getStatus retorna as situações de dieta", () => {
    const situacoes = getStatus();
    expect(situacoes).toEqual([
      { label: "Autorizada", value: "CODAE_AUTORIZADO" },
      { label: "Negada", value: "CODAE_NEGOU_PEDIDO" },
      { label: "Pendente", value: "CODAE_A_AUTORIZAR" },
      { label: "Cancelada", value: "ESCOLA_CANCELOU" },
    ]);
  });
});
