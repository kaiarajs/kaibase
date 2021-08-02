import React, { useRef } from "react";
import Editor from "@monaco-editor/react";

function CodeEditor() {
  const editorRef = useRef(null);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor; 
  }
  
  function showValue() {
    alert(editorRef.current.getValue());
  }

  return (
   <>
     <button onClick={showValue}>Show value</button>
     <Editor
       height="90vh"
       defaultLanguage="typescript"
       defaultValue="// some comment"
       onMount={handleEditorDidMount}
       options= {{
         minimap: {enabled: false}  
        }}
     />
   </>
  );
}

export default CodeEditor