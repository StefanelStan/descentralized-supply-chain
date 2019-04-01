const contractDefinition = artifacts.require('ManufacturerRole');
const expect = require('chai').expect;
const truffleAssert = require('truffle-assertions');

contract('ManufacturerRole', accounts => {
    let contractInstante;
    let owner = accounts[9];
    let user2 = accounts[1];
    let user3 = accounts[2];

    describe('Test Suite: addManufacturer & isManufacturer', () => {
        before(async() => {
            contractInstante = await contractDefinition.new({from: owner});
        });
        after(async () => {
            await contractInstante.kill({from: owner});
        });

        it('should set the contract deployer to be the first manufacturer', async() => {
            expect(await contractInstante.isManufacturer(owner)).to.be.true;
            expect(await contractInstante.isManufacturer(user2)).to.be.false;
        });

        it('should not allow unauthorized users to add manufacturers', async() => {
            expectToRevert(contractInstante.addManufacturer(accounts[7], {from: user2}), 'Only a manufacturer can perform this action');
            expect(await contractInstante.isManufacturer(accounts[7])).to.be.false;
        });
        
        it('should only allow a manufacturer to add another manufacturers and emit events', async() => {
            let tx = await contractInstante.addManufacturer(user2, {from: owner});
            truffleAssert.eventEmitted(tx, 'ManufacturerAdded', (ev) => {
                return expect(ev.account).to.deep.equal(user2);
            });
            expect(await contractInstante.isManufacturer(user2)).to.be.true;
            
            expect(await contractInstante.isManufacturer(user3)).to.be.false;
            let tx2 = await contractInstante.addManufacturer(user3, {from: user2});
            truffleAssert.eventEmitted(tx2, 'ManufacturerAdded', (ev) => {
                return expect(ev.account).to.deep.equal(user3);
            });
            expect(await contractInstante.isManufacturer(user3)).to.be.true;
        });
    });

    describe('Test Suite: renounceManufacturer', () => {
        before(async() => {
            contractInstante = await contractDefinition.new({from: owner});
        });
        after(async () => {
            try {
                await contractInstante.kill({from: owner});
            }
            catch (err) {
                console.log(err);
            };
        });

        it('should renounce the manufacturer and emit event', async() => {
            await contractInstante.addManufacturer(user3, {from: owner});
            expect(await contractInstante.isManufacturer(user3)).to.be.true;

            let tx = await contractInstante.renounceManufacturer({from: user3});
            expect(await contractInstante.isManufacturer(user3)).to.be.false;
            truffleAssert.eventEmitted(tx, 'ManufacturerRemoved', (ev) => {
                return expect(ev.account).to.deep.equal(user3);
            });
        });

        it('should lock the manufacturers and contract if all manufacturers have left', async() => {
            expect(await contractInstante.isManufacturer(owner)).to.be.true;
            await contractInstante.renounceManufacturer({from: owner});
            expect(await contractInstante.isManufacturer(owner)).to.be.false;
            expectToRevert(contractInstante.addManufacturer(user2, {from: owner}), 'Only a manufacturer can perform this action');                
        });
    });

});

var expectToRevert = async(promise, errorMessage) => {
    await truffleAssert.fails(promise, truffleAssert.ErrorType.REVERT, errorMessage);
}