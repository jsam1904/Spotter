// lib/api.ts
export default class API {

    //Users
    static async getUsers() {
        const res = await fetch("http://localhost:3000/users/getUsers");
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
    }

    static async getUserByEmail(email: String) {
        const res = await fetch(`http://localhost:3000/users/${email}`);
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
    }

    static async registerUser(user: { name: string; username: string; password: string; email: string; gender: string; age: string; user_type: string; }) {
        const res = await fetch("http://localhost:3000/users/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
        });

        if (!res.ok) throw new Error("Failed to register user");

        return res.json();
    }

    static async updateAndVerifyPassword(email: string, currentPassword: string, password: string) {
        const res = await fetch(`http://localhost:3000/users/updatePass/${email}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ currentPassword, newPassword: password })
        });

        if (!res.ok) throw new Error("failed to updatePass");

        return res.json();
    }
    
    static async deleteUser(email: string) {
        const res = await fetch(`http://localhost:3000/users/delete/${email}`, {
            method: "DELETE",
        });
        if (!res.ok) {
            throw new Error("Error al eliminar usuario");
        }
        return await res.json();
    }
    static async updateUser(email: string, data: { name: string; username: string; gender: string; age: string; user_type: string; }) {
        const res = await fetch(`http://localhost:3000/users/updateUser/${email}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        })
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
    //Locations

    static async getLocations() {
        const res = await fetch(`http://localhost:3000/location/getLocations`, { method: "GET" })

        if (!res.ok) throw new Error("Failed to register location");

        return res.json();
    }
    static async registerLocation(name: string) {
        const res = await fetch(`http://localhost:3000/location/registerLocation`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
        });

        if (!res.ok) throw new Error("Failed to register location");

        return res.json();
    }
    static async deleteLocation(id: string) {
        const res = await fetch(`http://localhost:3000/location/deleteLocation/${id}`, { method: "DELETE" })

        if (!res.ok) throw new Error("Failed to register location");

        return res.json();
    }

    static async updateLocation(id: string, data: { name: string }) {
        const res = await fetch(`http://localhost:3000/location/updateLocation/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            throw new Error("Error al actualizar ubicación");
        }
        return await res.json();
    }

    //gym
    static async getGyms() {
        const res = await fetch(`http://localhost:3000/gym/`, { method: "GET" })

        if (!res.ok) throw new Error("Failed to get gyms");

        return res.json();
    }

    static async getActualGym(email: string) {
        const res = await fetch(`http://localhost:3000/users/goes_at/${email}`, { method: "GET" })

        if (!res.ok) throw new Error("Failed to get gyms");

        return res.json();
    }

    static async changeGym(email: string, data: { name: string; }) {
        const res = await fetch(`http://localhost:3000/users/changeGym/${email}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })

        if (!res.ok) throw new Error("Failed to get gyms");

        return res.json();
    }
}
