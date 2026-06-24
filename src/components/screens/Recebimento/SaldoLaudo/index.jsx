import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import "./styles.scss";
import Filtros from "./components/Filtros";

export default () => {
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    setCarregando(false);
  }, []);

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card mt-3 card-saldo-laudo">
        <div className="card-body">
          <Filtros />
        </div>
      </div>
    </Spin>
  );
};
