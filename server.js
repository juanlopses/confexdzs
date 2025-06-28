const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

app.use(express.json());

const dbPath = path.join(__dirname, 'db.json');

app.get('/confesiones', (req, res) => {
  fs.readFile(dbPath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.json([]);
      } else {
        res.status(500).send({ message: 'Error al leer la base de datos' });
      }
    } else {
      const confesiones = JSON.parse(data);
      res.json(confesiones);
    }
  });
});

app.post('/confesiones', (req, res) => {
  const confession = {
    text: req.body.text,
    timestamp: new Date().toLocaleString()
  };

  fs.readFile(dbPath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        const confesiones = [confession];
        fs.writeFile(dbPath, JSON.stringify(confesiones), (err) => {
          if (err) {
            res.status(500).send({ message: 'Error al escribir en la base de datos' });
          } else {
            res.json(confession);
          }
        });
      } else {
        res.status(500).send({ message: 'Error al leer la base de datos' });
      }
    } else {
      const confesiones = JSON.parse(data);
      confesiones.push(confession);
      fs.writeFile(dbPath, JSON.stringify(confesiones), (err) => {
        if (err) {
          res.status(500).send({ message: 'Error al escribir en la base de datos' });
        } else {
          res.json(confession);
        }
      });
    }
  });
});

app.listen(3000, () => {
  console.log('Servidor escuchando en puerto 3000');
});
