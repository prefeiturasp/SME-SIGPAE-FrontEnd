import { useState, useEffect } from "react";

const useSomenteLeitura = (perfisSomenteLeitura) => {
  const [somenteLeitura, setSomenteLeitura] = useState(false);
  const perfil = localStorage.getItem("perfil");

  useEffect(() => {
    setSomenteLeitura(perfisSomenteLeitura.includes(perfil));
  }, [perfisSomenteLeitura]);

  return somenteLeitura;
};

export default useSomenteLeitura;
