const { malvin } = require('../malvin');

malvin({
    pattern: "اونلاين",
    alias: ["whosonline", "onlinemembers"],
    desc: "Check who's online in the group (Admins & Owner only)",
    category: "main",
    react: "🟢",
    filename: __filename
},
async (conn, mek, m, { from, quoted, isGroup, isAdmins, isCreator, fromMe, reply }) => {
    try {
        // Check if the command is used in a group
        if (!isGroup) return reply("❌ This command can only be used in a group!");

        // Check if user is either creator or admin
        if (!isCreator && !isAdmins && !fromMe) {
            return reply("❌ Only bot owner and group admins can use this command!");
        }

        // Inform user that we're checking
        await reply("*🔄 جاري البحث اشخاص متصلين .يستغرق الامر بعض الوقت.*");

        const onlineMembers = new Set();
        const groupData = await conn.groupMetadata(from);
        const presencePromises = [];

        // Request presence updates for all participants
        for (const participant of groupData.participants) {
            presencePromises.push(
                conn.presenceSubscribe(participant.id)
                    .then(() => {
                        // Additional check for better detection
                        return conn.sendPresenceUpdate('composing', participant.id);
                    })
            );
        }

        await Promise.all(presencePromises);

        // Presence update handler
        const presenceHandler = (json) => {
            for (const id in json.presences) {
                const presence = json.presences[id]?.lastKnownPresence;
                // Check all possible online states
                if (['available', 'composing', 'recording', 'online'].includes(presence)) {
                    onlineMembers.add(id);
                }
            }
        };

        conn.ev.on('presence.update', presenceHandler);

        // Longer timeout and multiple checks
        const checks = 3;
        const checkInterval = 5000; // 5 seconds
        let checksDone = 0;

        const checkOnline = async () => {
            checksDone++;
            
            if (checksDone >= checks) {
                clearInterval(interval);
                conn.ev.off('presence.update', presenceHandler);
                
                if (onlineMembers.size === 0) {
                    return reply("*لم يتم اكتشاف اشخاص متصلين ❌️*");
                }
                
                const onlineArray = Array.from(onlineMembers);
                const onlineList = onlineArray.map((member, index) => 
                    `${index + 1}. @${member.split('@')[0]}`
                ).join('\n');
                
                const message = `> :الأشخاص المتصلين🚦 (${onlineArray.length}/${groupData.participants.length}):\n\n${onlineList}`;
                
                await conn.sendMessage(from, { 
                    text: message,
                    mentions: onlineArray
                }, { quoted: mek });
            }
        };

        const interval = setInterval(checkOnline, checkInterval);

    } catch (e) {
        console.error("Error in online command:", e);
        reply(`An error occurred: ${e.message}`);
    }
});

