// modulos externos
const chalk = require("chalk");
const inquirer = require("inquirer");

// modulos internos
const fs = require("fs");

console.log("Iniciamos o Accounts");

operation();
function operation() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "O que voce deseja?",
        choices: [
          "Criar conta",
          "Consultar saldo",
          "Depositar",
          "Sacar",
          "Sair",
        ],
      },
    ])
    .then((answer) => {
      const action = answer["action"];
      if (action == "Criar conta") createAcccount();
    })
    .catch((err) => console.log(err));
}

//criando a conta
function createAcccount() {
  console.log(
    chalk.bgGreen.black(`Parabéns! Obrigado por escolher o nosso banco`)
  );
  console.log(chalk.green("Defina as opções da sua conta a seguir"));
  buildAccount();
}

function buildAccount() {
  inquirer
    .prompt([
      { name: "accountName", message: "Digite um nome para sua conta?" },
    ])
    .then((answer) => {
      const accountName = answer["accountName"];
      console.info(accountName);

      if (!fs.existsSync("accounts")) {
        fs.mkdirSync("accounts");
      }

      if (fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(
          chalk.bgRed.black("Esse nome já existe, escolha outro nome")
        );
        buildAccount();
        return;
      }

      fs.writeFileSync(
        `accounts/${accountName}.json`,
        '{"balance": 0}',
        function (err) {
          console.log(err);
        }
      );

      console.log(chalk.green("Parabéns, sua conta foi criada!"));
      operation();
    })
    .catch((err) => err);
}
