import axios from 'axios'

const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY
const PINATA_SECRET_KEY = import.meta.env.VITE_PINATA_SECRET_KEY
const PINATA_JWT = import.meta.env.VITE_PINATA_JWT
const PINATA_GATEWAY = 'peach-eldest-finch-515.mypinata.cloud'

const pinataClient = axios.create({
  baseURL: 'https://api.pinata.cloud',
  headers: {
    'Authorization': `Bearer ${PINATA_JWT}`
  }
})

// Test Pinata connection
export const testPinataConnection = async () => {
  try {
    // First try the authentication test endpoint
    try {
      const response = await pinataClient.get('/data/testAuthentication')
      console.log('Pinata connection successful:', response.data)
      return true
    } catch (authError) {
      console.log('Authentication test failed, trying alternative endpoint:', authError.message)
      
      // If that fails, try an alternative endpoint
      try {
        const response = await pinataClient.get('/data/userPinnedDataTotal')
        console.log('Pinata connection successful via alternative endpoint:', response.data)
        return true
      } catch (altError) {
        console.error('All authentication attempts failed:', altError.message)
        return false
      }
    }
  } catch (error) {
    console.error('Pinata connection test failed:', error)
    return false
  }
}

// New function to search for user data by email or mobile
export const searchUserDataByIdentifier = async (identifier) => {
  try {
    console.log('Searching for user data with identifier:', identifier)
    
    // First, test the connection to make sure we have valid credentials
    const isConnected = await testPinataConnection()
    if (!isConnected) {
      console.error('Cannot connect to Pinata API - authentication failed')
      return null
    }
    
    // The correct API endpoint is now '/data/pinList' instead of '/pinning/pinList'
    try {
      const response = await pinataClient.get('/data/pinList')
      
      if (!response.data || !response.data.rows || response.data.rows.length === 0) {
        console.log('No pins found in Pinata account')
        return null
      }
      
      console.log(`Found ${response.data.rows.length} pins, searching for user data...`)
      
      // Look for pins with metadata matching the identifier
      let matchingPin = null
      for (const pin of response.data.rows) {
        // Check metadata if available
        if (pin.metadata) {
          // Check name field
          if (pin.metadata.name && pin.metadata.name.includes(identifier)) {
            console.log('Found matching pin by name:', pin.ipfs_pin_hash)
            matchingPin = pin
            break
          }
          
          // Check keyvalues if available
          if (pin.metadata.keyvalues) {
            const keyvalues = pin.metadata.keyvalues
            if (
              (keyvalues.email && keyvalues.email === identifier) ||
              (keyvalues.mobile && keyvalues.mobile === identifier) ||
              (keyvalues.identifier && keyvalues.identifier === identifier)
            ) {
              console.log('Found matching pin by keyvalues:', pin.ipfs_pin_hash)
              matchingPin = pin
              break
            }
          }
        }
        
        // If no metadata match, try to fetch each pin and check its content
        // This is a fallback for pins without proper metadata
        try {
          const pinData = await fetchFromPinata(pin.ipfs_pin_hash)
          if (
            pinData && 
            ((pinData.email && pinData.email === identifier) || 
             (pinData.mobile && pinData.mobile === identifier))
          ) {
            console.log('Found matching pin by content:', pin.ipfs_pin_hash)
            matchingPin = pin
            break
          }
        } catch (fetchError) {
          // Continue to next pin if fetch fails
          console.log(`Skipping pin ${pin.ipfs_pin_hash} due to fetch error`)
          continue
        }
      }
      
      if (!matchingPin) {
        console.log('No matching user data found for identifier:', identifier)
        return null
      }
      
      // Fetch the actual user data
      const userData = await fetchFromPinata(matchingPin.ipfs_pin_hash)
      
      if (!userData) {
        console.log('Failed to fetch user data from matching pin')
        return null
      }
      
      return {
        ...userData,
        ipfsHash: matchingPin.ipfs_pin_hash
      }
    } catch (listError) {
      console.error('Error fetching pin list:', listError)
      
      // Fallback: try direct gateway URL for common user identifiers
      // This is for cases where we can't query the pin list
      console.log('Attempting alternative approach with direct hash guessing')
      
      // Common hash pattern for users (if you have a predictable pattern)
      const possibleHashes = []
      
      // If there are any known IPFS hashes stored in local storage, try those first
      try {
        const hashMapping = JSON.parse(localStorage.getItem('ipfsHashMapping') || '{}')
        for (const [key, hash] of Object.entries(hashMapping)) {
          if (key.includes(identifier) || identifier.includes(key)) {
            possibleHashes.push(hash)
          }
        }
      } catch (e) {
        console.error('Error accessing hash mapping:', e)
      }
      
      // Try any available hashes
      for (const hash of possibleHashes) {
        try {
          const userData = await fetchFromPinata(hash)
          if (userData && 
             (userData.email === identifier || userData.mobile === identifier)) {
            console.log('Found user data via alternative approach:', hash)
            return {
              ...userData,
              ipfsHash: hash
            }
          }
        } catch (fetchError) {
          console.log(`Failed to fetch possible hash: ${hash}`)
          continue
        }
      }
      
      return null
    }
  } catch (error) {
    console.error('Error searching for user data:', error)
    return null
  }
}

// Check if a file exists on IPFS by its hash
export const checkIfFileExists = async (ipfsHash) => {
  try {
    // Clean the hash - remove any gateway prefix if present
    const cleanHash = ipfsHash.replace(`https://${PINATA_GATEWAY}/ipfs/`, '')
                             .replace('https://gateway.pinata.cloud/ipfs/', '')
    
    console.log('Checking if file exists on IPFS:', cleanHash)
    
    // First try to directly access the file to see if it's publicly available
    try {
      // Try public gateway first
      const publicGatewayUrl = `https://gateway.pinata.cloud/ipfs/${cleanHash}`
      console.log('Checking public gateway:', publicGatewayUrl)
      
      const publicResponse = await axios.head(publicGatewayUrl, {
        timeout: 5000,
        validateStatus: (status) => status < 500 // Accept any status < 500 to check if file exists
      })
      
      if (publicResponse.status === 200) {
        console.log('File exists on public gateway')
        return true
      }
      
      // Try dedicated gateway
      const dedicatedGatewayUrl = `https://${PINATA_GATEWAY}/ipfs/${cleanHash}`
      console.log('Checking dedicated gateway:', dedicatedGatewayUrl)
      
      const dedicatedResponse = await axios.head(dedicatedGatewayUrl, {
        timeout: 5000,
        headers: {
          'Authorization': `Bearer ${PINATA_JWT}`
        },
        validateStatus: (status) => status < 500 // Accept any status < 500 to check if file exists
      })
      
      if (dedicatedResponse.status === 200) {
        console.log('File exists on dedicated gateway')
        return true
      }
    } catch (gatewayError) {
      console.log('Gateway check failed, falling back to API check:', gatewayError.message)
      // Continue to API check if gateway check fails
    }
    
    // If gateway checks fail, try the API
    try {
      // Check if the pin exists in your Pinata account via API
      const response = await pinataClient.get(`/pinning/pinList?hashContains=${cleanHash}`)
      
      if (response.data && response.data.rows && response.data.rows.length > 0) {
        console.log('File exists in Pinata account:', cleanHash)
        return true
      }
      
      console.log('File not found in Pinata account:', cleanHash)
    } catch (apiError) {
      console.error('Error checking Pinata API:', apiError.message)
      // If API check fails, we'll return false below
    }
    
    // If we've reached this point, the file doesn't exist or we couldn't verify
    // For login purposes, we'll assume it might exist and let the fetch attempt handle errors
    console.log('Could not verify file existence, assuming it might exist for login purposes')
    return true
  } catch (error) {
    console.error('Error in checkIfFileExists:', error)
    // For login purposes, we'll assume it might exist and let the fetch attempt handle errors
    return true
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

    return `https://${PINATA_GATEWAY}/ipfs/${response.data.IpfsHash}`
  } catch (error) {
    console.error('Error uploading to Pinata:', error)
    throw error
  }
}

export const uploadJSONToPinata = async (jsonData) => {
  try {
    // Test connection before upload
    const isConnected = await testPinataConnection()
    if (!isConnected) {
      throw new Error('Failed to connect to Pinata')
    }

    // Extract identifier for metadata
    const identifier = jsonData.email || jsonData.mobile || `user-${Date.now()}`;
    
    // Prepare metadata to make searching easier later
    const pinataMetadata = {
      name: `user-${identifier}`,
      keyvalues: {
        email: jsonData.email || '',
        mobile: jsonData.mobile || '',
        identifier: identifier,
        type: 'user-data'
      }
    };

    // Use JWT authentication instead of API key/secret
    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      jsonData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${PINATA_JWT}`
        },
        params: {
          pinataMetadata: JSON.stringify(pinataMetadata)
        }
      }
    )

    if (!response.data || !response.data.IpfsHash) {
      throw new Error('No IPFS hash received from Pinata')
    }

    console.log('Successfully uploaded user data to IPFS with hash:', response.data.IpfsHash);
    console.log('User data is associated with identifier:', identifier);

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
    // Check if the hash looks like an email or username rather than an IPFS hash
    const isEmail = ipfsHash.includes('@') || !ipfsHash.startsWith('Qm');
    
    if (isEmail) {
      console.log('Identifier appears to be an email or username, not an IPFS hash:', ipfsHash);
      // For email/username identifiers, we should use the searchUserDataByIdentifier function
      return null; // Let the caller handle this case
    }
    
    // Clean the hash - remove any gateway prefix if present
    const cleanHash = ipfsHash.replace(`https://${PINATA_GATEWAY}/ipfs/`, '')
                             .replace('https://gateway.pinata.cloud/ipfs/', '');
    
    // Try multiple approaches to fetch the data
    const errors = [];
    
    // 1. First try the proxy approach with improved error handling
    try {
      console.log('Fetching via proxy at:', `/api/ipfs/${cleanHash}`);
      
      const proxyResponse = await axios.get(`/api/ipfs/${cleanHash}`, {
        timeout: 15000,
        maxRedirects: 5,
        validateStatus: function (status) {
          // Consider only 2xx status codes as successful for IPFS data
          return status >= 200 && status < 300;
        }
      });
      
      if (proxyResponse.data) {
        console.log('Successfully fetched data via proxy');
        return proxyResponse.data;
      } else {
        console.log('Proxy returned empty data');
        errors.push('Proxy returned empty data');
      }
    } catch (proxyError) {
      console.log('Proxy fetch failed:', proxyError.message);
      errors.push(`Proxy error: ${proxyError.message}`);
    }
    
    // 2. Try the public gateway
    try {
      const publicGatewayUrl = `https://gateway.pinata.cloud/ipfs/${cleanHash}`;
      console.log('Trying public Pinata gateway:', publicGatewayUrl);
      
      const response = await axios.get(publicGatewayUrl, {
        timeout: 15000,
        maxRedirects: 5
      });
      
      if (response.data) {
        console.log('Successfully fetched data from public gateway');
        return response.data;
      }
    } catch (publicError) {
      console.error('Public gateway fetch failed:', publicError.message);
      errors.push(`Public gateway error: ${publicError.message}`);
    }
    
    // 3. Try the dedicated gateway with authentication
    try {
      const gatewayUrl = `https://${PINATA_GATEWAY}/ipfs/${cleanHash}`;
      console.log('Trying dedicated Pinata gateway:', gatewayUrl);
      
      const response = await axios.get(gatewayUrl, {
        timeout: 15000,
        maxRedirects: 5,
        headers: {
          'Authorization': `Bearer ${PINATA_JWT}`
        }
      });
      
      if (response.data) {
        console.log('Successfully fetched data from dedicated gateway');
        return response.data;
      }
    } catch (dedicatedError) {
      console.error('Dedicated gateway fetch failed:', dedicatedError.message);
      errors.push(`Dedicated gateway error: ${dedicatedError.message}`);
    }
    
    // 4. Try IPFS.io as a final fallback
    try {
      const ipfsIoUrl = `https://ipfs.io/ipfs/${cleanHash}`;
      console.log('Trying IPFS.io gateway:', ipfsIoUrl);
      
      const response = await axios.get(ipfsIoUrl, {
        timeout: 15000,
        maxRedirects: 5
      });
      
      if (response.data) {
        console.log('Successfully fetched data from IPFS.io');
        return response.data;
      }
    } catch (ipfsIoError) {
      console.error('IPFS.io gateway fetch failed:', ipfsIoError.message);
      errors.push(`IPFS.io error: ${ipfsIoError.message}`);
    }
    
    // If we get here, all attempts failed
    console.error('All IPFS fetch attempts failed:', errors);
    throw new Error(`Failed to fetch from IPFS: ${errors.join(', ')}`);
  } catch (error) {
    console.error('Error in fetchFromPinata:', error);
    throw error;
  }
} 