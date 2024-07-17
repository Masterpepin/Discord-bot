require('dotenv').config();
const {Client, IntentsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

const roles = [
    {
        id: '1262835791617458266',
        label: 'Monarquia'
    },
    {
        id: '1262836888859967601',
        label: 'Nobleza'
    },
    {
        id: '1262837527706996796',
        label: 'Burguesía'
    },
    {
        id: '1262838085188587560',
        label: 'Siervos'
    },
]

client.on('ready', async (c) => {
    try{
        const channel = await client.channels.cache.get('1262515961030774837');
        if (!channel) return;

        const row = new ActionRowBuilder();

        roles.forEach((role) => {
            row.components.push(
                new ButtonBuilder()
                .setCustomId(role.id)
                .setLabel(role.label)
                .setStyle(ButtonStyle.Primary)
            )
        })

        await channel.send({
            content: 'Claim or remove a role below.',
            components: [row],
        });       
        process.exit();
    }   catch (error) {
        console.log(error);
    }
});

client.login(process.env.TOKEN);
