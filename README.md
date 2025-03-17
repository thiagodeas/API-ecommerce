# E-commerce API

## Descrição
Esta é uma API de e-commerce que permite aos usuários explorar, comprar e gerenciar produtos em várias categorias. A aplicação foi dockerizada para facilitar a configuração e a execução tanto em ambientes locais quanto em contêineres Docker.

A API foi desenvolvida com **NestJS** e **MongoDB** e possui recursos como autenticação, autorização, gerenciamento de usuários, produtos, categorias e carrinho.

## Tecnologias Utilizadas

### Backend:
- **NestJS**: Framework Node.js para construir aplicações escaláveis.
- **MongoDB**: Banco de dados NoSQL utilizado para armazenar dados da aplicação.
- **Mongoose**: Biblioteca para modelar os dados no MongoDB.
- **JWT**: Implementação de autenticação utilizando tokens JWT.
  
### Docker:
- **Docker**: Utilizado para contêinerizar tanto o backend quanto o banco de dados MongoDB para garantir consistência e facilitar o desenvolvimento e deployment.

## Funcionalidades

- **Cadastro e login de usuários**: Autenticação utilizando JWT.
- **Gerenciamento de produtos**: Criação, edição e exclusão de produtos nas diferentes categorias.
- **Categorias de produtos**: Organize os produtos em categorias como Moda, Beleza, Casa, Esportes.
- **Integração com MongoDB**: O banco de dados MongoDB armazena todos os dados da aplicação.

## Como Rodar a Aplicação

### Pré-requisitos

- **Docker**: Certifique-se de que o Docker esteja instalado na sua máquina. Você pode instalar o Docker [aqui](https://www.docker.com/get-started).

### Rodando Localmente com Docker

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/thiagodeas/API-ecommerce.git
   cd API-ecommerce
2. **Construa e Inicie os Containers**
    ```bash
    docker-compose up -d
Isso irá:
Construir a imagem do backend e do MongoDB.
Iniciar os containers do backend e do MongoDB.
O backend será acessível em http://localhost:3001 e o MongoDB em http://localhost:27017.

Para parar os containers, use:
    ```bash
    docker-compose down
    
### Rodando localmente sem Docker
1. **Clone o repositório**:
    ```bash
    git clone https://github.com/thiagodeas/API-ecommerce.git
    cd API-ecommerce
2. **Instalar depêndencias**:
    ```bash
    npm install
3. **Configurar variáveis de ambiente**:
Crie um arquivo .env na raiz do projeto e configure as variáveis de ambiente necessárias:
    ```bash
    MONGO_HOST=host
    MONGO_PORT=port
    MONGO_DB=db
    MONGO_URI=mongodb://localhost:27017/ecommerce-db
    JWT_SECRET=secret_key
    JWT_EXPIRES_IN=36000
4. **Iniciar o backend**:
    ```bash
    npm run start:dev
## Contribuindo
Sinta-se à vontade para contribuir para este projeto! Se você tiver alguma melhoria ou correção de bug, basta fazer um fork, criar uma nova branch, e submeter um pull request.