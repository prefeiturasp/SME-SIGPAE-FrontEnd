export const MOTIVOS_SUSPENSAO = [
  "Parada Pedagógica",
  "Unidade sem atendimento",
  "Outro",
];

export const formatarDiasMotivosSuspensao = (inclusoes) => {
  let diasMotivosFormatado = {
    "Parada Pedagógica": [],
    "Unidade sem atendimento": [],
    Outro: [],
  };
  inclusoes.forEach((inclusao) => {
    diasMotivosFormatado[inclusao.motivo.nome].push(inclusao.data);
  });
  return diasMotivosFormatado;
};
