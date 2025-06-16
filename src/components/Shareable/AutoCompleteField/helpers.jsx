export const trocaAcentuadasPorSemAcento = (texto) =>
  texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
