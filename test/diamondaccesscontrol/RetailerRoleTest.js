/*const contractDefinition = artifacts.require('RetailerRole');
const expect = require('chai').expect;
const truffleAssert = require('truffle-assertions');

contract('RetailerRole', accounts => {
    let contractInstante;
    let owner = accounts[8];
    let user2 = accounts[1];
    let user3 = accounts[2];

    describe('Test Suite: addRetailer & isRetailer', () => {
        before(async() => {
            contractInstante = await contractDefinition.new({from: owner});
        });

        after(async () => {
            await contractInstante.kill({from: owner});
        });

        it('should set the contract deployer to be the first retailer', async() => {
            expect(await contractInstante.isRetailer(owner)).to.be.true;
            expect(await contractInstante.isRetailer(user2)).to.be.false;
        });

        it('should not allow unauthorized users to add retailers', async() => {
            expectToRevert(contractInstante.addRetailer(accounts[7], {from: user2}), 'Only a retailer can add another retailer');
            expect(await contractInstante.isRetailer(accounts[7])).to.be.false;
        });
        
        it('should only allow a retailer to add another retailers and emit events', async() => {
            let tx = await contractInstante.addRetailer(user2, {from: owner});
            truffleAssert.eventEmitted(tx, 'RetailerAdded', (ev) => {
                return expect(ev.account).to.deep.equal(user2);
            });
            expect(await contractInstante.isRetailer(user2)).to.be.true;
            
            expect(await contractInstante.isRetailer(user3)).to.be.false;
            let tx2 = await contractInstante.addRetailer(user3, {from: user2});
            truffleAssert.eventEmitted(tx2, 'RetailerAdded', (ev) => {
                return expect(ev.account).to.deep.equal(user3);
            });
            expect(await contractInstante.isRetailer(user3)).to.be.true;
        });
    });

    describe('Test Suite: renounceRetailer', () => {
        before(async() => {
            contractInstante = await contractDefinition.new({from: owner});
        });

        after(async () => {
            await contractInstante.kill({from: owner});
        });

        it('should renounce the retailer and emit event', async() => {
            await contractInstante.addRetailer(user3, {from: owner});
            expect(await contractInstante.isRetailer(user3)).to.be.true;

            let tx = await contractInstante.renounceRetailer({from: user3});
            expect(await contractInstante.isRetailer(user3)).to.be.false;
            truffleAssert.eventEmitted(tx, 'RetailerRemoved', (ev) => {
                return expect(ev.account).to.deep.equal(user3);
            });
        });

        it('should lock the retailers and contract if all retailers have left', async() => {
            expect(await contractInstante.isRetailer(owner)).to.be.true;
            await contractInstante.renounceRetailer({from: owner});
            expect(await contractInstante.isRetailer(owner)).to.be.false;
            expectToRevert(contractInstante.addRetailer(user2, {from: owner}), 'Only a retailer can add another retailer');                
        });
    });

});

var expectToRevert = async(promise, errorMessage) => {
    await truffleAssert.reverts(promise, errorMessage);
}
*/