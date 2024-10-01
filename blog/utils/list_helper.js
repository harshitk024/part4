const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const total = blogs.reduce((curr, acc) => {
    return curr + acc.likes;
  }, 0);

  return total;
};

const favoriteBlog = (blogs) => {

  if(blogs.length === 0){
    return 0
  }

  let fav = blogs[0];

  blogs.forEach((blog) => {
    if (fav.likes < blog.likes) {
      fav = blog;
    }
  });

  return fav;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
};
