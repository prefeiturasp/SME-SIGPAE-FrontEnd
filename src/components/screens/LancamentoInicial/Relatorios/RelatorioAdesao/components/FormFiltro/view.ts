import { ChangeEvent, useContext, useEffect, useRef, useState } from "react";

import { MeusDadosContext } from "src/context/MeusDadosContext";

import {
  formatarOpcoesLote,
  usuarioEhDRE,
  usuarioEhEmpresa,
  usuarioEhEscolaTerceirizadaQualquerPerfil,
} from "src/helpers/utilities";

import { getLotesSimples } from "src/services/lote.service";
import {
  getEscolasParaFiltros,
  getEscolaPeriodosEscolares,
  getEscolaTiposAlimentacao,
  buscaPeriodosEscolares,
  getGrupoUnidadeEscolar,
} from "src/services/escola.service";
import { getTiposDeAlimentacao } from "src/services/cadastroTipoAlimentacao.service";
import { getMesesAnosSolicitacoesMedicaoinicial } from "src/services/medicaoInicial/dashboard.service";

import { MESES } from "src/constants/shared";

import {
  Args,
  SelectOption,
  MultiSelectOption,
  Option,
  GrupoUnidadeEscolar,
  TiposUnidadesTreeNode,
} from "./types";

export default ({ form, onChange }: Args) => {
  const { meusDados } = useContext(MeusDadosContext);
  const [mesesAnosOpcoes, setMesesAnosOpcoes] = useState<Array<SelectOption>>(
    [],
  );
  const [lotesOpcoes, setLotesOpcoes] = useState<Array<MultiSelectOption>>([]);
  const [tiposUnidadesTreeData, setTiposUnidadesTreeData] = useState<
    Array<TiposUnidadesTreeNode>
  >([]);
  const [unidadesEducacionaisOpcoes, setUnidadesEducacionaisOpcoes] = useState<
    Array<Option>
  >([]);
  const [periodosEscolaresOpcoes, setPeriodosEscolaresOpcoes] = useState<
    Array<MultiSelectOption>
  >([]);
  const [tiposAlimentacaoOpcoes, setTiposAlimentacaoOpcoes] = useState<
    Array<MultiSelectOption>
  >([]);

  const [lotes, setLotes] = useState([]);
  const [gruposUnidades, setGruposUnidades] = useState<
    Array<GrupoUnidadeEscolar>
  >([]);
  const excluirTipoUnidadeUuidsRef = useRef<Array<string>>([]);
  const [unidadesEducacionais, setUnidadesEducacionais] = useState([]);

  const [buscandoOpcoes, setBuscandoOpcoes] = useState({
    buscandoMesesAnos: false,
    buscandoLotes: false,
    buscandoTiposUnidades: false,
    buscandoUnidadesEducacionais: false,
    buscandoPeriodosEscolares: false,
    buscandoTiposAlimentacao: false,
  });

  useEffect(() => {
    setBuscandoOpcoes({
      buscandoMesesAnos: true,
      buscandoLotes: true,
      buscandoTiposUnidades: true,
      buscandoUnidadesEducacionais: true,
      buscandoPeriodosEscolares: true,
      buscandoTiposAlimentacao: true,
    });

    const uuidInstituicao = localStorage
      .getItem("uuid_instituicao")
      .replace(/"/g, "");
    const endpointPeriodosEscolares =
      usuarioEhEscolaTerceirizadaQualquerPerfil() && uuidInstituicao
        ? getEscolaPeriodosEscolares(uuidInstituicao)
        : buscaPeriodosEscolares();
    const endpointTiposDeAlimentacao =
      usuarioEhEscolaTerceirizadaQualquerPerfil() && uuidInstituicao
        ? getEscolaTiposAlimentacao(uuidInstituicao)
        : getTiposDeAlimentacao();

    Promise.all([
      getMesesAnosSolicitacoesMedicaoinicial({
        status: "MEDICAO_APROVADA_PELA_CODAE",
        eh_relatorio_adesao: true,
      }),
      getLotesSimples(
        usuarioEhEmpresa() ? { terceirizada__uuid: uuidInstituicao } : null,
      ),
      getGrupoUnidadeEscolar(),
      endpointPeriodosEscolares,
      endpointTiposDeAlimentacao,
    ]).then(
      async ([
        responseMesesAnos,
        responseLotes,
        responseGruposUnidades,
        responsePeriodos,
        responseAlimentacoes,
      ]) => {
        setMesesAnosOpcoes(
          formataMesesAnosOpcoes(responseMesesAnos.data.results),
        );

        const lotes = responseLotes.data.results;
        setLotes(lotes);
        setLotesOpcoes(formatarOpcoesLote(lotes));

        const gruposExcluidos = responseGruposUnidades.data.results.filter(
          (grupo) => grupo.nome === "Grupo 1" || grupo.nome === "Grupo 2",
        );
        const excluirTipoUnidadeUuids = gruposExcluidos.flatMap((grupo) =>
          grupo.tipos_unidades.map((tipo) => tipo.uuid),
        );
        excluirTipoUnidadeUuidsRef.current = excluirTipoUnidadeUuids;

        const gruposUnidades = responseGruposUnidades.data.results.filter(
          (grupo) => grupo.nome !== "Grupo 1" && grupo.nome !== "Grupo 2",
        );
        setGruposUnidades(gruposUnidades);
        setTiposUnidadesTreeData(
          formataTiposUnidadesTreeData(gruposUnidades, null),
        );

        await buscaEscolas([], []);

        const periodos = formataPeriodosEscolaresOpcoes(
          usuarioEhEscolaTerceirizadaQualquerPerfil() && uuidInstituicao
            ? responsePeriodos.data
            : responsePeriodos.data.results,
        );

        setPeriodosEscolaresOpcoes(periodos);

        const tipos = formataTiposAlimentacoesOpcoes(
          usuarioEhEscolaTerceirizadaQualquerPerfil() && uuidInstituicao
            ? responseAlimentacoes.data
            : responseAlimentacoes.data.results,
        );
        setTiposAlimentacaoOpcoes(tipos);

        form.subscribe(
          (values) => {
            if (!values.dirty) {
              let lotes_ = lotes;
              if (usuarioEhEscolaTerceirizadaQualquerPerfil()) {
                lotes_ = lotes?.filter(
                  (lote) =>
                    localStorage.getItem("escolaLoteUuid") === lote.uuid,
                );
              }
              setLotesOpcoes(formatarOpcoesLote(lotes_));
              buscaEscolas([], []);
              setPeriodosEscolaresOpcoes(periodos);
              setTiposAlimentacaoOpcoes(tipos);
              setTiposUnidadesTreeData(
                formataTiposUnidadesTreeData(gruposUnidades, null),
              );
            }
          },
          { dirty: true },
        );

        setBuscandoOpcoes({
          buscandoMesesAnos: false,
          buscandoLotes: false,
          buscandoTiposUnidades: false,
          buscandoUnidadesEducacionais: false,
          buscandoPeriodosEscolares: false,
          buscandoTiposAlimentacao: false,
        });
      },
    );
  }, []);

  useEffect(() => {
    if (usuarioEhDRE()) {
      const dreUuidMeusDados = meusDados?.vinculo_atual?.instituicao.uuid;
      if (dreUuidMeusDados && lotes && unidadesEducacionais) {
        setLotesOpcoes(
          formatarOpcoesLote(
            lotes?.filter(
              (lote) => lote.diretoria_regional.uuid === dreUuidMeusDados,
            ),
          ),
        );
        setUnidadesEducacionaisOpcoes(
          formataUnidadesEducacionaisOpcoes(
            unidadesEducacionais?.filter(
              (escola) => escola.diretoria_regional.uuid === dreUuidMeusDados,
            ),
          ),
        );
      }
    } else if (usuarioEhEscolaTerceirizadaQualquerPerfil()) {
      const escolaInstituicaoMeusDados = meusDados?.vinculo_atual?.instituicao;
      const dreUuidMeusDados =
        escolaInstituicaoMeusDados?.diretoria_regional?.uuid;
      const loteUuids =
        escolaInstituicaoMeusDados?.lotes?.map((lote) => lote.uuid) || [];
      const tipoUnidadeUuid = escolaInstituicaoMeusDados?.tipo_unidade_escolar;
      const escola = unidadesEducacionais.find(
        (escola) => escola.codigo_eol === escolaInstituicaoMeusDados.codigo_eol,
      );
      if (
        escolaInstituicaoMeusDados &&
        dreUuidMeusDados &&
        escola &&
        lotes &&
        unidadesEducacionais
      ) {
        const lotesDaEscola = lotes?.filter((lote) =>
          loteUuids.includes(lote.uuid),
        );
        setLotesOpcoes(formatarOpcoesLote(lotesDaEscola));
        setUnidadesEducacionaisOpcoes(
          formataUnidadesEducacionaisOpcoes(
            unidadesEducacionais?.filter(
              (escola) => escola.diretoria_regional.uuid === dreUuidMeusDados,
            ),
          ),
        );

        const grupoDaEscola = gruposUnidades.find((grupo) =>
          grupo.tipos_unidades.some((tipo) => tipo.uuid === tipoUnidadeUuid),
        );
        setTiposUnidadesTreeData(
          formataTiposUnidadesTreeData(
            gruposUnidades,
            grupoDaEscola ? [grupoDaEscola] : null,
          ),
        );

        const labelEscola = `${escola?.codigo_eol} - ${escola?.nome} - ${
          escola?.lote ? escola?.lote?.nome : ""
        }`;
        form.change("unidade_educacional", [escola.uuid]);
        form.change("lotes", loteUuids);
        form.change("tipos_unidades", tipoUnidadeUuid ? [tipoUnidadeUuid] : []);

        onChange({
          lotes: formatarOpcoesLote(lotesDaEscola).map((lote) => lote.label),
          tipos_unidades:
            escolaInstituicaoMeusDados?.tipo_unidade_escolar_iniciais
              ? [escolaInstituicaoMeusDados.tipo_unidade_escolar_iniciais]
              : [],
          unidade_educacional: [labelEscola],
        });

        localStorage.setItem("labelEscolaLote", labelEscola);
        localStorage.setItem("escolaLoteUuid", escola?.lote?.uuid);
      }
    }
  }, [meusDados, lotes, unidadesEducacionais, gruposUnidades]);

  const formataMesesAnosOpcoes = (mesesAnos) => {
    return [{ nome: "Selecione o mês de referência", uuid: "" }].concat(
      mesesAnos.map((mesAno) => ({
        nome: `${MESES[parseInt(mesAno.mes) - 1]} - ${mesAno.ano}`,
        uuid: `${mesAno.mes}_${mesAno.ano}`,
      })),
    );
  };

  const formataPeriodosEscolaresOpcoes = (periodos) => {
    return periodos.map((periodo) => ({
      label: periodo.nome,
      value: periodo.uuid,
    }));
  };

  const formataTiposAlimentacoesOpcoes = (tipos) => {
    return tipos.map((alimentacao) => ({
      label: alimentacao.nome,
      value: alimentacao.uuid,
    }));
  };

  const formataTiposUnidadesTreeData = (
    grupos: Array<GrupoUnidadeEscolar>,
    gruposSelecionados: Array<GrupoUnidadeEscolar> | null,
  ): Array<TiposUnidadesTreeNode> => {
    const uuidsSelecionados = gruposSelecionados
      ? gruposSelecionados.map((grupo) => grupo.uuid)
      : [];

    return grupos.map((grupo) => {
      const bloqueado =
        gruposSelecionados && !uuidsSelecionados.includes(grupo.uuid);
      const iniciais = grupo.tipos_unidades
        .map((tipo) => tipo.iniciais)
        .join(", ");

      return {
        title: `${grupo.nome} (${iniciais})`,
        value: grupo.uuid,
        key: grupo.uuid,
        disabled: bloqueado,
        children: grupo.tipos_unidades.map((tipo) => ({
          title: tipo.iniciais,
          value: tipo.uuid,
          key: tipo.uuid,
          disabled: bloqueado,
        })),
      };
    });
  };

  const buscaEscolas = async (
    lotesSelecionados: Array<string>,
    tiposUnidadesSelecionadas: Array<string>,
  ) => {
    setBuscandoOpcoes((prev) => ({
      ...prev,
      buscandoUnidadesEducacionais: true,
    }));

    const params: Record<string, string | Array<string>> = {
      excluir_tipo_unidade__uuid: excluirTipoUnidadeUuidsRef.current,
      tipo_gestao__nome: "TERC TOTAL",
    };
    if (lotesSelecionados?.length) {
      params["lote__uuid"] = lotesSelecionados;
    }
    if (tiposUnidadesSelecionadas?.length) {
      params["tipo_unidade__uuid"] = tiposUnidadesSelecionadas;
    }

    const response = await getEscolasParaFiltros(params);

    const escolas = response.data;

    setUnidadesEducacionais(escolas);
    setUnidadesEducacionaisOpcoes(formataUnidadesEducacionaisOpcoes(escolas));
    setBuscandoOpcoes((prev) => ({
      ...prev,
      buscandoUnidadesEducacionais: false,
    }));

    return escolas;
  };

  const onChangeMesAno = (e: ChangeEvent<HTMLInputElement>) => {
    const mesAno = e.target.value;
    const ehEscola = usuarioEhEscolaTerceirizadaQualquerPerfil();

    limpaCampo("periodo_lancamento_de");
    limpaCampo("periodo_lancamento_ate");
    limpaCampo("periodos");
    limpaCampo("tipos_alimentacao");

    if (!ehEscola) {
      limpaCampo("lotes");
      limpaCampo("tipos_unidades");
      limpaCampo("unidade_educacional");
      setTiposUnidadesTreeData(
        formataTiposUnidadesTreeData(gruposUnidades, null),
      );
      buscaEscolas([], []);
    }

    onChange({
      mes: mesAno
        ? mesesAnosOpcoes
            .find((m) => m.uuid === e.target.value)
            .nome.replace(/\s*-\s*/g, " ")
            .toUpperCase()
        : undefined,
      periodos: undefined,
      tipos_alimentacao: undefined,
      periodo_lancamento_de: undefined,
      periodo_lancamento_ate: undefined,
      ...(ehEscola
        ? {}
        : {
            lotes: undefined,
            tipos_unidades: undefined,
            unidade_educacional: undefined,
          }),
    });
  };

  const formataLabelTiposUnidades = (
    grupos: Array<GrupoUnidadeEscolar>,
    tiposUnidadesSelecionadas: Array<string>,
  ): Array<string> => {
    return grupos
      .map((grupo) => {
        const tiposDoGrupo = grupo.tipos_unidades;
        const uuidsDoGrupo = tiposDoGrupo.map((tipo) => tipo.uuid);
        const selecionadosNoGrupo = uuidsDoGrupo.filter((uuid) =>
          tiposUnidadesSelecionadas.includes(uuid),
        );
        if (selecionadosNoGrupo.length === 0) return null;
        if (selecionadosNoGrupo.length === uuidsDoGrupo.length) {
          return `${grupo.nome} (${tiposDoGrupo
            .map((tipo) => tipo.iniciais)
            .join(", ")})`;
        }
        return tiposDoGrupo
          .filter((tipo) => tiposUnidadesSelecionadas.includes(tipo.uuid))
          .map((tipo) => tipo.iniciais)
          .join(", ");
      })
      .filter((label): label is string => Boolean(label));
  };

  const onChangeTiposUnidades = (tiposUnidadesSelecionadas: Array<string>) => {
    const gruposSelecionados = gruposUnidades.filter((grupo) =>
      grupo.tipos_unidades.some((tipo) =>
        tiposUnidadesSelecionadas.includes(tipo.uuid),
      ),
    );

    setTiposUnidadesTreeData(
      formataTiposUnidadesTreeData(
        gruposUnidades,
        gruposSelecionados.length > 0 ? gruposSelecionados : null,
      ),
    );

    onChange({
      tipos_unidades: formataLabelTiposUnidades(
        gruposUnidades,
        tiposUnidadesSelecionadas,
      ),
    });

    buscaEscolas(form.getState().values.lotes || [], tiposUnidadesSelecionadas);
  };

  const onChangeLotes = (lotes: Array<string>) => {
    if (!usuarioEhEscolaTerceirizadaQualquerPerfil()) {
      limpaCampo("unidade_educacional");
    }

    onChange({
      lotes: lotesOpcoes
        .filter((l) => lotes.includes(l.value.toString()))
        .map((l) => l.label),
      unidade_educacional: undefined,
    });

    buscaEscolas(lotes, form.getState().values.tipos_unidades || []);
  };

  const onChangeUnidadesEducacionais = (uuids: Array<string>) => {
    onChange({
      unidade_educacional: unidadesEducacionaisOpcoes
        .filter((opcao) => uuids.includes(opcao.value.toString()))
        .map((opcao) => opcao.label),
    });
  };

  const onChangePeriodoLancamentoDe = (periodoLancamentoDe: string) => {
    onChange({
      periodo_lancamento_de: periodoLancamentoDe,
    });
  };

  const onChangePeriodoLancamentoAte = (periodoLancamentoAte: string) => {
    onChange({
      periodo_lancamento_ate: periodoLancamentoAte,
    });
  };

  const formataUnidadesEducacionaisOpcoes = (escolas): Array<Option> => {
    return escolas.map((escola): Option => {
      const label = `${escola.codigo_eol} - ${escola.nome} - ${
        escola.lote ? escola.lote.nome : ""
      }`;

      return { label, value: escola.uuid };
    });
  };

  const validaMesAno = (mesAno: string) => {
    if (!mesAno) return;

    const hoje = new Date();
    let [mesSelecionado, anoSelecionado] = mesAno.split("_");

    return new Date(Number(anoSelecionado), Number(mesSelecionado) - 1, 1) >
      hoje
      ? "Não é possível exportar o relatório com mês posterior ao atual"
      : "";
  };

  const limpaCampo = (nomeCampo: string) => {
    form.resetFieldState(nomeCampo);
    form.change(nomeCampo, undefined);
  };

  return {
    mesesAnosOpcoes,
    lotesOpcoes,
    tiposUnidadesTreeData,
    unidadesEducacionaisOpcoes,
    periodosEscolaresOpcoes,
    tiposAlimentacaoOpcoes,
    onChangeMesAno,
    onChangeLotes,
    onChangeTiposUnidades,
    onChangeUnidadesEducacionais,
    buscandoOpcoes,
    validaMesAno,
    onChangePeriodoLancamentoDe,
    onChangePeriodoLancamentoAte,
  };
};
