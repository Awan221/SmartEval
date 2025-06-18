
# SmartEval - Plateforme de correction automatique d'exercices en bases de données

SmartEval est une application web intelligente permettant l’évaluation automatisée des réponses d’étudiants à des examens en bases de données. Elle offre une interface intuitive aux enseignants pour créer des évaluations, recevoir des soumissions au format PDF, et obtenir des corrections générées par une intelligence artificielle.

## Fonctionnalités principales

- Authentification avec rôles (professeur et étudiant)
- Création et gestion d'examens avec questions ouvertes
- Soumission de copies au format PDF par les étudiants
- Correction automatique via un modèle DeepSeek exécuté localement via Ollama
- Génération de notes et de feedback détaillé pour chaque réponse
- Tableau de bord personnalisé pour étudiants et professeurs
- Statistiques globales et rapports de performance

## Technologies utilisées

| Composant        | Technologies                         |
|------------------|--------------------------------------|
| Frontend         | React.js                             |
| Backend          | Django, Django REST Framework        |
| Intelligence artificielle | DeepSeek via Ollama             |
| Traitement asynchrone | Celery avec Redis                   |
| Base de données  | PostgreSQL                           |
| Authentification | JWT (JSON Web Tokens)                |

## Structure du projet

```
SmartEval/
├── backend/               # API Django + traitement IA via Celery
├── frontend/              # Application React.js
├── ollama_models/         # Configuration du modèle DeepSeek
├── docs/                  # Documentation utilisateur
│   ├── guide_professeurs.pdf
│   └── guide_etudiants.pdf
├── README.md              # Présentation du projet
├── requirements.txt       # Dépendances backend
```

## Installation locale

### Prérequis

- Python 3.10 ou supérieur
- Node.js 18 ou supérieur
- PostgreSQL
- Redis
- Ollama installé avec le modèle DeepSeek (deepseek-coder)

### Installation du backend

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Installation du frontend

```bash
cd frontend
npm install
npm run dev
```

### Lancer le traitement asynchrone

```bash
# Depuis le dossier backend
celery -A backend worker -l info
```

### Lancer Ollama avec le modèle

```bash
ollama run deepseek-coder
```

## Guides utilisateurs

- [Guide Professeurs (PDF)](./docs/guide_professeurs.pdf)
- [Guide Étudiants (PDF)](./docs/guide_etudiants.pdf)

## À propos

Ce projet a été réalisé dans le cadre d’un projet académique à l’École Supérieure Polytechnique de Dakar. Il vise à démontrer l’intégration de l’IA dans des plateformes éducatives à travers une architecture distribuée moderne.

## Auteures

**Awa Ndiaye**  
Élève ingénieure en DIC2 Télécommunications et réseaux à l'ESP Dakar


**Fatou Myrième Baye Momar Dabo**  
Élève ingénieure en DIC2 Télécommunications et réseaux à l'ESP Dakar

**Nana Yague Diamé*  
Étudiante ingénieure en Sécurité des systèmes informatiques à l’ESP Dakar 

**Awa Diop**  
Étudiante ingénieure en Sécurité des systèmes informatiques à l’ESP Dakar 

