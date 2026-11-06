# PLYTOK

Site responsivo inspirado na imagem de referência enviada: cabeçalho simples, área principal verde com título centralizado, campo de link e botão de download, demonstração visual de celular e seção de benefícios. A identidade foi adaptada para verde, branco e preto.

## Requisitos
- Node.js 18 ou superior
- Uma API/provedor de processamento de vídeos compatível

## Instalação
1. Extraia o ZIP.
2. Abra a pasta do projeto no terminal.
3. Execute `npm install`.
4. Copie `.env.example` para `.env`.
5. Configure as variáveis do provedor no `.env`.
6. Execute `npm start`.
7. Abra `http://localhost:3000`.

## Integração do downloader
O frontend envia `POST /api/download` com `{ "url": "..." }`.
O backend encaminha a URL para `DOWNLOADER_API_URL`, opcionalmente com a chave definida em `DOWNLOADER_API_KEY`.

O formato de resposta esperado pelo adaptador é JSON com um destes campos:
- `downloadUrl`
- `download_url`
- `video.noWatermark`
- `video.url`

Se o provedor escolhido usar outro formato, ajuste o mapeamento no trecho indicado em `server.js`. Não coloque chaves secretas no JavaScript do navegador.

**Importante:** o projeto inclui a estrutura do site e o adaptador de backend, mas não inclui uma API de terceiros nem promete remover marca d'água em todos os vídeos. A disponibilidade e qualidade dependem do provedor, do vídeo e das permissões aplicáveis. Use apenas conteúdo que você tenha direito de baixar e respeite os termos da plataforma e os direitos dos criadores.

## Estrutura
```text
plytok/
├── public/
│   ├── css/styles.css
│   ├── js/app.js
│   └── index.html
├── .env.example
├── .gitignore
├── package.json
├── server.js
└── README.md
```

## Verificação
Acesse `GET /api/health` para conferir se o servidor está ativo e se o provedor foi configurado.
