import { Spin } from "antd";
import HTTP_STATUS from "http-status-codes";
import moment from "moment";
import "moment/dist/locale/pt-br";
import React from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import dragAndDropAddon from "react-big-calendar/lib/addons/dragAndDrop";
import { CustomToolbar } from "src/components/Shareable/Calendario/componentes/CustomToolbar";
import "src/components/Shareable/Calendario/style.scss";
import { toastSuccess } from "src/components/Shareable/Toast/dialogs";
import { getDDMMYYYfromDate, getYYYYMMDDfromDate } from "src/helpers/utilities";
import { ModalDadosObjeto } from "src/components/screens/Cadastros/DiasLetivosSIGPAE/components/ModalDadosObjeto";
import { formataComoEventos } from "./helpers";
moment.locale("pt-br");

const withDragAndDrop = dragAndDropAddon.default ?? dragAndDropAddon;
const DragAndDropCalendar = withDragAndDrop(Calendar);

const localizer = momentLocalizer(moment);

export class CalendarioEdicaoExterna extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      objetos: undefined,
      loadingDiasCalendario: false,
      erroAPI: false,
      currentEvent: undefined,
      showModalDadosObjeto: false,
      mes: moment().month() + 1,
      ano: moment().year(),
      hasNavigatedOnce: false,
    };

    this.moveEvent = this.moveEvent.bind(this);
    this.handleEvent = this.handleEvent.bind(this);
    this.getObjetosAsync = this.getObjetosAsync.bind(this);
  }

  componentDidMount() {
    this.getObjetosAsync();
  }

  async getObjetosAsync(params) {
    const { getObjetos } = this.props;
    const { mes, ano } = this.state;
    this.setState({ loadingDiasCalendario: true });
    const response = await getObjetos(
      params ? { mes: params.mes, ano: params.ano } : { mes, ano },
    );
    if (response.status === HTTP_STATUS.OK) {
      this.setState({
        objetos: formataComoEventos(response.data.results || response.data),
      });
    }
    if (response) {
      this.setState({ loadingDiasCalendario: false });
    }
  }

  handleEvent(event) {
    this.setState({
      currentEvent: event,
      showModalDadosObjeto: true,
    });
  }

  async moveEvent({ event, start, end, isAllDay: droppedOnAllDaySlot }) {
    const { objetos } = this.state;
    const { nomeObjeto, setObjeto, podeEditar } = this.props;
    if (!podeEditar) return;

    const idx = objetos.indexOf(event);
    let allDay = event.allDay;

    if (!event.allDay && droppedOnAllDaySlot) {
      allDay = true;
    } else if (event.allDay && !droppedOnAllDaySlot) {
      allDay = false;
    }

    const updatedEvent = {
      ...event,
      data: getDDMMYYYfromDate(start),
      start,
      end,
      allDay,
    };

    const nextEvents = [...objetos];
    nextEvents.splice(idx, 1, updatedEvent);

    const cadastros_calendario_payload = [];
    nextEvents
      .filter((e) => e.data === getDDMMYYYfromDate(event.start))
      .forEach((evento) =>
        cadastros_calendario_payload.push({
          editais: evento.editais_uuids,
          tipo_unidades: [evento.tipo_unidade.uuid],
        }),
      );
    const payload = {
      cadastros_calendario: cadastros_calendario_payload,
      data: getYYYYMMDDfromDate(event.start),
    };

    await setObjeto(payload);

    const cadastros_calendario_payload2 = [];
    nextEvents
      .filter((e) => e.data === getDDMMYYYfromDate(start))
      .forEach((evento) =>
        cadastros_calendario_payload2.push({
          editais: evento.editais_uuids,
          tipo_unidades: [evento.tipo_unidade.uuid],
        }),
      );
    const payload2 = {
      cadastros_calendario: cadastros_calendario_payload2,
      data: getYYYYMMDDfromDate(start),
    };

    const response2 = await setObjeto(payload2);
    if (response2.status === HTTP_STATUS.CREATED) {
      toastSuccess(`Dia de ${nomeObjeto} atualizado com sucesso`);
    }

    this.setState({
      objetos: nextEvents,
    });
  }

  render() {
    const {
      objetos,
      loadingDiasCalendario,
      erroAPI,
      hasNavigatedOnce,
      currentEvent,
      showModalDadosObjeto,
    } = this.state;

    const { nomeObjeto, nomeObjetoMinusculo, setObjeto } = this.props;

    return (
      <div className="card calendario-sobremesa mt-3">
        <div className="card-body">
          <Spin tip="Carregando calendário..." spinning={!objetos && !erroAPI}>
            {erroAPI && <div>{erroAPI}</div>}
            {objetos && (
              <>
                <Spin
                  tip={`Carregando dias ${nomeObjeto}...`}
                  spinning={loadingDiasCalendario}
                >
                  <DragAndDropCalendar
                    tooltipAccessor={(e) => e.editais_numeros}
                    style={{ height: 1000 }}
                    formats={{
                      weekdayFormat: (date, culture, localizer) =>
                        localizer.format(date, "dddd", culture),
                    }}
                    selectable
                    resizable={false}
                    localizer={localizer}
                    events={objetos}
                    onSelectEvent={this.handleEvent}
                    onEventDrop={this.moveEvent}
                    components={{
                      toolbar: CustomToolbar,
                    }}
                    messages={{
                      showMore: (target) => (
                        <span className="ms-2" role="presentation">
                          ...{target} mais
                        </span>
                      ),
                    }}
                    onNavigate={(date) => {
                      if (!hasNavigatedOnce) {
                        this.setState({ hasNavigatedOnce: true });
                        return;
                      }
                      this.setState({
                        mes: date.getMonth() + 1,
                        ano: date.getFullYear(),
                      });
                      this.getObjetosAsync({
                        mes: date.getMonth() + 1,
                        ano: date.getFullYear(),
                      });
                    }}
                    defaultView={Views.MONTH}
                  />
                </Spin>
                {currentEvent && (
                  <>
                    <ModalDadosObjeto
                      showModal={showModalDadosObjeto}
                      nomeObjetoNoCalendario={nomeObjeto}
                      nomeObjetoNoCalendarioMinusculo={nomeObjetoMinusculo}
                      closeModal={() =>
                        this.setState({
                          showModalDadosObjeto: false,
                        })
                      }
                      objetos={objetos}
                      event={currentEvent}
                      getObjetosAsync={this.getObjetosAsync}
                      setObjetoAsync={setObjeto}
                    />
                  </>
                )}
              </>
            )}
          </Spin>
        </div>
      </div>
    );
  }
}
