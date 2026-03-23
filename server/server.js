import app from "./src/app.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`\n🎌 AniVerse API → http://localhost:${PORT}`);
    console.log(`📡 Mode: ${process.env.NODE_ENV}\n`);
});