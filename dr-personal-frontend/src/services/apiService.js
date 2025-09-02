const apiService = {
  generatePartialPrescription: async (profileData) => {
    try {
      console.log('Sending data to API:', profileData);
      
      const response = await fetch('/api/prescription/generate-partial-prescription', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          profile: {
            id: profileData.profile.id,
            gender: profileData.profile.gender.toLowerCase(),
            birth_date: profileData.profile.birth_date,
            weekly_frequency: Number(profileData.profile.weekly_frequency),
            session_time: Number(profileData.profile.session_time),
            uninterrupted_training_time: Number(profileData.profile.uninterrupted_training_time),
            detraining: Number(profileData.profile.detraining),
            previous_experience: Number(profileData.profile.previous_experience),
            technique: profileData.profile.technique.toLowerCase(),
            strength_values: {
              bench_press: Number(profileData.profile.strength_values.bench_press),
              lat_pulldown: Number(profileData.profile.strength_values.lat_pulldown),
              squat: Number(profileData.profile.strength_values.squat),
              deadlift: Number(profileData.profile.strength_values.deadlift),
              handgrip_dynamometer: Number(profileData.profile.strength_values.handgrip_dynamometer)
            },
            health_conditions: profileData.profile.health_conditions
          }
        })
      });

      if (!response.ok) {
        let errorDetail = '';
        try {
          const errorBody = await response.text();
          console.error('API Error Response:', errorBody);
          errorDetail = errorBody ? ` - ${errorBody}` : '';
        } catch (e) {
          // Ignore error parsing response body
        }
        throw new Error(`HTTP error! status: ${response.status}${errorDetail}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error calling generatePartialPrescription API:', error);
      throw error;
    }
  },

  generateFullPrescription: async (request) => {
    try {
      const response = await fetch('/api/prescription/generate-prescription', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          user_id: request.user_id,
          training_method: request.training_method,
          division_type: request.division_type,
          sequency_type: request.sequency_type,
          periodization_type: request.periodization_type,
          mesocycle_duration: request.mesocycle_duration
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error calling generateFullPrescription API:', error);
      throw error;
    }
  },

  syncMuscleGroups: async (data) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return { 
      inserted_muscles: Array.isArray(data) ? data.length : 10,
      deleted_muscles: 5
    };
  }
};

export default apiService;