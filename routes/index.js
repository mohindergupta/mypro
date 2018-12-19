'use strict';

var express = require('express');
var router = express.Router();
var userSchema = require('../models/user');

// block chain const from here      
const yaml = require('js-yaml');
const { FileSystemWallet, Gateway } = require('fabric-network');
const fs = require('fs');
// block chain const end here

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Profile' });
});

router.post('/login', function(req, res, next) {
  res.render('userinfo', { title: 'Your Profile'});
});

router.post('/register', function(req, res, next) {
  res.render('register', {title: 'User Registration'});
  if (typeof req.body.loginid === 'undefined') 
      req.body.loginid=[];
  else {
    console.log('data is', req.body.loginid);
    console.log('data is', req.body.password);
    console.log('data is', req.body.first_name);
    console.log('data is', req.body.last_name);
    console.log('data is', req.body.address1);
    console.log('data is', req.body.address2);
    console.log('data is', req.body.city);
    console.log('data is', req.body.state);
    console.log('data is', req.body.zipcode);
    console.log('data is', req.body.country);
    console.log('data is', req.body.date_of_birth);
    console.log('data is', req.body.user_type);
    console.log('data is', req.body.email);
    console.log('data is', req.body.phone);
    var user = new userSchema (
    { loginid: req.body.loginid,
      password: req.body.password,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      address1: req.body.address1,
      address2: req.body.address2,
      city: req.body.city,
      state: req.body.state,
      zipcode: req.body.zipcode,
      country: req.body.country,
      date_of_birth: req.body.date_of_birth,
      user_type: req.body.user_type,
      email: req.body.email,
      phone: req.body.phone
      });
      user.save(function (err) {
        if (err) console.log(err);
      });
      // The blockchain code from here


      // A wallet stores a collection of identities for use
      const wallet = new FileSystemWallet('/home/mahender/git/VSCodeLocalNetwork/_idwallet');

      async function main() {

      // A gateway defines the peers used to access Fabric networks
      const gateway = new Gateway();
      console.log('step 1');

      // Main try/catch block
      try {

      const identityLabel = 'User1@org1.example.com';
      let connectionProfile = yaml.safeLoad(fs.readFileSync('/home/mahender/git/VSCodeLocalNetwork/network.yaml', 'utf8'));

      let connectionOptions = {
      identity: identityLabel,
      wallet: wallet
      };
      console.log('step 2');

      // Connect to gateway using network.yaml file and our certificates in _idwallet directory
      await gateway.connect(connectionProfile, connectionOptions);

      console.log('Connected to Fabric gateway.');

      // Connect to our local fabric
      const network = await gateway.getNetwork('mychannel');

      console.log('Connected to mychannel. ');

      // Get the contract we have installed on the peer
      const contract = await network.getContract('myprocontract');

      console.log('\nSubmit hello world transaction.');

      let response = await contract.submitTransaction('transaction1', 'hello mypro contract');
      console.log(JSON.parse(response.toString()));
      return response;


      } catch (error) {
        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);
      } finally {
        // Disconnect from the gateway
        console.log('Disconnect from Fabric gateway.');
        gateway.disconnect();
      }
    }

    // invoke the main function, can catch any error that might escape
    main().then(() => {
      console.log('done');
    }).catch((e) => {
        console.log('Final error checking.......');
        console.log(e);
        console.log(e.stack);
        process.exit(-1);
    });
    // ends here
  };
});
module.exports = router;
