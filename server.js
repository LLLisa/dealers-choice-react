//db-----------------
const faker = require('faker');
const Sequelize = require('sequelize');
const db = new Sequelize('postgres://localhost/dealers-choice-react');

const Human = db.define('human', {
  name: {
    type: Sequelize.STRING,
  },
  phone: {
    type: Sequelize.STRING,
  },
  email: {
    type: Sequelize.STRING,
  },
});

const createHuman = async (num) => {
  try {
    for (let i = 0; i < num; i++) {
      await Human.create({
        name: faker.name.findName(),
        phone: faker.phone.phoneNumber(),
        email: faker.internet.email(),
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const seedDb = async () => {
  try {
    await db.sync({ force: true });
    await createHuman(8);
  } catch (error) {
    console.log(error);
  }
};

//expresso-o--------------
const express = require('express');
const app = express();
const path = require('path');

const init = async () => {
  try {
    await seedDb();
    console.log('-----synced-----');
    const port = 42069;
    app.listen(port, () => {
      console.log(`glistening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

init();

//routies---------------------
app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/api/humans', async (req, res, next) => {
  try {
    const response = await Human.findAll();
    res.send(response);
  } catch (error) {
    next(error);
  }
});
