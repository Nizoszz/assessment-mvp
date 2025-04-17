#!/bin/bash

echo "📁 Criando pasta prompts..."
mkdir -p prompts

echo "⬇️ Baixando prompts do Gist..."

# Função para baixar e salvar os arquivos com o nome correto
download_prompt() {
  local filepath=$1
  local filename=$(basename "$filepath")
  curl -sS "$PROMPTS_BASE_URL/$filename" -o "prompts/$filename"
}

# Baixando os arquivos usando as variáveis de ambiente
download_prompt "$PROMPT_SYSTEM_GENERATE_MATCH"
download_prompt "$PROMPT_SYSTEM_GENERATE_SCORE_INIT"
download_prompt "$PROMPT_SYSTEM_GENERATE_SCORE_FINAL"
download_prompt "$PROMPT_SYSTEM_RESUME_CURRICULO_INIT"
download_prompt "$PROMPT_SYSTEM_RESUME_CURRICULO_FINAL"

echo "✅ Prompts baixados com sucesso!"
