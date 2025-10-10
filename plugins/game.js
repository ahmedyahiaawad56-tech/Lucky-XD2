({
  pattern: "لعبةالحبار",
  desc: "_تشغيل لعبة الحبار داخل القروب_",
  category: "تسلية",
  filename: __filename
}, async (conn, mek, m, { isAdmin, isOwner, participants, reply }) => {
  try {
    if (!m.isGroup) return reply("❌ هذا الأمر يعمل فقط داخل القروبات.");
    if (!isAdmin && !isOwner) return reply("❌ هذا الأمر مخصص فقط للمشرفين.");

    let groupMembers = participants.filter(p => !p.admin); // استبعاد الأدمنز
    if (groupMembers.length < 5) return reply("⚠️ يجب أن يكون هناك على الأقل 5 أعضاء غير مشرفين لبدء اللعبة.");

    let gameCreator = "@" + m.sender.split("@")[0];

    // رسالة إعلان اللعبة
    let gameMessage = `🔴 *لعبة الحبار: الضوء الأحمر 🟥، الضوء الأخضر 🟩*\n\n🎭 *المدير:* (${gameCreator})\n`;
    gameMessage += groupMembers.map(m => "@" + m.id.split("@")[0]).join("\n") + "\n\n";
    gameMessage += "تم إضافة جميع أعضاء القروب كلّاعبين! تبدأ اللعبة خلال 50 ثانية...";

    await conn.sendMessage(m.chat, { text: gameMessage, mentions: groupMembers.map(m => m.id) });

    await delay(50000); // انتظار 50 ثانية قبل بدء اللعبة

    // اختيار 5 لاعبين عشوائيين
    let players = groupMembers.sort(() => 0.5 - Math.random()).slice(0, 5);

    let playersList = players.map((p, i) => `${i + 1}. @${p.id.split("@")[0]}`).join("\n");

    await conn.sendMessage(m.chat, {
      text: `🎮 *قائمة اللاعبين:*\n${playersList}\n\n🔔 اللعبة تبدأ الآن!`,
      mentions: players.map(p => p.id)
    });

    await delay(3000);

    // شرح القواعد
    let rulesMessage = `📜 *قواعد اللعبة:*\n\n`
      + `1️⃣ أثناء 🟥 *الضوء الأحمر*، من يرسل رسالة سيتم *استبعاده وطرده* من القروب.\n\n`
      + `2️⃣ أثناء 🟩 *الضوء الأخضر*، يجب على اللاعبين إرسال رسالة، ومن يسكت سيتم استبعاده.\n\n`
      + `3️⃣ تنتهي اللعبة عندما يبقى لاعب واحد فقط.\n\n`
      + `🏆 حاول النجاة لتصبح _الفائز!_`;

    await conn.sendMessage(m.chat, { text: rulesMessage });

    await delay(5000);

    let remainingPlayers = [...players];
    while (remainingPlayers.length > 1) {
      let isGreenLight = Math.random() > 0.5;
      let lightMessage = isGreenLight ? "🟩 *الضوء الأخضر*" : "🟥 *الضوء الأحمر*";
      await conn.sendMessage(m.chat, { text: `🔔 ${lightMessage}` });

      await delay(5000); // انتظار 5 ثواني بين كل مرحلة

      let playersToKick = [];
      let spokenPlayers = new Set(); // من تحدثوا أثناء الجولة

      conn.ev.on("messages.upsert", (msg) => {
        let sender = msg.messages[0].key.remoteJid;
        if (remainingPlayers.find(p => p.id === sender)) spokenPlayers.add(sender);
      });

      if (isGreenLight) {
        // من لم يتكلم أثناء الضوء الأخضر يُستبعد
        for (let player of remainingPlayers) {
          if (!spokenPlayers.has(player.id)) {
            playersToKick.push(player);
          }
        }
      } else {
        // من يتكلم أثناء الضوء الأحمر يُستبعد
        for (let player of remainingPlayers) {
          if (spokenPlayers.has(player.id)) {
            playersToKick.push(player);
          }
        }
      }

      for (let player of playersToKick) {
        await conn.groupParticipantsUpdate(m.chat, [player.id], "remove");
        let eliminationMessage = isGreenLight
          ? `❌ @${player.id.split("@")[0]} سكت أثناء 🟩 *الضوء الأخضر* وتم استبعاده من القروب.`
          : `❌ @${player.id.split("@")[0]} تكلم أثناء 🟥 *الضوء الأحمر* وتم استبعاده من القروب.`;

        await conn.sendMessage(m.chat, {
          text: eliminationMessage,
          mentions: [player.id]
        });
      }

      remainingPlayers = remainingPlayers.filter(p => !playersToKick.includes(p));
    }

    if (remainingPlayers.length === 1) {
      await conn.sendMessage(m.chat, {
        text: `🏆 *مبروك @${remainingPlayers[0].id.split("@")[0]}!* 🎉\nلقد نجوت من لعبة الحبار! 🦑`,
        mentions: [remainingPlayers[0].id]
      });
    }
  } catch (error) {
    console.error("خطأ في أمر لعبة الحبار:", error);
    reply("❌ حدث خطأ أثناء تشغيل لعبة الحبار.");
  }
});
malvin({
    pattern: "konami",
    desc: "Simulate a match between two teams and choose a winner randomly after 30 seconds.",
    category: "fun",
    react: "⚽",
    filename: __filename,
    use: ".konami"
}, async (conn, mek, m, { from, sender, reply }) => {
    try {
        // Liste étendue des clubs et équipes internationales avec leurs emojis
        const teams = [
            "Real Madrid 🇪🇸",
            "FC Barcelone 🇪🇸",
            "Manchester United 🇬🇧",
            "Liverpool FC 🇬🇧",
            "Bayern Munich 🇩🇪",
            "Juventus 🇮🇹",
            "Paris Saint-Germain 🇫🇷",
            "Arsenal FC 🇬🇧",
            "AC Milan 🇮🇹",
            "Inter Milan 🇮🇹",
            "Chelsea FC 🇬🇧",
            "Borussia Dortmund 🇩🇪",
            "Cameroun 🇨🇲",
            "Côte D'Ivoire 🇨🇮",
            "Tottenham Hotspur 🇬🇧",
            "Sénégal 🇸🇳",
            "RDC 🇨🇩",
            "Congo 🇨🇬",
            "Ajax Amsterdam 🇳🇱",
            "FC Porto 🇵🇹",
            "SL Benfica 🇵🇹",
            "Olympique Lyonnais 🇫🇷",
            "Olympique de Marseille 🇫🇷",
            "AS Monaco 🇫🇷",
            "Sporting CP 🇵🇹",
            "Everton FC 🇬🇧",
            "West Ham United 🇬🇧",
            "Atletico Madrid 🇪🇸",
            "AS Roma 🇮🇹",
            "Fiorentina 🇮🇹",
            "Napoli 🇮🇹",
            "Celtic FC 🇬🇧",
            "Rangers FC 🇬🇧",
            "Feyenoord 🇳🇱",
            "PSV Eindhoven 🇳🇱",
            "Brazil 🇧🇷",
            "Germany 🇩🇪",
            "Argentina 🇦🇷",
            "France 🇫🇷",
            "Spain 🇪🇸",
            "Italy 🇮🇹",
            "England 🏴",
            "Portugal 🇵🇹",
            "Netherlands 🇳🇱",
            "Belgium 🇧🇪",
            "Mexico 🇲🇽",
            "Uruguay 🇺🇾",
            "USA 🇺🇸"
            // Ajoutez d'autres équipes si nécessaire
        ];

        // Sélection aléatoire de deux équipes différentes
        const team1 = teams[Math.floor(Math.random() * teams.length)];
        let team2 = teams[Math.floor(Math.random() * teams.length)];
        while (team2 === team1) {
            team2 = teams[Math.floor(Math.random() * teams.length)];
        }

        // Annonce du match versus
        const announcement = `⚽ *Match Versus*\n\n${team1} 🆚 ${team2}\n\n@${sender.split("@")[0]}, Choose the winner! You have 30 seconds to think!.`;
        await reply(announcement, { mentions: [sender] });

        // Attendre 30 secondes
        await new Promise(resolve => setTimeout(resolve, 30000));

        // Choix aléatoire du gagnant parmi les deux équipes
        const chosenTeam = Math.random() < 0.5 ? team1 : team2;

        // Message final annonçant le gagnant
        const resultMessage = `🏆 *Match Resaults*\n\nThe winner is...: ${chosenTeam}🥳\n\n> Here are the results!😎 @${sender.split("@")[0]} !`;
        await reply(resultMessage, { mentions: [sender] });
    } catch (error) {
        console.error("Error in konami command:", error);
        reply("❌ Une erreur est survenue lors de l'exécution de la commande konami.");
    }
});
