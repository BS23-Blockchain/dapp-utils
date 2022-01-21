import * as dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { execSync } from "child_process";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";

import { TASK_COMPILE_SOLIDITY_GET_SOLC_BUILD } from "hardhat/builtin-tasks/task-names";
import { TaskArguments } from "hardhat/types";

dotenv.config();

const installSolcJs = (version: string) => {
  console.log(`installing correct solc version: ${version}`);
  execSync(`npm i -D solc@${version}`, { stdio: [0, 1, 2] });
  execSync(`npm audit fix`, { stdio: [0, 1, 2] });
};

// Overriding the solidity compiler configuration task
task(TASK_COMPILE_SOLIDITY_GET_SOLC_BUILD, async (args: TaskArguments, hre, runSuper) => {
  // check if solc with that version is installed
  const solcPath = path.join(__dirname, "node_modules", "solc");
  if (fs.existsSync(solcPath)) {
    // if not installed update the solc version by running npm
    const solc: { version: string } = JSON.parse(fs.readFileSync(path.join(solcPath, "package.json"), "utf8"));
    console.log(`found solc version: ${solc.version}`);
    if (solc.version !== args.solcVersion) {
      installSolcJs(args.solcVersion);
    }
  } else {
    console.log(`didn't found solc`);
    installSolcJs(args.solcVersion);
  }

  // return the compiler path
  const compilerPath = path.join(solcPath, "soljson.js");
  return {
    compilerPath,
    isSolcJs: true,
    version: args.solcVersion,
  };
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const PROVIDER: string = process.env.PROVIDER || "";
const NETWORKS = Object.fromEntries(
  Object.entries({ rinkeby: {}, mumbai: {} }).map(([network]) => [
    network,
    {
      url: `${process.env[PROVIDER + `_${network.toUpperCase()}_URL`]}${process.env[PROVIDER + "_API_KEY"]}` || "",
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  ])
);

const config: HardhatUserConfig = {
  // Currently supports only a single solidity version
  solidity: {
    version: "0.8.9",
  },
  networks: NETWORKS,
  // create a separate file for mocha config
  mocha: {
    timeout: 50000,
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
};

export default config;
