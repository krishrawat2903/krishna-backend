require("dotenv").config()

const express = require("express")
const cors = require("cors")
const axios = require("axios")

const app = express()

app.use(cors())
app.use(express.json())

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

  const businessHtml = `
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

  const customerHtml = `
    <h2>Thank you for contacting us</h2>
    <p>Dear ${name || "Customer"},</p>
    <p>Your request for <b>${product || "material"}</b> has been received.</p>
    <p>Our team will contact you shortly.</p>
    <br>
    <p>Krishna Dream Building Solution</p>
  `

  try {
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Krishna Dream Building Solution",
          email: process.env.BREVO_SENDER
        },
        to: [
          { email: "kdbs.solution@gmail.com" },
          { email: "krishrawat2903@gmail.com" }
        ],
        subject: "New Building Material Request",
        htmlContent: businessHtml
      },
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.BREVO_API_KEY
        }
      }
    )

    if (email) {
      await axios.post(
        "https://api.brevo.com/v3/smtp/email",
        {
          sender: {
            name: "Krishna Dream Building Solution",
            email: process.env.BREVO_SENDER
          },
          to: [{ email }],
          subject: "Request Received - Krishna Dream Building Solution",
          htmlContent: customerHtml
        },
        {
          headers: {
            "Content-Type": "application/json",
            "api-key": process.env.BREVO_API_KEY
          }
        }
      )
    }

    res.json({ message: "Request sent successfully" })
  } catch (error) {
    console.log(error.response ? error.response.data : error.message)
    res.status(500).json({ message: "Email sending failed" })
  }
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})