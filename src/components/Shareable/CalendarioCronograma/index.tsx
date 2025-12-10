import React, { useEffect } from "react";
import HTTP_STATUS from "http-status-codes";
import { CustomToolbar } from "src/components/Shareable/CalendarioCronograma/componentes/CustomToolbar";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import { formataComoEventos } from "src/components/Shareable/CalendarioCronograma/helpers";
import { Spin } from "antd";
import { ModalCronograma } from "src/components/Shareable/CalendarioCronograma/componentes/ModalCronograma";
import "src/components/Shareable/CalendarioCronograma/style.scss";
import { useState } from "react";
import { ItemCalendario, ParametrosCalendario } from "./interfaces";
import { EtapaCalendario } from "src/interfaces/pre_recebimento.interface";
import { ResponseCalendarioCronograma } from "src/interfaces/responses.interface";

interface Props {
  getObjetos: (
    _params?: ParametrosCalendario,
  ) => Promise<ResponseCalendarioCronograma>;
  nomeObjeto: string;
  nomeObjetoMinusculo: string;
}

const localizer = momentLocalizer(moment);

export const CalendarioCronograma: React.FC<Props> = ({
  getObjetos,
  nomeObjeto,
  nomeObjetoMinusculo,
}) => {
  const [objetos, setObjetos] =
    useState<ItemCalendario<EtapaCalendario>[]>(undefined);
  const [loadingDiasCalendario, setLoadingDiasCalendario] =
    useState<boolean>(false);
  const [currentEvent, setCurrentEvent] =
    useState<ItemCalendario<EtapaCalendario>>(undefined);
  const [showModalCronograma, setShowModalCronograma] =
    useState<boolean>(false);
  const [mes, setMes] = useState<number>(moment().month() + 1);
  const [ano, setAno] = useState<number>(moment().year());

  useEffect(() => {
    getObjetosAsync({ mes, ano });
  }, [mes, ano]);

  const getObjetosAsync = async (params: ParametrosCalendario) => {
    setLoadingDiasCalendario(true);
    const response = await getObjetos(params);
    if (response.status === HTTP_STATUS.OK) {
      setObjetos(formataComoEventos(response.data.results));
    }
    if (response) {
      setLoadingDiasCalendario(false);
    }
  };

  const handleEvent = (event: ItemCalendario<EtapaCalendario>) => {
    setCurrentEvent(event);
    setShowModalCronograma(true);
  };

  const eventPropGetter = (event: any) => {
    if (event.programa_leve_leite || event.resource?.programa_leve_leite) {
      return {
        className: "programa-leve-leite",
      };
    }
    return {};
  };

  return (
    <div className="card calendario-sobremesa mt-3">
      <div className="card-body">
        <Spin tip="Carregando calendário..." spinning={!objetos}>
          {objetos && (
            <>
              <p>
                Para visualizar detalhes dos {nomeObjetoMinusculo}, clique sobre
                o item no dia programado.
              </p>
              <Spin
                tip={`Carregando dias de ${nomeObjeto}...`}
                spinning={loadingDiasCalendario}
              >
                <Calendar
                  style={{ height: 1000 }}
                  formats={{
                    weekdayFormat: (date, culture, localizer) =>
                      localizer.format(date, "dddd", culture),
                  }}
                  selectable
                  resizable={false}
                  localizer={localizer}
                  events={objetos}
                  onSelectEvent={handleEvent}
                  eventPropGetter={eventPropGetter}
                  components={{
                    toolbar: CustomToolbar,
                  }}
                  messages={{
                    showMore: (target: string) => (
                      <span className="ms-2" role="presentation">
                        ...{target} mais
                      </span>
                    ),
                  }}
                  onNavigate={(date: Date) => {
                    setMes(date.getMonth() + 1);
                    setAno(date.getFullYear());
                  }}
                  defaultView={Views.MONTH}
                />
              </Spin>
              {showModalCronograma && currentEvent && (
                <ModalCronograma
                  showModal={showModalCronograma}
                  closeModal={() => setShowModalCronograma(false)}
                  event={currentEvent}
                />
              )}
            </>
          )}
        </Spin>
      </div>
    </div>
  );
};
