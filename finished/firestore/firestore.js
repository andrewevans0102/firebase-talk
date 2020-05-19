const moment = require('moment');

const getLength = async (db) => {
    let query = db.collection('clock');

    let length = await query.get().then((querySnapshot) => {
        let docs = querySnapshot.docs;
        return docs.length;
    });

    if (length === undefined) {
        length = 0;
    }

    return length;
};

const clockIn = async (db, project, length) => {
    const createdDate = new Date();
    const clock = {
        clockIn: Date.now(),
        clockOut: '',
        project: project,
        entered: createdDate.toLocaleDateString(),
        total: '',
    };
    await db
        .collection('clock')
        .doc('/' + length + '/')
        .set(clock);
};

const clockOut = async (db, length) => {
    let document = db.collection('clock').doc(length.toString());
    const documentRetrieved = await document.get();
    const clock = await documentRetrieved.data();
    clock.clockOut = Date.now();
    const duration = moment.duration(clock.clockOut - clock.clockIn);
    clock.total = `${duration.hours()}:${duration.minutes()}:${duration.seconds()}`;
    await db
        .collection('clock')
        .doc('/' + length + '/')
        .update(clock);
    return clock;
};

const selectAll = async (db) => {
    let query = db.collection('clock');
    const clockDocuments = await query.get().then((querySnapshot) => {
        let docs = querySnapshot.docs;
        let response = [];
        for (let doc of docs) {
            const clock = doc.data();
            response.push(clock);
        }
        return response;
    });

    return clockDocuments;
};

const deleteAll = async (db) => {
    // according to the Firebase docs deleting a full collection with the SDK is not recommended
    // so here we are selecting the documents and deleting them one at a time
    const length = await getLength(db);
    let clockCollection = db.collection('clock');
    if (length !== 0) {
        let i = 1;
        for (i; i <= length; i++) {
            await clockCollection.doc(i.toString()).delete();
        }
    }
};

module.exports = {
    getLength,
    clockIn,
    clockOut,
    selectAll,
    deleteAll,
};
