const EXP = 8;
const MAN = 23;
const D = 126;

function toBinary8(number){
  let tmp = (number).toString(2);
  let length = 8 - tmp.length;
  for(let i = 0; i < length; i++)
  {
    tmp = '0' + tmp;
  }
  return tmp;
}

class FloatType {
  constructor(s, e, m){
    this.sMaj = this._getSValue(s);

    this.e_prime = this._getEPrimeValue(e);

    this.mMaj = this._getMValue(m);

    this.decimal = this.sMaj * this.mMaj * Math.pow(2, this.e_prime - D);
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

  static getSignValue(){
    if(document.getElementById('s1').checked == true)
    {
      return '1';
    }
    else
    {
        return '0';
    }
  }

  static getExposentValue(){
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

  static getMantissaValue(){
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

function generateExponentCheckbox(){
  let exposant = document.getElementById('exponent');

  for(let i = 1; i <= EXP; i++)
  {
    exposant.innerHTML += '<input type="checkbox" id="e'+ i +'" onclick="onClicEvent()">';
  }
}

function generateMantissaCheckbox(){
  let mantissa = document.getElementById('mantissa');

  for(let i = 1; i <= MAN; i++)
  {
    mantissa.innerHTML += '<input type="checkbox" id="m'+ i +'"  onclick="onClicEvent()">'
  }
}

//http://www.oxfordmathcenter.com/drupal7/node/43
class BinaryType{
  constructor(float){

    this.sign = this._getSign(float);
    alert(this.sign);
    this.exponent = this._getExponent(float);
    alert(this.exponent);
    this.mantissa = this._getMantissa(this.fraction);
    alert(this.mantissa);

    this.binary = this.sign + this.exponent + this.mantissa;
  }

  _getMantissa(fraction){
    let mantissa = '';
    fraction = this._getDecimal(fraction);

    for(let i = 0; i < MAN; i++)
    {
      fraction = fraction * 2;

      if(fraction >= 1)
      {
        mantissa += '1';
      }
      else
      {
        mantissa += '0';
      }

      fraction = this._getDecimal(fraction);
    }
    return mantissa;
  }

  _getExponent(float){
      let tmp;
      let i = 1;
      do {
        tmp = float / Math.pow(2,-i)
        i++;
      } while (!(tmp >= 1 && tmp < 2));

      this.fraction = tmp;
      let power = i - 1;
      power = -1 * power;

      let exponent = power + 127;
      return toBinary8(exponent);
  }

  _getSign(float){
    if(float.toString()[0] == '-')
    {
        return '1';
    }
    else
    {
      return '0';
    }
  }

  _getDecimal(number){
    let tmp = number - Math.floor(number);
    return tmp.toFixed(2);
  }

  static setCheckBox(binary){
    if(binary.length == 32)
    {
      let sign = document.getElementById('s1');

      if(binary[0] == '1')
      {
        sign.checked = true;
      }
      else
      {
        sign.checked = false;
      }

      let iExp = 1;
      for(let i = 1; i <= EXP; i++)
      {
        let exponent = document.getElementById('e' + iExp);
        iExp++;
        if(binary[i] == '1')
        {
          exponent.checked  = true;
        }
        else
        {
          exponent.checked = false;
        }
      }

      let iMan = 1;
      for(let i = EXP + 1; i <= EXP + MAN; i++)
      {
        let mantissa = document.getElementById('m' + iMan);
        iMan++;
        if(binary[i] == '1')
        {
          mantissa.checked = true;
        }
        else
        {
          mantissa.checked = false;
        }
      }
    }
    else
    {
      alert('error');
    }
  }

  static getInputValue(){
    return parseFloat(document.getElementById('decimal').value);
  }
}

function onClicEvent(){
  let decimal_input = document.getElementById('decimal');
  let decimal_obj = new FloatType(FloatType.getSignValue(), FloatType.getExposentValue(), FloatType.getMantissaValue());
  decimal_input.value = decimal_obj.decimal;
}

function onInputEvent(){
  alert(BinaryType.getInputValue());
}

function debug(){
  let binary_obj = new BinaryType(0.890625);
  //alert(binary_obj.binary);
  BinaryType.setCheckBox(binary_obj.binary);
}

document.addEventListener("DOMContentLoaded", function(event) {
  generateExponentCheckbox();
  generateMantissaCheckbox();
});


// Multiplication

function multiplication() {
  let a = document.getElementById('a_multiplication').value;
  let b = document.getElementById('b_multiplication').value;

  document.getElementById('multiplication').innerHTML = a*b;
}

// Division

function division() {
  let a = document.getElementById('a_division').value;
  let b = document.getElementById('b_division').value;

  document.getElementById('division').innerHTML = a/b;
}
