const {
  obtenerPosts,
  agregarPost,
  eliminarPost,
  actualizarPost,
} = require("./consultas");
const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());

app.use(cors());

// GET /todos
app.get("/posts", async (req, res) => {
  const posts = await obtenerPosts();
  res.json(posts);
});

app.post("/posts", async (req, res) => {
  try {
    const { titulo, url, descripcion } = req.body;
    console.log(req.body);
    await agregarPost(titulo, url, descripcion, 0);
    res.send("Viaje agregado con éxito");
  } catch (error) {
    const { code } = error;
    if (code == "23502") {
      // dependiendo el error es el código del mismo,
      //en este caso, lanzamos un msj específico para cuando haya un campo null
      res
        .status(400)
        .send(
          "Se ha violado la restricción NOT NULL en uno de los campos de la tabla"
        );
    } else {
      res.status(500).send(error);
    }
  }
});

app.delete("/posts/:id", async (req, res) => {
  const { id } = req.params;
  await eliminarPost(id);
  res.send("Post eliminado con éxito");
});

app.put("/posts/like/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await actualizarPost(id);
    res.send("Post actualizado con éxito");
  } catch ({ code, message }) {
    res.status(code).send(message);
  }
});

app.listen(3000, () => {
  console.log("Example app listening on port 3000");
});
