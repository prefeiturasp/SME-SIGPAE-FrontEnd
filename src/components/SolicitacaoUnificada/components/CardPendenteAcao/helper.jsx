export const calcularNumeroDeDREsUnicas = (pedidos) => {
  let DREsDiferentes = [];
  pedidos.forEach((pedido) => {
    if (!DREsDiferentes.includes(pedido.diretoria_regional.uuid))
      DREsDiferentes.push(pedido.diretoria_regional.uuid);
  });
  return DREsDiferentes.length;
};
