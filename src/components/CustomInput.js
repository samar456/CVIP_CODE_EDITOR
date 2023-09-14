import React from 'react'


function CustomInput({customInput,setCustomInput}) {
   const handleChange = (ev) =>{
        setCustomInput(ev.target.value);
   }
  return (

<textarea style={{boder:"2px solid gray",margin:"7px"}}
        rows="5"
        value={customInput}
        onChange={(e) => setCustomInput(e.target.value)}
        placeholder={`Custom input`}
      ></textarea>
  )
}

export default CustomInput