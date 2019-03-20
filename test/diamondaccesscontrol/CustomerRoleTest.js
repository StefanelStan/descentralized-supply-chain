const contractDefinition = artifacts.require('CustomerRole');
const expect = require('chai').expect;
const truffleAssert = require('truffle-assertions');

contract('CustomerRole', accounts => {
    let contractInstante;
    let owner = accounts[9];
    let user2 = accounts[1];
    let user3 = accounts[2];

    describe('Test Suite: addCustomer & isCustomer', () => {
        before(async() => {
            contractInstante = await contractDefinition.new({from: owner});
        });
        after(async () => {
            await contractInstante.kill({from: owner});
        });

        it('should set the contract deployer to be the first Customer', async() => {
            expect(await contractInstante.isCustomer(owner)).to.be.true;
            expect(await contractInstante.isCustomer(user2)).to.be.false;
        });

        it('should not allow unauthorized users to add Customers', async() => {
            expectToRevert(contractInstante.addCustomer(accounts[7], {from: user2}), 'Only a customer can add another customer');
            expect(await contractInstante.isCustomer(accounts[7])).to.be.false;
        });
        
        it('should only allow a Customer to add another Customers and emit events', async() => {
            let tx = await contractInstante.addCustomer(user2, {from: owner});
            truffleAssert.eventEmitted(tx, 'CustomerAdded', (ev) => {
                return expect(ev.account).to.deep.equal(user2);
            });
            expect(await contractInstante.isCustomer(user2)).to.be.true;
            
            expect(await contractInstante.isCustomer(user3)).to.be.false;
            let tx2 = await contractInstante.addCustomer(user3, {from: user2});
            truffleAssert.eventEmitted(tx2, 'CustomerAdded', (ev) => {
                return expect(ev.account).to.deep.equal(user3);
            });
            expect(await contractInstante.isCustomer(user3)).to.be.true;
        });
    });

    describe('Test Suite: renounceCustomer', () => {
        before(async() => {
            contractInstante = await contractDefinition.new({from: owner});
        });
        after(async () => {
            await contractInstante.kill({from: owner});
        });

        it('should renounce the Customer and emit event', async() => {
            await contractInstante.addCustomer(user3, {from: owner});
            expect(await contractInstante.isCustomer(user3)).to.be.true;

            let tx = await contractInstante.renounceCustomer({from: user3});
            expect(await contractInstante.isCustomer(user3)).to.be.false;
            truffleAssert.eventEmitted(tx, 'CustomerRemoved', (ev) => {
                return expect(ev.account).to.deep.equal(user3);
            });
        });

        it('should lock the Customers and contract if all Customers have left', async() => {
            expect(await contractInstante.isCustomer(owner)).to.be.true;
            await contractInstante.renounceCustomer({from: owner});
            expect(await contractInstante.isCustomer(owner)).to.be.false;
            expectToRevert(contractInstante.addCustomer(user2, {from: owner}), 'Only a customer can add another customer');                
        });
    });

});

var expectToRevert = async(promise, errorMessage) => {
    await truffleAssert.fails(promise, truffleAssert.ErrorType.REVERT, errorMessage);
}