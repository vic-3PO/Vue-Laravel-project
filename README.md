# App laravel + Vue

## Descrição
Este projeto consiste em uma aplicação web construída com Vue.js para o frontend e Laravel para o backend. A aplicação visa fornecer uma plataforma para gerenciar viagens de carros, incluindo funcionalidades como cadastro, atualização, exclusão.

## Pré-requisitos
- [Node.js](https://nodejs.org/) (v14.x ou superior)
- [PHP](https://www.php.net/) (v8.2 ou superior)
- [Composer](https://getcomposer.org/)
- [Git](https://git-scm.com/)

## Instalação
1. Clone este repositório:
   ```bash
   git clone https://github.com/seu-usuario/appcar.git
   ```
2. Instale as dependências do frontend e do backend:
   ```bash
   cd appcar
   npm install
   composer install
   ```

## Configuração do Backend
1. Copie o arquivo `.env.example` e renomeie-o para `.env`:
   ```bash
   cp .env.example .env
   ```
2. Gere a chave de aplicativo Laravel:
   ```bash
   php artisan key:generate
   ```
3. Execute as migrações do banco de dados:
   ```bash
   php artisan migrate
   ```

## Execução
Para executar o projeto, você pode usar o seguinte comando:
```bash
npm run start
```
Isso iniciará o servidor Vue.js para o frontend, o servidor PHP para o backend e outras ferramentas necessárias, como o MailDev e o Cypress.

## Scripts Disponíveis
- `npm run dev`: Inicia o servidor de desenvolvimento Vite para o frontend.
- `npm run build`: Compila o projeto para produção.
- `npm run preview`: Inicia um servidor de pré-visualização após a compilação.
- `npm run serve`: Inicia o servidor PHP para o backend.
- `npm run maildev`: Inicia o servidor MailDev para testes de e-mail.
- `npm run cy`: Abre a interface do Cypress para execução de testes end-to-end.

## Tecnologias Utilizadas
- Vue.js
- Vue Router
- Pinia
- Laravel
- Laravel Sanctum
- Tailwind CSS
- Axios
