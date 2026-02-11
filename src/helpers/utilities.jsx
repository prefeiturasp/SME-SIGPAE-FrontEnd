import moment from "moment";
import "moment/locale/pt-br";
import { createTextMask } from "redux-form-input-masks";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import { ENVIRONMENT } from "src/constants/config";
import {
  JS_DATE_DEZEMBRO,
  statusEnum,
  TIPOS_SOLICITACAO_LABEL,
  TIPO_SERVICO,
  TIPO_SOLICITACAO,
} from "src/constants/shared";
import { v4 as uuidv4 } from "uuid";
import { RELATORIO } from "../configs/constants";
import {
  MODULO_GESTAO,
  PERFIL,
  TIPO_GESTAO,
  TIPO_PERFIL,
} from "../constants/shared";

// TODO: Quebrar esse arquivo, tem muitos helpers de diferentes tipo num único arquivo
//       Dá pra separar por tipo de helper:
//         - manupular data
//         - lidar com tipo de usuário ou perfil
//       Os que não tiverem categoria definida podem ficar aqui

export const dateDelta = (daysDelta) => {
  let today = new Date();
  today.setDate(today.getDate() + daysDelta);
  return today;
};

export const checaSeDataEstaEntre2e5DiasUteis = (
  value,
  two_working_days,
  five_working_days,
) => {
  const _date = value.split("/");
  if (
    two_working_days <= new Date(_date[2], _date[1] - 1, _date[0]) &&
    new Date(_date[2], _date[1] - 1, _date[0]) <= five_working_days
  ) {
    return true;
  }
  return false;
};

export const dataPrioritaria = (
  data,
  proximos_dois_dias_uteis,
  proximos_cinco_dias_uteis,
) => {
  const data_objeto = new Date(moment(data).format("DD/MM/YYYY"));
  return (
    proximos_dois_dias_uteis <= data_objeto &&
    data_objeto < proximos_cinco_dias_uteis
  );
};

export const agregarDefault = (lista, valor = "") => {
  return [{ nome: `Selecione ${valor}`, uuid: "" }].concat(lista);
};

export const formatarParaMultiselect = (lista) => {
  return lista.map((element) => {
    return { value: element.uuid, label: element.nome };
  });
};

export const extrairUUIDs = (lista) => {
  let uuids = [];
  lista.forEach((element) => {
    uuids.push(element.uuid);
  });
  return uuids;
};

export const dataParaUTC = (data) => {
  return new Date(
    data.getUTCFullYear(),
    data.getUTCMonth(),
    data.getUTCDate(),
    data.getUTCHours(),
    data.getUTCMinutes(),
    data.getUTCSeconds(),
  );
};

export const geradorUUID = () => {
  return uuidv4();
};

export const stringSeparadaPorVirgulas = (obj, campo) => {
  let array = [];
  obj.forEach(function (elemento) {
    array.push(elemento[campo]);
  });
  return array.join(", ");
};

export const dataAtual = () => {
  moment.locale("pt-br");
  return moment().format("LL");
};

export const dataAtualDDMMYYYY = () => {
  moment.locale("pt-br");
  return moment().format("L");
};

export const talvezPluralizar = (contador, substantivo, sufixo = "s") => {
  return `${substantivo}${contador !== 1 ? sufixo : ""}`;
};

export const getDataObj = (data) => {
  return moment(data, "DD/MM/YYYY")["_d"];
};

export const formataData = (data, padraoAtual, formato) => {
  return moment(data, padraoAtual).format(formato);
};

export const adicionaDias = (data, formato, numeroDias = 0) => {
  return moment(data, formato).add(numeroDias, "days")["_d"];
};

export const prazoDoPedidoMensagem = (prioridade) => {
  switch (prioridade) {
    case "REGULAR":
      return "Solicitação no prazo regular";
    case "LIMITE":
      return "Solicitação no prazo limite";
    case "PRIORITARIO":
      return "Solicitação próxima ao prazo de vencimento";
    default:
      return "";
  }
};

export const corDaMensagem = (mensagem) => {
  if (mensagem.includes("vencimento")) return "red";
  else if (mensagem.includes("limite")) return "yellow";
  else return "green";
};

export const pontuarValor = (valor) => {
  return parseFloat(valor).toLocaleString();
};

export const mensagemCancelamento = (status, tipoDoc) => {
  switch (status) {
    case statusEnum.DRE_A_VALIDAR:
      return "Esta solicitação está aguardando validação pela DRE. ";
    case statusEnum.DRE_VALIDADO:
      return "Esta solicitação já foi validada pela DRE. ";
    case statusEnum.CODAE_A_AUTORIZAR:
      return "Esta solicitação está aguardando validação da CODAE. ";
    case statusEnum.TERCEIRIZADA_TOMOU_CIENCIA:
    case statusEnum.CODAE_AUTORIZADO:
      return tipoDoc === TIPOS_SOLICITACAO_LABEL.SOLICITACAO_UNIFICADA
        ? "Esta solicitação está autorizada pela CODAE. "
        : "Esta solicitação já foi autorizada pela CODAE. ";
    case statusEnum.INFORMADO:
      return "A solicitação da suspensão de alimentação está autorizada automaticamente. ";
    default:
      return "";
  }
};

export const validarCPF = (cpf) => {
  cpf = cpf.replace(/[^\d]+/g, "");
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
  )
    return false;
  // Valida 1o digito
  let add = 0;
  let i, rev;
  for (i = 0; i < 9; i++) add += parseInt(cpf.charAt(i)) * (10 - i);
  rev = 11 - (add % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(cpf.charAt(9))) return false;
  // Valida 2o digito
  add = 0;
  for (i = 0; i < 10; i++) add += parseInt(cpf.charAt(i)) * (11 - i);
  rev = 11 - (add % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(cpf.charAt(10))) return false;
  return true;
};

export const removeCaracteresEspeciais = (valor) =>
  valor?.replace(/[^\w\s]/gi, "");

export const formataCPF = (cpf) => {
  cpf = cpf.replace(/[^\d]/g, "");
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

export const formataCPFCensurado = (cpf) => {
  cpf = cpf.replace(/[^\d]/g, "");
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.***.***-$4");
};

export const formataMilhar = (value) => {
  const valor = value?.toString().replace(/\D/g, "");
  if (!valor) return valor;

  let resultado = "";
  let contador = 0;

  for (let i = valor.length - 1; i >= 0; i--) {
    resultado = valor[i] + resultado;
    contador++;
    if (contador % 3 === 0 && i > 0) {
      resultado = "." + resultado;
    }
  }

  return resultado;
};

export const formataMilharDecimal = (value) => {
  if (value === undefined || value === null) return value;

  const number = Number(value);
  if (isNaN(number)) return value;

  return number.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const truncarString = (str, numeroMaximoChars) => {
  if (!str) return "";

  return str.length > numeroMaximoChars
    ? str.slice(0, numeroMaximoChars) + "..."
    : str;
};

export const deepCopy = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

export const visualizaBotoesDoFluxo = (solicitacao) => {
  if (ehUsuarioEmpresa()) {
    return false;
  }
  const tipoPerfil = localStorage.getItem("tipo_perfil");
  switch (solicitacao.status) {
    case statusEnum.DRE_A_VALIDAR:
      return [TIPO_PERFIL.DIRETORIA_REGIONAL, TIPO_PERFIL.ESCOLA].includes(
        tipoPerfil,
      );
    case statusEnum.DRE_VALIDADO:
    case statusEnum.CODAE_A_AUTORIZAR:
    case statusEnum.TERCEIRIZADA_RESPONDEU_QUESTIONAMENTO:
      return [
        TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
        TIPO_PERFIL.DIETA_ESPECIAL,
        TIPO_PERFIL.ESCOLA,
      ].includes(tipoPerfil);
    case statusEnum.CODAE_AUTORIZADO:
    case statusEnum.CODAE_QUESTIONADO:
      return [TIPO_PERFIL.TERCEIRIZADA, TIPO_PERFIL.ESCOLA].includes(
        tipoPerfil,
      );
    case statusEnum.TERCEIRIZADA_TOMOU_CIENCIA:
      return [TIPO_PERFIL.DIRETORIA_REGIONAL, TIPO_PERFIL.ESCOLA].includes(
        tipoPerfil,
      );
    case statusEnum.ESCOLA_CANCELOU:
    case statusEnum.DRE_CANCELOU:
      return [TIPO_PERFIL.TERCEIRIZADA].includes(tipoPerfil);
    default:
      return false;
  }
};

export const visualizaBotoesDoFluxoSolicitacaoUnificada = (solicitacao) => {
  if (ehUsuarioEmpresa()) {
    return false;
  }
  const tipoPerfil = localStorage.getItem("tipo_perfil");
  switch (solicitacao?.status) {
    case statusEnum.CODAE_A_AUTORIZAR:
    case statusEnum.TERCEIRIZADA_RESPONDEU_QUESTIONAMENTO:
      return [
        TIPO_PERFIL.DIRETORIA_REGIONAL,
        TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
        TIPO_PERFIL.DIETA_ESPECIAL,
      ].includes(tipoPerfil);
    case statusEnum.CODAE_AUTORIZADO:
      return [
        TIPO_PERFIL.ESCOLA,
        TIPO_PERFIL.DIRETORIA_REGIONAL,
        TIPO_PERFIL.TERCEIRIZADA,
      ].includes(tipoPerfil);
    case statusEnum.CODAE_QUESTIONADO:
      return [TIPO_PERFIL.TERCEIRIZADA].includes(tipoPerfil);
    case statusEnum.ESCOLA_CANCELOU:
    case statusEnum.DRE_CANCELOU:
      return [TIPO_PERFIL.TERCEIRIZADA].includes(tipoPerfil);
    case statusEnum.TERCEIRIZADA_TOMOU_CIENCIA:
      return [TIPO_PERFIL.DIRETORIA_REGIONAL].includes(tipoPerfil);
    default:
      return false;
  }
};

export const vizualizaBotoesDietaEspecial = (solicitacao) => {
  switch (solicitacao.status_solicitacao) {
    case statusEnum.CODAE_A_AUTORIZAR:
      return (
        usuarioEhEscolaTerceirizada() ||
        usuarioEhEscolaTerceirizadaDiretor() ||
        usuarioEhCODAEDietaEspecial()
      );
    case statusEnum.ESCOLA_SOLICITOU_INATIVACAO:
      return usuarioEhCODAEDietaEspecial();
    case statusEnum.CODAE_AUTORIZADO:
    case statusEnum.CODAE_AUTORIZOU_INATIVACAO:
      return usuarioEhAdministradorEmpresaTerceirizada();
    default:
      return false;
  }
};

export const formatarCPFouCNPJ = (value) => {
  const cnpjCpf = value.replace(/\D/g, "");
  if (cnpjCpf.length === 11) {
    return cnpjCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "$1.$2.$3-$4");
  }
  return cnpjCpf.replace(
    /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g,
    "$1.$2.$3/$4-$5",
  );
};

export const formatarCEP = (value) => {
  const cep = value.replace(/\D/g, "");
  if (cep.length === 8) {
    return cep.replace(/(\d{5})(\d{3})/g, "$1-$2");
  }
};

export const formatarTelefone = (value) => {
  const cep = value.replace(/\D/g, "");
  if (cep.length === 11) {
    return cep.replace(/(\d{2})(\d{5})(\d{4})/g, "($1) $2-$3");
  }
  return cep.replace(/(\d{2})(\d{4})(\d{4})/g, "($1) $2-$3");
};

export const usuarioEhCoordenadorGpCODAE = () => {
  return localStorage.getItem("perfil") === PERFIL.COORDENADOR_GESTAO_PRODUTO;
};

export const usuarioEhAdministradorGpCODAE = () => {
  return localStorage.getItem("perfil") === PERFIL.ADMINISTRADOR_GESTAO_PRODUTO;
};

export const usuarioEhCoordenadorNutriCODAE = () => {
  return localStorage.getItem("perfil") === PERFIL.COORDENADOR_DIETA_ESPECIAL;
};

export const usuarioEhAdministradorNutriCODAE = () => {
  return localStorage.getItem("perfil") === PERFIL.ADMINISTRADOR_DIETA_ESPECIAL;
};

export const usuarioEhCoordenadorNutriSupervisao = () => {
  return (
    localStorage.getItem("perfil") === PERFIL.COORDENADOR_SUPERVISAO_NUTRICAO
  );
};

export const usuarioEhAdministradorNutriSupervisao = () => {
  return (
    localStorage.getItem("perfil") === PERFIL.ADMINISTRADOR_SUPERVISAO_NUTRICAO
  );
};

export const usuarioEhDilog = () => {
  return localStorage.getItem("perfil") === PERFIL.COORDENADOR_LOGISTICA;
};

export const usuarioEhCodaeDilog = () => {
  return (
    localStorage.getItem("perfil") === PERFIL.COORDENADOR_CODAE_DILOG_LOGISTICA
  );
};

export const usuarioEhEscolaTerceirizadaDiretor = () => {
  return (
    localStorage.getItem("perfil") === PERFIL.DIRETOR_UE &&
    localStorage.getItem("modulo_gestao") === MODULO_GESTAO.TERCEIRIZADA
  );
};

export const usuarioEhEscolaTerceirizada = () => {
  return (
    localStorage.getItem("perfil") === PERFIL.ADMINISTRADOR_UE &&
    localStorage.getItem("modulo_gestao") === MODULO_GESTAO.TERCEIRIZADA
  );
};

export const usuarioEhEscolaTerceirizadaQualquerPerfil = () => {
  return usuarioEhEscolaTerceirizada() || usuarioEhEscolaTerceirizadaDiretor();
};

export const usuarioEhAdmQualquerEmpresa = () => {
  return [PERFIL.ADMINISTRADOR_EMPRESA].includes(
    localStorage.getItem("perfil"),
  );
};

export const usuarioEhQualquerUsuarioEmpresa = () => {
  return [PERFIL.USUARIO_EMPRESA].includes(localStorage.getItem("perfil"));
};

export const usuarioEhDiretorUE = () => {
  return [PERFIL.DIRETOR_UE].includes(localStorage.getItem("perfil"));
};

export const usuarioEhEscola = () => {
  return [PERFIL.DIRETOR_UE, PERFIL.ADMINISTRADOR_UE].includes(
    localStorage.getItem("perfil"),
  );
};

export const usuarioEscolaEhGestaoMistaParceira = () => {
  return [TIPO_GESTAO.MISTA, TIPO_GESTAO.PARCEIRA].includes(
    localStorage.getItem("tipo_gestao"),
  );
};

export const validaPerfilEscolaMistaParceira = () => {
  switch (localStorage.getItem("tipo_perfil")) {
    case TIPO_PERFIL.ESCOLA:
      return !usuarioEscolaEhGestaoMistaParceira();
    default:
      return true;
  }
};

export const usuarioEscolaEhGestaoDireta = () => {
  return [TIPO_GESTAO.DIRETA].includes(localStorage.getItem("tipo_gestao"));
};

export const usuarioEscolaEhGestaoParceira = () => {
  return [TIPO_GESTAO.PARCEIRA].includes(localStorage.getItem("tipo_gestao"));
};

export const usuarioEhEscolaAbastecimentoDiretor = () => {
  return (
    localStorage.getItem("perfil") === PERFIL.DIRETOR_UE &&
    localStorage.getItem("modulo_gestao") === MODULO_GESTAO.ABASTECIMENTO
  );
};

export const usuarioEhEscolaAbastecimento = () => {
  return (
    localStorage.getItem("perfil") === PERFIL.ADMINISTRADOR_UE &&
    localStorage.getItem("modulo_gestao") === MODULO_GESTAO.ABASTECIMENTO
  );
};

export const usuarioComAcessoTelaEntregasDilog = () => {
  return [
    PERFIL.COORDENADOR_LOGISTICA,
    PERFIL.COORDENADOR_CODAE_DILOG_LOGISTICA,
    PERFIL.ADMINISTRADOR_CODAE_GABINETE,
    PERFIL.ADMINISTRADOR_CODAE_DILOG_CONTABIL,
    PERFIL.ADMINISTRADOR_CODAE_DILOG_JURIDICO,
  ].includes(localStorage.getItem("perfil"));
};

export const usuarioEhOutrosDilog = () => {
  return [
    PERFIL.ADMINISTRADOR_CODAE_DILOG_CONTABIL,
    PERFIL.ADMINISTRADOR_CODAE_DILOG_JURIDICO,
  ].includes(localStorage.getItem("perfil"));
};

export const usuarioEhDilogJuridico = () => {
  return [PERFIL.ADMINISTRADOR_CODAE_DILOG_JURIDICO].includes(
    localStorage.getItem("perfil"),
  );
};

export const usuarioComAcessoTelaDetalharNotificacaoOcorrencia = () => {
  return [
    PERFIL.COORDENADOR_CODAE_DILOG_LOGISTICA,
    PERFIL.ADMINISTRADOR_CODAE_DILOG_JURIDICO,
    PERFIL.ADMINISTRADOR_CODAE_GABINETE,
    PERFIL.DILOG_DIRETORIA,
  ].includes(localStorage.getItem("perfil"));
};

export const usuarioComAcessoAoRelatorioCronogramas = () => {
  return [
    PERFIL.DILOG_DIRETORIA,
    PERFIL.DILOG_ABASTECIMENTO,
    PERFIL.DILOG_CRONOGRAMA,
    PERFIL.COORDENADOR_CODAE_DILOG_LOGISTICA,
    PERFIL.ADMINISTRADOR_CODAE_GABINETE,
    PERFIL.USUARIO_RELATORIOS,
    PERFIL.USUARIO_GTIC_CODAE,
    PERFIL.DILOG_VISUALIZACAO,
  ].includes(localStorage.getItem("perfil"));
};

export const usuarioComAcessoAoCalendarioCronograma = () => {
  return [
    PERFIL.DILOG_CRONOGRAMA,
    PERFIL.DILOG_QUALIDADE,
    PERFIL.COORDENADOR_CODAE_DILOG_LOGISTICA,
    PERFIL.DILOG_ABASTECIMENTO,
    PERFIL.DILOG_DIRETORIA,
    PERFIL.ADMINISTRADOR_CODAE_GABINETE,
    PERFIL.DILOG_VISUALIZACAO,
  ].includes(localStorage.getItem("perfil"));
};

export const usuarioComAcessoAoPainelAprovacoes = () => {
  return [
    PERFIL.DILOG_DIRETORIA,
    PERFIL.DILOG_ABASTECIMENTO,
    PERFIL.DILOG_CRONOGRAMA,
    PERFIL.COORDENADOR_CODAE_DILOG_LOGISTICA,
    PERFIL.ADMINISTRADOR_CODAE_GABINETE,
    PERFIL.DILOG_VISUALIZACAO,
    PERFIL.DILOG_QUALIDADE,
  ].includes(localStorage.getItem("perfil"));
};

export const usuarioComAcessoAoPainelEmbalagens = () => {
  return [
    PERFIL.DILOG_QUALIDADE,
    PERFIL.ADMINISTRADOR_GESTAO_PRODUTO,
    PERFIL.COORDENADOR_GESTAO_PRODUTO,
    PERFIL.COORDENADOR_CODAE_DILOG_LOGISTICA,
    PERFIL.ADMINISTRADOR_CODAE_GABINETE,
    PERFIL.DILOG_DIRETORIA,
    PERFIL.DILOG_ABASTECIMENTO,
    PERFIL.DILOG_CRONOGRAMA,
  ].includes(localStorage.getItem("perfil"));
};

export const usuarioPodeAnalisarLayoutEmbalagem = () =>
  [
    PERFIL.DILOG_QUALIDADE,
    PERFIL.COORDENADOR_GESTAO_PRODUTO,
    PERFIL.ADMINISTRADOR_GESTAO_PRODUTO,
  ].includes(localStorage.getItem("perfil"));

export const usuarioComAcessoAoPainelDocumentos = () => {
  return [
    PERFIL.DILOG_QUALIDADE,
    PERFIL.COORDENADOR_CODAE_DILOG_LOGISTICA,
    PERFIL.DILOG_CRONOGRAMA,
    PERFIL.ADMINISTRADOR_CODAE_GABINETE,
    PERFIL.DILOG_DIRETORIA,
  ].includes(localStorage.getItem("perfil"));
};

export const usuarioComAcessoAoPainelFichasTecnicas = () => {
  return [
    PERFIL.ADMINISTRADOR_GESTAO_PRODUTO,
    PERFIL.COORDENADOR_GESTAO_PRODUTO,
    PERFIL.COORDENADOR_CODAE_DILOG_LOGISTICA,
    PERFIL.ADMINISTRADOR_CODAE_GABINETE,
    PERFIL.DILOG_DIRETORIA,
    PERFIL.DILOG_QUALIDADE,
    PERFIL.DILOG_ABASTECIMENTO,
    PERFIL.DILOG_CRONOGRAMA,
  ].includes(localStorage.getItem("perfil"));
};

export const usuarioEhLogistica = () => {
  return [
    PERFIL.COORDENADOR_LOGISTICA,
    PERFIL.COORDENADOR_CODAE_DILOG_LOGISTICA,
  ].includes(localStorage.getItem("perfil"));
};

export const usuarioEhDilogQualidade = () =>
  localStorage.getItem("perfil") === PERFIL.DILOG_QUALIDADE;

export const usuarioEhDilogQualidadeOuCronograma = () => {
  return [
    PERFIL.DILOG_QUALIDADE,
    PERFIL.DILOG_CRONOGRAMA,
    PERFIL.COORDENADOR_CODAE_DILOG_LOGISTICA,
  ].includes(localStorage.getItem("perfil"));
};

export const usuarioEhCronogramaOuCodae = () => {
  return [
    PERFIL.DILOG_CRONOGRAMA,
    PERFIL.COORDENADOR_CODAE_DILOG_LOGISTICA,
  ].includes(localStorage.getItem("perfil"));
};

export const usuarioEhPreRecebimento = () => {
  return (
    [
      TIPO_PERFIL.PRE_RECEBIMENTO_VISUALIZACAO,
      TIPO_PERFIL.PRE_RECEBIMENTO,
    ].includes(localStorage.getItem("tipo_perfil")) || usuarioEhCodaeDilog()
  );
};

export const usuarioEhPreRecebimentoSemLogistica = () => {
  return (
    localStorage.getItem("tipo_perfil") === TIPO_PERFIL.PRE_RECEBIMENTO &&
    !usuarioEhDilogDiretoria()
  );
};

export const usuarioEhRecebimento = () => {
  return [PERFIL.DILOG_QUALIDADE].includes(localStorage.getItem("perfil"));
};

export const usuarioEhDinutreDiretoria = () =>
  localStorage.getItem("perfil") === PERFIL.DINUTRE_DIRETORIA;

export const usuarioEhDilogDiretoria = () =>
  localStorage.getItem("perfil") === PERFIL.DILOG_DIRETORIA;

export const usuarioEhDilogVisualizacao = () =>
  localStorage.getItem("perfil") === PERFIL.DILOG_VISUALIZACAO;

export const usuarioEhCronograma = () => {
  return [PERFIL.DILOG_CRONOGRAMA].includes(localStorage.getItem("perfil"));
};

export const usuarioEhAdministradorCONTRATOS = () => {
  return [PERFIL.ADMINISTRADOR_CONTRATOS].includes(
    localStorage.getItem("perfil"),
  );
};

export const usuarioEhDilogAbastecimento = () => {
  return [PERFIL.DILOG_ABASTECIMENTO].includes(localStorage.getItem("perfil"));
};

export const usuarioEhEmpresaDistribuidora = () => {
  return (
    [PERFIL.ADMINISTRADOR_EMPRESA, PERFIL.USUARIO_EMPRESA].includes(
      localStorage.getItem("perfil"),
    ) &&
    [
      TIPO_SERVICO.DISTRIBUIDOR_ARMAZEM,
      TIPO_SERVICO.FORNECEDOR_E_DISTRIBUIDOR,
    ].includes(localStorage.getItem("tipo_servico"))
  );
};

export const usuarioEhEmpresaFornecedor = () => {
  return (
    [PERFIL.ADMINISTRADOR_EMPRESA, PERFIL.USUARIO_EMPRESA].includes(
      localStorage.getItem("perfil"),
    ) &&
    [TIPO_SERVICO.FORNECEDOR, TIPO_SERVICO.FORNECEDOR_E_DISTRIBUIDOR].includes(
      localStorage.getItem("tipo_servico"),
    )
  );
};

export const usuarioEhAdministradorRepresentanteCodae = () => {
  return [PERFIL.ADMINISTRADOR_REPRESENTANTE_CODAE].includes(
    localStorage.getItem("perfil"),
  );
};

export const escolaEhCei = () => {
  return localStorage.getItem("eh_cei") === "true";
};

export const escolaEhCEMEI = () => {
  return localStorage.getItem("eh_cemei") === "true";
};

export const escolaEhEMEBS = () => {
  return localStorage.getItem("eh_emebs") === "true";
};

export const nomeInstituicao = () => {
  return localStorage.getItem("nome_instituicao");
};

export const usuarioEhDRE = () => {
  return localStorage.getItem("tipo_perfil") === TIPO_PERFIL.DIRETORIA_REGIONAL;
};

export const usuarioEhEscolaCeuGestao = () => {
  const instituicao = nomeInstituicao();
  return instituicao?.includes("CEU GESTAO");
};

export const usuarioEhEscolaCIEJA = () => {
  const instituicao = nomeInstituicao();
  return instituicao?.includes("CIEJA");
};

export const usuarioEhEscolaCEMEI = () => {
  const instituicao = nomeInstituicao();
  return instituicao?.includes("CEMEI");
};

export const usuarioEhEscolaCMCT = () => {
  const instituicao = nomeInstituicao();
  return instituicao?.includes("CMCT");
};

export const usuarioEhCoordenadorDRE = () => {
  return localStorage.getItem("perfil") === PERFIL.COORDENADOR_DRE;
};

export const usuarioEhCogestorDRE = () => {
  return localStorage.getItem("perfil") === PERFIL.COGESTOR_DRE;
};

export const usuarioEhCODAEGestaoAlimentacao = () => {
  const tipoPerfil = localStorage.getItem("tipo_perfil");
  return tipoPerfil === TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA;
};

export const usuarioEhCODAENutriManifestacao = () => {
  const tipoPerfil = localStorage.getItem("tipo_perfil");
  return tipoPerfil === TIPO_PERFIL.NUTRICAO_MANIFESTACAO;
};

export const usuarioEhCoordenadorCODAE = () => {
  return (
    localStorage.getItem("perfil") ===
    PERFIL.COORDENADOR_GESTAO_ALIMENTACAO_TERCEIRIZADA
  );
};

export const usuarioEhAdministradorCODAE = () => {
  return (
    localStorage.getItem("perfil") ===
    PERFIL.ADMINISTRADOR_GESTAO_ALIMENTACAO_TERCEIRIZADA
  );
};

export const usuarioEhCODAEDietaEspecial = () => {
  return localStorage.getItem("tipo_perfil") === TIPO_PERFIL.DIETA_ESPECIAL;
};

export const usuarioEhNutricionistaSupervisao = () => {
  return (
    localStorage.getItem("tipo_perfil") === TIPO_PERFIL.SUPERVISAO_NUTRICAO
  );
};

export const usuarioEhCODAEGestaoProduto = () => {
  return localStorage.getItem("tipo_perfil") === TIPO_PERFIL.GESTAO_PRODUTO;
};

export const ehUsuarioRelatorios = () => {
  return localStorage.getItem("perfil") === PERFIL.USUARIO_RELATORIOS;
};

export const usuarioEhQualquerCODAE = () => {
  return (
    usuarioEhCODAEGestaoAlimentacao() ||
    usuarioEhCODAEDietaEspecial() ||
    usuarioEhCODAEGestaoProduto()
  );
};

export const usuarioEhEmpresa = () => {
  return localStorage.getItem("tipo_perfil") === TIPO_PERFIL.TERCEIRIZADA;
};

export const usuarioEhEmpresaTerceirizada = () => {
  return (
    [PERFIL.ADMINISTRADOR_EMPRESA, PERFIL.USUARIO_EMPRESA].includes(
      localStorage.getItem("perfil"),
    ) &&
    [TIPO_SERVICO.TERCEIRIZADA].includes(localStorage.getItem("tipo_servico"))
  );
};

export const usuarioEhAdministradorEmpresaTerceirizada = () => {
  return (
    [PERFIL.ADMINISTRADOR_EMPRESA].includes(localStorage.getItem("perfil")) &&
    [TIPO_SERVICO.TERCEIRIZADA].includes(localStorage.getItem("tipo_servico"))
  );
};

export const ehUsuarioEmpresa = () => {
  return localStorage.getItem("perfil") === PERFIL.USUARIO_EMPRESA;
};

export const usuarioEhMedicao = () => {
  return localStorage.getItem("tipo_perfil") === TIPO_PERFIL.MEDICAO;
};

export const usuarioEhOrgaoFiscalizador = () => {
  return localStorage.getItem("tipo_perfil") === TIPO_PERFIL.ORGAO_FISCALIZADOR;
};

export const usuarioEhCODAEGabinete = () => {
  return localStorage.getItem("perfil") === PERFIL.ADMINISTRADOR_CODAE_GABINETE;
};

export const usuarioEhGticCODAE = () => {
  return localStorage.getItem("perfil") === PERFIL.USUARIO_GTIC_CODAE;
};

export const acessoModuloMedicaoInicialEscola = () => {
  return (
    localStorage.getItem("acesso_modulo_medicao_inicial") === "true" ||
    localStorage.getItem("dre_acesso_modulo_medicao_inicial") === "true"
  );
};

export const acessoModuloMedicaoInicialDRE = () => {
  return (
    localStorage.getItem("possui_escolas_com_acesso_ao_medicao_inicial") ===
    "true"
  );
};

export const acessoModuloMedicaoInicialCODAE = () => {
  return (
    localStorage.getItem("acesso_modulo_medicao_inicial") === "true" &&
    (usuarioEhCODAEGestaoAlimentacao() ||
      usuarioEhCODAENutriManifestacao() ||
      usuarioEhCODAEGabinete())
  );
};

export const acessoModuloMedicaoRelatorioConsolidado = () => {
  return (
    usuarioEhCODAEGestaoAlimentacao() ||
    usuarioEhAdministradorEmpresaTerceirizada() ||
    usuarioEhCODAENutriManifestacao() ||
    usuarioEhDinutreDiretoria() ||
    usuarioEhCODAEGabinete() ||
    usuarioEhDRE() ||
    usuarioEhMedicao()
  );
};

export const converterDDMMYYYYparaYYYYMMDD = (data) => {
  return moment(data, "DD/MM/YYYY").format("YYYY-MM-DD");
};

export const obtemIdentificacaoNutricionista = () =>
  `Elaborado por ${localStorage.getItem("nome")} - RF ${localStorage.getItem(
    "registro_funcional",
  )}`.replace(/[^\w\s-]/g, "");

export const getKey = (obj) => {
  return Object.keys(obj)[0];
};

export const getError = (obj) => {
  if (typeof obj === "string") return obj;
  let result = "Erro";
  if (!obj[getKey(obj)]) {
    return "Erro";
  } else if (
    (obj[getKey(obj)][0] !== undefined &&
      typeof obj[getKey(obj)][0] !== "string") ||
    typeof obj[getKey(obj)] !== "string"
  ) {
    result = getError(obj[getKey(obj)]);
  } else {
    if (typeof obj[getKey(obj)] === "string") return obj[getKey(obj)];
    else return obj[getKey(obj)][0];
  }
  return result;
};

export const exibeError = (error, msg) => {
  if (error.response && typeof error.response.data === "object") {
    let chave = Object.keys(error.response.data);
    let msn_erro_return = error.response.data[chave[0]];
    let msg_erro = Array.isArray(msn_erro_return)
      ? msn_erro_return[0]
      : msn_erro_return;
    if (typeof msg_erro === "object") {
      let chave2 = Object.keys(msg_erro);
      toastError(`${chave2[0]}: ${msg_erro[chave2[0]][0]}`);
    } else if (typeof msg_erro === "string") {
      toastError(`${chave[0]}: ${msg_erro}`);
    }
  } else {
    toastError(msg);
  }
};

export const formatarLotesParaVisao = (lotes) => {
  lotes.forEach((lote) => {
    lote["titulo"] = lote["nome"];
    lote["link"] = lote["uuid"];
  });
  return lotes;
};

export const formatarOpcoesLote = (lista) => {
  const listaFormatada = lista.map((obj) => {
    return {
      label: `${obj.diretoria_regional.iniciais} - ${obj.nome}`,
      value: obj.uuid,
    };
  });
  return listaFormatada;
};

export const formatarOpcoesDRE = (lista) => {
  const listaFormatada = lista.map((obj) => {
    return {
      label: obj.nome,
      value: obj.uuid,
    };
  });
  return listaFormatada;
};

export const ehInclusaoContinua = (tipoSolicitacao) => {
  return tipoSolicitacao === TIPO_SOLICITACAO.SOLICITACAO_CONTINUA;
};
export const ehInclusaoAvulsa = (tipoSolicitacao) => {
  return tipoSolicitacao !== TIPO_SOLICITACAO.SOLICITACAO_CONTINUA;
};

export const ehInclusaoCei = (tipoSolicitacao) => {
  return tipoSolicitacao === TIPO_SOLICITACAO.SOLICITACAO_CEI;
};

export const ehEscolaTipoCEI = (escola) => {
  const nome = (escola && escola.nome) || "";
  return (
    nome.startsWith("CEU CEI") ||
    nome.startsWith("CEI") ||
    nome.startsWith("CCI")
  );
};

export const ehEscolaTipoCEISolicitacaoMedicao = (solicitacao) => {
  const nome = (solicitacao && solicitacao.escola) || "";
  return (
    nome.startsWith("CEU CEI") ||
    nome.startsWith("CEI") ||
    nome.startsWith("CCI")
  );
};

export const ehEscolaTipoCEMEI = (escola) => {
  const nome = (escola && escola.nome) || "";
  return nome.startsWith("CEMEI") || nome.startsWith("CEU CEMEI");
};

export const ehEscolaTipoCEMEISolicitacaoMedicao = (solicitacao) => {
  const nome = (solicitacao && solicitacao.escola) || "";
  return nome.startsWith("CEMEI") || nome.startsWith("CEU CEMEI");
};

export const ehEscolaTipoCEUGESTAO = (nome_escola) => {
  return nome_escola.startsWith("CEU GESTAO");
};

export const escolaNaoPossuiAlunosRegulares = (solicitacaoMedicaoInicial) => {
  return solicitacaoMedicaoInicial.escola_possui_alunos_regulares === false;
};

export const recreioNasFeriasDaMedicao = (solicitacaoMedicaoInicial) => {
  return solicitacaoMedicaoInicial.recreio_nas_ferias;
};

const liberarMedicaoPorTipo = (solicitacao, tipo) => {
  return solicitacao.recreio_nas_ferias?.unidades_participantes.find(
    (up) => up.cei_ou_emei === tipo,
  )?.liberar_medicao;
};

export const recreioNasFeriasDaMedicaoCEIdaCEMEI = (solicitacao) =>
  liberarMedicaoPorTipo(solicitacao, "CEI");

export const recreioNasFeriasDaMedicaoEMEIdaCEMEI = (solicitacao) =>
  liberarMedicaoPorTipo(solicitacao, "EMEI");

export const recreioNasFeriasComColaboradores = (solicitacaoMedicaoInicial) => {
  return (
    solicitacaoMedicaoInicial.recreio_nas_ferias?.unidades_participantes[0]
      ?.tipos_alimentacao.colaboradores?.length > 0
  );
};

export const tipoSolicitacaoComoQuery = (obj) => {
  return `tipoSolicitacao=${comoTipo(obj)}`;
};

export const comoTipo = (obj) => {
  if (ehEscolaTipoCEI(obj.escola)) {
    return TIPO_SOLICITACAO.SOLICITACAO_CEI;
  }
  return obj.motivo
    ? TIPO_SOLICITACAO.SOLICITACAO_CONTINUA
    : TIPO_SOLICITACAO.SOLICITACAO_NORMAL;
};

export const parseRelatorioURLParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return [urlParams.get("uuid"), urlParams.get("tipoSolicitacao")];
};

export const gerarLinkRelatorio = (path, solicitacao) => {
  return `/${path}/${RELATORIO}?uuid=${
    solicitacao.uuid
  }&${tipoSolicitacaoComoQuery(solicitacao)}`;
};

export const safeConcatOn = (propName, a, b, c, d) => {
  if (!a || !a[propName] || !Array.isArray(a[propName])) {
    // eslint-disable-next-line no-console
    console.error("Invalid array concatenation on value: ", a);
    return [];
  }
  if (!b || !b[propName] || !Array.isArray(b[propName])) {
    // eslint-disable-next-line no-console
    console.error("Invalid array concatenation on value: ", b);
    return a[propName];
  }
  if (!c || !c[propName] || !Array.isArray(c[propName])) {
    return a[propName].concat(b[propName]);
  }
  if (!d || !d[propName] || !Array.isArray(d[propName])) {
    return a[propName].concat(b[propName], c[propName]);
  }
  return a[propName].concat(b[propName], c[propName], d[propName]);
};

export const comparaObjetosMoment = (a, b) => {
  if (a.isBefore(b)) {
    return -1;
  }
  if (b.isBefore(a)) {
    return 1;
  }
  return 0;
};

export const parseDataHoraBrToMoment = (dataHoraString) => {
  const formats = ["DD/MM/YYYY", "DD/MM/YYYY HH:mm"];
  return moment(dataHoraString, formats);
};

export const gerarParametrosConsulta = (data) => {
  const params = new URLSearchParams();
  Object.entries(data).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      for (const item of value) params.append(key, item);
    } else {
      params.append(key, value);
    }
  });
  return params;
};

export const cpfMask = createTextMask({
  pattern: "999.999.999-99",
  allowEmpty: false,
  guide: false,
});

export const cepMask = createTextMask({
  pattern: "99999-999",
  allowEmpty: false,
  guide: true,
});

export const composeValidators =
  (...validators) =>
  (value) =>
    validators.reduce(
      (error, validator) => error || validator(value),
      undefined,
    );

export const corrigeLinkAnexo = (url) => {
  if (
    window.location.href.startsWith("https://") &&
    url.startsWith("http://")
  ) {
    return url.replace(/^http:\/\//, "https://");
  }
  return url;
};

export const trocaAcentuadasPorSemAcento = (texto) =>
  texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export const exibirGA = () => {
  if (!["production"].includes(ENVIRONMENT)) return true;

  const dresPermitidas = [
    "CAPELA DO SOCORRO",
    "IPIRANGA",
    "PIRITUBA",
    "FREGUESIA/BRASILANDIA",
    "GUAIANASES",
    "SAO MATEUS",
    "SAO MIGUEL",
    "JACANA/TREMEMBE",
    "ITAQUERA",
    "PENHA",
    "BUTANTA",
    "CAMPO LIMPO",
    "SANTO AMARO",
  ];

  switch (localStorage.getItem("tipo_perfil")) {
    case `"diretoriaregional"`:
      return dresPermitidas.some((dre) =>
        localStorage.getItem("nome_instituicao").includes(dre),
      );
    case `"escola"`:
      return dresPermitidas.some((dre) =>
        localStorage.getItem("dre_nome").includes(dre),
      );
    case `"terceirizada"`:
      return (
        [
          `"Anga"`,
          `"ANGA"`,
          `"VERDE MAIS"`,
          `"Verde Mais"`,
          `"Apetece"`,
          `"APETECE"`,
        ].includes(localStorage.getItem("nome_instituicao")) ||
        JSON.parse(localStorage.getItem("lotes")).find((lote) =>
          dresPermitidas.some((dre) =>
            lote.diretoria_regional.nome.includes(dre),
          ),
        )
      );
    case `"gestao_alimentacao_terceirizada"`:
    case `"nutricao_manifestacao"`:
    case `"supervisao_nutricao"`:
    case `"medicao"`:
    case `"codae_gabinete"`:
    case `"usuario_relatorios"`:
      return true;
    default:
      return false;
  }
};

export const exibirModuloMedicaoInicial = () => {
  if (!["production"].includes(ENVIRONMENT))
    return (
      usuarioEhDRE() ||
      ((usuarioEhEscolaTerceirizada() ||
        usuarioEhEscolaTerceirizadaDiretor()) &&
        !usuarioEscolaEhGestaoDireta()) ||
      usuarioEhMedicao() ||
      usuarioEhCODAEGestaoAlimentacao() ||
      usuarioEhCODAENutriManifestacao() ||
      usuarioEhCODAEGabinete() ||
      usuarioEhDinutreDiretoria() ||
      usuarioEhEmpresaTerceirizada() ||
      usuarioEhCoordenadorNutriSupervisao() ||
      usuarioEhAdministradorNutriSupervisao()
    );

  switch (localStorage.getItem("tipo_perfil")) {
    case `"escola"`:
      return acessoModuloMedicaoInicialEscola();
    case `"diretoriaregional"`:
      return acessoModuloMedicaoInicialDRE();
    case `"medicao"`:
      return true;
    case `"nutricao_manifestacao"`:
    case `"gestao_alimentacao_terceirizada"`:
    case `"codae_gabinete"`:
      return acessoModuloMedicaoInicialCODAE();
    case `"pre_recebimento"`:
      return usuarioEhDinutreDiretoria();
    case `"supervisao_nutricao"`:
      return (
        usuarioEhCoordenadorNutriSupervisao() ||
        usuarioEhAdministradorNutriSupervisao()
      );
    case `"terceirizada"`:
      return (
        usuarioEhEmpresaTerceirizada() &&
        localStorage.getItem("possui_escolas_com_acesso_ao_medicao_inicial") ===
          "true"
      );
    default:
      return false;
  }
};

export const exibirModuloOcorrencias = () => {
  return (
    !["production"].includes(ENVIRONMENT) &&
    (usuarioEhCodaeDilog() ||
      usuarioEhDilogJuridico() ||
      usuarioEhDilogQualidade() ||
      usuarioEhDilog() ||
      usuarioEhCODAEGabinete() ||
      usuarioEhDilogDiretoria())
  );
};

export const justificativaAoNegarSolicitacao = (logs) => {
  let justificativa = null;
  if (logs.length) {
    justificativa = logs.filter((log) =>
      ["DRE não validou", "CODAE negou"].includes(log.status_evento_explicacao),
    );
    justificativa = justificativa.length
      ? justificativa[0].justificativa
      : null;
  }
  return justificativa;
};

export const justificativaAoAprovarSolicitacao = (logs) => {
  let justificativa = null;
  if (logs.length) {
    justificativa = logs.filter((log) =>
      ["CODAE autorizou"].includes(log.status_evento_explicacao),
    );
    justificativa = justificativa.length
      ? justificativa[0].justificativa
      : null;
  }
  return justificativa;
};

export const deepEqual = (x, y) => {
  const ok = Object.keys,
    tx = typeof x,
    ty = typeof y;
  return x && y && tx === "object" && tx === ty
    ? ok(x).length === ok(y).length &&
        ok(x).every((key) => deepEqual(x[key], y[key]))
    : x === y;
};

export const tipoStatus = () => {
  return [
    {
      status: "Ativo",
    },
    {
      status: "Inativo",
    },
  ];
};

export const statusProdutos = [
  {
    uuid: "Ativo",
    nome: "Ativo",
  },
  {
    uuid: "Inativo",
    nome: "Inativo",
  },
];

export const ehLaboratorioCredenciado = [
  {
    uuid: "true",
    nome: "Sim",
  },
  {
    uuid: "false",
    nome: "Não",
  },
];

export const fimDoCalendario = () => {
  return new Date().getMonth() === JS_DATE_DEZEMBRO
    ? new Date(new Date().getFullYear() + 1, 11, 31)
    : new Date(new Date().getFullYear(), 11, 31);
};

export const tiposAlimentacaoETEC = () => {
  return ["Lanche 4h", "Refeição", "Sobremesa", "Lanche Emergencial"];
};

export const formataMesNome = (mes) => {
  switch (mes) {
    case "01":
      return "Janeiro";
    case "02":
      return "Fevereiro";
    case "03":
      return "Março";
    case "04":
      return "Abril";
    case "05":
      return "Maio";
    case "06":
      return "Junho";
    case "07":
      return "Julho";
    case "08":
      return "Agosto";
    case "09":
      return "Setembro";
    case "10":
      return "Outubro";
    case "11":
      return "Novembro";
    case "12":
      return "Dezembro";
    default:
      return mes;
  }
};

export const ehFimDeSemana = (dateObj) => {
  return dateObj.getDay() % 6 === 0;
};

export const getISOLocalDatetimeString = () => {
  const date = new Date();
  const isoDateTime = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000,
  ).toISOString();
  return isoDateTime;
};

export const getAmanha = () => {
  const amanha = new Date();
  amanha.setDate(amanha.getDate() + 1);
  return amanha;
};

export const maxEntreDatas = (arrayDeDatas) => {
  return new Date(Math.max(...arrayDeDatas));
};

export const ordenarPorLogMaisRecente = (itemA, itemB) => {
  let dataA = parseDataHoraBrToMoment(itemA.log_mais_recente);
  let dataB = parseDataHoraBrToMoment(itemB.log_mais_recente);

  return comparaObjetosMoment(dataB, dataA);
};

export const getDDMMYYYfromDate = (date) => {
  return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${date.getFullYear()}`;
};

export const getYYYYMMDDfromDate = (date) => {
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
};

export const getLog = (logs, explicacao) => {
  return logs.find((log) => log.status_evento_explicacao === explicacao);
};

export const getUltimoLog = (logs, explicacao) => {
  return logs
    .filter((log) => log.status_evento_explicacao === explicacao)
    .pop();
};

export const capitalize = (str) => {
  const lower = str.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
};

export const ehFimDeSemanaUTC = (date) => {
  const dia = date.getUTCDay();
  return dia === 0 || dia === 6;
};
