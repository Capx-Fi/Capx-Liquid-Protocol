const Controller = artifacts.require("Controller");
const Master = artifacts.require("Master");
const helper = require('../utils');
const { upgradeProxy } = require('@openzeppelin/truffle-upgrades');
const web3 = require("web3");
const ERC20test = artifacts.require("ERC20Test");



contract('Testing Non Sellable Liquid Tokens', (accounts) => {
    var testERC20;
    var masterInstance;

    // Deploying ERC20 token in test environment
    it('Deployed ERC20', async() => {

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
await a4.push(false)
        kp+=86400
        await a1.push(accounts[1]);
        await a2.push(kp.toString());
        await a3.push("200")
await a4.push(false)
        kp+=86400
        await a1.push(accounts[2]);
        await a2.push(kp.toString());
        await a3.push("300")
await a4.push(false)
var a5 = []
        var a6 = []
        var a7 = []
        
        
        try {
            await masterInstance.createBulkDerivative("name","QmVcrjMQVhdCEnmCs78x4MaiLSBgnvygaXLT5nH9YFsvi7",erc20.address,["500","0"],a1,a2,a3,a4,a5,a6,a7,{from: accounts[0]});
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
await a4.push(false)
        kp+=86400
        await a1.push(accounts[1]);
        await a2.push(kp.toString());
        kp+=86400
        await a1.push(accounts[2]);
        var a5 = []
        var a6 = []
        var a7 = []
        try {
            
            await masterInstance.createBulkDerivative("name","QmVcrjMQVhdCEnmCs78x4MaiLSBgnvygaXLT5nH9YFsvi7",erc20.address,["500","0"],a1,a2,a3,a4,a5,a6,a7,{from: accounts[0]});
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
await a4.push(false)
        kp+=86400
        await a1.push(accounts[1]);
        await a2.push(kp.toString());
        await a3.push("200")
await a4.push(false)
        kp+=86400
        await a1.push(accounts[2]);
        await a2.push(kp.toString());
        await a3.push("300")
await a4.push(false)
var a5 = []
        var a6 = []
        var a7 = []
        try {
            
            await masterInstance.createBulkDerivative("name","QmVcrjMQVhdCEnmCs78x4MaiLSBgnvygaXLT5nH9YFsvi7",erc20.address,["600","0"],a1,a2,a3,a4,a5,a6,a7,{from: accounts[0]});
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
await a4.push(false)
        await a1.push(accounts[3]);
        await a2.push(kp.toString());
        await a3.push("100")
await a4.push(false)
        kp+=86400
        await a1.push(accounts[1]);
        await a2.push(kp.toString());
        await a3.push("200")
await a4.push(false)
        kp+=86400
        await a1.push(accounts[2]);
        await a2.push(kp.toString());
        await a3.push("300")
await a4.push(false)
            
var a5 = []
        var a6 = []
        var a7 = []
        try {
            
            await masterInstance.createBulkDerivative("name","QmVcrjMQVhdCEnms78x4MaiLSBgnvygaXLT5nH9YFsvi7",erc20.address,["700","0"],a1,a2,a3,a4,a5,a6,a7,{from: accounts[0]});
        } catch (error) {
            assert(error.message.includes("Invalid name or document length"));
            return
        }
        assert(false);
        
    });


    it('Vesting tokens - 24 new WVTs',async() => {

        var a1 = []
        var a2 = []
        var a3 = []
        var a4 = []
        const controllerInstance = await Controller.deployed();
        const erc20 = testERC20;
        await erc20.approve(masterInstance.address,"2400",{from: accounts[0]});
        let kp = 1666698326  //  25 October 2022
        for (let index = 0; index < 6; index++) {
            await a1.push(accounts[0]);
            await a2.push(kp.toString());
            await a3.push("100")
await a4.push(false)
            kp+=86400
            await a1.push(accounts[3]);
            await a2.push(kp.toString());
            await a3.push("100")
await a4.push(false)
            kp+=86400
            await a1.push(accounts[1]);
            await a2.push(kp.toString());
            await a3.push("100")
await a4.push(false)
            kp+=86400
            await a1.push(accounts[2]);
            await a2.push(kp.toString());
            await a3.push("100")
await a4.push(false)
            kp+=86400
        }
        var a5 = []
        var a6 = []
        var a7 = []
        try {
            await masterInstance.createBulkDerivative("name","QmVcrjMQVhdCEnmCs78x4MaiLSBgnvygaXLT5nH9YFsvi7",erc20.address,["2400","0"],a1,a2,a3,a4,a5,a6,a7,{from: accounts[0]});
        
        } catch (error) {
            assert(error.message.includes("Derivative limit exhausted"));
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
await a4.push(false)
        await a1.push(accounts[3]);
        await a2.push(kp.toString());
        await a3.push("100")
await a4.push(false)
        kp+=86400
        await a1.push(accounts[1]);
        await a2.push(kp.toString());
        await a3.push("200")
await a4.push(false)
        kp+=86400
        await a1.push(accounts[2]);
        await a2.push(kp.toString());
        await a3.push("300")
await a4.push(false)
var a5 = []
var a6 = []
var a7 = []
        await masterInstance.createBulkDerivative("name","QmVcrjMQVhdCEnmCs78x4MaiLSBgnvygaXLT5nH9YFsvi7",erc20.address,["700","0"],a1,a2,a3,a4,a5,a6,a7,{from: accounts[0]});
        
    });

    

    it('WVT Creation',async() => {

        const controllerInstance = await Controller.deployed();
        let derivedAssetAddress1 = await controllerInstance.derivativeIDtoAddress("1").then(function(response) { return(response.toString(10)) })
        let derivedAssetAddress2 = await controllerInstance.derivativeIDtoAddress("2").then(function(response) { return(response.toString(10)) })
        let derivedAssetAddress3 = await controllerInstance.derivativeIDtoAddress("3").then(function(response) { return(response.toString(10)) })
        
        const derivedAsset1 = await ERC20test.at(derivedAssetAddress1);
        const derivedAsset2 = await ERC20test.at(derivedAssetAddress2);
        const derivedAsset3 = await ERC20test.at(derivedAssetAddress3);
        await derivedAsset1.name().then(function(response){ assert(response.toString(10)==="TET.25Oct2022-NT")})
        await derivedAsset2.name().then(function(response){ assert(response.toString(10)==="TET.26Oct2022-NT")})
        await derivedAsset3.name().then(function(response){ assert(response.toString(10)==="TET.27Oct2022-NT")})
        

    });

    it('WVT Holders',async() => {

        const controllerInstance = await Controller.deployed();
        let derivedAssetAddress1 = await controllerInstance.derivativeIDtoAddress("1").then(function(response) { return(response.toString(10)) })
        let derivedAssetAddress2 = await controllerInstance.derivativeIDtoAddress("2").then(function(response) { return(response.toString(10)) })
        let derivedAssetAddress3 = await controllerInstance.derivativeIDtoAddress("3").then(function(response) { return(response.toString(10)) })
        
        const derivedAsset1 = await ERC20test.at(derivedAssetAddress1);
        const derivedAsset2 = await ERC20test.at(derivedAssetAddress2);
        const derivedAsset3 = await ERC20test.at(derivedAssetAddress3);
        await derivedAsset1.balanceOf(accounts[0]).then(function(response){ assert(response.toString(10)==="100")})
        await derivedAsset2.balanceOf(accounts[1]).then(function(response){ assert(response.toString(10)==="200")})
        await derivedAsset3.balanceOf(accounts[2]).then(function(response){ assert(response.toString(10)==="300")})
        

    });


    
    

    

    it('Transfer WVT Holders',async() => {

        const controllerInstance = await Controller.deployed();
        let derivedAssetAddress1 = await controllerInstance.derivativeIDtoAddress("1").then(function(response) { return(response.toString(10)) })
        let derivedAssetAddress2 = await controllerInstance.derivativeIDtoAddress("2").then(function(response) { return(response.toString(10)) })
        let derivedAssetAddress3 = await controllerInstance.derivativeIDtoAddress("3").then(function(response) { return(response.toString(10)) })
        
        const derivedAsset1 = await ERC20test.at(derivedAssetAddress1);
        const derivedAsset2 = await ERC20test.at(derivedAssetAddress2);
        const derivedAsset3 = await ERC20test.at(derivedAssetAddress3);
        await derivedAsset1.balanceOf(accounts[0]).then(function(response){ assert(response.toString(10)==="100")})
        await derivedAsset2.balanceOf(accounts[1]).then(function(response){ assert(response.toString(10)==="200")})
        await derivedAsset3.balanceOf(accounts[2]).then(function(response){ assert(response.toString(10)==="300")})
        try {
            
            await derivedAsset1.transfer(accounts[1],"50",{from: accounts[0]});
        } catch (error) {
            assert(error.message.includes("Cannot transfer before Vesttime"));
        }
        
        await derivedAsset1.balanceOf(accounts[0]).then(function(response){ assert(response.toString(10)==="100")})
        await derivedAsset1.balanceOf(accounts[1]).then(function(response){ assert(response.toString(10)==="0")})
        
        
    });

    it('Killing the Contract.', async() => {
        const controllerInstance = await Controller.deployed();
        await controllerInstance.kill();
    });

    it('Creating Vesting when the contract is Killed.', async() => {
        var a1 = []
        var a2 = []
        var a3 = []
        var a4 = []
        const controllerInstance = await Controller.deployed();
        const erc20 = testERC20;
        await erc20.approve(masterInstance.address,"100",{from: accounts[0]});
        let kp = 1666698326 //  25 October 2022
        await a1.push(accounts[0]);
        await a2.push(kp.toString());
        await a3.push("100")
await a4.push(false)
var a5 = []
        var a6 = []
        var a7 = []
        try{
            await masterInstance.createBulkDerivative("name","QmVcrjMQVhdCEnmCs78x4MaiLSBgnvygaXLT5nH9YFsvi7",erc20.address,["100","0"],a1,a2,a3,a4,a5,a6,a7,{from: accounts[0]});
        } catch ( error ){
            assert(error.message.includes("FailSafeMode: ACTIVE"));
            return;
        }
        assert(false);
    });

    it('Reviving the Contract.', async() => {
        const controllerInstance = await Controller.deployed();
        await controllerInstance.revive();
    });


    it('Withdraw disallowed',async() => {

        const controllerInstance = await Controller.deployed();
        let derivedAssetAddress1 = await controllerInstance.derivativeIDtoAddress("1").then(function(response) { return(response.toString(10)) })
        let derivedAssetAddress2 = await controllerInstance.derivativeIDtoAddress("2").then(function(response) { return(response.toString(10)) })
        let derivedAssetAddress3 = await controllerInstance.derivativeIDtoAddress("3").then(function(response) { return(response.toString(10)) })
        
        const derivedAsset1 = await ERC20test.at(derivedAssetAddress1);
        const derivedAsset2 = await ERC20test.at(derivedAssetAddress2);
        const derivedAsset3 = await ERC20test.at(derivedAssetAddress3);
        
        try {
            
            await masterInstance.withdrawWrappedVestingToken(derivedAssetAddress1,"50");
        } catch (error) {
            assert(error.message.includes("Cannot withdraw before vest time"));
            return
        }
        assert(false);    

    });

    it('Vesting tokens on already deployed derivatives',async() => {

        var a1 = []
        var a2 = []
        var a3 = []
        var a4 = []
        const controllerInstance = await Controller.deployed();
        const erc20 = testERC20;
        await erc20.approve(masterInstance.address,"600",{from: accounts[0]});
        let kp = 1666698326  //  25 October 2022
        await a1.push(accounts[0]);
        await a2.push(kp.toString());
        await a3.push("100")
await a4.push(false)
        kp+=86400
        await a1.push(accounts[1]);
        await a2.push(kp.toString());
        await a3.push("200")
await a4.push(false)
        kp+=86400
        await a1.push(accounts[2]);
        await a2.push(kp.toString());
        await a3.push("300")
await a4.push(false)
var a5 = []
var a6 = []
var a7 = []
        await masterInstance.createBulkDerivative("name","QmVcrjMQVhdCEnmCs78x4MaiLSBgnvygaXLT5nH9YFsvi7",erc20.address,["600","0"],a1,a2,a3,a4,a5,a6,a7,{from: accounts[0]});
        
    });

    it('Increase in WVT Holders balance after vesting',async() => {

        const controllerInstance = await Controller.deployed();
        let derivedAssetAddress1 = await controllerInstance.derivativeIDtoAddress("1").then(function(response) { return(response.toString(10)) })
        let derivedAssetAddress2 = await controllerInstance.derivativeIDtoAddress("2").then(function(response) { return(response.toString(10)) })
        let derivedAssetAddress3 = await controllerInstance.derivativeIDtoAddress("3").then(function(response) { return(response.toString(10)) })
        
        const derivedAsset1 = await ERC20test.at(derivedAssetAddress1);
        const derivedAsset2 = await ERC20test.at(derivedAssetAddress2);
        const derivedAsset3 = await ERC20test.at(derivedAssetAddress3);

        await derivedAsset1.balanceOf(accounts[0]).then(function(response){ assert(response.toString(10)==="200")})
        await derivedAsset2.balanceOf(accounts[1]).then(function(response){ assert(response.toString(10)==="400")})
        await derivedAsset3.balanceOf(accounts[2]).then(function(response){ assert(response.toString(10)==="600")})
        

    });

    it('Vesting and creating 6 new derived assets',async() => {

        var a1 = []
        var a2 = []
        var a3 = []
        var a4 = []
        const controllerInstance = await Controller.deployed();
        const erc20 = testERC20;
        await erc20.approve(masterInstance.address,"600",{from: accounts[0]});
        let kp = 1666957526
        for (let index = 0; index < 6; index++) {
            await a1.push(accounts[0]);
            await a2.push(kp.toString());
            await a3.push("100")
await a4.push(false)
            kp+=86400
        }
        var a5 = []
        var a6 = []
        var a7 = []
        await masterInstance.createBulkDerivative("name","QmVcrjMQVhdCEnmCs78x4MaiLSBgnvygaXLT5nH9YFsvi7",erc20.address,["600","0"],a1,a2,a3,a4,a5,a6,a7,{from: accounts[0]});
        
    });


    it('Vesting on existing 10 derived assets',async() => {

        var a1 = []
        var a2 = []
        var a3 = []
        var a4 = []
        const controllerInstance = await Controller.deployed();
        const erc20 = testERC20;
        await erc20.approve(masterInstance.address,"1000",{from: accounts[0]});
        let kp = 1666698326  //  25 October 2022
        for (let index = 0; index < 10; index++) {
            await a1.push(accounts[0]);
            await a2.push(kp.toString());
            await a3.push("100")
await a4.push(false)
            kp+=86400
        }   
        var a5 = []
        var a6 = []
        var a7 = []
        await masterInstance.createBulkDerivative("name","QmVcrjMQVhdCEnmCs78x4MaiLSBgnvygaXLT5nH9YFsvi7",erc20.address,["1000","0"],a1,a2,a3,a4,a5,a6,a7,{from: accounts[0]});
        
    });

    

    it('Vesting and creating 7*3 new derived assets',async() => {

        var a1 = []
        var a2 = []
        var a3 = []
        var a4 = []
        const controllerInstance = await Controller.deployed();
        const erc20 = testERC20;
        await erc20.approve(masterInstance.address,"210");


        for(var j=0;j<3;j++){

            let kp = 1695640611 // 25 September
            for (let index = 0; index < 7; index++) {
                await a1.push(accounts[0]);
                await a2.push(kp.toString());
                await a3.push("10");
                await a4.push(false);
                kp+=86400
            }
        }
        

        var a5 = []
        var a6 = []
        var a7 = []
        try {
            
            await masterInstance.createBulkDerivative("name","QmVcrjMQVhdCEnmCs78x4MaiLSBgnvygaXLT5nH9YFsvi7",erc20.address,["210","0"],a1,a2,a3,a4,a5,a6,a7,{from: accounts[0]});
        
        } catch (error) {
            assert(error.message.includes("Derivative limit reached"));
            
        }
        
        
        
    });

    it('Vesting and creating 4*5 new derived assets',async() => {

        var a1 = []
        var a2 = []
        var a3 = []
        var a4 = []
        const controllerInstance = await Controller.deployed();
        const erc20 = testERC20;
        await erc20.approve(masterInstance.address,"200");


        let kp;
        for(var j=0;j<5;j++){
            kp = 1695640611; // 25 September
            for (let index = 0; index < 4; index++) {
                await a1.push(accounts[0]);
                await a2.push(kp.toString());
                await a3.push("10");
                await a4.push(false);
                kp+=86400
            }
        }
        var a5 = []
        var a6 = []
        var a7 = []
            
        await masterInstance.createBulkDerivative("name","QmVcrjMQVhdCEnmCs78x4MaiLSBgnvygaXLT5nH9YFsvi7",erc20.address,["200","0"],a1,a2,a3,a4,a5,a6,a7,{from: accounts[0]});
        
        
    });

    it('Vesting and creating 4*5 existing assets',async() => {

        var a1 = []
        var a2 = []
        var a3 = []
        var a4 = []
        const controllerInstance = await Controller.deployed();
        const erc20 = testERC20;
        await erc20.approve(masterInstance.address,"200");


        for(var j=0;j<5;j++){

            let kp = 1695640611 // 25 September
            for (let index = 0; index < 4; index++) {
                await a1.push(accounts[0]);
                await a2.push(kp.toString());
                await a3.push("10");
                await a4.push(false);
                kp+=86400
            }
        }
        
        var a5 = []
        var a6 = []
        var a7 = []
        await masterInstance.createBulkDerivative("name","QmVcrjMQVhdCEnmCs78x4MaiLSBgnvygaXLT5nH9YFsvi7",erc20.address,["200","0"],a1,a2,a3,a4,a5,a6,a7,{from: accounts[0]});
        
        
    });

    it('Vesting and creating 4*5 new derived assets again',async() => {

        var a1 = []
        var a2 = []
        var a3 = []
        var a4 = []
        const controllerInstance = await Controller.deployed();
        const erc20 = testERC20;
        await erc20.approve(masterInstance.address,"200");


        let kp;
        for(var j=0;j<5;j++){
            kp = 1695986211; // 29 September 2023
            for (let index = 0; index < 4; index++) {
                await a1.push(accounts[0]);
                await a2.push(kp.toString());
                await a3.push("10");
                await a4.push(false);
                kp+=86400
            }
        }
        
        var a5 = []
        var a6 = []
        var a7 = []
        await masterInstance.createBulkDerivative("name","QmVcrjMQVhdCEnmCs78x4MaiLSBgnvygaXLT5nH9YFsvi7",erc20.address,["200","0"],a1,a2,a3,a4,a5,a6,a7,{from: accounts[0]});
        
        
    });

    it('Vesting and creating 4*10 new derived assets',async() => {

        var a1 = []
        var a2 = []
        var a3 = []
        var a4 = []
        const controllerInstance = await Controller.deployed();
        const erc20 = testERC20;
        await erc20.approve(masterInstance.address,"200");


        for(var j=0;j<5;j++){

            let kp = 1695640611 // 25 September
            for (let index = 0; index < 4; index++) {
                await a1.push(accounts[0]);
                await a2.push(kp.toString());
                await a3.push("10");
                await a4.push(false);
                kp+=86400
            }
        }
        var a5 = []
        var a6 = []
        var a7 = []
            
        await masterInstance.createBulkDerivative("name","QmVcrjMQVhdCEnmCs78x4MaiLSBgnvygaXLT5nH9YFsvi7",erc20.address,["200","0"],a1,a2,a3,a4,a5,a6,a7,{from: accounts[0]});
        

    });

    it('Details of wrapped assets',async() => {

        const controllerInstance = await Controller.deployed();
        const wrappedAddress = await controllerInstance.derivativeIDtoAddress("1").then(function(response) { return(response.toString(10)) });
        const wrappedAssetToken = await ERC20test.at(wrappedAddress);
        

        await wrappedAssetToken.totalSupply().then(function(response){ assert(response.toString(10))=="400"});
        await wrappedAssetToken.name().then(function(response){ assert(response.toString(10))=="25Oct2022.TET-S"});
        await wrappedAssetToken.decimals().then(function(response){ assert(response.toString(10))=="18"});
        await wrappedAssetToken.symbol().then(function(response){ assert(response.toString(10))=="25Oct2022.TET-S"});
            
        
    });

    it('Increase and decrease approval of derived ERC20',async() => {

        const controllerInstance = await Controller.deployed();
        const wrappedAddress = await controllerInstance.derivativeIDtoAddress("1").then(function(response) { return(response.toString(10)) });
        const wrappedAssetToken = await ERC20test.at(wrappedAddress);
        
        let currentAllowance = await wrappedAssetToken.allowance(accounts[0],controllerInstance.address).then(function(response) { return(response.toString(10)) });
        await wrappedAssetToken.increaseAllowance(controllerInstance.address,"10",{from: accounts[0]});
        await wrappedAssetToken.decreaseAllowance(controllerInstance.address,"10",{from: accounts[0]});
        await wrappedAssetToken.allowance(accounts[0],controllerInstance.address).then(function(response) { assert(response.toString(10)==currentAllowance) });
            
        
    });


    it('Calling transfer token from external address',async() => {
        const controllerInstance = await Controller.deployed();
        try {
            await controllerInstance.tokenTransfer(accounts[2],accounts[3],"100");
            
        } catch (error) {
            return
        }
        assert(false)
    });


    it('Vesting and creating 6 assets for first 6 months',async() => {

        var a1 = []
        var a2 = []
        var a3 = []
        var a4 = []
        const controllerInstance = await Controller.deployed();
        const erc20 = testERC20;
        await erc20.approve(masterInstance.address,"600",{from: accounts[0]});
        let kp = 1666957526 // 28 October 
        for (let index = 0; index < 6; index++) {
            await a1.push(accounts[0]);
            await a2.push(kp.toString());
            await a3.push("100")
await a4.push(false)
            kp+=2628000
        }
        var a5 = []
        var a6 = []
        var a7 = []
        await masterInstance.createBulkDerivative("name","QmVcrjMQVhdCEnmCs78x4MaiLSBgnvygaXLT5nH9YFsvi7",erc20.address,["600","0"],a1,a2,a3,a4,a5,a6,a7,{from: accounts[0]});
        
    });
    it('Vesting and creating 6 assets for next 6 months',async() => {

        var a1 = []
        var a2 = []
        var a3 = []
        var a4 = []
        const controllerInstance = await Controller.deployed();
        const erc20 = testERC20;
        await erc20.approve(masterInstance.address,"600",{from: accounts[0]});
        let kp = 1651199189 //  29 April
        for (let index = 0; index < 6; index++) {
            await a1.push(accounts[0]);
            await a2.push(kp.toString());
            await a3.push("100")
await a4.push(false)
            kp+=2628000
        }
        var a5 = []
        var a6 = []
        var a7 = []
        await masterInstance.createBulkDerivative("name","QmVcrjMQVhdCEnmCs78x4MaiLSBgnvygaXLT5nH9YFsvi7",erc20.address,["600","0"],a1,a2,a3,a4,a5,a6,a7,{from: accounts[0]});
        
    });

    it('Vesting with 401 entries - disallowed',async() => {

        var a1 = []
        var a2 = []
        var a3 = []
        var a4 = []
        const controllerInstance = await Controller.deployed();
        const erc20 = testERC20;
        await erc20.approve(masterInstance.address,"40100",{from: accounts[0]});
        let kp = 1667821526 // 7 November 2022
        for (let index = 0; index < 401; index++) {
            await a1.push(accounts[0]);
            await a2.push(kp.toString());
            await a3.push("100")
await a4.push(false)
            kp+=86400
        }   
        var a5 = []
        var a6 = []
        var a7 = []
            
        try {
            await masterInstance.createBulkDerivative("name","QmVcrjMQVhdCEnmCs78x4MaiLSBgnvygaXLT5nH9YFsvi7",erc20.address,["3100","0"],a1,a2,a3,a4,a5,a6,a7,{from: accounts[0]});
        
        } catch (error) {
            assert(error.message.includes("Invalid Input"));
            return
        }
        
        
    });
    

    it('Vesting and creating 15 new derived with 15 transfer each assets',async() => {

        var a1 = []
        var a2 = []
        var a3 = []
        var a4 = []
        const controllerInstance = await Controller.deployed();
        const erc20 = testERC20;
        await erc20.approve(masterInstance.address,"2250");


        for(var j=0;j<15;j++){

            let kp = 1667821526 // 7 November 2022
            for (let index = 0; index < 15; index++) {
                await a1.push(accounts[0]);
                await a2.push(kp.toString());
                await a3.push("10");
                await a4.push(false);
                kp+=86400
            }
        }
        
        var a5 = []
        var a6 = []
        var a7 = []
            
        await masterInstance.createBulkDerivative("name","QmVcrjMQVhdCEnmCs78x4MaiLSBgnvygaXLT5nH9YFsvi7",erc20.address,["2250","0"],a1,a2,a3,a4,a5,a6,a7,{from: accounts[0]});
        

    });
    
    it('Factory address set ny non Owner',async() => {

        const controllerInstance = await Controller.deployed();

        try {
            
            await masterInstance.setLiquidFactory("0x0000000000000000000000000000000000000000",{from: accounts[1]});
            
        } catch (error) {
            assert(error.message.includes("caller is not the owner"));
            return
        }
        assert(false);
    });


    it('Factory invalid test',async() => {

        const controllerInstance = await Controller.deployed();

        try {
            
            await masterInstance.setLiquidFactory("0x0000000000000000000000000000000000000000");
            
        } catch (error) {
            assert(error.message.includes("Factory already set"));
            return
        }
        assert(false);
    });

    it('Withdraw tokens after time forward',async() => {
        
        const controllerInstance = await Controller.deployed();
        const wrappedAddress = await controllerInstance.derivativeIDtoAddress("1").then(function(response) { return(response.toString(10)) })
        const derivativeAdrToActualAssetAdr = await controllerInstance.derivativeAdrToActualAssetAdr(wrappedAddress).then(function(response) { return(response.toString(10)) })
        const wrappedAssetToken = await ERC20test.at(wrappedAddress);
        const actualAssetToken = await ERC20test.at(derivativeAdrToActualAssetAdr);
        

        try {
            
            await masterInstance.withdrawWrappedVestingToken(wrappedAddress,"10",{from: accounts[3]});
            
        } catch (error) {
            await assert(error.message.includes("Cannot withdraw before vest time"));
            
        }
        
        wrappedAssetToken.balanceOf(accounts[3]).then(function(response) { assert(response.toString(10)=="100") })
        advancement = 86400 * 730 // 1 year
        await helper.advanceTimeAndBlock(advancement);
        

        await wrappedAssetToken.approve(controllerInstance.address,"10",{from: accounts[3]});
        
        await masterInstance.withdrawWrappedVestingToken(wrappedAddress,"10",{from: accounts[3]});
         

    });


    it("Trying to set liquid controller again",async()=>{
        try {
            
            await masterInstance.setLiquidController(accounts[5]);
        } catch (error) {
            await assert(error.message.includes("Controller already set"));
        }
    })
    
   

});