const sgMail = require('@sendgrid/mail')




const mailSender = async(email,title,body)=>{
    sgMail.setApiKey(process.env.GRID_API_KEY)
    try{
        await sgMail.send({
            to: `${email}`,
            from: process.env.MAIL_USER,
            subject: `${title}`,
            text: "Hello User", // plain text body
            html: `${body}`,
          
        })
        console.log("Email sent successfully")
    }catch(error){
        console.error(error)
    }




}


module.exports = mailSender;




// sgMail.setApiKey(GRID_API_KEY)

// const message ={
//     to: 'harshsagar396@gmail.com',
//     from: '22bec049@iiitdmj.ac.in',
//     subject: 'Sending with Twilio SendGrid is Fun',
//     text: 'and easy to do anywhere, even with Node.js',
//     html: '<h1> OTP aaaagayee bhaii log  </h1>',
// }

// sgMail.send(message)
// .then((response)=> console.log("email send"))
// .catch((err)=> console.log(err.message))