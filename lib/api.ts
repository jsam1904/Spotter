// lib/api.ts
export default class API {

    //Users
    static async getUsers() {
        const res = await fetch("http://localhost:3000/users/getUsers");
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
    }

    static async registerUser(user: { name: string; email: string; password: string; gender: string; age: string; user_type: string; }) {
        // El email ya viene en el objeto user, no hay que cambiar nada aquí
        const res = await fetch("http://localhost:3000/users/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
        });

        if (!res.ok) throw new Error("Failed to register user");

        return res.json();
    }

    static async deleteUser(user: { email: string }) {
        // Recibe un objeto usuario y extrae el email
        const res = await fetch(`http://localhost:3000/users/delete/${user.email}`, {
            method: "DELETE",
        });
        if (!res.ok) {
            throw new Error("Error al eliminar usuario");
        }
        return await res.json();
    }

    static async updateUser(user: { email: string; name: string; gender: string; age: string; user_type: string; }) {
        // Recibe un objeto usuario y usa el email en la URL
        const res = await fetch(`http://localhost:3000/users/updateUser/${user.email}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
        });
        if (!res.ok) {
            throw new Error("Error al actualizar usuario");
        }
        return await res.json();
    }

    //Preferences
    static async registerPreference(name: string) {
        const res = await fetch(`http://localhost:3000/preference/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
        });

        if (!res.ok) throw new Error("Failed to register preference");

        return res.json();
    }
    static async getPreferences() {
        const res = await fetch(`http://localhost:3000/preference/getPreferences`, { method: "GET" })

        if (!res.ok) throw new Error("Failed to register preference");

        return res.json();
    }

    static async deletePreference(id: string) {
        const res = await fetch(`http://localhost:3000/preference/delete/${id}`, { method: "DELETE" })

        if (!res.ok) throw new Error("Failed to register preference");

        return res.json();
    }
    static async updatePreference(id: string, data: { name: string }) {
        const res = await fetch(`http://localhost:3000/preference/updatePreference/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            throw new Error("Error al actualizar preferencia");
        }
        return await res.json();
    }
    //Exercises
    static async registerExercise(exercise: { img: string; name: string; description: string; preference: string }) {
        const res = await fetch(`http://localhost:3000/exercise/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(exercise), 
        });

        if (!res.ok) throw new Error("Failed to register exercise");

        return res.json();
    }
    static async getExercises() {
        const res = await fetch(`http://localhost:3000/exercise/getExercises`, { method: "GET" })

        if (!res.ok) throw new Error("Failed to register exercise");

        return res.json();
    }
    static async updateExercise(id: string, data: { img: string; name: string; description: string; preference: string }) {
        const res = await fetch(`http://localhost:3000/exercise/update/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            throw new Error("Error al actualizar el ejercicio");
        }
        return await res.json();
    }
    static async deleteExercise(id: string) {
        const res = await fetch(`http://localhost:3000/exercise/delete/${id}`, { method: "DELETE" })

        if (!res.ok) throw new Error("Failed to register location");

        return res.json();
    }

    // Gyms
    static async getGyms() {
        const res = await fetch(`http://localhost:3000/gym`, { method: "GET" });
        if (!res.ok) throw new Error("Failed to fetch gyms");
        return res.json();
    }

    static async getVerifiedGyms() {
        const res = await fetch(`http://localhost:3000/gym/verified`, { method: "GET" });
        if (!res.ok) throw new Error("Failed to fetch verified gyms");
        return res.json();
    }

    static async suggestGym(gym: { name: string; description: string; longitude: number; latitude: number }) {
        const res = await fetch(`http://localhost:3000/gym/suggest`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(gym),
        });
        if (!res.ok) throw new Error("Failed to suggest gym");
        return res.json();
    }

    static async verifyGym(gymId: string) {
        const res = await fetch(`http://localhost:3000/gym/verify/${gymId}`, {
            method: "PATCH",
        });
        if (!res.ok) throw new Error("Failed to verify gym");
        return res.json();
    }

    static async deleteGym(gymId: string) {
        const res = await fetch(`http://localhost:3000/gym/${gymId}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete gym");
        return res.json();
    }

    static async updateGym(gymId: string, data: { name: string; description: string; longitude: number; latitude: number }) {
        const res = await fetch(`http://localhost:3000/gym/${gymId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to update gym");
        return res.json();
    }

}
