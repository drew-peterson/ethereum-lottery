const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const provider = ganache.provider();
const web3 = new Web3(provider);
const { interface, bytecode } = require('../compile');

let accounts;
let inbox;
const INTIAL_MESSAGE = 'Hi there!';

beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();
  // use one of those accounts to deploy contract
  inbox = await new web3.eth.Contract(JSON.parse(interface)) // tells web3 about what methods Inbox has
    .deploy({
      data: bytecode,
      arguments: [INTIAL_MESSAGE] // string intialMessage
    }) // what to deploy a new copy of this contract
    .send({ from: accounts[0], gas: '1000000' }); // create the contract

  inbox.setProvider(provider);
});

describe('Inbox', () => {
  it('deploys a contract', () => {
    assert.ok(inbox.options.address); // if address exists contract is deployed
    // assert.ok - does value exist
  });

  it('has a default message', async () => {
    const message = await inbox.methods.message().call();
    assert.equal(message, INTIAL_MESSAGE);
  });

  it('can change the message', async () => {
    const newMessage = 'new message';
    await inbox.methods.setMessage(newMessage).send({ from: accounts[0] }); // cost money
    const message = await inbox.methods.message().call();
    assert.equal(message, newMessage);
  });
});
