import { Setting } from '../models/Setting.js';

export const getSettings = async (req, res) => {
  try {
    const settings = await Setting.find();
    const settingsMap = {};
    settings.forEach(s => {
      settingsMap[s.key] = s.value;
    });
    if (!settingsMap.whatsapp_number) {
      settingsMap.whatsapp_number = '917016371119';
    }
    res.json(settingsMap);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch settings: ' + err.message });
  }
};

export const updateSetting = async (req, res) => {
  const { key, value } = req.body;
  if (!key || value === undefined) {
    return res.status(400).json({ error: 'Key and value are required' });
  }
  try {
    let sanitizedValue = value;
    if (key === 'whatsapp_number') {
      sanitizedValue = value.replace(/\D/g, '');
      if (!sanitizedValue) {
        return res.status(400).json({ error: 'Invalid WhatsApp number. It must contain digits.' });
      }
    }
    const updated = await Setting.findOneAndUpdate(
      { key },
      { value: sanitizedValue },
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update setting: ' + err.message });
  }
};
