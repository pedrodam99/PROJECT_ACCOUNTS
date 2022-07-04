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
      switch (action) {
        case "Criar conta":
          createAcccount();
          break;
        case "Consultar saldo":
          getAccountBalance();
          break;
        case "Depositar":
          deposit();
          break;
        case "Sacar":
          withdraw();
          break;
        case "Sair":
          console.log(chalk.bgBlue.black("Obrigado por usar o Accounts!"));
          process.exit();
      }
    })
    .catch((err) => console.log(err));
}

//create an account
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

// add an amount to user account
function deposit() {
  inquirer
    .prompt([{ name: "accountName", message: "Qual o nome da sua conta?" }])
    .then((answer) => {
      const accountName = answer["accountName"];
      if (!checkAccount(accountName)) {
        return deposit();
      }

      inquirer
        .prompt([{ name: "amount", message: "Quanto deseja depositar?" }])
        .then((answer) => {
          const amount = answer["amount"];
          addAmount(accountName, amount);
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
}

// check if an account exists
function checkAccount(accountName) {
  if (!fs.existsSync(`accounts/${accountName}.json`)) {
    console.log(chalk.bgRed.black("Essa conta nao existe"));
    return false;
  }
  return true;
}

function addAmount(accountName, amount) {
  const accountData = getAccount(accountName);

  if (!amount) {
    console.log(
      chalk.bgRed.black("Ocorreu um erro! Tente novamente mais tarde")
    );
    return operation();
  }

  if (amount <= 0) {
    console.log(
      chalk.bgRed.black("Ops! Apenas números positivos, tente novamente!")
    );
    return operation();
  }

  accountData.balance = parseFloat(accountData.balance) + parseFloat(amount);

  fs.writeFileSync(
    `accounts/${accountName}.json`,
    JSON.stringify(accountData),
    function (err) {
      console.log(err);
    }
  );

  console.log(
    chalk.green(`Foi depositado o valor de R$ ${amount} na sua conta!`)
  );
  operation();
}

function subAmount(accountName, amount) {
  const accountData = getAccount(accountName);

  if (!amount) {
    console.log(
      chalk.bgRed.black("Ocorreu um erro! Tente novamente mais tarde")
    );
    return operation();
  }

  if (amount <= 0) {
    console.log(
      chalk.bgRed.black("Ops! Apenas números positivos, tente novamente!")
    );
    return operation();
  }

  accountData.balance = parseFloat(accountData.balance) - parseFloat(amount);

  if (accountData.balance < 0) {
    console.log(
      chalk.red("Você não tem saldo suficiente. Consulte o seu saldo!")
    );
    return operation();
  }
  fs.writeFileSync(
    `accounts/${accountName}.json`,
    JSON.stringify(accountData),
    function (err) {
      console.log(err);
    }
  );

  console.log(chalk.green(`Foi sacado o valor de R$ ${amount} da sua conta!`));
}

function getAccount(accountName) {
  const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
    encoding: "utf-8",
    flag: "r",
  });
  return JSON.parse(accountJSON);
}

function getAccountBalance() {
  inquirer
    .prompt([{ name: "accountName", message: "Qual o nome da sua conta?" }])
    .then((answer) => {
      const accountName = answer["accountName"];
      if (!checkAccount(accountName)) {
        return getAccountBalance();
      }

      const accountData = getAccount(accountName);
      const balance = parseFloat(accountData.balance);

      if (balance >= 0) {
        console.log(chalk.bgGreen.black(`Seu saldo é de R$${balance}`));
        return operation();
      } else {
        console.log(chalk.bgRed.black(`Seu saldo é de R$${balance}`));
        return operation();
      }
    });
}

function withdraw() {
  inquirer
    .prompt([{ name: "accountName", message: "Qual o nome da sua conta?" }])
    .then((answer) => {
      const accountName = answer["accountName"];
      if (!checkAccount(accountName)) {
        return withdraw();
      }

      inquirer
        .prompt([{ name: "amount", message: "Quanto deseja sacar?" }])
        .then((answer) => {
          const amount = answer["amount"];
          subAmount(accountName, amount);
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
}
