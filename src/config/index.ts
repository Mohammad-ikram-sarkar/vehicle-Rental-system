import dotenv from "dotenv"
import  path from "path"

dotenv.config({path : path.join(process.cwd(), ".env")})

export const config = {
          CONNECTION_STRING : process.env.CONNECTION_STRING,
          PORT : process.env.port,
          JWT_SECRET : process.env.jwt


}
console.log("this ",process.env.CONNECTION_STRING)