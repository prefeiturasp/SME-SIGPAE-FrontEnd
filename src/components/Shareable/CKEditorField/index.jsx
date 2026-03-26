import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  Alignment,
  AutoImage,
  Base64UploadAdapter,
  Bold,
  ClassicEditor,
  Essentials,
  Font,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  Image,
  ImageCaption,
  ImageInsert,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  Italic,
  List,
  Paragraph,
  Strikethrough,
  Table,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";
import { useState } from "react";
import { HelpText } from "../HelpText";
import InputErroMensagemCKEditor from "../Input/InputErroMensagemCKEditor";
import "./style.scss";

export const CKEditorField = (props) => {
  const {
    helpText,
    label,
    input: { value, onChange },
    meta,
    name,
    required,
    placeholder,
    dataTestId,
    toolbar,
    allowImages = false,
    ...rest
  } = props;

  const [touched, setTouched] = useState(false);

  const config = {
    licenseKey: "GPL",
    plugins: [
      Essentials,
      Bold,
      Italic,
      Strikethrough,
      Font,
      FontFamily,
      FontBackgroundColor,
      FontColor,
      Paragraph,
      List,
      Table,
      TableToolbar,
      TableProperties,
      TableCellProperties,
      Alignment,
      TableColumnResize,
      ...(allowImages
        ? [
            Image,
            ImageCaption,
            ImageStyle,
            ImageToolbar,
            ImageUpload,
            ImageInsert,
            AutoImage,
            Base64UploadAdapter,
          ]
        : []),
    ],
    toolbar:
      toolbar === false
        ? []
        : [
            "bold",
            "italic",
            "strikethrough",
            "|",
            "|",
            "fontfamily",
            "fontsize",
            "fontColor",
            "fontBackgroundColor",
            "|",
            "bulletedList",
            "numberedList",
            "|",
            "insertTable",
            "|",
            "alignment",
            "|",
            "undo",
            "redo",
            ...(allowImages ? ["|", "insertImage"] : []),
          ],
    ...(allowImages && {
      image: {
        insert: {
          type: "inline",
        },
        toolbar: [
          "imageStyle:inline",
          "imageStyle:block",
          "imageStyle:side",
          "|",
          "toggleImageCaption",
          "imageTextAlternative",
        ],
      },
    }),
    table: {
      contentToolbar: [
        "tableColumn",
        "tableRow",
        "mergeTableCells",
        "tableProperties",
        "tableCellProperties",
      ],
    },
    placeholder: placeholder,
  };

  return (
    <div
      className={`select ${meta.error && touched && "ckeditor-error"}`}
      data-testid={dataTestId}
    >
      {label && [
        required && (
          <span key={1} className="required-asterisk">
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
