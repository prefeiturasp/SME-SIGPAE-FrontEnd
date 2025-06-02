import { AvatarCODAE } from "src/components/Shareable/Avatar/AvatarCODAE";
import { AvatarDistribuidor } from "src/components/Shareable/Avatar/AvatarDistribuidor";
import { AvatarDRE } from "src/components/Shareable/Avatar/AvatarDRE";
import { AvatarEscola } from "src/components/Shareable/Avatar/AvatarEscola";
import { AvatarTerceirizada } from "src/components/Shareable/Avatar/AvatarTerceirizada";
import React from "react";
import {
  usuarioEhEmpresaDistribuidora,
  usuarioEhDRE,
  usuarioEhEscolaTerceirizada,
  usuarioEhEscolaTerceirizadaDiretor,
  usuarioEhEscolaAbastecimento,
  usuarioEhEscolaAbastecimentoDiretor,
  usuarioEhEmpresaTerceirizada,
} from "./utilities";

export default () => {
  if (usuarioEhEmpresaDistribuidora()) {
    return <AvatarDistribuidor />;
  } else if (usuarioEhEmpresaTerceirizada()) {
    return <AvatarTerceirizada />;
  } else if (usuarioEhDRE()) {
    return <AvatarDRE />;
  } else if (
    usuarioEhEscolaTerceirizada() ||
    usuarioEhEscolaTerceirizadaDiretor() ||
    usuarioEhEscolaAbastecimento() ||
    usuarioEhEscolaAbastecimentoDiretor()
  ) {
    return <AvatarEscola />;
  } else {
    return <AvatarCODAE />;
  }
};
