import { ChangeEvent, useEffect, useState } from "react";
import HTTP_STATUS from "http-status-codes";
import { InputComData } from "src/components/Shareable/DatePicker";
import Select from "src/components/Shareable/Select";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import { FiltrosRelatoriosVisitasInterface } from "src/interfaces/imr.interface";
import { ResponseDiretoriasRegionaisSimplissimaInterface } from "src/interfaces/responses.interface";
import { getDiretoriaregionalSimplissima } from "src/services/diretoriaRegional.service";

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

  const alterarDiretoria = (evento: ChangeEvent<HTMLSelectElement>) => {
    aoAlterarFiltros({
      ...filtros,
      diretoria_regional: evento.target.value,
    });
  };

  const alterarMesReferencia = (valor: string | null) => {
    const [mes, ano] = valor?.split("/") ?? [];

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
        <InputComData
          name="mes_referencia"
          label="Mês de referência"
          input={{
            id: "mes_referencia",
            value: mesReferencia,
            onChange: alterarMesReferencia,
          }}
          placeholder="Selecione o mês e ano"
          dateFormat="MM/YYYY"
          dateFormatPicker="MM/yyyy"
          showMonthYearPicker
          minDate={null}
          maxDate={null}
          required
        />
      </div>
    </div>
  );
};
