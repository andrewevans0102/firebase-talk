const firebase = require('@firebase/testing');
const projectId = '1234';
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;
const firestore = require('../firestore/firestore');

function setupDB() {
    return firebase.initializeTestApp({ projectId }).firestore();
}

beforeEach(async () => {
    // Clear the database between tests
    await firebase.clearFirestoreData({ projectId });
});

describe('The timeclock API should', () => {
    it('enable you to get length when 0', async () => {
        const db = setupDB();
        let length = await firestore.getLength(db);
        expect(length).to.deep.equal(0);
    });

    it('enable you to get length when clock in exists', async () => {
        const db = setupDB();
        let lengthBefore = await firestore.getLength(db);
        expect(lengthBefore).to.deep.equal(0);
        // create the record for the clock in here
        const project = 'first project';
        await firestore.clockIn(db, project, 1);
        let lengthAfter = await firestore.getLength(db);
        expect(lengthAfter).to.deep.equal(1);
    });

    it('enable you to clock in and then call select all', async () => {
        const db = setupDB();
        let lengthBefore = await firestore.getLength(db);
        expect(lengthBefore).to.deep.equal(0);
        // create the record for the clock in here
        const project = 'first project';
        await firestore.clockIn(db, project, 1);
        // select all
        const clockEntries = await firestore.selectAll(db);
        expect(clockEntries[0].project).to.deep.equal(project);
    });

    it('enable you to clock out successfully', async () => {
        const db = setupDB();
        // create the record for the clock in here
        const project = 'first project';
        await firestore.clockIn(db, project, 1);
        // once record is created should be length of 0
        let lengthAfter = await firestore.getLength(db);
        expect(lengthAfter).to.deep.equal(1);
        // call the clock out
        await firestore.clockOut(db, lengthAfter);
        // select the records afterwards
        const clockEntries = await firestore.selectAll(db);
        // verify that the record created has a project value
        expect(clockEntries[0].project).to.deep.equal(project);
        // verify that the clock out value has been populated by the service
        expect(clockEntries[0].clockOut).to.not.be.null;
    });

    it('enable you to clock in and out successfully multiple times', async () => {
        const db = setupDB();
        // create the record for the clock in here
        const firstProject = 'first project';
        await firestore.clockIn(db, firstProject, 1);
        // once record is created should be length of 0
        let firstLength = await firestore.getLength(db);
        expect(firstLength).to.deep.equal(1);
        // call the clock out
        await firestore.clockOut(db, firstLength);
        // select the records afterwards
        const firstEntries = await firestore.selectAll(db);
        // verify that the record created has a project value
        expect(firstEntries[0].project).to.deep.equal(firstProject);
        // verify that the clock out value has been populated by the service
        expect(firstEntries[0].clockOut).to.not.be.null;

        // create the record for the second clock in here
        const secondProject = 'second project';
        await firestore.clockIn(db, secondProject, 2);
        // once record is created should be length of 0
        let secondLength = await firestore.getLength(db);
        expect(secondLength).to.deep.equal(2);
        // call the clock out
        await firestore.clockOut(db, secondLength);
        // select the records afterwards
        const secondEntries = await firestore.selectAll(db);
        // verify that the record created has a project value
        expect(secondEntries[1].project).to.deep.equal(secondProject);
        // verify that the clock out value has been populated by the service
        expect(secondEntries[1].clockOut).to.not.be.null;
    });

    it('enable you to delete all records after created', async () => {
        const db = setupDB();
        // create the record for the clock in here
        const firstProject = 'first project';
        await firestore.clockIn(db, firstProject, 1);
        // once record is created should be length of 0
        let firstLength = await firestore.getLength(db);
        expect(firstLength).to.deep.equal(1);
        // call the clock out
        await firestore.clockOut(db, firstLength);
        // select the records afterwards
        const firstEntries = await firestore.selectAll(db);
        // verify that the record created has a project value
        expect(firstEntries[0].project).to.deep.equal(firstProject);
        // verify that the clock out value has been populated by the service
        expect(firstEntries[0].clockOut).to.not.be.null;
        // call delete all after records created
        await firestore.deleteAll(db);
        // once delete finishes verify that the collection is empty
        const afterLength = await firestore.getLength(db);
        expect(afterLength).to.equal(0);
    });
});
