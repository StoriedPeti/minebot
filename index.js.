const mineflayer = require('mineflayer');
const express = require('express');
const app = express();

const host = 'erettsegicraft.aternos.me'; // <- ezt cseréld ki a saját szervered címére
const portSzerver = 64345; // Aternos default port
const username = 'Herobrine'; // A bot neve

let bot;

function createBot() {
  bot = mineflayer.createBot({
    host: host,
    port: portSzerver,
    username: username
  });

  bot.once('spawn', () => {
    console.log('Bot csatlakozott és spawnolt.');
    randomBehavior();
  });

  bot.on('end', () => {
    console.log('Bot lecsatlakozott, újracsatlakozás 5 másodperc múlva...');
    setTimeout(createBot, 5000);
  });

  bot.on('kicked', (reason) => {
    console.log('Bot kirúgva:', reason);
  });

  bot.on('error', (err) => {
    console.log('Bot hiba:', err);
  });
}

// Webszerver pingeléshez
app.get('/', (req, res) => {
  res.send('Bot él!');
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Web szerver fut a ${port} porton.`);
});

function randomMove() {
  if (!bot) return;
  bot.setControlState('forward', true);
  setTimeout(() => {
    bot.setControlState('forward', false);
  }, 1000);
}

function randomAttack() {
  if (!bot) return;
  bot.activateItem();
  setTimeout(() => {
    bot.deactivateItem();
  }, 500);
}

function randomBehavior() {
  if (!bot || !bot.entity) return;

  const delay = 10000 + Math.random() * 20000;

  if (Math.random() < 0.5) {
    randomMove();
  } else {
    randomAttack();
  }

  setTimeout(randomBehavior, delay);
}

createBot();
