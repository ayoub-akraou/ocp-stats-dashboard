@echo off

:: Étape 1 - Créer la base de données "ocp" si elle n'existe pas
echo Création de la base de données si elle n'existe pas...
mysql -u root -proot -e "CREATE DATABASE IF NOT EXISTS ocp;"

:: Étape 2 - Lancer les migrations et seeders dans une fenêtre
start "Migrations & Seeders" cmd /k "cd backend && npm install && npx sequelize-cli db:migrate && npx sequelize-cli db:seed:all && npx nodemon server.js"

:: Étape 4 - Lancer le frontend dans une autre fenêtre
start "Frontend Client" cmd /k "cd frontend && npm install && npm run dev"

::pause
