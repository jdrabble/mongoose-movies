const Movie = require("../models/movie");

module.exports = {
  create,
  update,
  edit,
  delete: deleteReview,
};

async function create(req, res) {
  const movie = await Movie.findById(req.params.id);

  // Add the user-centric info to req.body (the new review)
  req.body.user = req.user._id;
  req.body.userName = req.user.name;
  req.body.userAvatar = req.user.avatar;

  // We can push (or unshift) subdocs into Mongoose arrays
  movie.reviews.push(req.body);
  try {
    // Save any changes made to the movie doc
    await movie.save();
  } catch (err) {
    console.log(err);
  }
  res.redirect(`/movies/${movie._id}`);
}

async function deleteReview(req, res) {
  // Note the cool "dot" syntax to query on the property of a subdoc
  const movie = await Movie.findOne({
    "reviews._id": req.params.id,
    "reviews.user": req.user._id,
  });
  // Rogue user!
  if (!movie) return res.redirect("/movies");
  // Remove the review using the remove method available on Mongoose arrays
  movie.reviews.remove(req.params.id);
  // Save the updated movie doc
  await movie.save();
  // Redirect back to the movie's show view
  res.redirect(`/movies/${movie._id}`);
}

async function edit(req, res) {
  const movie = await Movie.findOne({
    "reviews._id": req.params.id,
    "reviews.user": req.user._id,
  });
  //console.log(movie);
  const review = movie.reviews.find(function (item) {
    return item._id.toString() === req.params.id;
  });
  //console.log(review);
  res.render("reviews/show", { title: "Edit Review", review });
}

// async function update(req, res) {
//   const movie = await Movie.findOneAndUpdate(
//     {
//       "reviews._id": req.params.id,
//       "reviews.user": req.user._id,
//     },
//     req.body,
//     {
//       new: true,
//     }
//   );

//   console.log(req.body, movie._id, movie.reviews, req.params.id);

//   res.redirect(`/movies/${movie.id}`);
// }

async function update(req, res) {
  const movie = await Movie.findOne({
    "reviews._id": req.params.id,
    "reviews.user": req.user._id,
  });

  const review = movie.reviews.find(function (item) {
    return item._id.toString() === req.params.id;
  });

  review.content = req.body.content;
  review.rating = req.body.rating;

  await movie.save();

  console.log(
    req.body.content,
    req.body.rating,
    movie._id,
    review._id,
    req.params.id
  );

  res.redirect(`/movies/${movie.id}`);
}
