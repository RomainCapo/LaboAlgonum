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
	
	tabPoints[0] = generateTabPoints(cosTaylorApproximate);
	tabPoints[1] = generateTabPoints(firstDerivate);
	tabPoints[2] = generateTabPoints(secondDerivate);
	
	generateChart(tabPoints);
};

// GenerateChart
function generateChart(tabPoints)
{
	let dataPoints = [];

    for(let i = 0; i < tabPoints.length; i++)
    {
        d = {
            points: tabPoints[i],
            fnType: 'points',
            graphType: 'polyline'
            };
        dataPoints.push(d);
    }
	
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

function generateTabPoints(func)
{
	let points = [];
	
	for(let i = -5; i < 5; i+=0.1)
	{
		points.push([i,func(i)]);
	}
	
	return points;
}

// Approximate cos using Taylor
function cosTaylorApproximate(theta, iteration=50)
{
	let cos = 0;
	
	for(let n = 0; n < iteration; n++)
	{
		cos += (Math.pow(-1, n))*(Math.pow(theta, 2*n)/factor(2*n));
	}
	
	return cos;
}

// Return the factor of a number
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

function firstDerivate(theta, n=200, h=0.001)
{
    let numerator = 8*(cosTaylorApproximate(theta+h/2, n)-cosTaylorApproximate(theta-h/2,n)) - cosTaylorApproximate(theta + h, n) + cosTaylorApproximate(theta - h, n);
    let denominator = 6*h;
    return numerator / denominator;
}

function secondDerivate(theta, n=200, h=0.001)
{
    let numerator = cosTaylorApproximate(theta + h, n) + cosTaylorApproximate(theta - h, n) - 2*cosTaylorApproximate(theta, n);
    let denominator = h*h;
    return numerator / denominator;
}


