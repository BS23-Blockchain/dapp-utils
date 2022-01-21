import { expect } from "chai";
import { ethers } from "hardhat";

describe.skip("Italian Greeting", async function () {
	it("Greet with Ciao", async function () {
		const Greeter = await ethers.getContractFactory("Greeter");
		const greeter = await Greeter.attach(
			"0x72A51350457dDb48AEC6F90Dc1c350FCf489eC1b"
		);
		const transaction = await greeter.setGreeting("Ciao");
		console.log(transaction);
		await transaction.wait();
		expect(await greeter.greet()).to.equal("Ciao");
	});
});
