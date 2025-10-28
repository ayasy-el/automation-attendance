import "dotenv/config";
import { Login } from "../lib/Login.js";
import { password, input } from "@inquirer/prompts";
import fs from "fs";

const envPath = ".env";
const SEMESTER = process.env.semester;

function upsertEnv(key, value) {
  const line = `${key}=${value}`;
  let content = "";
  if (fs.existsSync(envPath)) {
    content = fs.readFileSync(envPath, "utf-8");
    const regex = new RegExp(`^${key}=.*$`, "m");
    if (regex.test(content)) {
      content = content.replace(regex, line);
    } else {
      if (content.length && !content.endsWith("\n")) content += "\n";
      content += line + "\n";
    }
  } else {
    content = line + "\n";
  }
  fs.writeFileSync(envPath, content);
}

const login = new Login();

try {
  const tokenFromEnv = process.env.token;
  const stFromEnv = process.env.st;
  if (tokenFromEnv && stFromEnv) {
    await login.getAuth({ token: tokenFromEnv, st: stFromEnv });
    console.log("✅ Token dari .env valid. Login sukses.");
  } else {
    throw new Error("Token tidak ada di .env");
  }
} catch (e) {
  console.log("ℹ️ Token tidak valid/ tidak ditemukan. Melakukan login dengan email & password.");
  const email = await input({ message: "Email:" });
  const pass = await password({ message: "Password:" });

  await login.getAuth({ username: email, password: pass });

  if (!login.token) throw new Error("Login berhasil namun token tidak ditemukan.");

  upsertEnv("token", login.token);
  upsertEnv("st", login.ST);
  console.log("✅ Token baru tersimpan ke .env");
}

export { login, SEMESTER };
