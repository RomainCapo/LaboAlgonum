

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
  this.index = index;//index de la fonction a dessiner
	this.tab = [];//tableau contenant les racines
	this.tabError = [];//tableau contenant les erreurs du calcul des racines
  this.plot = plot;
	this.indexTab = 0;

  this._calculAsy();//calcule des asymptotes

	for(let i = -100; i <100; i++) //BOUCLE POUR APPELER LA FONCTION DISPLAY (DE -100 à -99, DE -99 à -98, etc)
	{
		this._calculRoots(i, i+1, i);
	}

  this._getFinalRootsArray();
  //this._floatArrayDiff(this.tab, this.asymptote, 0.1);
  }

//permet de calculer les asymptotes afin de les retirer du resultat final
//car les asymptotes ne doivent pas etre compté comme des racines
//point toFixed permet d'arrondir le nombre a 2 chiffre après la virgule
//cette méthode ne fonctionne que pour les fonctions avec des asymptotes entières
//on rappelle que la méthode de dichotomie n'est pas fait pour etre utilisé sur des fonctions non continues
  _calculAsy(){
  this.asymptote = [];
    for(let i = -100; i<100;i+=0.1)
    {
      let y = this.plot.fun(i.toFixed(2), this.index);//valeur retourner par la fonction
      if(y == "Infinity" || y == "-Infinity" || y == "undefined")//si la fonction a une de ces valeurs c'est qu'il y a une asymptote
      {
        this.asymptote.push(parseFloat(i.toFixed(2)));//on place l'asymptote dans le tableau
      }
    }
    console.log(this.asymptote);
  }

  _calculRoots(depart, arrive, i)
  {
	  let j = 0;
    let m = 0;//sera le milieu
	  let Aarrive = arrive;//Sert à tester si à la fin, la norme arrive n'a pas bougé (si c'est le cas, on n'a pas trouvé de racine, à part p-e sur la borne elle-meme et ca sera testé dans le prochain display grâce à la boucle)

  	while((arrive-depart) > 0.01)//difference entre les deux bornes (on peut mettre bien plus petit)
  	{
  		m = (depart+arrive)/2;//on met m au milieu

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
  	if(Aarrive != arrive)//si la borne de droite a bougé on a trouvé une racine
  	{
  	this.tab[i] = depart;//on met la racine dans tab
  	this.tabError[this.indexTab++] = this.errorAlgo(depart, arrive, j);
  	}
  }

  //permet de calculer l'erreur effectuer par la methode de dichotomie
  errorAlgo(a, b, n)
  {
	return (b-a)/(Math.pow(2, n+1));
  }

  //permet d'obtenir le tableau des racines dans le format voulu
  _getFinalRootsArray(){
    this.tab = Object.values(this.tab);//on recupere les valeurs contenu dans l'objets dans le but de le transformer en tableau
    this.tab = this.tab.sort(function(a, b){return a - b});//on trie le tableau dans l'ordre croissant

    //prototype permettant de rajouter la fonction diff pour les tableaux
    Array.prototype.diff = function(a) {
      return this.filter(function(i) {return a.indexOf(i) < 0;});
    };

    this.tab = this.tab.diff(this.asymptote);//on enleve les asymptotes au racines trouvée préceddement*/
  }

  /*_floatArrayDiff(array1, array2, precision){
    let tmp = [];
    array1[1] = 1.01;
    console.log("array1: " + array1);
    for(let i = 0; i< array1.length; i++)
    {
      for(let j = 0; j < array2.length; j++)
      {
        if(!(array1[i] >= array2[j] - 0.1 && array1[i] <= array2[j] + 0.1))
        {
          console.log(i);
        }
      }
    }
    console.log(tmp);
  }*/
}

let plot = new Plot(1, true);//graphe de base

//lors de la selection d'un graphe dans la select box
function selectEvent(){
  let plotIndex = getSelectValue();
  let zoom = getRadioValue();
  plot = new Plot(plotIndex, zoom);
}

//lors d'un changement d'etat des radios buttons
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
  plot.drawRoot(racines.tab);//dessin des racines

  let roots = document.getElementById("roots");
  roots.innerHTML = '';
  roots.innerHTML += "<h2>Roots : </h2><br>";
  let i = 0;

  Object.keys(racines.tab).forEach(key => {
     roots.innerHTML += i + " : " + racines.tab[key] + " avec comme erreur : " + racines.tabError[i] + ";<br>";
	 i++;
 });
}

document.addEventListener("DOMContentLoaded", function(event) {
	plot = new Plot(1, true);
});
