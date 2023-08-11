import moment from "moment";
import { format, getYear, isWeekend } from "date-fns";
import strip_tags from "locutus/php/strings/strip_tags";
import { ALT_CARDAPIO } from "components/screens/helper";
import { TIPO_PERFIL } from "constants/shared";

export const required = value =>
  value !== undefined ? undefined : "Campo obrigatório";

export const ehDiaUtil = (values, motivos, feriadosAno) => value => {
  const ehLPRouRPL = () => {
    return (
      values &&
      values.motivo &&
      motivos &&
      (motivos
        .find(motivo => motivo.uuid === values.motivo)
        .nome.includes("LPR") ||
        motivos
          .find(motivo => motivo.uuid === values.motivo)
          .nome.includes("RPL"))
    );
  };

  const ehFinalDeSemana = value => {
    const valores = value.split("/");
    const dataFormatada = `${valores[1]}/${valores[0]}/${valores[2]}`;
    return isWeekend(new Date(dataFormatada));
  };

  return value &&
    ![undefined].includes(value) &&
    ehLPRouRPL() &&
    (ehFinalDeSemana(value) || (feriadosAno && feriadosAno.includes(value)))
    ? "Não é possível solicitar LPR ou RPL para dia não útil!"
    : undefined;
};

export const composeValidators = (...validators) => value =>
  validators.reduce((error, validator) => error || validator(value), undefined);

export const requiredOptionSearchSelect = escolas => value =>
  escolas.find(escola => escola.label === value)
    ? undefined
    : "Selecione uma opção válida";

export const requiredSearchSelectUnidEducDietas = escolas => value => {
  let value_ = value;
  if (value && localStorage.getItem("tipo_perfil") === TIPO_PERFIL.ESCOLA) {
    return undefined;
  }
  return value_ === undefined ||
    escolas.find(
      escola => escola.label === value_.substring(value_.indexOf("- ") + 2)
    )
    ? undefined
    : "Selecione uma opção válida";
};

export const dataDuplicada = listaDatas => value => {
  return value &&
    listaDatas &&
    listaDatas.filter(el => el && el.data === value).length > 1
    ? "Já existe uma solicitação de inclusão de alimento para essa mesma data."
    : undefined;
};

export const requiredMultiselect = array =>
  array !== [] ? undefined : "Campo obrigatório";

export const requiredMultiselectKhan = array =>
  (array === undefined || array.length === 0) && "Campo obrigatório";

export const deveSerNoAnoCorrente = value => {
  const dataSelecionada = moment(value, "DD/MM/YYYY").year();
  const dataAtual = moment().year();
  return dataSelecionada === dataAtual ? undefined : "Deve ser no mesmo ano";
};

export const diasAntecedencia = value => {
  return value !== undefined ? undefined : "Campo obrigatório";
};

// XXX: Workaround for labelAndTextArea component
export const textAreaRequired = value => {
  return value !== "<p></p>\n" && value !== undefined && value !== ""
    ? undefined
    : "Campo obrigatório";
};

export const peloMenosUmCaractere = value => {
  let valorLimpo = strip_tags(value);
  valorLimpo = valorLimpo.replace(/&nbsp;/g, "");
  return /[a-zA-Z0-9]/i.test(valorLimpo)
    ? undefined
    : "Pelo menos um caractere deve ser digitado";
};

export const selectValidate = value => {
  let valorLimpo = strip_tags(value);
  valorLimpo = valorLimpo.replace(/&nbsp;/g, "");
  return /[a-zA-Z0-9]/i.test(valorLimpo) ? undefined : "Campo obrigatório";
};

export const textAreaRequiredAndAtLeastOneCharacter = value => {
  let result = textAreaRequired(value);
  if (result !== undefined) {
    return result;
  }
  return peloMenosUmCaractere(value);
};

export const requiredCheck = value =>
  value !== undefined
    ? undefined
    : "Campo obrigatório: selecione ao menos uma opção";

export const maxLength = max => value =>
  value && value.length > max
    ? `Deve ter ${max} caracteres(s) ou menos`
    : undefined;

export const maxLengthSemTags = max => value => {
  if (value && strip_tags(value).length > max) {
    return `Deve ter ${max} caracteres(s) ou menos`;
  } else {
    return undefined;
  }
};

export const maxLengthProduto = max => value =>
  value && value.length > max
    ? `Limite máximo de ${max} caracteres`
    : undefined;

export const minLength = min => value =>
  value && value.length < min
    ? `Deve ter ao menos ${min} caracteres(s)`
    : undefined;

export const length = size => value =>
  value && value.length !== size
    ? `Deve ter exatamente ${size} caracteres`
    : undefined;

export const rfOuCpfOuCodOperador = value => {
  if (value && value.length === 11) {
    if (/[^0-9]/i.test(value)) {
      return `O CPF deve conter apenas números`;
    } else {
      return undefined;
    }
  }
  if (value && value.length === 7) {
    if (/[^0-9]/i.test(value)) {
      return `O RF deve conter apenas números, se for um Código de Operador, a letra deve ser o primeiro digito`;
    } else {
      return undefined;
    }
  }
  return `Deve ter 7 ou 11 caracteres`;
};

export const semArroba = value =>
  value && value.includes("@") ? "Campo e-mail não deve conter @" : undefined;

// eslint-disable-next-line
const number = value =>
  value && isNaN(Number(value)) ? "Deve ser um número" : undefined;

export const minValue = min => value =>
  value && value < min ? `Deve ser ao menos ${min}` : undefined;

export const naoPodeSerZero = value =>
  value && value < 1 ? "Deve ser ao menos 1" : undefined;

export const maxValue = max => value =>
  value && value > max ? `Não pode ser maior que ${max}` : undefined;

export const maxValueFrequenciaAlimentacao = (max, inputName) => value => {
  return value && value > max && inputName.includes("frequencia")
    ? "A quantidade de alunos frequentes não pode ser maior do que a quantidade de alunos matriculados."
    : undefined;
};

export const maxValueLancheRefeicaoSobremesa1Oferta = (
  max,
  inputName,
  solicitacoesAutorizadas,
  mesAnoConsiderado,
  dia
) => value => {
  const data = `${dia}/${format(mesAnoConsiderado, "MM")}/${getYear(
    mesAnoConsiderado
  )}`;
  const existeAlteracaoCardapioRPL =
    solicitacoesAutorizadas.filter(
      solicitacao =>
        solicitacao.tipo_doc === ALT_CARDAPIO &&
        solicitacao.data_evento === data &&
        solicitacao.motivo === "RPL - Refeição por Lanche"
    ).length > 0;
  const existeAlteracaoCardapioLPR =
    solicitacoesAutorizadas.filter(
      solicitacao =>
        solicitacao.tipo_doc === ALT_CARDAPIO &&
        solicitacao.data_evento === data &&
        solicitacao.motivo === "LPR - Lanche por Refeição"
    ).length > 0;

  if (
    value &&
    !["Mês anterior", "Mês posterior"].includes(value) &&
    [NaN, 0].includes(max) &&
    (inputName.includes("refeicao") ||
      inputName.includes("sobremesa") ||
      inputName.includes("lanche")) &&
    !inputName.includes("repeticao") &&
    !inputName.includes("emergencial")
  ) {
    return "Frequência acima inválida ou não preenchida";
  }
  if (
    value &&
    existeAlteracaoCardapioRPL &&
    inputName.includes("lanche") &&
    !inputName.includes("emergencial")
  ) {
    if (value > 2 * max) {
      return "Lançamento maior que 2x a frequência de alunos no dia";
    } else {
      return undefined;
    }
  }
  if (
    value &&
    existeAlteracaoCardapioLPR &&
    inputName.includes("refeicao") &&
    !inputName.includes("repeticao")
  ) {
    if (value > 2 * max) {
      return "Lançamento maior que 2x a frequência de alunos no dia";
    } else {
      return undefined;
    }
  }
  if (
    value &&
    value > max &&
    (inputName.includes("refeicao") ||
      inputName.includes("sobremesa") ||
      inputName.includes("lanche")) &&
    !inputName.includes("repeticao") &&
    !inputName.includes("emergencial")
  ) {
    return "Lançamento maior que a frequência de alunos no dia";
  }
  return undefined;
};

export const email = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? "E-mail inválido"
    : undefined;

export const cep = value =>
  value && /^[\d]{5}-[\d]{3}/.test(value) ? undefined : "Cep inválido";

export const prefeituraEmail = value =>
  value && /.+@\prefeitura.sp.gov.br/.test(value)
    ? undefined
    : "Somente emails da prefeitura de São Paulo";

export const SMEPrefeituraEmail = value =>
  value && /.+@sme.prefeitura.sp.gov.br/.test(value)
    ? undefined
    : "Digite o E-mail @sme.prefeitura.sp.gov.br";

export const peloMenosUmNumeroEUmaLetra = value =>
  value && /^(?=.*[0-9])(?=.*[a-zA-Z])/i.test(value)
    ? undefined
    : "Precisa conter letras e números";

export const alphaNumeric = value =>
  value && /[^a-zA-Z0-9]/i.test(value) ? "Apenas letras e números" : undefined;

export const noSpaceStartOrEnd = value =>
  value && /^\s+|\s+$/.test(value)
    ? "Remover espaço do início e/ou final"
    : undefined;

export const alphaNumericAndSingleSpaceBetweenCharacters = value =>
  value && /[^a-zA-Z0-9\s]/.test(value)
    ? "Apenas letras e números"
    : /[^a-zA-Z0-9]+[\s]/.test(value)
    ? "Remover excesso de espaços"
    : undefined;

export const apenasLetras = value =>
  value && /[^a-zA-Zà-úÀ-Ú ]/i.test(value)
    ? "Não digite números ou caracteres especiais"
    : undefined;

export const numericInteger = value =>
  // value && /[^0-9 ]/i.test(value) ? "Somente números" : undefined;
  value && !/\D/.test(value) ? undefined : "Somente números";

export const nonRequiredNumericInteger = value => {
  if (value !== undefined && !/^[0-9]+$/.test(value)) {
    return "Somente números";
  }
};

export const phoneNumber = value =>
  value && !/^(0|[1-9][0-9]{9})$/i.test(value)
    ? "Invalid phone number, must be 10 digits"
    : undefined;

export const tamanhoCnpj = value =>
  value.length < 14 ? "CNPJ Inválido" : undefined;

export const tamanhoCnpjMascara = value =>
  value.length < 18 ? "CNPJ Inválido" : undefined;

export const semCaracteresEspeciais = value =>
  value && !/^[\w&.-]+$/i.test(value)
    ? `Não permite caracteres especiais`
    : undefined;

export const numeroDecimal = value => {
  const er = new RegExp("[0-9],[0-9]");
  return value ? (er.test(value) ? undefined : "Deve ser um decimal") : [];
};

export const inteiroOuDecimal = value => {
  return value && !/^[0-9]+([,.][0-9]+)?$/g.test(value)
    ? "Somente números inteiros ou decimais"
    : undefined;
};

export const numeroInteiro = value =>
  value ? (!/\D/.test(value) ? undefined : "Somente números") : [];

export const validaCPF = value => {
  if (!value) return undefined;
  let cpf = value.replace(/[^\d]+/g, "");

  if (cpf === "") return false;
  // Elimina CPFs invalidos conhecidos
  if (
    cpf.length !== 11 ||
    cpf === "00000000000" ||
    cpf === "11111111111" ||
    cpf === "22222222222" ||
    cpf === "33333333333" ||
    cpf === "44444444444" ||
    cpf === "55555555555" ||
    cpf === "66666666666" ||
    cpf === "77777777777" ||
    cpf === "88888888888" ||
    cpf === "99999999999"
  ) {
    return "CPF informado inválido";
  }

  // Valida 1o digito
  let add = 0;
  let i, rev;
  for (i = 0; i < 9; i++) {
    add += parseInt(cpf.charAt(i)) * (10 - i);
  }
  rev = 11 - (add % 11);
  if (rev === 10 || rev === 11) {
    rev = 0;
  }
  if (rev !== parseInt(cpf.charAt(9))) {
    return "CPF informado inválido";
  }
  // Valida 2o digito
  add = 0;
  for (i = 0; i < 10; i++) {
    add += parseInt(cpf.charAt(i)) * (11 - i);
  }
  rev = 11 - (add % 11);
  if (rev === 10 || rev === 11) {
    rev = 0;
  }
  if (rev !== parseInt(cpf.charAt(10))) {
    return "CPF informado inválido";
  }

  return undefined;
};
