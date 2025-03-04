import { uploadJSONToPinata, fetchFromPinata, testPinataConnection } from '../utils/pinata'

// Initialize user index from localStorage
const initializeUserIndex = () => {
  const storedIndex = localStorage.getItem('userIndex')
  if (storedIndex) {
    try {
      const parsed = JSON.parse(storedIndex)
      userIndex.clear()
      Array.from(parsed).forEach(([key, value]) => {
        userIndex.set(key, value)
      })
      console.log('User index loaded:', userIndex.size, 'users')
    } catch (error) {
      console.error('Error loading user index:', error)
    }
  }
}

// In-memory user index
const userIndex = new Map()
initializeUserIndex() // Load initial data

export const userService = {
  // Add a debug helper method
  debugUserIndex() {
    console.log('===== USER INDEX DEBUG =====')
    console.log('User index size:', userIndex.size)
    
    if (userIndex.size === 0) {
      console.log('User index is empty! This might be why login is failing.')
      const storedIndex = localStorage.getItem('userIndex')
      console.log('Raw userIndex from localStorage:', storedIndex)
      return false
    }
    
    console.log('Users in index:')
    for (const [key, value] of userIndex.entries()) {
      console.log('---')
      console.log('Key:', key)
      console.log('Name:', value.name)
      console.log('Email:', value.email)
      console.log('Mobile:', value.mobile)
      console.log('Role:', value.role)
      console.log('IPFS Hash:', value.ipfsHash)
    }
    console.log('===== END USER INDEX DEBUG =====')
    return true
  },

  async signup(userData) {
    try {
      // First, test IPFS connection
      const isPinataConnected = await testPinataConnection()
      if (!isPinataConnected) {
        throw new Error('Unable to connect to IPFS storage')
      }

      // Check if email/mobile already exists
      const identifier = userData.email || userData.mobile
      if (userIndex.has(identifier)) {
        throw new Error('User already exists with this email/mobile')
      }

      // Prepare user data for IPFS
      const userDataForIPFS = {
        name: userData.name,
        role: userData.role,
        email: userData.email,
        mobile: userData.mobile,
        password: btoa(userData.password), // Basic encryption (not for production)
        createdAt: new Date().toISOString()
      }
      
      try {
        // Upload to IPFS
        const ipfsHash = await uploadJSONToPinata(userDataForIPFS)
        console.log('Data saved to IPFS:', ipfsHash)

        // Update user index
        const indexData = {
          ipfsHash,
          password: userDataForIPFS.password,
          email: userData.email,
          mobile: userData.mobile
        }
        userIndex.set(identifier, indexData)

        // Save user index to localStorage for persistence
        localStorage.setItem('userIndex', JSON.stringify(Array.from(userIndex.entries())))
        console.log('User index updated:', identifier)

        return {
          ...userDataForIPFS,
          ipfsHash,
          password: undefined // Don't return password
        }
      } catch (error) {
        console.error('IPFS upload error:', error)
        throw new Error('Failed to save user data to IPFS')
      }
    } catch (error) {
      console.error('Error in signup:', error)
      throw error
    }
  },

  async login(identifier, password) {
    try {
      console.log('Attempting login with identifier:', identifier)
      
      // Reload user index to ensure latest data
      initializeUserIndex()

      // Find user in index
      let userData = userIndex.get(identifier)
      
      // If not found by direct identifier, try finding by email or mobile
      if (!userData) {
        for (const [key, value] of userIndex.entries()) {
          if (value.email === identifier || value.mobile === identifier) {
            userData = value
            break
          }
        }
      }

      if (!userData) {
        console.log('User not found for identifier:', identifier)
        throw new Error('Invalid credentials')
      }

      console.log('Found user data:', { ...userData, password: '***' })

      // Verify password
      const hashedPassword = btoa(password)
      if (hashedPassword !== userData.password) {
        console.log('Password mismatch')
        throw new Error('Invalid credentials')
      }

      // Fetch user data from IPFS
      console.log('Fetching IPFS data from:', userData.ipfsHash)
      const ipfsData = await fetchFromPinata(userData.ipfsHash)

      // Create session data
      const sessionData = {
        ...ipfsData,
        password: undefined,
        isAuthenticated: true
      }

      // Store session
      localStorage.setItem('userData', JSON.stringify(sessionData))
      console.log('Login successful')

      return sessionData
    } catch (error) {
      console.error('Error in login:', error)
      throw error
    }
  },

  async updateProfile(identifier, profileData) {
    try {
      // Reload user index
      initializeUserIndex()

      // Check if user exists
      const userData = userIndex.get(identifier)
      if (!userData) {
        throw new Error('User not found')
      }

      // Upload updated profile data to IPFS
      const ipfsHash = await uploadJSONToPinata({
        ...profileData,
        password: userData.password, // Preserve password
        updatedAt: new Date().toISOString()
      })

      // Update user index
      userIndex.set(identifier, {
        ...userData,
        ipfsHash,
        email: profileData.email,
        mobile: profileData.mobile
      })

      // Update localStorage
      localStorage.setItem('userIndex', JSON.stringify(Array.from(userIndex.entries())))

      return {
        ...profileData,
        password: undefined,
        ipfsHash
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  },

  async logout() {
    try {
      localStorage.removeItem('userData')
    } catch (error) {
      console.error('Error in logout:', error)
      throw error
    }
  }
} 