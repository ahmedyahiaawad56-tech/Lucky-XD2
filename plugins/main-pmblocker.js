const { malvin } = require('../malvin');
const config = require('../settings');

malvin({
    pattern: "برايفت",
    alias: ["pmblocker"],
    desc: "*هذا الامر يعمل فقط في الخاص❌️*",
    category: "security",
    filename: __filename,
    usage: "pmblock [on/off]",
    react: "🚫",
    ownerOnly: true
}, async (conn, mek, m, { args, reply }) => {
    const action = args[0]?.toLowerCase();

    if (!action || !['on', 'off'].includes(action)) {
        return reply(`
❓ *Invalid Usage*

🛠️ *Usage:* \`.pmblock on\` or \`.pmblock off\`
📌 *Description:* Enable or disable PM blocking for non-owners.
        `.trim());
    }

    config.PM_BLOCKER = action === "on" ? "true" : "false";

    return reply(
        action === "on"
        ? "> : 🚫تم تفعيل مانع الرسائل الخاصة\n\n*🛡️البوت فصاعدا لن يستجيب لرسائل في الخاص،الا اذا كان من قائمة المسوح لهم.*"
        : "> :✅تم تعطيل مانع الرسائل الخاصة\n\n*💬البوت أصبح يرد على كل الرسائل في الخاص*"
    );
});
