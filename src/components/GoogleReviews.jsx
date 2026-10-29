import { getPublishedReviews, GOOGLE_REVIEWS_URL } from '../data/customerReviews';

export default function GoogleReviews() {
  const reviews = getPublishedReviews();
  if (!reviews.length) return null;

  return (
    <section className="customer-reviews section wrap" aria-labelledby="customer-reviews-title">
      <div className="section-heading">
        <h2 id="customer-reviews-title">O que nossos clientes dizem</h2>
        <a className="text-link" href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer">
          Ver avaliações no Google
        </a>
      </div>
      <div className="customer-review-grid">
        {reviews.map(review => (
          <figure className="customer-review-card" key={review.id}>
            {Number.isInteger(review.rating) && review.rating >= 1 && review.rating <= 5 && (
              <span className="customer-review-stars" aria-label={`${review.rating} de 5 estrelas`}>{'★'.repeat(review.rating)}</span>
            )}
            <blockquote><p>“{review.excerpt}”</p></blockquote>
            <figcaption>
              <strong>{review.author}</strong>
              <a href={review.reviewUrl} target="_blank" rel="noopener noreferrer">Ler avaliação completa no Google</a>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
