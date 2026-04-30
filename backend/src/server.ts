import dotenv from "dotenv"

dotenv.config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
  override: process.env.NODE_ENV === "test",
})

import app from "./app"

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
