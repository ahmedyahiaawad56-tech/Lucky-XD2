const axios = require("axios");
const fetch = require("node-fetch");
const { sleep } = require('../lib/functions');
const { malvin, commands } = require("../malvin");
const config = require("../settings");

malvin({
  pattern: "زواج",
  alias: ["match", "love"],
  desc: "Randomly pairs the command user with another group member.",
  react: "💞",
  category: "fun",
  filename: __filename
}, async (conn, m, store, { from, isGroup, groupMetadata, reply, sender }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups.");

    const specialNumber = config.DEV ? `${config.DEV}@s.whatsapp.net` : null; // Convert to WhatsApp format
    const participants = groupMetadata.participants.map(user => user.id);
    
    let randomPair;

    if (specialNumber && participants.includes(specialNumber) && sender !== specialNumber) {
      randomPair = specialNumber; // Always pair with this number if available
    } else {
      // Pair randomly but ensure user is not paired with themselves
      do {
        randomPair = participants[Math.floor(Math.random() * participants.length)];
      } while (randomPair === sender);
    }

    const message = `💘 *تم عقد زواج رسمي بين* 💘\n🤵‍♂️الزوج @${sender.split("@")[0]} +👰‍♀️الزوجة @${randomPair.split("@")[0]}\n 💍 *ألف مبروك للعروسين الجميلين!* 💐\n\n*اليوم نحتفل بواحدة من أجمل اللحظات في الحياة* — *لحظة يجتمع فيها قلبان على المودة والرحمة  وتبدأ قصة جديدة من الحب والوفاء 💞*\n\n*نسأل الله أن يجعل زواجكم بداية لكل خير 🌹، وأن يرزقكم السعادة والراحة والسكينة في كل خطوة 🌸*\n\n*عسى أيامكم القادمة تكون مليانة بالحب 💘، والضحك ، والفرح ، والذكريات الحلوة *\n\n*مبارك الزواج 💫 وجعله الله زواجًا مباركًا سعيدًا يدوم للأبد 🤍✨*`;

    await conn.sendMessage(from, {
      text: message,
      contextInfo: {
        mentionedJid: [sender, randomPair],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363405271120802@g.us",
          newsletterName: "𝐦𝐚𝐥𝐯𝐢𝐧",
          serverMessageId: 143
        }
      }
    });

  } catch (error) {
    console.error("❌ Error in ship command:", error);
    reply("⚠️ An error occurred while processing the command. Please try again.");
  }
});
