import numeral from "numeral";


const formatValue = ({ format, children}) => {

  return (
  
  <span>
    {numeral(children).format(format)}
  </span>

)
};

export default formatValue;

