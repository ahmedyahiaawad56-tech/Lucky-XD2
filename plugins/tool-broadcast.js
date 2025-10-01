const { malvin, commands } = require('../malvin');
const config = require('../settings');
const prefix = config.PREFIX;
const fs = require('fs');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, sleep, fetchJson } = require('../lib/functions2');
const { writeFileSync } = require('fs');
const path = require('path');

malvin({
  pattern: "شير",
  category: "group",
  desc: "Bot makes a broadcast in all groups",
  filename: __filename,
  use: "<text for broadcast.>"
}, async (conn, mek, m, { q, isGroup, isAdmins, reply }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups!");
    if (!isAdmins) return reply("*❌ لازم ادمن عشان انفذ الامر*");

    if (!q) return reply("*ادخل النص الذي تريد نشره!*");

    let allGroups = await conn.groupFetchAllParticipating();
    let groupIds = Object.keys(allGroups); // Extract group IDs

    reply(`📢جاري النشر في ${groupIds.length} قروب...\nالوقت المقدر⏳️: ${groupIds.length * 1.5} ثانية`);

    for (let groupId of groupIds) {
      try {
        await sleep(1500); // Avoid rate limits
        await conn.sendMessage(groupId, { text: q }); // Sends only the provided text
      } catch (err) {
        console.log(`❌️حدث خطأ لم يتم النشر ${groupId}:`, err);
      }
    }

    return reply(` ✅️تم النشر في  ${groupIds.length} قروب.`);
    
  } catch (err) {
    await m.error(`❌ Error: ${err}\n\nCommand: broadcast`, err);
  }
});
