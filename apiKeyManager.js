// apiKeyManager.js
let apiKey = null; // Variabel private untuk menyimpan API Key

export function setApiKey(newApiKey) {
  apiKey = newApiKey; // Simpan API Key ke dalam memori
}

export function getApiKey() {
  return apiKey; // Kembalikan API Key
}

export function clearApiKey() {
  apiKey = null; // Hapus API Key
}
