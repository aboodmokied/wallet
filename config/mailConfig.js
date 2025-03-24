const mailConfig={
    mails:{
        gmail:{
            service:'gmail',
            auth:{
                user:process.env.GMAIL_USER,
                pass:process.env.GMAIL_PASS
            },
            host:'smtp.gmail.com',
            port:587,
            secure:false
        },
        // outlook:{
        //     service:'hotmail',
        //     auth:{
        //         user:process.env.OUTLOOK_USER,
        //         pass:process.env.OUTLOOK_PASS
        //     },
        //     host:'smtp.office365.com',
        //     port:587,
        //     secure:false
        // },
        // yahoo:{
        //     name:'yahoo',
        //     auth:{
        //         user:process.env.YAHOO_USER,
        //         pass:process.env.YAHOO_PASS
        //     },
        //     host:'smtp.mail.yahoo.com',
        //     port:587,
        //     secure:false
        // }
    }
};

// GMAIL_USER=your-gmail@gmail.com
// GMAIL_PASS=your-gmail-password
// OUTLOOK_USER=your-outlook@hotmail.com
// OUTLOOK_PASS=your-outlook-password
// YAHOO_USER=your-yahoo@yahoo.com
// YAHOO_PASS=your-yahoo-password

module.exports=mailConfig;