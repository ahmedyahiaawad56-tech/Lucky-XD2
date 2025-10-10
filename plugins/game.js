const { delay } = require("@whiskeysockets/baileys");
const { malvin } = require("../malvin");

// 🎮 لعبة الحبار
malvin({
  pattern: "الحبار",
  desc: "تشغيل لعبة الحبار داخل المجموعة",
  category: "تسلية",
  filename: __filename
}, async (conn, mek, m, { isAdmin, isOwner, participants, reply }) => {
  try {
    if (!m.isGroup) return reply("❌ هذا الأمر يعمل فقط في المجموعات!");
    if (!isAdmin && !isOwner) return reply("❌ فقط المشرفين يمكنهم استخدام هذا الأمر!");

    let groupMembers = participants.filter(p => !p.admin);
    if (groupMembers.length < 5) return reply("⚠️ يجب أن يكون هناك على الأقل 5 أعضاء غير مشرفين للعب.");

    let gameCreator = "@" + m.sender.split("@")[0];

    let gameMessage = `🔴 *لعبة الحبار: ضوء أحمر، ضوء أخضر*\n\n🎭 *منظم اللعبة*: (${gameCreator})\n`;
    gameMessage += groupMembers.map(m => "@" + m.id.split("@")[0]).join("\n") + "\n\n";
    gameMessage += "👾 تم اختيار جميع أعضاء المجموعة كلاعبين! ستبدأ اللعبة بعد ٥٠ ثانية...";

    await conn.sendMessage(m.chat, { text: gameMessage, mentions: groupMembers.map(m => m.id) });

    await delay(50000);

    let players = groupMembers.sort(() => 0.5 - Math.random()).slice(0, 5);
    let playersList = players.map((p, i) => `${i + 1}. @${p.id.split("@")[0]}`).join("\n");

    await conn.sendMessage(m.chat, {
      text: `🎮 *اللاعبون المختارون:*\n${playersList}\n\n🔔 اللعبة تبدأ الآن!`,
      mentions: players.map(p => p.id)
    });

    await delay(3000);

    let rulesMessage = `📜 *قوانين اللعبة:*\n\n`
      + `1️⃣ أثناء 🟥 *الضوء الأحمر*، أي لاعب يرسل رسالة سيتم *طرده*.\n\n`
      + `2️⃣ أثناء 🟩 *الضوء الأخضر*، يجب على اللاعبين إرسال رسالة، ومن يبقى صامتًا يُطرد.\n\n`
      + `3️⃣ اللعبة تنتهي عندما يتبقى لاعب واحد فقط.\n\n`
      + `🏆 الناجي الأخير هو *الفائز*!`;

    await conn.sendMessage(m.chat, { text: rulesMessage });

  } catch (error) {
    console.error("خطأ في أمر لعبة الحبار:", error);
    reply("❌ حدث خطأ أثناء تشغيل اللعبة.");
  }
});

// ⚽ لعبة كونامي (مباراة عشوائية)
malvin({
  pattern: "مباراة",
  desc: "محاكاة مباراة عشوائية بين فريقين وتحديد الفائز بعد 30 ثانية.",
  category: "تسلية",
  react: "⚽",
  filename: __filename,
  use: ".مباراة"
}, async (conn, mek, m, { from, sender, reply }) => {
  try {
    const teams = [
      "ريال مدريد 🇪🇸", "برشلونة 🇪🇸", "مانشستر يونايتد 🏴", "ليفربول 🏴",
      "بايرن ميونخ 🇩🇪", "يوفنتوس 🇮🇹", "باريس سان جيرمان 🇫🇷",
      "الأهلي 🇪🇬", "الزمالك 🇪🇬", "الهلال 🇸🇦", "النصر 🇸🇦",
      "المريخ 🇸🇩", "الترجي 🇹🇳", "الوداد 🇲🇦", "الاتحاد 🇸🇦",
      "البرازيل 🇧🇷", "فرنسا 🇫🇷", "الأرجنتين 🇦🇷", "ألمانيا 🇩🇪", "إسبانيا 🇪🇸"
    ];

    const team1 = teams[Math.floor(Math.random() * teams.length)];
    let team2 = teams[Math.floor(Math.random() * teams.length)];
    while (team2 === team1) {
      team2 = teams[Math.floor(Math.random() * teams.length)];
    }

    const announcement = `⚽ *مباراة ودية*\n\n${team1} 🆚 ${team2}\n\n@${sender.split("@")[0]}، من تتوقع يفوز؟ لديك ٣٠ ثانية للتفكير!`;
    await reply(announcement, { mentions: [sender] });

    await new Promise(resolve => setTimeout(resolve, 30000));

    const chosenTeam = Math.random() < 0.5 ? team1 : team2;
    const resultMessage = `🏆 *النتيجة النهائية*\n\nالفائز هو: ${chosenTeam} 🎉\n\n> مبروك يا @${sender.split("@")[0]} على الاختيار الذكي 😎`;
    await reply(resultMessage, { mentions: [sender] });
  } catch (error) {
    console.error("خطأ في أمر المباراة:", error);
    reply("❌ حدث خطأ أثناء تنفيذ الأمر.");
  }
});
