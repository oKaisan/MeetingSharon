# 4º Meeting | Banner oficial

Página estática para personalização e download do banner oficial do 4º Meeting do Instituto Sharon.

## Como executar localmente

Abra o arquivo `index.html` no navegador. Não é necessário instalar dependências.

Para testar com um servidor local, use qualquer servidor estático, por exemplo:

```bash
python -m http.server 8000
```

Depois acesse `http://localhost:8000`.

## Publicar no GitHub

Crie um repositório vazio no GitHub e execute na pasta do projeto:

```bash
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
git branch -M main
git push -u origin main
```

## Publicar na Vercel

1. Acesse a Vercel e escolha **Add New Project**.
2. Importe o repositório do GitHub.
3. Mantenha o preset como **Other** (site estático).
4. Deixe o comando de build vazio.
5. Use `./` como diretório de saída, se a Vercel solicitar.
6. Clique em **Deploy**.

O arquivo `index.html` está na raiz e a arte é carregada pelo caminho relativo `LY/Sharonnn.png`, portanto a publicação funciona tanto no GitHub quanto na Vercel.
