import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import "./Contactform.css";

export const ContactUs = () => {
  const form = useRef();
  const [sentSuccessfully, setSentSuccessfully] = useState(false);
  const [errorOccurred, setErrorOccurred] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();

    // Get client's email address and name from the form
    const clientName = form.current["user_name"].value;

    // Send email to the admin
    emailjs
      .send(
        "service_0wjrco8",
        "template_xdj5rqt",
        {
          user_email: "sourabhtripathi8103@gmail.com", // Admin email
          message: `Query from ${clientName}: ${form.current["message"].value}`,
        },
        { publicKey: "uD-RCtX5q2u9CM-Mk" }
      )
      .then(() => {
        console.log("Email sent to admin!");
        setSentSuccessfully(true);
      })
      .catch((error) => {
        console.error("Error sending email to admin:", error);
        setErrorOccurred(true);
      });
  };

  return (
    <div id="contacts">
      <div className="container">
        <div className="row">
          <div className="contact-left">
            <h1 className="sub-title">Contact Us</h1>
            {/* <p>sourabhtripathi38@gmail.com</p> */}
          </div>
          <div className="contact-right">
            <form ref={form} onSubmit={sendEmail}>
              <input
                type="email"
                name="user_name"
                placeholder="Your Email"
                required
              />
              <input
                type="text"
                name="user_email"
                placeholder="Your Name"
                required
              />
              <textarea
                name="message"
                rows="6"
                placeholder="Your Message"
                required
              />
              <button type="submit" className="btn btn2">
                Submit
              </button>
            </form>
            <div id="msg">
              {sentSuccessfully && (
                <p className="success-message">Email sent successfully!</p>
              )}
              {errorOccurred && (
                <p className="error-message">
                  An error occurred. Please try again later.
                </p>
              )}
            </div>
            <div id="loading" className="loading-overlay">
              <div className="loading-spinner"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
