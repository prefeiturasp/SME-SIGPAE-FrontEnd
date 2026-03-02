import React, { useState } from "react";
import StatefulMultiSelect from "@khanacademy/react-multi-select";
import { Form, Field } from "react-final-form";
import AutoCompleteField from "src/components/Shareable/AutoCompleteField";
import Botao from "src/components/Shareable/Botao";
import { useNavigate } from "react-router-dom";
import { DIETA_ESPECIAL, PROTOCOLO_PADRAO_DIETA } from "src/configs/constants";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { consultaProtocoloPadrao } from "src/services/dietaEspecial.service";
import HTTP_STATUS from "http-status-codes";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import { ModalVincularProtocolos } from "../ModalVincularProtolocos";

export default ({
  setResultado,
  nomes,
  status,
  setCarregando,
  setTotal,
  filtros,
  setFiltros,
  setPage,
  editais,
  editaisDestino,
  onChangePage,
}) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const getNomesProtocolosFiltrado = (nomeProtocolo) => {
    if (nomeProtocolo) {
      return nomes.filter((nome) =>
        nome.toUpperCase().includes(nomeProtocolo.toUpperCase()),
      );
    }
    return [];
  };

  const getStatusProtocolosFiltrado = (statusProtocolo) => {
    if (statusProtocolo) {
      return status.filter((status) =>
        status.toUpperCase().includes(statusProtocolo.toUpperCase()),
      );
    }
    return [];
  };

  const formatStatus = (status) => {
    if (status === "Liberado") {
      return "LIBERADO";
    }
    if (status === "Não liberado") {
      return "NAO_LIBERADO";
    }
    return status;
  };

  const onSubmit = async (formValues) => {
    try {
      setCarregando(true);
      const payload = {
        nome_protocolo: formValues.nome_protocolo,
        status: formatStatus(formValues.status),
        editais: formValues.editais,
      };
      const response = await consultaProtocoloPadrao(payload);
      if (response.status === HTTP_STATUS.OK) {
        setResultado(response.data);
        setTotal(response.data.count);
        setFiltros(payload);
      }
    } catch {
      toastError("Houve um erro ao tentar filtrar os Protocolos");
    }
    setCarregando(false);
  };

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={{}}
      render={({ submitting, form, handleSubmit, values }) => (
        <form onSubmit={handleSubmit}>
          <div className="row mt-3 mb-3">
            <div className="col-4">
              <Field
                label="Nome do Protocolo Padrão"
                component={AutoCompleteField}
                dataSource={getNomesProtocolosFiltrado(values.nome_protocolo)}
                name="nome_protocolo"
                placeholder="Insira o Nome do Protocolo Padrão"
                className="input-busca-nome-protocolo"
              />
            </div>
            <div className="col-4">
              <Field
                label="Status do Protocolo Padrão"
                component={AutoCompleteField}
                dataSource={getStatusProtocolosFiltrado(values.status)}
                name="status"
                placeholder="Insira o Status do Protocolo Padrão"
                className="input-busca-status-protocolo"
              />
            </div>
            <div className="col-4">
              <div className="label mt-2 mb-1">Número do Edital</div>
              <Field
                component={StatefulMultiSelect}
                name="editais"
                selected={values.editais || []}
                options={editais.map((edital) => ({
                  label: edital.numero,
                  value: edital.uuid,
                }))}
                onSelectedChanged={(values_) => {
                  form.change(`editais`, values_);
                }}
                overrideStrings={{
                  search: "Busca",
                  selectSomeItems: "Selecione",
                  allItemsAreSelected: "Todos os itens estão selecionados",
                  selectAll: "Todos",
                }}
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-8">
              <Botao
                texto="Criar Protocolo Padrão"
                type={BUTTON_TYPE.BUTTON}
                style={BUTTON_STYLE.GREEN}
                onClick={() =>
                  navigate(`/${DIETA_ESPECIAL}/${PROTOCOLO_PADRAO_DIETA}`)
                }
              />
              <Botao
                texto="Vincular Protocolos Padrão"
                className="ms-3"
                type={BUTTON_TYPE.BUTTON}
                style={BUTTON_STYLE.GREEN_OUTLINE}
                onClick={() => setShowModal(true)}
              />
            </div>
            <div className="col-4">
              <Botao
                texto="Consultar"
                type={BUTTON_TYPE.SUBMIT}
                style={BUTTON_STYLE.GREEN}
                className="float-end ms-3"
                disabled={submitting}
              />
              <Botao
                texto="Limpar campos"
                type={BUTTON_TYPE.BUTTON}
                style={BUTTON_STYLE.GREEN_OUTLINE}
                className="float-end ms-3"
                onClick={() => {
                  form.reset({});
                  setResultado(undefined);
                  setPage(1);
                }}
              />
            </div>
          </div>
          <ModalVincularProtocolos
            showModal={showModal}
            closeModal={(value) => setShowModal(value)}
            editais={editais}
            editaisDestino={editaisDestino}
            buscar={() => onChangePage()}
            filtros={filtros}
          />
        </form>
      )}
    />
  );
};
