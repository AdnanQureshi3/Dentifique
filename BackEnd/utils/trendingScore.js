
function calculateTrendingScore(post) {
  const likeWeight = 1;
  const commentWeight = 10;

  return (post.likesCount * likeWeight) + (post.commentsCount * commentWeight);
}
export default calculateTrendingScore;
