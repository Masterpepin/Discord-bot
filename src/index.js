require('dotenv').config();
const {Client, IntentsBitField, EmbedBuilder, ActivityType} = require('discord.js');
const mongoose = require('mongoose');
const eventHandler = require('./handlers/eventHandler');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildPresences,
        IntentsBitField.Flags.MessageContent,
    ],
});

(async () => {
    try {
      mongoose.set('strictQuery', false);
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('Connected to DB.');
  
      eventHandler(client);

      client.login(process.env.TOKEN);
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  })();

let status = [
    {
        name: 'Under Ctrl',
        type: ActivityType.Streaming,
        url: 'https://www.youtube.com/watch?v=OqxHy8sCtvA&list=PLpmb-7WxPhe0ZVpH9pxT5MtC4heqej8Es&index=6',
    },
    {
        name: 'Custom Status 1',
    },
    {
        name: 'Custo Status 2',
        type: ActivityType.Watching,
    },
    {
        name: 'Custo Status 3',
        type: ActivityType.Listening,
    },
]

eventHandler(client);

client.on('ready', (c) => {
    console.log(`✅ ${c.user.tag} is online.`);
    
    setInterval(() => {
        let random = Math.floor(Math.random() * status.length )
        client.user.setActivity(status[random]);
    }, 1000);
});

client.on('interactionCreate', async (interaction) => {
    try {
        if (!interaction.isButton())  return;
    await interaction.deferReply();
    
    const role = interaction.guild.roles.cache.get(interaction.customId);
    if (!role){
        interaction.editReply({
            content: "I couldn't find that role",
        })
        return;
    }

    const hasRole = interaction.member.roles.cache.has(role.id);

    if (hasRole) {
        await interaction.member.roles.remove(role);
        await interaction.editReply(`The role ${role} has been removed`);
        return;
    }

    await interaction.member.roles.add(role);
    await interaction.editReply(`The role ${role} has been added`);
        
    } catch (error) {
        console.log(error)
        
    }
})


client.on('interactionCreate', (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'add'){
        const num1 = interaction.options.get('first-number').value;
        const num2 = interaction.options.get('second-number').value;

        interaction.reply(`The sum is ${num1 + num2}`)
    } 
    if (interaction.commandName === 'hola') {
        interaction.reply('HOLAAAAAA');
    }

    if (interaction.commandName === 'ping') {
        interaction.reply('Pong!');
    }
});

client.on('messageCreate', async (message) => {
    if (message.author.bot){
        return;
    }

    if (message.content === 'hello'){
        message.reply('Hello!');
    }
});

client.on('interactionCreate', (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'embed') {
        const embed = new EmbedBuilder()
            .setTitle('Embed title')
            .setDescription('This is an embed description')
            .setColor('Random')
            .addFields({
                name: 'Field title',
                value: 'Some random value',
                inline: true,
            },
            {
                name: '2nd Field title',
                value: 'Some random value',
                inline: true,
            });
        interaction.reply({ embeds: [embed] })
    }
});

client.on('messageCreate', (message) => {
    if (message.content === 'embed'){
        const embed = new EmbedBuilder()
        .setTitle('Embed title')
        .setDescription('This is an embed description')
        .setColor('Random')
        .addFields({
            name: 'Field title',
            value: 'Some random value',
            inline: true,
        },
        {
            name: '2nd Field title',
            value: 'Some random value',
            inline: true,
        });
        message.channel.send({ embeds: [embed]});
    }
});