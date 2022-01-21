import path from "path";
import fs from "fs";
import { execSync } from "child_process";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "hardhat-gas-reporter";
import "solidity-coverage";

import { TASK_COMPILE_SOLIDITY_GET_SOLC_BUILD } from "hardhat/builtin-tasks/task-names";
import { TaskArguments } from "hardhat/types";

const installSolcJs = (version: string) => {
  console.log(`installing solc@${version}`);
  execSync(`npm i -D solc-${version}@npm:solc@${version}`, { stdio: [0, 1, 2] });
  execSync(`npm audit fix`, { stdio: [0, 1, 2] });
};

// Overriding the solidity compiler configuration task
task(TASK_COMPILE_SOLIDITY_GET_SOLC_BUILD, async (args: TaskArguments, hre, runSuper) => {
  // check if solc with that version is installed
  const solcPath = path.join(__dirname, "node_modules", `solc-${args.solcVersion}`);
  if (fs.existsSync(solcPath)) {
    console.log(`found solc@${args.solcVersion}`);
  } else {
    console.log(`didn't found solc@${args.solcVersion}`);
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

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.9",
      },
    ],
  },
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
