
function calculateTrendingScore(post) {
  const likeWeight = 1;
  const commentWeight = 10;

  return (post.likes.length * likeWeight) + (post.comments.length * commentWeight);
}
export default calculateTrendingScore;
