const { Pool } = require("pg");
const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "12345",
  database: "likeme",
  allowExitOnIdle: true,
});

const obtenerPosts = async () => {
  const { rows } = await pool.query("SELECT * FROM posts");
  return rows;
};

const agregarPost = async (titulo, img, descripcion) => {
  const consulta =
    "INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, $4)";
  const values = [titulo, img, descripcion, 0];
  const { rowCount } = await pool.query(consulta, values);
  if (rowCount === 0) {
    throw { code: 404, message: "No se consiguió ningún post con este id" };
  }
  console.log("Post agregado");
};

const eliminarPost = async (id) => {
  const consulta = "DELETE FROM posts WHERE id = $1";
  const values = [id];
  const result = await pool.query(consulta, values);
};

const actualizarPost = async (id) => {
  const query = "UPDATE posts SET likes = likes + 1  WHERE id = $1 RETURNING *";
  const { rows } = await pool.query(query, [id]);
  if (rows.length === 0) {
    throw { code: 404, message: "No se consiguió ningún post con este id" };
  }
  return rows[0];
};

module.exports = { obtenerPosts, agregarPost, eliminarPost, actualizarPost };
