import HTTP_STATUS from "http-status-codes";
import { useEffect, useMemo, useState } from "react";

import { toastError } from "src/components/Shareable/Toast/dialogs";
import { MESES } from "src/constants/shared";
import {
  formatarOpcoesDRE,
  formatarOpcoesLote,
  usuarioEhDRE,
  usuarioEhEmpresaTerceirizada,
} from "src/helpers/utilities";
import { getTiposDeAlimentacao } from "src/services/cadastroTipoAlimentacao.service";
import { getDiretoriaregionalSimplissima } from "src/services/diretoriaRegional.service";
import {
  getEscolasParaFiltros,
  getGrupoUnidadeEscolar,
  getSubprefeituras,
} from "src/services/escola.service";
import { getFaixasEtarias } from "src/services/faixaEtaria.service";
import { getLotesSimples } from "src/services/lote.service";
import { getMesesAnosSolicitacoesMedicaoinicial } from "src/services/medicaoInicial/dashboard.service";

import { IFiltros } from "../../types";
import {
  dataDentroDoMes,
  filtraSelecionadosDisponiveis,
  getGrupoSelecionado,
  GRUPO_TIPO_ALIMENTACAO_BLOQUEADO,
  GRUPOS_COM_FAIXA_ETARIA,
  PREFIXO_GRUPO_TREE,
} from "./helpers";
import {
  Args,
  DiretoriaRegional,
  Escola,
  GrupoUnidadeEscolar,
  Lote,
  MultiSelectOption,
  SelectOption,
  TiposUnidadesTreeNode,
} from "./types";

const CAMPOS_PERIODO: Array<keyof IFiltros> = [
  "periodo_lancamento_de",
  "periodo_lancamento_ate",
];

const CAMPOS_DEPENDENTES_DA_DRE: Array<keyof IFiltros> = [
  "lotes",
  "subprefeituras",
  "tipos_unidades",
  "unidades_educacionais",
  "tipos_alimentacao",
  "faixas_etarias",
];

const ehRespostaOk = (response) => response?.status === HTTP_STATUS.OK;

const getUuidInstituicao = () =>
  (localStorage.getItem("uuid_instituicao") || "").replace(/"/g, "");

const formataMesesAnosOpcoes = (mesesAnos): Array<SelectOption> =>
  [{ nome: "Selecione o Mês de Referência", uuid: "" }].concat(
    mesesAnos.map((mesAno) => ({
      nome: `${MESES[parseInt(mesAno.mes) - 1]} - ${mesAno.ano}`,
      uuid: `${mesAno.mes}_${mesAno.ano}`,
    })),
  );

const filtraDresAcessiveis = (
  dres: Array<DiretoriaRegional>,
  lotes: Array<Lote>,
): Array<DiretoriaRegional> => {
  if (usuarioEhDRE()) {
    const uuidInstituicao = getUuidInstituicao();
    return dres.filter((dre) => dre.uuid === uuidInstituicao);
  }
  if (usuarioEhEmpresaTerceirizada()) {
    const uuidsDresDosLotes = lotes.map((lote) => lote.diretoria_regional.uuid);
    return dres.filter((dre) => uuidsDresDosLotes.includes(dre.uuid));
  }
  return dres;
};

const getParamsLotes = () => {
  if (usuarioEhDRE()) {
    return { diretoria_regional__uuid: getUuidInstituicao() };
  }
  if (usuarioEhEmpresaTerceirizada()) {
    return { terceirizada__uuid: getUuidInstituicao() };
  }
  return null;
};

const formataUnidadesEducacionaisOpcoes = (
  escolas: Array<Escola>,
): Array<MultiSelectOption> =>
  escolas.map((escola) => ({
    label: `${escola.codigo_eol} - ${escola.nome}${
      escola.lote ? ` - ${escola.lote.nome}` : ""
    }`,
    value: escola.uuid,
  }));

export default ({ form, values }: Args) => {
  const [mesesAnosOpcoes, setMesesAnosOpcoes] = useState<Array<SelectOption>>(
    [],
  );
  const [dres, setDres] = useState<Array<DiretoriaRegional>>([]);
  const [lotes, setLotes] = useState<Array<Lote>>([]);
  const [grupos, setGrupos] = useState<Array<GrupoUnidadeEscolar>>([]);
  const [tiposAlimentacaoOpcoes, setTiposAlimentacaoOpcoes] = useState<
    Array<MultiSelectOption>
  >([]);
  const [subprefeiturasOpcoes, setSubprefeiturasOpcoes] = useState<
    Array<MultiSelectOption>
  >([]);
  const [escolas, setEscolas] = useState<Array<Escola>>([]);
  const [faixasEtariasOpcoes, setFaixasEtariasOpcoes] = useState<
    Array<MultiSelectOption>
  >([]);
  const [faixasEtariasCarregadas, setFaixasEtariasCarregadas] = useState(false);

  const [carregandoOpcoesIniciais, setCarregandoOpcoesIniciais] =
    useState(true);
  const [carregandoSubprefeituras, setCarregandoSubprefeituras] =
    useState(false);
  const [carregandoUnidades, setCarregandoUnidades] = useState(false);
  const [carregandoFaixasEtarias, setCarregandoFaixasEtarias] = useState(false);

  const dresSelecionadas = values.dres || [];
  const lotesSelecionados = values.lotes || [];
  const subprefeiturasSelecionadas = values.subprefeituras || [];
  const tiposUnidadesSelecionados = values.tipos_unidades || [];

  const possuiDre = dresSelecionadas.length > 0;
  const possuiLote = lotesSelecionados.length > 0;
  const chaveDres = dresSelecionadas.join(",");

  const lotesDisponiveis = useMemo(
    () =>
      lotes.filter((lote) =>
        dresSelecionadas.includes(lote.diretoria_regional.uuid),
      ),
    [lotes, chaveDres],
  );

  const grupoSelecionado = getGrupoSelecionado(
    grupos,
    tiposUnidadesSelecionados,
  );
  const tipoAlimentacaoBloqueado =
    grupoSelecionado?.nome === GRUPO_TIPO_ALIMENTACAO_BLOQUEADO;
  const faixaEtariaHabilitada =
    possuiDre && GRUPOS_COM_FAIXA_ETARIA.includes(grupoSelecionado?.nome);

  const tiposUnidadesTreeData = useMemo<Array<TiposUnidadesTreeNode>>(
    () =>
      grupos.map((grupo) => {
        const bloqueado = Boolean(
          grupoSelecionado && grupoSelecionado.uuid !== grupo.uuid,
        );
        const iniciais = grupo.tipos_unidades
          .map((tipo) => tipo.iniciais)
          .join(", ");
        return {
          title: `${grupo.nome} (${iniciais})`,
          value: `${PREFIXO_GRUPO_TREE}${grupo.uuid}`,
          key: `${PREFIXO_GRUPO_TREE}${grupo.uuid}`,
          disabled: bloqueado,
          children: grupo.tipos_unidades.map((tipo) => ({
            title: tipo.iniciais,
            value: tipo.uuid,
            key: tipo.uuid,
            disabled: bloqueado,
          })),
        };
      }),
    [grupos, grupoSelecionado?.uuid],
  );

  const limpaCampo = (campo: keyof IFiltros) => {
    const valor = form.getState().values[campo];
    if (valor === undefined || (Array.isArray(valor) && !valor.length)) {
      return;
    }
    form.change(campo, undefined);
  };

  const mantemSomenteDisponiveis = (
    campo: keyof IFiltros,
    disponiveis: Array<string>,
  ) => {
    const selecionados = form.getState().values[campo] || [];
    const validos = filtraSelecionadosDisponiveis(selecionados, disponiveis);
    if (validos.length !== selecionados.length) {
      form.change(campo, validos.length ? validos : undefined);
    }
  };

  useEffect(() => {
    let ativo = true;

    Promise.all([
      getMesesAnosSolicitacoesMedicaoinicial(),
      getDiretoriaregionalSimplissima(),
      getLotesSimples(getParamsLotes()),
      getGrupoUnidadeEscolar(),
      getTiposDeAlimentacao(),
    ]).then(
      ([
        responseMesesAnos,
        responseDres,
        responseLotes,
        responseGrupos,
        responseTiposAlimentacao,
      ]) => {
        if (!ativo) return;

        if (ehRespostaOk(responseMesesAnos)) {
          setMesesAnosOpcoes(
            formataMesesAnosOpcoes(responseMesesAnos.data.results),
          );
        } else {
          toastError("Erro ao carregar os meses de referência.");
        }

        const lotes_ = ehRespostaOk(responseLotes)
          ? responseLotes.data.results
          : [];
        if (ehRespostaOk(responseLotes)) {
          setLotes(lotes_);
        } else {
          toastError("Erro ao carregar os lotes.");
        }

        if (ehRespostaOk(responseDres)) {
          setDres(filtraDresAcessiveis(responseDres.data.results, lotes_));
        } else {
          toastError("Erro ao carregar as DREs.");
        }

        if (ehRespostaOk(responseGrupos)) {
          setGrupos(responseGrupos.data.results);
        } else {
          toastError("Erro ao carregar os tipos de unidade.");
        }

        if (ehRespostaOk(responseTiposAlimentacao)) {
          setTiposAlimentacaoOpcoes(
            responseTiposAlimentacao.data.results.map((tipo) => ({
              label: tipo.nome,
              value: tipo.uuid,
            })),
          );
        } else {
          toastError("Erro ao carregar os tipos de alimentação.");
        }

        setCarregandoOpcoesIniciais(false);
      },
    );

    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    CAMPOS_PERIODO.forEach((campo) => {
      const data = form.getState().values[campo];
      if (data && (!values.mes || !dataDentroDoMes(data, values.mes))) {
        limpaCampo(campo);
      }
    });
  }, [values.mes]);

  useEffect(() => {
    if (possuiDre) return;
    CAMPOS_DEPENDENTES_DA_DRE.forEach((campo) => limpaCampo(campo));
  }, [possuiDre]);

  useEffect(() => {
    if (carregandoOpcoesIniciais) return;
    mantemSomenteDisponiveis(
      "lotes",
      lotesDisponiveis.map((lote) => lote.uuid),
    );
  }, [lotesDisponiveis, carregandoOpcoesIniciais]);

  useEffect(() => {
    if (possuiLote) limpaCampo("subprefeituras");
  }, [possuiLote]);

  useEffect(() => {
    if (tipoAlimentacaoBloqueado) limpaCampo("tipos_alimentacao");
  }, [tipoAlimentacaoBloqueado]);

  useEffect(() => {
    if (!faixaEtariaHabilitada) limpaCampo("faixas_etarias");
  }, [faixaEtariaHabilitada]);

  useEffect(() => {
    if (!possuiDre) {
      setSubprefeiturasOpcoes([]);
      setCarregandoSubprefeituras(false);
      return;
    }

    let ativo = true;
    setCarregandoSubprefeituras(true);

    getSubprefeituras({ diretoria_regional__uuid: dresSelecionadas }).then(
      (response) => {
        if (!ativo) return;
        if (ehRespostaOk(response)) {
          const subprefeituras = response.data.results;
          setSubprefeiturasOpcoes(
            subprefeituras.map((subprefeitura) => ({
              label: subprefeitura.nome,
              value: subprefeitura.uuid,
            })),
          );
          mantemSomenteDisponiveis(
            "subprefeituras",
            subprefeituras.map((subprefeitura) => subprefeitura.uuid),
          );
        } else {
          setSubprefeiturasOpcoes([]);
          limpaCampo("subprefeituras");
          toastError("Erro ao carregar as subprefeituras.");
        }
        setCarregandoSubprefeituras(false);
      },
    );

    return () => {
      ativo = false;
    };
  }, [chaveDres]);

  const lotesFiltroUnidades = possuiLote
    ? lotesSelecionados
    : usuarioEhEmpresaTerceirizada()
      ? lotesDisponiveis.map((lote) => lote.uuid)
      : [];
  const subprefeiturasFiltroUnidades = possuiLote
    ? []
    : subprefeiturasSelecionadas;
  const chaveFiltroUnidades = JSON.stringify([
    dresSelecionadas,
    lotesFiltroUnidades,
    subprefeiturasFiltroUnidades,
    tiposUnidadesSelecionados,
  ]);

  useEffect(() => {
    if (!possuiDre) {
      setEscolas([]);
      setCarregandoUnidades(false);
      return;
    }

    let ativo = true;
    setCarregandoUnidades(true);

    const params: Record<string, string | Array<string>> = {
      tipo_gestao__nome: "TERC TOTAL",
      diretoria_regional__uuid: dresSelecionadas,
    };
    if (lotesFiltroUnidades.length) {
      params["lote__uuid"] = lotesFiltroUnidades;
    }
    if (subprefeiturasFiltroUnidades.length) {
      params["subprefeitura__uuid"] = subprefeiturasFiltroUnidades;
    }
    if (tiposUnidadesSelecionados.length) {
      params["tipo_unidade__uuid"] = tiposUnidadesSelecionados;
    }

    getEscolasParaFiltros(params).then((response) => {
      if (!ativo) return;
      if (ehRespostaOk(response)) {
        const escolas_: Array<Escola> = response.data.filter((escola) =>
          dresSelecionadas.includes(escola.diretoria_regional?.uuid),
        );
        setEscolas(escolas_);
        mantemSomenteDisponiveis(
          "unidades_educacionais",
          escolas_.map((escola) => escola.uuid),
        );
      } else {
        setEscolas([]);
        limpaCampo("unidades_educacionais");
        toastError("Erro ao carregar as unidades educacionais.");
      }
      setCarregandoUnidades(false);
    });

    return () => {
      ativo = false;
    };
  }, [chaveFiltroUnidades]);

  useEffect(() => {
    if (!faixaEtariaHabilitada || faixasEtariasCarregadas) return;

    let ativo = true;
    setCarregandoFaixasEtarias(true);

    getFaixasEtarias().then((response) => {
      if (!ativo) return;
      if (ehRespostaOk(response)) {
        setFaixasEtariasOpcoes(
          response.data.results.map((faixa) => ({
            label: faixa.__str__,
            value: faixa.uuid,
          })),
        );
        setFaixasEtariasCarregadas(true);
      } else {
        toastError("Erro ao carregar as faixas etárias.");
      }
      setCarregandoFaixasEtarias(false);
    });

    return () => {
      ativo = false;
      setCarregandoFaixasEtarias(false);
    };
  }, [faixaEtariaHabilitada]);

  const dresOpcoes = useMemo(() => formatarOpcoesDRE(dres), [dres]);
  const lotesOpcoes = useMemo(
    () => formatarOpcoesLote(lotesDisponiveis),
    [lotesDisponiveis],
  );
  const unidadesEducacionaisOpcoes = useMemo(
    () => formataUnidadesEducacionaisOpcoes(escolas),
    [escolas],
  );

  return {
    mesesAnosOpcoes,
    dresOpcoes,
    lotesOpcoes,
    subprefeiturasOpcoes,
    tiposUnidadesTreeData,
    unidadesEducacionaisOpcoes,
    tiposAlimentacaoOpcoes,
    faixasEtariasOpcoes,
    carregandoOpcoesIniciais,
    carregandoSubprefeituras,
    carregandoUnidades,
    carregandoFaixasEtarias,
    possuiDre,
    possuiLote,
    tipoAlimentacaoBloqueado,
    faixaEtariaHabilitada,
  };
};
