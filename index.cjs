require("dotenv").config();
const { QuickDB } = require("quick.db");
const db = new QuickDB();

const {
    Client,
    GatewayIntentBits,
    Collection,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    PermissionsBitField
} = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

client.commands = new Collection();

client.once("clientReady", () => {
    console.log(`🍋 ${client.user.tag} が起動しました！`);

    client.user.setActivity("🍹レモネード飲みたい", {
        type: 0
    });
});

client.on("interactionCreate", async interaction => {

    if (interaction.isChatInputCommand()) {

        if (interaction.commandName === "ping") {
            return interaction.reply(
                "🏓 Pong! レモネードボット起動中！"
            );
        }

        if (interaction.commandName === "ticket") {

            const embed = new EmbedBuilder()
                .setTitle("🍋 レモネードをサポート")
                .setDescription("下のボタンを押してチケット作成！")
                .setColor("Yellow");

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("create_ticket")
                        .setLabel("🎫 チケット作成")
                        .setStyle(ButtonStyle.Primary)
                );

            return interaction.reply({
                embeds: [embed],
                components: [row]
            });
        }
    }

    if (interaction.commandName === "balance") {

    const coins =
        await db.get(
            `coins_${interaction.user.id}`
        ) || 0;

    return interaction.reply(
        `💰 ${interaction.user.username} の所持金: ${coins}コイン`
    );
}

if (interaction.commandName === "daily") {

    const userId =
        interaction.user.id;

    const lastDaily =
        await db.get(
            `daily_${userId}`
        );

    const now = Date.now();

    const cooldown =
        24 * 60 * 60 * 1000;

    if (
        lastDaily &&
        now - lastDaily < cooldown
    ) {

        const remaining =
            cooldown - (now - lastDaily);

        const hours =
            Math.floor(
                remaining / 3600000
            );

        const minutes =
            Math.floor(
                (remaining % 3600000)
                / 60000
            );

        return interaction.reply({
            content:
                `⏰ 次のdailyまで **${hours}時間 ${minutes}分**`,
            ephemeral: true
        });
    }

    const coins =
        await db.get(
            `coins_${userId}`
        ) || 0;

const boost =
    await db.get(
        `coinboost_${userId}`
    );

const reward =
    boost ? 200 : 100;

    await db.set(
        `coins_${userId}`,
        coins + reward
    );

    await db.set(
        `daily_${userId}`,
        now
    );

    return interaction.reply(
        `💰 ${reward}コインGET！`
    );
}

if (interaction.commandName === "coin-add") {

    if (!interaction.memberPermissions.has("Administrator")) {
        return interaction.reply({
            content: "❌ 管理者だけ！",
            ephemeral: true
        });
    }

    const user =
        interaction.options.getUser("user");

    const amount =
        interaction.options.getInteger("amount");

    const coins =
        await db.get(
            `coins_${user.id}`
        ) || 0;

    await db.set(
        `coins_${user.id}`,
        coins + amount
    );

    return interaction.reply(
        `💰 ${user.username} に ${amount} コイン追加！`
    );
}

if (interaction.commandName === "gacha") {

const luck =
    await db.get(
        `luck_${userId}`
    );

const chance =
    Math.random() *
    (luck ? 85 : 100);

let reward = "";

if (chance < 60) {
    reward = "⚪ Common";
}
else if (chance < 85) {
    reward = "🔵 Rare";
}
else if (chance < 95) {
    reward = "🟣 Epic";
}
else {
    reward = "🟡 Legendary 👑";
}

return interaction.reply(
    `🎰 ガチャ結果！\n\n${reward}`
);

}

const userId =
    interaction.user.id;

const tickets =
    await db.get(
        `tickets_${userId}`
    ) || 0;

const coins =
    await db.get(
        `coins_${userId}`
    ) || 0;

if (tickets <= 0 && coins < 100) {
    return interaction.reply({
        content:
            "❌ コインかチケット足りない！",
        ephemeral: true
    });
}

if (tickets > 0) {

    await db.set(
        `tickets_${userId}`,
        tickets - 1
    );

} else {

    await db.set(
        `coins_${userId}`,
        coins - 100
    );
}


if (interaction.commandName === "profile") {

    const userId =
        interaction.user.id;

    const coins =
        await db.get(
            `coins_${userId}`
        ) || 0;

    const tickets =
        await db.get(
            `tickets_${userId}`
        ) || 0;

    const luck =
        await db.get(
            `luck_${userId}`
        );

    const coinBoost =
        await db.get(
            `coinboost_${userId}`
        );

    const privateVC =
        await db.get(
            `privatevc_${userId}`
        );

const badges =
    await db.get(
        `badges_${userId}`
    ) || [];

    return interaction.reply(
`👤 **${interaction.user.username} のプロフィール**

💰 コイン: ${coins}
🎟️ ガチャ券: ${tickets}
🏅 バッジ:
${badges.length
? badges.join(", ")
: "なし"}

🍀 LuckBoost: ${luck ? "✅" : "❌"}
💰 CoinBoost: ${coinBoost ? "✅" : "❌"}
🎙️ PrivateVC権: ${privateVC ? "✅" : "❌"}`
    );
}

if (interaction.commandName === "ranking") {

    const all =
        await db.all();

    const users =
        all
            .filter(data =>
                data.id.startsWith(
                    "coins_"
                )
            )
            .map(data => ({
                userId:
                    data.id.replace(
                        "coins_",
                        ""
                    ),
                coins:
                    data.value
            }))
            .sort(
                (a, b) =>
                    b.coins -
                    a.coins
            )
            .slice(0, 10);

    if (!users.length) {
        return interaction.reply(
            "❌ まだランキングがない！"
        );
    }

    let text =
        "🏆 **コインランキング TOP10**\n\n";

    for (
        let i = 0;
        i < users.length;
        i++
    ) {

        const user =
            await client.users
                .fetch(
                    users[i].userId
                )
                .catch(() => null);

        text +=
            `#${i + 1} ${
                user
                ? user.username
                : "不明ユーザー"
            } - 💰 ${
                users[i].coins
            }コイン\n`;
    }

    return interaction.reply(
        text
    );
}

if (interaction.commandName === "give") {

    const target =
        interaction.options.getUser(
            "user"
        );

    const amount =
        interaction.options.getInteger(
            "amount"
        );

    const userId =
        interaction.user.id;

    // 自分禁止
    if (target.id === userId) {
        return interaction.reply({
            content:
                "❌ 自分には送れない！",
            ephemeral: true
        });
    }

    // Bot禁止
    if (target.bot) {
        return interaction.reply({
            content:
                "❌ Botには送れない！",
            ephemeral: true
        });
    }

    // 0以下禁止
    if (amount <= 0) {
        return interaction.reply({
            content:
                "❌ 1以上にして！",
            ephemeral: true
        });
    }

    const coins =
        await db.get(
            `coins_${userId}`
        ) || 0;

    // 所持金チェック
    if (coins < amount) {
        return interaction.reply({
            content:
                "❌ コイン足りない！",
            ephemeral: true
        });
    }

    const targetCoins =
        await db.get(
            `coins_${target.id}`
        ) || 0;

    // 引く
    await db.set(
        `coins_${userId}`,
        coins - amount
    );

    // 相手に追加
    await db.set(
        `coins_${target.id}`,
        targetCoins + amount
    );

    return interaction.reply(
        `🎁 ${target.username} に ${amount}コイン送った！`
    );
}

if (interaction.commandName === "ban") {

    if (
        !interaction.memberPermissions.has(
            "BanMembers"
        )
    ) {
        return interaction.reply({
            content:
                "❌ BAN権限必要！",
            ephemeral: true
        });
    }

    const target =
        interaction.options.getUser(
            "user"
        );

    const reason =
        interaction.options.getString(
            "reason"
        ) || "理由なし";

    const member =
        interaction.guild.members.cache.get(
            target.id
        );

    if (!member) {
        return interaction.reply({
            content:
                "❌ ユーザー見つからない！",
            ephemeral: true
        });
    }

    await member.ban({
        reason: reason
    });

    // ←ここにログチャンネルID
    const logChannel =
        interaction.guild.channels.cache.get(
            "1508088379043217439"
        );

    const embed =
        new EmbedBuilder()
            .setTitle("🔨 BANログ")
            .setColor("Red")
            .addFields(
                {
                    name: "👤 BANされた人",
                    value: `${target.tag}`
                },
                {
                    name: "🛠️ 実行者",
                    value:
                        interaction.user.tag
                },
                {
                    name: "📝 理由",
                    value: reason
                }
            )
            .setTimestamp();

    if (logChannel) {
        logChannel.send({
            embeds: [embed]
        });
    }

    return interaction.reply(
        `🔨 ${target.tag} をBAN！`
    );
}

if (interaction.commandName === "timeout") {

    if (
        !interaction.memberPermissions.has(
            "ModerateMembers"
        )
    ) {
        return interaction.reply({
            content:
                "❌ タイムアウト権限必要！",
            ephemeral: true
        });
    }

    const target =
        interaction.options.getUser(
            "user"
        );

    const minutes =
        interaction.options.getInteger(
            "minutes"
        );

    const reason =
        interaction.options.getString(
            "reason"
        ) || "理由なし";

    const member =
        interaction.guild.members.cache.get(
            target.id
        );

    if (!member) {
        return interaction.reply({
            content:
                "❌ ユーザー見つからない！",
            ephemeral: true
        });
    }

    await member.timeout(
        minutes * 60 * 1000,
        reason
    );

    const logChannel =
        interaction.guild.channels.cache.get(
            "1508628707009495171"
        );

    const embed =
        new EmbedBuilder()
            .setTitle("🔇 Timeoutログ")
            .setColor("Orange")
            .addFields(
                {
                    name: "👤 対象",
                    value:
                        target.tag
                },
                {
                    name: "⏰ 時間",
                    value:
                        `${minutes}分`
                },
                {
                    name: "🛠️ 実行者",
                    value:
                        interaction.user.tag
                },
                {
                    name: "📝 理由",
                    value:
                        reason
                }
            )
            .setTimestamp();

    if (logChannel) {
        logChannel.send({
            embeds: [embed]
        });
    }

    return interaction.reply(
        `🔇 ${target.tag} を ${minutes}分タイムアウト！`
    );
}

if (interaction.commandName === "privatevc") {

    const hasAccess =
        await db.get(
            `privatevc_${interaction.user.id}`
        );

    if (!hasAccess) {
        return interaction.reply({
            content:
                "❌ プライベートVC権が必要！",
            ephemeral: true
        });
    }

    const channel =
        await interaction.guild.channels.create({
            name:
                `🔊 ${interaction.user.username}のVC`,
            type: 2
        });

    return interaction.reply(
        `🎙️ 作成完了！ ${channel}`
    );
}

if (interaction.commandName === "shop") {

    return interaction.reply(
`🛒 **レモネードショップ**
🍋 VIP - 500コイン
🔥 GOD - 2000コイン
🎟️ ガチャチケット - 500コイン
🍀 LuckBoost - 1000コイン
💰 CoinBoost - 1500コイン
🎟️ GachaBox - 1200コイン
🧪 MysteryBox - 800コイン
👑 王様バッジ - 1000コイン
🔥 古参バッジ - 2000コイン
🍋 レモネード民 - 500コイン`
    );
}

if (interaction.commandName === "buy") {

    const item =
        interaction.options
            .getString("item")
            .toLowerCase();

const prices = {
    vip: 500,
    god: 2000,
    gachaticket: 500,
    privatevc: 3000,
    luckboost: 1000,
    coinboost: 1500,
    gachabox: 1200,
    mysterybox: 800,
    kingbadge: 1000,
    veteranbadge: 2000,
    lemonbadge: 500
};

    const roleIds = {
        vip: "1507658448085586071",
        god: "1507658496441843882"
    };

    if (!prices[item]) {
        return interaction.reply({
            content:
                "❌ そのアイテムない！",
            ephemeral: true
        });
    }

    const userId =
        interaction.user.id;

    const coins =
        await db.get(
            `coins_${userId}`
        ) || 0;

    if (coins < prices[item]) {
        return interaction.reply({
            content:
                "❌ コイン足りない！",
            ephemeral: true
        });
    }

if (item === "privatevc") {

    await db.set(
        `privatevc_${userId}`,
        true
    );

    await db.set(
        `coins_${userId}`,
        coins - prices[item]
    );

    return interaction.reply(
        "🎙️ プライベートVC権を購入！"
    );
}

if (item === "gachaticket") {

    const tickets =
        await db.get(
            `tickets_${userId}`
        ) || 0;

    await db.set(
        `tickets_${userId}`,
        tickets + 1
    );

    await db.set(
        `coins_${userId}`,
        coins - prices[item]
    );

    return interaction.reply(
        "🎟️ ガチャチケット購入！"
    );
}

if (item === "luckboost") {

    await db.set(
        `luck_${userId}`,
        true
    );

    await db.set(
        `coins_${userId}`,
        coins - prices[item]
    );

    return interaction.reply(
        "🍀 LuckBoost購入！"
    );
}

if (item === "coinboost") {

    await db.set(
        `coinboost_${userId}`,
        true
    );

    await db.set(
        `coins_${userId}`,
        coins - prices[item]
    );

    return interaction.reply(
        "💰 CoinBoost購入！"
    );
}

if (item === "gachabox") {

    const tickets =
        await db.get(
            `tickets_${userId}`
        ) || 0;

    await db.set(
        `tickets_${userId}`,
        tickets + 3
    );

    await db.set(
        `coins_${userId}`,
        coins - prices[item]
    );

    return interaction.reply(
        "🎟️ ガチャ券3枚GET！"
    );
}

if (item === "mysterybox") {

    const reward =
        Math.floor(Math.random() * 1000) + 1;

    await db.set(
        `coins_${userId}`,
        coins - prices[item]
    );

    await db.add(
        `coins_${userId}`,
        reward
    );

    return interaction.reply(
        `🧪 ミステリーボックス！ ${reward}コインGET！`
    );
}

if (
    item === "kingbadge" ||
    item === "veteranbadge" ||
    item === "lemonbadge"
) {

    const badges =
        await db.get(
            `badges_${userId}`
        ) || [];

    const badgeMap = {
        kingbadge: "👑 王様",
        veteranbadge: "🔥 古参",
        lemonbadge: "🍋 レモネード民"
    };

    const selectedBadge =
        badgeMap[item];

    if (
        badges.includes(
            selectedBadge
        )
    ) {
        return interaction.reply({
            content:
                "❌ もう持ってる！",
            ephemeral: true
        });
    }

    badges.push(
        selectedBadge
    );

    await db.set(
        `badges_${userId}`,
        badges
    );

    await db.set(
        `coins_${userId}`,
        coins - prices[item]
    );

    return interaction.reply(
        `🏅 ${selectedBadge} を購入！`
    );
}

const roleId =
    roleIds[item];

if (roleId) {

    const role =
        interaction.guild.roles.cache.get(
            roleId
        );

    if (!role) {
        return interaction.reply({
            content:
                "❌ ロールが見つからない！",
            ephemeral: true
        });
    }

    await interaction.member.roles.add(role);

    await db.set(
        `coins_${userId}`,
        coins - prices[item]
    );

    return interaction.reply(
        `🛒 ${item} を購入！`
    );
}

return interaction.reply({
    content:
        "✅ 購入完了！",
    ephemeral: true
});

}

    if (interaction.isButton()) {

        if (interaction.customId === "create_ticket") {

            const channel =
                await interaction.guild.channels.create({
                    name: `ticket-${interaction.user.username}`,
                    type: ChannelType.GuildText,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: [
                                PermissionsBitField.Flags.ViewChannel
                            ]
                        },
                        {
                            id: interaction.user.id,
                            allow: [
                                PermissionsBitField.Flags.ViewChannel,
                                PermissionsBitField.Flags.SendMessages
                            ]
                        }
                    ]
                });

            return interaction.reply({
                content: `🎫 作成完了！ ${channel}`,
                ephemeral: true
            });
        }
    }
});

client.login(process.env.TOKEN);