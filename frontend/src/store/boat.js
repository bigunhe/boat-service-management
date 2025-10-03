// src/store/boat.js
import { create } from "zustand";

export const useBoatStore = create((set) => ({
  // ✅ initialize boats
  boats: [],

  // ✅ fetch all boats from backend
  fetchBoats: async () => {
    try {
      const res = await fetch("http://localhost:5001/api/boats");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      const data = await res.json();
      if (data.success) {
        set({ boats: data.data || [] });
      } else {
        console.error("Failed to fetch boats:", data.message);
      }
    } catch (error) {
      console.error("Error fetching boats:", error);
      set({ boats: [] }); // Set empty array on error
    }
  },

  // ✅ action to create a boat
  createBoat: async (newBoat) => {
    try {
      const res = await fetch("http://localhost:5001/api/boats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBoat),
      });

      if (!res.ok) {
        const errText = await res.text();
        return { success: false, message: `Error: ${res.status} - ${errText}` };
      }

      const data = await res.json();
      return { success: true, message: "Boat created!", ...data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // ✅ action to fetch boats
  fetchBoats: async () => {
    try {
      const res = await fetch("http://localhost:5001/api/boats");

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      set({ boats: data.data });
    } catch (error) {
      console.error("Error fetching boats:", error.message);
    }
  },

  // ✅ action to delete boat
  deleteBoat: async (bid) => {
    try {
      const res = await fetch(`http://localhost:5001/api/boats/${bid}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errText = await res.text();
        return { success: false, message: `Error: ${res.status} - ${errText}` };
      }

      const data = await res.json();

      if (!data.success) {
        return { success: false, message: data.message };
      }

      set((state) => ({
        boats: state.boats.filter((boat) => boat._id !== bid),
      }));

      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  updateBoat: async (bid, updatedBoat) => {
    const res = await fetch(`http://localhost:5001/api/boats/${bid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedBoat),
    });

    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    // update the ui immediately, without needing a refresh
    set((state) => ({
      boats: state.boats.map((boat) =>
        boat._id === bid ? data.data : boat
      ),
    }));
    return { success: true, message: data.message };
  },

}));


