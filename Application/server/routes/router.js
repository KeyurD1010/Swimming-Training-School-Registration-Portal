const express = require('express');
const services = require('../services/render');
const { ensureAuthenticated } = require('../controller/auth');

const route = express.Router();


route.get('/',services.homeRoutes);  

route.get('/home',services.Home);

route.post('/userSignup',services.signupUser);

route.post('/userlogin',services.loginUser);

route.get('/userlogout',services.userLogout);

route.get('/loginpage',services.logInpage);

route.get('/signuppage',services.signUppage);

route.get('/forgotPass',services.forgotPassword);

route.post('/forgotPass',services.forgotPwd);

//changes
route.get('/reset/:_id',services.resetPage);

route.post('/reset/:_id',services.ResetPass);

route.get('/reset/goback',services.GoBack);

route.get('/feedback',services.showFeedback);

route.post('/regiform',services.regiForm);

route.post('/addfeedback', services.addFeedback);

route.get('/registration', services.registrationRoute);

route.post('/filter',services.showFilter);

route.post('/findslot' , services.findSlot);

route.post('/selectbranch',services.selectBranch);

route.post('/submitdetails',services.submitDetails);

//payment

route.post('/payment',services.Payment);

route.post('/makePay',services.makePayment);

route.get('/cancelslot', services.cancelSlot);

route.post('/cancel',services.cancelRegistration);



//admin side routes
route.get('/admin',services.getAdmin);

route.post('/adminpage',services.adminPage);

route.get('/adminlogout',services.adminLogout);

route.get('/mbranch', services.manageBranch);

route.get('/addbranch', services.addBranch);

route.post('/add', services.addBranchDetails);

route.post('/updatebranch', services.selUpdate);

route.post('/updatefees',services.UpdateFeesPage);

route.post('/upFees',services.upFees);

route.post('/update', services.Update);

route.post('/deleteBranch',services.DeleteBranch);

route.get('/deletefb', services.deleteFeedback);

route.post('/delete', services.Delete);

route.get('/cancellation',services.cancellationPage);

route.post('/aproveReq',services.aproveRequest);

route.post('/deleteReq',services.deleteRequest);


//error pahe
route.get("/errorPage",services.ErrorPage);




module.exports = route;