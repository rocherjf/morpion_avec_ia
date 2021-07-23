/*
 * Variables globales utiles pour le jeu
 */

// Gestion du plateau de jeu
var plateau = [
  ['.', '.', '.'],
  ['.', '.', '.'],
  ['.', '.', '.']
];

// Gestion du joueur
var indiceJoueurCourant = 1;
var joueurs = ['X', 'O'];

var INDICE_JOUEUR_IA = 0;
var INDICE_JOUEUR_HUMAIN = 1;

// Gestion du déroulé de la partie
var partieTerminee = false;


// variable contenant un pointeur vers la balise p qui affiche le résultat de la partie
var resultatPartie;

// The setup() function is called once when the program starts
function setup() {

  /* Tracer la zone de jeu utilisé dans le navigateur */
  createCanvas(400, 400);

  createButton('Je commence').mousePressed(jeCommence);
  createButton("L'IA commence").mousePressed(iaCommence);

  resultatPartie = createP('');
  resultatPartie.style('font-size', '32pt');

}

function jeCommence() {
  startNewGame(INDICE_JOUEUR_HUMAIN);
}

function iaCommence() {
  startNewGame(INDICE_JOUEUR_IA);
}

function startNewGame(indicePremierJoueur) {

  plateau = [
    ['.', '.', '.'],
    ['.', '.', '.'],
    ['.', '.', '.']
  ];

  indiceJoueurCourant = indicePremierJoueur;

  partieTerminee = false;

  // Effacer l'affichage des résultats
  if(resultatPartie){
    resultatPartie.html('');
  }
  
  clear();

  if(indiceJoueurCourant === INDICE_JOUEUR_IA){
    completerPlateauDeJeu(selectionneCaseIA());
  }
}


// draw() loops forever, until stopped with the noLoop();
// obligatoire 
function draw() {
  let w = width / 3;
  let h = height / 3;

  // Toutes les prochains traits auront une épaisseur de 4
  strokeWeight(4);
  line(w, 0, w, height);
  line(w * 2, 0, w * 2, height);
  line(0, h, width, h);
  line(0, h * 2, width, h * 2);

}

// fonction déclenchée lors d'un clic effectué avec la souris
// la position récupérée est celle du moment où on relache la souris
function mouseClicked() {
  if (!partieTerminee && mouseX <= width && mouseY <= height) {

    let caseSelectionnee = recupererCaseSelectionnee(mouseX, mouseY);

    if (!estCeQueLaCaseEstVide(plateau, caseSelectionnee)) {
      return;
    }

    completerPlateauDeJeu(caseSelectionnee);

    afficherScoreSiPartieTerminee();

    // Gestion du tour de l'IA 
    if (!partieTerminee) {
      completerPlateauDeJeu(selectionneCaseIA());

      afficherScoreSiPartieTerminee();
    }
  }
}

// détermine quelle est la case selectionnée par l'utilisateur
function recupererCaseSelectionnee(positionSourisX, positionSourisY) {
  return {
    x: Math.trunc(positionSourisX / (width / 3)),
    y: Math.trunc(positionSourisY / (height / 3))
  };
}

// case disponible ?
function estCeQueLaCaseEstVide(plateauATester, caseChoisie) {
  return plateauATester[caseChoisie.x][caseChoisie.y] === '.';
}

// compléte le plateau de jeu avec le choix du joueur
function completerPlateauDeJeu(caseChoisie) {
  if (plateau[caseChoisie.x][caseChoisie.y] === '.') {
    dessinerChoixJoueur(caseChoisie);
  }else{
    console.error(`case occupée`);
  }
}

function dessinerChoixJoueur(caseChoisie) {
  if (joueurs[indiceJoueurCourant] === 'X') {
    dessinerCroix(caseChoisie);
  } else {
    dessinerCercle(caseChoisie);
  }
  indiceJoueurCourant = (indiceJoueurCourant + 1) % 2;
}

function dessinerCroix(caseChoisie) {
  let w = width / 3;
  let h = height / 3;
  let r = w / 4;
  let inc = w / 2;
  line(w * caseChoisie.x - r + inc, h * caseChoisie.y - r + inc, w * caseChoisie.x + r + inc, h * caseChoisie.y + r + inc);
  line(w * caseChoisie.x + r + inc, h * caseChoisie.y - r + inc, w * caseChoisie.x - r + inc, h * caseChoisie.y + r + inc);
  plateau[caseChoisie.x][caseChoisie.y] = 'X';
}


function dessinerCercle(caseChoisie) {
  let w = width / 3;
  let h = height / 3;
  let r = w / 3;
  let x = w * caseChoisie.x + w / 2;
  let y = h * caseChoisie.y + h / 2;
  ellipse(x, y, r * 2);
  plateau[caseChoisie.x][caseChoisie.y] = 'O';
}

function afficherScoreSiPartieTerminee() {

  let result = presenceGagnant(plateau);
  if (result != null) {
    partieTerminee = true;

    if (result === 'egalité') {
      resultatPartie.html('Egalité !');
    } else {
      resultatPartie.html(`Victoire de ${result} !`);
    }
  }
}


function presenceGagnant(plateauATester) {
  let gagnant = null;

  // horizontale
  for (let i = 0; i < 3; i++) {
    if (equals3(plateauATester[i][0], plateauATester[i][1], plateauATester[i][2])) {
      gagnant = plateauATester[i][0];
    }
  }

  // Verticale
  for (let i = 0; i < 3; i++) {
    if (equals3(plateauATester[0][i], plateauATester[1][i], plateauATester[2][i])) {
      gagnant = plateauATester[0][i];
    }
  }

  // Diagonale
  if (equals3(plateauATester[0][0], plateauATester[1][1], plateauATester[2][2])) {
    gagnant = plateau[0][0];
  }
  if (equals3(plateauATester[2][0], plateauATester[1][1], plateauATester[0][2])) {
    gagnant = plateauATester[2][0];
  }

  if (gagnant === null && plateauComplet(plateauATester)) {
    gagnant = 'egalité';
  }
  return gagnant;
}

function equals3(a, b, c) {
  return a == b && b == c && a != '.';
}

function plateauComplet(plateauATester) {

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (plateauATester[i][j] === '.') {
        return false;
      }
    }
  }
  return true;
}


function selectionneCaseIA() {

  // Construction des choix possibles
  let casesDisponibles = [];
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      if (plateau[x][y] === '.') {
        casesDisponibles.push({
          x,
          y
        });
      }
    }
  }

  // Traitement des choix possibles

  // gagnant en 1 coup ?
  let coupGagnant = renvoyerCoupGagnantEnUnTour(casesDisponibles, INDICE_JOUEUR_IA);
  if (coupGagnant !== null) {
    console.info(`IA : victoire `);
    return coupGagnant;
  } 

  // perdant en 1 coup ?
  let coupPourBloquerAdversaire = renvoyerCoupGagnantEnUnTour(casesDisponibles, INDICE_JOUEUR_HUMAIN);
  if (coupPourBloquerAdversaire !== null) {
    console.info(`IA : empécher victoire adverse`);
    return coupPourBloquerAdversaire;
  }

  // si le centre est libre, le prendre
  if(plateau[1][1] === '.'){
    return {x:1,y:1};
  }

  // prendre le coin si ces deux voisins orthogonaux sont libres
  if(plateau[0][0] === '.' && plateau[0][1] === '.' && plateau[1][0] === '.') {
    return {x:0,y:0};
  }

  if(plateau[2][0] === '.' && plateau[1][0] === '.' && plateau[2][1] === '.') {
    return {x:2,y:0};
  }

  if(plateau[0][2] === '.' && plateau[0][1] === '.' && plateau[1][2] === '.') {
    return {x:0,y:2};
  }

  if(plateau[2][2] === '.' && plateau[0][1] === '.' && plateau[1][0] === '.') {
    return {x:2,y:2};
  }
  
  // sinon n'importe quel case fait l'affaire
  return casesDisponibles[0];
}

function renvoyerCoupGagnantEnUnTour(casesDisponibles, indiceJoueurATester) {

  let coupGagnant = null;
  casesDisponibles.forEach(element => {
    let plateauMisAJour = renvoyerPlateauMisAJour(plateau, element, indiceJoueurATester);
    if (presenceGagnant(plateauMisAJour) === joueurs[indiceJoueurATester]) {
      coupGagnant = element;
    }
  });

  return coupGagnant;
}

function renvoyerPlateauMisAJour(plateau, cellule, indiceJoueur) {

  // Est ce que la cellule est vide ?
  if (!estCeQueLaCaseEstVide(plateau, cellule)) {
    console.error('case déjà utilisée');
    return;
  }

  // copie du plateau fournit en paramètre
  var plateauMisAJour = plateau.map(function(ligne) {
    return ligne.slice();
  });

  // Mise à jour du plateau
  plateauMisAJour[cellule.x][cellule.y] = joueurs[indiceJoueur];

  return plateauMisAJour;
}