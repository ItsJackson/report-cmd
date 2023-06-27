const {
    CommandInteraction,
    Client,
    SelectMenuBuilder,
    ButtonBuilder,
    ActionRowBuilder
} = require("discord.js");

module.exports = {
    name: "report",
    description: "❗ Report a member.",
    category: "Moderation",
    options: [
        {
            name: 'user',
            description: "Member to be reported.",
            type: 6, // USER
            required: true
        }
    ],
    permissions: [],
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Array} args 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const member = interaction.options.getMember('user');

        if (interaction.user.id === member.user.id) return interaction.reply({
            content: `You cannot report yourself.`,
            ephemeral: true
        });

        if (!member) return interaction.reply({
            content: "Member not found.",
            ephemeral: true
        });

        if (member.user.bot) return interaction.reply({
            content: `You cannot report a bot.`,
            ephemeral: true
        });

        const defaultReasons = ["Swearing", "NSFW content", "Mini modding", "Age discussion", "DM advertising"];
        const row = new ActionRowBuilder()
            .addComponents(
                [
                    new SelectMenuBuilder()
                        .setCustomId(`report_${member.user.id}`)
                        .setMaxValues(defaultReasons.length)
                        .setMinValues(0)
                        .setOptions(defaultReasons.map(r => {
                            return {
                                label: r,
                                value: r
                            }
                        }))
                        .setPlaceholder("No reason selected.")
                ]
            )

        const row_ = new ActionRowBuilder()
            .addComponents(
                [
                    new ButtonBuilder()
                        .setCustomId(`report_otherreason_${member.user.id}`)
                        .setLabel("Other reason")
                        .setStyle(2),

                    new ButtonBuilder()
                        .setCustomId(`report_cancel`)
                        .setLabel("Cancel")
                        .setStyle(4)
                ],
            )

        return interaction.reply({
            content: `<:peeporules:904111750599811108> **You are currently in the process of reporting ${member.toString()}**\n> Select a reason for reporting the user. Reporting for no reason, or for fun is not encouraged.`,
            components: [row, row_],
            ephemeral: true
        });
        
    }
}