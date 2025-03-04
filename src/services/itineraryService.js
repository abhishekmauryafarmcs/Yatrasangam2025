import axios from 'axios';

class ItineraryService {
  constructor() {
    this.openRouterApiKey = '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';
    this.apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
  }

  async generateItinerary(preferences) {
    try {
      const { destination, selectedInterests, duration, language, travelStyle } = preferences;
      
      // Format interests for the prompt
      const interests = this.formatInterests(selectedInterests);
      
      // Build the prompt for the AI
      const prompt = this.buildItineraryPrompt(destination, interests, duration, language, travelStyle);
      
      // Call the OpenRouter API
      const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
      const model = import.meta.env.VITE_OPENROUTER_MODEL || 'deepseek/deepseek-r1-distill-llama-70b:free';
      
      if (!apiKey) {
        console.error('OpenRouter API key is missing');
        return this.createFallbackItinerary(duration, destination);
      }
      
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': window.location.href,
          'X-Title': 'Cultural Planner'
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { 
              role: 'system', 
              content: 'You are a cultural travel expert specializing in India. Create detailed, authentic, and culturally immersive travel itineraries with local experiences, cultural context, and practical information. Format each day with specific times, activities, and locations.'
            },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 4000
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('OpenRouter API error:', errorData);
        return this.createFallbackItinerary(duration, destination);
      }
      
      const data = await response.json();
      const aiResponse = data.choices[0].message.content;
      
      // Parse the response into an itinerary structure
      const itinerary = this.parseItineraryResponse(aiResponse, duration, destination);
      
      // Ensure all practical information fields are properly set
      itinerary.forEach(day => {
        day.timeSlots.forEach(slot => {
          // Make sure practicalInfo exists and has all required fields
          if (!slot.practicalInfo) {
            slot.practicalInfo = {};
          }
          
          // Set default values for any missing fields
          const activityType = slot.title.toLowerCase();
          slot.practicalInfo.duration = slot.practicalInfo.duration || this.getDefaultDuration(activityType);
          slot.practicalInfo.cost = slot.practicalInfo.cost || this.getDefaultCost(activityType);
          slot.practicalInfo.bookingInfo = slot.practicalInfo.bookingInfo || this.getDefaultBooking(activityType);
          slot.practicalInfo.dressCode = slot.practicalInfo.dressCode || this.getDefaultDressCode(activityType);
          slot.practicalInfo.photography = slot.practicalInfo.photography || this.getDefaultPhotography(activityType);
          slot.practicalInfo.transport = slot.practicalInfo.transport || this.getDefaultTransport(slot.location);
          
          // Ensure tips and weather alternatives are set
          slot.tips = slot.tips || this.getDefaultTips(activityType);
          slot.weatherAlternatives = slot.weatherAlternatives || this.getDefaultWeatherAlternative(activityType);
        });
      });
      
      console.log('Final itinerary with practical info:', JSON.stringify(itinerary[0].timeSlots[0].practicalInfo, null, 2));
      
      return itinerary;
    } catch (error) {
      console.error('Error generating itinerary:', error);
      return this.createFallbackItinerary(preferences.duration, preferences.destination);
    }
  }

  createFallbackItinerary(duration, destination) {
    // Define varied activities for different days
    const defaultActivities = {
      'Agra': [
        // Day 1 - Classic Monuments
        [
          {
            time: '9:00 AM',
            title: 'Taj Mahal Sunrise Visit',
            description: 'Experience the breathtaking Taj Mahal during the magical sunrise hours. Best time for photos and peaceful exploration.',
            location: 'Taj Mahal',
            culturalContext: 'UNESCO World Heritage site, built by Emperor Shah Jahan as a testament of love.'
          },
          {
            time: '1:00 PM',
            title: 'Royal Mughlai Feast',
            description: 'Indulge in authentic Mughlai dining featuring royal recipes passed down through generations.',
            location: 'Pind Balluchi, Agra',
            culturalContext: 'Experience the royal cuisine of the Mughal era.'
          },
          {
            time: '3:00 PM',
            title: 'Agra Fort Heritage Tour',
            description: 'Explore this massive red sandstone fort complex with its palaces and audience halls.',
            location: 'Agra Fort',
            culturalContext: 'Former residence of Mughal emperors including Shah Jahan.'
          },
          {
            time: '7:00 PM',
            title: 'Mohabbat the Taj Show',
            description: 'Watch a spectacular cultural show depicting the love story behind the Taj Mahal.',
            location: 'Kalakriti Cultural Center',
            culturalContext: 'Theatrical representation of Mughal era culture and customs.'
          }
        ],
        // Day 2 - Local Culture
        [
          {
            time: '9:00 AM',
            title: 'Marble Crafts Workshop',
            description: 'Learn from local artisans about the intricate marble inlay work (pietra dura).',
            location: 'Agra Marble Workshop',
            culturalContext: 'Traditional craft techniques passed down through generations.'
          },
          {
            time: '1:00 PM',
            title: 'Street Food Tour',
            description: 'Explore Agra\'s famous street food, including petha and paratha.',
            location: 'Sadar Bazaar',
            culturalContext: 'Local culinary traditions and street food culture.'
          },
          {
            time: '3:00 PM',
            title: 'Mehtab Bagh Gardens',
            description: 'Visit the moonlight garden with perfect views of the Taj Mahal.',
            location: 'Mehtab Bagh',
            culturalContext: 'Mughal garden architecture and landscaping traditions.'
          },
          {
            time: '7:00 PM',
            title: 'Cooking Class',
            description: 'Learn to prepare traditional Mughlai dishes with a local family.',
            location: 'Local Home Kitchen',
            culturalContext: 'Home cooking traditions and family recipes.'
          }
        ],
        // Day 3 - Hidden Gems
        [
          {
            time: '9:00 AM',
            title: 'Fatehpur Sikri Tour',
            description: 'Explore the abandoned Mughal city and its architectural marvels.',
            location: 'Fatehpur Sikri',
            culturalContext: 'UNESCO site showcasing Mughal urban planning.'
          },
          {
            time: '1:00 PM',
            title: 'Village Lunch Experience',
            description: 'Enjoy a traditional lunch in a rural setting.',
            location: 'Kachhpura Village',
            culturalContext: 'Rural Indian lifestyle and agricultural traditions.'
          },
          {
            time: '3:00 PM',
            title: 'Tomb of Akbar Tour',
            description: 'Visit the magnificent tomb of Emperor Akbar the Great.',
            location: 'Sikandra',
            culturalContext: 'Mughal funerary architecture and history.'
          },
          {
            time: '7:00 PM',
            title: 'Yamuna Aarti Ceremony',
            description: 'Witness the evening prayer ceremony by the Yamuna River.',
            location: 'Yamuna Ghat',
            culturalContext: 'Hindu religious traditions and river worship.'
          }
        ]
      ],
      'default': [
        // Day 1 - Heritage
        [
          {
            time: '9:00 AM',
            title: 'Heritage Walking Tour',
            description: `Explore the cultural heritage of ${destination} with a guided walking tour.`,
            location: `${destination} Old City`,
            culturalContext: 'Historical significance and architectural heritage.'
          },
          {
            time: '1:00 PM',
            title: 'Traditional Lunch',
            description: 'Experience local flavors and culinary traditions.',
            location: `${destination} Heritage Restaurant`,
            culturalContext: 'Regional cuisine and dining customs.'
          },
          {
            time: '3:00 PM',
            title: 'Temple Visit',
            description: 'Explore ancient temples and religious sites.',
            location: `${destination} Main Temple`,
            culturalContext: 'Religious practices and architectural styles.'
          },
          {
            time: '7:00 PM',
            title: 'Cultural Performance',
            description: 'Watch traditional music and dance performances.',
            location: `${destination} Cultural Center`,
            culturalContext: 'Performing arts traditions.'
          }
        ],
        // Day 2 - Local Life
        [
          {
            time: '9:00 AM',
            title: 'Local Market Tour',
            description: 'Explore bustling local markets and bazaars.',
            location: `${destination} Market`,
            culturalContext: 'Trading traditions and local commerce.'
          },
          {
            time: '1:00 PM',
            title: 'Street Food Trail',
            description: 'Sample famous local street food specialties.',
            location: `${destination} Food Street`,
            culturalContext: 'Street food culture and culinary heritage.'
          },
          {
            time: '3:00 PM',
            title: 'Artisan Workshop',
            description: 'Meet local craftspeople and learn traditional skills.',
            location: `${destination} Craft Center`,
            culturalContext: 'Traditional crafts and artisanal skills.'
          },
          {
            time: '7:00 PM',
            title: 'Community Dinner',
            description: 'Share a meal with locals and learn about their lifestyle.',
            location: 'Local Community Center',
            culturalContext: 'Community traditions and social customs.'
          }
        ],
        // Day 3 - Nature and Spirituality
        [
          {
            time: '9:00 AM',
            title: 'Morning Meditation',
            description: 'Start the day with guided meditation or yoga.',
            location: `${destination} Spiritual Center`,
            culturalContext: 'Spiritual practices and wellness traditions.'
          },
          {
            time: '1:00 PM',
            title: 'Organic Farm Lunch',
            description: 'Visit a local organic farm and enjoy fresh cuisine.',
            location: 'Local Organic Farm',
            culturalContext: 'Agricultural traditions and sustainable practices.'
          },
          {
            time: '3:00 PM',
            title: 'Nature Walk',
            description: 'Explore local flora and natural heritage sites.',
            location: `${destination} Nature Park`,
            culturalContext: 'Environmental conservation and natural heritage.'
          },
          {
            time: '7:00 PM',
            title: 'Evening Ritual',
            description: 'Participate in traditional evening ceremonies.',
            location: `${destination} Sacred Site`,
            culturalContext: 'Religious ceremonies and rituals.'
          }
        ]
      ]
    };

    const activities = defaultActivities[destination] || defaultActivities.default;
    
    return Array.from({ length: duration }, (_, i) => ({
      day: i + 1,
      timeSlots: activities[i % activities.length].map(activity => ({
        ...activity,
        description: activity.description,
        tips: activity.tips || 'No specific tips available'
      }))
    }));
  }

  formatInterests(selectedInterestIds) {
    const interestMap = {
      'food': 'Culinary Arts and local cuisine',
      'history': 'Historical Sites and monuments',
      'arts': 'Traditional Arts, music and dance',
      'festivals': 'Festivals and cultural ceremonies',
      'crafts': 'Traditional Crafts and artisan workshops',
      'spiritual': 'Spiritual Experiences like temples and meditation'
    };

    return selectedInterestIds.map(id => interestMap[id] || id).join(', ');
  }

  buildItineraryPrompt(destination, interests, duration, language, travelStyle) {
    const travelStyleGuide = {
      'luxury': 'Focus on premium experiences, 5-star accommodations, private tours, and exclusive cultural performances',
      'budget': 'Include affordable yet authentic experiences, local transportation, and budget-friendly dining options',
      'adventure': 'Incorporate active experiences, off-the-beaten-path locations, and unique cultural encounters',
      'relaxed': 'Plan a balanced itinerary with leisure time, comfortable pacing, and easy-to-access locations'
    };

    const styleGuidance = travelStyleGuide[travelStyle.toLowerCase()] || 'Balance different types of experiences';

    return `Create a highly detailed ${duration}-day cultural journey in ${destination}, India, focusing on authentic experiences and specific locations. The itinerary should be in ${language} and follow a ${travelStyle} style (${styleGuidance}).

For each day, provide a comprehensive schedule with exact locations and timings:

Early Morning (6:00 AM - 8:00 AM):
- Consider sunrise activities, spiritual practices, or photography opportunities
- Include specific temple names, viewing points, or meditation centers

Morning (9:00 AM - 12:00 PM):
- Main cultural activities and sightseeing
- Exact monument names, historical sites, or workshop locations

Lunch (12:30 PM - 2:00 PM):
- Specific restaurant names and locations
- Local specialties to try
- Cultural significance of the cuisine

Afternoon (2:30 PM - 5:00 PM):
- Cultural activities, workshops, or interactive experiences
- Exact venues and local artisan details

Evening (5:30 PM - 7:30 PM):
- Cultural performances, ceremonies, or sunset activities
- Specific venue names and timing considerations

Dinner (8:00 PM - 9:30 PM):
- Restaurant recommendations with exact locations
- Special dining experiences or cultural shows

For each activity, provide:
1. Exact name and address of the location
2. GPS coordinates when available
3. Detailed cultural and historical background
4. Local customs and etiquette guidelines
5. Photography guidelines and best spots
6. Recommended duration
7. Contact information for venues/guides
8. Alternative options for different weather conditions
9. Accessibility information
10. Booking requirements and typical costs

Additional requirements:
1. Focus on these specific interests: ${interests}
2. Include both famous landmarks and hidden local gems
3. Incorporate authentic interactions with local communities
4. Consider seasonal festivals and events
5. Provide transportation details between locations
6. Include rest breaks and flexible time slots
7. Note prayer times and religious considerations
8. Suggest photo opportunities and best timing
9. Include backup plans for weather issues
10. Add local shopping recommendations

Cultural context for each activity should include:
- Historical significance
- Religious or spiritual importance
- Local traditions and customs
- Cultural dos and don'ts
- Language tips and common phrases
- Traditional arts and crafts involved
- Local legends and stories
- Seasonal considerations
- Community involvement
- Modern cultural significance

Please structure each activity in this format:

[Time] - [Activity Name] | [Exact Location with Address]
Description: Detailed explanation of the experience
Cultural Significance: Historical and cultural background
Practical Information:
- Duration: [Expected time needed]
- Cost: [Price range and what's included]
- Booking: [How to book/contact]
- Dress Code: [Specific requirements]
- Photography: [Rules and best spots]
- Transport: [How to reach]
Tips: [Special advice for the best experience]
Alternative Options: [Backup plans for weather/availability]

Maintain this detailed format for all ${duration} days, ensuring each activity authentically represents ${destination}'s cultural heritage while matching the traveler's interests and ${travelStyle} style preferences.`;
  }

  parseItineraryResponse(responseText, duration, destination) {
    try {
      const itinerary = [];
      
      // Ensure responseText is a string and not empty
      if (!responseText || typeof responseText !== 'string') {
        console.error('Invalid response text:', responseText);
        return this.createFallbackItinerary(duration, destination);
      }

      // Split by day markers and remove empty entries
      const days = responseText.split(/Day \d+:/g)
        .map(day => day?.trim())
        .filter(Boolean);
      
      // If no valid days found, return fallback
      if (days.length === 0) {
        console.warn('No valid days found in response');
        return this.createFallbackItinerary(duration, destination);
      }

      days.forEach((dayContent, dayIndex) => {
        const timeSlots = [];
        
        try {
          // Split by time markers, looking for both standard times and time ranges
          const timePattern = /(?:\d{1,2}:\d{2}\s*(?:AM|PM)|(?:Early Morning|Morning|Lunch|Afternoon|Evening|Dinner)\s*\(\d{1,2}:\d{2}\s*(?:AM|PM)\s*-\s*\d{1,2}:\d{2}\s*(?:AM|PM)\))/i;
          
          // First, find all time markers
          const timeMatches = dayContent.match(new RegExp(timePattern, 'g')) || [];
          
          // Then split content by these markers
          let activities = [];
          let lastIndex = 0;
          
          timeMatches.forEach(match => {
            const index = dayContent.indexOf(match, lastIndex);
            if (index > lastIndex) {
              activities.push(dayContent.slice(lastIndex, index));
            }
            lastIndex = index + match.length;
          });
          
          // Add the remaining content after the last time marker
          if (lastIndex < dayContent.length) {
            activities.push(dayContent.slice(lastIndex));
          }
          
          // Filter and process activities
          activities = activities
            .map(activity => activity?.trim())
            .filter(Boolean);

          activities.forEach((activity, index) => {
            try {
              // Initialize activity data structure with defaults
              let activityData = {
                time: '',
                title: 'Cultural Experience',
                description: `Explore ${destination}`,
                location: destination,
                culturalContext: 'Experience local traditions and customs',
                practicalInfo: {},
                tips: '',
                weatherAlternatives: ''
              };

              // Clean up any markdown-style formatting that might be causing display issues
              activity = activity
                .replace(/\*\*/g, '') // Remove markdown bold
                .replace(/\n+/g, '\n') // Normalize newlines
                .trim();

              // Extract activity title and location more precisely
              const titleMatch = activity.match(/Activity:?\s*(.*?)(?=\s*-\s*Location|\s*-\s*\*\*Location|\n|$)/i);
              if (titleMatch && titleMatch[1]) {
                activityData.title = titleMatch[1].replace(/^\*+|\*+$|`/g, '').trim();
              }

              const locationMatch = activity.match(/Location:?\s*(.*?)(?=\s*-\s*Description|\s*-\s*\*\*Description|\n|$)/i);
              if (locationMatch && locationMatch[1]) {
                activityData.location = locationMatch[1].replace(/^\*+|\*+$|`/g, '').trim();
              }

              // Better extraction for description that handles various formats
              const descMatch = activity.match(/Description:?\s*(.*?)(?=\s*-\s*Cultural|Cultural Significance:|\s*-\s*\*\*Cultural|\n\s*Cultural|\n\s*Practical|\n\s*Tips:)/is);
              if (descMatch && descMatch[1]) {
                activityData.description = descMatch[1].replace(/^\*+|\*+$|`/g, '').trim();
              }

              // Enhanced cultural context extraction
              const culturalMatch = activity.match(/Cultural Significance:?\s*(.*?)(?=\s*-\s*Practical|\s*-\s*\*\*Practical|\n\s*Practical|\n\s*Tips:)/is);
              if (culturalMatch && culturalMatch[1]) {
                activityData.culturalContext = culturalMatch[1].replace(/^\*+|\*+$|`/g, '').trim();
              }

              // Extract all practical information more robustly
              const practicalInfo = {};
              
              // Check for both "Practical Info" and "Practical Information" variations
              const practicalPattern = /Practical Info(?:rmation)?:([^]*?)(?=\n\s*(?:Tips:|Alternative|$))/is;
              const practicalSection = activity.match(practicalPattern);
              
              if (practicalSection && practicalSection[1]) {
                const infoText = practicalSection[1].trim();
                
                // Duration
                const durationMatch = infoText.match(/Duration:?\s*(.*?)(?=\n|Cost:|$)/is);
                if (durationMatch && durationMatch[1]) {
                  practicalInfo.duration = durationMatch[1].replace(/^\*+|\*+$|-/g, '').trim();
                }
                
                // Cost
                const costMatch = infoText.match(/Cost:?\s*(.*?)(?=\n|Booking:|Dress Code:|$)/is);
                if (costMatch && costMatch[1]) {
                  practicalInfo.cost = costMatch[1].replace(/^\*+|\*+$|-/g, '').trim();
                }
                
                // Booking Info
                const bookingMatch = infoText.match(/Booking:?\s*(.*?)(?=\n|Dress Code:|Photography:|$)/is);
                if (bookingMatch && bookingMatch[1]) {
                  practicalInfo.bookingInfo = bookingMatch[1].replace(/^\*+|\*+$|-/g, '').trim();
                }
                
                // Dress Code
                const dressMatch = infoText.match(/Dress Code:?\s*(.*?)(?=\n|Photography:|Transport:|$)/is);
                if (dressMatch && dressMatch[1]) {
                  practicalInfo.dressCode = dressMatch[1].replace(/^\*+|\*+$|-/g, '').trim();
                }
                
                // Photography
                const photoMatch = infoText.match(/Photography:?\s*(.*?)(?=\n|Transport:|$)/is);
                if (photoMatch && photoMatch[1]) {
                  practicalInfo.photography = photoMatch[1].replace(/^\*+|\*+$|-/g, '').trim();
                }
                
                // Transport
                const transportMatch = infoText.match(/Transport(?:ation)?:?\s*(.*?)(?=\n|$)/is);
                if (transportMatch && transportMatch[1]) {
                  practicalInfo.transport = transportMatch[1].replace(/^\*+|\*+$|-/g, '').trim();
                }
              }

              // Set default values for missing practical info
              const activityType = activityData.title.toLowerCase();
              activityData.practicalInfo = {
                duration: practicalInfo.duration || this.getDefaultDuration(activityType),
                cost: practicalInfo.cost || this.getDefaultCost(activityType),
                bookingInfo: practicalInfo.bookingInfo || this.getDefaultBooking(activityType),
                dressCode: practicalInfo.dressCode || this.getDefaultDressCode(activityType),
                photography: practicalInfo.photography || this.getDefaultPhotography(activityType),
                transport: practicalInfo.transport || this.getDefaultTransport(activityData.location)
              };

              // Extract tips
              const tipsMatch = activity.match(/Tips:?\s*(.*?)(?=\n\s*Alternative|\n\s*Weather|$)/is);
              if (tipsMatch && tipsMatch[1]) {
                activityData.tips = tipsMatch[1].replace(/^\*+|\*+$|`/g, '').trim();
              } else {
                activityData.tips = this.getDefaultTips(activityType);
              }

              // Extract weather alternatives
              const weatherMatch = activity.match(/(?:Alternative Options|Weather Alternatives|Backup Plans):?\s*(.*?)(?=\n\s*$|$)/is);
              if (weatherMatch && weatherMatch[1]) {
                activityData.weatherAlternatives = weatherMatch[1].replace(/^\*+|\*+$|`/g, '').trim();
              } else {
                activityData.weatherAlternatives = this.getDefaultWeatherAlternative(activityType);
              }

              // Determine time
              if (timeMatches.length > index) {
                const timeText = timeMatches[index];
                if (timeText.match(/\d{1,2}:\d{2}\s*(?:AM|PM)/i)) {
                  activityData.time = timeText.match(/\d{1,2}:\d{2}\s*(?:AM|PM)/i)[0];
                } else {
                  // Extract time from time ranges like "Morning (9:00 AM - 11:00 AM)"
                  const rangeMatch = timeText.match(/\((\d{1,2}:\d{2}\s*(?:AM|PM))/i);
                  if (rangeMatch) {
                    activityData.time = rangeMatch[1];
                  } else {
                    // Default times based on part of day
                    const defaultTimes = {
                      'early morning': '6:00 AM',
                      'morning': '9:00 AM',
                      'lunch': '12:30 PM',
                      'afternoon': '2:30 PM',
                      'evening': '5:30 PM',
                      'dinner': '8:00 PM'
                    };
                    
                    const timeKey = Object.keys(defaultTimes).find(key => 
                      timeText.toLowerCase().includes(key)
                    );
                    
                    activityData.time = timeKey ? defaultTimes[timeKey] : this.getDefaultTimeForIndex(index);
                  }
                }
              } else {
                activityData.time = this.getDefaultTimeForIndex(index);
              }

              timeSlots.push(activityData);
            } catch (activityError) {
              console.error('Error processing activity:', activityError);
              // Add a basic fallback activity
              timeSlots.push({
                time: this.getDefaultTimeForIndex(index),
                title: `Cultural Experience in ${destination}`,
                description: `Explore the cultural heritage of ${destination}`,
                location: destination,
                culturalContext: 'Experience local traditions and customs',
                practicalInfo: {
                  duration: '2 hours',
                  cost: 'Varies',
                  bookingInfo: 'Not required',
                  dressCode: 'Casual, respectful attire',
                  photography: 'Allowed in most areas',
                  transport: 'Local transport available'
                },
                tips: 'Engage with locals for an authentic experience',
                weatherAlternatives: 'Indoor cultural activities available'
              });
            }
          });

          // Sort time slots by time
          timeSlots.sort((a, b) => {
            const timeA = new Date(`2000/01/01 ${a.time}`);
            const timeB = new Date(`2000/01/01 ${b.time}`);
            return timeA - timeB;
          });
        } catch (dayError) {
          console.error('Error processing day:', dayError);
          // Use fallback activities for this day
          const fallbackDay = this.createFallbackItinerary(1, destination)[0];
          timeSlots.push(...fallbackDay.timeSlots);
        }

        // Ensure we have at least some activities for the day
        if (timeSlots.length === 0) {
          const fallbackDay = this.createFallbackItinerary(1, destination)[0];
          timeSlots.push(...fallbackDay.timeSlots);
        }

        itinerary.push({
          day: dayIndex + 1,
          timeSlots
        });
      });

      // If parsing failed or not enough days, fill with default structure
      while (itinerary.length < duration) {
        const defaultDay = this.createFallbackItinerary(1, destination)[0];
        defaultDay.day = itinerary.length + 1;
        itinerary.push(defaultDay);
      }

      return itinerary;
    } catch (error) {
      console.error('Error parsing itinerary:', error);
      return this.createFallbackItinerary(duration, destination);
    }
  }
  
  formatTimeIndicator(timeIndicator) {
    // Standardize common time formats
    timeIndicator = timeIndicator.trim();
    
    const timeMap = {
      'Morning': '9:00 AM',
      'Afternoon': '3:00 PM',
      'Evening': '7:00 PM',
      'Lunch': '1:00 PM',
      'Dinner': '7:00 PM'
    };
    
    if (timeMap[timeIndicator]) {
      return timeMap[timeIndicator];
    }
    
    // Try to format numerical times
    if (/\d/.test(timeIndicator)) {
      // Extract hours and am/pm
      const match = timeIndicator.match(/(\d{1,2})(?::(\d{2}))?(?:\s*(AM|PM))?/i);
      if (match) {
        let hours = parseInt(match[1]);
        const minutes = match[2] ? match[2] : '00';
        let period = match[3] ? match[3].toUpperCase() : '';
        
        // Determine AM/PM if not specified
        if (!period) {
          if (hours < 12) {
            period = 'AM';
          } else {
            period = 'PM';
          }
        }
        
        return `${hours}:${minutes} ${period}`;
      }
    }
    
    // Default fallback
    return timeIndicator;
  }

  // Helper methods for generating context-aware defaults
  getDefaultDuration(activityType) {
    if (activityType.includes('temple') || activityType.includes('shrine')) {
      return '1-2 hours recommended';
    } else if (activityType.includes('museum') || activityType.includes('gallery')) {
      return '2-3 hours recommended';
    } else if (activityType.includes('workshop') || activityType.includes('class')) {
      return '3-4 hours including instruction';
    } else if (activityType.includes('tour')) {
      return '4-5 hours with breaks';
    }
    return '2-3 hours recommended';
  }

  getDefaultCost(activityType) {
    if (activityType.includes('temple') || activityType.includes('shrine')) {
      return 'Free entry (donations appreciated)';
    } else if (activityType.includes('museum')) {
      return 'INR 200-500 per person';
    } else if (activityType.includes('workshop')) {
      return 'INR 1000-2000 per person, includes materials';
    }
    return 'Varies by activity/season, please check at location';
  }

  getDefaultBooking(activityType) {
    if (activityType.includes('temple')) {
      return 'No booking required';
    } else if (activityType.includes('workshop') || activityType.includes('class')) {
      return 'Advance booking required, contact venue 24 hours prior';
    } else if (activityType.includes('tour')) {
      return 'Book through hotel desk or local tour operator';
    }
    return 'Check venue for current booking requirements';
  }

  getDefaultDressCode(activityType) {
    if (activityType.includes('temple') || activityType.includes('shrine')) {
      return 'Modest attire required: covered shoulders and knees, remove shoes';
    } else if (activityType.includes('workshop')) {
      return 'Comfortable clothing suitable for activities';
    } else if (activityType.includes('restaurant')) {
      return 'Smart casual attire recommended';
    }
    return 'Weather-appropriate, modest clothing recommended';
  }

  getDefaultPhotography(activityType) {
    if (activityType.includes('temple')) {
      return 'Permitted in outer areas, restricted in main shrine';
    } else if (activityType.includes('museum')) {
      return 'No flash photography, check specific gallery rules';
    } else if (activityType.includes('performance')) {
      return 'Photography allowed before and after performance only';
    }
    return 'Generally permitted, please check local guidelines';
  }

  getDefaultTransport(location) {
    return `Available by auto-rickshaw or taxi from city center to ${location}`;
  }

  getDefaultTips(activityType) {
    if (activityType.includes('temple')) {
      return 'Visit during morning prayers for the best experience, bring socks for temple entry';
    } else if (activityType.includes('market')) {
      return 'Best in morning hours, carry cash, bargaining expected';
    } else if (activityType.includes('food')) {
      return 'Try local specialties, carry water, ask about spice levels';
    }
    return 'Respect local customs, carry water, wear comfortable footwear';
  }

  getDefaultWeatherAlternative(activityType) {
    if (activityType.includes('outdoor') || activityType.includes('garden')) {
      return 'Indoor cultural center or museum visit available nearby';
    } else if (activityType.includes('temple')) {
      return 'Covered areas available for prayers and meditation';
    }
    return 'Alternative indoor activities can be arranged';
  }

  // Helper function to get default time based on activity index
  getDefaultTimeForIndex(index) {
    const defaultTimes = ['9:00 AM', '11:00 AM', '12:30 PM', '2:30 PM', '5:00 PM', '8:00 PM'];
    return defaultTimes[index % defaultTimes.length];
  }
}

export const itineraryService = new ItineraryService(); 