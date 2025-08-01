const mineflayer = require('mineflayer');
const express = require('express');
const app = express();
const port = process.env.PORT || 10000;

// Webszerver a Renderhez, hogy UptimeRobot ne engedje elaludni
app.get('/', (req, res) => res.send('Bot fut'));
app.listen(port, () => console.log(`Web szerver fut a ${port} porton.`));

// Név generátor emberszerű nevekből
function generateUsername() {
  const names = ['Steve', 'Alex', 'Miner', 'Frosti', 'Pixel', 'Noob', 'AFK'];
  const suffix = Math.floor(Math.random() * 10000);
  return names[Math.floor(Math.random() * names.length)] + '_' + suffix;
}

let bot;

function createBot() {
  const username = generateUsername();

  bot = mineflayer.createBot({
    host: 'erettsegicraft.aternos.me', // <<< CSERÉLD KI SAJÁTODRA
    port: 64345,
    username: username,
    version: '1.21.8', // vagy a te verziód
  });

  bot.on('login', () => {
    console.log(`✅ Bot csatlakozott a szerverhez, név: ${username}`);
    startRandomMovement();
  });

  bot.on('error', err => {
    console.log('❌ Bot hiba:', err);
  });

  bot.on('end', () => {
    console.log('⚠️ Bot lecsatlakozott, újraindítás 5 mp múlva...');
    setTimeout(createBot, 5000);
  });
}

function startRandomMovement() {
  const movements = ['forward', 'back', 'left', 'right', null];

  function randomAction() {
    // Mozgás leállítása
    bot.setControlState('forward', false);
    bot.setControlState('back', false);
    bot.setControlState('left', false);
    bot.setControlState('right', false);
    bot.setControlState('jump', false);

    // Véletlenszerű mozgás
    const move = movements[Math.floor(Math.random() * movements.length)];
    if (move) {
      bot.setControlState(move, true);
      if (Math.random() < 0.3) bot.setControlState('jump', true);
    }

    // Véletlenszerű ütés
    if (Math.random() < 0.4) {
      bot.activateItem();
      setTimeout(() => bot.deactivateItem(), 100);
    }

    // Véletlenszerű nézelődés
    if (Math.random() < 0.4) {
      const yaw = (Math.random() - 0.5) * Math.PI;
      const pitch = (Math.random() - 0.5) * Math.PI / 4;
      bot.look(bot.entity.yaw + yaw, bot.entity.pitch + pitch, true);
    }

    // Néha chatel is valamit
    if (Math.random() < 0.2) {
      const messages = ['AFK vagyok!', 'Szép napot!', '👋', 'Hello', '🙂'];
      const msg = messages[Math.floor(Math.random() * messages.length)];
      bot.chat(msg);
    }

    const delay = 2000 + Math.random() * 3000;
    setTimeout(randomAction, delay);
  }

  randomAction();
}

// Bot indítása
createBot();
