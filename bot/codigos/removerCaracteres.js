export async function removerCaracteres(c, mensagem) {
    // Obtém o texto da mensagem, seja como 'conversation' ou como legenda de imagem
    const textoMensagem = mensagem.message?.conversation || mensagem.message?.imageMessage?.caption;

    // Verifica se há mensagem de texto ou legenda
    if (textoMensagem) {
        // Texto das regras do grupo (resumo ou palavras-chave para identificação)
        const textoDasRegras = [
            "👏🍾 *DﾑMﾑS*💃🔥 *Dﾑ NIGӇԵ*💃🎶",
            "📜 *REGRAS DO GRUPO!*",
            "⚠️ *LEIAM COM ATENÇÃO. O DESCUMPRIMENTO PODE RESULTAR EM REMOÇÃO.*",
            "1️⃣ *Seja Respeitoso(a):* 🤝 Respeito é essencial para a convivência. Não toleramos atitudes preconceituosas ou desrespeitosas.",
            "2️⃣ *Conteúdo Impróprio é Proibido:* 🚫 Evite compartilhar material ofensivo, sensível ou qualquer coisa que infrinja as regras de convivência.",
            "3️⃣ *Nudes Somente em Visualização Única:* 👀 Outros tipos de conteúdo íntimo são inadequados e não serão aceitos.",
            "4️⃣ 🚫 *Links Não São Permitidos:* 🔗 A divulgação de links, anúncios, vendas ou conteúdos promocionais é proibida.",
            "5️⃣ *Evite Flood e Spam:* ⚠️ Mensagens repetitivas ou sem relevância atrapalham o grupo.",
            "6️⃣ *Respeite os Limites do Grupo:* 🎥 Não inicie chamadas de vídeo ou áudio sem a autorização de todos.",
            "7️⃣ *Evite Assuntos Polêmicos:* 💬 Política, religião e futebol podem gerar discussões desnecessárias.",
            "8️⃣ *Proibido Figurinhas de Crianças:* 🚫 Imagens ou stickers relacionados a crianças são proibidos.",
            "9️⃣ *Respeite a Privacidade:* 🔒 Questões pessoais devem ser tratadas no privado. Não fale mal de outros membros nem faça generalizações. Se houver algo a resolver, resolva no privado.",
            "🔟 *Quer falar no PV?* 📩 Peça permissão antes de iniciar a conversa.",
            "1️⃣1️⃣ *Sobre Invasões:* 🚪 Se alguém invadir seu PV, iniciar vídeo ou chamada de voz e você não gostar, bloqueie. Todos sabem como fazer isso. Evite reclamações desnecessárias: seja maduro e resolva diretamente.",
            "1️⃣2️⃣ *Se sair do grupo sem motivo plausível e quiser voltar, ficará 15 dias de castigo antes de poder entrar novamente.*",
            "🔒 © 2024 Damas da Night"
        ];

        // Verifica se a mensagem contém as regras (evita remoção)
        if (textoDasRegras.some(regra => textoMensagem.includes(regra))) {
            console.log("Mensagem identificada como REGRAS DO GRUPO. Não será removida.");
            return; // Sai da função sem apagar ou banir
        }

        // Verifica o comprimento total do texto
        const comprimentoTotal = textoMensagem.length;

        // Obtém o ID do usuário que enviou a mensagem
        const usuarioId = mensagem.key.participant || mensagem.key.remoteJid;
        const grupoId = mensagem.key.remoteJid;

        // Verifica se o usuário é um administrador no grupo
        const metadata = await c.groupMetadata(grupoId);
        const isAdmin = metadata.participants.some(participant => 
            participant.id === usuarioId && 
            (participant.admin === 'admin' || participant.admin === 'superadmin')
        );

        // Apenas se o usuário NÃO for administrador
        if (!isAdmin) {
            // Verifica se a mensagem ou legenda tem mais de 950 caracteres
            if (comprimentoTotal > 950) {
                try {
                    // Apaga a mensagem do grupo
                    await c.sendMessage(grupoId, { delete: mensagem.key });

                    // Remove o usuário do grupo
                    await c.groupParticipantsUpdate(grupoId, [usuarioId], 'remove');
                    
                    // Envia uma mensagem de aviso ao grupo
                    await c.sendMessage(grupoId, { 
                        text: '✅🚫 𝐔𝐬𝐮𝐚𝐫𝐢𝐨 𝐛𝐚𝐧𝐢𝐝𝐨(a) 𝐩𝐨𝐫 𝐦𝐞𝐧𝐬𝐚𝐠𝐞𝐦 𝐬𝐮𝐬𝐩𝐞𝐢𝐭𝐚 𝐜𝐨𝐦 𝐦𝐮𝐢𝐭𝐨𝐬 𝐜𝐚𝐫𝐚𝐜𝐭𝐞𝐫𝐞𝐬 𝐞𝐬𝐩𝐞𝐜𝐢𝐚𝐢𝐬 ✨💥 𝐞 𝐞𝐱𝐭𝐫𝐞𝐦𝐚𝐦𝐞𝐧𝐭𝐞𝐧𝐭𝐞 𝐥𝐨𝐧𝐠𝐚! 📝⛔' 
                    });

                    console.log(`Usuário ${usuarioId} banido por mensagem longa.`);
                } catch (error) {
                    console.error(`Erro ao remover participante:`, error);
                    await c.sendMessage(grupoId, { text: 'Erro ao tentar banir o usuário. ❌' });
                }
            }
        } else {
            console.log(`Usuário ${usuarioId} é administrador e não será removido.`);
        }
    }
}
