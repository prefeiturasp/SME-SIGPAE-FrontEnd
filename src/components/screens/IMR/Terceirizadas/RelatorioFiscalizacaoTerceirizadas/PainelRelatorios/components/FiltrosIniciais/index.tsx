import { ChangeEvent, useEffect, useState } from "react";
import HTTP_STATUS from "http-status-codes";
import Select from "src/components/Shareable/Select";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import {
  FiltrosRelatoriosVisitasInterface,
  MesAnoRelatorioSupervisaoInterface,
} from "src/interfaces/imr.interface";
import { ResponseDiretoriasRegionaisSimplissimaInterface } from "src/interfaces/responses.interface";
import { getDiretoriaregionalSimplissima } from "src/services/diretoriaRegional.service";
import { obterMesesAnosSupervisao } from "src/services/imr/painelGerencial";
import { MESES } from "src/constants/shared";

interface Propriedades {
  filtros: FiltrosRelatoriosVisitasInterface;
  aoAlterarFiltros: (_filtros: FiltrosRelatoriosVisitasInterface) => void;
}

export const FiltrosIniciais = ({
  filtros,
  aoAlterarFiltros,
}: Propriedades) => {
  const [diretoriasRegionais, setDiretoriasRegionais] = useState<
    { nome: string; uuid: string }[]
  >([]);
  const [carregandoDiretorias, setCarregandoDiretorias] = useState(true);
  const [mesesAnos, setMesesAnos] = useState<
    MesAnoRelatorioSupervisaoInterface[]
  >([]);
  const [carregandoMeses, setCarregandoMeses] = useState(false);

  useEffect(() => {
    let ativo = true;

    const buscarDiretorias = async () => {
      try {
        const resposta: ResponseDiretoriasRegionaisSimplissimaInterface =
          await getDiretoriaregionalSimplissima();

        if (!ativo) return;

        if (resposta?.status === HTTP_STATUS.OK) {
          setDiretoriasRegionais(resposta.data.results);
        } else {
          toastError(
            "Não foi possível carregar as Diretorias Regionais de Educação.",
          );
        }
      } catch {
        if (ativo) {
          toastError(
            "Não foi possível carregar as Diretorias Regionais de Educação.",
          );
        }
      } finally {
        if (ativo) setCarregandoDiretorias(false);
      }
    };

    buscarDiretorias();

    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    let ativo = true;
    const diretoriaRegional = filtros.diretoria_regional;
    setMesesAnos([]);

    if (!diretoriaRegional) {
      setCarregandoMeses(false);
      return;
    }

    const buscarMesesAnos = async () => {
      setCarregandoMeses(true);
      try {
        const resposta = await obterMesesAnosSupervisao(diretoriaRegional);
        if (!ativo) return;

        if (resposta.status === HTTP_STATUS.OK) {
          setMesesAnos(resposta.data.results);
        } else {
          toastError("Não foi possível carregar os meses de referência.");
        }
      } catch {
        if (ativo) {
          toastError("Não foi possível carregar os meses de referência.");
        }
      } finally {
        if (ativo) setCarregandoMeses(false);
      }
    };

    buscarMesesAnos();

    return () => {
      ativo = false;
    };
  }, [filtros.diretoria_regional]);

  const alterarDiretoria = (evento: ChangeEvent<HTMLSelectElement>) => {
    aoAlterarFiltros({
      ...filtros,
      diretoria_regional: evento.target.value,
      mes: undefined,
      ano: undefined,
    });
  };

  const alterarMesReferencia = (evento: ChangeEvent<HTMLSelectElement>) => {
    const [mes, ano] = evento.target.value.split("/");

    aoAlterarFiltros({
      ...filtros,
      mes: mes ? Number(mes) : undefined,
      ano: ano ? Number(ano) : undefined,
    });
  };

  const mesReferencia =
    filtros.mes && filtros.ano
      ? `${String(filtros.mes).padStart(2, "0")}/${filtros.ano}`
      : "";

  return (
    <div className="row g-3 mb-4">
      <div className="col-12 col-md-8">
        <Select
          name="diretoria_regional_inicial"
          label="Diretoria Regional de Educação"
          input={{
            value: filtros.diretoria_regional ?? "",
            onChange: alterarDiretoria,
          }}
          options={[
            { nome: "Selecione uma DRE", uuid: "" },
            ...diretoriasRegionais,
          ]}
          disabled={carregandoDiretorias}
          naoDesabilitarPrimeiraOpcao
          required
        />
      </div>
      <div className="col-12 col-md-4">
        <Select
          name="mes_referencia"
          label="Mês de referência"
          input={{
            value: mesReferencia,
            onChange: alterarMesReferencia,
          }}
          options={[
            {
              nome: carregandoMeses ? "Carregando meses..." : "Selecione o mês",
              uuid: "",
            },
            ...mesesAnos.map(({ mes, ano }) => ({
              nome: `${MESES[mes - 1]} - ${ano}`,
              uuid: `${String(mes).padStart(2, "0")}/${ano}`,
            })),
          ]}
          disabled={!filtros.diretoria_regional || carregandoMeses}
          naoDesabilitarPrimeiraOpcao
          required
        />
      </div>
    </div>
  );
};
