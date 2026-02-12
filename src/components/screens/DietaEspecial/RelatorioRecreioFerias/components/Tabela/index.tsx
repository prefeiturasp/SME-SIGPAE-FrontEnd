import { useState } from "react";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import { deepCopy } from "src/helpers/utilities";
import { getProtocoloDietaEspecial } from "src/services/relatorios";
import { IRelatorioDietaRecreioFerias } from "../../interfaces";
import "./style.scss";

export const Tabela = ({ ...props }) => {
  const { total, dietas, setDietas } = props;
  const [baixandoProtocolo, setBaixandoProtocolo] = useState<number>(-1);

  const setCollapse = (key: number) => {
    const copyDietas = deepCopy(dietas);
    copyDietas[key].collapsed = !copyDietas[key].collapsed;
    setDietas(copyDietas);
  };

  const gerarProtocolo = async (dieta: IRelatorioDietaRecreioFerias) => {
    try {
      await getProtocoloDietaEspecial(dieta.uuid, dieta);
    } catch {
      toastError("Erro ao baixar Protocolo. Tente novamente mais tarde.");
    }
  };

  return (
    <>
      <div className="titulo mt-4">
        Resultado da pesquisa - TOTAL DE DIETAS PARA RECREIO NAS FÉRIAS:{" "}
        <span>{total}</span>
      </div>
      <table className="mt-3">
        <thead>
          <tr>
            <th className="col-3">Cod. EOL e Nome do Aluno</th>
            <th className="col-3">UE de Origem</th>
            <th className="col-3">UE de Destino</th>
            <th className="col-1">Classificação</th>
            <th className="col-1">Vigência</th>
            <th className="col-1" />
          </tr>
        </thead>
        <tbody>
          {dietas?.map((dieta: IRelatorioDietaRecreioFerias, key: number) => {
            return [
              <tr key={key}>
                <td>
                  {dieta.aluno?.codigo_eol} - {dieta.aluno?.nome}
                </td>
                <td>{dieta.escola.nome}</td>
                <td>{dieta.escola_destino?.nome}</td>
                <td>{dieta.classificacao?.nome}</td>
                <td>
                  De {dieta.data_inicio} até {dieta.data_termino}
                </td>
                <td className="text-center" onClick={() => setCollapse(key)}>
                  <i
                    data-testid={`i-collapsed-${key}`}
                    className={
                      dieta.collapsed
                        ? "fas fa-chevron-up"
                        : "fas fa-chevron-down"
                    }
                  />
                </td>
              </tr>,
              dieta.collapsed && (
                <tr className="collapsed" key={`${key}_collapsed`}>
                  <td colSpan={6}>
                    <div className="d-flex align-items-center justify-content-between">
                      <b className="mb-0">Relação por Diagnóstico:</b>{" "}
                      <span className="ms-2">
                        {dieta.alergias_intolerancias
                          .map((item) => item.descricao)
                          .join(", ")}
                      </span>
                      <Botao
                        dataTestId={`botao-gerar-protocolo-${key}`}
                        type={BUTTON_TYPE.BUTTON}
                        style={BUTTON_STYLE.GREEN_OUTLINE}
                        texto={
                          baixandoProtocolo === key ? (
                            <img
                              src="/assets/image/ajax-loader.gif"
                              alt="ajax-loader"
                            />
                          ) : (
                            "Gerar Protocolo"
                          )
                        }
                        disabled={baixandoProtocolo === key}
                        className="ms-auto me-3"
                        onClick={async () => {
                          setBaixandoProtocolo(key);
                          await gerarProtocolo(dieta);
                          setBaixandoProtocolo(-1);
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ),
            ];
          })}
        </tbody>
      </table>
    </>
  );
};
