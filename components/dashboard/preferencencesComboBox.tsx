import { useState, useEffect } from 'react';
import API from "@/lib/api";

export default function PreferencesComboBox({ selectedPreference, onPreferenceChange }: {
  selectedPreference: string;
  onPreferenceChange: (pref: string) => void;
}) {
  const [preferences, setPreferences] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    API.getPreferences().then(setPreferences);
  }, []);

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="preference" className="text-sm font-medium text-gray-700">
        Preferencia
      </label>
      <select
        id="preference"
        value={selectedPreference}
        onChange={(e) => onPreferenceChange(e.target.value)}
        className="border border-gray-300 rounded px-3 py-2"
      >
        <option value="">Selecciona una preferencia</option>
        {preferences.map(pref => (
          <option key={pref.id} value={pref.name}>{pref.name}</option>
        ))}
      </select>
    </div>
  );
}