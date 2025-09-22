const { malvin } = require('../malvin');

// Fixed & Created By Malvin x Jawad
malvin({
  pattern: "@",
  alias: ["tag", "h"],  
  react: "🔊",
  desc: "To Tag all Members for Any Message/Media",
  category: "group",
  use: '.hidetag Hello',
  filename: __filename
},
async (conn, mek, m, {
  from, q, isGroup, isCreator, isAdmins,
  participants, reply
}) => {
  try {
    const isUrl = (url) => {
      return /https?:\/\/(www\.)?[\w\-@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([\w\-@:%_\+.~#?&//=]*)/.test(url);
    };

    if (!isGroup) return reply("❌ This command can only be used in groups.");
    if (!isAdmins && !isCreator) return reply("❌ ادمن فقط.");

    const mentionAll = { mentions: participants.map(u => u.id) };

    // If no message or reply is provided
    if (!q && !m.quoted) {
      return reply(" !اكتب الكلام الداير تعمل ليهو تاق .");
    }

    // If a reply to a message
    if (m.quoted) {
      const type = m.quoted.mtype || '';
      
      // If it's a text message (extendedTextMessage)
      if (type === 'extendedTextMessage') {
        return await conn.sendMessage(from, {
          text: m.quoted.text || 'No message content found.',
          ...mentionAll
        }, { quoted: mek });
      }

      // Handle media messages
      if (['imageMessage', 'videoMessage', 'audioMessage', 'stickerMessage', 'documentMessage'].includes(type)) {
        try {
          const buffer = await m.quoted.download?.();
          if (!buffer) return reply("❌فشل التنزيل.");

          let content;
          switch (type) {
            case "imageMessage":
              content = { image: buffer, caption: m.quoted.text || "📷 Image", ...mentionAll };
              break;
            case "videoMessage":
              content = { 
                video: buffer, 
                caption: m.quoted.text || "🎥 Video", 
                gifPlayback: m.quoted.message?.videoMessage?.gifPlayback || false, 
                ...mentionAll 
              };
              break;
            case "audioMessage":
              content = { 
                audio: buffer, 
                mimetype: "audio/mp4", 
                ptt: m.quoted.message?.audioMessage?.ptt || false, 
                ...mentionAll 
              };
              break;
            case "stickerMessage":
              content = { sticker: buffer, ...mentionAll };
              break;
            case "documentMessage":
              content = {
                document: buffer,
                mimetype: m.quoted.message?.documentMessage?.mimetype || "application/octet-stream",
                fileName: m.quoted.message?.documentMessage?.fileName || "file",
                caption: m.quoted.text || "",
                ...mentionAll
              };
              break;
          }

          if (content) {
            return await conn.sendMessage(from, content, { quoted: mek });
          }
        } catch (e) {
          console.error("Media download/send error:", e);
          return reply("❌ Failed to process the media. Sending as text instead.");
        }
      }

      // Fallback for any other message type
      return await conn.sendMessage(from, {
        text: m.quoted.text || "📨 Message",
        ...mentionAll
      }, { quoted: mek });
    }

    // If no quoted message, but a direct message is sent
    if (q) {
      // If the direct message is a URL, send it as a message
      if (isUrl(q)) {
        return await conn.sendMessage(from, {
          text: q,
          ...mentionAll
        }, { quoted: mek });
      }

      // Otherwise, just send the text without the command name
      await conn.sendMessage(from, {
        text: q, // Sends the message without the command name
        ...mentionAll
      }, { quoted: mek });
    }

  } catch (e) {
    console.error(e);
    reply(`❌ *Error Occurred !!*\n\n${e.message}`);
  }
});
