import React, { useEffect } from "react";
import HTTP_STATUS from "http-status-codes";
import { CustomToolbar } from "components/Shareable/CalendarioCronograma/componentes/CustomToolbar";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import { formataComoEventos } from "components/Shareable/CalendarioCronograma/helpers";
import { Spin } from "antd";
import { ModalCronograma } from "components/Shareable/CalendarioCronograma/componentes/ModalCronograma";
import "components/Shareable/CalendarioCronograma/style.scss";
import { useState } from "react";
import { ItemCalendario, ParametrosCalendario } from "./interfaces";
import { EtapaCalendario } from "interfaces/pre_recebimento.interface";
import { ResponseCalendarioCronograma } from "interfaces/responses.interface";

interface Props {
  getObjetos: (
    _params?: ParametrosCalendario
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
    getObjetosAsync();
  }, []);

  const getObjetosAsync = async (params?: ParametrosCalendario) => {
    setLoadingDiasCalendario(true);
    const response = await getObjetos(
      params ? { mes: params.mes, ano: params.ano } : { mes, ano }
    );
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
                    getObjetosAsync({
                      mes: date.getMonth() + 1,
                      ano: date.getFullYear(),
                    });
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
