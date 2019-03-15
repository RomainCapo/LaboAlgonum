

//http://www.javascripter.net/faq/plotafunctiongraph.htm
class Plot{
  constructor(funIndex, zoom){
    this.funIndex = funIndex;
    this.zoom = zoom;
    this._draw();
  }

  //permet de supprimer tout les éléments du canvas
  _cleanCanvas()
  {
    this.ctx.save();//on sauve le contexte du canvas

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);//on utilise la matrice identiée pour retrouver le scale par défaut
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);//on clean le canvas

    this.ctx.restore();//on restore le canvas
  }

  fun(x, i){
    switch (i) {
      case 1:
        return Math.sin(x) - x/13;
        break;
      case 2:
        return x / (1 - Math.pow(x,2));
        break;
      default:
        return 0;
        break;
    }
  }

  drawRoot(tabRoot){
    this.ctx.strokeStyle = "rgb(0,0,0)";
    Object.keys(tabRoot).forEach(key => {
      this.ctx.beginPath();
      this.ctx.arc(this.axes.x0 - tabRoot[key] * this.axes.scale,this.axes.y0 -  0, 5, 0, 2 * Math.PI);
      this.ctx.stroke();
    });
  }
//fonction de dessin sur le canvas
  _draw() {
   let canvas = document.getElementById("canvas");

   this.axes={}
   this.ctx=canvas.getContext("2d");

   this._cleanCanvas();

   this.axes.x0 = .5*canvas.width;//point tout a gauche du canvas sur l'axe x
   this.axes.y0 = .5*canvas.height; //point tout en haut du canvas sur l'axe y

   //on applique différents facteurs en fonction de si l'utilisateurs désire zoomer la fonction
   if(this.zoom)
   {//si le graphe doit etre zoomer
     this.axes.scale = 40;
     this.axes.graduation = 5
   }
   else
   {//si le graphe ne doit pas etre zoomer
     this.axes.scale = canvas.width / 200;
     this.axes.graduation = 20;
   }

   this._showAxes();//on affiche les axes
   this.ctx.strokeStyle = "rgb(11,153,11)";
  this._funGraph(this.fun);

  }

  _funGraph(func) {
   let xx, yy;//point qui seront utilisé pour dessiner la fonction
   let x0=this.axes.x0;
   let y0=this.axes.y0;
   let scale = this.axes.scale;

   //borne de dessin de la fonction
   this.iMax = Math.round((this.ctx.canvas.width-x0));
   this.iMin = Math.round(-x0);

  //on définit l'épaisseur de la ligne et la couleur de la fonction
   this.ctx.lineWidth = 2;

   //on dessine la courbe entre this.iMin et this.iMax par pas de 0.05
   this.ctx.beginPath();
   for (let i=this.iMin;i<=this.iMax;i+=0.1)
   {
    xx = i;
    yy = scale*func(xx/scale, this.funIndex);//on calcule le point y et on applique un scale en fonction du résultat

    //si c'est la première itération de la boucle
    if(i==this.iMin)
    {
      this.ctx.moveTo(x0+xx,y0-yy);
    }
    else
    {
      this.ctx.lineTo(x0+xx,y0-yy);
    }
   }
   this.ctx.stroke();

   //affiche la graduation sur l'axe en fonction du scale
   for(let i=this.iMin; i<=this.iMax;i++)
   {
     if((i/scale) % this.axes.graduation == 0)
     {
       this.ctx.fillText((i/scale).toString(), x0 + i - 7, y0 - 5);//les valeur 5 et 7 sont prises arbitrairement pour décaler le texte de la graduation et fonction du graphe
     }
   }
  }

  //permet de dessiner les axes sur le canvas
  _showAxes() {
   let w=this.ctx.canvas.width;
   let h=this.ctx.canvas.height;
   let xmin = 0;

   this.ctx.beginPath();
   this.ctx.strokeStyle = "rgb(128,128,128)";
    // X axis
   this.ctx.moveTo(xmin, this.axes.y0);
   this.ctx.lineTo(w,this.axes.y0);
  // Y axis
   this.ctx.moveTo(this.axes.x0, 0);
   this.ctx.lineTo(this.axes.x0,h);
   this.ctx.stroke();

   //dessine la graduation sur les axes
   //7 est pris arbitrairement pour le dessin de la graduation
   //on dessine un trait tout les 20
   for(let i = xmin; i < w; i++)
   {
     if(i/this.axes.scale % this.axes.graduation == 0)
     {
       this.ctx.beginPath();
       this.ctx.moveTo(i, this.axes.y0 + 5);
       this.ctx.lineTo(i, this.axes.y0 - 5);
       this.ctx.stroke();
     }
   }
 }
}

class Dichotomie{
  constructor(index, plot){
  this.index = index;
	this.it = 0;
	this.tab = [];
	this.tabError = [];
    this.plot = plot;
	this.indexTab = 0;
	for(let i = -100; i <100; i++) //BOUCLE POUR APPELER LA FONCTION DISPLAY (DE -100 à -99, DE -99 à -98, etc)
	{
		this._calculRoots(i, i+1, i);
	}

  this._objectToArray();
  }

  _calculRoots(depart, arrive, i)
  {
	let j = 0;
    let m = 0;//sera le milieu
	if(this.index==2)//test si pas asymptote (la dichotomie n'est pas fonctionelle pour les fonctions non continue, donc on décale la borne de 0.01 pour ne pas prendre l'asymptote en compte)
	{
		if(depart == -1 )
		{
			depart = depart + 0.01;
		}
		if(depart == 1)
		{
			depart = depart + 0.01;
		}
		if(arrive == -1)
		{
			arrive = arrive - 0.01
		}
		if(arrive == 1)
		{
			arrive = arrive - 0.01
		}
	}
	let Aarrive = arrive;//Sert à tester si à la fin, la norme arrive n'a pas bougé (si c'est le cas, on n'a pas trouvé de racine, à part p-e sur la borne elle-meme et ca sera testé dans le prochain display grâce à la boucle)

	while((arrive-depart) > 0.01)//difference entre les deux bornes (on peut mettre bien plus petit)
	{
		m = (depart+arrive)/2;//on met m au milieu
		//changer la ligne du dessous de fun1 à fun2 aux 2 endroits afin de changer de graphe
		if((this.plot.fun(depart, this.index) * this.plot.fun(m, this.index)) <= 0)//si les deux bornes ont des signes différentes dans le graphe, on bouge la borne de droite (c'est sur qu'on aura une racine)
		{
			arrive = m;//On bouge la borne de droite
		}
		else
		{
			depart = m;//On bouge la borne de gauche si c'est les même signe
		}
		
		j++;
	}
	if(Aarrive == arrive)//si la borne de droite n'a pas bougé, on fait rien
	{
	}
	else//sinon, on a trouvé une racine
	{
		console.log(depart,arrive);
	this.tab[i] = depart;//on met la racine dans tab
	this.tabError[this.indexTab++] = this.errorAlgo(depart, arrive, j);
	}
  }
  
  errorAlgo(a, b, n)
  {
	return (b-a)/(Math.pow(2, n+1));
  }

  _objectToArray(){
    this.tab = Object.values(this.tab);
    this.tab = this.tab.sort(function(a, b){return a - b});
  }
}

let plot = new Plot(1, true);

function selectEvent(){
  let plotIndex = getSelectValue();
  let zoom = getRadioValue();
  plot = new Plot(plotIndex, zoom);
}

function changeEvent(){
  let plotIndex = getSelectValue();
  let zoom = getRadioValue();
  plot = new Plot(plotIndex, zoom);
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

function clickEventDichotomie()
{
  let plotIndex = getSelectValue();
  let zoom = getRadioValue();

	let racines = new Dichotomie(plotIndex, plot);
  plot.drawRoot(racines.tab);

  let roots = document.getElementById("roots");
  roots.innerHTML = '';
  roots.innerHTML += "<h2>Roots : </h2><br>";
  let i = 0;
  Object.keys(racines.tab).forEach(key => {
     roots.innerHTML += i + " : " + racines.tab[key] + " avec comme erreur : " + racines.tabError[i] + ";<br>";
	 i++;
  });
  
  console.log(racines.tabError);
}

document.addEventListener("DOMContentLoaded", function(event) {
	plot = new Plot(1, true);
});
