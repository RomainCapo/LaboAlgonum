class Matrix{
  constructor(data){
    this.matrix = [];
    this.size = 0;

    this._load(data);
  }

  _load(data){
    data = JSON.parse(data);

    //recupération des infos contenu dans le fich
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

  /*//trouve la valeur maximal dans une collone de la matrice, indexLineStart permet de preciser a partir de quelle ligne on prends les valeurs pour le maximum
  argmax(indexColumn, indexLineStart = 0){
    let tmp = [];
    for(let i = 0; i < this.size; i++)
    {
      if(i >= indexLineStart)
      {
        tmp[i] = this.matrix[i][indexColumn];
      }
    }
    //trouve la valeur maximum dans un objet javascript
    //code repris de https://stackoverflow.com/questions/11142884/fast-way-to-get-the-min-max-values-among-properties-of-object
    let max = Object.values(tmp).sort((prev, next) => next - prev)[0];
    return this._getKeyByValue(tmp, max);
  }*/

  swapRows(i,j){
    this.matrix[j] = [this.matrix[i], this.matrix[i] = this.matrix[j]][0]; // Swap 2 rows
  }

  //Substract factor*iRowRef to iRowSub
  substractLineFactor(iRowRef, iRowSub, factor, iColumnStart=0){
    for(let i=iColumnStart; i<this.size+1; ++i) {
      this.matrix[iRowSub][i] -= this.matrix[iRowRef][i] * factor;
    }
  }

  argmax1(iColumn,iRowStart=0){ //Find the greatest element in the column starting at iRowStart abd return the indice of this line
    let iMax=iRowStart;
    let max = Math.abs(this.matrix[iRowStart][iColumn]);
    let tempMax = 0;

    for(let i=iRowStart+1;i<this.size;++i){
      tempMax = Math.abs(this.matrix[i][iColumn]);
      if(max < tempMax){
        max = tempMax,
        iMax = i;
      }
    }
    return iMax;
  }
}

class MatrixSolver{
  constructor(){
    this.x = [];
  }

    _gaussMatrixTransform(matrix){

      let m = matrix.size;//nombre de ligne
      let n = matrix.matrix[0].length;//nombre de collone

      let h = 0;
      let k = 0;
      let f = 0;
      let i_max = 0;

      while(h < m && k < n)
      {
        i_max = matrix.argmax1(k,h);
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
            matrix.substractLineFactor(h,i,f,k+1);
          }
          h++;
          k++;
        }
      }
  }

}

function readTextFile(file, callback) {
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

function getJson(){

}



/*function getRadioValue(){
  let radios = document.getElementsByName('matrix');

  for(let i = 0; i < radios.length; i++)
  {
    if(radios[i].checked)
    {
      console.log(radios[i].value);
    }
  }
}

function changeEvent(){
  getRadioValue();
}*/

document.addEventListener("DOMContentLoaded", function(event) {
  readTextFile("json/matrice_3x3.json", function(text){
      let matrix = new Matrix(text);
      //console.log(matrix);
      //console.log(matrix.argmax1(1,1));
      let solver = new MatrixSolver();
      solver._gaussMatrixTransform(matrix);
      console.log(matrix.matrix);
  });
});
