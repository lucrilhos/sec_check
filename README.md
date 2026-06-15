# SecCheck - Scanner de Rede e Persistência Automatizada 🛡️🚀

O **SecCheck** é um ecossistema de varredura de segurança defensiva de baixo nível que integra automação em sistemas operacionais Linux, um backend assíncrono em Node.js e persistência de dados em um SGBD relacional PostgreSQL.

O objetivo principal deste projeto foi construir uma arquitetura de segurança ponta a ponta, entendendo o gerenciamento de subprocessos do Linux e aplicando conceitos de desenvolvimento defensivo contra ataques à infraestrutura.

---

## 🛠️ Tecnologias e Arquitetura

* **Automação do SO:** Bash Script & Nmap (mapeamento rápido de portas e detecção de serviços via `-sV -F`).
* **Backend:** Node.js, Express (API RESTful assíncrona).
* **Banco de Dados:** PostgreSQL (Persistência do histórico de varreduras em formato XML nativo).
* **Ferramenta de Análise:** DBeaver (Modelagem e gerenciamento de queries).

---

## 🛡️ Segurança: Proteção Contra SQL Injection

Durante o desenvolvimento do módulo de persistência, um dos focos principais foi mitigar completamente vulnerabilidades de **SQL Injection**. 

Em vez de concatenar entradas do usuário diretamente na query (o que permitiria a execução de comandos maliciosos como `DROP TABLE`), o backend utiliza **Prepared Statements** (parametrização de queries com `$1, $2`). Isso garante que qualquer input enviado pelo usuário seja tratado estritamente como texto puro pelo PostgreSQL.

// Exemplo de implementação defensiva no projeto:
await pool.query(
    'INSERT INTO network_scans (target_ip, raw_xml_result) VALUES ($1, $2)',
    [target, xmlData]
);

---

## 🚀 Como Executar o Projeto

Pré-requisitos:
* - Linux (Debian/Ubuntu baseado)
* - Node.js instalado
* - PostgreSQL ativo com uma database chamada seccheck
* - Nmap instalado (sudo apt install nmap)

## Passo a Passo
**Clone o repositório e navegue até a pasta:**
git clone https://github.com/SEU_USUARIO/seccheck-scanner.git
cd seccheck-scanner

**Instale as dependências listadas no package.json:**
npm install

**Garanta as permissões de execução para o script em Bash:**
chmod +x scanner.sh

**Inicie o servidor Node.js:**
node servidor.js

**Faça um disparo de teste através do terminal (em outra aba):**
curl -X POST http://localhost:3000/api/scan \
     -H "Content-Type: application/json" \
     -d '{"target":"localhost"}'

---

## 🔮 Próximos Passos
[ ] Implementar parser completo do XML para JSON na memória com xml2js para extrair métricas de portas abertas.
[ ] Desenvolver um dashboard visual em React para listar o histórico e gráficos de vulnerabilidades.

---
