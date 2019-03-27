/* 
Algorithme numérique - Labo 3

Auteurs : 

- Capocasale Romain
- Moulin Vincent
- Jurasz Loic

Date de création : 20.03.2019

Classe : dlm-A

Équipe numéro : 3
*/
class Matrix{
  constructor(data){
    this.matrix = [];
    this.size = 0;

    this._load(data);
  }

  //permet de parser le contenu du fichier JSON puis de crééer la matrice via
  // un tableau 2 dimension
  _load(data){
    data = JSON.parse(data);

    //recupération des infos contenu dans le fichier
    this.size = data.n[0];
    let A = data.A.splice(0);
    let B = data.B.splice(0);

    //transformation en tableau 2 dimension selon la taille de la matrice
    while(A.length)
    {
      this.matrix.push(A.splice(0,this.size).concat(B.splice(0,1)));
    }
  }

//retourne la clé d'un objet selon la valeur
  _getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

  //trouve la valeur maximal dans une collone de la matrice, indexLineStart permet de preciser a partir de quelle ligne on prends les valeurs pour le maximum
  argmax(indexColumn, indexLineStart = 0){
    let tmp = [];
    for(let i = 0; i < this.size; i++)
    {
      if(i >= indexLineStart)
      {
        tmp[i] = Math.abs(this.matrix[i][indexColumn]);
      }
    }
    //trouve la valeur maximum dans un objet javascript
    //code repris de https://stackoverflow.com/questions/11142884/fast-way-to-get-the-min-max-values-among-properties-of-object
    let max = Object.values(tmp).sort((prev, next) => next - prev)[0];
    return this._getKeyByValue(tmp, max);
  }

  //echange 2 ligne de la matrice selon i et j
  swapRows(i,j){
    let tmp = this.matrix[i];
    this.matrix[i] = this.matrix[j];
    this.matrix[j] = tmp;
  }
}

class MatrixSolver{
  constructor(matrix){
    this.x = [];//contient les résultats du système d'équation

	
	let startDate = new Date();
    startDate = startDate.getMilliseconds();
	
    this._gaussMatrixTransform(matrix);
    this._findSolution(matrix);
	
	let endDate = new Date();
	endDate = endDate.getMilliseconds();
	
	var diff = endDate - startDate;
	console.log(diff);
	diff = 'Le temps de calcul est de : ' + diff + ' millisecondes';
	document.getElementById('time').innerHTML = diff;
	
    this._displaySolutions(this.x); 
  }

  //effectue la transformation de gauss sur une matrice afin de la rendre triangulaire
  // https://en.wikipedia.org/wiki/Gaussian_elimination
  _gaussMatrixTransform(matrix){
      let m = matrix.size;//nombre de ligne
      let n = matrix.matrix[0].length;//nombre de collone

      let h = 0;
      let k = 0;
      let f = 0;
      let i_max = 0;

      while(h < m)
      {
        i_max = matrix.argmax(k,h);
        if(matrix.matrix[i_max][k] == 0)
        {
          console.log("pas de solution constante");
        }
        else
        {
          matrix.swapRows(h, i_max);

          for(let i=h+1; i<m; i++)
          {
            f = matrix.matrix[i][k] / matrix.matrix[h][k];
            matrix.matrix[i][k] = 0;

            for(let j=k+1; j<matrix.size+1; j++) {
              matrix.matrix[i][j] -= matrix.matrix[h][j] * f;
            }
          }
          h++;
          k++;
        }
      }
  }

  //cherche les solutions du système d'equation a partir d'une matrice triangulaire
  _findSolution(matrix){
    for (let i=matrix.size-1; i >= 0; i--) {
        this.x[i] = matrix.matrix[i][matrix.size]/matrix.matrix[i][i];
        for (let j=i-1; j >= 0; j--) {
            matrix.matrix[j][matrix.size] -= matrix.matrix[j][i] * this.x[i];
        }
    }
  }

  //Méthode qui s'occupe de l'affichage des résultats du système d'équations
  _displaySolutions(equationSolutionsArray)
  {
      let innerText = "";

      innerText += "Résultats du système d'équations : <br>";

      for(let i = 0; i < equationSolutionsArray.length; i++)
      {
        innerText += "<strong>X<sub>" + i + "</sub></strong> : " + equationSolutionsArray[i] + "<br>";
      }

      innerText += "<hr>";

      document.getElementById('displaySolutions').innerHTML = innerText;
  }
}

//permet de lire le contenu du fichier json
//méthode trouver sur https://stackoverflow.com/questions/19706046/how-to-read-an-external-local-json-file-in-javascript/19706080
function readJsonFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

//gestion de l'évnement lors du clic sur le bouton calculer
function clickEvent(){
  readJsonFile("json/" + getFileName(), function(text){
      let matrix = new Matrix(text);
      let solver = new MatrixSolver(matrix);
  });
}

//retourne la valeur du radioButton selectionné
function getRadioValue(){
  let radios = document.getElementsByName('matrix');

  for(let i = 0; i < radios.length; i++)
  {
    if(radios[i].checked)
    {
      return radios[i].value
    }
  }
}

//récupére le nom du fichier selon la valeur du radioButton selectionné
function getFileName(){
  let filename = "";
  switch (getRadioValue()) {
    case "3x3":
      filename = "matrice_3x3.json";
      break;
    case "3x3A0":
      filename = "matrice_avecPB_3x3_avec_A_a_0.json";
      break;
    case "3x3Swap":
      filename = "matrice_avecPB_3x3_avec_SwapObligatoire.json";
      break;
    case "210x210":
      filename = "matrice_210x210.json";
      break;
    case "310x310":
      filename = "matrice_310x310.json";
      break;
  }
  return filename;
}

document.addEventListener("DOMContentLoaded", function(event) {

});
