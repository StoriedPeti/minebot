const mineflayer = require('mineflayer');
const express = require('express');
const app = express();

let bot;
let botNumber = 1;

function createBot() {
  const username = `AFKBot${botNumber++}`;

  bot = mineflayer.createBot({
    host: 'erettsegicraft.aternos.me', // <-- cseréld ki a sajátodra!
    port: 64345,
    username: username,
    version: '1.21.7' // vagy amit használsz
  });

  bot.on('login', () => {
    console.log(`${username} csatlakozott a szerverhez!`);
    startBehavior();
  });

  bot.on('error', err => {
    console.log('Bot hiba:', err);
  });

  bot.on('end', () => {
    console.log(`${username} lecsatlakozott, újracsatlakozás 5 mp múlva...`);
    setTimeout(createBot, 5000);
  });
}

function startBehavior() {
  const actions = ['move', 'look', 'chat', 'hit', 'idle'];

  function randomAction() {
    const action = actions[Math.floor(Math.random() * actions.length)];

    // Reset minden irány
    bot.clearControlStates();

    switch (action) {
      case 'move':
        const directions = ['forward', 'back', 'left', 'right'];
        const dir = directions[Math.floor(Math.random() * directions.length)];
        bot.setControlState(dir, true);
        if (Math.random() < 0.5) bot.setControlState('jump', true);
        break;

      case 'look':
        const yaw = Math.random() * 2 * Math.PI;
        const pitch = (Math.random() - 0.5) * Math.PI / 2;
        bot.look(yaw, pitch, true);
        break;

      case 'chat':
        bot.chat("AFK bot vagyok!");
        break;

      case 'hit':
        bot.activateItem();
        setTimeout(() => bot.deactivateItem(), 200);
        break;

      case 'idle':
        // csinál semmit
        break;
    }

    const delay = 2000 + Math.random() * 3000;
    setTimeout(randomAction, delay);
  }

  randomAction();
}

// web ping a Render miatt
app.get("/", (req, res) => res.send("Bot él!"));
app.listen(10000, () => console.log("Web szerver fut a 10000 porton."));

createBot();
