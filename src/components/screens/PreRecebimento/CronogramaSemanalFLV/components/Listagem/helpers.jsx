export const formataNome = (nome) => {
  return nome?.slice(0, 30) + (nome?.length > 30 ? "..." : "");
};
