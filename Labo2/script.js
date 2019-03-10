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
   for (let i=iMin;i<=iMax;i+=0.1)
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

   //affiche la graduation (temporaire car tres sale)
   for(let i=iMin; i<=iMax;i++)
   {
     console.log(-80%20);
     if((i/axes.scale) % 20 == 0)
     {
       console.log(i/axes.scale);
       ctx.fillText((i/axes.scale).toString(), x0 + i - 7, y0 - 5);
     }
   }
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
     if(i/4 % 20 == 0)
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
