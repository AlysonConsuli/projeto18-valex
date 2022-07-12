<p align="center">
  <a href="https://github.com/AlysonConsuli/projeto18-valex">
    <img src="./readme.png" alt="readme-logo" width="80" height="80">
  </a>

  <h3 align="center">
    projeto18-valex
  </h3>
</p>

## Usage

```bash
$ git clone https://github.com/AlysonConsuli/projeto18-valex

$ cd projeto18-valex

$ npm install

$ npm run dev
```

API:

```
- POST /cards/create/:id (autenticada)
    - Rota para cadastrar um novo cartão
    - headers: {"x-api-key":$"hashApiKey"}
    - body: {
        "type":"$tipoDeNegócio"
    }

- POST /cards/activate/:id
    - Rota para ativar um cartão
    - body: {
        "cvc":$codigoCvc,
        "password":$"senha"
    }
- GET /cards/transactions/:id
    - Rota para listar todos movimentos do cartão

- POST /cards/block/:id
    - Rota para bloquear um cartão pelo id
    - body: {
        "password":$"senhadoCartão"
    }

- POST /cards/unlock/:id
    - Rota para desbloquear um cartão pelo id
    - body: {
        "password":$"senhadoCartão"
    }

- POST /recharge/:id (autenticada)
    - Rota para a empresa recarregar o cartão um usuário pelo id do cartão
    - headers: {"x-api-key":$"hashApiKey"}
    - body: {
        "amount":$valorDeRecarga
    }

- POST /purchase/:cardId
    - Rota para registrar pagamentos pelo id do cartão
    - body: {
        "amount":$valorDoPagamento,
        "businessId":$idDoNegócio,
        "password":$"senha"
    }
```
