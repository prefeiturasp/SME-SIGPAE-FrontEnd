export const formataNome = (nome, maxWidth = 200) => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context.font = "14px Arial";

  const textWidth = context.measureText(nome).width;
  if (textWidth <= maxWidth) {
    return nome;
  }

  let truncated = nome;
  while (
    context.measureText(truncated + "...").width > maxWidth &&
    truncated.length > 0
  ) {
    truncated = truncated.slice(0, -1);
  }

  return truncated + "...";
};
