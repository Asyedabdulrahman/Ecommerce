import Image from "next/image";

const Reviews = async ({ productId }: { productId: string }) => {
  const reviewRes = await fetch(
    `https://api.fera.ai/v3/public/reviews?product.id=${productId}&public_key=${process.env.NEXT_PUBLIC_FERA_ID}`
  );
  const reviews = await reviewRes.json();
  console.log(reviews);

  // Check if the reviews data is available and is an array
  if (
    !reviews?.data ||
    !Array.isArray(reviews.data) ||
    reviews.data.length === 0
  ) {
    return (
      <h1 className="flex justify-center items-center text-lama">
        No reviews from User
      </h1>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl">User Reviews</h1>
        {reviews.data.map((review: any) => (
          <div className="flex flex-col gap-4" key={review.id}>
            {/* User Info */}
            <div className="flex items-center gap-4 font-medium">
              {review.customer?.avatar_url && (
                <Image
                  src={review.customer.avatar_url}
                  alt="customerAvatar"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              )}
              <span>{review.customer?.display_name || "Anonymous"}</span>
            </div>
            {/* Stars */}
            <div className="flex gap-2">
              {Array.from({ length: review.rating }).map((_, index) => (
                <Image
                  src="/star.png"
                  alt="star"
                  key={index}
                  width={16}
                  height={16}
                />
              ))}
            </div>
            {/* Heading and Body */}
            {review.heading && <p>{review.heading}</p>}
            {review.body && <p>{review.body}</p>}
            {/* Media */}
            <div className="flex gap-2">
              {review.media?.map((media: any) => (
                <Image
                  src={media.url}
                  key={media.id}
                  alt="review media"
                  width={100}
                  height={50}
                  className="object-cover"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
