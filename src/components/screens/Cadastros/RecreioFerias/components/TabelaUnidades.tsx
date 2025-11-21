import { Spin } from "antd";
import { Paginacao } from "src/components/Shareable/Paginacao";
import "../style.scss";
import { LinhaUnidade } from "./LinhaUnidade"; // adaptado para readOnly
import { ModalRemoverUnidadeEducacional } from "./ModalRemoverUnidadeEducacional";

const defaultPageSize = 10;

export const TabelaUnidades = ({
  editable = true,
  fields,
  form,
  participantes = [],
  loading = false,
  page = 1,
  setPage = () => {},
  pageSize = defaultPageSize,
  expandidos = {},
  toggleExpandir = () => {},
  openRemoverModal = () => {},
  showModalRemover = false,
  closeRemoverModal = () => {},
  confirmRemover = () => {},
}) => {
  const list = editable ? fields?.value || [] : participantes || [];
  const total = list.length;
  const currentPage = Math.min(
    Math.max(1, page),
    Math.ceil(total / pageSize) || 1
  );
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  return (
    <Spin spinning={loading} tip="Carregando...">
      <table className="tabela-unidades-participantes">
        <thead>
          <tr className="row">
            <th className="col-1 text-center">DRE/LOTE</th>
            <th className="col-3 text-center">Unidade Educacional</th>
            <th className="col-2 text-center">
              <span className="required-asterisk">*</span> Nº de Inscritos
            </th>
            <th className="col-2 text-center">
              <span className="required-asterisk">*</span> Nº de Colaboradores
            </th>
            <th className="col-2 text-center">Liberar Medição?</th>
            <th className="action-column col-1 text-center"></th>
            {editable && <th className="action-column col-1 text-center"></th>}
          </tr>
        </thead>

        <tbody>
          {list.map((item, index) => {
            if (index < startIndex || index >= endIndex) return null;

            if (editable) {
              const name = fields?.name
                ? `${fields.name}[${index}]`
                : `unidades_participantes[${index}]`;
              const participante = fields.value[index];
              return (
                <LinhaUnidade
                  key={participante?.id}
                  name={name}
                  index={index}
                  participante={participante}
                  aberto={!!expandidos[participante?.id]}
                  toggleExpandir={toggleExpandir}
                  openRemoverModal={openRemoverModal}
                  fields={fields}
                  readOnly={false}
                  form={form}
                />
              );
            } else {
              const participante = item;
              return (
                <LinhaUnidade
                  key={participante?.id || index}
                  participante={participante}
                  index={index}
                  readOnly={true}
                  aberto={!!expandidos[participante?.id]}
                  toggleExpandir={toggleExpandir}
                />
              );
            }
          })}
        </tbody>
      </table>

      <Paginacao
        className="mt-3 mb-3"
        current={page}
        total={total}
        showSizeChanger={false}
        onChange={setPage}
        pageSize={pageSize}
      />

      {/* Modal de remoção só faz sentido no modo editável */}
      {editable && (
        <ModalRemoverUnidadeEducacional
          showModal={showModalRemover}
          closeModal={closeRemoverModal}
          handleRemoverUnidade={confirmRemover}
        />
      )}
    </Spin>
  );
};
