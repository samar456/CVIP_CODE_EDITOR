import React, { useEffect, useState } from 'react'
import CodeEditor from './CodeEditor'
import { languageOptions } from '../constants/langaugeOptions'
import defineTheme from '../lib/defineTheme'
import LanguageDropdown from './LanguageDropdown'
import ThemeDropdown from './ThemeDropdown'
import axios from 'axios'
import Output from './Output'
import CustomInput from './CustomInput'
import OutputDetails from './OutputDetails'
import "./../App.css";
const javascriptDefault = `//comment`;

function Main() {
    
    const [code,setCode] = useState(javascriptDefault)
    const [language,setLanguage] = useState(languageOptions[0])
    const [theme,setTheme] = useState("amy")
    const [processing,setProcessing] = useState(false)
    const [outputDetails, setOutputDetails] = useState(null);
    const [customInput, setCustomInput] = useState("");
    const onChange = (action, data) => {
        switch (action) {
          case "code": {
            setCode(data);
            break;
          }
          default: {
            console.warn("case not handled!", action, data);
          }
        }
      };
    const onSelectionchange = (sl)=>{
             setLanguage(sl);
    }

    const handleThemeChange = (th) =>{
        const theme = th;
        if (["light", "vs-dark"].includes(theme.value)) {
            setTheme(theme);
          } else {
            defineTheme(theme.value).then((_) => setTheme(theme));
          }
    }
    useEffect(() => {
        defineTheme("oceanic-next").then((_) =>
          setTheme({ value: "oceanic-next", label: "Oceanic Next" })
        );
      }, []);
   
    const handleCompile = async() => {
      
        setProcessing(true);
        const formData = {
            language_id: language.id,
            // encode source code in base64
            source_code: btoa(code),
            stdin: btoa(customInput),
          };
        
const options = {
    
    method: 'POST',
    url: process.env.REACT_APP_RAPID_API_URL,
    params: {
      base64_encoded: 'true',
      fields: '*'
    },
    headers: {
      'content-type': 'application/json',
      'Content-Type': 'application/json',
      'X-RapidAPI-Key': '5863fae21cmsha2b4814e13bb9bbp1322b3jsn86ee2b7bcc66',
      'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
    },
    data: formData,
  };
  axios
  .request(options)
  .then(function (response) {
    console.log("res.data", response.data);
    const token = response.data.token;
    checkStatus(token);
  })
  .catch((err) => {
    let error = err.response ? err.response.data : err;
    setProcessing(false);
    console.log(error);
  });

}
      const checkStatus = async (token) => {
      
        const options = {
            method: 'GET',
            url: 'https://judge0-ce.p.rapidapi.com/submissions/'+token,
            params: {
              base64_encoded: 'true',
              fields: '*'
            },
            headers: {
              'X-RapidAPI-Key': '5863fae21cmsha2b4814e13bb9bbp1322b3jsn86ee2b7bcc66',
              'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
            }
          };
  
  try {
      const response = await axios.request(options);
      let statusId = response.data.status?.id;

      // Processed - we have a result
      if (statusId === 1 || statusId === 2) {
        // still processing
        setTimeout(() => {
          checkStatus(token)
        }, 2000)
        return
      } else {
        setProcessing(false)
        setOutputDetails(response.data)
        console.log('response.data', response.data)
        return
      
  }}  catch (err) {
    console.log("err", err);
    setProcessing(false);

  }
}
      

  
  
  return (
    <div className='app'>
        <div className='head typewriter'>
       <h1>CODE EDITOR</h1>
        </div>
        <div className="flex flex-row">
         <div className="px-8 py-2" style={{width:"19vw"}}>
        <LanguageDropdown onSelectionchange={onSelectionchange}/>
        </div>
        <div className="px-4 py-2">
        <ThemeDropdown handleThemeChange={handleThemeChange}/>
        </div>
        </div>


        <div className="flex flex-row space-x-4 items-start px-4 py-4 ptt">
        <div className="flex flex-col w-full h-full justify-start ptt3">
        <CodeEditor
        className="ptt2"
        code={code}
        theme={theme.value}
        language={language?.value}
        onChange={onChange}
        />
        </div>
      
        <div className="right-container flex flex-shrink-0 w-[30%] flex-col" style={{display:"flex",alignItems:"center"}}>
          <Output outputDetails={outputDetails} />
          <div className="flex flex-col ">
            <CustomInput
              customInput={customInput}
              setCustomInput={setCustomInput}
            />
     
            <button
              onClick={handleCompile}
            >
              {processing ? "Processing..." : "Compile and Execute"}
            </button>
  
        </div>
          {outputDetails && <OutputDetails outputDetails={outputDetails} />}
      </div>
    </div>
    </div>
  )
}


export default Main