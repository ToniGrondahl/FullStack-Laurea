require("dotenv").config();
var mongoose = require("mongoose");
const Opiskelija = require("./modules/opiskelija");
// Määritellään yhteysosoite
var user = process.env.DB_USER
var salis = process.env.DB_PASS
const uri = process.env.MONGODB_URI;
const mongodb_name = process.env.MONGODB_NAME;
const collection_name = process.env.MONGODB_COLLECTION;



// Luodaan yhteys

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log("Yhteys on muodostettu!");
    const filter = { group: 'Koodarit' };
    const update = { group: 'Sählärit' };
    const updated = await Opiskelija.updateMany(filter, update, { new: true });
    if (updated) {
        console.log("Opiskelijoiden " + updated.group + " ryhmä on päivitetty!");
    } else {
        console.log("Opiskelijaa ei löytynyt!");
    }
    console.log(updated);
    mongoose.connection.close();
    console.log("Yhteys on suljettu!");
};