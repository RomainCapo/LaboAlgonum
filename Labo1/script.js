var EXP = 8;
var MAN = 23;
var D_ = 127;

//converti un nombre binaire en base 2, le rempli sois de '0' ou de '1' sur la gauche pour avoir un nombre de taille X
//par exemple : toBinaryX('0', 8, '0') -> '0000000'
// number : int -> nombre a convertir
//X : int -> nombre de bit de codage voulu
//bit : string -> sois '1' sois '0' c'est le bit avec lequel on va remplir les bit manquants
function toBinaryX(number, X, bit){
  let tmp = (number).toString(2);
  let length = X - tmp.length;
  for(let i = 0; i < length; i++)
  {
    tmp = bit + tmp;
  }
  return tmp;
}

//remplie le nombre passé en paramétre avec sois '0' sois '1' jusqua la valeur de la mantisse
//exemple : toBinaryX('1', '0') -> '10000000000000000000000';
//binary : string -> nombre a remplir
//X : sois '1' sois '0' c'est le bit avec lequel on va remplir les bit manquants
function fillWithX(binary, X){
  let length = binary.length;
  if(length < MAN)
  {
    let step = MAN - length;
    for(let i = 0; i < step; i++)
    {
      binary += X;
    }
  }
  return binary;
}

class FloatType {
  constructor(s, e, m){

    //selon la norme IEEE 754 il peut y avoir plusieurs cas particulier,qu'il faut traiter
    // si le signe vaut 0, l'exposant 0 et la mantisse 0 alors le chiffre vaut 'Zero'
    if(s == '0' && e == toBinaryX(0, EXP, '0') && m == fillWithX('', '0'))
    {
      this.decimal = "Zero";
    }
    //si le signe vaut 0, tout les bits de l'exposant sont à 1 et la mantisse à 0, le nombre correponds à l'infini
    else if (s == '0' && e == toBinaryX(1, EXP, '1') && m == fillWithX('', '0'))
    {
      this.decimal = "Infinity";
    }
    //si le signe vaut 1, tout les bits de l'exposant sont à 1 et la mantisse à 0, le nombre correponds à l'infini
    else if (s == '1' && e == toBinaryX(1, EXP, '1') && m == fillWithX('', '0'))
    {
      this.decimal = "-Infinity";
    }
    //si le signe vaut 0, tout les bits de l'exposant sont à 1 et la mantisse à 0 sauf le bit tout a gauche, la valeur entrée n'est pas un nombre
    else if (s == '0' && e == toBinaryX(1, EXP, '1') && m == fillWithX('', '0'))
    {
      this.decimal = "NaN";
    }
    // si c'est aucun des cas au dessus on effectue le traitement habituel
    else
    {
      console.log(s + e + m);
      this.sMaj = this._getSValue(s);

      this.e_prime = this._getEPrimeValue(e);

      this.mMaj = this._getMValue(m);

      this.decimal = this.sMaj * this.mMaj * Math.pow(2, this.e_prime - D_ + 1);
    }
  }

  //récupère la valeur du signe
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

  //récupère la valeur de M selon la formule du cours
  _getMValue(m){
    let m_with_hidden_bit = '1' + m;

    let numerator = parseInt(m_with_hidden_bit, 2);
    let denominator = Math.pow(2, MAN + 1);

    return numerator / denominator;
  }

  //récupère e prime selon la formule du cours
  _getEPrimeValue(e){
      return parseInt(e, 2);
  }

  //récupère la valeur du signe sur le formulaire
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

  //récupère la valeur de l'exposant sur le formulaire
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

 //récupère la valeur de la mantisse sur le formulaire
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

//genere les checkbox pour l'exposant
function generateExponentCheckbox(){
  let exposant = document.getElementById('exponent');
  exposant.innerHTML = '';
  for(let i = 1; i <= EXP; i++)
  {
    exposant.innerHTML += '<input type="checkbox" id="e'+ i +'" onclick="onClicEvent()">';
  }
}

//genere les checkbox pour la mantisse
function generateMantissaCheckbox(){
  let mantissa = document.getElementById('mantissa');
  mantissa.innerHTML = '';
  for(let i = 1; i <= MAN; i++)
  {
    mantissa.innerHTML += '<input type="checkbox" id="m'+ i +'"  onclick="onClicEvent()">'
  }
}

//http://www.oxfordmathcenter.com/drupal7/node/43
//https://blog.penjee.com/binary-numbers-floating-point-conversion/
// TODO: refactorisé les fonctions
class BinaryType{
  constructor(float){

    //selon la norme IEEE 754 il peut y avoir plusieurs cas particulier,qu'il faut traiter
    //si le champs vaut 'Zero' tout les bits valent 0
    if(float == "Zero" || parseFloat(float) == 0)
    {
      console.log('zero');
      this.sign = '0';
      this.exponent = toBinaryX(0, EXP, '0');
      this.mantissa = fillWithX('','0');
    }
    //si le champs vaut 'Infinity', bit du signe à 0, tout les bits de l'exposant à 1, et tout les bits de la mantisse a 0
    else if (float == "Infinity")
    {
      console.log('Infinity');
      this.sign = '0';
      this.exponent = toBinaryX(1, EXP, '1');
      this.mantissa = fillWithX('','0');
    }
    //si le champs vaut '-Infinity', bit du signe à 1, tout les bits de l'exposant à 1, et tout les bits de la mantisse a 0
    else if (float == "-Infinity")
    {
      console.log('-Infinity');
      this.sign = '1';
      this.exponent = toBinaryX(1, EXP, '1');
      this.mantissa = fillWithX('','0');
    }
    //si le champs vaut 'Nan' qui signie Not a Number, bit du signe à 0, tout les bits de l'exposant à 1, et tout les bits de la mantisse a 0 sauf le 1er
    else if (float == "NaN")
    {
      console.log('Nan');
      this.sign = '0';
      this.exponent = toBinaryX(1, EXP, '1');
      this.mantissa = fillWithX('1','0');
    }
    // si c'est aucun des cas au dessus on effectue le traitement habituel
    else
    {
      float = parseFloat(float)
      if(!isNaN(float))
      {
        console.log(float);
        this.sign = this._getSign(float);
        this._calculateExponentAndMantissa(float);
      }
      else
      {
        this.sign = '0';
        this.exponent = toBinaryX(1, EXP, '1');
        this.mantissa = fillWithX('1', '0');
      }
    }
    this.binary = this.sign + this.exponent + this.mantissa;//on assemble le nombre binaire dans sa totalité
  }

  //recupère le signe de la valeur passé en parametre
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

  //calcule l'exposant et la mantisse en effectuant une conversion en notation scientifique base 2, puis en depacant la virgule afin d'avoir un nombre correct
  _calculateExponentAndMantissa(float){
    let integral2 = toBinaryX(parseInt(float, 10), EXP, '0');//on prends uniquement le chiffre avant la virgule en base 2
    let fractional10 = this._getDecimal(float);//on prends uniquement les chiffres après la virgule en base 10


    let fractional2 = ''; //contient les chiffres apres la virgule en base 2

    //la fraction est multiplié par 2 tant qu'elle n'est pas egal à 0 et que 23 itération ne se sont pas écoulé
    // si la fraction est plus grande que 1 on enleve le chiffre avant la virgule
    let i = 0;
    //127 + 23 permet de ne perdre aucune précision, en effet si on prends le cas extreme qui serait un nombre entre -1 et 1 tres tres petit, le nombre de décalage maximum
    //serait de 127 etant donné que l'exposant = 127 + décalge, apres 127 décalge il faut encore récupérer la valeur de mantisse donc 23 bit.
    //(cette exemple est pour la version 32 bit mais marche avec les autres version)
    while(fractional10 != 0 && i < D_ + MAN)
    {
      fractional10 = fractional10 * 2;
      if(fractional10 >= 1)
      {
        fractional2 += '1';
      }
      else
      {
        fractional2 += '0';
      }
      fractional10 = this._getDecimal(fractional10);
      i++;
    }

    let number2 = (integral2 + '.' + fractional2).split('');//nombre en binaire avec la notation scientifique mais non somplifié (2^0)

    let pointIndex = integral2.length;//index du point dans le chiffre

    //on itere dans le nombre jusqu'a trouver un 1, on effectue encore une fois j++ pour se placer juste apres le 1, car c'est ici que l'on veut placer la virgule
    let j = 0;
    while(number2[j] != 1)
    {
      j++;
    }
    j++;

    let power = 0;
    this.mantissa = (integral2 + fractional2).split('');
    //si le nombre n'est pas compris entre -1 et 1, on regarde de combien on a décalé la virgule,
    //pour la mantisse on enleve les 0 inutile et le 1er 1
    if(float <= -1 || float >= 1)
    {
      power = pointIndex - j;
      this.mantissa.splice(0,j);
    }
    //si le nombre est compris entre -1 et 1, on regarde de combien on a  decalé la virgule
    //(+1 car si le nombre est comrpis entre - 1 et 1 on a compté la virgule dans le calcul et il faut enlever)
    //pour la mantisse on enleve les 0 inutile et le 1er 1
    else
    {
      power = pointIndex - j + 1;
      this.mantissa.splice(0, j - 1);
    }
    this.exponent = toBinaryX(D_ + power, EXP, '0');//on calcule l'exposant qu'on converti en binaire
    this.mantissa = fillWithX(this.mantissa.splice(0, MAN).join(""), '0');//on prends les 23 premier bit de la mantisse[splice()], on converti le tableau en string[join()], on remplie la droite de la mantisse avec des 0[fillWith0()]
  }

  //récupére les chiffres apres la virgule du nombre passé en parametre (si nombre < 1 par exemple 0.5 retourne 0.5)
  _getDecimal(number){
    let string = number.toString();
    string = string.split(".")[1];
    return parseFloat("0." + string);
  }

  //permet de remplir ou non les checkboxs (attention le nombre passé en parametre doit etre de longeur 32)
  static setCheckBox(binary){
    if(binary.length == 1 + EXP + MAN)
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

  //permet de recupèrer la valeur de l'input
  static getInputValue(){
    return document.getElementById('decimal').value;
  }
}

//lors du clic sur une checkbox on effectue la conversion binaire -> decimal et on met a jour dans l'input de type text
function onClicEvent(){
  let decimal_input = document.getElementById('decimal');
  let decimal_obj = new FloatType(FloatType.getSignValue(), FloatType.getExposentValue(), FloatType.getMantissaValue());
  decimal_input.value = decimal_obj.decimal;
}

//lors du chanegement d'etat de l'input on converti le nombre courant en decimal -> binaire et on met a jour les checkboxs
function onInputEvent(){
  let decimal_input = BinaryType.getInputValue();

    let binary_obj = new BinaryType(decimal_input);
    BinaryType.setCheckBox(binary_obj.binary);
}

function selectEvent(){
  document.getElementById("decimal").value = '';	
  var e = document.getElementById("norme");
  var val = e.options[e.selectedIndex].value;
  if(val == "single_precision")
  {
    EXP = 8;
    MAN = 23;
    D_ = 127;
  }
  else if(val == "double_precision")
  {
    EXP = 11;
    MAN = 52;
    D_ = 1023;
  }
  generateExponentCheckbox();
  generateMantissaCheckbox();
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
