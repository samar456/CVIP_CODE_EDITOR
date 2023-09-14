import React from 'react'
import { languageOptions } from '../constants/langaugeOptions'
import Select from 'react-select'

function LanguageDropdown({onSelectionchange}) {
  return (
    <div>
        <Select 
        placeholder = {`Filter By Category`}
        options = {languageOptions}
        defaultValue = {languageOptions[0]}
        onChange = {(selectedOption)=>{onSelectionchange(selectedOption)}}
        />
    </div>
  )
}

export default LanguageDropdown