const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('전적검색')
    .setDescription('최근 기록을 확인하실 수 있습니다.')
    .addStringOption(option =>
      option.setName("name")
        .setDescription('게임내 이름을 입력하세요')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('tag')
        .setDescription('인게임 태그를 입력해주세요')
        .setRequired(true),
    ),

  async execute(interaction) {
    const name = await interaction.options.getString("name");
    const tag = await interaction.options.getString("tag");
    console.log(name);
    console.log(tag);
    await interaction.reply("정보를 조회중(최대 10초)입니다~");
    const getHtml = async () => {
      try {
        return await axios.get(`https://api.henrikdev.xyz/valorant/v1/account/${name}/${tag}`);
      } catch (error) {
        //console.error(error);
        return await -1;
      }
    };
    const getMatch = async ()=>{
      try {
        return await axios.get(`https://api.henrikdev.xyz/valorant/v1/mmr-history/kr/${name}/${tag}`)
      } catch (error) {
        //console.error(error);
        return await -1;
      }
    }

    getHtml().then(async (html) => {
      //console.log(html.data)
      if (html == -1) {
        var Embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setAuthor({ name: "오류가 발생하였습니다!"})
            .addFields(
              { name: '\u200B', value: '\u200B' },
              { name: '오류1', value: '존재하지 않은 유저' , inline: true },
              { name: '오류2', value: '비활성화 or 비공개 유저' , inline: true },
            )
            .setTimestamp()
            .setFooter({ text: 'XwX' });
          await interaction.followUp({ embeds: [Embed] });

      } else {
        const $ = await html.data.data;
        const name = await $.name;
        const tag = await $.tag;
        const level = await $.account_level;
        const profile = await $.card.wide;
        getMatch().then(async (html)=>{
          const $ = await html.data.data;
          const tire = await $[0].images.large;
          const tireName = await $[0].currenttierpatched;
          const num = await $[0].currenttier;
          var text = "";
          var color = "";
          let arr = new Array();
          const match = new Array();
          for(i in $){
            arr[i]=$[i].mmr_change_to_last_game
          }
          for(let i=0; i<5;i++){
            if(arr[i]>0){
              match[i]='승';
            }else{
              match[i]='패';
            }
          }
          if (num < 18) {
            color = "https://postfiles.pstatic.net/MjAyMjEyMjVfMzAg/MDAxNjcxOTYxNDc3NDYz.a59xImjfkAlirp7hjg2zm3etzYW6-i__1V18vnkv5sgg.-SPoNzTMFaAYfruZ-GAoTIsGTeNbXBRdLOiEA9ME9KYg.PNG.blenbre777/red.png?type=w773";
            text = "(owO) ... - What the?";
          } else if (num < 20) {
            color = "https://postfiles.pstatic.net/MjAyMjEyMjVfNCAg/MDAxNjcxOTYxNDc1MTg1.B_Hm9XLfGxKI_UE0IgKme6ikQqFwG6Zkcu_qJw5n-SYg.ccBf_sfIqkwcUc9VMfzK4gKn7x7iEvUMU2UjgG8yqBAg.PNG.blenbre777/yellow.png?type=w773";
            text = "(OwO)/ - Good"
          } else if (num < 30) {
            color = "https://postfiles.pstatic.net/MjAyMjEyMjVfMTUz/MDAxNjcxOTYxNDcyNTQ4._yxT-mHfssPo-0MzsSZEqVNUncmkYLslQ08LycqK4aAg.AzGl1SP6XDA8mR5pb3eNRowJqVw9k-52S7YM-a4ybbEg.PNG.blenbre777/green.png?type=w773";
            text = "(OwO)> - Very Good"
          }
          var Embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setAuthor({ name: name, iconURL: color })
            .setDescription('#' + tag)
            .setThumbnail(tire)
            .addFields(
              { name: '최근전적', value: ''+match[0]+' '+match[1]+' '+match[2]+' '+match[3]+' '+match[4]},        
              { name: '\u200B', value: '\u200B' },   
              //{ name: 'kda', value: '2', inline: true },
              //{ name: '헤드샷비율', value: '3', inline: true },
              //{ name: '\u200B', value: '\u200B' },   
            )
            .addFields({ name: '레벨', value: 'LV:'+level, inline: true })
            .addFields({ name: '티어', value: '.'+tireName, inline: true })
            .setImage(profile)
            .setTimestamp()
            .setFooter({ text: text, iconURL: color });
          await interaction.followUp({ embeds: [Embed] });
        })
      }
    });
  },
};




