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
	myFunction()
};

function myFunction()
{
	console.log("test")
	let p = functionPlot({
	  title: 'cos(x) - cos\'(x) - cos\'\'(x)',
	  target: '#chart',
	  width: 800,
	  height: 500,
	  xAxis: {
		label: 'x - axis',
		domain: [-6, 6]
	  },
	  yAxis: {
		label: 'y - axis'
	  },
	  data: [
		{ fn: 'cos(x)', color: 'red' },
		{ fn: '-x', color : 'blue' },
		{ fn: 'x^2', color : 'green' }
	  ]
	})
}
