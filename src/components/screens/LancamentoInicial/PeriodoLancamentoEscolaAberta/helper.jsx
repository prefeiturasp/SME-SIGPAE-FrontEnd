import {
  addDays,
  format,
  getDay,
  getWeeksInMonth,
  getYear,
  isSunday,
  isWithinInterval,
  lastDayOfMonth,
  parse,
  startOfMonth,
  subDays,
} from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";

export const NOME_GRUPO_ESCOLA_ABERTA = "Escola Aberta";

export const MENSAGEM_LANCAMENTO_MAIOR_QUE_PARTICIPANTES =
  "Lançamento maior que o número de participantes no dia.";

export const MENSAGEM_VALOR_INVALIDO =
  "Informe um número inteiro maior ou igual a zero.";

const CAMPOS_COM_LIMITE_DE_PARTICIPANTES = [
  "lanche",
  "lanche_4h",
  "refeicao",
  "sobremesa",
];

const NOMES_DIAS_SEMANA = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

export const formatarMesAno = (mesAno) => {
  const mesString = format(mesAno, "LLLL", { locale: ptBR });
  return `${mesString.charAt(0).toUpperCase()}${mesString.slice(1)} / ${getYear(
    mesAno,
  )}`;
};

export const normalizarNomeCampo = (nome) =>
  nome
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replaceAll(/ /g, "_");

export const montarLinhasTiposAlimentacao = (tiposAlimentacao = []) => {
  const linhas = [];

  tiposAlimentacao.forEach((tipo) => {
    const nomeBase =
      tipo.nome === "Refeição" ? "Refeição 1ª Oferta" : tipo.nome;
    const nomeBaseSobremesa =
      tipo.nome === "Sobremesa" ? "Sobremesa 1º Oferta" : nomeBase;

    linhas.push({
      nome: nomeBaseSobremesa,
      name: normalizarNomeCampo(tipo.nome),
      uuid: tipo.uuid,
    });

    if (tipo.nome === "Refeição") {
      linhas.push({
        nome: "Repetição Refeição",
        name: "repeticao_refeicao",
        uuid: null,
      });
    }

    if (tipo.nome === "Sobremesa") {
      linhas.push({
        nome: "Repetição Sobremesa",
        name: "repeticao_sobremesa",
        uuid: null,
      });
    }
  });

  return linhas;
};

export const montarSemanas = (mesAno) => {
  const totalSemanas = isSunday(lastDayOfMonth(mesAno))
    ? getWeeksInMonth(mesAno) - 1
    : getDay(startOfMonth(mesAno)) === 0
      ? getWeeksInMonth(mesAno) + 1
      : getWeeksInMonth(mesAno);

  return Array.from({ length: totalSemanas }, (_, index) => ({
    key: `${index + 1}`,
    label: `Semana ${index + 1}`,
  }));
};

const montarInfoDia = (data) => ({
  dia: format(data, "dd"),
  mes: format(data, "MM"),
  ano: format(data, "yyyy"),
});

export const montarDiasDaSemana = (mesAno, numeroSemana) => {
  const dataInicioCalendario = startOfMonth(mesAno);
  let diaDaSemanaNumerico = getDay(dataInicioCalendario);
  if (diaDaSemanaNumerico === 0) {
    diaDaSemanaNumerico = 7;
  }

  const diaInicial = addDays(dataInicioCalendario, 7 * (numeroSemana - 1));
  const dias = [montarInfoDia(diaInicial)];

  for (let i = 1; i < diaDaSemanaNumerico; i++) {
    dias.unshift(montarInfoDia(subDays(diaInicial, i)));
  }

  for (let i = diaDaSemanaNumerico; i < 7; i++) {
    dias.push(montarInfoDia(addDays(diaInicial, i + 1 - diaDaSemanaNumerico)));
  }

  return dias;
};

export const obterTextoForaDoMes = (diaInfo, mesAno) => {
  if (
    diaInfo.mes === format(mesAno, "MM") &&
    diaInfo.ano === format(mesAno, "yyyy")
  ) {
    return null;
  }

  const dataDia = new Date(
    Number(diaInfo.ano),
    Number(diaInfo.mes) - 1,
    Number(diaInfo.dia),
  );

  return dataDia < startOfMonth(mesAno) ? "Mês anterior" : "Mês posterior";
};

export const dataNoPeriodo = (diaInfo, mesAno, cadastro) => {
  if (!cadastro) {
    return false;
  }

  if (obterTextoForaDoMes(diaInfo, mesAno)) {
    return false;
  }

  const data = new Date(
    Number(diaInfo.ano),
    Number(diaInfo.mes) - 1,
    Number(diaInfo.dia),
  );
  const dataInicial = parse(cadastro.data_inicial, "dd/MM/yyyy", new Date());
  const dataFinal = parse(cadastro.data_final, "dd/MM/yyyy", new Date());
  const diasSemanaCadastrados = (cadastro.dias_semana || []).map(String);
  const diaSemana = String((getDay(data) + 6) % 7);

  return (
    isWithinInterval(data, { start: dataInicial, end: dataFinal }) &&
    diasSemanaCadastrados.includes(diaSemana)
  );
};

export const dataHabilitada = (
  diaInfo,
  mesAno,
  cadastro,
  dataReferencia = new Date(),
) => {
  if (!dataNoPeriodo(diaInfo, mesAno, cadastro)) {
    return false;
  }

  const data = new Date(
    Number(diaInfo.ano),
    Number(diaInfo.mes) - 1,
    Number(diaInfo.dia),
  );
  const hoje = new Date(
    dataReferencia.getFullYear(),
    dataReferencia.getMonth(),
    dataReferencia.getDate(),
  );

  return data < hoje;
};

export const validarValor = (nomeCampo, valor, numParticipantes) => {
  if (valor === undefined || valor === null || valor === "") {
    return undefined;
  }

  const valorNumerico = Number(valor);

  if (!Number.isInteger(valorNumerico) || valorNumerico < 0) {
    return MENSAGEM_VALOR_INVALIDO;
  }

  if (
    CAMPOS_COM_LIMITE_DE_PARTICIPANTES.includes(nomeCampo) &&
    valorNumerico > Number(numParticipantes)
  ) {
    return MENSAGEM_LANCAMENTO_MAIOR_QUE_PARTICIPANTES;
  }

  return undefined;
};

export const validarLancamentos = (
  values,
  colunasHabilitadas,
  linhas,
  categoriaId,
  numParticipantes,
) => {
  const erros = [];

  colunasHabilitadas.forEach((coluna) => {
    linhas.forEach((linha) => {
      const nomeCampo = `${linha.name}__dia_${coluna.dia}__categoria_${categoriaId}`;
      const erro = validarValor(
        linha.name,
        values[nomeCampo],
        numParticipantes,
      );

      if (erro) {
        erros.push({
          dia: coluna.dia,
          nome: linha.nome,
          erro,
        });
      }
    });
  });

  return erros;
};

export const montarValoresIniciais = ({
  cadastro,
  linhas,
  categoriaId,
  mesAno,
  valoresSalvos,
}) => {
  const valores = {
    mes_lancamento: formatarMesAno(mesAno),
    periodo_escolar: NOME_GRUPO_ESCOLA_ABERTA,
  };

  const nomesCampos = new Set(linhas.map((linha) => linha.name));

  valoresSalvos.forEach((valor) => {
    if (
      valor.nome_campo !== "participantes" &&
      valor.nome_campo !== "observacoes" &&
      !nomesCampos.has(valor.nome_campo)
    ) {
      return;
    }

    valores[`${valor.nome_campo}__dia_${valor.dia}__categoria_${categoriaId}`] =
      valor.valor !== null && valor.valor !== undefined
        ? String(valor.valor)
        : null;
  });

  const totalDias = Number(format(lastDayOfMonth(mesAno), "dd"));
  for (let numeroDia = 1; numeroDia <= totalDias; numeroDia++) {
    const diaInfo = {
      dia: String(numeroDia).padStart(2, "0"),
      mes: format(mesAno, "MM"),
      ano: format(mesAno, "yyyy"),
    };

    if (dataNoPeriodo(diaInfo, mesAno, cadastro)) {
      valores[`participantes__dia_${diaInfo.dia}__categoria_${categoriaId}`] =
        String(cadastro.num_participantes ?? "");
    }
  }

  return valores;
};

export const montarPayload = ({
  solicitacaoUuid,
  categoriaId,
  values,
  colunasHabilitadas,
  linhas,
  numParticipantes,
  incluirRemocoes = false,
}) => {
  const valoresMedicao = [];

  colunasHabilitadas.forEach((coluna) => {
    valoresMedicao.push({
      dia: coluna.dia,
      valor: String(numParticipantes ?? ""),
      nome_campo: "participantes",
      categoria_medicao: categoriaId,
      tipo_alimentacao: "",
    });

    linhas.forEach((linha) => {
      const chave = `${linha.name}__dia_${coluna.dia}__categoria_${categoriaId}`;
      const valor = values[chave];

      if (valor !== undefined && valor !== null && valor !== "") {
        valoresMedicao.push({
          dia: coluna.dia,
          valor: String(valor),
          nome_campo: linha.name,
          categoria_medicao: categoriaId,
          tipo_alimentacao: linha.uuid || "",
        });
      } else if (incluirRemocoes) {
        valoresMedicao.push({
          dia: coluna.dia,
          valor: "-1",
          nome_campo: linha.name,
          categoria_medicao: categoriaId,
          tipo_alimentacao: linha.uuid || "",
        });
      }
    });

    const observacao =
      values[`observacoes__dia_${coluna.dia}__categoria_${categoriaId}`];

    if (!["<p></p>\n", "<p></p>", "", null, undefined].includes(observacao)) {
      valoresMedicao.push({
        dia: coluna.dia,
        valor: observacao,
        nome_campo: "observacoes",
        categoria_medicao: categoriaId,
        tipo_alimentacao: "",
      });
    } else if (incluirRemocoes) {
      valoresMedicao.push({
        dia: coluna.dia,
        valor: "-1",
        nome_campo: "observacoes",
        categoria_medicao: categoriaId,
        tipo_alimentacao: "",
      });
    }
  });

  return {
    solicitacao_medicao_inicial: solicitacaoUuid,
    grupo: NOME_GRUPO_ESCOLA_ABERTA,
    valores_medicao: valoresMedicao,
  };
};

export const obterMedicaoUuid = (valoresSalvos = []) =>
  valoresSalvos.find((valor) => valor.medicao_uuid)?.medicao_uuid;

export const textoBotaoObservacao = (valor) =>
  ["<p></p>\n", "<p></p>", "", null, undefined].includes(valor)
    ? "Adicionar"
    : "Visualizar";

export const nomesDiasSemana = NOMES_DIAS_SEMANA;
