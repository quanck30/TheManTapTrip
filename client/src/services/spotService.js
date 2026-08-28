import { getCsrfCookie, readXsrfToken } from "./authService";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const URLS = {
  fetchSpot: `${BASE_URL}/spots`,
  saveSpot: `${BASE_URL}/spots`,
  deleteSpot: (id) => `${BASE_URL}/spots/${id}`,
  setVisited: `${BASE_URL}/spots/visit`,
};

const toSpotPayload = (place) => ({
  spotId: place.spotId,
  address: place.address,
  sName: place.sName,
  lat: place.lat,
  long: place.long,
  rating: place.rating,
  price: place.priceLevel,
  hasParking: place.hasParking,
  summary: place.summary,
  photoReference: place.photoReference,
  directionUrl: place.directionUrl,
  primaryType: place.primaryType,
});

const parseOrThrow = async (response, fallback) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const validationErrors = Object.values(data.errors ?? {})
      .flat()
      .join(", ");

    throw new Error(validationErrors || data.message || fallback);
  }
  return data;
};

export const spotService = {
  fetchSpot: async () => {
    const response = await fetch(URLS.fetchSpot, {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    });
    const result = await parseOrThrow(response, "お気に入り一覧の取得に失敗しました。");
    return {
      spots: result.data?.spots ?? [],
      message: result.message ?? "",
    };
  },

  saveSpot: async (place) => {
    const payload = toSpotPayload(place);
    await getCsrfCookie();
    const response = await fetch(URLS.saveSpot, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-XSRF-TOKEN": readXsrfToken(),
      },
      body: JSON.stringify(payload),
    });
    const result = await parseOrThrow(response, "お気に入りの保存に失敗しました。");
    return {
      spot: result.data?.spot ?? null,
      message: result.message ?? "",
    };
  },

  deleteSpot: async (id) => {
    await getCsrfCookie();
    const response = await fetch(URLS.deleteSpot(id), {
      method: "DELETE",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "X-XSRF-TOKEN": readXsrfToken(),
      },
    });
    const result = await parseOrThrow(response, "お気に入りの削除に失敗しました。");
    return {
      message: result.message ?? "",
    };
  },

  setVisited: async (id) => {
    await getCsrfCookie();
    const response = await fetch(URLS.setVisited, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-XSRF-TOKEN": readXsrfToken(),
      },
      body: JSON.stringify({ id }),
    });
    const result = await parseOrThrow(response, "行き済み登録に失敗しました。");
    return {
      message: result.message ?? "",
    };
  },
};
