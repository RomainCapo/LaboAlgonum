const EXP = 8;
const MAN = 23;
const D = 126;

//converti un nombre decimal en base 10 en mettant les 0 nécaissaire devant (00001011), retourne donc tjs un nombre binaire de 8 bits
function toBinary8(number){
  let tmp = (number).toString(2);
  let length = 8 - tmp.length;
  for(let i = 0; i < length; i++)
  {
    tmp = '0' + tmp;
  }
  return tmp;
}

//rempli la mantisse en placant des 0 si les cases ne sont pas rempli
function fillWith0(binary){
  let length = binary.length;
  if(length < MAN)
  {
    let step = MAN - length;
    for(let i = 0; i < step; i++)
    {
      binary += '0';
    }
  }
  return binary;
}

// TODO: implémenter type special isNaN, Infinity, - Infinity
class FloatType {
  constructor(s, e, m){
    this.sMaj = this._getSValue(s);

    this.e_prime = this._getEPrimeValue(e);

    this.mMaj = this._getMValue(m);

    this.decimal = this.sMaj * this.mMaj * Math.pow(2, this.e_prime - D);
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

  for(let i = 1; i <= EXP; i++)
  {
    exposant.innerHTML += '<input type="checkbox" id="e'+ i +'" onclick="onClicEvent()">';
  }
}

//genere les checkbox pour la mantisse
function generateMantissaCheckbox(){
  let mantissa = document.getElementById('mantissa');

  for(let i = 1; i <= MAN; i++)
  {
    mantissa.innerHTML += '<input type="checkbox" id="m'+ i +'"  onclick="onClicEvent()">'
  }
}

//http://www.oxfordmathcenter.com/drupal7/node/43
//https://blog.penjee.com/binary-numbers-floating-point-conversion/
// TODO: le dernier chiffre de la mantisse n'est pas arrondi correctement
// TODO: refactorisé les fonctions
// TODO: traitement des valeurs d'entree pour eviter les erreur (isNaN(), ...)
class BinaryType{
  constructor(float){

    this.sign = this._getSign(float);

    this._transformScientificBase2(float);

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

  //converti le nombre passé en parametre en notation scientifique sans décalage donc (2^0)
  _transformScientificBase2WithoutShift(float){
    this.integral2 = toBinary8(parseInt(float, 10));//on prends uniquement le chiffre avant la virgule en base 2
    this.fractional10 = this._getDecimal(float);//on prends uniquement les chiffres après la virgule en base 10

    this.fractional2 = ''; //contient les chiffres apres la virgule en base 2

    //la fraction est multiplié par 2 tant qu'elle n'est pas egal à 0 et que 23 itération ne se sont pas écoulé
    // si la fraction est plus grande que 1 on enleve le chiffre avant la virgule
    let i = 0;
    while(this.fractional10 != 0 && i < 100)//100 nombre choisi aléatoirement grand avant de trouver une solution // TODO: ne pas mettre de nombre magique mais calculer a la volée
    {
      this.fractional10 = this.fractional10 * 2;
      if(this.fractional10 >= 1)
      {
        this.fractional2 += '1';
      }
      else
      {
        this.fractional2 += '0';
      }
      this.fractional10 = this._getDecimal(this.fractional10);
      i++;
    }

    this.number2 = (this.integral2 + '.' + this.fractional2).split('');//nombre en binaire avec la notation scientifique mais non somplifié (2^0)
  }

  //converti la notation scientifique base 2 sans décalage en notation avec décalage, calcule la mantisse et l'exposant
  _transformScientificBase2(float){
    this._transformScientificBase2WithoutShift(float);

    let pointIndex = this.integral2.length;//index du point dans le chiffre

    //on itere dans le nombre jusqu'a trouver un 1, on effectue encore une fois j++ pour se placer juste apres le 1, car c'est ici que l'on veut placer la virgule
    let j = 0;
    while(this.number2[j] != 1)
    {
      j++;
    }
    j++;

    this.mantissa = (this.integral2 + this.fractional2).split('');
    //si le nombre est plus grand ou egal a 1, on regarde de combien on a décalé la virgule,
    //pour la mantisse on enleve les 0 inutile et le 1er 1
    if(float >= 1)
    {
      this.power = pointIndex - j;
      this.mantissa.splice(0,j);
    }
    //si le nombre est plus petit que 1, on regarde de combien ona  decalé la virgule (+1 car si le nombre est plus petit que 0 on a compté la virgule dans le calcul et il faut enlever)
    //pour la mantisse on enleve les 0 inutile et le 1er 1
    else if (float < 1)
    {
      this.power = pointIndex - j + 1;
      this.mantissa.splice(0, j - 1);
    }
    this.exponent = toBinary8(127 + this.power);//on calcule l'exposant qu'on converti en binaire

    this.mantissa = this.mantissa.splice(0, MAN);//on prends les 23 premier bit de la mantisse
    this.mantissa = this.mantissa.join("");//on converti le tableau en string
    this.mantissa = fillWith0(this.mantissa);//on remplie la droite de la mantisse avec des 0

    /*console.log("exponent : " + this.exponent);
    console.log(this.exponent.length);
    console.log(this.mantissa.join(""));
    console.log(this.mantissa.length);*/
  }

  //récupére les chiffres apres la virgule du nombre passé en parametre (si nombre < 1 par exemple 0.5 retourne 0.5)
  _getDecimal(number){
    let string = number.toString();
    string = string.split(".")[1];
    return parseFloat("0." + string);
  }

  //permet de remplir ou non les checkboxs (attention le nombre passé en parametre doit etre de longeur 32)
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

  //permet de recupèrer la valeur de l'input
  static getInputValue(){
    return parseFloat(document.getElementById('decimal').value);
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
  if(!isNaN(decimal_input))
  {
    let binary_obj = new BinaryType(decimal_input);
    BinaryType.setCheckBox(binary_obj.binary);
  }
  console.log("isNan");
}

function debug(){
  let test = new BinaryType(34.890625);
  console.log("binary number : " + test.binary);
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
