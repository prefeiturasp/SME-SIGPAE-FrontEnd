import strip_tags from "locutus/php/strings/strip_tags";
import moment from "moment";
import { TIPO_PERFIL } from "src/constants/shared";

export const required = (value) =>
  value === null || value === undefined || value === ""
    ? "Campo obrigatório"
    : undefined;

export const composeValidators =
  (...validators) =>
  (value) =>
    validators.reduce(
      (error, validator) => error || validator(value),
      undefined,
    );

export const requiredOptionSearchSelect = (escolas) => (value) =>
  escolas.find((escola) => escola.label === value)
    ? undefined
    : "Selecione uma opção válida";

export const requiredSearchSelectUnidEducDietas = (escolas) => (value) => {
  let value_ = value;
  if (value && localStorage.getItem("tipo_perfil") === TIPO_PERFIL.ESCOLA) {
    return undefined;
  }
  return value_ === undefined ||
    escolas.find(
      (escola) => escola.label === value_.substring(value_.indexOf("- ") + 2),
    )
    ? undefined
    : "Selecione uma opção válida";
};

export const dataDuplicada = (listaDatas) => (value) => {
  return value &&
    listaDatas &&
    listaDatas.filter((el) => el && el.data === value).length > 1
    ? "Já existe uma solicitação de inclusão de alimento para essa mesma data."
    : undefined;
};

export const requiredMultiselect = (array) =>
  array && array.length > 0 ? undefined : "Campo obrigatório";

export const requiredMultiselectKhan = (array) =>
  (array === undefined || array.length === 0) && "Campo obrigatório";

export const deveSerNoAnoCorrente = (value) => {
  const dataSelecionada = moment(value, "DD/MM/YYYY").year();
  const dataAtual = moment().year();
  return dataSelecionada === dataAtual ? undefined : "Deve ser no mesmo ano";
};

export const diasAntecedencia = (value) => {
  return value !== undefined ? undefined : "Campo obrigatório";
};

// XXX: Workaround for labelAndTextArea component
export const textAreaRequired = (value) => {
  return value !== "<p></p>\n" && value !== undefined && value !== ""
    ? undefined
    : "Campo obrigatório";
};

export const peloMenosUmCaractere = (value) => {
  let valorLimpo = strip_tags(value);
  valorLimpo = valorLimpo.replace(/&nbsp;/g, "");
  return /[a-zA-Z0-9]/i.test(valorLimpo)
    ? undefined
    : "Pelo menos um caractere deve ser digitado";
};

export const selectValidate = (value) => {
  let valorLimpo = strip_tags(value);
  valorLimpo = valorLimpo.replace(/&nbsp;/g, "");
  return /[a-zA-Z0-9]/i.test(valorLimpo) ? undefined : "Campo obrigatório";
};

export const textAreaRequiredAndAtLeastOneCharacter = (value) => {
  let result = textAreaRequired(value);
  if (result !== undefined) {
    return result;
  }
  return peloMenosUmCaractere(value);
};

export const requiredCheck = (value) =>
  value !== undefined
    ? undefined
    : "Campo obrigatório: selecione ao menos uma opção";

export const maxLength = (max) => (value) =>
  value && value.length > max
    ? `Deve ter ${max} caracteres(s) ou menos`
    : undefined;

export const maxLengthSemTags = (max) => (value) => {
  if (value && strip_tags(value).length > max) {
    return `Deve ter ${max} caracteres(s) ou menos`;
  } else {
    return undefined;
  }
};

export const maxLengthProduto = (max) => (value) =>
  value && value.length > max
    ? `Limite máximo de ${max} caracteres`
    : undefined;

export const minLength = (min) => (value) =>
  value && value.length < min
    ? `Deve ter ao menos ${min} caracteres(s)`
    : undefined;

export const length = (size) => (value) =>
  value && value.length !== size
    ? `Deve ter exatamente ${size} caracteres`
    : undefined;

export const rfOuCpfOuCodOperador = (value) => {
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

export const semArroba = (value) =>
  value && value.includes("@") ? "Campo e-mail não deve conter @" : undefined;

// eslint-disable-next-line
const number = (value) =>
  value && isNaN(Number(value)) ? "Deve ser um número" : undefined;

export const minValue = (min) => (value) =>
  value && value < min ? `Deve ser ao menos ${min}` : undefined;

export const naoPodeSerZero = (value) =>
  value && value < 1 ? "Deve ser ao menos 1" : undefined;

export const maxValue = (max, mensagem) => (value) =>
  value && value > max
    ? mensagem || `Não pode ser maior que ${max}`
    : undefined;

export const maxValueMaiorFrequenciaNoPeriodoIMR = (max) => (value) => {
  return value && value > max
    ? "Não pode ser maior que o Nº de matriculados"
    : undefined;
};

export const email = (value) =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? "E-mail inválido"
    : undefined;

export const cep = (value) =>
  value && /^[\d]{5}-[\d]{3}/.test(value) ? undefined : "Cep inválido";

export const prefeituraEmail = (value) =>
  value && /^[^\s@]+@prefeitura\.sp\.gov\.br$/.test(value)
    ? undefined
    : "Somente emails da prefeitura de São Paulo";

export const SMEPrefeituraEmail = (value) =>
  value && /^[^\s@]+@sme\.prefeitura\.sp\.gov\.br$/.test(value)
    ? undefined
    : "Digite o E-mail @sme.prefeitura.sp.gov.br";

export const peloMenosUmNumeroEUmaLetra = (value) =>
  value && /^(?=.*[0-9])(?=.*[a-zA-Z])/i.test(value)
    ? undefined
    : "Precisa conter letras e números";

export const alphaNumeric = (value) =>
  value && /[^a-zA-Z0-9]/i.test(value) ? "Apenas letras e números" : undefined;

export const noSpaceStartOrEnd = (value) =>
  value && (value.startsWith(" ") || value.endsWith(" "))
    ? "Remover espaço do início e/ou final"
    : undefined;

export const alphaNumericAndSingleSpaceBetweenCharacters = (value) => {
  if (!value) return undefined;

  if (/[^a-zA-Z0-9\s]/.test(value)) {
    return "Apenas letras e números";
  }

  if (/\s{2,}/.test(value)) {
    return "Remover excesso de espaços";
  }

  return undefined;
};

export const apenasLetras = (value) =>
  value && /[^a-zA-Zà-úÀ-Ú ]/i.test(value)
    ? "Não digite números ou caracteres especiais"
    : undefined;

export const numericInteger = (value) => {
  if (!value) return undefined;
  return value && !/\D/.test(value) ? undefined : "Somente números";
};

export const nonRequiredNumericInteger = (value) => {
  if (value !== undefined && !/^[0-9]+$/.test(value)) {
    return "Somente números";
  }
};

export const tamanhoCnpj = (value) =>
  value.length < 14 ? "CNPJ Inválido" : undefined;

export const tamanhoCnpjMascara = (value) =>
  value.length < 18 ? "CNPJ Inválido" : undefined;

export const inteiroOuDecimal = (value) => {
  return value && !/^[0-9]+([,.][0-9]+)?$/g.test(value)
    ? "Somente números inteiros ou decimais"
    : undefined;
};

export const inteiroOuDecimalComVirgula = (value) => {
  return value && !/^[0-9]+([,][0-9]+)?$/g.test(value)
    ? "Somente números inteiros ou decimais (separados por vírgula)"
    : undefined;
};

export const inteiroOuDecimalPositivoOuNegativo = (value) => {
  return value && !/^(-)?[0-9]+([,][0-9]+)?$/g.test(value)
    ? "Somente números inteiros ou decimais positivos ou negativos"
    : undefined;
};

export const decimalMonetario = (value) => {
  return value && !/^[0-9]+([,][0-9]{2})$/g.test(value)
    ? "Somente números com duas casas decimais (ex: 00,00)"
    : undefined;
};

export const validaCPF = (value) => {
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
