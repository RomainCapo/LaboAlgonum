/*
Algorithme numérique - Labo 5

Auteurs :

- Capocasale Romain
- Moulin Vincent
- Jurasz Loic

Date de création : 10.04.2019

Classe : INF2dlm-A

Équipe numéro : 3
*/

/**
 * cette meéthode permet d'effectuer l'approximation d'une intégrale avec la méthode de simpson.
 * @param  {function} f fonction a integrer
 * @param  {integer} a borne inferieur
 * @param  {integer} b borne supérieur
 * @param  {integer} n nombre d'itération
 * @return {array}   tableau contenant le resultat ainsi que le temps de calcul effectué
 */
function simpson(f, a, b, n)
{

  let evenSum = 0;
  let oddSum = 0;

  let t0 = null;
  let t1 = null;

  t0 = performance.now();
  let h = (b - a) / n; // calcul du pas
  // Somme de 1 à n
  for (i = 1; i < n; ++i)
  {
    //valeur du x
    let x = a + i * h;
    if ((i % 2) == 0) {
      evenSum += f(x);
    } else {
      oddSum += f(x);
    }
  }
  let result = h / 3 * (f(a) + 4 * oddSum + 2 * evenSum + f(b));
  t1 = performance.now();
  let timeElapsed = t1 - t0;

  return {
    'resultat' : result.toFixed(17),
    'timeResultat' : 1000*timeElapsed.toFixed(5)
  }
}

/**
 * permet d'appeler la méthode de simpson avec les différentes parametre et effectue l'affichage
 */
function calculatePi(){
  let result = simpson(function(x){
    return 4 / (1 + (Math.pow(x, 2)));
  }, 0, 1, 500);

  //affichage du résultat
  document.getElementById('result').innerHTML = result.resultat;
  document.getElementById('timeResult').innerHTML = result.timeResultat;
}
