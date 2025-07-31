const mineflayer = require('mineflayer');
const express = require('express');
const app = express();

const host = 'erettsegicraft.aternos.me';
const portSzerver = 64345;
const username = 'Herobrine';

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
    console.log('Bot error:', err);
  });
}

app.get('/', (req, res) => {
  res.send('Bot is alive!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Web server running on port ${port}`);
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
