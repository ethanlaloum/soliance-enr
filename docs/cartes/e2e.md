---
app: e2e
role: e2e
chemin: apps/e2e
layout: monorepo
depot: ethanlaloum/soliance-enr
branche: main
sha: f8a99a94770f9e514bffc3a43dd8dc7d114c5102
sha_portee: app
sha_depot: f8a99a94770f9e514bffc3a43dd8dc7d114c5102
genere_le: 2026-09-30T20:31:48Z
version_carte: 3
non_commites: 0
contextes: []
barreaux: [e2e]
tests: { unit: 0, int-repo: 0, int-http: 0, journey: 0, e2e: 0 }
---

# Carte · e2e

_Index, pas une copie du code. Pour un détail absent d'ici, dépêcher `code-scout` sur une question précise._

⚠ Aucun remote `origin` configuré (`git remote get-url origin` échoue) : `depot: ethanlaloum/soliance-enr` vient de `repo.slug` et n'a pas pu être comparé au clone.

_App vide — projet neuf : `apps/e2e` ne contient que `.gitkeep`. Ni `package.json`, ni `playwright.config.ts`, ni `tests/`, `src/pages/`, `src/stack/`, `src/seed/`. Aucun contexte borné (`contextes: []`)._

## Cible et pile réelle

App vide — projet neuf. Aucun `globalSetup`, aucun `webServer`, aucun sélecteur de cible.
Contexte du projet : la cible est `apps/site`, un site statique prérendu, sans api ni base de données. Docker est absent de cette machine (`outils.docker: false`). Aucune contrainte codée en dur à ce jour.

## Parcours couverts

App vide — projet neuf. Aucun fichier de spec, aucun tag `@SPEC-nnn`.

## Objets de page

App vide — projet neuf. Aucune classe, aucun nom accessible à confronter aux écrans d'une spec.

## Amorçage des données

App vide — projet neuf. Sans backend ni base, l'amorçage par endpoints admin de données de test (`TestDataClient`) ne s'applique pas pour l'instant ; aucun `Seeder` ni `TestDataClient`.

## Inventaire de tests

| Barreau | Glob | Fichiers | Spécifications taguées | Trous |
|---|---|---|---|---|
| e2e | `tests/real/**/*.spec.ts` | 0 | 0 | app vide — projet neuf ; Playwright non installé |
| unit | — | 0 | — | barreau non déclaré par cette app |
| int-repo | — | 0 | — | barreau non déclaré par cette app |
| int-http | — | 0 | — | barreau non déclaré par cette app |
| journey | — | 0 | — | barreau non déclaré par cette app |

Contrainte d'exécution : aucune commande déclarée (`commandes: {}`).

## Dette

| Constat | Chemin:ligne | Conséquence |
|---|---|---|
| Playwright n'est pas installé : ni `package.json` ni `playwright.config.ts` | `apps/e2e/.gitkeep:1` | le premier build portant un barreau e2e devra d'abord installer et configurer Playwright selon `e2e-conventions` avant toute spec |
| Aucune pile bootable : pas de `globalSetup`, pas de `webServer` vers `apps/site`, Docker absent | `apps/e2e/.gitkeep:1` | les exemples visibles à l'écran ne peuvent pas être planifiés au barreau e2e tant que la pile n'est pas définie ; barreaux int-repo, journey et e2e signalés non exécutables par `jp-context` |
| Aucun remote git `origin` | `jp-way.config.json:1` | le `depot` du cadre ne peut pas être vérifié ; création de PR et d'issues impossible tant qu'il n'existe pas |
