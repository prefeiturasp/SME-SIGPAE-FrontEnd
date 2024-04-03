import { meusDados } from "services/perfil.service";
import {
  getEscolasSimplissimaComDRE,
  getEscolasSimplissimaComDREUnpaginated,
  getEscolasSimplissimaPorDiretoriaRegional,
  getEscolasTrecTotal,
} from "services/escola.service";
import {
  getDiretoriaregionalSimplissima,
  getDiretoriaregionalSimplissimaAxios,
} from "services/diretoriaRegional.service";

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

const formataUuidNomeComCodEolETipo = (results) =>
  results.map((r) => {
    return {
      label: r.nome,
      value: r.uuid,
      dre: r.diretoria_regional,
      codigo_eol: r.codigo_eol,
      tipo_unidade: r.tipo_unidade,
    };
  });

const formataNomeComCodEol = (results) =>
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
      const respostaDre = await getDiretoriaregionalSimplissimaAxios();
      const respostaEscola = await getEscolasSimplissimaComDREUnpaginated();
      setDiretoriasRegionais(
        formataUuidNomeParaMultiSelect(respostaDre.data.results)
      );
      setEscolas(formataUuidNomeParaMultiSelect(respostaEscola.data));
    }
  }
};

const escolaTodas = {
  label: "TODAS",
  value: "",
  dre: { uuid: "" },
  codigo_eol: "000000",
};
const nomeEscolaTodas = `${escolaTodas.codigo_eol} - ${escolaTodas.label}`;

export const formFiltrosObtemDreEEscolasControleRestos = async (
  setNomeEscolas,
  setEscolas,
  setDiretoriasRegionais,
  dadosUsuario,
  habilitarUETodas = false
) => {
  if (dadosUsuario.tipo_usuario === "escola") {
    let { uuid, nome, codigo_eol, tipo_unidade } =
      dadosUsuario.vinculo_atual.instituicao;
    const dre = dadosUsuario.vinculo_atual.instituicao.diretoria_regional;
    setNomeEscolas([
      ...(habilitarUETodas ? [nomeEscolaTodas] : []),
      `${codigo_eol} - ${nome}`,
    ]);
    setEscolas([
      ...(habilitarUETodas ? [escolaTodas] : []),
      {
        label: nome,
        value: uuid,
        dre: dre,
        codigo_eol,
        tipo_unidade,
      },
    ]);

    setDiretoriasRegionais([{ value: dre.uuid, label: dre.nome }]);
  } else {
    if (dadosUsuario.tipo_usuario === "diretoriaregional") {
      const { uuid, nome } = dadosUsuario.vinculo_atual.instituicao;
      const resposta2 = await getEscolasTrecTotal({ dre: uuid });
      setDiretoriasRegionais([{ value: uuid, label: nome }]);
      setNomeEscolas([
        ...(habilitarUETodas ? [nomeEscolaTodas] : []),
        ...formataNomeComCodEol(resposta2.data),
      ]);
      setEscolas([
        ...(habilitarUETodas ? [escolaTodas] : []),
        ...formataUuidNomeComCodEolETipo(resposta2.data),
      ]);
    } else {
      const respostaDre = await getDiretoriaregionalSimplissimaAxios();
      const respostaEscola = await getEscolasTrecTotal();
      setDiretoriasRegionais(
        formataUuidNomeComCodEolETipo(respostaDre.data.results)
      );
      setNomeEscolas([
        ...(habilitarUETodas ? [nomeEscolaTodas] : []),
        ...formataNomeComCodEol(respostaEscola.data),
      ]);
      setEscolas([
        ...(habilitarUETodas ? [escolaTodas] : []),
        ...formataUuidNomeComCodEolETipo(respostaEscola.data),
      ]);
    }
  }
};

export const formatarVinculosParaTiposAlimentacao = (resVinculos) => {
  const tipos = [];
  const uids = [];
  resVinculos.results.forEach((vinculo) => {
    vinculo.tipos_alimentacao.forEach((tipo) => {
      if (!uids.includes(tipo.uuid)) {
        tipos.push(tipo);
        uids.push(tipo.uuid);
      }
    });
  });
  return tipos;
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
