const mineflayer = require('mineflayer');
const express = require('express');

let bot;

function createBot() {
  bot = mineflayer.createBot({
    host: 'Aternos_szerver_IP_vagy_domain', // pl: 'example.aternos.me'
    port: 25565, // ha nem más a port
    username: 'AFKBot',
    version: '1.21.7', // vagy a szervered verziója
  });

  bot.on('login', () => {
    console.log('Bot csatlakozott a szerverhez!');
    startRandomMovement();
  });

  bot.on('error', err => {
    console.log('Bot hiba:', err);
  });

  bot.on('end', () => {
    console.log('Bot lecsatlakozott, újracsatlakozás 5mp múlva...');
    setTimeout(createBot, 5000);
  });
}

// Mozgás-ütés logika
function startRandomMovement() {
  const movements = ['forward', 'back', 'left', 'right', null];

  function randomMove() {
    // Előző mozgások leállítása
    bot.setControlState('forward', false);
    bot.setControlState('back', false);
    bot.setControlState('left', false);
    bot.setControlState('right', false);
    bot.setControlState('jump', false);

    // Véletlenszerű mozgás kiválasztása
    const move = movements[Math.floor(Math.random() * movements.length)];
    if (move) {
      bot.setControlState(move, true);
      // Néha ugrik is egyet
      if (Math.random() < 0.3) bot.setControlState('jump', true);
    }

    // Néha üt egyet
    if (Math.random() < 0.4) {
      bot.activateItem();
      setTimeout(() => bot.deactivateItem(), 100);
    }

    // 2-5 mp múlva újra
    const delay = 2000 + Math.random() * 3000;
    setTimeout(randomMove, delay);
  }

  randomMove();
}

// Bot indítása
createBot();

// === Webszerver az UptimeRobothoz ===
const app = express();

app.get('/', (req, res) => {
  res.send('Minecraft AFK bot él');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Webszerver fut a ${PORT} porton – készen áll az UptimeRobotra!`);
});
