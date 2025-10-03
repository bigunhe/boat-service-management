import { create } from "zustand";

export const useReviewsStore = create((set, get) => ({
  reviews: [],
  userEmail: null,

  setUserEmail: (email) => set({ userEmail: email }),

  fetchReviews: async (boatId, userEmail = null, isAdmin = false) => {
    try {
      let url = boatId ? `http://localhost:5000/api/reviews?boatId=${boatId}` : `http://localhost:5000/api/reviews`;
      
      if (userEmail) {
        url += `&userEmail=${encodeURIComponent(userEmail)}`;
      }
      
      if (isAdmin) {
        url += `&admin=true`;
      }
      
      const res = await fetch(url);
      const data = await res.json();
      if (!data.success) return;
      set({ reviews: data.data });
    } catch (e) {
      console.error("Error fetching reviews", e.message);
    }
  },

  addReview: async (review) => {
    try {
      const res = await fetch(`http://localhost:5000/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(review),
      });
      const data = await res.json();
      if (!data.success) return { success: false, message: data.message };
      set((state) => ({ reviews: [data.data, ...state.reviews] }));
      return { success: true };
    } catch (e) {
      return { success: false, message: e.message };
    }
  },

  deleteReview: async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/reviews/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) return { success: false, message: data.message };
      set((state) => ({ reviews: state.reviews.filter((r) => r._id !== id) }));
      return { success: true };
    } catch (e) {
      return { success: false, message: e.message };
    }
  },
}));


