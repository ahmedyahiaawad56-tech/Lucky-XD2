const axios = require("axios");
const { malvin } = require("../malvin");

malvin({
  pattern: "اقتباس",
  alias: ["quotes", "motivate"],
  desc: "Get a random inspiring quote.",
  category: "fun",
  react: "💬",
  filename: __filename
}, async (conn, m, store, { from, reply }) => {
  try {
    const res = await axios.get("https://api.quotable.io/random");
    const { content, author } = res.data;

    const formatted = `
┌───「 💭 اقتباس 」───
│
│  📜 *"${content}"*
│  — ${author || "مجهول"}
│
└─🧠 Powered By *𝐦𝐚𝐥𝐯𝐢𝐧 Hub*
    `.trim();

    reply(formatted);
  } catch (e) {
    console.error("حدث خطأ❌️:", e.message);
    reply("حدث خطأ اثناء جلب الاقتباس❌️.حاول مرة اخرى⚠️");
  }
});
