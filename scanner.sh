#!/bin/bash

TARGET=$1
OUTPUT_FILE=$2

# Executa o Nmap direto (pulamos a validação inicial para evitar erros de espaço)
echo "[*] Iniciando varredura Nmap em: $TARGET"

nmap -sV -F "$TARGET" -oX "$OUTPUT_FILE" > /dev/null 2>&1

# Verifica se o Nmap terminou com sucesso usando o test tradicional (sem colchetes)
if test $? -eq 0; then
    echo "[+] Varredura concluida com sucesso!"
else
    echo "[-] Erro ao concluir varredura."
    exit 1
fi
