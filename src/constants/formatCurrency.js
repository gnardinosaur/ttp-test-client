//format currency integer to $USD
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
});

function convertStringToNum(string){
  const number = Number(string.replace(/[^0-9.-]+/g,""))
  return number
}


export { formatter, convertStringToNum }