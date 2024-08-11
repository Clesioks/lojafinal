import React from "react";
import numeral from "numeral";

const FormatarValor = ({children, format}) => {


  return ( 
  
  <span> 
    {numeral(children).format(format)}
    </span>

  )
};

export default FormatarValor;
