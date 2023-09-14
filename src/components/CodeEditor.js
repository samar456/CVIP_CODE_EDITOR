import React from 'react'
import { useState } from "react";
import Editor from "@monaco-editor/react";

const CodeEditor = ({code,theme,language,onChange})=> {
    const [val,setVal] = useState(code || "");
     const handleChange = (value) => {
           setVal(value);
           onChange("code",value)
     }
   
  return (
    <>
      <Editor
        height="80vh"
        width={`1000px`}
        language= {language || "C++"}
        value = {val}
        theme={theme}
        defaultValue="// some comment"
        onChange={handleChange}
      />
    
</>  
  );
}

export default CodeEditor