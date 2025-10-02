const { malvin } = require('../malvin');
const axios = require('axios');

malvin({
    pattern: "مطور",
    alias: ["xeon", "meta"],
    react: "👨‍💻",
    desc: "Talk with Meta AI",
    category: "ai",
    use: '.metaai <your question>',
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("━━━━━━━━━━━━━━━━━━\n𓆩 اسم البوت: 𝐦𝐚𝐥𝐯𝐢𝐧__*XD🤖*\n\n201013346322:المتحكم🤴\n👨‍💻 𓆩 المطوّر: 𝐦𝐚𝐥𝐯𝐢𝐧 𓆪\n━━━━━━━━━━━━━━━━━━\n*⚡ تم تطوير هذا البوت من قبل [𝐦𝐚𝐥𝐯𝐢𝐧__XD]*\n✅ كل الأكواد والأوامر تعمل على هذا الرقم.\n━━━━━━━━━━━━━━━━━━\n📞 للتواصل مع المطوّر: [https://wa.me/249991519998]\n━━━━━━━━━━━━━━━━━━");

        // React: Processing
        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        // Show "typing" presence
        await conn.sendPresenceUpdate("composing", from);

        // Fetch AI response
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/ai/metaai?text=${encodeURIComponent(q)}`);

        if (!data.success || !data.response) {
            await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
            return reply("❌ Meta AI failed to respond.");
        }

        // React: Success
        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

        // Reply with AI message
        await reply(`💬 *Meta AI:* ${data.response}`);

    } catch (e) {
        console.error("MetaAI Error:", e);
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
        reply("❌ An error occurred while talking to Meta AI.");
    }
});
