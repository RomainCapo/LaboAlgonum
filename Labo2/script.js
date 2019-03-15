//http://www.javascripter.net/faq/plotafunctiongraph.htm
class Plot{
  constructor(funIndex, zoom){
    this.funIndex = funIndex;
    this.zoom = zoom;
    this._draw();
  }

  //permet de supprimer tout les éléments du canvas
  _cleanCanvas(ctx)
  {
    ctx.save();//on sauve le contexte du canvas

    ctx.setTransform(1, 0, 0, 1, 0, 0);//on utilise la matrice identiée pour retrouver le scale par défaut
    ctx.clearRect(0, 0, canvas.width, canvas.height);//on clean le canvas

    ctx.restore();//on restore le canvas
  }

  //représente les 2 fonctions
  fun1(x) {return Math.sin(x) - x/13;  }
  fun2(x) {return x / (1 - Math.pow(x,2));}

//fonction de dessin sur le canvas
  _draw() {
   let canvas = document.getElementById("canvas");

   let axes={}
   let ctx=canvas.getContext("2d");
   //ctx.clearRect(0, 0, canvas.height, canvas.width);

   this._cleanCanvas(ctx);

   axes.x0 = .5*canvas.width;//point tout a gauche du canvas sur l'axe x
   axes.y0 = .5*canvas.height; //point tout en haut du canvas sur l'axe y

   //on applique différents facteurs en fonction de si l'utilisateurs désire zoomer la fonction
   if(this.zoom)
   {//si le graphe doit etre zoomer
     axes.scale = 40;
     axes.graduation = 5
   }
   else
   {//si le graphe ne doit pas etre zoomer
     axes.scale = canvas.width / 200;
     axes.graduation = 20;
   }

   this._showAxes(ctx,axes);//on affiche les axes

   if(this.funIndex == 1)
   {
     this._funGraph(ctx,axes,this.fun1,"rgb(11,153,11)");
   }
   else if(this.funIndex == 2)
   {
     this._funGraph(ctx,axes,this.fun2,"rgb(66,44,255)");
   }
  }

  _funGraph(ctx,axes,func,color) {
   let xx, yy;//point qui seront utilisé pour dessiner la fonction
   let x0=axes.x0;
   let y0=axes.y0;

   //borne de dessin de la fonction
   let iMax = Math.round((ctx.canvas.width-x0));
   let iMin = Math.round(-x0);

  //on définit l'épaisseur de la ligne et la couleur de la fonction
   ctx.lineWidth = 2;
   ctx.strokeStyle = color;

   //on dessine la courbe entre iMin et iMax par pas de 0.05
   ctx.beginPath();
   for (let i=iMin;i<=iMax;i+=0.05)
   {
    xx = i;
    yy = axes.scale*func(xx/axes.scale);//on calcule le point y et on applique un scale en fonction du résultat

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

   //affiche la graduation sur l'axe en fonction du scale
   for(let i=iMin; i<=iMax;i++)
   {
     if((i/axes.scale) % axes.graduation == 0)
     {
       ctx.fillText((i/axes.scale).toString(), x0 + i - 7, y0 - 5);//les valeur 5 et 7 sont prises arbitrairement pour décaler le texte de la graduation et fonction du graphe
     }
   }
  }

  //permet de dessiner les axes sur le canvas
  _showAxes(ctx,axes) {
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

function selectEvent(){
  let plotIndex = getSelectValue();
  let zoom = getRadioValue();
  let plot = new Plot(plotIndex, zoom);
}

function changeEvent(){
  let plotIndex = getSelectValue();
  let zoom = getRadioValue();
  let plot = new Plot(plotIndex, zoom);
}

function getRadioValue(){
  let zoom;
  let value = document.getElementById("zoom");
  if(value.checked)
  {
    zoom = true;
  }
  else
  {
    zoom = false;
  }
  return zoom;
}

function getSelectValue(){
  let e = document.getElementById("equation");
  let val = e.options[e.selectedIndex].value;
  let plotIndex;
  if(val == "equa1")
  {
    plotIndex = 1;
  }
  else if (val == "equa2")
  {
    plotIndex = 2;
  }
  return plotIndex;
}

function clickEvent(){
}


class Dichotomie{
  constructor(plot){
	this.it = 0;
	this.tab = [];
    this.plot = plot;
	for(let i = -100; i <100; i++) //BOUCLE POUR APPELER LA FONCTION DISPLAY (DE -100 à -99, DE -99 à -98, etc)
	{
		this.display(i, i+1, i);
	}
    
  }

  display(depart, arrive, i)
  {
    let m = 0;//sera le milieu
	let Aarrive = arrive;//Sert à tester si à la fin, la norme arrive n'a pas bougé (si c'est le cas, on n'a pas trouvé de racine, à part p-e sur la borne elle-meme et ca sera testé dans le prochain display grâce à la boucle)
	
	while((arrive-depart) > 0.1)//difference entre les deux bornes (on peut mettre bien plus petit)
	{
		m = (depart+arrive)/2;//on met m au milieu
		//changer la ligne du dessous de fun1 à fun2 aux 2 endroits afin de changer de graphe
		if((this.plot.fun1(depart) * this.plot.fun1(m)) <= 0)//si les deux bornes ont des signes différentes dans le graphe, on bouge la borne de droite (c'est sur qu'on aura une racine)
		{
			arrive = m;//On bouge la borne de droite
		}
		else
		{
			depart = m;//On bouge la borne de gauche si c'est les même signe
		}
	}
	if(Aarrive == arrive)//si la borne de droite n'a pas bougé, on fait rien
	{
	}
	else//sinon, on a trouvé une racine
	{
	this.tab[i] = depart;//on met la racine dans tab
	}
	//document.getElementById("racines").innerHTML = "a = " + tab[i]; //sert à afficher sur la page, à remanier
  }
}

function clickEventAfficher()
{
	//bouton ne sert plus à rien, (on peut supprimer avec le bouton)
}

document.addEventListener("DOMContentLoaded", function(event) {
	let plot = new Plot();
	let racines = new Dichotomie(plot);
  	let tab2 = racines.tab;
	console.log(tab2);
});
