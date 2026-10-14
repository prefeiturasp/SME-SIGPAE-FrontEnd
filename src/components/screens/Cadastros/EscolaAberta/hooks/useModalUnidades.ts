import { FormApi } from "final-form";
import { useEffect, useMemo, useState } from "react";
import {
  getTiposUnidadeEscolar,
  getVinculosTipoAlimentacaoPorTipoUnidadeEscolar,
} from "src/services/cadastroTipoAlimentacao.service";
import { getEscolasTercTotal } from "src/services/escola.service";
import { getLotesAsync } from "src/services/lote.service";

type Option = { uuid: string; nome: string };

type AlimentacaoState = {
  participantes: Option[];
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
    [lotes],
  );

  return { lotes, lotesOpts };
};

export const useTiposUnidade = (
  dreLoteValue: string,
  lotes: Option[],
  grupo?: string,
) => {
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
      const response = await getTiposUnidadeEscolar({
        dre: dreUuid,
        ...(grupo && { grupo }),
      });
      const formatados = (response?.data?.results || []).map((t) => ({
        nome: t.iniciais,
        uuid: t.uuid,
      }));
      setTipos(formatados);
    })();
  }, [dreLoteValue, lotes, grupo]);

  const tiposOpts = useMemo(
    () => [{ uuid: "", nome: "Selecione o Tipo de Unidade" }, ...tipos],
    [tipos],
  );

  const tiposMap = useMemo(() => {
    return tipos.reduce(
      (acc, tipo) => {
        acc[tipo.nome] = tipo;
        return acc;
      },
      {} as Record<string, Option>,
    );
  }, [tipos]);

  return { tipos, tiposOpts, tiposMap };
};

export const useAlimentacao = () => {
  const [state, setState] = useState<AlimentacaoState>({
    participantes: [],
  });

  const fetchTiposAlimentacao = async (tipoUnidadeUuid: string) => {
    if (!tipoUnidadeUuid) return [];

    const response =
      await getVinculosTipoAlimentacaoPorTipoUnidadeEscolar(tipoUnidadeUuid);

    const results = response?.results || [];
    const allTipos = results.flatMap((r) => r?.tipos_alimentacao ?? []);

    return mapToOptions(getUniqueItems(allTipos));
  };

  const loadAlimentacao = async (tipoUnidadeUuid: string) => {
    const participantes = await fetchTiposAlimentacao(tipoUnidadeUuid);
    setState({ participantes });
  };

  const reset = () => {
    setState({ participantes: [] });
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
        })),
      );
    }
  };

  const unidadesFiltradas = useMemo(() => {
    const adicionadas = form.getState().values?.unidades_participantes || [];
    const uuidsAdicionados = new Set(
      adicionadas.map((u) => u.unidadeEducacionalUuid),
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
