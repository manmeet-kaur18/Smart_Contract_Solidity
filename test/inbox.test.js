const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

//provider is made as it lets connect to a ethereum network locally
//web3 and ganache are the communication pt and provider is communication means
const provider=ganache.provider();
const web3 = new Web3(provider);//instance
const {interface,bytecode}=require('../compile');
//tests examples
// class Car{
//     park(){
//         return 'stopped';
//     }
//     drive(){
//         return 'vroom';
//     }
// }
// let car;
// beforeEach(()=>{
//     car = new Car();
// });
// describe('Car',()=>{
//     it('can park',()=>{
//         assert.equal(car.park(),'stopped');
//     });
//     it('can drive',()=>{
//         assert.equal(car.drive(),'vroom');
//     });
// });
let accounts;
let inbox;
beforeEach(async()=>{
    //get a list of all accounts and use one to deploy the contact
    // web3.eth.getAccounts().then(fetchedAccounts=>{
    //     console.log(fetchedAccounts);
    // });
    accounts = await web3.eth.getAccounts();
    inbox = await new web3.eth.Contract(JSON.parse(interface)).deploy({data:bytecode,arguments:['Hi there']}).send({
        from:accounts[0],
        gas:'1000000'
    });
    inbox.setProvider(provider);
});

describe('Inbox',()=>{
    it('deploy a contract',()=>{
        // console.log(inbox);
        assert.ok(inbox.options.address);
    });
    it('has a default message',async()=>{
        const message = await inbox.methods.message().call();
        assert.equal(message,'Hi there');
    });
    it('can change the message',async()=>{
        await inbox.methods.setMessage('bye').send({from:accounts[0]});
        const message=await inbox.methods.message().call();
        assert.equal(message,'bye');
    })
})

