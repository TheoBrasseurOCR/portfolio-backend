const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors'); 

const app = express(); 
 
// Middleware pour traiter les données du formulaire
app.use(bodyParser.json());

// Utiliser le middleware cors pour accepter les requêtes POST
const corsOptions = {
  origin: 'https://mon-portfolio-sepia.vercel.app',
};

app.use(cors(corsOptions));

// Configuration pour l'envoi d'e-mails avec nodemailer
const transporter = nodemailer.createTransport({
  service: process.env.SERV,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Gestion des requêtes OPTIONS pour l'endpoint /submit-form
app.options('/submit-form', (req, res) => {
  res.header('Access-Control-Allow-Methods', 'POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.sendStatus(200);
});

// Gestion de la route racine
app.get('/', (req, res) => {
  res.send('Bienvenue sur le serveur backend');
});
// Endpoint pour recevoir les données du form
app.post('/submit-form', (req, res) => {
  const formData = req.body;

  // Configuration du contenu de l'e-mail
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_TO,
    subject: 'Nouveau formulaire soumis',
    html: `
      <p>Nouveau formulaire soumis :</p>
      <p>Prénom : ${formData.firstName}</p>
      <p>Adresse e-mail : ${formData.email}</p>
      <p>Sujet : ${formData.subject}</p>
      <p>Message : ${formData.message}</p>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Erreur lors de l\'envoi de l\'e-mail :', error);
      return res.status(500).send(error.toString());
    }
    res.status(200).send('Formulaire soumis avec succès !');
  });
});

// Démarrage du serveur
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
});
