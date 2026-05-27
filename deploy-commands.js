require("dotenv").config();

const {
  REST,
  Routes,
  SlashCommandBuilder
} = require("discord.js");

const commands = [

new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("ユーザーをタイムアウト")
    .addUserOption(option =>
        option
            .setName("user")
            .setDescription("タイムアウトする人")
            .setRequired(true)
    )
    .addIntegerOption(option =>
        option
            .setName("minutes")
            .setDescription("分数")
            .setRequired(true)
    )
    .addStringOption(option =>
        option
            .setName("reason")
            .setDescription("理由")
            .setRequired(false)
    ),

new SlashCommandBuilder()
    .setName("ban")
    .setDescription("ユーザーをBAN")
    .addUserOption(option =>
        option
            .setName("user")
            .setDescription("BANするユーザー")
            .setRequired(true)
    )
    .addStringOption(option =>
        option
            .setName("reason")
            .setDescription("理由")
            .setRequired(false)
    ),

new SlashCommandBuilder()
    .setName("give")
    .setDescription("コインを送る")
    .addUserOption(option =>
        option
            .setName("user")
            .setDescription("送る相手")
            .setRequired(true)
    )
    .addIntegerOption(option =>
        option
            .setName("amount")
            .setDescription("送るコイン数")
            .setRequired(true)
    ),

new SlashCommandBuilder()
    .setName("ranking")
    .setDescription("コインランキングを見る"),

new SlashCommandBuilder()
    .setName("profile")
    .setDescription("プロフィールを見る"),

new SlashCommandBuilder()
    .setName("privatevc")
    .setDescription("自分専用VCを作る"),

  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Botの状態を見る"),

  new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("チケット作成パネル"),

  new SlashCommandBuilder()
    .setName("balance")
    .setDescription("所持コインを見る"),

new SlashCommandBuilder()
    .setName("daily")
    .setDescription("毎日コインを受け取る"),
    

new SlashCommandBuilder()
    .setName("coin-add")
    .setDescription("コインを追加")
    .addUserOption(option =>
        option
            .setName("user")
            .setDescription("対象ユーザー")
            .setRequired(true)
    )
    .addIntegerOption(option =>
        option
            .setName("amount")
            .setDescription("追加コイン")
            .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("gacha")
    .setDescription("100コインでガチャを引く"),

new SlashCommandBuilder()
    .setName("shop")
    .setDescription("ショップを見る"),

new SlashCommandBuilder()
    .setName("buy")
    .setDescription("アイテムを買う")
    .addStringOption(option =>
        option
            .setName("item")
            .setDescription("買うアイテム")
            .setRequired(true)
    )  
].map(command => command.toJSON());

const rest = new REST({ version: "10" })
  .setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("🍋 コマンド登録中...");

    await rest.put(
      Routes.applicationCommands(
        process.env.CLIENT_ID
      ),
      { body: commands }
    );

    console.log("✅ コマンド登録完了！");
  } catch (error) {
    console.error(error);
  }
})();