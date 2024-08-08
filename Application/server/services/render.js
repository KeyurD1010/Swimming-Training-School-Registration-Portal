const User = require("../model/model");
const Admin = require("../model/admin");
const Feedback = require("../model/fbmodel");
const Branchdetails = require("../model/branchdetails");
const MaleSchema = require("../model/maleModel");
const FemaleSchema = require("../model/femaleModel");
const Fee = require("../model/fees");

const CancelReqName = require("../model/cancellation");

const sendEmail = require("../controller/sendEmail");
const aproveEmail = require("../controller/aproveMail");
const rejectEmail = require("../controller/rejectMail");

// const nodemailer = require("nodemailer");

const jwt = require("jsonwebtoken");
// const { findOneAndDelete } = require("../model/model");
const { required } = require("nodemon/lib/config");



const stripe = require("stripe")(Secret_key);



if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require("node-localstorage").LocalStorage;
  localStorage = new LocalStorage("./scratch");
}



exports.homeRoutes = (req, res) => {
  res.render("index");
};

exports.Home = (req, res) => {
  const username = localStorage.getItem("token");

  if (username) {
    const uname = jwt.decode(username);

    res.render("home", { username: uname.username });
  } else {
    res.render("loginpage");
  }
};

// exports.loginRoutes = (req, res) => {
//   res.render("loginSignup");
// };

exports.logInpage = (req, res) => {
  res.render("./include/_login");
};

exports.signUppage = (req, res) => {
  res.render("./include/_signup");
};

exports.userLogout = (req, res) => {
  localStorage.removeItem("token");
  res.redirect("/");
};

exports.signupUser = async (req, res) => {
  const { username, email, password, cpassword } = req.body;

  let error = [];

  //check required fields;

  if (!username || !email || !password || !cpassword) {
    error.push({ msg: "please fill in all fields" });
  }

  if (password !== cpassword) {
    error.push({ msg: "password do not matched with confirm password" });
  }

  //check password length
  if (password.length < 5) {
    error.push({ msg: "Passwords should be at least 5 characters" });
  }

  if (error.length > 0) {
    res.render("./include/_signup", {
      error,
      username,
      email,
      password,
      cpassword,
    });
  } else {
    //validate password
    User.findOne({ email: email }).then((user) => {
      if (user) {
        //if user is exists

        error.push({ msg: "User is already registred " });
        res.render("./include/_signup", {
          error,
          username,
          email,
          password,
          cpassword,
        });
      } else {
        const newUser = new User({
          username: username,
          email: email,
          password: password,
        });

        newUser
          .save()
          .then((user) => {
            req.flash("success_msg", "You are registerd successfully");
            res.render("./include/_login");
          })
          .catch((err) => {
            res.render("error");
          });
      }
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const uname = localStorage.getItem("token");
    const usernm = jwt.decode(uname);
    var error = [];
    const { username, password } = req.body;

    const loginUser = await User.findOne({ username: username });

    if (!loginUser) {
      error.push("User has not register so. please,Register first");
      res.render("./include/_login", error);
    } else {
      if (loginUser.password == password) {
        const token = jwt.sign({ username: loginUser.username }, secret_key);

        localStorage.setItem("token", token);
        // console.log(localStorage.getItem("token"));

        res.render("home", { username: usernm.username });
      } else {
        error.push("please enter correct password");
        res.render("./include/_login", error);
      }
    }
  } catch (err) {
    res.render("error");
  }
};

//forgot password
exports.forgotPassword = (req, res) => {
  res.render("forgotPass");
};

var Formail;
exports.forgotPwd = async (req, res) => {
  try {
    Formail = req.body.email;

    const email = await User.findOne({ email: Formail });
    console.log("email", email);

    if (email) {
      const access_token = createAccessToken({ id: email._id });
      //changes
      const url = `http://localhost:3000/reset/${access_token}`;

      sendEmail(Formail, url, "Reset your password");

      res.render("mailSend");
    }
  } catch (err) {
    console.log(err);
  }
};

exports.resetPage = (req, res) => {
  res.render("resetpass", {
    email: Formail,
  });
};

exports.ResetPass = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const cpassword = req.body.cpassword;

    if (password == cpassword) {
      const user = await User.findOneAndUpdate(
        { email: email },
        {
          password: password,
        }
      );
      res.render("goback");
    } else {
      console.log("helllllo");
      res.render("resetpass", {
        message: "password and confirm password",
      });
    }
  } catch (err) {
    res.render("error");
  }
};

exports.GoBack = (req, res) => {
  res.render("goback");
};


//Feedback

exports.showFeedback = async (req, res) => {
  try {
    const blist = await Branchdetails.find({});

    const fblist = await Feedback.find({});

    res.render("feedback", {
      branchList1: blist,
      feedbacklist: fblist,
    });
  } catch (err) {
    res.render("error");
  }
};

exports.addFeedback = async (req, res) => {
  try {
    const uname = localStorage.getItem("token");
    const username = jwt.decode(uname);

    const today = new Date(
      new Date().getTime() + 0 * 86400000
    ).toLocaleDateString();

    if (uname == null) {
      res.redirect("/loginpage");
    } else {
      const feed = new Feedback({
        username: username.username,
        rating: req.body.rating,
        branch: req.body.selectFB,
        feedback: req.body.fb,
        date: today,
      });

      const fb = await feed.save();

      const blist = await Branchdetails.find({});

      const fblist = await Feedback.find({});

      res.render("feedback", {
        branchList1: blist,
        feedbacklist: fblist,
      });
    }
  } catch (error) {
    res.render("error");
  }
};

exports.showFilter = async (req, res) => {
  try {
    const filter = req.body.selectFB;

    if (filter === "Select Branch") {
      const blist = await Branchdetails.find({});

      const fblist = await Feedback.find({});

      res.render("feedback", {
        branchList1: blist,
        feedbacklist: fblist,
      });
    }

    console.log(filter);

    const blist = await Branchdetails.find({});

    const fblist = await Feedback.find({ branch: filter });

    res.render("feedback", {
      branchList1: blist,
      feedbacklist: fblist,
    });
  } catch (err) {
    res.render("error");
  }
};

//Registration

exports.registrationRoute = async (req, res) => {
  try {
    Branchdetails.find({}, function (err, branchdetails) {
      res.render("registration", {
        branchList: branchdetails,
      });
    });
  } catch (err) {
    res.render("error");
  }
};

//POST req ---user select branch
exports.selectBranch = async (req, res) => {
  try {
    const branch1 = req.body.branchname;

    if (branch1 === "Select Branch")
      Branchdetails.find({}, function (err, branchdetails) {
        res.render("registration", {
          branchList: branchdetails,
        });
      });

    const blist = await Branchdetails.findOne({ branchName: branch1 });

    const fblist = await Feedback.find({ branch: branch1 });

    res.render("regiForm", {
      branchList1: blist,
      feedbacklist: fblist,
    });
  } catch (err) {
    res.render("error");
  }
};


//Show all Registration forms 
exports.regiForm = (req, res) => {
  res.render("regiForm");
};

//Finding the slot
exports.findSlot = async (req, res) => {
  const uname = localStorage.getItem("token");
  const username = jwt.decode(uname);

  if (uname == null) {
    res.redirect("/loginpage");
  } else {
    try {
      const maleSlot = req.body.maleSlot;
      const femaleSlot = req.body.femaleSlot;
      const branchname = req.body.branchname;
      const plan = req.body.plan;
      var mFlag = false;
      var fFlag = false;

      var flag = false;

      if (maleSlot == 0 && femaleSlot == 0) {
        res.send("Please enter valid number");
      }

      var mname = new Array(maleSlot);
      var memail = new Array(maleSlot);
      var maddress = new Array(maleSlot);
      var mcontactno = new Array(maleSlot);
      var mage = new Array(maleSlot);

      var fname = new Array(femaleSlot);
      var femail = new Array(femaleSlot);
      var faddress = new Array(femaleSlot);
      var fcontactno = new Array(femaleSlot);
      var fage = new Array(femaleSlot);

      for (var i = 0; i < maleSlot; i++) {
        mname[i] = "male" + "name" + i;
        memail[i] = "male" + "email" + i;
        maddress[i] = "male" + "address" + i;
        mcontactno[i] = "male" + "contact" + i;
        mage[i] = "male" + "age" + i;
      }

      for (var i = 0; i < femaleSlot; i++) {
        fname[i] = "female" + "name" + i;
        femail[i] = "female" + "email" + i;
        faddress[i] = "female" + "address" + i;
        fcontactno[i] = "female" + "contact" + i;
        fage[i] = "female" + "age" + i;
      }

      //find the number male users in perticuler branch
      if (maleSlot != 0) {
        const maleList = await MaleSchema.find({ branchName: branchname });
        var maleCount = 0;

        const branchList = await Branchdetails.findOne({
          branchName: branchname,
        });

        for (i in maleList) {
          if (maleList[i].status === "active") {
            maleCount = maleCount + 1;
          }
        }
        
        //find the avlbl slot and set the flag
        var mavl = branchList.noOfSlot - maleCount;

        if (maleSlot <= mavl) {
          // console.log("male avlaible");
          mFlag = true;
        }
      } else {
        // console.log("male not avalaible");
        mFlag = false;
      }
      
      //find the number of female in particuler branch
      if (femaleSlot != 0) {
        const femaleList = await FemaleSchema.find({ branchName: branchname });
        var femaleCount = 0;

        const branchList = await Branchdetails.findOne({
          branchName: branchname,
        });

        for (i in femaleList) {
          if (femaleList[i].status === "active") {
            femaleCount = femaleCount + 1;
          }
        }

        var favl = branchList.noOfSlot - femaleCount;

        if (maleSlot <= favl) {
          // console.log("female avlaible");
          fFlag = true;
        }
      } else {
        // console.log("not female");
        fFlag = false;
      }


      //if all the flag value has been true than show the all 
      if (mFlag === true && fFlag === true) {
        res.render("forms", {
          maleSlot: maleSlot,
          femaleSlot: femaleSlot,
          branchname: branchname,
          plan: plan,
          mname: mname,
          memail: memail,
          maddress: maddress,
          mcontactno: mcontactno,
          mage: mage,
          fname: fname,
          femail: femail,
          faddress: faddress,
          fcontactno: fcontactno,
          fage: fage,
        });
      }//if there is only male user only male form will be apear
       else if (mFlag === true && fFlag === false) {
        const blist = await Branchdetails.findOne({ branchName: branchname });

        const fblist = await Feedback.find({ branch: branchname });

        res.render("regiForm", {
          branchList1: blist,
          feedbacklist: fblist,
        });
      }//if there is only female user only female froms will be apear 
      else if (mFlag === false && fFlag === true) {
        const blist = await Branchdetails.findOne({ branchName: branchname });

        const fblist = await Feedback.find({ branch: branchname });

        res.render("regiForm", {
          branchList1: blist,
          feedbacklist: fblist,
        });
      } else {
        const blist = await Branchdetails.findOne({ branchName: branchname });

        const fblist = await Feedback.find({ branch: branchname });

        res.render("regiForm", {
          branchList1: blist,
          feedbacklist: fblist,
        });
      }
    } catch (err) {
      res.render("error");
    }
  }
};

exports.submitDetails = async (req, res) => {
  try {
    var ms = req.body.maleslot;
    var fs = req.body.femaleslot;
    var branchname = req.body.branchname;
    var plan = req.body.plan;

    var male = [];
    var female = [];

    var mname = req.body.mname;
    var memail = req.body.memail;
    var maddress = req.body.maddress;
    var mcontactno = req.body.mcontact;
    var mage = req.body.mage;

    var fname = req.body.fname;
    var femail = req.body.femail;
    var faddress = req.body.faddress;
    var fcontactno = req.body.fcontact;
    var fage = req.body.fage;

    //only one user get only String
    if (ms == 1) {
      male.push({
        name: mname,
        email: memail,
        address: maddress,
        contact: mcontactno,
        age: mage,
      });
    } else {
      //multiple user info inform array of object
      for (var i = 0; i < ms; i++) {
        male.push({
          name: mname[i],
          email: memail[i],
          address: maddress[i],
          contact: mcontactno[i],
          age: mage[i],
        });
      }
    }

    if (fs == 1) {
      female.push({
        name: fname,
        email: femail,
        address: faddress,
        contact: fcontactno,
        age: fage,
      });
    } else {
      for (var i = 0; i < fs; i++) {
        female.push({
          name: fname[i],
          email: femail[i],
          address: faddress[i],
          contact: fcontactno[i],
          age: fage[i],
        });
      }
    }
    const feestructure = await Fee.findOne({
      days: plan,
    });

    // console.log(plan);
    // console.log(feestructure);

    const malefee = feestructure.malefee;
    const femalefee = feestructure.femalefee;

    res.render("summary", {
      malelist: male,
      femalelist: female,
      maleslot: ms,
      femaleslot: fs,
      branchname: branchname,
      plan: plan,
      malefee: malefee,
      femalefee: femalefee,
    });
  } catch (err) {
    res.render("error");
  }
};

//payment 
// -summary page

exports.Payment = (req, res) => {
  try {

    //pass the all the details about the register users to Strip payment page for storing the data

    const uname = localStorage.getItem("token");
    const username = jwt.decode(uname);
    var ms = req.body.ms;
    var fs = req.body.fs;

    var male = [];
    var female = [];

    var mname = req.body.mname;
    var memail = req.body.memail;
    var maddress = req.body.maddress;
    var mcontactno = req.body.mcontact;
    var mage = req.body.mage;
    var mstatus = req.body.mstatus;

    var fname = req.body.fname;
    var femail = req.body.femail;
    var faddress = req.body.faddress;
    var fcontactno = req.body.fcontact;
    var fage = req.body.fage;
    var fstatus = req.body.fstatus;

    var branchname = req.body.branchname;

    // console.log(branchname);
    var plan = req.body.plan;

    if (ms == 1) {
      male.push({
        name: mname,
        email: memail,
        address: maddress,
        contact: mcontactno,
        age: mage,
        status: mstatus,
        plan: plan,
        branchname: branchname,
      });
    } else {
      for (var i = 0; i < ms; i++) {
        male.push({
          name: mname[i],
          email: memail[i],
          address: maddress[i],
          contact: mcontactno[i],
          age: mage[i],
          status: mstatus[i],
          plan: plan,
          branchname: branchname,
        });
      }
    }

    if (fs == 1) {
      female.push({
        name: fname,
        email: femail,
        address: faddress,
        contact: fcontactno,
        age: fage,
        status: fstatus,
        plan: plan,
        branchname: branchname,
      });
    } else {
      for (var i = 0; i < fs; i++) {
        female.push({
          name: fname[i],
          email: femail[i],
          address: faddress[i],
          contact: fcontactno[i],
          age: fage[i],
          status: fstatus[i],
          plan: plan,
          branchname: branchname,
        });
      }
    }

    // console.log(male);
    // console.log("asdadsad");
    // console.log(female);

    const amount = req.body.total;
    res.render("pay", {
      malelist: male,
      femalelist: female,
      maleslot: ms,
      femaleslot: fs,
      key: Publishable_key,
      amount: amount,
      username: username.username,
    });
  } catch (err) {
    res.render("error");
  }
};

var totalAmount = 0;

//Strip payment System
exports.makePayment = (req, res) => {
  try {
    const amount = req.body.amount * 100;

    totalAmount += amount;
    stripe.customers
      .create({
        name: req.body.name,
        email: req.body.email,
        source: req.body.stripeToken,
      })
      .then((customer) =>
        stripe.charges.create({
          amount: amount,
          currency: "inr",
          customer: customer.id,
          description: "Thank you for your generous donation.",
        })
      )
      .then(async () => {
        try {
          const uname = localStorage.getItem("token");
          const username = jwt.decode(uname);

          const name = req.body.name;

          if (name == username.username) {
            var ms = req.body.ms;
            var fs = req.body.fs;

            var male = [];
            var female = [];

            var mname = req.body.mname;
            var memail = req.body.memail;
            var maddress = req.body.maddress;
            var mcontactno = req.body.mcontact;
            var mage = req.body.mage;
            var mstatus = req.body.mstatus;
            var mbranchname = req.body.mbranchname;
            var plan = req.body.plan;

            var fname = req.body.fname;
            var femail = req.body.femail;
            var faddress = req.body.faddress;
            var fcontactno = req.body.fcontact;
            var fage = req.body.fage;
            var fstatus = req.body.fstatus;
            var fbranchname = req.body.fbranchname;

            console.log(plan, typeof plan);
            var plan = parseInt(plan) + 1;
            console.log(plan);

            let today = new Date(
              new Date().getTime() + 1 * 86400000
            ).toLocaleDateString();

            //   console.log(today);

            let future = await new Date(
              new Date().getTime() + plan * 86400000
            ).toLocaleDateString();
            console.log(future);

            //  console.log(future);

            if (ms == 1) {
              male.push({
                name: mname,
                email: memail,
                address: maddress,
                contact: mcontactno,
                age: mage,
                status: mstatus,
                plan: plan,
                branchname: mbranchname,
                date: today,
                expiry: future,
              });
            } else {
              for (var i = 0; i < ms; i++) {
                male.push({
                  name: mname[i],
                  email: memail[i],
                  address: maddress[i],
                  contact: mcontactno[i],
                  age: mage[i],
                  status: mstatus[i],
                  plan: plan[i],
                  branchname: mbranchname[i],
                  date: today,
                  expiry: future,
                });
              }
            }

            if (fs == 1) {
              female.push({
                name: fname,
                email: femail,
                address: faddress,
                contact: fcontactno,
                age: fage,
                status: fstatus,
                plan: plan,
                branchname: fbranchname,
                date: today,
                expiry: future,
              });
            } else {
              for (var i = 0; i < fs; i++) {
                female.push({
                  name: fname[i],
                  email: femail[i],
                  address: faddress[i],
                  contact: fcontactno[i],
                  age: fage[i],
                  status: fstatus[i],
                  plan: plan[i],
                  branchname: fbranchname[i],
                  date: today,
                  expiry: future,
                });
              }
            }

            // console.log(male);
            // console.log("s--------------------------s");
            // console.log(female);

            //Store the data one by one
            for (var i = 0; i < ms; i++) {
              var males = new MaleSchema({
                name: male[i].name,
                email: male[i].email,
                address: male[i].address,
                contactNo: male[i].contact,
                age: male[i].age,
                status: male[i].status,
                plan: male[i].plan,
                branchName: male[i].branchname,
                date: male[i].date,
                expiry: male[i].expiry,
                username: username.username,
              });
              const mls = await males.save();
            }

            for (var i = 0; i < fs; i++) {
              var females = new FemaleSchema({
                name: female[i].name,
                email: female[i].email,
                address: female[i].address,
                contactNo: female[i].contact,
                age: female[i].age,
                status: female[i].status,
                plan: female[i].plan,
                branchName: female[i].branchname,
                date: female[i].date,
                expiry: female[i].expiry,
                username: username.username,
              });
              const fls = await females.save();
            }
            // }

            res.render("home", { username: username.username });
          } else {
            res.send("please enter correct usernmae and pay again");
          }
        } catch (err) {
          console.log("sadad");
          console.log(err);
        }
      })
      .catch((err) => {
        console.log("hellooo");
        console.log(err);
        res.send(err);
      });
  } catch (err) {
    res.render("error");
    res.send(err);
  }
};

//cancellation
exports.cancelSlot = async (req, res) => {
  const username = localStorage.getItem("token");
  const uname = jwt.decode(username);

  const status = "active";
  try {
    const cancelmalelist = await MaleSchema.find({
      username: uname.username,
      status: status,
    });
    const cancelfemalelist = await FemaleSchema.find({
      username: uname.username,
      status: status,
    });

    // console.log(cancelmalelist);
    // console.log(cancelfemalelist);

    res.render("cancel", {
      username: uname.username,
      cancelmalelist: cancelmalelist,
      cancelfemalelist: cancelfemalelist,
    });
  } catch (err) {
    res.render("error");
  }
};

exports.cancelRegistration = async (req, res) => {
  try {
    const uname = localStorage.getItem("token");
    const username = jwt.decode(uname);

    const cancel = req.body.name;

    const date = new Date(
      new Date().getTime() + 0 * 86400000
    ).toLocaleDateString();

    // console.log(cancel);
    // console.log(typeof cancel);

    if (typeof cancel === "string") {
      const cancelReqUser = new CancelReqName({
        username: username.username,
        cancelReqID: cancel,
        cancelReqDate: date,
      });
      const cancelDone = await cancelReqUser.save();
    } else {
      for (i in cancel) {
        const cancelReqUser = new CancelReqName({
          username: username.username,
          cancelReqID: cancel[i],
          cancelReqDate: date,
        });

        const cancelDone = await cancelReqUser.save();
      }
    }
    res.render("home", { username: username.username });
  } catch (err) {
    res.render("error");
  }
};

//admin panel

exports.getAdmin = (req, res) => {
  res.render("adminLogin");
};

exports.adminPage = async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    // console.log(username);
    // console.log(password);

    const user = await Admin.find({ username: username });
    if (password == user[0].password) {
      res.render("admin");
    } else {
      res.render("adminLogin");
    }
  } catch {
    res.render("adminLogin");
  }
};

exports.adminLogout = (req, res) => {
  res.render("adminLogin");
};

exports.manageBranch = async (req, res) => {
  try {
    const blist = await Branchdetails.find();

    const feelist = await Fee.find();

    res.render("managebranch", {
      branchList: blist,
      feelist: feelist,
    });
  } catch (err) {
    res.render("error");
  }
};

exports.addBranch = (req, res) => {
  res.render("addbranch");
};

exports.UpdateFeesPage = async (req, res) => {
  const plan = req.body.plan;
  try {
    const fees = await Fee.find({ days: plan });

    console.log(fees);

    res.render("updateFees", {
      fees: fees,
    });
  } catch (error) {
    res.render("error");
  }
};

exports.upFees = async (req, res) => {
try{
  const upfeesID = req.body.id;
  const malefees = req.body.maleFees;
  const femalefee = req.body.femaleFees;
  const day = req.body.fees;

  const filter = {
    _id: upfeesID,
  };

  const update = {
    malefee: malefees,
    femalefee: femalefee,
    days: day,
  };

  
    const fee = await Fee.findByIdAndUpdate(filter, update);
    // console.log("asdasd");
    // console.log(fee);
    res.render("admin");
  } catch (err) {
    // console.log("Asd");
    res.render("error");
  }
};

exports.addBranchDetails = async (req, res) => {
  try {
    const addbranch = new Branchdetails({
      branchName: req.body.name,
      zone: req.body.zone,
      address: req.body.address,
      contactNo: req.body.contact,
      noOfSlot: req.body.slot,
      description: req.body.description,
      image1: req.body.img1,
      image2: req.body.img2,
    });

    const addfb = await addbranch.save();

    res.render("admin");
  } catch (error) {
    res.render("addbranch", {
      message: "Please enter again feedback",
    });
  }
};

exports.selUpdate = async (req, res) => {
  try {
    const branchlist = await Branchdetails.find();

    const feelist = await Fee.find();

    const branch1 = req.body.bn;
    console.log(branch1);

    if (branch1 === "Select Branch") {
      res.render("managebranch", {
        branchList: branchlist,
        feelist: feelist,
      });
    }

    const blist = await Branchdetails.findOne({ branchName: branch1 });

    // console.log(blist);

    res.render("updatebranch", {
      branchList1: blist,
    });
  } catch (err) {
    res.render("error");
  }
};

exports.Update = async (req, res) => {
  try {
    const id = req.body.id;
    const zone = req.body.zone;
    const branchName = req.body.name;
    const address = req.body.address;
    const contactNo = req.body.contact;
    const slot = req.body.slot;
    const description = req.body.description;
    const img1 = req.body.img1;
    const img2 = req.body.img2;

    const filter = {
      _id: id,
    };

    const update = {
      branchName: branchName,
      zone: zone,
      contactNo: contactNo,
      address: address,
      noOfSlot: slot,
      description: description,
      image1: img1,
      image2: img2,
    };

    var branch = await Branchdetails.findOneAndUpdate(filter, update);

    res.render("admin");
  } catch (error) {
    res.render("error");
  }
};

exports.DeleteBranch = async (req, res) => {
  try {
    const id = req.body.branch;

    const deleted = await Branchdetails.findByIdAndDelete({ _id: id });

    res.render("admin");
  } catch (err) {
    res.render("error");
  }
};

exports.deleteFeedback = async (req, res) => {
  try {
    const fblist = await Feedback.find({});

    res.render("deletefeedback", {
      feedbacklist: fblist,
    });
  } catch (err) {
    res.render("error");
  }
};

exports.Delete = async (req, res) => {
  try {
    const id = req.body.id;
    const deleted = await Feedback.findByIdAndDelete({ _id: id });
    const fblist = await Feedback.find({});
    res.render("deletefeedback", {
      feedbacklist: fblist,
    });
  } catch (err) {
    res.render("error");
  }
};

exports.cancellationPage = async (req, res) => {
  try {
    const cancelReq = await CancelReqName.find();
    var female = [];
    var male = [];
    var temp;

    for (let i = 0; i < cancelReq.length; i++) {
      let temp2 = cancelReq[i].cancelReqID;
      temp = await FemaleSchema.find({ status: "active", _id: temp2 });

      let cid = cancelReq[i].cancelReqID;
      let date = cancelReq[i].cancelReqDate;

      if (temp[0] !== undefined) {
        let data = { user: temp[0], cancelReqDate: date, cancelReqID: cid };
        female.push(data);
      }
    }

    for (let i = 0; i < cancelReq.length; i++) {
      let temp2 = cancelReq[i].cancelReqID;
      temp = await MaleSchema.find({ status: "active", _id: temp2 });

      let cid = cancelReq[i].cancelReqID;
      let date = cancelReq[i].cancelReqDate;

      if (temp[0] !== undefined) {
        let data = { user: temp[0], cancelReqDate: date, cancelReqID: cid };
        male.push(data);
      }
    }

    res.render("adminCancellation", {
      female: female,
      male: male,
    });
  } catch (err) {
    res.render("error");
  }
};

exports.aproveRequest = async (req, res) => {
  try {
    const dlt = req.body.deleted;
    const gender = req.body.gender;
    const mail = req.body.email;

    console.log(gender);
    console.log(dlt);

    const cancel = await CancelReqName.findOneAndDelete({ cancelReqID: dlt });

    const filter = {
      _id: dlt,
    };

    const update = {
      status: "inactive",
    };

    if (gender === "male") {
      const mDlt = await MaleSchema.findOneAndUpdate(filter, update);

      const access_token = createAccessToken({ id: mail._id });
      //changes
      const url = `http://localhost:3000/aprove/${access_token}`;

      aproveEmail(mail, url, "Cancellation Request Aproved");
      console.log(mDlt);
    } else {
      const fDlt = await FemaleSchema.findOneAndUpdate(filter, update);

      const access_token = createAccessToken({ id: mail._id });
      //changes
      const url = `http://localhost:3000/aprove/${access_token}`;

      aproveEmail(mail, url, "Cancellation Request Aproved");
      console.log(fDlt);
    }

    const cancelReq = await CancelReqName.find();

    var female = [];
    var male = [];
    var temp;

    for (let i = 0; i < cancelReq.length; i++) {
      let temp2 = cancelReq[i].cancelReqID;
      temp = await FemaleSchema.find({ status: "active", _id: temp2 });

      let cid = cancelReq[i].cancelReqID;
      let date = cancelReq[i].cancelReqDate;

      if (temp[0] !== undefined) {
        let data = { user: temp[0], cancelReqDate: date, cancelReqID: cid };
        female.push(data);
      }
    }

    for (let i = 0; i < cancelReq.length; i++) {
      let temp2 = cancelReq[i].cancelReqID;
      temp = await MaleSchema.find({ status: "active", _id: temp2 });

      let cid = cancelReq[i].cancelReqID;
      let date = cancelReq[i].cancelReqDate;

      if (temp[0] !== undefined) {
        let data = { user: temp[0], cancelReqDate: date, cancelReqID: cid };
        male.push(data);
      }
    }
    console.log("accepted");

    res.render("adminCancellation", {
      female: female,
      male: male,
    });
  } catch (err) {
    res.render("error");
  }
};

exports.deleteRequest = async (req, res) => {
  const mail = req.body.email;
  const dlt = req.body.deleted;

  try {
    const deletedCust = await CancelReqName.findOneAndDelete({
      cancelReqID: dlt,
    });

    const cancelReq = await CancelReqName.find();

    var female = [];
    var male = [];
    var temp;

    for (let i = 0; i < cancelReq.length; i++) {
      let temp2 = cancelReq[i].cancelReqID;
      temp = await FemaleSchema.find({ status: "active", _id: temp2 });

      let cid = cancelReq[i].cancelReqID;
      let date = cancelReq[i].cancelReqDate;

      if (temp[0] !== undefined) {
        let data = { user: temp[0], cancelReqDate: date, cancelReqID: cid };
        female.push(data);
      }
    }

    for (let i = 0; i < cancelReq.length; i++) {
      let temp2 = cancelReq[i].cancelReqID;
      temp = await MaleSchema.find({ status: "active", _id: temp2 });

      let cid = cancelReq[i].cancelReqID;
      let date = cancelReq[i].cancelReqDate;

      if (temp[0] !== undefined) {
        let data = { user: temp[0], cancelReqDate: date, cancelReqID: cid };
        male.push(data);
      }
    }

    const access_token = createAccessToken({ id: mail._id });
    //changes
    const url = `http://localhost:3000/aprove/${access_token}`;

    rejectEmail(mail, url, "Cancellation Request Rejected");

    console.log("rejected");
    res.render("adminCancellation", {
      female: female,
      male: male,
    });
  } catch (err) {
    res.render("error");
  }
};


exports.ErrorPage = async (req,res)=>{
  res.render("error");
}


