import { useEffect, useMemo, useState } from "react";
import { ComponenteLogin } from "./components/Login";
import { PrimeiroAcesso } from "./components/PrimeiroAcesso";
import { RecuperarSenha } from "./components/RecuperarSenha";
import "./style.scss";

export const Login = () => {
  const [componenteRenderizado, setComponenteRenderizado] = useState("login");
  const [texto, setTexto] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const param = urlParams.get("componenteRenderizado");
    if (param) setComponenteRenderizado(param);
    if (param === "primeiroAcesso") setTexto("Primeiro Acesso");
  }, []);

  const componentes = useMemo(
    () => ({
      login: (
        <ComponenteLogin
          setComponenteRenderizado={setComponenteRenderizado}
          setTexto={setTexto}
        />
      ),
      recuperarSenha: (
        <RecuperarSenha
          setComponenteRenderizado={setComponenteRenderizado}
          setTexto={setTexto}
        />
      ),
      primeiroAcesso: (
        <PrimeiroAcesso
          setComponenteRenderizado={setComponenteRenderizado}
          setTexto={setTexto}
        />
      ),
    }),
    []
  );

  return (
    <>
      <div className="login-bg" />
      <div className="right-half">
        <div className="container my-auto">
          <div className="logo-sigpae">
            <img
              src="/assets/image/logo-sigpae-com-texto.png"
              alt="Logo SIGPAE"
            />
            {texto && <div className="titulo">{texto}</div>}
          </div>

          {componentes[componenteRenderizado] ?? componentes.login}

          <div className="logo-prefeitura">
            <img
              src="/assets/image/EDUCAÇÃO_FUNDO_CLARO.png"
              alt="Logo Prefeitura"
            />
          </div>
        </div>
      </div>
    </>
  );
};
