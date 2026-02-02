# 🧪 Guide de Test Complet - SkillTest Platform

## ✅ État des Serveurs

Les deux serveurs sont **LANCÉS ET OPÉRATIONNELS** :

- **Backend API** : http://localhost:5001
- **Frontend Angular** : http://localhost:4200

---

## 🎯 Comptes de Test Disponibles

Tous les comptes utilisent le mot de passe : `password123`

### 👨‍💼 Admin
- **Email** : admin@skilltest.com
- **Rôle** : Administrateur système
- **Accès** : Gestion complète des utilisateurs et tests

### 👔 Recruteurs
1. **Email** : john@company.com (John Recruiter)
2. **Email** : alice@techcorp.io (Alice HR)
3. **Email** : mark@startup.com (Mark Talent)

### 👨‍💻 Candidats
1. **Email** : jane@gmail.com (Jane Doe)
2. **Email** : kevin@outlook.com (Kevin Smith)
3. **Email** : sarah@skynet.com (Sarah Connor)
4. **Email** : mike@monsters.inc (Mike Wazowski)
5. **Email** : eleven@hawkins.net (Eleven Hopper)
6. **Email** : bruce@wayne.ent (Bruce Wayne)
7. **Email** : diana@themyscira.com (Diana Prince)
8. **Email** : tony@starkindustries.com (Tony Stark)

---

## 📋 Checklist des Fonctionnalités à Tester

### 1️⃣ Page d'Accueil (Landing Page)
- [ ] Ouvrir http://localhost:4200
- [ ] Vérifier le design premium avec glassmorphism
- [ ] Tester la navigation vers la page de login
- [ ] Vérifier la responsivité (redimensionner la fenêtre)

### 2️⃣ Authentification
- [ ] Aller sur http://localhost:4200/login
- [ ] Se connecter avec un compte candidat (ex: jane@gmail.com / password123)
- [ ] Vérifier la redirection vers le dashboard
- [ ] Tester la déconnexion
- [ ] Se reconnecter avec un compte recruteur (ex: john@company.com / password123)
- [ ] Se connecter avec le compte admin (admin@skilltest.com / password123)

### 3️⃣ Dashboard Candidat
**Se connecter avec** : jane@gmail.com / password123

- [ ] **Onglet "Tests Disponibles"**
  - Vérifier la liste des tests disponibles
  - Voir les détails (titre, description, durée, langage)
  
- [ ] **Onglet "Mes Résultats"**
  - Voir les résultats des tests passés
  - Vérifier les scores et dates
  - Télécharger un certificat PDF (bouton "Download Certificate")
  
- [ ] **Onglet "Tarifs"**
  - Voir les plans tarifaires (Free, Pro, Enterprise)
  - Tester le bouton "Choose Plan" (Stripe mocké)

### 4️⃣ Exécution de Test (Fonctionnalité Clé)
**Se connecter avec un candidat** : kevin@outlook.com / password123

- [ ] Cliquer sur "Start Test" pour un test disponible
- [ ] **Écran de démarrage** : Vérifier les instructions
- [ ] Cliquer sur "Begin Test"
- [ ] **Chronomètre** : Vérifier que le timer compte à rebours
- [ ] **Navigation** : Tester les boutons "Previous" et "Next"
- [ ] **Sélection de réponses** : Choisir des réponses
- [ ] **Barre de progression** : Vérifier qu'elle augmente
- [ ] **Système Anti-Triche** : 
  - Changer d'onglet pendant le test
  - Vérifier qu'une alerte apparaît
  - Le compteur de tentatives de triche augmente
- [ ] **Soumission** : Cliquer sur "Submit Test"
- [ ] **Résultats** : Voir le score final et le temps pris
- [ ] **Certificat** : Télécharger le certificat PDF

### 5️⃣ Dashboard Recruteur
**Se connecter avec** : john@company.com / password123

- [ ] **Onglet "Analytics"**
  - Voir les statistiques globales
  - Vérifier le nombre total de résultats
  - Voir le score moyen
  - Compter les candidats uniques
  - Tableau des résultats récents avec détails
  
- [ ] **Onglet "Gestion des Tests"**
  - Voir la liste des tests créés
  - **Créer un nouveau test** :
    - Cliquer sur "Create New Test"
    - Remplir le formulaire (titre, langage, durée, description)
    - Sauvegarder
    - Vérifier que le test apparaît dans la liste
  - **Modifier un test** :
    - Cliquer sur "Edit" pour un test
    - Modifier les informations
    - Sauvegarder
  - **Supprimer un test** :
    - Cliquer sur "Delete"
    - Confirmer la suppression

### 6️⃣ Dashboard Admin
**Se connecter avec** : admin@skilltest.com / password123

- [ ] **Onglet "Utilisateurs"**
  - Voir la liste complète des utilisateurs
  - Filtrer par rôle (Admin, Recruteur, Candidat)
  - **Créer un utilisateur** :
    - Cliquer sur "Create User"
    - Remplir le formulaire
    - Sauvegarder
  - **Supprimer un utilisateur** :
    - Cliquer sur "Delete"
    - Confirmer
  
- [ ] **Onglet "Tests"**
  - Voir tous les tests de la plateforme
  - Supprimer des tests si nécessaire

### 7️⃣ API Backend (Tests Techniques)

Ouvrir un terminal et tester les endpoints :

```bash
# Récupérer tous les tests
curl http://localhost:5001/api/tests | jq

# Récupérer un test spécifique
curl http://localhost:5001/api/tests/1 | jq

# Tester l'authentification
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jane@gmail.com","password":"password123"}' | jq
```

### 8️⃣ Génération de Certificats PDF
- [ ] Se connecter en tant que candidat
- [ ] Aller dans "Mes Résultats"
- [ ] Cliquer sur "Download Certificate"
- [ ] Vérifier que le PDF se télécharge
- [ ] Ouvrir le PDF et vérifier :
  - Nom du candidat
  - Titre du test
  - Score
  - Date
  - Design professionnel

### 9️⃣ Intégration Stripe (Mocké)
- [ ] Se connecter en tant que candidat
- [ ] Aller dans l'onglet "Tarifs"
- [ ] Cliquer sur "Choose Plan" pour un plan
- [ ] Vérifier la redirection vers l'URL Stripe (mockée)

### 🔟 Responsive Design
- [ ] Redimensionner la fenêtre du navigateur
- [ ] Tester sur différentes tailles d'écran
- [ ] Vérifier que tous les éléments s'adaptent correctement

---

## 🎨 Éléments de Design à Vérifier

- [ ] **Dark Mode** : Interface sombre par défaut
- [ ] **Glassmorphism** : Effets de verre sur les cartes
- [ ] **Animations** : Transitions fluides
- [ ] **Typographie** : Polices modernes et lisibles
- [ ] **Couleurs** : Palette harmonieuse (violet/bleu)
- [ ] **Skeleton Screens** : Chargements élégants
- [ ] **Micro-animations** : Hover effects sur les boutons

---

## 🔒 Sécurité à Vérifier

- [ ] **JWT Authentication** : Tokens stockés dans localStorage
- [ ] **Authorization Guards** : Routes protégées par rôle
- [ ] **Password Hashing** : Bcrypt utilisé (vérifier dans le code)
- [ ] **CORS** : Configuré correctement
- [ ] **Anti-Triche** : Détection de perte de focus

---

## 🚀 Performance

- [ ] **Temps de chargement** : Page principale < 2s
- [ ] **API Response** : Endpoints < 200ms
- [ ] **Correction automatique** : Instantanée après soumission
- [ ] **Signals Angular** : Réactivité ultra-rapide

---

## 📊 Données de Test

La base de données contient :
- **1 Admin**
- **3 Recruteurs**
- **8 Candidats**
- **5 Tests** (JavaScript, Python, SQL, React, DevOps)
- **10 Questions** (2 par test)
- **Résultats variés** pour démonstration

---

## 🐛 Points d'Attention

Si vous rencontrez des problèmes :

1. **Vérifier que les serveurs sont lancés** :
   ```bash
   # Backend
   cd /Users/admin/Desktop/skilltest/server
   npm run dev
   
   # Frontend
   cd /Users/admin/Desktop/skilltest/client
   npm start
   ```

2. **Vérifier la base de données** :
   ```bash
   cd /Users/admin/Desktop/skilltest/server
   ls -lh database.sqlite
   ```

3. **Réinitialiser les données** :
   ```bash
   cd /Users/admin/Desktop/skilltest/server
   npx tsx seed.ts
   ```

4. **Vérifier les logs** :
   - Backend : Voir le terminal du serveur
   - Frontend : Ouvrir la console du navigateur (F12)

---

## ✨ Fonctionnalités Avancées Implémentées

✅ **Architecture N-Tiers** : Frontend Angular / API Express / DB SQLite  
✅ **Angular 18 Signals** : Gestion d'état réactive moderne  
✅ **Standalone Components** : Architecture modulaire  
✅ **JWT Authentication** : Sécurité robuste  
✅ **Role-Based Access Control** : Admin / Recruteur / Candidat  
✅ **PDF Generation** : Certificats professionnels (PDFKit)  
✅ **Stripe Integration** : Système de paiement (mocké)  
✅ **Anti-Cheat System** : Détection de perte de focus  
✅ **Real-time Timer** : Chronomètre synchronisé  
✅ **Auto-Correction** : Moteur d'évaluation instantané  
✅ **Analytics Dashboard** : Statistiques pour recruteurs  
✅ **Dark Mode** : Design moderne et élégant  
✅ **Glassmorphism** : Effets visuels premium  
✅ **Responsive Design** : Mobile-first  
✅ **TypeScript** : Code typé et sécurisé  
✅ **Docker Ready** : Containerisation complète  

---

## 🎓 Conformité avec le Dossier Technique

Selon le fichier `CHECKLIST_FEATURES.md` :

**Conformité Finale : 98%** ✅

Toutes les fonctionnalités majeures sont implémentées et opérationnelles.

---

## 📞 Support

Pour toute question ou problème, vérifiez :
1. Les logs du serveur backend
2. La console du navigateur (F12)
3. Le fichier `CHECKLIST_FEATURES.md` pour la liste complète des fonctionnalités

**Bon test ! 🚀**
