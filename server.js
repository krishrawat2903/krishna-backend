require("dotenv").config()

const express = require("express")
const cors = require("cors")
const nodemailer = require("nodemailer")

const app = express()

app.use(cors())
app.use(express.json())

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
})
app.get("/", (req, res) => {
  res.send("Backend is running")
})

app.post("/api/request", async (req, res) => {
  const {
    product,
    name,
    phone,
    email,
    brand,
    cementType,
    grade,
    size,
    city,
    quantity,
    quantityTon,
    address
  } = req.body

  const businessMail = {
    from: process.env.EMAIL_USER,
    to: [process.env.EMAIL_USER, "krishrawat2903@gmail.com"],
    subject: "New Building Material Request",
    html: `
      <h2>New Customer Request</h2>

      <p><b>Product:</b> ${product || "Not provided"}</p>
      <p><b>Name:</b> ${name || "Not provided"}</p>
      <p><b>Phone:</b> ${phone || "Not provided"}</p>
      <p><b>Email:</b> ${email || "Not provided"}</p>

      ${product === "cement" ? `
        <p><b>Cement Brand:</b> ${brand || "Not provided"}</p>
        <p><b>Cement Type:</b> ${cementType || "Not provided"}</p>
      ` : ""}

      ${product === "steel" ? `
        <p><b>Steel Size:</b> ${size || "Not provided"}</p>
        <p><b>Steel Brand:</b> ${brand || "Not provided"}</p>
        <p><b>Steel Grade:</b> ${grade || "Not provided"}</p>
        <p><b>Quantity (kg or ton):</b> ${quantity || "Not provided"}</p>
        <p><b>Quantity (Ton):</b> ${quantityTon || "Not provided"}</p>
      ` : ""}

      ${product === "aggregates" ? `
        <p><b>Aggregate Size:</b> ${size || "Not provided"}</p>
      ` : ""}

      <p><b>City:</b> ${city || "Not provided"}</p>
      <p><b>Address:</b> ${address || "Not provided"}</p>
    `
  }

  const customerMail = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Request Received - Krishna Dream Building Solution",
    html: `
      <h2>Thank you for contacting us</h2>
      <p>Dear ${name || "Customer"},</p>
      <p>Your request for <b>${product || "material"}</b> has been received.</p>
      <p>Our team will contact you shortly.</p>
      <br>
      <p>Krishna Dream Building Solution</p>
    `
  }

  try {
    await transporter.sendMail(businessMail)
    await transporter.sendMail(customerMail)

    res.json({ message: "Request sent successfully" })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Email sending failed" })
  }
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})