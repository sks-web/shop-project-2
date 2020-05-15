const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;


class User {
    constructor(username, email) {
        this.username = username;
        this.email = email
    }

    save() {
        const db = getDb();
        return db.collection("users")
        .insertOne(this)
        .then(result => {
            return result;
        })
        .catch(err => {
            console.log(err);
        });
    }

    static findById(userId) {
        const db = getDb();
        return db.collection("users")
        .find({_id: new mongodb.ObjectId(userId)})
        .next()
        .then(result => {
            return result;
        })
        .catch(err => {
            console.log(err);
        });
    }
}