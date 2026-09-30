---
app: site
role: frontend
chemin: apps/site
layout: monorepo
depot: ethanlaloum/soliance-enr
branche: main
sha: f8a99a94770f9e514bffc3a43dd8dc7d114c5102
sha_portee: app
sha_depot: f8a99a94770f9e514bffc3a43dd8dc7d114c5102
genere_le: 2026-09-30T00:00:00Z
version_carte: 3
non_commites: 0
contextes: []
barreaux: [unit]
tests: { unit: 0, int-repo: 0, int-http: 0, journey: 0, e2e: 0 }
---

# Carte · site

_Index, pas une copie du code. Pour un détail absent d'ici, dépêcher `code-scout` sur une question précise._

**Avertissement : aucun remote `origin` configuré** (`git remote get-url origin` échoue). Le champ `depot` reprend `repo.slug` de la config et n'a pas pu être comparé au dépôt réel.

Contenu de `apps/site` : un unique `.gitkeep`. Ni `package.json`, ni `src/`, ni configuration de test.

## Domaines

app vide — projet neuf. Aucun domaine `src/app/<domain>/` ; `contextes: []`.

## Vocabulaire

app vide — projet neuf. Aucun terme porté par le code.

## Entités

app vide — projet neuf.

## Ports

app vide — projet neuf.

## Adaptateurs

app vide — projet neuf.

## Use-cases et epics

app vide — projet neuf.

## Slices et chemins d'état

app vide — projet neuf.

## Sélecteurs

app vide — projet neuf.

## Routes et gardes

app vide — projet neuf.

## Espaces de noms i18n

app vide — projet neuf.

## Registres

app vide — projet neuf. Aucun des quatre registres (`dependencies.interface.ts`, `buildDependencies.ts`, `epics/`, `coreReducer.ts` / `AppState.ts`) n'existe ; aucun désaccord à signaler.

## Inventaire de tests

| Barreau | Glob | Fichiers | Spécifications taguées | Trous |
|---|---|---|---|---|
| unit | `src/**/*.unit.spec.ts` | 0 | 0 | aucun runner installé — app vide, projet neuf |
| int-repo | — | 0 | — | barreau non déclaré |
| int-http | — | 0 | — | barreau non déclaré |
| journey | — | 0 | — | barreau non déclaré |
| e2e | — | 0 | — | barreau non déclaré (porté par l'app `e2e`) |

Hexagone front à dimensionner par le premier build : 0 epic, 0 slice, 0 sélecteur, 0 gateway.

## Dette

| Constat | Chemin:ligne | Conséquence |
|---|---|---|
| Aucun runner unitaire installé (vitest attendu, `frontend-conventions/testing.md` §2) ; barreau `unit` déclaré mais 0 fichier | `apps/site/.gitkeep:1` | le premier build doit installer et configurer le runner avant tout cas `unit` ; aucun exemple ne peut être couvert d'ici là |
| Aucun `package.json` dans l'app | `apps/site/.gitkeep:1` | aucune commande de test ni de build déclarée (`commands: {}`) ; le premier build les crée |
