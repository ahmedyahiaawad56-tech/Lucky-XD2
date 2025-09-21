const config = require('../settings');
const { malvin } = require('../malvin');
const { getGroupAdmins } = require('../lib/functions');

malvin({
    pattern: "تاق ادمن",
    alias: ["gc_tagadmins"],
    desc: "Mention all admins of the group",
    category: "group",
    react: "👑",
    use: ".tagadmins [message]",
    filename: __filename
}, 
async (conn, mek, m, {
    from, isGroup, senderNumber, participants, groupAdmins, body, command, reply
}) => {
    try {
        if (!isGroup) return reply("❌ This command only works in group chats.");

        const groupInfo = await conn.groupMetadata(from).catch(() => null);
        if (!groupInfo) return reply("❌ Failed to fetch group information.");

        const groupName = groupInfo.subject || "Unnamed Group";
        const admins = await getGroupAdmins(participants);

        if (!admins || admins.length === 0) {
            return reply("❌ No admins found in this group.");
        }

        const emojis = ['👑', '⚡', '🌟', '✨', '🎖️', '💎', '🔱', '🛡️', '🚀', '🏆'];
        const chosenEmoji = emojis[Math.floor(Math.random() * emojis.length)];

        const messageText = body
            .replace(new RegExp(`^${config.PREFIX}${command}\\s*`, 'i'), '')
            .trim() || "Attention Admins ⚠️";

        let teks = `📢 *منشن ادمن*\n`;
        teks += `🏷️ *قروب:* ${groupName}\n`;
        teks += `👥 *ادمن:* ${admins.length}\n`;
        teks += `💬 *رسالة:* ${messageText}\n\n`;
        teks += `┌──⊷ *ا𝐦𝐚𝐥𝐯𝐢𝐧*\n`;

        for (let admin of admins) {
            teks += `${chosenEmoji} @${admin.split("@")[0]}\n`;
        }

        teks += `└────✦ *𝐦𝐚𝐥𝐯𝐢𝐧* ✦────`;

        await conn.sendMessage(from, {
            text: teks,
            mentions: admins
        }, { quoted: mek });

    } catch (e) {
        console.error("TagAdmins Error:", e);
        reply(`❌ Error occurred:\n${e.message || e}`);
    }
});
