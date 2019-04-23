/* 
Algorithme numérique - Labo 4

Auteurs : 

- Capocasale Romain
- Moulin Vincent
- Jurasz Loic

Date de création : 27.03.2019

Classe : dlm-A

Équipe numéro : 3
*/

window.onload = function(){
	let tabPoints = [];
	
	//genere les 3 tableau de point pour les 3 fonctions
	tabPoints[0] = generateTabPoints(cosTaylorApproximate);
	tabPoints[1] = generateTabPoints(firstDerivate);
	tabPoints[2] = generateTabPoints(secondDerivate);
	
	//dessin du graphe
	generateChart(tabPoints);
};

//genere le graphe a partir d'un tableau de tableau de point
function generateChart(tabPoints)
{
	let dataPoints = [];

	//on parcours le tableau contenant les tableau de points
    for(let i = 0; i < tabPoints.length; i++)
    {
		//objet javascript representant un point du graphe
        d = {
            points: tabPoints[i],
            fnType: 'points',
            graphType: 'polyline'
            };
        dataPoints.push(d);//on met les points dans le tableau
    }
	
	//on dessine le graphe avec certain parametre
	let p = functionPlot({
	  target: '#chart',
	  width: 700,
	  height: 400,
	  grid: true,
	  xAxis: {
		label: 'x - axis',
		domain: [-5, 5]
	  },
	  yAxis: {
		label: 'y - axis',
		domain: [-2.5, 2.5]
	  },
	  disableZoom: true,
	  data: dataPoints
	})
}

//permet de generer un tableau de point d'un fonction entre -5 et 5
function generateTabPoints(func, xmin=-5, xmax=5)
{
	let points = [];
	
	for(let i = xmin; i < xmax; i+=0.1)
	{
		points.push([i,func(i)]);
	}
	
	return points;
}

//Approximation de la fonction cosinus via la serie de taylor
function cosTaylorApproximate(theta, iteration=50)
{
	let cos = 0;
	
	for(let n = 0; n < iteration; n++)
	{
		cos += (Math.pow(-1, n))*(Math.pow(theta, 2*n)/factor(2*n));
	}
	
	return cos;
}

//retourne le factoriel d'un nombre
function factor(n)
{
	if (n == 0) {
		return 1;
	}
	else 
	{
		return n * factor(n-1);
	} 
}

//permet de calculer la 1ere derivée du cos
function firstDerivate(theta, n=200, h=0.001)
{
    let numerator = 8*(cosTaylorApproximate(theta+h/2, n)-cosTaylorApproximate(theta-h/2,n)) - cosTaylorApproximate(theta + h, n) + cosTaylorApproximate(theta - h, n);
    let denominator = 6*h;
    return numerator / denominator;
}

//permet de calculer la 2eme derivée du cos
function secondDerivate(theta, n=200, h=0.001)
{
    let numerator = cosTaylorApproximate(theta + h, n) + cosTaylorApproximate(theta - h, n) - 2*cosTaylorApproximate(theta, n);
    let denominator = h*h;
    return numerator / denominator;
}


