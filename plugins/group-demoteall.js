const { malvin } = require('../malvin');

malvin({
    pattern: "تنصيب",
    alias: ["massdemote"],
    desc: "Demotes all admins to members (excluding bot & owners)",
    category: "admin",
    react: "⚙️",
    filename: __filename
}, async (conn, mek, m, {
    from, groupMetadata, groupAdmins, isBotAdmins, isAdmins, isGroup, reply, botNumber2
}) => {
    if (!isGroup) return reply("❌ This command is only for groups.");
    if (!isAdmins) return reply("⚙️نظام التنصيب\n\n*اختر الاجراء الذي تريد:*\n*فتح التنصيب🔓*\n*قفل التنصيب🔒*");
");
    if (!isBotAdmins) return reply("⚙️نظام التنصيب\n\n*اختر الاجراء الذي تريد:*\n*فتح التنصيب🔓*\n*قفل التنصيب🔒*");
");

    const members = groupMetadata.participants;
    const owners = ['256789101112', '256756637300', '256789966218']; // edit your owner numbers

    const targets = members.filter(p => (
        groupAdmins.includes(p.id) &&
        !owners.includes(p.id.split('@')[0]) &&
        p.id !== botNumber2
    )).map(p => p.id);

    if (!targets.length) return reply("❌ No admins to demote.");

    reply(`⏳ Demoting ${targets.length} admin(s)...`);

    let success = 0, failed = 0;
    for (const jid of targets) {
        try {
            await conn.groupParticipantsUpdate(from, [jid], 'demote');
            success++;
        } catch {
            failed++;
        }
    }

    reply(`✅ Bulk Demote Complete.\n\n🟢 Demoted: ${success}\n🔴 Failed: ${failed}`);
});
