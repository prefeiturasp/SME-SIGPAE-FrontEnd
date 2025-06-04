export const existeLogDeQuestionamentoDaCODAE = (logs) => {
  let existeLog = false;
  logs.forEach((log) => {
    if (log.status_evento_explicacao === "Questionamento pela CODAE") {
      existeLog = true;
    }
  });
  return existeLog;
};
