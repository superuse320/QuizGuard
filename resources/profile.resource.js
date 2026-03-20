const ProfileResource = {

  
    single(profile) {
      if (!profile) return null
      return {
        id:         profile.id,
        name:       profile.name,
        role:       profile.role,
      }
    },
    collection(profiles) {
      if (!profiles) return []
      return profiles.map(p => ProfileResource.single(p))
    }
  
  }
  
  module.exports = ProfileResource