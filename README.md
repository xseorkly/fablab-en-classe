# FabLab en classe

Ressource pour les enseignants du réseau AEFE, de la petite section à la 3e : des projets de fabrication au service des séquences disciplinaires. Chaque projet remplace une séance, il ne s'ajoute pas au programme.

Conception pédagogique : **Fehmi KLABI** (EF2D Technologie) et **François Monnier** (EF1D).
Version 2.0, octobre 2026 : ajout de la rubrique « Projets & créativité ».

## Contenu

```
index.html        page du site (structure et styles)
js/dessins.js     fonctions qui dessinent les schémas SVG
js/projets.js     données : projets, volet didactique, sources, situations-problèmes, notes enseignant
js/app.js         interface : rendu des fiches, filtres, navigation, programmes 2026-2027
pdf/              une fiche enseignant et une fiche élève par projet, les deux recueils
pdf/situations/   les fiches détaillées de situations-problèmes, plus leur recueil
formation/        déroulé et diaporamas de la formation, chiffrés (s’ouvrent avec le code d’accès)
.nojekyll         indique à GitHub Pages de servir les fichiers tels quels
```

## Mettre le site en ligne avec GitHub Pages

1. Créez un dépôt public sur GitHub (par exemple `fablab-en-classe`).
2. Déposez tout le contenu de ce dossier à la racine du dépôt, y compris le fichier caché `.nojekyll`.
3. Dans **Settings → Pages**, choisissez **Deploy from a branch**, branche `main`, dossier `/ (root)`.
4. Le site est publié après une à deux minutes à l'adresse `https://<votre-compte>.github.io/fablab-en-classe/`.

## La rubrique « Projets & créativité »

Elle part d’un problème réel plutôt que d’un objet à reproduire : la démarche, la progression du cycle 1 au cycle 4, une banque de situations-problèmes filtrable, une boîte à outils de la créativité, des repères pour prototyper, tester et accompagner sans donner la solution. Chaque projet existant commence par une note enseignant « Comment aborder ce projet ? ».

Dans `js/projets.js` : `SPF_A`, `SPF_B` (fiches détaillées), `SP_A`, `SP_B` (banque), `NOTES_A`, `NOTES_B` (notes des projets), `CR_TOOLS`, `CR_PROG`, `CR_ACC`, `CR_PB` (contenus des pages).

## La rubrique « Matériel »

Organisation de l’espace en neuf zones, catalogue filtrable de 174 matériels (rôle pédagogique, exemple, niveaux, repère de sécurité vert/orange/rouge, quantité indicative), référentiel par niveau de la PS à la 2nde et trois niveaux d’équipement. Contenus repris du volume 1 « Laboratoire de créativité & FabLab » (F. Klabi, F. Monnier) : https://github.com/xseorkly/fablab. Données dans `js/projets.js`, objet `MAT`.

## L’onglet Formation

Il contient le déroulé de la formation de 3 heures, les sept défis, l’atelier réflexif et les annexes. Son contenu et les fichiers du dossier `formation/` sont chiffrés (AES-GCM, clé dérivée du code d’accès par PBKDF2) : sans le code, ils sont illisibles, même en ouvrant le code source. Le code n’est écrit nulle part dans le dépôt. Pour le changer, il faut rechiffrer le contenu.

## Modifier un projet

Les textes des projets sont dans `js/projets.js`. Les repères de programmes (textes officiels par discipline et par niveau) sont dans `js/app.js`, objet `BO` et fonction `progCell`. Ils ont été vérifiés au Bulletin officiel et sur éduscol le 1er octobre 2026 ; à revoir à chaque rentrée, car plusieurs niveaux changent de programme en 2027-2028.

Après une modification, régénérez les PDF si vous voulez qu'ils restent identiques au site.

## Licence

[Creative Commons BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.fr) : partage et adaptation autorisés, en citant les auteurs, sans usage commercial, sous la même licence.

Plusieurs projets s'inspirent de ressources de la Fondation La main à la pâte, de La Rotonde (Mines Saint-Étienne) et de la LPO, citées dans les fiches concernées.
