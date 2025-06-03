import { useEffect, useState } from "react";
import { getNumerosEditais } from "src/services/edital.service";
import { getLotesSimples } from "src/services/lote.service";
import { getTiposUnidadeEscolar } from "src/services/cadastroTipoAlimentacao.service";
import { getFaixasEtarias } from "src/services/faixaEtaria.service";
import ParametrizacaoFinanceiraService from "src/services/medicaoInicial/parametrizacao_financeira.service";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import { TIPOS_UNIDADES_GRUPOS } from "../../const";
export default ({
  setTiposAlimentacao,
  setGrupoSelecionado,
  setFaixasEtarias,
  setParametrizacao,
  uuidParametrizacao,
  form,
}) => {
  const [editais, setEditais] = useState([]);
  const [lotes, setLotes] = useState([]);
  const [tiposUnidades, setTiposUnidades] = useState([]);
  const [tiposUnidadesOpcoes, setTiposUnidadesOpcoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const getEditaisAsync = async () => {
    try {
      const { data } = await getNumerosEditais();
      setEditais(
        [{ uuid: "", nome: "Selecione um edital" }].concat(
          data.results.map((edital) => ({
            uuid: edital.uuid,
            nome: edital.numero,
          }))
        )
      );
    } catch (error) {
      toastError("Erro ao carregar editais. Tente novamente mais tarde.");
    }
  };
  const getLotesAsync = async () => {
    try {
      const { data } = await getLotesSimples();
      const lotes = data.results;
      const lotesOrdenados = lotes.sort((loteA, loteB) => {
        return loteA.diretoria_regional.nome < loteB.diretoria_regional.nome;
      });
      setLotes(
        [
          {
            uuid: "",
            nome: "Selecione um lote e uma DRE",
          },
        ].concat(
          lotesOrdenados.map((lote) => ({
            uuid: lote.uuid,
            nome: `${lote.nome} - ${lote.diretoria_regional.nome}`,
          }))
        )
      );
    } catch (error) {
      toastError("Erro ao carregar lotes. Tente novamente mais tarde.");
    }
  };
  const getTiposUnidadeEscolarAsync = async () => {
    const response = await getTiposUnidadeEscolar();
    if (response.status === 200) {
      setTiposUnidades(response.data.results);
      setTiposUnidadesOpcoes(
        [
          {
            uuid: "",
            nome: "Selecione o tipo de unidade",
          },
        ].concat(getGruposTiposUnidades(response.data.results))
      );
    } else {
      toastError(
        "Erro ao carregar tipos de unidades. Tente novamente mais tarde."
      );
    }
  };
  const getFaixasEtariasAsync = async () => {
    try {
      const { data } = await getFaixasEtarias();
      setFaixasEtarias(data.results);
    } catch (error) {
      toastError(
        "Erro ao carregar faixas etárias. Tente novamente mais tarde."
      );
    }
  };
  const requisicoesPreRender = async () => {
    setCarregando(true);
    Promise.all([
      getEditaisAsync(),
      getLotesAsync(),
      getTiposUnidadeEscolarAsync(),
      setFaixasEtarias && getFaixasEtariasAsync(),
      uuidParametrizacao && getParametrizacao(uuidParametrizacao),
    ]).then(() => {
      setCarregando(false);
    });
  };
  const getParametrizacao = async (uuid) => {
    try {
      const response =
        await ParametrizacaoFinanceiraService.getParametrizacaoFinanceira(uuid);
      const parametrizacao = {
        edital: response.edital.uuid,
        lote: response.lote.uuid,
        tipos_unidades: formataGrupoUnidades(response.tipos_unidades),
        legenda: response.legenda,
        tabelas: formataTabelaValores(response.tabelas),
      };
      setParametrizacao(parametrizacao);
    } catch (error) {
      toastError(
        "Erro ao carregar parametrização financeira. Tente novamente mais tarde."
      );
    }
  };
  const formataTabelaValores = (tabelas) => {
    const tabelasValores = Object.fromEntries(
      tabelas.map((tabela) => {
        const values = tabela.valores.reduce((acc, item) => {
          const key = item.faixa_etaria
            ? item.faixa_etaria.__str__
            : `${item.tipo_alimentacao?.nome}_${item.grupo}`;
          return {
            ...acc,
            [key]: {
              tipo_alimentacao: item.tipo_alimentacao?.uuid,
              faixa_etaria: item.faixa_etaria?.uuid,
              grupo: item.grupo,
              valor_unitario: item.valor_colunas.valor_unitario,
              valor_unitario_reajuste:
                item.valor_colunas.valor_unitario_reajuste,
              percentual_acrescimo: item.valor_colunas?.percentual_acrescimo,
              valor_unitario_total: item.valor_colunas?.valor_unitario_total,
            },
          };
        }, {});
        return [tabela.nome, values];
      })
    );
    return tabelasValores;
  };
  useEffect(() => {
    requisicoesPreRender();
  }, []);
  const initialTiposUnidades =
    uuidParametrizacao && form.getState().values?.tipos_unidades;
  useEffect(() => {
    if (initialTiposUnidades && uuidParametrizacao && !carregando) {
      onChangeTiposUnidades(initialTiposUnidades);
    }
  }, [initialTiposUnidades, uuidParametrizacao, carregando]);
  const getGruposTiposUnidades = (tiposUnidades) => {
    const getTipoUnidadeUUID = (tipoUnidade) =>
      tiposUnidades.find((t) => t.iniciais.toUpperCase() === tipoUnidade).uuid;
    return TIPOS_UNIDADES_GRUPOS.map((grupo) => {
      const uuid = grupo.map(getTipoUnidadeUUID).join(",");
      const nome = grupo.join(", ");
      return {
        uuid,
        nome,
      };
    });
  };
  const formataGrupoUnidades = (unidades) => {
    let unidadesUuid = "";
    TIPOS_UNIDADES_GRUPOS.forEach((grupo) => {
      grupo.forEach((tipoUnidade) => {
        const item = unidades.find((item) => item.iniciais === tipoUnidade);
        if (item) {
          unidadesUuid += item.uuid + ",";
        }
      });
    });
    return unidadesUuid.slice(0, -1);
  };
  const getGrupoSelecionado = (unidades) => {
    let grupoSelecionado = "";
    if (unidades) {
      const unidadesArray = unidades ? unidades.split(",") : [];
      for (let i = 0; i < TIPOS_UNIDADES_GRUPOS.length; i++) {
        const grupo = TIPOS_UNIDADES_GRUPOS[i];
        const todasUnidadesNoGrupo = unidadesArray
          .map(
            (unidade) => tiposUnidades.find((u) => u.uuid === unidade).iniciais
          )
          .every((unidade) => grupo.includes(unidade));
        if (todasUnidadesNoGrupo) {
          grupoSelecionado = `grupo_${i + 1}`;
          break;
        }
      }
    }
    setGrupoSelecionado(grupoSelecionado);
    return grupoSelecionado;
  };
  const onChangeTiposUnidades = (unidades) => {
    const tabelas = form.getState().values?.tabelas;
    if (tabelas && !uuidParametrizacao) {
      form.change("tabelas", {});
    }
    const grupoSelecionado = getGrupoSelecionado(unidades);
    if (grupoSelecionado === "grupo_1") {
      setTiposAlimentacao([]);
      return;
    }
    const unidadesArray = unidades ? unidades.split(",") : [];
    const tiposAlimentacaoUnidades = unidadesArray.reduce(
      (acc, tipoUnidade) => {
        acc.push(
          ...tiposUnidades
            .find((t) => t.uuid === tipoUnidade)
            .periodos_escolares.reduce((acc, periodoEscolar) => {
              acc.push(...periodoEscolar.tipos_alimentacao);
              return acc;
            }, [])
        );
        return acc;
      },
      []
    );
    const tiposAlimentacaoUnicos = {};
    tiposAlimentacaoUnidades.forEach((tipoAlimentacao) => {
      tiposAlimentacaoUnicos[tipoAlimentacao.uuid] = tipoAlimentacao.nome;
    });
    const tiposAlimentacao = Object.entries(tiposAlimentacaoUnicos).map(
      ([uuid, nome]) => ({
        uuid,
        nome,
        grupo: null,
      })
    );
    setTiposAlimentacao(tiposAlimentacao);
  };
  return {
    carregando,
    editais,
    lotes,
    tiposUnidadesOpcoes,
    onChangeTiposUnidades,
  };
};
