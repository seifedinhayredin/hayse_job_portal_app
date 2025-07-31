import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { toEmail, jobname,employerName,status } = await req.json();

  console.log(`Email to be send to ${toEmail} for job of ${jobname}`);
  console.log(`Status of application to ${employerName} is : ${status} `)

  try {
    if (status == "accepted"){
        const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: toEmail,
      subject: 'Job Application Accepted',
      html: `<p>This message is from <strong>${employerName}</strong></p>
             <p>Hi</p>
             <p>Congratulations! You’ve been accepted for the role of <strong>${jobname}</strong> applied to
             ${employerName}.</p>
             <p>We’ll contact you shortly with further instructions.</p>
             <p>Best regards,<br/>Your Job Portal Team</p>`,
    });
    
    }
    else if(status == "rejected"){
        const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: toEmail,
      subject: 'Job Application Rejected',
      html: `<p>This message is from <strong>${employerName}</strong></p>
             <p>Hi</p>
             <p>Sorry! You’ve been rejected from the role of <strong>${jobname}</strong> applied to
             ${employerName}.</p>
             
             <p>Best regards,<br/>Your Job Portal Team</p>`,
    });
    }
    else {
        const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: toEmail,
      subject: 'Job Application Reviewed',
      html: `<p>This message is from <strong>${employerName}</strong></p>
             <p>Hi</p>
             <p>Thankyou for your Interest! You’ve applied for the role of <strong>${jobname}</strong> for
             ${employerName}. We are reviewed it and may be we will contact you soon</p>
             <p>If we need another employee we will give priority for you</p>
             <p>Best regards,<br/>Your Job Portal Team</p>`
    });
    }

    

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, error });
  }
}
