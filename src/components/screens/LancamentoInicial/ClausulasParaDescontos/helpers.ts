export const formataValor = (value: number) => {
  return (
    `${value}`
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")
      .replace(/\.(?=\d{0,2}$)/g, ",")
      .replace(/,00/, "") + "%"
  );
};
