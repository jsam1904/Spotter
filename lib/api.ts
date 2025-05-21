// lib/api.ts
export default class API {

    //Users
    static async getUsers() {
        const res = await fetch("http://localhost:3000/users/getUsers");
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
    }

    static async registerUser(user: { name: string; username: string; password: string; email: string; user_type: string; }) {
        const res = await fetch("http://localhost:3000/users/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
        });

        if (!res.ok) throw new Error("Failed to register user");

        return res.json();
    }
    static async deleteUser(username: string) {
        const res = await fetch(`http://localhost:3000/users/delete/${username}`, {
            method: "DELETE",
        });
        if (!res.ok) {
            throw new Error("Error al eliminar usuario");
        }
        return await res.json();
    }
    static async updateUser(username: string, data: { name: string, email: string }) {
        const res = await fetch(`http://localhost:3000/users/updateUser/${username}`, { method: "PUT", })
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

    static async deletePreference(name: string) {
        const res = await fetch(`http://localhost:3000/preference/delete/${name}`, { method: "DELETE" })

        if (!res.ok) throw new Error("Failed to register preference");

        return res.json();
    }
    //Exercises

    //Locations
}
