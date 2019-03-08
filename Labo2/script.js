class Plot{
  constructor(){
    this.canvas = document.getElementById("canvas");
    this.ctx = canvas.getContext("2d");
    this.width = canvas.width;
    this.height = canvas.height;

    this.xRange = 10;

    //this.ctx.fillStyle = "#FF0000";
    //this.ctx.fillRect(0,0, this.width, this.height);

    /*this._moveCoordinateToCenterAndScale();
    this._drawAxis();
    this._drawFunction();*/
    this._calculateFunctionValue();
  }

  _moveCoordinateToCenterAndScale(canvas, ctx){

    let transX = this.width * 0.5;
    let transY = this.height * 0.5;
    this.ctx.translate(transX, transY);

    this.ctx.scale(this.width / this.xRange, -100);
  }

  _calculateFunctionValue(){
    let min = parseFloat(-1 * this.xRange / 2);
    let max = parseFloat(this.xRange / 2);

    this.functionValue = [];

    for(let i = min; i <= max; i++)
    {
      this.functionValue.push(this._function(i));
    }
    console.log(this.functionValue);
  }

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

  _function(x){
    return x / (1 - Math.pow(x,2))
  }

  _drawFunction(){
    let min = parseFloat(-1 * this.xRange / 2);
    let max = parseFloat(this.xRange / 2);


    this.ctx.beginPath();
    for(let i = min ; i <= max; i+=0.1)
    {
      console.log("i : " + i);
      console.log("f(i) :" + this._function(i));
      this.ctx.moveTo(i, this._function(i));
      this.ctx.lineTo(i + 1, this._function(i + 1))
    }
    this.ctx.stroke();
  }
}

function selectEvent(){
  let e = document.getElementById("norme");
  let val = e.options[e.selectedIndex].value;
}

document.addEventListener("DOMContentLoaded", function(event) {
  let plot = new Plot();
});
