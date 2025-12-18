const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // Configuration
  const TREASURY_ADDRESS = process.env.TREASURY_ADDRESS || deployer.address;
  const USDC_ADDRESS = process.env.USDC_ADDRESS || "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"; // Base USDC
  
  console.log("\n--- Deploying BOKBI Token ---");
  const BOKBI = await hre.ethers.getContractFactory("BOKBI");
  const bokbi = await BOKBI.deploy(TREASURY_ADDRESS, deployer.address);
  await bokbi.waitForDeployment();
  const bokbiAddress = await bokbi.getAddress();
  console.log("BOKBI deployed to:", bokbiAddress);

  console.log("\n--- Deploying PALJAPayment ---");
  const PALJAPayment = await hre.ethers.getContractFactory("PALJAPayment");
  const payment = await PALJAPayment.deploy(bokbiAddress, USDC_ADDRESS, TREASURY_ADDRESS);
  await payment.waitForDeployment();
  const paymentAddress = await payment.getAddress();
  console.log("PALJAPayment deployed to:", paymentAddress);

  console.log("\n--- Deploying PALJATalisman ---");
  const PALJATalisman = await hre.ethers.getContractFactory("PALJATalisman");
  const talisman = await PALJATalisman.deploy();
  await talisman.waitForDeployment();
  const talismanAddress = await talisman.getAddress();
  console.log("PALJATalisman deployed to:", talismanAddress);

  // Configure contracts
  console.log("\n--- Configuring contracts ---");
  
  // Set payment contract in Talisman
  await talisman.setPaymentContract(paymentAddress);
  console.log("Set payment contract in Talisman");

  console.log("\n========================================");
  console.log("DEPLOYMENT COMPLETE!");
  console.log("========================================");
  console.log("BOKBI Token:", bokbiAddress);
  console.log("PALJAPayment:", paymentAddress);
  console.log("PALJATalisman:", talismanAddress);
  console.log("Treasury:", TREASURY_ADDRESS);
  console.log("========================================");
  
  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    deployer: deployer.address,
    contracts: {
      BOKBI: bokbiAddress,
      PALJAPayment: paymentAddress,
      PALJATalisman: talismanAddress
    },
    config: {
      treasury: TREASURY_ADDRESS,
      usdc: USDC_ADDRESS
    },
    timestamp: new Date().toISOString()
  };
  
  console.log("\nDeployment Info (save this!):");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Verify contracts on Basescan (if not local)
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("\n--- Verifying contracts on Basescan ---");
    console.log("Waiting 30 seconds for Basescan to index...");
    await new Promise(r => setTimeout(r, 30000));
    
    try {
      await hre.run("verify:verify", {
        address: bokbiAddress,
        constructorArguments: [TREASURY_ADDRESS, deployer.address]
      });
      console.log("BOKBI verified!");
    } catch (e) {
      console.log("BOKBI verification failed:", e.message);
    }
    
    try {
      await hre.run("verify:verify", {
        address: paymentAddress,
        constructorArguments: [bokbiAddress, USDC_ADDRESS, TREASURY_ADDRESS]
      });
      console.log("PALJAPayment verified!");
    } catch (e) {
      console.log("PALJAPayment verification failed:", e.message);
    }
    
    try {
      await hre.run("verify:verify", {
        address: talismanAddress,
        constructorArguments: []
      });
      console.log("PALJATalisman verified!");
    } catch (e) {
      console.log("PALJATalisman verification failed:", e.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
