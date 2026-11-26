import { createPracticeApi } from "./express-practice.js";

const port = Number(process.env.PORT || 3100);
const server = createPracticeApi().listen(port, "127.0.0.1", () => {
  console.log(`Express exercises are ready at http://127.0.0.1:${server.address().port}`);
});
