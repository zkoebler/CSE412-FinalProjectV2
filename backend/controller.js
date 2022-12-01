/* 
*************************
Database Configuration
*************************
*/
var postgresPromise = require('pg-promise')();
const connectionString = {
    host: 'localhost',
    port: 5433,
    database: "Certificates",
    user: 'postgres',
    password: 'postgres'
};
const databaseClient = postgresPromise(connectionString);

/* 
*************************
Functions for API Routes
*************************
*/

/*
User looks up a certificate to search
*/
const getDistinctCertificates = (req, res) => {
    const queryString = 'SELECT DISTINCT cof_type FROM Certificate';
    databaseClient.query(queryString).then(dbResponse => {
        res.json(dbResponse);
    })
    .catch(error => {
        res.json({message: "ERROR executing query"});
    })
}

/*
After picking a certificate, the UI will display a list of people that hold that
certificate
*/
const getCertificateHolders = (req, res) => {
    const queryString = 'SELECT holder_name, longitude, latitude FROM Person, Building, Certificate, Certificate_Record, Residential_Record'
    + ' WHERE cof_type = \'' + req.params.cof_type
    + '\' AND Person.PID = Certificate_Record.PID AND Certificate.COF_NUM = Certificate_Record.COF_NUM'
    + ' AND Building.BIN = Residential_Record.BIN AND Residential_Record.PID = Person.PID;';
    databaseClient.query(queryString).then(dbResponse => {
        res.json(dbResponse);
    })
    .catch(error => {
        res.json({message: "ERROR executing query"});
    })
}

/*
After picking a person who holds the certificate, the UI will display more
information for that person. The latitude and longitude will be displayed on a map
in the UI.
*/
const getHolderInformation = (req, res) => {
    const queryString = 'SELECT holder_name,expires_on,prem_addr,latitude,longitude' 
    + ' FROM Person, Building, Certificate, Certificate_Record, Residential_Record'
    + ' WHERE holder_name = \'' + req.params.holder_name + '\''
    + ' AND Building.BIN = Residential_Record.BIN AND Residential_Record.PID = Person.PID'
    + ' AND Certificate.COF_NUM = Certificate_Record.COF_NUM AND Person.PID = Certificate_Record.PID;';
    databaseClient.query(queryString).then(dbResponse => {
        res.json(dbResponse);
    })
    .catch(error => {
        res.json({message: "ERROR executing query"});
    })
}

module.exports = {
    getDistinctCertificates,
    getCertificateHolders,
    getHolderInformation
}