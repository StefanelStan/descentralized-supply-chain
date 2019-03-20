const contractDefinition = artifacts.require('MinerRole');
const expect = require('chai').expect;
const truffleAssert = require('truffle-assertions');

contract('MinerRole', accounts => {
    let contractInstante;
    let owner = accounts[8];
    let user2 = accounts[1];
    let user3 = accounts[2];

    describe('Test Suite: addMiner & isMiner', () => {
        before(async() => {
            contractInstante = await contractDefinition.new({from: owner});
        });
        after(async () => {
            await contractInstante.kill({from: owner});
        });

        it('should set the contract deployer to be the first miner', async() => {
            expect(await contractInstante.isMiner(owner)).to.be.true;
            expect(await contractInstante.isMiner(user2)).to.be.false;
        });

        it('should not allow unauthorized users to add miners', async() => {
            expectToRevert(contractInstante.addMiner(accounts[7], {from: user2}), 'Only a miner can add another miner');
            expect(await contractInstante.isMiner(accounts[7])).to.be.false;
        });
        
        it('should only allow a miner to add another miners and emit events', async() => {
            let tx = await contractInstante.addMiner(user2, {from: owner});
            truffleAssert.eventEmitted(tx, 'MinerAdded', (ev) => {
                return expect(ev.account).to.deep.equal(user2);
            });
            expect(await contractInstante.isMiner(user2)).to.be.true;
            
            expect(await contractInstante.isMiner(user3)).to.be.false;
            let tx2 = await contractInstante.addMiner(user3, {from: user2});
            truffleAssert.eventEmitted(tx2, 'MinerAdded', (ev) => {
                return expect(ev.account).to.deep.equal(user3);
            });
            expect(await contractInstante.isMiner(user3)).to.be.true;
        });
    });

    describe('Test Suite: renounceMiner', () => {
        before(async() => {
            contractInstante = await contractDefinition.new({from: owner});
        });
        
        after(async () => {
            await contractInstante.kill({from: owner});
        });

        it('should renounce the miner and emit event', async() => {
            await contractInstante.addMiner(user3, {from: owner});
            expect(await contractInstante.isMiner(user3)).to.be.true;

            let tx = await contractInstante.renounceMiner({from: user3});
            expect(await contractInstante.isMiner(user3)).to.be.false;
            truffleAssert.eventEmitted(tx, 'MinerRemoved', (ev) => {
                return expect(ev.account).to.deep.equal(user3);
            });
        });

        it('should lock the miners and contract if all miners have left', async() => {
            expect(await contractInstante.isMiner(owner)).to.be.true;
            await contractInstante.renounceMiner({from: owner});
            expect(await contractInstante.isMiner(owner)).to.be.false;
            expectToRevert(contractInstante.addMiner(user2, {from: owner}), 'Only a miner can add another miner');                
        });
    });

});

var expectToRevert = async(promise, errorMessage) => {
    await truffleAssert.fails(promise, truffleAssert.ErrorType.REVERT, errorMessage);
}
