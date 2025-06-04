export const generateOptions = (optionsArray) => {
  let options = [];
  optionsArray.forEach((option) => {
    options.push({ nome: option, uuid: option });
  });
  return options;
};

export const SECURITY_OPTIONS = {
  TLS: "TLS",
  SSL: "SSL",
};
