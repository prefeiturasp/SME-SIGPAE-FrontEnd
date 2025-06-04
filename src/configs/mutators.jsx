export const setFieldTouched = (args, state) => {
  const [name, touched] = args;
  const field = state.fields[name];
  if (field) {
    field.touched = !!touched;
  }
};
