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
	generateChart()
};

function generateChart()
{
	dataPoints = [];

    for(let i = 0; i < 15; i++)
    {
        d = {
            points: [
			  [1, 1],
			  [2, 1],
			  [2, 2],
			  [1, 2],
			  [1, 1]
			],
            fnType: 'points',
            graphType: 'polyline'
            };
        dataPoints.push(d);
    }

	//console.log(cosTaylorApproximate(2*Math.PI));
	
	let p = functionPlot({
	  target: '#chart',
	  width: 700,
	  height: 400,
	  grid: true,
	  xAxis: {
		label: 'x - axis',
		domain: [-6, 6]
	  },
	  yAxis: {
		label: 'y - axis',
		domain: [-4, 4]
	  },
	  data: dataPoints
	})
}

function cosTaylorApproximate(theta, iteration=50)
{
	let cos = 0;
	
	for(let n = 0; n < iteration; n++)
	{
		cos += (Math.pow(-1, n))*(Math.pow(theta, 2*n)/factor(2*n));
	}
	
	return cos;
}

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

function firstDerivate(f, theta, n, h)
{
    let numerator = 8*(f(theta+h/2, n)-f(theta-h/2,n)) - f(theta + h, n) + f(theta - h, n);
    let denominator = 6*h;
    return numerator / denominator;
}

function secondDerivate(f, theta, n, h)
{
    let numerator = f(theta + h, n) + f(theta - h, n) - 2*f(theta, n);
    let denominator = h*h;
    return numerator / denominator;
}


