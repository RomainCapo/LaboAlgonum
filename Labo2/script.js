function getValueFromAssocArray(array){
  let tmp = [];
  for(let key in array){
    if(array[key] != "Infinity" || array[key] != "-Infinity")
    {
        tmp.push(array[key]);
    }
  }
  return tmp;
}

class Plot{
  constructor(){
    this.canvas = document.getElementById("canvas");
    this.ctx = canvas.getContext("2d");//ctx permet de dessiner sur le canvas c'est le contexte
    this.width = canvas.width;
    this.height = canvas.height;
    this.xRange = 40;

    this._moveCoordinate();
    this._drawAxis();
    this._calculateFunctionValue();
    this._scaleCanvas();
    this._drawFunction();
  }

  //Deplace les coordonné du canvas au centre de celui ci
  _moveCoordinate(){
    let transX = this.width * 0.5;
    let transY = this.height * 0.5;
    this.ctx.translate(transX, transY);
  }

  //fait un zoom sur la canvas
  _scaleCanvas(){
    //comme this.functionValue est un tableau associatif on doit appliquer la fonction min et max sur toutes les valeurs
    //la fonction getValueFromAssocArray() retourne les valeurs du tableau associatif sous forme de tableau avec seulement les valeurs
    let minY = Math.min.apply(null, getValueFromAssocArray(this.functionValue));//valeur minimum de la fonction
    let maxY = Math.max.apply(null, getValueFromAssocArray(this.functionValue));//valeur maximum de la fonction

    let xScale = this.width / this.xRange;//donne la place que prends au maximum la focntion sur l'axe X
    let yScale = this.height / (maxY - minY);//donne la place que la prends au maximum la fonction sur l'axe Y


    this.ctx.scale(xScale, -50);//le signe - permet de renverser le sens de l'axe y
  }

  //calcule tout les valeurs de la fonction entre min et max
  // min et max correponds a la valeur de xRange divisé par 2
  // les valeurs de la focntions se trouve dans un tableau associatif avec la valeur x comme clé et la valeur de la fonction comme valeur
  _calculateFunctionValue(){
    let min = parseFloat(-1 * this.xRange / 2);
    let max = parseFloat(this.xRange / 2);

    this.functionValue = {};

    for(let i = parseFloat(min); i <= max; i+=0.1)
    {
      let key = i.toFixed(2).toString();
      let val = this._function(i);
      if(val > 10000)
      {
        val = "Infinity";
      }
      else if (val < -10000)
      {
        val = "-Infinity";
      }
      this.functionValue[key] = val;
    }
    console.log(this.functionValue);
  }

  //permet de dessiner les x et y
  // il est imperatif d'appeller cette focntion apres la fonction _moveCoordinateToCenterAndScale()
  _drawAxis(){

    let widthMiddle = this.width / 2;
    let heightMiddle = this.height / 2;

    //Axe X
    this.ctx.beginPath();
    this.ctx.moveTo(-widthMiddle, 0);
    this.ctx.lineTo(widthMiddle, 0);
    this.ctx.stroke();

    //Axe Y
    this.ctx.beginPath();
    this.ctx.moveTo(0, heightMiddle);
    this.ctx.lineTo(0, -heightMiddle);
    this.ctx.stroke();
  }

  //function a évaluer
  _function(x){
    return x / (1 - Math.pow(x,2));
  }

//dessin de la fonction
  _drawFunction(){
    let min = parseFloat(-1 * this.xRange / 2);
    let max = parseFloat(this.xRange / 2);

    this.ctx.beginPath();
    for(let i = parseFloat(min); i < max; i+=0.1)
    {
      console.log("test");
        this.ctx.moveTo(parseFloat(i), this.functionValue[parseFloat(i)]);
        this.ctx.lineTo(parseFloat(i)+ 0.1, this.functionValue[parseFloat(i) + 0.1]);
    }
    this.ctx.stroke();
  }
}

function clickEvent(){
}

function selectEvent(){
  let e = document.getElementById("norme");
  let val = e.options[e.selectedIndex].value;
}

document.addEventListener("DOMContentLoaded", function(event) {
  let plot = new Plot();
});
