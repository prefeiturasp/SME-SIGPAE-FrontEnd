import { FormApi } from "final-form";
import { useEffect, useMemo, useState } from "react";
import {
  getTiposUnidadeEscolar,
  getVinculosTipoAlimentacaoPorTipoUnidadeEscolar,
} from "src/services/cadastroTipoAlimentacao.service";
import { getEscolasTercTotal } from "src/services/escola.service";
import { getLotesAsync } from "src/services/lote.service";

const PERIODO_INTEGRAL = "INTEGRAL";

type Option = { uuid: string; nome: string };

type AlimentacaoState = {
  inscritos: any[];
  inscritosInfantil: any[];
  colaboradores: any[];
};

const getUniqueItems = (items: any[]) => {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (!item?.nome || seen.has(item.nome)) return false;
    seen.add(item.nome);
    return true;
  });
};

const mapToOptions = (items: any[]) =>
  items.map((item) => ({ value: item.uuid, label: item.nome }));

export const extractDreUuid = (lote: any) =>
  lote?.dreUuid || lote?.dre_uuid || lote?.dre?.uuid || lote?.dre;

export const useLotes = () => {
  const [lotes, setLotes] = useState<any[]>([]);

  useEffect(() => {
    getLotesAsync(setLotes, "uuid", "nome");
  }, []);

  const lotesOpts = useMemo(
    () => [{ uuid: "", nome: "Selecione a DRE/Lote" }, ...lotes],
    [lotes]
  );

  return { lotes, lotesOpts };
};

export const useTiposUnidade = (dreLoteValue: string, lotes: Option[]) => {
  const [tipos, setTipos] = useState<Option[]>([]);

  useEffect(() => {
    if (!dreLoteValue) {
      setTipos([]);
      return;
    }

    const lote = lotes.find((l) => l.uuid === dreLoteValue);
    const dreUuid = extractDreUuid(lote);

    if (!dreUuid) return;

    (async () => {
      const response = await getTiposUnidadeEscolar({ dre: dreUuid });
      const formatados = (response?.data?.results || []).map((t) => ({
        nome: t.iniciais,
        uuid: t.uuid,
      }));
      setTipos(formatados);
    })();
  }, [dreLoteValue, lotes]);

  const tiposOpts = useMemo(
    () => [{ uuid: "", nome: "Selecione o Tipo de Unidade" }, ...tipos],
    [tipos]
  );

  const tiposMap = useMemo(() => {
    return tipos.reduce((acc, tipo) => {
      acc[tipo.nome] = tipo;
      return acc;
    }, {} as Record<string, Option>);
  }, [tipos]);

  return { tipos, tiposOpts, tiposMap };
};

export const useAlimentacao = () => {
  const [state, setState] = useState<AlimentacaoState>({
    inscritos: [],
    inscritosInfantil: [],
    colaboradores: [],
  });

  const fetchTiposAlimentacao = async (
    tipoUnidadeUuid: string,
    periodoFilter?: string
  ) => {
    if (!tipoUnidadeUuid) return [];

    const response = await getVinculosTipoAlimentacaoPorTipoUnidadeEscolar(
      tipoUnidadeUuid
    );

    let results = response?.results || [];

    if (periodoFilter) {
      const periodo = results.find(
        (r) => r?.periodo_escolar?.nome === periodoFilter
      );
      results = periodo ? [periodo] : [];
    }

    const allTipos = results.flatMap((r) => r?.tipos_alimentacao ?? []);
    const uniqueTipos = getUniqueItems(allTipos);

    return mapToOptions(uniqueTipos);
  };

  const loadAlimentacao = async (
    tipoUnidadeUuid: string,
    tiposMap: Record<string, Option>,
    isCemei: boolean
  ) => {
    const [inscritosBase, colaboradores, inscritosInfantil] = await Promise.all(
      [
        fetchTiposAlimentacao(tipoUnidadeUuid),
        fetchTiposAlimentacao(tiposMap["EMEF"]?.uuid, PERIODO_INTEGRAL),
        isCemei
          ? fetchTiposAlimentacao(tiposMap["EMEI"]?.uuid)
          : Promise.resolve([]),
      ]
    );

    let inscritos = [...inscritosBase];

    if (isCemei && tiposMap["CEI DIRET"]?.uuid) {
      const ceiTipos = await fetchTiposAlimentacao(tiposMap["CEI DIRET"]?.uuid);
      inscritos.push(...ceiTipos);

      const seen = new Set<string>();
      inscritos = inscritos.filter((item) => {
        if (seen.has(item.value)) return false;
        seen.add(item.value);
        return true;
      });
    }

    setState({ inscritos, inscritosInfantil, colaboradores });
  };

  const reset = () => {
    setState({ inscritos: [], inscritosInfantil: [], colaboradores: [] });
  };

  return { ...state, loadAlimentacao, reset };
};

export const useUnidadesEducacionais = (form: FormApi<any>) => {
  const [unidades, setUnidades] = useState([]);

  const fetchUnidades = async (dreUuid: string, tipoUnidadeUuid: string) => {
    if (!dreUuid || !tipoUnidadeUuid) {
      setUnidades([]);
      return;
    }

    const response = await getEscolasTercTotal({
      dre: dreUuid,
      tipo_unidade: tipoUnidadeUuid,
    });

    if (response.status === 200) {
      setUnidades(
        response.data.map((escola) => ({
          value: escola.uuid,
          label: escola.nome,
        }))
      );
    }
  };

  const unidadesFiltradas = useMemo(() => {
    const adicionadas = form.getState().values?.unidades_participantes || [];
    const uuidsAdicionados = new Set(
      adicionadas.map((u) => u.unidadeEducacionalUuid)
    );
    return unidades.filter((u: any) => !uuidsAdicionados.has(u.value));
  }, [unidades, form]);

  return {
    unidades,
    unidadesFiltradas,
    fetchUnidades,
    resetUnidades: () => setUnidades([]),
  };
};
