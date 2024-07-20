import React, { forwardRef, useImperativeHandle, useRef, useEffect } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const Editor = forwardRef((props, ref) => {
  const editorRef = useRef(null);
  const { readOnly } = props;

  // Expose a method to get the Quill editor instance
  useImperativeHandle(ref, () => ({
    getEditor: () => editorRef.current,
    // Function to get plain text content from Quill
    getTextContent: () => {
      if (!editorRef.current) return "";
      // Quill provides methods to get both HTML and text content
      return editorRef.current.root.innerHTML.replace(/<\/?[^>]+(>|$)/g, " ").trim();
    },
  }));

  useEffect(() => {
    if (editorRef.current) {
      return;
    }
    // Initialize Quill with options
    editorRef.current = new Quill("#editor", {
      theme: "snow",
      readOnly,
      modules: {
        toolbar: [
          [{ font: [] }, { size: [] }],
          [{ header: "1" }, { header: "2" }, "blockquote", "code-block"],
          ["bold", "italic", "underline", "strike"],
          [{ script: "sub" }, { script: "super" }],
          [{ color: [] }, { background: [] }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ align: [] }],
          ["link", "image", "video"],
          ["clean"],
        ],
      },
    });
  }, [readOnly]);

  return <div id="editor" />;
});

export default Editor;
