const EXP = 8;
const MAN = 23;
const D = 126;

/*function binaryToDecimal(){
  let s = getSignValue();
  let sMaj = getSValue(s);

  let e = getExposentValue();
  let e_prime = getEPrimeValue(e);

  let m = getMantissaValue();
  let mMaj = getMValue(m);

  return sMaj * mMaj * Math.pow(2, e_prime - D);
}

function getSValue(s){
  if(s == '1')
  {
    return -1;
  }
  else
  {
    return 1;
  }
}

function getMValue(m){
  let m_with_hidden_bit = '1' + m;

  let numerator = parseInt(m_with_hidden_bit, 2);
  let denominator = Math.pow(2, MAN + 1);

  return numerator / denominator;
}

function getEPrimeValue(e){
    return parseInt(e, 2);
}

function getSignValue(){
  if(document.getElementById('s1').checked == true)
  {
    return '1';
  }
  else
  {
      return '0';
  }
}

function getExposentValue(){
  let binaryResult = '';

  for(let i = 1; i <= EXP; i++)
  {
    if(document.getElementById('e' + i).checked == true)
    {
      binaryResult += '1';
    }
    else
    {
      binaryResult += '0';
    }
  }
  return binaryResult;
}

function getMantissaValue(){
  let binaryResult = '';

  for(let i = 1; i <= MAN; i++)
  {
    if(document.getElementById('m' + i).checked == true)
    {
      binaryResult += '1';
    }
    else
    {
      binaryResult += '0';
    }
  }
  return binaryResult;
}*/

class DecimalType {
  constructor(){
    this.s = this._getSignValue();
    this.sMaj = this._getSValue(this.s);

    this.e = this._getExposentValue();
    this.e_prime = this._getEPrimeValue(this.e);

    this.m = this._getMantissaValue();
    this.mMaj = this._getMValue(this.m);

    this.decimal = this.sMaj * this.mMaj * Math.pow(2, this.e_prime - D);
  }

  getDecimal(){
    return this.decimal;
  }

  _getSValue(s){
    if(s == '1')
    {
      return -1;
    }
    else
    {
      return 1;
    }
  }

  _getMValue(m){
    let m_with_hidden_bit = '1' + m;

    let numerator = parseInt(m_with_hidden_bit, 2);
    let denominator = Math.pow(2, MAN + 1);

    return numerator / denominator;
  }

  _getEPrimeValue(e){
      return parseInt(e, 2);
  }

  _getSignValue(){
    if(document.getElementById('s1').checked == true)
    {
      return '1';
    }
    else
    {
        return '0';
    }
  }

  _getExposentValue(){
    let binaryResult = '';

    for(let i = 1; i <= EXP; i++)
    {
      if(document.getElementById('e' + i).checked == true)
      {
        binaryResult += '1';
      }
      else
      {
        binaryResult += '0';
      }
    }
    return binaryResult;
  }

  _getMantissaValue(){
    let binaryResult = '';

    for(let i = 1; i <= MAN; i++)
    {
      if(document.getElementById('m' + i).checked == true)
      {
        binaryResult += '1';
      }
      else
      {
        binaryResult += '0';
      }
    }
    return binaryResult;
  }
}

function onClicEvent(){
  let decimal_input = document.getElementById('decimal');
  let decimalObj = new DecimalType();
  decimal_input.value = decimalObj.getDecimal();
}

function debug(){
  alert(getEPrimeValue('01111111'));
}

document.addEventListener("DOMContentLoaded", function(event) {

});
