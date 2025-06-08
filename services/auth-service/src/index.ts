import { app } from "./app";

const startServer = () => {
  const PORT = process.env.PORT || 8000;

  app.listen(PORT, () => {
    console.log(`Auth service listening at port ${PORT}`);
  });
};

startServer();
