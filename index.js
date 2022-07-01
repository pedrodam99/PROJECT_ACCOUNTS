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
          "Consultar Saldo",
          "Depositar",
          "Sacar",
          "Sair",
        ],
      },
    ])
    .then((answer) => {
      const action = answer["action"];
      console.log(action);
    })
    .catch((err) => console.log(err));
}
