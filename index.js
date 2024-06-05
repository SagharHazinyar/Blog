import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import multer from "multer";

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

// Set the views directory
const __dirname = dirname(fileURLToPath(import.meta.url));
app.set("views", __dirname + "/views");
// Set the view engine
app.set("view engine", "ejs");

// Serve static files from the public directory
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    return cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage, dest: "uploads/" });

const primaryPosts = [
  {
    id: 1,
    title: "Istalif",
    description:
      "Istalif, a scenic village near Kabul, Afghanistan, is famed for its terraced orchards, traditional pottery, and bustling bazaars. It's a beloved destination for locals and tourists seeking tranquility and handmade crafts.",
    image: "image/estalif.JPG",
    imagePath: "",
  },

  {
    id: 2,
    title: "Zyarat Sakhi",
    description:
      "Zyarat Sakhi in Kabul, Afghanistan, is a revered shrine dedicated to Hazrat Sakhi Sultan Ali, a prominent figure in Afghan Sufism. This sacred site attracts pilgrims seeking spiritual solace and reflects Afghanistan's rich religious and cultural heritage.",
    image: "image/sakhi.JPG",
    imagePath: "",
  },
  {
    id: 3,
    title: "Paghman",
    description:
      "Paghman, located near Kabul, Afghanistan, is a picturesque resort town known for its beautiful gardens, orchards, and historical sites. It's a popular destination for locals and tourists alike, offering a serene escape from the city with its lush greenery and pleasant climate.",
    image: "image/paghman.JPG",
    imagePath: "",
  },
  {
    id: 4,
    title: "Band-e-Amir",
    description:
      "Band-e-Amir, in Bamyan Province, Afghanistan, is a series of six striking blue lakes formed by natural travertine dams. These lakes are renowned for their vivid blue color and cultural significance, attracting tourists as a potential national park.",
    image: "image/band_e_amir.JPG",
    imagePath: "",
  },
  {
    id: 5,
    title: "Beauty of Kabul Sky",
    description:
      "Kabul's cloudy sky captivates with its ever-changing spectacle. Clouds dance over the mountains, painting a mesmerizing canvas of shapes and hues, offering moments of tranquility amidst the city's hustle.",
    image: "image/kabul.JPG",
    imagePath: "",
  },

  {
    id: 6,
    title: "Nakamura Park",
    description:
      "Nakamura Park in Jalalabad, Afghanistan, named after Dr. Tetsu Nakamura, offers a serene escape with gardens, walkways, and recreational amenities for both locals and visitors to enjoy.",
    image: "image/naka_mora.jpg",
    imagePath: "",
  },
];

let posts = [...primaryPosts];

// Rendering index.ejs file
app.get("/", (req, res) => {
  // Pass the posts array to the template
  // console.log(posts);
  res.render("index", { posts: posts });
});

// Rendering newPost.ejs file

app.get("/newpost", (req, res) => {
  res.render("newpost");
});

// app.post comment

// app.post("/newPost", (req, res) => {
//   upload(req, res, (err) => {
//     if (err) {
//       console.log(err);
//     } else {
//       const { title, description } = req.body;
//       const image = req.file ? `/images/${req.file.filename}` : null;
//       const id = Date.now(); // Generate a unique ID for the post

//       const newPost = { id, title, description, image };
//       posts.push(newPost);

//       res.redirect("/");
//     }
//   });
// });
app.get("/newPost", (req, res) => {
  const card = {
    id: 1,
    title: "Test Card",
    description: "This is a test card",
  };
  res.render("newPost", { card: card });
});
app.post("/upload", upload.single("image"), (req, res) => {
  console.log(req.body);
  console.log(req.file);

  posts.push({
    id: posts.length + 1,
    title: req.body.title,
    description: req.body.description,
    image: req.file.filename, // the uploaded file name as the image property
    imagePath: `/uploads/${req.file.filename}`, // And the full path as the imagePath property
  });

  return res.redirect("/");
});

// Rendering Edit.ejs file
app.get("/edit/:id", (req, res) => {
  const Id = parseInt(req.params.id);
  const post = posts.find((post) => post.id === Id);
  res.render("edit", { post });
});

app.post("/edit/:id", (req, res) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading
      console.log(err);
      return res.status(500).json(err);
    } else if (err) {
      // An unknown error occurred when uploading
      console.log(err);
      return res.status(500).json(err);
    }

    // File uploaded successfully, you can handle the rest of your form submission here
    const Id = parseInt(req.params.id);
    const post = posts.find((post) => post.id === Id);
    // Update the post with the new image file name if needed
    post.image = req.file.filename;

    // Redirect or render success page
    res.redirect("/edit/" + Id);
  });
});

app.post("/delete/:id", (req, res) => {
  const postId = parseInt(req.params.id);
  posts = posts.filter((post) => post.id !== postId);

  res.redirect("/");
});
app.listen(PORT, () => {
  console.log(`app is listening on port ${PORT}`);
});
