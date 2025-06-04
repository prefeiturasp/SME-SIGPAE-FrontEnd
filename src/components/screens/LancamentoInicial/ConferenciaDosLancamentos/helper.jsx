export const formatarNomePeriodo = (nomePeriodo) => {
  switch (nomePeriodo) {
    case "MANHA":
      return "Manhã";
    case "TARDE":
      return "Tarde";
    case "NOITE":
      return "Noite";
    case "INTEGRAL":
      return "Integral";
    case "PARCIAL":
      return "Parcial";
    case "VESPERTINO":
      return "Vespertino";
    case "INTERMEDIARIO":
      return "Intermediário";
    case "Programas e Projetos - MANHA":
      return "Programas e Projetos - Manhã";
    case "Programas e Projetos - TARDE":
      return "Programas e Projetos - Tarde";
    case "Programas e Projetos - NOITE":
      return "Programas e Projetos - Noite";
    case "Programas e Projetos - INTEGRAL":
      return "Programas e Projetos - Integral";
    case "Programas e Projetos - PARCIAL":
      return "Programas e Projetos - Parcial";
    case "Programas e Projetos - VESPERTINO":
      return "Programas e Projetos - Vespertino";
    case "Programas e Projetos - INTERMEDIARIO":
      return "Programas e Projetos - Intermediário";
    default:
      return nomePeriodo;
  }
};
