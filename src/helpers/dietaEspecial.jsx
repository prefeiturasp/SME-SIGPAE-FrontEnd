import moment from "moment";

import { meusDados } from "src/services/perfil.service";
import {
  getEscolasSimplissimaComDRE,
  getEscolasSimplissimaComDREUnpaginated,
  getEscolasSimplissimaPorDiretoriaRegional,
  getEscolasTercTotal,
} from "src/services/escola.service";
import { getDiretoriaregionalSimplissima } from "src/services/diretoriaRegional.service";

import { usuarioEhCODAEDietaEspecial } from "./utilities";

export const formFiltrosObtemDreEEscolas = async (
  setEscolas,
  setDiretoriasRegionais,
  change
) => {
  const dadosUsuario = await meusDados();
  if (dadosUsuario.tipo_usuario === "escola") {
    let { uuid, nome } = dadosUsuario.vinculo_atual.instituicao;
    const dre = dadosUsuario.vinculo_atual.instituicao.diretoria_regional;
    setEscolas([{ uuid, nome, diretoria_regional: dre }]);
    setDiretoriasRegionais([{ uuid: dre.uuid, nome: dre.nome }]);
    change("escola", uuid);
    change("dre", dre.uuid);
  } else {
    if (dadosUsuario.tipo_usuario === "diretoriaregional") {
      const resposta2 = await getEscolasSimplissimaComDRE();
      setEscolas(
        [{ uuid: "", nome: "Todas", diretoria_regional: { uuid: "" } }].concat(
          resposta2.results
        )
      );
      const { uuid, nome } = dadosUsuario.vinculo_atual.instituicao;
      setDiretoriasRegionais([{ uuid, nome }]);
      change("dre", uuid);
    } else {
      const resposta = await getDiretoriaregionalSimplissima();
      const resposta2 = await getEscolasSimplissimaComDRE();
      setDiretoriasRegionais(
        [{ uuid: "", nome: "Todas" }].concat(resposta.data.results)
      );
      setEscolas(
        [{ uuid: "", nome: "Todas", diretoria_regional: { uuid: "" } }].concat(
          resposta2.results
        )
      );
    }
  }
};

const formataUuidNomeParaMultiSelect = (results) =>
  results.map((r) => {
    return {
      label: r.nome,
      value: r.uuid,
      dre: r.diretoria_regional,
    };
  });

export const formataUuidNomeComCodEol = (results) =>
  results.map((r) => {
    return {
      label: r.nome,
      value: r.uuid,
      dre: r.diretoria_regional,
      codigo_eol: r.codigo_eol,
    };
  });

export const formataNomeComCodEol = (results) =>
  results.map((r) => `${r.codigo_eol} - ${r.nome}`);

export const formFiltrosObtemDreEEscolasNovo = async (
  setEscolas,
  setDiretoriasRegionais,
  dadosUsuario
) => {
  if (dadosUsuario.tipo_usuario === "escola") {
    let { uuid, nome } = dadosUsuario.vinculo_atual.instituicao;
    const dre = dadosUsuario.vinculo_atual.instituicao.diretoria_regional;
    setEscolas([{ value: uuid, label: nome, diretoria_regional: dre }]);
    setDiretoriasRegionais([{ value: dre.uuid, label: dre.nome }]);
  } else {
    if (dadosUsuario.tipo_usuario === "diretoriaregional") {
      const { uuid, nome } = dadosUsuario.vinculo_atual.instituicao;
      const resposta2 = await getEscolasSimplissimaPorDiretoriaRegional(uuid);
      setEscolas(formataUuidNomeParaMultiSelect(resposta2));
      setDiretoriasRegionais([{ value: uuid, label: nome }]);
    } else {
      const respostaDre = await getDiretoriaregionalSimplissima();
      const respostaEscola = await getEscolasSimplissimaComDREUnpaginated();
      setDiretoriasRegionais(
        formataUuidNomeParaMultiSelect(respostaDre.data.results)
      );
      setEscolas(formataUuidNomeParaMultiSelect(respostaEscola.data));
    }
  }
};

export const formFiltrosObtemDreEEscolasDietas = async (
  setNomeEscolas,
  setEscolas,
  setDiretoriasRegionais,
  dadosUsuario
) => {
  if (dadosUsuario.tipo_usuario === "escola") {
    let { uuid, nome, codigo_eol } = dadosUsuario.vinculo_atual.instituicao;
    const dre = dadosUsuario.vinculo_atual.instituicao.diretoria_regional;
    setNomeEscolas([`${codigo_eol} - ${nome}`]);
    setEscolas([
      {
        label: nome,
        value: uuid,
        dre: dre,
        codigo_eol: codigo_eol,
      },
    ]);

    setDiretoriasRegionais([{ value: dre.uuid, label: dre.nome }]);
  } else {
    if (dadosUsuario.tipo_usuario === "diretoriaregional") {
      const { uuid, nome } = dadosUsuario.vinculo_atual.instituicao;
      const resposta2 = await getEscolasTercTotal({ dre: uuid });
      setDiretoriasRegionais([{ value: uuid, label: nome }]);
      setNomeEscolas(formataNomeComCodEol(resposta2.data));
      setEscolas(formataUuidNomeComCodEol(resposta2.data));
    } else {
      const respostaDre = await getDiretoriaregionalSimplissima();
      setDiretoriasRegionais(
        formataUuidNomeComCodEol(respostaDre.data.results)
      );
    }
  }
};

export const getDadosIniciais = async (dadosUsuario) => {
  if (dadosUsuario.tipo_usuario === "escola") {
    let { uuid } = dadosUsuario.vinculo_atual.instituicao;
    const dre = dadosUsuario.vinculo_atual.instituicao.diretoria_regional;
    return {
      escola: [uuid],
      dre: [dre.uuid],
    };
  } else if (dadosUsuario.tipo_usuario === "diretoriaregional") {
    const { uuid } = dadosUsuario.vinculo_atual.instituicao;
    return {
      dre: [uuid],
    };
  }
  return {};
};

export const getCabecalhoPorFiltros = (filtros) => {
  if (filtros.data_inicial && filtros.data_final) {
    return "Veja os resultados para a busca ";
  } else if (filtros.data_inicial) {
    return `Veja os resultados a partir de "${moment(
      filtros.data_inicial,
      "DD/MM/YYYY"
    ).format("DD/MM/YYYY")}":`;
  } else if (filtros.data_final) {
    return `Veja os resultados até "${moment(
      filtros.data_final,
      "DD/MM/YYYY"
    ).format("DD/MM/YYYY")}":`;
  } else {
    return "Veja os resultados para a busca:";
  }
};

export const validateFormDreEscola = (formValues) => {
  const error = {};
  if (
    (formValues.dre === undefined || formValues.dre.length === 0) &&
    (formValues.escola === undefined || formValues.escola.length === 0)
  ) {
    error.dre = "Ao menos uma DRE ou uma Escola deve ser selecionada";
    error.escola = "Ao menos uma DRE ou uma Escola deve ser selecionada";
  }
  if (!formValues.somente_dietas_ativas) {
    if (!formValues.data_inicial) error.data_inicial = "Campo obrigatório";
    if (!formValues.data_final) error.data_final = "Campo obrigatório";
  }
  return error;
};

export const getStatusSolicitacoesVigentes = () => {
  return [
    "CODAE_AUTORIZADO",
    "TERCEIRIZADA_TOMOU_CIENCIA",
    "ESCOLA_SOLICITOU_INATIVACAO",
    "CODAE_NEGOU_INATIVACAO",
    "CODAE_AUTORIZOU_INATIVACAO",
    "TERCEIRIZADA_TOMOU_CIENCIA_INATIVACAO",
  ];
};

export const getStatusSolicitacoesInativas = () => {
  return [
    "CODAE_AUTORIZADO",
    "CODAE_NEGOU_PEDIDO",
    "ESCOLA_CANCELOU",
    "CODAE_AUTORIZOU_INATIVACAO",
    "TERCEIRIZADA_TOMOU_CIENCIA_INATIVACAO",
  ];
};

export const getNomeCardAguardandoAutorizacao = () => {
  return usuarioEhCODAEDietaEspecial() ? "Recebidas" : "Aguardando Autorização";
};
