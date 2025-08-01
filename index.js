const mineflayer = require('mineflayer');

let botCount = 1; // Induló névsorszám

function createBot() {
  const botName = 'Bot' + botCount;
  botCount++;

  const bot = mineflayer.createBot({
    host: 'erettsegicraft.aternos.me', // Ide írd a szerver IP-t vagy domain nevet
    port: 64345, // Alapértelmezett minecraft port, ha más írd át
    username: botName,
  });

  bot.on('login', () => {
    console.log(`Bot belépett névvel: ${botName}`);
  });

  bot.on('end', () => {
    console.log('Bot lecsatlakozott, újracsatlakozás 5 másodperc múlva...');
    setTimeout(createBot, 5000); // Újracsatlakozás
  });

  bot.on('kicked', (reason) => {
    console.log(`Bot kirúgva: ${reason}`);
  });

  bot.on('error', (err) => {
    console.log('Bot hiba:', err);
  });

  // Mozgás ciklus - előre, hátra, ugrás, körbenézés, néha állás
  let movingForward = true;
  setInterval(() => {
    if (!bot.entity) return;

    // Mozgás váltogatás
    if (movingForward) {
      bot.setControlState('forward', true);
      bot.setControlState('back', false);
    } else {
      bot.setControlState('forward', false);
      bot.setControlState('back', true);
    }
    movingForward = !movingForward;

    // Ugrás véletlenszerűen
    if (Math.random() < 0.3) {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 400);
    }

    // Körbenézés (jobb-bal)
    const yaw = (Math.random() * Math.PI * 2);
    const pitch = 0; // nézés vízszintesen
    bot.look(yaw, pitch, true);

    // Néha állás (10% esély)
    if (Math.random() < 0.1) {
      bot.setControlState('forward', false);
      bot.setControlState('back', false);
    }
  }, 4000);

  // Chatelés minden 20-40 másodpercben
  setInterval(() => {
    if (bot.entity) {
      bot.chat('Hello, én vagyok ' + botName);
    }
  }, 20000 + Math.random() * 20000);

  // Ütés minden 10-30 másodpercben
  setInterval(() => {
    if (bot.entity) {
      bot.activateItem();
    }
  }, 10000 + Math.random() * 20000);
}

createBot();
