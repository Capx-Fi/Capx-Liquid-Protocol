const Controller = artifacts.require("Controller");
const Master = artifacts.require("Master");
const Vest = artifacts.require("Vesting");
const helper = require('./../utils');
const { upgradeProxy } = require('@openzeppelin/truffle-upgrades');
const web3 = require("web3");
const ERC20test = artifacts.require("ERC20Test");



contract('Vesting Test', (accounts) => {
    var testERC20;
    var masterInstance;
    var vestingInstance;

    // Deploying ERC20 token in test environment
    it('Deployed ERC20', async() => {
        vestingInstance = await Vest.deployed();
        masterInstance = await Master.deployed();
        testERC20 = await ERC20test.new("TET","TET","100000000000000000000000000");
        assert(testERC20.address !== '', "Contract was deployed");

    });

   

    it('Invalid token amounts',async() => {
        

        var a1 = []
        var a2 = []
        var a3 = []
        var a4 = []
        const ipfsHash = "QmVcrjMQVhdCEnmCs78x4MaiLSBgnvygaXLT5nH9YFsvi7";
        const controllerInstance = await Controller.deployed();
        const erc20 = testERC20;
        await erc20.approve(masterInstance.address,"600",{from: accounts[0]});
        let kp = 1666698326 //  25 October 2022
        await a1.push(accounts[0]);
        await a2.push(kp.toString());
        await a3.push("100")
        await a4.push(true)
        kp+=86400
        await a1.push(accounts[1]);
        await a2.push(kp.toString());
        await a3.push("200")
        await a4.push(true)
        kp+=86400
        await a1.push(accounts[2]);
        await a2.push(kp.toString());
        await a3.push("300")
        await a4.push(true)
        var a5 = []
        var a6 = []
        var a7 = []
        
        
        try {
            await masterInstance.createBulkDerivative("name","QmVcrjMQVhdCEnmCs78x4MaiLSBgnvygaXLT5nH9YFsvi7",erc20.address,["0","500"],a6,a6,a6,a6,a1,a2,a3,{from: accounts[0]});
        } catch (error) {
            assert(error.message.includes("Inconsistent amount of tokens"));
            return
        }
        assert(false);
        
    });

    it('Inconsistency in vesting details.',async() => {

        var a1 = []
        var a2 = []
        var a3 = []
        var a4 = []
        const controllerInstance = await Controller.deployed();
        const erc20 = testERC20;
        await erc20.approve(masterInstance.address,"600",{from: accounts[0]});
        let kp = 1666698326 //  25 October 2022
        await a1.push(accounts[0]);
        await a2.push(kp.toString());
        await a3.push("100")
await a4.push(true)
        kp+=86400
        await a1.push(accounts[1]);
        await a2.push(kp.toString());
        kp+=86400
        await a1.push(accounts[2]);
        var a5 = []
        var a6 = []
        var a7 = []
        try {
            
            await masterInstance.createBulkDerivative("name","QmVcrjMQVhdCEnmCs78x4MaiLSBgnvygaXLT5nH9YFsvi7",erc20.address,["0","500"],a6,a6,a6,a6,a1,a2,a3,{from: accounts[0]});
        } catch (error) {
            assert(error.message.includes("Inconsistency in vesting details"));
            return
        }
        assert(false);
        
    });

    it('Vest time of the past',async() => {

        var a1 = []
        var a2 = []
        var a3 = []
        var a4 = []
        const controllerInstance = await Controller.deployed();
        const erc20 = testERC20;
        await erc20.approve(masterInstance.address,"600",{from: accounts[0]});
        let kp = 1632419449 //  23 September 2021
        await a1.push(accounts[0]);
        await a2.push(kp.toString());
        await a3.push("100")
await a4.push(true)
        kp+=86400
        await a1.push(accounts[1]);
        await a2.push(kp.toString());
        await a3.push("200")
await a4.push(true)
        kp+=86400
        await a1.push(accounts[2]);
        await a2.push(kp.toString());
        await a3.push("300")
await a4.push(true)
var a5 = []
        var a6 = []
        var a7 = []
        try {
            
            await masterInstance.createBulkDerivative("name","QmVcrjMQVhdCEnmCs78x4MaiLSBgnvygaXLT5nH9YFsvi7",erc20.address,["0","600"],a6,a6,a6,a6,a1,a2,a3,{from: accounts[0]});
        } catch (error) {
            assert(error.message.includes("Not a future Vest End Time"));
            return
        }
        assert(false);


        
    });

    it('Giving empty fields',async() => {

        var a1 = []
        var a2 = []
        var a3 = []
        var a4 = []
        const controllerInstance = await Controller.deployed();
        const erc20 = testERC20;
        await erc20.approve(masterInstance.address,"0",{from: accounts[0]});
        let kp = 1666698326 //  25 October 2022
        
        var a5 = []
        var a6 = []
        var a7 = []

        try{

            await masterInstance.createBulkDerivative("name","QmVcrjMQVhdCEnmCs78x4MaiLSBgnvygaXLT5nH9YFsvi7",erc20.address,["0","0"],a1,a2,a3,a4,a5,a6,a7,{from: accounts[0]});
        }catch(error){
            assert(error.message.includes("Invalid Input"));
            return;
        }
        assert(false);
    });

    it('Invalid IPFS Hash',async() => {

        var a1 = []
        var a2 = []
        var a3 = []
        var a4 = []
        const controllerInstance = await Controller.deployed();
        const erc20 = testERC20;
        await erc20.approve(masterInstance.address,"700",{from: accounts[0]});
        let kp = 1666698326 //  25 October 2022
        await a1.push(accounts[0]);
        await a2.push(kp.toString());
        await a3.push("100")
await a4.push(true)
        await a1.push(accounts[3]);
        await a2.push(kp.toString());
        await a3.push("100")
await a4.push(true)
        kp+=86400
        await a1.push(accounts[1]);
        await a2.push(kp.toString());
        await a3.push("200")
await a4.push(true)
        kp+=86400
        await a1.push(accounts[2]);
        await a2.push(kp.toString());
        await a3.push("300")
await a4.push(true)
            
var a5 = []
        var a6 = []
        var a7 = []
        try {
            
            await masterInstance.createBulkDerivative("name","QmVcrjMQVhdCEnms78x4MaiLSBgnvygaXLT5nH9YFsvi7",erc20.address,["0","700"],a6,a6,a6,a6,a1,a2,a3,{from: accounts[0]});
        } catch (error) {
            assert(error.message.includes("Invalid name or document length"));
            return
        }
        assert(false);
        
    });


    
    it('Forcefully sending ERC20 token to controller', async() => {
        const controllerInstance = await Controller.deployed();
        const erc20 = testERC20;
        erc20.transfer(controllerInstance.address,"1",{from: accounts[0]});
        
    });

    it('Vesting tokens for the first time',async() => {

        var a1 = []
        var a2 = []
        var a3 = []
        var a4 = []
        const controllerInstance = await Controller.deployed();
        const erc20 = testERC20;
        await erc20.approve(masterInstance.address,"700",{from: accounts[0]});
        let kp = 1666698326  //  25 October 2022
        await a1.push(accounts[0]);
        await a2.push(kp.toString());
        await a3.push("100")
await a4.push(true)
        await a1.push(accounts[3]);
        await a2.push(kp.toString());
        await a3.push("100")
await a4.push(true)
        kp+=86400
        await a1.push(accounts[1]);
        await a2.push(kp.toString());
        await a3.push("200")
await a4.push(true)
        kp+=86400
        await a1.push(accounts[2]);
        await a2.push(kp.toString());
        await a3.push("300")
await a4.push(true)
var a5 = []
var a6 = []
var a7 = []
let lockIDs = await vestingInstance.lockId().then((response)=>{
    return(response.toString(10));
})
        await masterInstance.createBulkDerivative("name","QmVcrjMQVhdCEnmCs78x4MaiLSBgnvygaXLT5nH9YFsvi7",erc20.address,["0","700"],a6,a6,a6,a6,a1,a2,a3,{from: accounts[0]});
        await vestingInstance.lockId().then((response)=>{
            assert(Number(response.toString(10))-Number(lockIDs)==4);
        })
        
    });

    it("Transfer Lock",async()=>{
        try {
            await masterInstance.transferVestingLock("2",accounts[0],{from:accounts[1]});
        } catch (error) {
            assert(error.message.includes("Not the lock owner"));
        }
        await masterInstance.transferVestingLock("2",accounts[0],{from:accounts[3]});
    });

//     it('Upgrade Works', async () => {
//         try {
//             const controllerInstance = await Controller.deployed();
            
//             const controller2 = await upgradeProxy(controllerInstance.address, Controller2);
//         } catch (error) {
//             await console.log(error.message)
//         }
    
//       });

it('Withdraw tokens after time forward',async() => {
        
    await testERC20.balanceOf(vestingInstance.address).then((response)=>{
        assert(response.toString()=="700");
    })
    
    try {
        await masterInstance.withdrawVestingLock("1");
    } catch (error) {
        assert(error.message.includes("No withdrawl before time"));
    }
    await testERC20.balanceOf(vestingInstance.address).then((response)=>{
        assert(response.toString()=="700");
    })
    try {
        await masterInstance.withdrawVestingLock("2");
    } catch (error) {
        assert(error.message.includes("No withdrawl before time"));
    }
    
    advancement = 86400 * 730 // 1 year
    await helper.advanceTimeAndBlock(advancement);
    
    await masterInstance.withdrawVestingLock("1");
    await testERC20.balanceOf(vestingInstance.address).then((response)=>{
        assert(response.toString()=="600");
    })
    await masterInstance.withdrawVestingLock("2");
    await testERC20.balanceOf(vestingInstance.address).then((response)=>{
        assert(response.toString()=="500");
    })

});


    
   
});