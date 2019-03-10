/*function getValueFromAssocArray(array){
  let tmp = [];
  for(let key in array){
        tmp.push(array[key]);
  }
  return tmp;
}

class Plot{
  constructor(){
    this.canvas = document.getElementById("canvas");
    this.ctx = canvas.getContext("2d");//ctx permet de dessiner sur le canvas c'est le contexte
    this.width = canvas.width;
    this.height = canvas.height;
    this.xRange = 200; // de -100 a 100

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


    this.ctx.scale(xScale, -yScale);//le signe - permet de renverser le sens de l'axe y
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
      let key = i.toString();
      let val = this._function(i);
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
    return Math.sin(x)-x/13
  }

//dessin de la fonction
  _drawFunction(){
    let min = parseFloat(-1 * this.xRange / 2);
    let max = parseFloat(this.xRange / 2);

    this.ctx.beginPath();
    for(let i = parseFloat(min); i < max; i+=0.1)
    {
        this.ctx.moveTo(parseFloat(i), this.functionValue[parseFloat(i)]);
        this.ctx.lineTo(parseFloat(i)+ 0.1, this.functionValue[parseFloat(i) + 0.1]);
    }
    this.ctx.stroke();
  }
}*/
//http://www.javascripter.net/faq/plotafunctiongraph.htm
class Plot{
  constructor(){
    this.draw();

  }

  fun1(x) {return Math.sin(x) - x/13;  }
  fun2(x) {return x / (1 - Math.pow(x,2));}

  draw() {
   let canvas = document.getElementById("canvas");

   let axes={}
   let ctx=canvas.getContext("2d");
   axes.x0 = .5*canvas.width;  // x0 pixels from left to x=0
   axes.y0 = .5*canvas.height; // y0 pixels from top to y=0
   axes.scale = canvas.width / 200;  // pour avoir toujours le graphe dessiner entre -100 et 100

   this.showAxes(ctx,axes);
   this.funGraph(ctx,axes,this.fun1,"rgb(11,153,11)");
   this.funGraph(ctx,axes,this.fun2,"rgb(66,44,255)");


  }

  funGraph(ctx,axes,func,color) {
   let xx, yy;//point qui seront utilisé pour dessiner la fonction
   let x0=axes.x0;
   let y0=axes.y0;

   let iMax = Math.round((ctx.canvas.width-x0));
   let iMin = Math.round(-x0);

  //on définit l'épaisseur de la ligne et la couleur de la fonction
   ctx.lineWidth = 2;
   ctx.strokeStyle = color;

   ctx.beginPath();
   for (var i=iMin;i<=iMax;i+=0.1)
   {
    xx = i;
    yy = 4*axes.scale*func(xx/axes.scale);//ligne a changé, car si on multiplie par un nombre la sortie de la fonction on l'as deforme totalement

    //si c'est la première itération de la boucle
    if(i==iMin)
    {
      ctx.moveTo(x0+xx,y0-yy);
    }
    else
    {
      ctx.lineTo(x0+xx,y0-yy);
    }
   }
   ctx.stroke();
  }

  showAxes(ctx,axes) {
   let w=ctx.canvas.width;
   let h=ctx.canvas.height;
   let xmin = 0;

   ctx.beginPath();
   ctx.strokeStyle = "rgb(128,128,128)";
     // X axis
   ctx.moveTo(xmin, axes.y0);
   ctx.lineTo(w,axes.y0);
  // Y axis
   ctx.moveTo(axes.x0, 0);
   ctx.lineTo(axes.x0,h);
   ctx.stroke();

   //dessine la graduation sur les axes
   //7 est pris arbitrairement pour le dessin de la graduation
   //on dessine un trait tout les 20
   for(let i = xmin; i < w; i++)
   {
     if(i % 20 == 0)
     {
       ctx.beginPath();
       ctx.moveTo(i, axes.y0 + 5);
       ctx.lineTo(i, axes.y0 - 5);
       ctx.stroke();
     }
   }
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
