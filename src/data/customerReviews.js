export const GOOGLE_REVIEWS_URL = 'https://share.google/LUfygV4B9Dst4atvz';

// Render only entries with a checked original and authorization confirmed by the owner.
// Rating and date must come from the individual review; never infer them from the business average.
export const customerReviews = [
  {
    "id": "matheuszin-dj",
    "author": "Matheuszin DJ",
    "excerpt": "Ótimo atendimento, trabalho impecável e preço justo.",
    "sourceUrl": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2xOUk0yaGZSRkIzYzBnMVRXVTFNRzlRVVRGUWVXYxAB!2m1!1s0x0:0xc920fb8084ba8004!3m1!1s2@1:CAIQACodChtycF9oOlNRM2hfRFB3c0g1TWU1MG9QUTFQeWc%7C%7C?hl=pt-BR",
    "reviewUrl": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2xOUk0yaGZSRkIzYzBnMVRXVTFNRzlRVVRGUWVXYxAB!2m1!1s0x0:0xc920fb8084ba8004!3m1!1s2@1:CAIQACodChtycF9oOlNRM2hfRFB3c0g1TWU1MG9QUTFQeWc%7C%7C?hl=pt-BR",
    "rating": 5,
    "originalVerified": true,
    "authorized": true,
    "verifiedOn": "2026-10-29"
  },
  {
    "id": "luis-junior-pontelli",
    "author": "Luis Junior Pontelli",
    "excerpt": "Economizei e aproveitei meu notebook.",
    "sourceUrl": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2pnMFJGWjROSEpKZUdGbE5rZ3lPRTlNY2kxTFZYYxAB!2m1!1s0x0:0xc920fb8084ba8004!3m1!1s2@1:CAIQACodChtycF9oOjg0RFZ4NHJJeGFlNkgyOE9Mci1LVXc%7C%7C?hl=pt-BR",
    "reviewUrl": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2pnMFJGWjROSEpKZUdGbE5rZ3lPRTlNY2kxTFZYYxAB!2m1!1s0x0:0xc920fb8084ba8004!3m1!1s2@1:CAIQACodChtycF9oOjg0RFZ4NHJJeGFlNkgyOE9Mci1LVXc%7C%7C?hl=pt-BR",
    "rating": 5,
    "originalVerified": true,
    "authorized": true,
    "verifiedOn": "2026-10-29"
  },
  {
    "id": "fabio-silva",
    "author": "Fabio Silva",
    "excerpt": "O atendimento foi rápido, profissional e de muita qualidade.",
    "sourceUrl": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2pobVlrRm9ZelU0VEdkSU1VeDFVRE16TW5BeWIzYxAB!2m1!1s0x0:0xc920fb8084ba8004!3m1!1s2@1:CAIQACodChtycF9oOjhmYkFoYzU4TGdIMUx1UDMzMnAyb3c%7C%7C?hl=pt-BR",
    "reviewUrl": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2pobVlrRm9ZelU0VEdkSU1VeDFVRE16TW5BeWIzYxAB!2m1!1s0x0:0xc920fb8084ba8004!3m1!1s2@1:CAIQACodChtycF9oOjhmYkFoYzU4TGdIMUx1UDMzMnAyb3c%7C%7C?hl=pt-BR",
    "rating": 5,
    "originalVerified": true,
    "authorized": true,
    "verifiedOn": "2026-10-29"
  }
];

export function getPublishedReviews(reviews = customerReviews) {
  return reviews.filter(review => review.authorized === true && review.originalVerified === true &&
    review.author?.trim() && review.excerpt?.trim() && /^https:\/\/(?:www\.)?(?:google\.com|maps\.app\.goo\.gl|share\.google)\//.test(review.reviewUrl));
}
