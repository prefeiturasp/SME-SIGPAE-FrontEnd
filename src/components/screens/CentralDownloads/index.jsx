import React, { useEffect, useState, useContext } from "react";
import { Spin } from "antd";
import "./styles.scss";
import {
  getDownloads,
  setDownloadMarcarDesmarcarLida,
  deletarDownload,
} from "src/services/downloads.service";
import { gerarParametrosConsulta } from "src/helpers/utilities";
import ListagemDownloads from "./components/ListagemDownloads";
import { CentralDeDownloadContext } from "src/context/CentralDeDownloads";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import Filtros from "./components/Filtros";
import { Paginacao } from "src/components/Shareable/Paginacao";

export default () => {
  const centralDownloadContext = useContext(CentralDeDownloadContext);

  const [carregando, setCarregando] = useState(false);
  const [downloads, setDownloads] = useState([]);
  const [filtros, setFiltros] = useState();
  const [totalDownloads, setTotalDownloads] = useState(0);

  const [page, setPage] = useState(1);

  const buscarDownloads = async (page) => {
    setCarregando(true);
    let payload = gerarParametrosConsulta({ page, ...filtros });
    let data = await getDownloads(payload);

    setDownloads(data.results);
    setTotalDownloads(data.count);
    setCarregando(false);
  };

  const nextPage = (page) => {
    buscarDownloads(page);
    setPage(page);
  };

  const marcarVisto = async (download, index) => {
    setCarregando(true);
    const payload = {
      uuid: download.uuid,
      visto: !download.visto,
    };

    let downloadsNew = downloads;
    downloadsNew[index].visto = !downloadsNew[index].visto;
    setDownloads([...downloadsNew]);

    await setDownloadMarcarDesmarcarLida(payload);
    centralDownloadContext.getQtdeDownloadsNaoLidas();
    setCarregando(false);
  };

  const deletaDownload = async (download) => {
    try {
      setCarregando(true);
      await deletarDownload(download.uuid);
      setCarregando(false);
      toastSuccess("Download deletado com sucesso!");
      let downloadsNew = downloads.filter((d) => d.uuid !== download.uuid);
      setDownloads([...downloadsNew]);
    } catch {
      toastError("Ocorreu um erro ao deletar o download!");
    }
  };

  useEffect(() => {
    buscarDownloads(1);
    setPage(1);
  }, [filtros]);

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card mt-3 card-downloads">
        <div className="card-body downloads">
          <Filtros setFiltros={setFiltros} />
          {downloads && (
            <>
              <ListagemDownloads
                downloads={downloads}
                deletaDownload={deletaDownload}
                marcarVisto={marcarVisto}
                atualizar={() => buscarDownloads(page)}
              />
              <div className="row">
                <div className="col">
                  <Paginacao
                    className="mt-3 mb-3"
                    current={page}
                    total={totalDownloads}
                    showSizeChanger={false}
                    onChange={nextPage}
                    pageSize={10}
                  />
                </div>
              </div>
            </>
          )}
          {totalDownloads === 0 && (
            <div className="text-center mt-5">
              Não existem downloads para os critérios de busca utilizados.
            </div>
          )}
        </div>
      </div>
    </Spin>
  );
};
