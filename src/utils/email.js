import nodemailer from "nodemailer"


const send_Email=async ({to,subject,text,html,attachment=[]}={})=>{
    const transporter = nodemailer.createTransport({
        service:"gmail",
        auth: {
         
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD
        }
      });
        const info = await transporter.sendMail({
          from: `"Mohamed" <${process.env.EMAIL}>`, // sender address
          to, 
          subject,
          text,
          html,
        });
        console.log(info)
        if(info.rejected.length){
            throw new Error("Rejected Email")
        }

}
export default send_Email