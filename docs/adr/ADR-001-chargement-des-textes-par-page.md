# ADR-001 · Charger les textes de chaque page avec la page

- Statut : accepté
- Date : 2026-10-01
- App : `site`

## Contexte

Les conventions front jp-way enregistrent toutes les ressources i18n, dans toutes les langues, au démarrage de l'application. Sur le site Soliance, cela représentait 234 Ko de textes (10 espaces de noms × `fr` et `en-US`) dans le JavaScript principal, téléchargé sur chaque page, soit 593 Ko au total. Or le site n'affiche que le français : `en-US` n'est jamais servi. Le référencement est l'objectif principal du site, et le poids du JavaScript pèse sur les Core Web Vitals demandés par le cahier des charges (§6, « Core Web Vitals verts sur mobile »).

## Décision

- Seul l'espace de noms `common` (en-tête, pied de page, messages partagés) est chargé au démarrage, en français.
- Chaque autre espace de noms est enregistré par un module `src/lib/i18n/namespaces/<ns>.ts` (`registerNamespace`), importé **en première ligne** de la page qui l'utilise et de tout fichier qui lit un texte au chargement du module (les schémas zod des formulaires). Le texte voyage ainsi dans le morceau de code paresseux de la page.
- Les fichiers `en-US` restent tenus à jour, clé pour clé, comme l'exige la convention, mais ne sont pas embarqués tant qu'aucune page anglaise n'existe.

## Alternative écartée

Garder l'enregistrement statique de toutes les langues (convention jp-way telle quelle) : plus simple, mais 190 Ko de JavaScript en plus sur chaque page pour des textes jamais affichés.

## Conséquences

- JavaScript principal : 593 Ko → 403 Ko (130 Ko compressé).
- Un nouvel espace de noms demande un module dans `src/lib/i18n/namespaces/` et son import en première ligne de la page. Un oubli se voit immédiatement : la page affiche des clés au lieu du texte, et l'audit du HTML pré-rendu les détecte.
- Ajouter une version anglaise du site demandera d'enregistrer `en-US` de la même façon.
