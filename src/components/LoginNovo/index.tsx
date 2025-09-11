import { useState } from "react";
import { ComponenteLogin } from "./components/Login";
import { RecuperarSenha } from "./components/RecuperarSenha";
import "./style.scss";

export const Login = () => {
  const [componenenteRenderizado, setComponenteRenderizado] = useState("login");
  const [texto, setTexto] = useState("");

  return (
    <div>
      <div className="login-bg" />
      <div className="right-half">
        <div className="container my-auto">
          <div className="logo-sigpae">
            <img src="/assets/image/logo-sigpae-com-texto.png" alt="" />
            {texto && <div className="titulo">{texto}</div>}
          </div>
          {componenenteRenderizado === "login" && (
            <ComponenteLogin
              setComponenteRenderizado={setComponenteRenderizado}
              setTexto={setTexto}
            />
          )}
          {componenenteRenderizado === "recuperarSenha" && (
            <RecuperarSenha
              setComponenteRenderizado={setComponenteRenderizado}
            />
          )}
          <div className="logo-prefeitura">
            <img src="/assets/image/EDUCAÇÃO_FUNDO_CLARO.png" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};
