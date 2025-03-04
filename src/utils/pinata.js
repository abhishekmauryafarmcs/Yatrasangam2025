import axios from 'axios'

const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY
const PINATA_SECRET_KEY = import.meta.env.VITE_PINATA_SECRET_KEY
const PINATA_JWT = import.meta.env.VITE_PINATA_JWT

const pinataClient = axios.create({
  baseURL: 'https://api.pinata.cloud',
  headers: {
    'Authorization': `Bearer ${PINATA_JWT}`
  }
})

// Test Pinata connection
export const testPinataConnection = async () => {
  try {
    const response = await pinataClient.get('/data/testAuthentication')
    console.log('Pinata connection successful:', response.data)
    return true
  } catch (error) {
    console.error('Pinata connection failed:', error)
    return false
  }
}

export const uploadToPinata = async (file, metadata = {}) => {
  try {
    // Test connection before upload
    const isConnected = await testPinataConnection()
    if (!isConnected) {
      throw new Error('Failed to connect to Pinata')
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('pinataMetadata', JSON.stringify({
      name: `cultural-planner-${Date.now()}`,
      ...metadata
    }))

    const response = await pinataClient.post('/pinning/pinFileToIPFS', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`
  } catch (error) {
    console.error('Error uploading to Pinata:', error)
    throw error
  }
}

export const uploadJSONToPinata = async (jsonData) => {
  try {
    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      jsonData,
      {
        headers: {
          'Content-Type': 'application/json',
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_SECRET_KEY
        }
      }
    )

    if (!response.data || !response.data.IpfsHash) {
      throw new Error('No IPFS hash received from Pinata')
    }

    // Return clean IPFS hash
    return response.data.IpfsHash
  } catch (error) {
    console.error('Error uploading to Pinata:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText
    })
    throw new Error(`Failed to upload to IPFS: ${error.message}`)
  }
}

export const fetchFromPinata = async (ipfsHash) => {
  try {
    // Clean the hash - remove any gateway prefix if present
    const cleanHash = ipfsHash.replace('https://gateway.pinata.cloud/ipfs/', '')
    
    // Construct the proper gateway URL
    const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${cleanHash}`
    
    console.log('Fetching from Pinata gateway:', gatewayUrl)
    
    const response = await axios.get(gatewayUrl, {
      timeout: 10000, // 10 second timeout
      maxRedirects: 5  // Limit redirects
    })
    
    if (!response.data) {
      throw new Error('No data received from Pinata')
    }
    
    return response.data
  } catch (error) {
    console.error('Error fetching from Pinata:', {
      message: error.message,
      hash: ipfsHash,
      status: error.response?.status,
      statusText: error.response?.statusText
    })
    throw new Error(`Failed to fetch data from IPFS: ${error.message}`)
  }
} 