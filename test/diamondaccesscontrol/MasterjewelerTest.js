/*const contractDefinition = artifacts.require('MasterjewelerRole');
const expect = require('chai').expect;
const truffleAssert = require('truffle-assertions');

contract('MasterjewelerRole', accounts => {
    let contractInstante;
    let owner = accounts[9];
    let user2 = accounts[1];
    let user3 = accounts[2];

    describe('Test Suite: addMasterjeweler & isMasterjeweler', () => {
        before(async() => {
            contractInstante = await contractDefinition.new({from: owner});
        });

        after(async () => {
            await contractInstante.kill({from: owner});
        });

        it('should set the contract deployer to be the first Masterjeweler', async() => {
            expect(await contractInstante.isMasterjeweler(owner)).to.be.true;
            expect(await contractInstante.isMasterjeweler(user2)).to.be.false;
        });

        it('should not allow unauthorized users to add Masterjewelers', async() => {
            expectToRevert(contractInstante.addMasterjeweler(accounts[7], {from: user2}), 'Only a masterjeweler can add another masterjeweler');
            expect(await contractInstante.isMasterjeweler(accounts[7])).to.be.false;
        });
        
        it('should only allow a Masterjeweler to add another Masterjewelers and emit events', async() => {
            let tx = await contractInstante.addMasterjeweler(user2, {from: owner});
            truffleAssert.eventEmitted(tx, 'MasterjewelerAdded', (ev) => {
                return expect(ev.account).to.deep.equal(user2);
            });
            expect(await contractInstante.isMasterjeweler(user2)).to.be.true;
            
            expect(await contractInstante.isMasterjeweler(user3)).to.be.false;
            let tx2 = await contractInstante.addMasterjeweler(user3, {from: user2});
            truffleAssert.eventEmitted(tx2, 'MasterjewelerAdded', (ev) => {
                return expect(ev.account).to.deep.equal(user3);
            });
            expect(await contractInstante.isMasterjeweler(user3)).to.be.true;
        });
    });

    describe('Test Suite: renounceMasterjeweler', () => {
        before(async() => {
            contractInstante = await contractDefinition.new({from: owner});
        });
        
        after(async () => {
            await contractInstante.kill({from: owner});
        });

        it('should renounce the Masterjeweler and emit event', async() => {
            await contractInstante.addMasterjeweler(user3, {from: owner});
            expect(await contractInstante.isMasterjeweler(user3)).to.be.true;

            let tx = await contractInstante.renounceMasterjeweler({from: user3});
            expect(await contractInstante.isMasterjeweler(user3)).to.be.false;
            truffleAssert.eventEmitted(tx, 'MasterjewelerRemoved', (ev) => {
                return expect(ev.account).to.deep.equal(user3);
            });
        });

        it('should lock the Masterjewelers and contract if all Masterjewelers have left', async() => {
            expect(await contractInstante.isMasterjeweler(owner)).to.be.true;
            await contractInstante.renounceMasterjeweler({from: owner});
            expect(await contractInstante.isMasterjeweler(owner)).to.be.false;
            expectToRevert(contractInstante.addMasterjeweler(user2, {from: owner}), 'Only a masterjeweler can add another masterjeweler');                
        });
    });

});

var expectToRevert = async(promise, errorMessage) => {
    await truffleAssert.fails(promise, truffleAssert.ErrorType.REVERT, errorMessage);
}*/