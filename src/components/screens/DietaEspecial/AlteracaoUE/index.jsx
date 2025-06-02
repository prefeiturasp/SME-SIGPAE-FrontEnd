import React, { useEffect, useState } from "react";
import FormCadastro from "./components/FormCadastro";
import CardMatriculados from "../../../Shareable/CardMatriculados";
import { meusDados } from "src/services/perfil.service";

export default () => {
  const [quantidadeAlunos, setQuantidadeAlunos] = useState(0);
  const [solicitacoesVigentes, setSolicitacoesVigentes] = useState(null);
  const [meusDadosEscola, setMeusDadosEscola] = useState(null);
  const [meusDados_, setMeusDados] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    meusDados().then((meusDados) => {
      setQuantidadeAlunos(
        meusDados.vinculo_atual.instituicao.quantidade_alunos
      );
      setMeusDadosEscola(meusDados.vinculo_atual.instituicao);
      setMeusDados(meusDados);
    });
  }, []);

  return (
    meusDadosEscola &&
    meusDados_ && (
      <>
        <CardMatriculados
          meusDados={meusDados_}
          numeroAlunos={quantidadeAlunos}
        />
        <div className="card card-dieta-alteracao-ue mt-3">
          <div className="card-body ">
            <FormCadastro
              solicitacoesVigentes={solicitacoesVigentes}
              setSolicitacoesVigentes={setSolicitacoesVigentes}
              meusDadosEscola={meusDadosEscola}
            />
          </div>
        </div>
      </>
    )
  );
};
