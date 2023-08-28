import React, { useState } from "react";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import { HelpText } from "../HelpText";
import InputErroMensagemCKEditor from "../Input/InputErroMensagemCKEditor";

const CKEditorField = (props) => {
  const {
    helpText,
    label,
    input: { value, onChange },
    meta,
    name,
    required,
    placeholder,
    ...rest
  } = props;

  const [touched, setTouched] = useState(false);

  const config = {
    placeholder: placeholder,
    removePlugins: ["Heading", "BlockQuote", "CKFinder", "Link"],
    toolbar: [
      "bold",
      "italic",
      "|",
      "bulletedList",
      "numberedList",
      "|",
      "insertTable",
      "|",
      "undo",
      "redo",
    ],
  };

  return (
    <div className="select">
      {label && [
        required && (
          <span key={1} className="required-asterisk float-left">
            *
          </span>
        ),
        <label key={2} htmlFor={name} className="col-form-label">
          {label}
        </label>,
      ]}
      <CKEditor
        editor={ClassicEditor}
        data={value}
        onChange={(_, editor) => {
          onChange(editor.getData());
        }}
        {...rest}
        onBlur={() => setTouched(true)}
        config={config}
      />
      <HelpText helpText={helpText} />
      <InputErroMensagemCKEditor meta={meta} touched={touched} />
    </div>
  );
};

export default CKEditorField;
