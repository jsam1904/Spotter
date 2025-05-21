import { useState } from 'react';

export default function TypesCombobox({ selectedRole, onRoleChange }: {
  selectedRole: string;
  onRoleChange: (role: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="role" className="text-sm font-medium text-gray-700">
        Rol de usuario
      </label>
      <select
        id="role"
        value={selectedRole}
        onChange={(e) => onRoleChange(e.target.value)}
        className="border border-gray-300 rounded px-3 py-2"
      >
        <option value="User">User</option>
        <option value="Admin">Admin</option>
      </select>
    </div>
  );
}
