// Route Configuration
const express = require('express');
var cors = require('cors');
const controller = require('./controller');

const app = express();

app.use(express.json());
app.use(cors());

app.get('/api/certificates', controller.getDistinctCertificates);
app.get('/api/person/:cof_type', controller.getCertificateHolders);
app.get('/api/person/holder/:holder_name', controller.getHolderInformation);


app.listen(3000, () => {
    console.log(`Listening on port 3000`)
});

