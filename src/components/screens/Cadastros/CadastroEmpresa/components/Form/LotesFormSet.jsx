import React from "react";
import { Field } from "react-final-form";
import StatefulMultiSelect from "@khanacademy/react-multi-select";
import { useState } from "react";
import { useEffect } from "react";
import { getLotesSimples } from "src/services/lote.service";
import { transformaObjetos } from "../../helper";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import ModalTransferirLote from "src/components/Shareable/ModalTransferirLote";

const renderizarLabelLote = (selected, options) => {
  if (selected.length === 0) {
    return "Selecione um ou mais lotes...";
  }
  if (selected.length === options.length) {
    return "Todos os lotes foram selecionados";
  }
  if (selected.length === 1) {
    return `${selected.length} lote selecionado`;
  }
  return `${selected.length} lotes selecionados`;
};

export const LotesFormSet = (props) => {
  const [lotes, setLotes] = useState([]);
  const [lotesRaw, setLotesRaw] = useState([]);
  const {
    ehDistribuidor,
    lotesSelecionados,
    terceirizada,
    setLotesSelecionados,
  } = props;
  const [lotesNomesSelecionados, setLotesNomesSelecionados] = useState([]);
  const [loteAdicionado, setLoteAdicionado] = useState(undefined);
  const [atualizarLotes, setAtualizarLotes] = useState(false);
  const [exibirModalTransferenciaLote, setExibirModalTransferenciaLote] =
    useState(false);

  const lidarComSelecionados = (values) => {
    if (
      terceirizada &&
      terceirizada.lotes
        .map((lote) => lote.uuid)
        .filter((lote) => !values.includes(lote)).length > 0
    ) {
      toastError(
        "Não é possível remover um lote, apenas transferí-lo para outra empresa."
      );
      return;
    }
    const loteSelecionado = values.find(
      (lote) => !lotesSelecionados.includes(lote)
    );
    if (
      loteSelecionado &&
      lotesRaw.find((l) => l.uuid === loteSelecionado).terceirizada
    ) {
      setLoteAdicionado(lotesRaw.find((l) => l.uuid === loteSelecionado));
      setExibirModalTransferenciaLote(true);
    }

    let lotesNomesSelecionados = [];
    values.forEach((value) => {
      const indice = lotes.findIndex((lote) => lote.uuid === value);
      lotesNomesSelecionados.push(lotes[indice].label);
    });

    setLotesNomesSelecionados(lotesNomesSelecionados);
    setLotesSelecionados(values);
  };

  const naoAceitaTransferenciaLote = (lote) => {
    setExibirModalTransferenciaLote(false);
    setLotesSelecionados(lotesSelecionados.filter((l) => l !== lote.uuid));
    setLotesNomesSelecionados(
      lotesNomesSelecionados.filter((l) => l !== lote.nome)
    );
  };

  useEffect(() => {
    if (!ehDistribuidor) {
      getLotesSimples().then((response) => {
        setLotes(transformaObjetos(response.data));
        setLotesRaw(response.data.results);
      });
    }
  }, []);

  return (
    <>
      {!ehDistribuidor && (
        <>
          <hr className="linha-form" />
          {exibirModalTransferenciaLote && (
            <ModalTransferirLote
              lote={loteAdicionado}
              closeModalNao={naoAceitaTransferenciaLote}
              closeModalSim={() => setExibirModalTransferenciaLote(false)}
              showModal={exibirModalTransferenciaLote}
            />
          )}
          <div>
            <div className="card-body">
              <div className="row pt-3">
                <div className="col-12">
                  <label className="label fw-normal pb-3">
                    Lotes de atendimento
                    <span
                      onClick={() => setAtualizarLotes(!atualizarLotes)}
                      className="link editar-lotes ms-3"
                    >
                      editar lotes
                    </span>
                  </label>

                  {lotes.length ? (
                    <Field
                      component={StatefulMultiSelect}
                      name="lotes"
                      selected={lotesSelecionados}
                      options={lotes}
                      valueRenderer={renderizarLabelLote}
                      onSelectedChanged={(value) => {
                        lidarComSelecionados(value);
                      }}
                      overrideStrings={{
                        search: "Busca",
                        selectSomeItems: "Selecione",
                        allItemsAreSelected:
                          "Todos os itens estão selecionados",
                        selectAll: "Todos",
                      }}
                      disabled={!atualizarLotes}
                    />
                  ) : (
                    <div className="col-6">Carregando lotes..</div>
                  )}
                </div>
                <div className="col-12">
                  {lotesNomesSelecionados.length > 0 && (
                    <div className="row pt-3">
                      <div className="col-12">
                        <label className="label-selected-unities">
                          Lotes Selecionados
                        </label>
                        {lotesNomesSelecionados.map((lote, indice) => {
                          return (
                            <div
                              className="value-selected-unities"
                              key={indice}
                            >
                              {lote}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
