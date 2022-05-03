const Command = require("../Command.js");
const { MessageEmbed, MessageAttachment } = require("discord.js");
const { fail, load } = require("../../utils/emojis.json");

module.exports = class dungeonCommand extends Command {
   constructor(client) {
      super(client, {
         name: "dungeon",

         usage: "dungeon <user mention/id>",
         description: "Generates a dungeon image",
         type: client.types.FUN,
         examples: ["dungeon @split"],
      });
   }

   async run(message, args) {
      const member =
         (await this.getGuildMember(message.guild, args.join(" "))) ||
         message.author;

      message.channel
         .send({
            embeds: [new MessageEmbed().setDescription(`${load} Loading...`)],
         })
         .then(async (msg) => {
            try {
               const buffer = await msg.client.ameApi.generate("ddungeon", {
                  url: this.getAvatarURL(member, "png"),
               });
               const attachment = new MessageAttachment(buffer, "ddungeon.png");

               await message.channel.send({ files: [attachment] });
               await msg.delete();
            } catch (e) {
               await msg.edit({
                  embeds: [new MessageEmbed().setDescription(`${fail} ${e}`)],
               });
            }
         });
   }
};
