/*function getValueFromAssocArray(array){
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
    this.ctx = canvas.getContext("2d");
    this.width = canvas.width;
    this.height = canvas.height;

    this.xRange = 200;

      this._calculateFunctionValue();
    this._moveCoordinateToCenterAndScale();
    this._drawFunction();
    this._drawAxis();
  }

  _moveCoordinateToCenterAndScale(){

    let transX = this.width * 0.5;
    let transY = this.height * 0.5;
    this.ctx.translate(transX, transY);

    let minY = Math.min.apply(null, getValueFromAssocArray(this.functionValue));
    let maxY = Math.max.apply(null, getValueFromAssocArray(this.functionValue));

    let xScale = this.width / this.xRange;
    let yScale = this.height / (maxY - minY);

    console.log("min" + minY);
    console.log("max" + maxY);

    this.ctx.scale(xScale, -10);
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
      let tmp = i.toString();
      this.functionValue[tmp] = this._function(i);
    }
    //console.log(this.functionValue);
  }

  //permet de dessiner les x et y
  // il est imperatif d'appeller cette focntion apres la fonction _moveCoordinateToCenterAndScale()
  _drawAxis(){
    let widthMiddle = this.width / 2;
    let heightMiddle = this.height / 2;

    this.ctx.scale(1,-1);

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

  _drawFunction(){
    let min = parseFloat(-1 * this.xRange / 2);
    let max = parseFloat(this.xRange / 2);

    this.ctx.beginPath();
    for(let i = parseFloat(min); i < max; i+=0.1)
    {
    console.log(parseFloat(i));
      console.log(this.functionValue[i]);
      if(this.functionValue[parseFloat(i)] != "Infinity" || this.functionValue[parseFloat(i)] != "-Infinity")
      {
        this.ctx.moveTo(parseFloat(i), this.functionValue[parseFloat(i)]);
        this.ctx.lineTo(parseFloat(i)+ 0.1, this.functionValue[parseFloat(i) + 0.1]);
      }
      else
      {
        this.ctx.stroke();
        this.ctx.beginPath();
      }
    }
    this.ctx.stroke();
  }
}*/

//http://www.javascripter.net/faq/plotafunctiongraph.htm
function fun1(x) {return Math.sin(x) - x/13;  }
function fun2(x) {return x / (1 - Math.pow(x,2));}

function draw() {
 var canvas = document.getElementById("canvas");
 if (null==canvas || !canvas.getContext) return;

 var axes={}, ctx=canvas.getContext("2d");
 axes.x0 = .5 + .5*canvas.width;  // x0 pixels from left to x=0
 axes.y0 = .5 + .5*canvas.height; // y0 pixels from top to y=0
 axes.scale = 40;                 // 40 pixels from x=0 to x=1
 axes.doNegativeX = true;

 showAxes(ctx,axes);
 funGraph(ctx,axes,fun1,"rgb(11,153,11)",1);
 funGraph(ctx,axes,fun2,"rgb(66,44,255)",2);
}

function funGraph (ctx,axes,func,color,thick) {
 var xx, yy, dx=4, x0=axes.x0, y0=axes.y0, scale=axes.scale;
 var iMax = Math.round((ctx.canvas.width-x0)/dx);
 var iMin = axes.doNegativeX ? Math.round(-x0/dx) : 0;
 ctx.beginPath();
 ctx.lineWidth = thick;
 ctx.strokeStyle = color;

 for (var i=iMin;i<=iMax;i++) {
  xx = dx*i; yy = scale*func(xx/scale);
  if (i==iMin) ctx.moveTo(x0+xx,y0-yy);
  else         ctx.lineTo(x0+xx,y0-yy);
 }
 ctx.stroke();
}

function showAxes(ctx,axes) {
 var x0=axes.x0, w=ctx.canvas.width;
 var y0=axes.y0, h=ctx.canvas.height;
 var xmin = axes.doNegativeX ? 0 : x0;
 ctx.beginPath();
 ctx.strokeStyle = "rgb(128,128,128)";
 ctx.moveTo(xmin,y0); ctx.lineTo(w,y0);  // X axis
 ctx.moveTo(x0,0);    ctx.lineTo(x0,h);  // Y axis
 ctx.stroke();

 for(let i = xmin; i < w; i++)
 {
   if(i % 20 == 0)
   {
     ctx.beginPath();
     ctx.moveTo(i, y0 + 7);
     ctx.lineTo(i, y0 - 7);
     ctx.stroke();
   }
 }
}

function clickEvent(){
  let test = {};
  test[-1] = 358;
  test[0] = 39;
  test[1] = 759;
}

function selectEvent(){
  let e = document.getElementById("norme");
  let val = e.options[e.selectedIndex].value;
}

document.addEventListener("DOMContentLoaded", function(event) {
  //let plot = new Plot();
  draw();
});
