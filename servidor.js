const express = require('express'); // importa o framweork express para trasnformar o código em servidor web 
const { exec } = require('child_process'); // para executar o script em Bash
const { Pool } = require('pg'); // conexão com o banco de dados PostgreSQL
const fs = require('fs');
const xml2js = require('xml2js');

const app = express(); 
app.use(express.json());

// Configuração do PostgreSQL com as minhas credenciais
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'seccheck',
    password: 'admin',
    port: 5432,
});

// Rota que dispara o scanner
app.post('/api/scan', (req, res) => { // cria um endpoint POST para receber o alvo da varredura
    const { target } = req.body; // ex: 'localhost' ou um numero de ip
    const outputFile = `/home/lucas/Documentos/sec_check/scans/scan_${Date.now()}.xml`; // CORREÇÃO: Caminho absoluto para evitar que o Node se perca de pasta

    if (!target) return res.status(400).json({ error: 'É preciso um alvo' });

    // Função exec para executar o script em bash, é assim que você faria no terminal
    exec(`/home/lucas/Documentos/sec_check/scanner.sh ${target} ${outputFile}`, async (error, stdout, stderr) => {    // exec no meu caminho     
        if (error) {
            console.error("ERRO DO LINUX:", stderr || error.message);
            return res.status(500).json({ error: 'Erro no scanner', detalhes: stderr || error.message }); // se der erro, devolve uma resposta de erro com o status 500 e os detalhes do erro do linux (stderr) ou a mensagem de erro do node (error.message)
        }

        try {
            // O node.js vai dar 'try' no arquivo .xml lendo e armazenando o conteúdo na variável xmlData
            const xmlData = fs.readFileSync(outputFile, 'utf-8');
            
            // Converte o XML para JSON para questões de eficiência
            const parser = new xml2js.Parser();
            const resultJson = await parser.parseStringPromise(xmlData);

            // Salvando o resultado bruto em xml no banco de dados com o comando INSERT
            await pool.query(
                'INSERT INTO network_scans (target_ip, raw_xml_result) VALUES ($1, $2)', // para evitar sql injection, colocamos as variaveis separadas como $1 e $2 e nunca direto no texto sql (<<< esse em questão)
                [target, xmlData]
            );

            // O que foi salvo na tabela foi salvo permanentemente, então podemos deletar o arquivo temporário do ssd 
            fs.unlinkSync(outputFile);

            return res.json({ // devolve uma respota em formato json
                message: 'Varredura concluída e registrada com sucesso!',
                target: target,
                summary: 'Dados salvos no histórico.'
            });

        } catch (dbError) { // CORREÇÃO: Chaves reposicionadas corretamente aqui
            console.error("❌ ERRO NO BANCO DE DADOS:", dbError.message);
            return res.status(500).json({ error: 'Erro ao processar ou salvar o relatório', detalhes: dbError.message });
        }
    });
});

app.listen(3000, () => console.log('SecCheck rodando na porta 3000'));